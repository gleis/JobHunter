// scanner responsibilities. Loaded as a classic browser script before app.js.
function sourceScopeQuery(source = {}) {
  const query = normalizeText(source.query || "");
  const scopedOperators = query.match(/\b(?:site|url|intitle|inurl):[^\s)]+/gi) || [];
  if (scopedOperators.length) return uniqueTerms(scopedOperators).join(" ");
  if (source.type === "Company" && source.name) return `${source.name} careers`;
  return "";
}

function sourceDefaultQuery(source = {}, signals = profileSignals()) {
  const profileQuery = profileDefaultQuery(signals);
  const fallbackQuery = normalizeText(source.query || source.name || "jobs");
  if (!profileQuery) return fallbackQuery;

  const scope = sourceScopeQuery(source);
  return uniqueTerms([scope, profileQuery]).join(" ");
}

function buildSimilarJobQuery(job = {}) {
  const signals = profileSignals();
  const searchText = jobSearchText(job);
  const matchedProfileTerms = uniqueTerms([
    ...signals.titles,
    ...signals.requiredKeywords,
    ...signals.desiredKeywords,
    ...signals.preferredIndustries,
    ...signals.skills
  ]).filter((term) => searchText.toLowerCase().includes(term.toLowerCase()));
  const roleTitle = cleanJobTitleForSearch(job.title) || normalizeText(job.title);
  const tagTerms = (job.tags || [])
    .filter((tag) => !["pass", "watch", "ready", "resume gap", "needs research", "remote only"].includes(String(tag).toLowerCase()))
    .slice(0, 3);

  return uniqueTerms([
    roleTitle,
    ...matchedProfileTerms.slice(0, 6),
    ...tagTerms,
    signals.remoteOnly ? "remote" : ""
  ]).join(" ");
}

function buildSimilarSourceSearches(job) {
  const similarQuery = buildSimilarJobQuery(job);
  const searchText = jobSearchText(job);
  const matchedProfileTerms = uniqueTerms([
    ...profileIntentPhrases(),
    ...profileSignals().skills
  ]).filter((term) => searchText.toLowerCase().includes(term.toLowerCase()));
  if (!similarQuery) return [];
  return sources
    .filter((source) => source.enabled)
    .map((source) => {
      const scope = sourceScopeQuery(source);
      const query = uniqueTerms([scope, similarQuery]).join(" ");
      return {
        id: `${source.id}_similar_${job.id}`,
        name: source.name,
        type: source.type,
        country: sourceCountry(source),
        query,
        url: source.url.replace("{query}", encodeURIComponent(query)),
        intentPhrases: [cleanJobTitleForSearch(job.title), ...matchedProfileTerms].filter(Boolean),
        notes: `${source.notes || "No source note."} Similarity seed: ${job.title} at ${job.company}.`,
        scanKind: sourceScanKind(source),
        canAutoScan: sourceCanAutoScan(source)
      };
    });
}

function renderScanBriefList(signals = profileSignals()) {
  if (!elements.scanBriefList) return;
  const exclusions = uniqueTerms([
    ...signals.excludedKeywords,
    ...signals.excludedCompanies,
    ...signals.excludedLocations,
    ...signals.excludedIndustries
  ]).slice(0, 10);
  const intentText = profileIntentPhrases(signals).join(" ").toLowerCase();
  const conflicts = exclusions.filter((term) => intentText.includes(term.toLowerCase())).slice(0, 5);
  const bridgeTerms = ["solutions", "solution", "implementation", "customer", "manager", "forward deployed"];
  const searchBlockers = exclusions
    .filter((term) => bridgeTerms.some((bridgeTerm) => containsIntentTerm(term.toLowerCase(), bridgeTerm)))
    .slice(0, 5);
  const rows = [
    ["Target roles", uniqueTerms([...signals.titles, ...signals.desiredKeywords]).slice(0, 10), "Add target titles or desired keywords"],
    ["Location", uniqueTerms([profile.location, signals.remoteOnly ? "Remote only" : ""].filter(Boolean)), "No location preference"],
    ["Must include", uniqueTerms(signals.requiredKeywords).slice(0, 8), "No required terms"],
    ["Preferred signal", uniqueTerms([...signals.preferredIndustries, ...signals.skills]).slice(0, 10), "No preferred industries or skills"],
    ["Filter out", exclusions, "No exclusions configured"]
  ];
  if (conflicts.length) {
    rows.splice(1, 0, ["Brief conflict", conflicts.map((term) => `${term} is also excluded`), "No conflicts"]);
  }
  if (searchBlockers.length) {
    rows.splice(1, 0, ["Search blockers", searchBlockers.map((term) => `${term} blocks a common match path`), "No blockers"]);
  }

  elements.scanBriefList.innerHTML = "";
  rows.forEach(([label, terms, emptyText]) => {
    const row = document.createElement("div");
    row.className = "scan-brief-row";
    const title = document.createElement("span");
    title.textContent = label;
    const values = document.createElement("div");
    values.className = "scan-brief-pills";
    appendPills(values, terms, emptyText);
    row.append(title, values);
    elements.scanBriefList.append(row);
  });
}

function generateScanPreviews() {
  const activeSources = sources.filter((source) => source.enabled);
  if (!activeSources.length) return [];
  return activeSources.map((source) => {
    const searchBrief = buildSourceSearchBrief(source);
    return {
      id: source.id,
      name: source.name,
      type: source.type,
      query: searchBrief.query,
      url: source.url.replace("{query}", encodeURIComponent(searchBrief.query)),
      intentPhrases: profileIntentPhrases(),
      notes: source.notes || "No source note.",
      scanKind: sourceScanKind(source),
      canAutoScan: sourceCanAutoScan(source),
      country: sourceCountry(source),
      summary: searchBrief.summary
    };
  });
}

function renderScanner() {
  const activeSources = sources.filter((source) => source.enabled);
  const previews = generateScanPreviews();
  const signals = profileSignals();
  const intentTerms = profileIntentPhrases(signals).slice(0, 10);
  const exclusions = uniqueTerms([
    ...signals.excludedKeywords,
    ...signals.excludedCompanies,
    ...signals.excludedLocations,
    ...signals.excludedIndustries
  ]).slice(0, 10);
  const filterSummary = document.getElementById("scanFilterSummary");

  elements.scanMetricSources.textContent = activeSources.length;
  elements.scanMetricIntent.textContent = intentTerms.length;
  elements.scanMetricExclusions.textContent = exclusions.length;
  elements.scanMetricRemote.textContent = signals.remoteOnly ? "On" : "Off";
  appendPills(
    elements.scanBriefTags,
    [
      ...intentTerms.slice(0, 6),
      signals.remoteOnly ? "Remote only" : "",
      profile.location && !signals.remoteOnly ? profile.location : ""
    ].filter(Boolean),
    "Profile brief not configured",
    "quiet-pill"
  );
  renderScanBriefList(signals);

  elements.activeSourceStrip.innerHTML = "";
  if (!activeSources.length) {
    elements.activeSourceStrip.innerHTML = '<div class="empty-state">No enabled sources. Add or enable a source before scanning.</div>';
  } else {
    const orderedPreviews = orderSourcesForScan(previews);
    orderedPreviews.slice(0, 6).forEach((source) => {
      const chip = document.createElement("div");
      chip.className = "source-chip";
      chip.innerHTML = `<div><strong></strong><span></span></div><span class="tag"></span>`;
      chip.querySelector("strong").textContent = source.name;
      chip.querySelector("div span").textContent = `${source.scanKind} - ${source.query || "No query"}`;
      const country = chip.querySelector(".tag");
      country.className = "country-pill";
      country.textContent = sourceCountry(source);
      elements.activeSourceStrip.append(chip);
    });
    if (orderedPreviews.length > 6) {
      const extra = document.createElement("div");
      extra.className = "source-chip source-chip-more";
      extra.innerHTML = `<strong></strong><span></span>`;
      extra.querySelector("strong").textContent = `+${orderedPreviews.length - 6} more`;
      extra.querySelector("span").textContent = "Direct boards first, manual searches after";
      elements.activeSourceStrip.append(extra);
    }
  }

  elements.scanResults.innerHTML = "";
  const intentCopy = intentTerms.length ? `anchored on ${intentTerms.slice(0, 3).join(", ")}` : "using source defaults";
  const remoteCopy = signals.remoteOnly ? " Remote-only filtering is on." : "";
  const autoScanCount = previews.filter(sourceCanAutoScan).length;
  const manualSearchCount = previews.length - autoScanCount;
  filterSummary.textContent = activeSources.length
    ? `${autoScanCount} automated source${autoScanCount === 1 ? "" : "s"} ready, ${manualSearchCount} manual search source${manualSearchCount === 1 ? "" : "s"} available, ${intentCopy}.${remoteCopy}`
    : "Add or enable sources before scanning.";
  if (!previews.length) {
    elements.scanResults.innerHTML = '<div class="empty-state">No active source searches are available. Enable or add sources first.</div>';
    return;
  }
  previews.forEach((sourceSearch) => {
    const card = createSourceSearchCard(sourceSearch);
    elements.scanResults.append(card);
  });
}

async function scanActiveSites() {
  const sourceSearches = generateScanPreviews();
  if (!sourceSearches.length) {
    renderScanner();
    return;
  }
  elements.scanButton.disabled = true;
  elements.scanButton.textContent = "Scanning...";
  const orderedSources = orderSourcesForScan(sourceSearches);
  const autoSources = orderedSources.filter(sourceCanAutoScan);
  const manualCount = orderedSources.length - autoSources.length;
  if (!autoSources.length) {
    renderScanner();
    setAgentStatus("No direct/API sources are available for automated scanning. Open the manual search sources or add a Greenhouse/Lever source.", "error");
    elements.scanButton.disabled = false;
    elements.scanButton.textContent = "Scan active sites";
    return;
  }
  setAgentStatus(`Scanning ${Math.min(autoSources.length, 80)} direct/API sources. ${manualCount} manual search source${manualCount === 1 ? "" : "s"} will be left for browser review.`, "neutral");
  try {
    const result = await apiPost("/api/scan", {
      sources: autoSources,
      profile,
      maxSources: 80,
      allowWebSearch: false
    });
    const discovered = (result.jobs || []).filter((job) => job.url && isScannedFit(job));
    discovered.forEach((job) => addJob(job));
    renderAll();
    setView("rater");
    const errorCopy = result.errors?.length ? ` ${result.errors.length} source${result.errors.length === 1 ? "" : "s"} could not be searched.` : "";
    const manualCopy = manualCount ? ` ${manualCount} manual web-search source${manualCount === 1 ? "" : "s"} skipped in automated mode.` : "";
    setAgentStatus(`Scanner found ${discovered.length} real result link${discovered.length === 1 ? "" : "s"} from ${result.scannedSources} direct/API source${result.scannedSources === 1 ? "" : "s"}.${manualCopy}${errorCopy}`, discovered.length ? "success" : "error");
  } catch (error) {
    renderScanner();
    setView("scanner");
    setAgentStatus(`Scanner could not fetch live results: ${error.message}. You can still open source searches manually.`, "error");
  } finally {
    elements.scanButton.disabled = false;
    elements.scanButton.textContent = "Scan active sites";
  }
}

async function findMoreLikeJob(job, triggerButton) {
  const sourceSearches = buildSimilarSourceSearches(job);
  if (!sourceSearches.length) {
    setAgentStatus("Add or enable search sources before finding similar jobs.", "error");
    setView("sources");
    return;
  }

  if (triggerButton) {
    triggerButton.disabled = true;
    triggerButton.textContent = "Searching...";
  }
  const orderedSources = orderSourcesForScan(sourceSearches);
  const autoSources = orderedSources.filter(sourceCanAutoScan);
  const manualCount = orderedSources.length - autoSources.length;
  if (!autoSources.length) {
    setAgentStatus("No direct/API sources are available for automated similar-job search.", "error");
    if (triggerButton) {
      triggerButton.disabled = false;
      triggerButton.textContent = "More like this";
    }
    return;
  }
  setAgentStatus(`Searching for roles similar to ${job.title} across ${Math.min(autoSources.length, 80)} direct/API sources...`, "neutral");
  try {
    const beforeCount = jobs.length;
    const result = await apiPost("/api/scan", {
      sources: autoSources,
      profile,
      maxSources: 80,
      allowWebSearch: false
    });
    const discovered = (result.jobs || [])
      .filter((candidate) => candidate.url && candidate.url !== job.url && isScannedFit(candidate))
      .map((candidate) => ({
        ...candidate,
        notes: [
          ...(candidate.notes || []),
          `Found by More like this from ${job.title} at ${job.company}.`
        ]
      }));
    discovered.forEach((candidate) => addJob(candidate));
    const addedCount = jobs.length - beforeCount;
    renderAll();
    setView("rater");
    const errorCopy = result.errors?.length ? ` ${result.errors.length} source${result.errors.length === 1 ? "" : "s"} could not be searched.` : "";
    const manualCopy = manualCount ? ` ${manualCount} manual web-search source${manualCount === 1 ? "" : "s"} skipped in automated mode.` : "";
    setAgentStatus(`Found ${addedCount} new similar role${addedCount === 1 ? "" : "s"} from ${result.scannedSources} direct/API sources.${manualCopy}${errorCopy}`, addedCount ? "success" : "neutral");
  } catch (error) {
    setAgentStatus(`Could not find similar jobs: ${error.message}`, "error");
  } finally {
    if (triggerButton) {
      triggerButton.disabled = false;
      triggerButton.textContent = "More like this";
    }
  }
}

function orderSourcesForScan(sourceSearches) {
  return [...sourceSearches].sort((a, b) => {
    const aDirect = isDirectBoardSource(a);
    const bDirect = isDirectBoardSource(b);
    if (aDirect !== bDirect) return aDirect ? -1 : 1;
    const aAuto = sourceCanAutoScan(a);
    const bAuto = sourceCanAutoScan(b);
    if (aAuto !== bAuto) return aAuto ? -1 : 1;
    return 0;
  });
}
