// profile responsibilities. Loaded as a classic browser script before app.js.
function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  scheduleStateSync();
}

function profileDefaultQuery(signals = profileSignals()) {
  const titleTerms = signals.titles.slice(0, 4);
  const mustHaveTerms = uniqueTerms([
    ...signals.requiredKeywords,
    ...signals.desiredKeywords,
    ...signals.preferredIndustries
  ]).slice(0, 8);
  const locationTerms = signals.locations.slice(0, 3);
  const skillTerms = signals.skills.slice(0, titleTerms.length || mustHaveTerms.length ? 3 : 6);

  return uniqueTerms([
    ...titleTerms,
    ...mustHaveTerms,
    ...skillTerms,
    ...locationTerms,
    signals.remoteOnly ? "remote" : ""
  ]).join(" ");
}

function profileSignals() {
  const titles = splitTerms(profile.targetTitles);
  const skills = splitTerms(profile.skills);
  const desiredKeywords = splitTerms(profile.desiredKeywords);
  const requiredKeywords = splitTerms(profile.requiredKeywords);
  const preferredIndustries = splitTerms(profile.preferredIndustries);
  const excludedKeywords = splitTerms(profile.excludedKeywords);
  const excludedCompanies = splitTerms(profile.excludedCompanies);
  const excludedLocations = splitTerms(profile.excludedLocations);
  const excludedIndustries = splitTerms(profile.excludedIndustries);

  return {
    titles,
    skills,
    locations: splitTerms(profile.location),
    remoteOnly: isTruthy(profile.remoteOnly),
    desiredKeywords,
    requiredKeywords,
    preferredIndustries,
    excludedKeywords,
    excludedCompanies,
    excludedLocations,
    excludedIndustries,
    resumeWords: wordCount(profile.resumeText),
    resumeTerms: skills
      .concat(titles, desiredKeywords, preferredIndustries)
      .filter((term) => profile.resumeText.toLowerCase().includes(term.toLowerCase()))
  };
}

function renderProfile() {
  [
    "name",
    "email",
    "targetTitles",
    "location",
    "desiredKeywords",
    "requiredKeywords",
    "preferredIndustries",
    "excludedKeywords",
    "excludedCompanies",
    "excludedLocations",
    "excludedIndustries",
    "compTarget",
    "workAuth",
    "skills",
    "resumeText",
    "summary"
  ].forEach((fieldName) => {
    if (elements.profileForm.elements[fieldName]) {
      elements.profileForm.elements[fieldName].value = profile[fieldName] || "";
    }
  });
  if (elements.profileForm.elements.remoteOnly) {
    elements.profileForm.elements.remoteOnly.checked = isTruthy(profile.remoteOnly);
  }

  const signals = profileSignals();
  const exclusionCount = signals.excludedKeywords.length + signals.excludedCompanies.length + signals.excludedLocations.length + signals.excludedIndustries.length;
  const briefCount = signals.desiredKeywords.length + signals.requiredKeywords.length + signals.preferredIndustries.length;
  const hasProfile = Boolean(profile.resumeText || profile.skills || profile.targetTitles || briefCount || exclusionCount || signals.remoteOnly);
  document.getElementById("profileCompletenessTitle").textContent = hasProfile
    ? `${profile.name || "Profile"} is ready for personalization`
    : "No profile saved";
  document.getElementById("profileCompletenessCopy").textContent = hasProfile
    ? `${signals.resumeWords} resume words, ${signals.skills.length} skills, ${signals.titles.length} target titles, ${briefCount} search brief terms, ${exclusionCount} exclusions, and ${signals.remoteOnly ? "remote-only filtering" : "standard location filtering"} will influence scans, ratings, CVs, and application drafts.`
    : "Add a resume and preferences so scans, ratings, CV drafts, and application notes can be personalized.";
  document.getElementById("profileAgentNote").textContent = profile.resumeFileName
    ? `Last uploaded file: ${profile.resumeFileName}. Browser-only parsing works best with text or markdown resumes.`
    : "The agent will cite this profile when ranking jobs and drafting application material.";
  renderProfileTips(signals);
  updateSourceQueryHint();
}

function renderProfileTips(signals = profileSignals()) {
  if (!elements.profileTipsList) return;
  elements.profileTipsList.innerHTML = "";
  buildProfileTips(signals).forEach((tip) => {
    const item = document.createElement("li");
    if (tip.tone) item.dataset.tone = tip.tone;
    const title = document.createElement("strong");
    title.textContent = tip.title;
    const body = document.createElement("span");
    body.textContent = tip.body;
    item.append(title, body);
    elements.profileTipsList.append(item);
  });
}
