// rater responsibilities. Loaded as a classic browser script before app.js.
function evaluateJob(input) {
  const signals = profileSignals();
  const filterState = profileFilterState(input, signals);
  if (filterState.blockedTerms.length) {
    return {
      score: 12,
      status: "pass",
      stage: "review",
      tags: ["excluded", ...filterState.blockedTerms.slice(0, 3)],
      reason: `Filtered out because it matched excluded search preferences: ${filterState.blockedTerms.join(", ")}. Update Profile exclusions if this should be allowed.`
    };
  }
  if (filterState.missingRequired.length) {
    return {
      score: 28,
      status: "pass",
      stage: "review",
      tags: ["missing required", ...filterState.missingRequired.slice(0, 3)],
      reason: `Filtered out because it is missing required search terms: ${filterState.missingRequired.join(", ")}. Loosen Required keywords in Profile if this is too strict.`
    };
  }
  if (filterState.remoteMismatch) {
    return {
      score: 18,
      status: "pass",
      stage: "review",
      tags: ["remote only"],
      reason: "Filtered out because Remote only is enabled and this role does not show a remote-work signal."
    };
  }
  if (filterState.regionMismatch) {
    return {
      score: 18,
      status: "pass",
      stage: "review",
      tags: ["region mismatch"],
      reason: "Filtered out because the role appears restricted to a non-US region while your profile indicates US work authorization."
    };
  }
  if (filterState.intentMismatch) {
    return {
      score: 22,
      status: "pass",
      stage: "review",
      tags: ["outside profile"],
      reason: "Filtered out because it does not match your target titles, desired keywords, or profile intent closely enough."
    };
  }

  const text = jobSearchText(input).toLowerCase();
  const titleText = normalizeText(input.title || "").toLowerCase();
  const roleEvidence = roleFitEvidence(input, signals);
  const weights = [
    [["ai", "agent", "llm", "automation"], 6, "AI keyword"],
    [["remote", "hybrid", "chicago"], 6, "location workable"],
    [["senior", "lead", "ownership"], 4, "seniority match"],
    [["developer tools", "internal tools", "infrastructure", "platform", "linux", "cloud", "python", "bash"], 12, "builder keyword"],
    [["workflow", "automation", "integration", "onboarding"], 8, "keyword match"]
  ];

  const matched = [];
  let score = 30;
  if (roleEvidence.reasons.length) {
    score += 30;
    matched.push(...roleEvidence.reasons);
  }
  weights.forEach(([terms, points, label]) => {
    if (terms.some((term) => text.includes(term))) {
      score += points;
      matched.push(label);
    }
  });

  const titleMatches = countTermMatches(titleText, signals.titles);
  const skillMatches = countTermMatches(input.description || "", signals.skills);
  const locationMatches = countTermMatches(input.location || "", signals.locations);
  const resumeMatches = countTermMatches(input.description || "", signals.resumeTerms);
  const desiredMatches = countTermMatches(text, signals.desiredKeywords);
  const requiredMatches = countTermMatches(text, signals.requiredKeywords);
  const industryMatches = countTermMatches(text, signals.preferredIndustries);

  if (titleMatches.length) {
    score += Math.min(28, titleMatches.length * 14);
    matched.push("target title");
  }
  if (locationMatches.length) {
    score += 7;
    matched.push("preferred location");
  }
  if (desiredMatches.length) {
    score += Math.min(24, desiredMatches.length * 6);
    matched.push("desired keyword");
  }
  if (requiredMatches.length) {
    score += Math.min(20, requiredMatches.length * 10);
    matched.push("required keyword");
  }
  if (industryMatches.length) {
    score += Math.min(14, industryMatches.length * 7);
    matched.push("preferred domain");
  }
  if (skillMatches.length) {
    score += Math.min(4, skillMatches.length);
    matched.push("supporting skill");
  }
  if (resumeMatches.length) {
    score += Math.min(4, resumeMatches.length);
    matched.push("resume support");
  }
  if (input.comp && profile.compTarget && /\$/.test(input.comp)) score += 4;

  score = Math.max(18, Math.min(98, score));
  const status = score >= 78 ? "ready" : score >= 60 ? "watch" : "pass";
  const stage = status === "ready" ? "ready" : "review";

  return {
    score,
    status,
    stage,
    tags: matched.length ? [...new Set(matched)] : ["needs research"],
    reason: buildReason(score, status, matched, skillMatches, titleMatches)
  };
}

function buildReason(score, status, matched, skillMatches = [], titleMatches = []) {
  const evidence = [...new Set(matched.filter((tag) => !["resume support", "supporting skill"].includes(tag)))].slice(0, 3).join(", ");
  if (status === "ready") {
    return `Strong fit at ${score}/100. Prioritize this role because it matches ${evidence || "your target keywords"}; resume overlap is treated as supporting evidence, not a requirement.`;
  }
  if (status === "watch") {
    return `Medium fit at ${score}/100. Keep it warm if the role keywords are right, then verify the career-change story before drafting.`;
  }
  return `Low current fit at ${score}/100. The agent recommends passing unless the role keywords are strategically important or the profile should be widened.`;
}

function isScannedFit(input) {
  return evaluateJob(input).status !== "pass";
}

function renderRatedJobs() {
  const visibleJobs = getVisibleRatedJobs();

  elements.ratedJobs.innerHTML = "";
  if (!visibleJobs.length) {
    elements.ratedJobs.innerHTML = '<div class="empty-state">No rated jobs match this filter yet.</div>';
    renderJobDetail(null);
    return;
  }

  if (!visibleJobs.some((job) => job.id === selectedDetailJobId)) {
    selectedDetailJobId = visibleJobs[0].id;
  }

  visibleJobs.forEach((job) => {
    const card = createJobCard(job, [
      actionButton("More like this", (event) => findMoreLikeJob(job, event.currentTarget)),
      actionButton("Prepare pack", () => {
        selectedDraftJobId = job.id;
        job.stage = "ready";
        saveJobs();
        renderAll();
        setView("applier");
        preparePackWithAgent(job);
      }, "primary-button"),
      actionButton("Pass", () => updateJob(job.id, { status: "pass", stage: "review" })),
      actionButton("Remove", () => deleteJob(job.id), "danger-button")
    ], {
      selectable: true,
      active: selectedDetailJobId === job.id,
      onSelect: selectJobDetail
    });
    elements.ratedJobs.append(card);
  });

  renderJobDetail(jobs.find((job) => job.id === selectedDetailJobId) || visibleJobs[0]);
}

function getVisibleRatedJobs() {
  const filter = elements.ratingFilter.value;
  return jobs
    .filter((job) => filter === "all" || job.status === filter)
    .sort((a, b) => b.score - a.score);
}
