// tracker responsibilities. Loaded as a classic browser script before app.js.
function renderTimeline() {
  elements.timelineSteps.innerHTML = agentSteps
    .map(([title, copy], index) => {
      return `
        <div class="timeline-step">
          <span class="step-index">${index + 1}</span>
          <div>
            <strong>${title}</strong>
            <p class="muted">${copy}</p>
          </div>
          <span class="stage-pill">${index < 2 ? "automated" : "reviewed"}</span>
        </div>
      `;
    })
    .join("");
}

function renderMetrics() {
  const active = jobs.filter((job) => job.status !== "pass");
  const ready = jobs.filter((job) => job.status === "ready");
  const applied = jobs.filter((job) => job.stage === "applied" || job.stage === "interview");
  const best = jobs.reduce((max, job) => Math.max(max, job.score), 0);
  const signals = profileSignals();
  const activeSources = sources.filter((source) => source.enabled);
  const profileConfigured = Boolean(
    profile.resumeText ||
      profile.skills ||
      profile.targetTitles ||
      signals.desiredKeywords.length ||
      signals.requiredKeywords.length ||
      signals.preferredIndustries.length ||
      signals.excludedKeywords.length ||
      signals.excludedCompanies.length ||
      signals.excludedLocations.length ||
      signals.excludedIndustries.length
  );

  document.getElementById("navActiveCount").textContent = active.length;
  document.getElementById("navScanCount").textContent = activeSources.length;
  document.getElementById("navRatedCount").textContent = jobs.length;
  document.getElementById("navApplyCount").textContent = ready.length;
  document.getElementById("navTrackerCount").textContent = jobs.length;
  document.getElementById("navProfileCount").textContent = profileConfigured ? "1" : "0";
  document.getElementById("navSourceCount").textContent = activeSources.length;
  document.getElementById("metricScanned").textContent = jobs.length;
  document.getElementById("metricReady").textContent = ready.length;
  document.getElementById("metricApplied").textContent = applied.length;
  document.getElementById("bestScore").textContent = best ? best : "--";
  document.getElementById("resumeWordCount").textContent = signals.resumeWords;
  document.getElementById("profileSkillCount").textContent = signals.skills.length;
  document.getElementById("profileTitleCount").textContent = signals.titles.length;

  const next = ready[0] || active[0] || jobs[0];
  document.getElementById("nextActionTitle").textContent = next ? `${next.company}: ${next.title}` : "Build your first lead";
  document.getElementById("nextActionCopy").textContent = next
    ? next.reason
    : "Add your profile, tune sources, then let the agent rank and draft your pipeline.";
  document.getElementById("agentMode").textContent = ready.length ? "Ready to apply" : jobs.length ? "Triage in progress" : "Ready to triage";
  document.getElementById("agentSummary").textContent = ready.length
    ? `${ready.length} role${ready.length === 1 ? "" : "s"} are ready for a personalized application pack.`
    : profile.resumeText
      ? "Resume loaded. Scans and drafts will use the saved profile."
      : "Add a resume and profile so the agent can personalize your search.";
}

function renderTracker() {
  elements.trackerBoard.innerHTML = "";
  stages.forEach(([stageKey, label]) => {
    const column = document.createElement("section");
    column.className = "kanban-column";
    column.innerHTML = `<h4>${label}</h4>`;
    const stageJobs = jobs.filter((job) => job.stage === stageKey);
    if (!stageJobs.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No roles";
      column.append(empty);
    }
    stageJobs.forEach((job) => {
      const mini = document.createElement("div");
      mini.className = "mini-card";
      const title = document.createElement("strong");
      title.textContent = job.title;
      const meta = document.createElement("span");
      meta.textContent = `${job.company} - ${job.score}/100`;
      mini.append(title, meta);
      const nextStage = stages[stages.findIndex(([key]) => key === stageKey) + 1];
      if (nextStage) {
        mini.append(actionButton(`Move to ${nextStage[1]}`, () => updateJob(job.id, { stage: nextStage[0] })));
      }
      column.append(mini);
    });
    elements.trackerBoard.append(column);
  });
}
