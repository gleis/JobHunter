// applier responsibilities. Loaded as a classic browser script before app.js.
function renderApplyJobs() {
  const readyJobs = jobs.filter((job) => job.status === "ready" || job.stage === "ready");
  elements.applyJobs.innerHTML = "";
  if (!readyJobs.length) {
    elements.applyJobs.innerHTML = '<div class="empty-state">No application-ready roles yet. Rate a strong role first.</div>';
    renderDraft(null);
    return;
  }
  readyJobs.forEach((job) => {
    const card = createJobCard(job, [
      actionButton("View draft", () => {
        renderDraft(job);
        preparePackWithAgent(job);
      }, "primary-button"),
      actionButton("Mark applied", () => updateJob(job.id, { stage: "applied" })),
      actionButton("Remove", () => deleteJob(job.id), "danger-button")
    ]);
    elements.applyJobs.append(card);
  });

  const selected = readyJobs.find((job) => job.id === selectedDraftJobId) || readyJobs[0];
  renderDraft(selected);
}

function renderDraft(job) {
  if (!job) {
    elements.draftTitle.textContent = "Pick a ready role";
    elements.draftContent.textContent = "The agent will assemble a cover note, resume keywords, recruiter message, and interview prep checklist from the saved profile.";
    return;
  }
  selectedDraftJobId = job.id;
  elements.draftTitle.textContent = `${job.company}: ${job.title}`;
  elements.draftContent.textContent = job.agentDraft || buildApplicationPack(job);
}

async function preparePackWithAgent(job) {
  saveAgentConfigFromForm();
  selectedDraftJobId = job.id;
  elements.draftTitle.textContent = `${job.company}: ${job.title}`;
  elements.draftContent.textContent = "Asking the orchestrator to prepare an application pack...";
  setAgentStatus(`Preparing an AI application pack for ${job.company}.`, "neutral");
  try {
    const result = await apiPost("/api/agent/draft", {
      config: currentAgentConfig(),
      profile,
      job
    });
    jobs = jobs.map((item) => (item.id === job.id ? {
      ...item,
      agentDraft: result.pack,
      agentProvider: result.provider,
      agentModel: result.model
    } : item));
    saveJobs();
    const updated = jobs.find((item) => item.id === job.id);
    renderDraft(updated);
    setAgentStatus(`Application pack prepared using ${result.provider} / ${result.model}.`, "success");
  } catch (error) {
    elements.draftContent.textContent = buildApplicationPack(job);
    setAgentStatus(`AI draft fell back to the local template: ${error.message}`, "error");
  }
}

function buildApplicationPack(job) {
  const signals = profileSignals();
  const matchedSkills = countTermMatches(job.description, signals.skills).slice(0, 8);
  const candidate = profile.name || "Candidate";
  const contact = profile.email ? `\nContact: ${profile.email}` : "";
  const auth = profile.workAuth ? `\nWork authorization: ${profile.workAuth}` : "";
  const positioning = profile.summary || "Use the saved resume to emphasize practical product engineering, automation, and reliable delivery.";

  return `APPLICATION PACK

Candidate: ${candidate}${contact}${auth}
Role: ${job.title}
Company: ${job.company}
Score: ${job.score}/100
Source: ${job.url || "Manual intake"}
Found via: ${job.sourceName || "Manual intake"}

Profile positioning
${positioning}

CV / resume keywords
- Prioritize: ${matchedSkills.join(", ") || job.tags.join(", ")}
- Target titles: ${signals.titles.join(", ") || "Not set"}
- Desired keywords: ${signals.desiredKeywords.join(", ") || "Not set"}
- Required keywords: ${signals.requiredKeywords.join(", ") || "Not set"}
- Location preference: ${profile.location || "Not set"}
- Compensation target: ${profile.compTarget || "Not set"}
- Exclusions honored: ${uniqueTerms([...signals.excludedKeywords, ...signals.excludedCompanies, ...signals.excludedLocations, ...signals.excludedIndustries]).join(", ") || "None"}

Cover note
Hi ${job.company} team,

I am interested in the ${job.title} role because it lines up with my saved search profile and resume signals around ${matchedSkills.slice(0, 3).join(", ") || job.tags.slice(0, 3).join(", ")}. ${positioning}

I would be excited to talk about how I can help the team ship practical, reliable product experiences with strong human review loops.

Recruiter message
I found the ${job.title} opening via ${job.sourceName || "my job search tracker"} and it looks aligned with my background. My strongest overlaps are ${matchedSkills.join(", ") || job.tags.join(", ")}. Happy to share targeted examples and a tailored resume.

Application checklist
- Review the resume keywords above before submitting.
- Confirm the source URL and current role availability.
- Tailor the first resume summary bullet to ${job.company}.
- Keep human approval before any final submission.

Interview prep
- Why this company, why now?
- Walk through one project that proves ${matchedSkills[0] || "the core role fit"}.
- Explain how you evaluate AI or automation output before users see it.
- Prepare one story about moving quickly without losing polish.
`;
}
