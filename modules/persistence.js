// persistence responsibilities. Loaded as a classic browser script before app.js.
function loadList(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) return [...fallback];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...fallback];
  } catch {
    return [...fallback];
  }
}

function loadObject(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) return { ...fallback };
  try {
    return { ...fallback, ...JSON.parse(stored) };
  } catch {
    return { ...fallback };
  }
}

function saveJobs() {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  scheduleStateSync();
}

function saveAgentConfig() {
  localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(agentConfig));
  scheduleStateSync();
}

function saveSources() {
  localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
  scheduleStateSync();
}

function saveDeletedSourceIds() {
  localStorage.setItem(SOURCE_DELETIONS_KEY, JSON.stringify(deletedSourceIds));
  scheduleStateSync();
}

function statePayload() {
  return {
    profile,
    jobs,
    sources,
    deletedSourceIds,
    agentConfig
  };
}

function scheduleStateSync() {
  clearTimeout(stateSyncTimer);
  stateSyncTimer = setTimeout(syncStateToServer, 350);
}

async function syncStateToServer() {
  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: statePayload() })
    });
  } catch {
    // UI-only mode still works when served without the orchestrator.
  }
}

async function hydrateStateFromServer() {
  if (isDemoScreenshotMode()) return;
  try {
    const response = await fetch("/api/state");
    if (!response.ok) return;
    const data = await response.json();
    const state = data.state || {};

    if (!localStorage.getItem(PROFILE_KEY) && state.profile) {
      profile = { ...defaultProfile, ...state.profile };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    if (!localStorage.getItem(AGENT_CONFIG_KEY) && state.agentConfig) {
      agentConfig = { ...defaultAgentConfig, ...state.agentConfig };
      localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(agentConfig));
    }
    if (!jobs.length && Array.isArray(state.jobs) && state.jobs.length) {
      jobs = state.jobs;
      selectedDetailJobId = jobs[0]?.id || null;
      localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    }
    if (!localStorage.getItem(SOURCE_DELETIONS_KEY) && Array.isArray(state.deletedSourceIds)) {
      deletedSourceIds = state.deletedSourceIds;
      localStorage.setItem(SOURCE_DELETIONS_KEY, JSON.stringify(deletedSourceIds));
    }
    if (!localStorage.getItem(SOURCES_KEY) && Array.isArray(state.sources) && state.sources.length) {
      sources = filterAllowedSources(state.sources);
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
    }

    renderAgentConfig();
    renderAll();
  } catch {
    // Ignore when running as static files.
  }
}
