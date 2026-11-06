const JOBS_KEY = "jobhunter.jobs.v2";
const PROFILE_KEY = "jobhunter.profile.v1";
const SOURCES_KEY = "jobhunter.sources.v1";
const SOURCE_DELETIONS_KEY = "jobhunter.sources.deleted.v1";
const AGENT_CONFIG_KEY = "jobhunter.agent.config.v1";
const ONBOARDING_KEY = "jobhunter.onboarding.seen.v1";

const agentSteps = [
  ["Scan", "Search enabled job sites with profile-aware keywords and source-specific notes."],
  ["Normalize", "Ask the orchestrator to extract title, company, location, compensation, seniority, skills, and source metadata."],
  ["Rate", "Use the selected LLM provider to score fit against resume text, target titles, skills, location, comp, and constraints."],
  ["Prepare", "Draft CV keywords, cover note, recruiter outreach, and interview prep from the saved profile."],
  ["Track", "Move the role through review, apply, interview, offer, or pass with audit notes."]
];

const onboardingSteps = [
  {
    view: "profile",
    eyebrow: "Step 1 of 5",
    title: "Start with My Profile",
    body: "The profile is the steering wheel for the whole app. Set target titles, soft keywords, hard exclusions, location, and resume text before scanning.",
    bullets: [
      "Use real job titles you would click, not only aspirational labels.",
      "Keep Required keywords empty until you are getting healthy results.",
      "Put roles you never want, like Solutions/FDE or pre-sales, in Exclude keywords."
    ]
  },
  {
    view: "sources",
    eyebrow: "Step 2 of 5",
    title: "Review Search Sources",
    body: "Sources decide where JobHunter looks. Direct boards can be scanned automatically; manual search sources are opened in your browser for review.",
    bullets: [
      "Keep US and Global sources enabled for your current search.",
      "Use notes and country labels to remember what each source is good for.",
      "Disable noisy sources rather than deleting them while tuning your search."
    ]
  },
  {
    view: "scanner",
    eyebrow: "Step 3 of 5",
    title: "Run Job Scanner",
    body: "The scanner pulls live postings from enabled direct boards, applies your hard filters, and sends matching jobs to the rater.",
    bullets: [
      "If results are too low, broaden target titles and desired keywords.",
      "If results are wrong, add exclusions or remove unwanted terms from the profile.",
      "Remote-only is useful, but it can shrink the pool dramatically."
    ]
  },
  {
    view: "rater",
    eyebrow: "Step 4 of 5",
    title: "Use Job Rater",
    body: "The rater is your triage desk. Open each job, inspect why it matched, then prepare, pass, remove, or search for similar jobs.",
    bullets: [
      "The score is a starting point, not an application decision.",
      "Use More like this only after you find a role shape you genuinely like.",
      "Clear Results is for starting a fresh scan after profile tuning."
    ]
  },
  {
    view: "applier",
    eyebrow: "Step 5 of 5",
    title: "Prepare and Track",
    body: "Application packs turn a promising job into a reviewable draft, and the tracker keeps each opportunity moving through the pipeline.",
    bullets: [
      "Prepare packs for roles marked Ready.",
      "Review every generated draft before using it.",
      "Move roles through Ready, Applied, and Interview as your search progresses."
    ]
  }
];

const helpTopics = {
  overview: {
    eyebrow: "Workflow help",
    title: "JobHunter workflow",
    body: "Use JobHunter as a loop: tune My Profile, scan Search Sources, rate the results, prepare application packs, and track what happens next.",
    bullets: [
      "My Profile defines the search direction and hard filters.",
      "Search Sources define where jobs come from.",
      "Job Scanner fetches live results from direct boards and queues matches.",
      "Job Rater helps you decide what to pursue.",
      "Job Applier and Job Tracker turn good matches into action."
    ],
    next: "Best next step: open My Profile and make sure target titles, desired keywords, and exclusions match what you actually want."
  },
  workflow: {
    eyebrow: "Workflow help",
    title: "The five-step loop",
    body: "Most problems come from skipping straight to scanning. The app works better when the profile is tuned first.",
    bullets: [
      "Profile first: set role shape, keywords, location, and exclusions.",
      "Sources second: enable the boards you trust.",
      "Scan third: pull fresh roles into the rater.",
      "Rate fourth: keep, pass, or find similar roles.",
      "Apply and track last: prepare drafts and move jobs through the board."
    ],
    next: "When results look wrong, change Profile before changing Sources."
  },
  command: {
    eyebrow: "Manual intake help",
    title: "Paste one job by hand",
    body: "Use this page when you already have a posting from a recruiter, LinkedIn, email, or a manual job board search.",
    bullets: [
      "Paste the full description when possible so scoring has real evidence.",
      "Location and compensation help the rater spot mismatches.",
      "Manual jobs follow the same rating, application, and tracking flow as scanned jobs."
    ],
    next: "Use manual intake for one-off roles; use Job Scanner when you want a batch of fresh leads."
  },
  agent: {
    eyebrow: "Agent help",
    title: "Orchestrator provider",
    body: "The agent provider powers review, scoring, and draft generation. Ollama is the local default, while cloud providers use configured API keys.",
    bullets: [
      "Leave the base URL blank for the default local container path.",
      "Test the agent before running a large pipeline.",
      "If drafts feel weak, improve Profile positioning and resume text first."
    ],
    next: "If the provider test fails, the rest of the app still works with local deterministic scoring."
  },
  scanner: {
    eyebrow: "Scanner help",
    title: "How scanning works",
    body: "Scanner uses enabled sources, builds a profile-aware query preview, and automatically scans direct Greenhouse/Lever-style boards.",
    bullets: [
      "Automated sources can return jobs directly from ATS APIs.",
      "Manual search sources are still useful, but you open them yourself.",
      "Exclusions and required keywords remove jobs before they hit the rater.",
      "If the scan returns too little, broaden target titles and desired keywords."
    ],
    next: "Healthy scan tuning usually means 4-8 target titles, no required keywords, and clear exclusions for roles you dislike."
  },
  rater: {
    eyebrow: "Rater help",
    title: "Understanding rated results",
    body: "The rater is where scanned and pasted jobs become decisions. It shows score, tags, source, full description, and actions.",
    bullets: [
      "Ready means worth preparing an application pack.",
      "Watch means interesting but not urgent.",
      "Pass means excluded, too weak, or not aligned.",
      "More like this searches from a selected job's role shape.",
      "Clear Results removes current results so you can rescan after tuning."
    ],
    next: "If most jobs are bad, do not fight the rater one by one. Tune My Profile, clear results, then scan again."
  },
  applier: {
    eyebrow: "Applier help",
    title: "Application packs",
    body: "Application packs are draft material for a human to review: positioning, resume keywords, cover note, recruiter message, and prep prompts.",
    bullets: [
      "Only strong Ready roles appear here.",
      "Drafts use profile text, resume evidence, and the job description.",
      "Always review generated text before submitting or sending anything."
    ],
    next: "Improve Personal positioning in My Profile to make every application pack sharper."
  },
  tracker: {
    eyebrow: "Tracker help",
    title: "Pipeline board",
    body: "The tracker keeps your search from becoming a pile of tabs. Move jobs forward as you decide what to do.",
    bullets: [
      "Review is the intake lane.",
      "Ready is for jobs you plan to act on.",
      "Applied and Interview help you see momentum.",
      "Remove stale or bad roles from the rater to keep the board clean."
    ],
    next: "Use the tracker at the end of each search session to update what changed."
  },
  profile: {
    eyebrow: "Profile help",
    title: "Make the profile do the work",
    body: "The profile is more important than the resume for career-change searches. Keywords steer discovery; resume evidence supports ranking.",
    bullets: [
      "Target titles are the strongest role-shape signal.",
      "Desired keywords are soft OR-style boosts.",
      "Required keywords are hard AND-style filters and can collapse results.",
      "Exclusions are hard blockers for roles you never want.",
      "Skills and resume text support scoring but should not replace profile intent."
    ],
    next: "For AI builder roles, try target titles like AI Systems Engineer, Platform Engineer, Developer Productivity Engineer, and Internal Tools Engineer."
  },
  sources: {
    eyebrow: "Sources help",
    title: "Search Sources",
    body: "Sources are where jobs come from, not what jobs should match. Keep role preferences in My Profile so every source uses the same intent.",
    bullets: [
      "Direct boards are best for automated scanning.",
      "Manual web-search sources are best opened in a browser.",
      "Country labels help keep scans Global or US-focused.",
      "Disable noisy sources during tuning, then re-enable them later."
    ],
    next: "If results are low, add more direct company boards before loosening hard profile filters."
  }
};

const providerDefaults = {
  ollama: {
    label: "Ollama",
    model: "qwen3:8b",
    baseUrl: "",
    help: "Default local path. Leave base URL blank unless the orchestrator runs in a container and needs a host-visible Ollama address."
  },
  openai: {
    label: "OpenAI",
    model: "gpt-4.1-mini",
    baseUrl: "https://api.openai.com",
    help: "Uses OPENAI_API_KEY on the orchestrator, or the session key below."
  },
  claude: {
    label: "Claude",
    model: "claude-3-5-sonnet-latest",
    baseUrl: "https://api.anthropic.com",
    help: "Uses ANTHROPIC_API_KEY on the orchestrator, or the session key below."
  },
  gemini: {
    label: "Gemini",
    model: "gemini-2.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com",
    help: "Uses GEMINI_API_KEY on the orchestrator, or the session key below."
  }
};

const defaultAgentConfig = {
  provider: "ollama",
  model: providerDefaults.ollama.model,
  baseUrl: providerDefaults.ollama.baseUrl
};

const defaultProfile = {
  name: "",
  email: "",
  targetTitles: "",
  location: "",
  remoteOnly: false,
  compTarget: "",
  workAuth: "",
  skills: "",
  desiredKeywords: "",
  requiredKeywords: "",
  preferredIndustries: "",
  excludedKeywords: "",
  excludedCompanies: "",
  excludedLocations: "",
  excludedIndustries: "",
  resumeText: "",
  resumeFileName: "",
  summary: ""
};

const screenshotDemoProfile = {
  name: "Alex Rivera",
  email: "alex@example.com",
  targetTitles: "AI Systems Engineer, AI Automation Engineer, Developer Productivity Engineer, Platform Engineer, Internal Tools Engineer",
  location: "Remote US",
  remoteOnly: true,
  compTarget: "$120k+",
  workAuth: "US work authorized",
  skills: "Linux, cloud platforms, Python, Bash, automation, Kubernetes, developer tools, internal platforms",
  desiredKeywords: "Claude, Codex, Gemini, LLM, automation, agentic DevOps, infrastructure automation, developer tools, internal tools, Linux",
  requiredKeywords: "",
  preferredIndustries: "developer tools, AI infrastructure, productivity, cloud infrastructure",
  excludedKeywords: "solutions architect, solutions engineer, forward deployed, customer engineer, sales engineer, pre-sales, customer success",
  excludedCompanies: "",
  excludedLocations: "onsite only, hybrid required, outside US",
  excludedIndustries: "crypto, gambling",
  resumeText: "Sample profile for documentation screenshots. Practical AI systems builder with experience automating operations, creating internal tools, and connecting model workflows to production infrastructure.",
  resumeFileName: "demo-profile.txt",
  summary: "Career changer targeting hands-on AI automation and platform roles, with keyword weighting tuned toward future-fit work."
};

const defaultSources = typeof careerOpsSources !== "undefined" ? careerOpsSources : [];

const stages = [
  ["review", "Review"],
  ["ready", "Ready"],
  ["applied", "Applied"],
  ["interview", "Interview"]
];

const sourceCountryRules = [
  ["US", /\b(?:us|usa|u\.s\.|united states|america|remote us|us-only|nyc|new york|san francisco|austin|seattle|boston)\b/i],
  ["UK", /\b(?:uk|u\.k\.|united kingdom|london|cambridge uk|england|scotland)\b/i],
  ["Canada", /\b(?:canada|canadian|toronto|vancouver|montreal)\b/i],
  ["EU", /\b(?:eu|europe|european|emea|remote eu|eu\/us|remote europe)\b/i],
  ["Spain", /\b(?:spain|espana|españa|madrid|barcelona)\b/i],
  ["France", /\b(?:france|paris)\b/i],
  ["Germany", /\b(?:germany|deutschland|berlin|heidelberg|munich|de\b)\b/i],
  ["India", /\b(?:india|bangalore|bengaluru|delhi|mumbai)\b/i],
  ["Global", /\b(?:global|worldwide|anywhere|remote-first|remote first)\b/i]
];

let jobs = loadList(JOBS_KEY, []);
let profile = loadObject(PROFILE_KEY, defaultProfile);
let agentConfig = loadObject(AGENT_CONFIG_KEY, defaultAgentConfig);
let deletedSourceIds = loadList(SOURCE_DELETIONS_KEY, []);
let sources = loadSources();
let selectedDraftJobId = null;
let selectedDetailJobId = jobs[0]?.id || null;
let stateSyncTimer = null;
let onboardingIndex = 0;

function urlParams() {
  return new URLSearchParams(window.location.search);
}

function isScreenshotMode() {
  return urlParams().has("screenshot");
}

function isDemoScreenshotMode() {
  return isScreenshotMode() && urlParams().get("demo") === "1";
}

function initialView() {
  const view = urlParams().get("view");
  return ["command", "scanner", "rater", "applier", "tracker", "profile", "sources"].includes(view) ? view : "command";
}

function applyScreenshotDemoState() {
  if (!isDemoScreenshotMode()) return;
  profile = { ...defaultProfile, ...screenshotDemoProfile };
}

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  helpButtons: document.querySelectorAll("[data-help-topic]"),
  panels: document.querySelectorAll("[data-view-panel]"),
  viewTitle: document.getElementById("viewTitle"),
  jobForm: document.getElementById("jobForm"),
  agentConfigForm: document.getElementById("agentConfigForm"),
  agentProvider: document.getElementById("agentProvider"),
  agentModel: document.getElementById("agentModel"),
  agentBaseUrl: document.getElementById("agentBaseUrl"),
  agentApiKey: document.getElementById("agentApiKey"),
  agentProviderHelp: document.getElementById("agentProviderHelp"),
  agentConnectionStatus: document.getElementById("agentConnectionStatus"),
  ollamaTools: document.getElementById("ollamaTools"),
  ollamaModelList: document.getElementById("ollamaModelList"),
  listOllamaModelsButton: document.getElementById("listOllamaModelsButton"),
  pullOllamaModelButton: document.getElementById("pullOllamaModelButton"),
  saveAgentConfigButton: document.getElementById("saveAgentConfigButton"),
  testAgentButton: document.getElementById("testAgentButton"),
  openHelpButton: document.getElementById("openHelpButton"),
  restartOnboardingButton: document.getElementById("restartOnboardingButton"),
  helpModal: document.getElementById("helpModal"),
  helpCloseButton: document.getElementById("helpCloseButton"),
  helpDoneButton: document.getElementById("helpDoneButton"),
  helpOnboardingButton: document.getElementById("helpOnboardingButton"),
  helpEyebrow: document.getElementById("helpEyebrow"),
  helpTitle: document.getElementById("helpTitle"),
  helpBody: document.getElementById("helpBody"),
  helpList: document.getElementById("helpList"),
  helpNextStep: document.getElementById("helpNextStep"),
  onboardingModal: document.getElementById("onboardingModal"),
  onboardingCloseButton: document.getElementById("onboardingCloseButton"),
  onboardingSkipButton: document.getElementById("onboardingSkipButton"),
  onboardingBackButton: document.getElementById("onboardingBackButton"),
  onboardingNextButton: document.getElementById("onboardingNextButton"),
  onboardingProgress: document.getElementById("onboardingProgress"),
  onboardingEyebrow: document.getElementById("onboardingEyebrow"),
  onboardingTitle: document.getElementById("onboardingTitle"),
  onboardingBody: document.getElementById("onboardingBody"),
  onboardingList: document.getElementById("onboardingList"),
  profileForm: document.getElementById("profileForm"),
  profileTipsList: document.getElementById("profileTipsList"),
  sourceForm: document.getElementById("sourceForm"),
  scanButton: document.getElementById("scanButton"),
  scanResults: document.getElementById("scanResults"),
  activeSourceStrip: document.getElementById("activeSourceStrip"),
  scanBriefTags: document.getElementById("scanBriefTags"),
  scanBriefList: document.getElementById("scanBriefList"),
  scanMetricSources: document.getElementById("scanMetricSources"),
  scanMetricIntent: document.getElementById("scanMetricIntent"),
  scanMetricExclusions: document.getElementById("scanMetricExclusions"),
  scanMetricRemote: document.getElementById("scanMetricRemote"),
  scanProfileButton: document.getElementById("scanProfileButton"),
  scanSourcesButton: document.getElementById("scanSourcesButton"),
  ratedJobs: document.getElementById("ratedJobs"),
  jobDetailPanel: document.getElementById("jobDetailPanel"),
  detailTitle: document.getElementById("detailTitle"),
  detailMeta: document.getElementById("detailMeta"),
  detailNav: document.getElementById("detailNav"),
  detailStats: document.getElementById("detailStats"),
  detailTags: document.getElementById("detailTags"),
  detailAccordion: document.getElementById("detailAccordion"),
  detailActions: document.getElementById("detailActions"),
  applyJobs: document.getElementById("applyJobs"),
  trackerBoard: document.getElementById("trackerBoard"),
  sourceList: document.getElementById("sourceList"),
  ratingFilter: document.getElementById("ratingFilter"),
  newSearchButton: document.getElementById("newSearchButton"),
  draftTitle: document.getElementById("draftTitle"),
  draftContent: document.getElementById("draftContent"),
  runPipelineButton: document.getElementById("runPipelineButton"),
  resetButton: document.getElementById("resetButton"),
  exportButton: document.getElementById("exportButton"),
  saveProfileButton: document.getElementById("saveProfileButton"),
  clearSourceButton: document.getElementById("clearSourceButton"),
  resumeUpload: document.getElementById("resumeUpload"),
  timelineSteps: document.getElementById("timelineSteps")
};


function loadSources() {
  const stored = loadList(SOURCES_KEY, []);
  const deleted = new Set(deletedSourceIds);
  const byId = new Map();

  defaultSources.forEach((source) => {
    if (!deleted.has(source.id) && isAllowedSourceMarket(source)) byId.set(source.id, source);
  });

  stored.forEach((source) => {
    if (!deleted.has(source.id) && isAllowedSourceMarket(source)) byId.set(source.id, source);
  });

  const merged = Array.from(byId.values());
  localStorage.setItem(SOURCES_KEY, JSON.stringify(merged));
  return merged;
}

function filterAllowedSources(sourceList = []) {
  return sourceList.filter((source) => isAllowedSourceMarket(source));
}

function createId(prefix = "item") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeText(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

function splitTerms(value = "") {
  return normalizeText(value)
    .split(/[,;\n]/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function wordCount(value = "") {
  const words = normalizeText(value).match(/\b[\w#+.-]+\b/g);
  return words ? words.length : 0;
}

function countTermMatches(text, terms) {
  const lower = text.toLowerCase();
  return terms.filter((term) => term && lower.includes(term.toLowerCase()));
}

function uniqueTerms(terms) {
  return [...new Set(terms.map((term) => normalizeText(term)).filter(Boolean))];
}

function isTruthy(value) {
  return value === true || value === "true" || value === "on" || value === "1";
}

const genericIntentWords = new Set([
  "remote",
  "hybrid",
  "onsite",
  "engineer",
  "engineering",
  "specialist",
  "manager",
  "senior",
  "staff",
  "lead",
  "principal",
  "developer",
  "role",
  "jobs",
  "job",
  "careers",
  "career",
  "company",
  "work"
]);

function isRemoteCompatibleJob(input = {}) {
  const locationText = normalizeText(`${input.title || ""} ${input.location || ""}`).toLowerCase();
  const descriptionText = normalizeText(input.description || "").toLowerCase();
  const remoteSignals = [
    "remote",
    "work from home",
    "wfh",
    "distributed",
    "anywhere",
    "home-based",
    "home based"
  ];
  const officeOnlySignals = [
    "onsite",
    "on-site",
    "in office",
    "in-office",
    "office-based",
    "office based",
    "hybrid",
    "relocation required",
    "must be based in"
  ];
  const explicitDescriptionSignals = ["remote-first", "remote first", "work from home", "home-based", "home based"];
  const hasRemoteSignal = remoteSignals.some((term) => locationText.includes(term)) ||
    explicitDescriptionSignals.some((term) => descriptionText.includes(term));
  const hasOfficeOnlySignal = officeOnlySignals.some((term) => locationText.includes(term));
  return hasRemoteSignal && !hasOfficeOnlySignal;
}

function isUsWorkCompatibleJob(input = {}, profileInput = profile) {
  const profileLocation = normalizeText(profileInput.location || "").toLowerCase();
  const auth = normalizeText(profileInput.workAuth || "").toLowerCase();
  const wantsUsWork = /\bus\b|\bu\.s\.\b|\busa\b|united states|remote us|remote - us|north america|citizen|no sponsorship/.test(`${auth} ${profileLocation}`);
  if (!wantsUsWork) return true;
  const locationText = normalizeText(`${input.title || ""} ${input.location || ""}`).toLowerCase();
  if (!locationText) return true;
  const usSignals = ["us", "u.s.", "usa", "united states", "north america", "americas", "global", "worldwide", "anywhere"];
  const nonUsSignals = [
    "apj",
    "apac",
    "asia pacific",
    "singapore",
    "australia",
    "sydney",
    "canada",
    "toronto",
    "vancouver",
    "europe",
    "emea",
    "uk",
    "united kingdom",
    "ireland",
    "dublin",
    "france",
    "germany",
    "spain",
    "netherlands",
    "portugal",
    "lisbon",
    "switzerland",
    "zurich",
    "japan",
    "tokyo",
    "korea",
    "seoul",
    "india",
    "bangalore",
    "bengaluru",
    "paris",
    "london",
    "berlin"
  ];
  const hasUsSignal = usSignals.some((term) => containsIntentTerm(locationText, term));
  const hasNonUsSignal = nonUsSignals.some((term) => containsIntentTerm(locationText, term));
  return hasUsSignal || !hasNonUsSignal;
}

function profileIntentPhrases(signals = profileSignals()) {
  return uniqueTerms([
    ...signals.titles,
    ...signals.desiredKeywords,
    ...signals.requiredKeywords,
    ...signals.preferredIndustries
  ])
    .map((term) => term.toLowerCase())
    .filter((term) => term.length >= 4 && !genericIntentWords.has(term));
}

function strongProfileIntentWords(signals = profileSignals()) {
  return uniqueTerms(profileIntentPhrases(signals).join(" ").match(/\b[a-z][a-z0-9#+.-]{2,}\b/gi) || [])
    .map((term) => term.toLowerCase())
    .filter((term) => !genericIntentWords.has(term) && term !== "ai")
    .slice(0, 30);
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsIntentTerm(text = "", term = "") {
  const cleaned = normalizeText(term).toLowerCase();
  if (!cleaned) return false;
  if (cleaned.includes(" ")) return text.includes(cleaned);
  return new RegExp(`\\b${escapeRegExp(cleaned)}\\b`, "i").test(text);
}

function jobMatchesProfileIntent(input, signals = profileSignals()) {
  return roleFitEvidence(input, signals).matched;
}

function hasAnyTerm(text = "", terms = []) {
  return terms.some((term) => containsIntentTerm(text, term));
}

const bridgeRoleTitleTerms = [
  "solutions architect",
  "solution architect",
  "solutions engineer",
  "solution engineer",
  "customer engineer",
  "forward deployed engineer",
  "forward deployed",
  "deployed engineer"
];

const technicalBuilderTitleTerms = [
  "ai agent architect",
  "ai application engineer",
  "ai product engineer",
  "software engineer",
  "backend software engineer",
  "front-end engineer",
  "frontend engineer",
  "fullstack engineer",
  "systems engineer",
  "system engineer",
  "platform engineer",
  "infrastructure engineer",
  "cloud security engineer",
  "application security engineer",
  "developer productivity engineer",
  "internal tools engineer",
  "automation engineer",
  "site engineer",
  "devops engineer",
  "sre",
  "hpc storage engineer"
];

const nonBuilderTitleTerms = [
  "account executive",
  "sales engineer",
  "pre-sales",
  "post-sales",
  "customer success",
  "marketing",
  "revenue",
  "designer",
  "product designer",
  "product manager",
  "people operations",
  "deal desk",
  "tax"
];

function profileAllowsBridgeRoles(signals = profileSignals()) {
  const profileText = profileIntentPhrases(signals).join(" ").toLowerCase();
  return hasAnyTerm(profileText, bridgeRoleTitleTerms);
}

function profileAllowsImplementationRoles(signals = profileSignals()) {
  const profileText = profileIntentPhrases(signals).join(" ").toLowerCase();
  return hasAnyTerm(profileText, ["implementation", "technical onboarding", "deployment", "professional services"]);
}

function profileAllowsEnablementRoles(signals = profileSignals()) {
  const profileText = profileIntentPhrases(signals).join(" ").toLowerCase();
  return hasAnyTerm(profileText, ["enablement", "evangelist", "developer advocate"]);
}

function technicalBuilderEvidence(input, signals = profileSignals()) {
  const title = normalizeText(input.title || "").toLowerCase();
  const text = jobSearchText(input).toLowerCase();
  const reasons = [];
  if (hasAnyTerm(title, bridgeRoleTitleTerms) || hasAnyTerm(title, nonBuilderTitleTerms)) return reasons;

  const hasBuilderTitle = hasAnyTerm(title, technicalBuilderTitleTerms);
  const hasAiToolSignal = hasAnyTerm(`${title} ${text}`, [
    "ai",
    "agent",
    "agents",
    "llm",
    "claude",
    "codex",
    "gemini",
    "automation",
    "developer tools",
    "devtools",
    "internal tools"
  ]);
  const hasInfraSignal = hasAnyTerm(text, [
    "linux",
    "cloud",
    "infrastructure",
    "kubernetes",
    "docker",
    "python",
    "bash",
    "automation",
    "security",
    "backend",
    "systems"
  ]);
  const profileHasBuilderIntent = hasAnyTerm([
    ...signals.titles,
    ...signals.desiredKeywords,
    ...signals.skills
  ].join(" ").toLowerCase(), [
    "builder",
    "vibe code",
    "vibe coding",
    "automation",
    "linux",
    "cloud",
    "python",
    "bash",
    "devops",
    "infrastructure",
    "claude",
    "codex",
    "gemini"
  ]);

  if (hasBuilderTitle && hasAiToolSignal) reasons.push("AI builder role");
  if (hasBuilderTitle && hasInfraSignal && profileHasBuilderIntent) reasons.push("technical builder role");
  return reasons;
}

function roleFitEvidence(input, signals = profileSignals()) {
  const title = normalizeText(input.title || "").toLowerCase();
  const text = jobSearchText(input).toLowerCase();
  const phrases = profileIntentPhrases(signals);
  const reasons = [];
  if (!phrases.length) return { matched: true, reasons };

  const titlePhraseHits = phrases.filter((phrase) => containsIntentTerm(title, phrase));
  if (titlePhraseHits.length) reasons.push("target title");

  const customerTechnical = hasAnyTerm(text, [
    "customer implementation",
    "implementation lifecycle",
    "technical implementation",
    "technical discovery",
    "technical stakeholders",
    "integration",
    "solutions architect",
    "solutions engineer",
    "customer engineer",
    "professional services",
    "onboarding",
    "deployment"
  ]);
  const aiContext = hasAnyTerm(`${title} ${text}`, ["ai", "llm", "agent", "automation", "claude", "codex", "gemini"]);
  const bridgeRoleTitle = hasAnyTerm(title, bridgeRoleTitleTerms);
  const allowsBridgeRoles = profileAllowsBridgeRoles(signals);
  const allowsImplementationRoles = profileAllowsImplementationRoles(signals);
  const allowsEnablementRoles = profileAllowsEnablementRoles(signals);
  reasons.push(...technicalBuilderEvidence(input, signals));

  if (bridgeRoleTitle && allowsBridgeRoles) {
    reasons.push("customer technical role");
  }
  if (!bridgeRoleTitle && allowsImplementationRoles && containsIntentTerm(title, "implementation") && customerTechnical) {
    reasons.push("implementation role");
  }
  if (allowsEnablementRoles && containsIntentTerm(title, "enablement") && aiContext && !hasAnyTerm(title, ["revenue", "sales", "gtm"])) {
    reasons.push("AI enablement role");
  }
  if (hasAnyTerm(title, ["ai systems", "ai system", "automation engineer", "platform developer", "integration developer"]) && aiContext) {
    reasons.push("AI systems role");
  }
  if (hasAnyTerm(title, ["vibe coder", "vibe code"]) ||
    (allowsImplementationRoles && containsIntentTerm(title, "ai implementation")) ||
    (allowsEnablementRoles && containsIntentTerm(title, "ai enablement"))) {
    reasons.push("target role shape");
  }

  return { matched: Boolean(reasons.length), reasons: [...new Set(reasons)] };
}


function cleanJobTitleForSearch(title = "") {
  return normalizeText(title)
    .replace(/\([^)]*\)/g, " ")
    .split(/\s[-|–—]\s|,/)[0]
    .replace(/\b(senior|sr\.?|staff|lead|principal|manager|director|head of|mid-market|enterprise|east|west|emea|us|usa|north america)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function updateSourceQueryHint() {
  if (!elements.sourceForm?.query) return;
  const query = profileDefaultQuery();
  elements.sourceForm.query.placeholder = query || "Profile target titles, keywords, and location";
}

function currentAgentConfig() {
  const apiKey = elements.agentApiKey ? elements.agentApiKey.value.trim() : "";
  return {
    provider: agentConfig.provider || defaultAgentConfig.provider,
    model: agentConfig.model || providerDefaults[agentConfig.provider || "ollama"].model,
    baseUrl: agentConfig.baseUrl || "",
    apiKey
  };
}

function setAgentStatus(message, tone = "neutral") {
  if (!elements.agentConnectionStatus) return;
  elements.agentConnectionStatus.textContent = message;
  elements.agentConnectionStatus.dataset.tone = tone;
}

async function apiPost(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || `${response.status} ${response.statusText}`);
  }
  return data;
}

function renderAgentConfig() {
  if (!elements.agentConfigForm) return;
  const provider = providerDefaults[agentConfig.provider] ? agentConfig.provider : "ollama";
  agentConfig.provider = provider;
  elements.agentProvider.value = provider;
  elements.agentModel.value = agentConfig.model || providerDefaults[provider].model;
  elements.agentBaseUrl.value = agentConfig.baseUrl || "";
  elements.agentBaseUrl.placeholder = providerDefaults[provider].baseUrl || "Use orchestrator default";
  elements.agentProviderHelp.textContent = providerDefaults[provider].help;
  if (provider === "ollama") {
    elements.agentApiKey.value = "";
    elements.agentApiKey.disabled = true;
    elements.agentApiKey.placeholder = "No API key needed";
    elements.ollamaTools.hidden = false;
  } else {
    elements.agentApiKey.disabled = false;
    elements.agentApiKey.placeholder = "Optional session key; env vars are preferred";
    elements.ollamaTools.hidden = true;
  }
  setAgentStatus(`Provider: ${providerDefaults[provider].label}. Model: ${elements.agentModel.value}.`, "neutral");
}

function saveAgentConfigFromForm() {
  const provider = elements.agentProvider.value;
  agentConfig = {
    provider,
    model: normalizeText(elements.agentModel.value || providerDefaults[provider].model),
    baseUrl: normalizeText(elements.agentBaseUrl.value)
  };
  saveAgentConfig();
  renderAgentConfig();
  setAgentStatus("Agent settings saved. API keys are not stored in browser localStorage.", "success");
}

async function testAgentConnection() {
  saveAgentConfigFromForm();
  setAgentStatus("Testing orchestrator connection...", "neutral");
  elements.testAgentButton.disabled = true;
  try {
    const result = await apiPost("/api/agent/test", { config: currentAgentConfig() });
    setAgentStatus(`${result.summary || "Connected"} using ${result.provider} / ${result.model}.`, "success");
  } catch (error) {
    setAgentStatus(`Agent test failed: ${error.message}`, "error");
  } finally {
    elements.testAgentButton.disabled = false;
  }
}

function renderOllamaModels(models = []) {
  if (!models.length) {
    elements.ollamaModelList.textContent = "No Ollama models found. Pull a model to make it available.";
    return;
  }
  elements.ollamaModelList.innerHTML = "";
  models.forEach((model) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "model-pill";
    button.textContent = model.name;
    button.title = model.size ? `${Math.round(model.size / 1024 / 1024 / 1024)} GB` : "Use this model";
    button.addEventListener("click", () => {
      elements.agentModel.value = model.name;
      saveAgentConfigFromForm();
    });
    elements.ollamaModelList.append(button);
  });
}

async function listOllamaModels() {
  saveAgentConfigFromForm();
  elements.listOllamaModelsButton.disabled = true;
  setAgentStatus("Listing models from Ollama...", "neutral");
  try {
    const result = await apiPost("/api/ollama/models", { config: currentAgentConfig() });
    renderOllamaModels(result.models);
    setAgentStatus(`Found ${result.models.length} Ollama model${result.models.length === 1 ? "" : "s"} at ${result.baseUrl}.`, "success");
  } catch (error) {
    setAgentStatus(`Could not list Ollama models: ${error.message}`, "error");
  } finally {
    elements.listOllamaModelsButton.disabled = false;
  }
}

async function pullOllamaModel() {
  saveAgentConfigFromForm();
  const model = elements.agentModel.value.trim();
  if (!model) {
    setAgentStatus("Enter an Ollama model name before pulling.", "error");
    return;
  }
  elements.pullOllamaModelButton.disabled = true;
  setAgentStatus(`Pulling ${model}. This can take a while for large models...`, "neutral");
  try {
    const result = await apiPost("/api/ollama/pull", { config: currentAgentConfig(), model });
    setAgentStatus(`${result.model} is available in Ollama.`, "success");
    await listOllamaModels();
  } catch (error) {
    setAgentStatus(`Could not pull ${model}: ${error.message}`, "error");
  } finally {
    elements.pullOllamaModelButton.disabled = false;
  }
}


function jobSearchText(input) {
  return [
    input.title,
    input.company,
    input.description,
    input.location,
    input.comp,
    input.sourceName
  ].join(" ");
}

function profileFilterState(input, signals = profileSignals()) {
  const text = jobSearchText(input);
  const blockedTerms = uniqueTerms([
    ...countTermMatches(text, signals.excludedKeywords),
    ...countTermMatches(text, signals.excludedIndustries),
    ...countTermMatches(input.company || "", signals.excludedCompanies),
    ...countTermMatches(input.location || "", signals.excludedLocations)
  ]);
  const requiredMatches = countTermMatches(text, signals.requiredKeywords);
  const missingRequired = signals.requiredKeywords.filter((term) => !requiredMatches.includes(term));
  const remoteMismatch = signals.remoteOnly && !isRemoteCompatibleJob(input);
  const regionMismatch = !isUsWorkCompatibleJob(input, profile);
  const intentMismatch = !jobMatchesProfileIntent(input, signals);

  return {
    blockedTerms,
    missingRequired,
    remoteMismatch,
    regionMismatch,
    intentMismatch
  };
}

function isFilteredOut(input) {
  const filterState = profileFilterState(input);
  return Boolean(filterState.blockedTerms.length || filterState.missingRequired.length || filterState.remoteMismatch || filterState.regionMismatch || filterState.intentMismatch);
}

function buildSourceSearchBrief(source) {
  const signals = profileSignals();
  const profileTerms = uniqueTerms([
    ...signals.titles,
    ...signals.desiredKeywords,
    ...signals.requiredKeywords,
    ...signals.preferredIndustries,
    ...signals.locations
  ]).slice(0, 12);
  const sourceTerms = splitTerms(source.query);
  const includeTerms = profileTerms.length ? profileTerms : sourceTerms;
  const excludedTerms = uniqueTerms([
    ...signals.excludedKeywords,
    ...signals.excludedCompanies,
    ...signals.excludedLocations,
    ...signals.excludedIndustries
  ]).slice(0, 12);
  const query = sourceDefaultQuery(source, signals);
  const sourceScope = sourceScopeQuery(source);

  return {
    query,
    includeTerms,
    excludedTerms,
    summary: [
      query ? `Default query: ${query}` : "Default query: source defaults",
      sourceScope ? `Source scope: ${sourceScope}` : "",
      profileTerms.length ? `Profile used for rating: ${profileTerms.join(", ")}` : "Profile used for rating: not configured",
      excludedTerms.length ? `Exclude: ${excludedTerms.join(", ")}` : "Exclude: none"
    ].filter(Boolean).join(". ")
  };
}

function appendPills(container, terms = [], emptyText = "Not set", className = "tag") {
  container.textContent = "";
  const visibleTerms = uniqueTerms(terms).filter(Boolean);
  if (!visibleTerms.length) {
    const empty = document.createElement("span");
    empty.className = "muted";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }
  visibleTerms.forEach((term) => {
    const pill = document.createElement("span");
    pill.className = className;
    pill.textContent = term;
    container.append(pill);
  });
}


function sourceScanKind(source = {}) {
  const combined = `${source.url || ""} ${source.notes || ""}`.toLowerCase();
  if (isDirectBoardSource(source)) return "Direct board";
  if (isManualWebSearchSource(source)) return "Manual search";
  if (combined.includes("{query}")) return "Query source";
  return "Manual review";
}

function isDirectBoardSource(source = {}) {
  return /boards-api\.greenhouse\.io|job-boards\.greenhouse\.io|boards\.greenhouse\.io|jobs\.lever\.co/i
    .test(`${source.url || ""} ${source.notes || ""}`);
}

function isManualWebSearchSource(source = {}) {
  const combined = `${source.type || ""} ${source.url || ""} ${source.notes || ""}`.toLowerCase();
  return combined.includes("search method: websearch")
    || combined.includes("google.com/search")
    || combined.includes("duckduckgo.com")
    || (source.type === "Search" && combined.includes("{query}"));
}

function sourceCanAutoScan(source = {}) {
  return isDirectBoardSource(source);
}

function sourceCountry(source = {}) {
  const explicit = normalizeText(source.country || source.region || source.market);
  if (explicit) return explicit;
  const combined = normalizeText(`${source.name || ""} ${source.query || ""} ${source.notes || ""} ${source.url || ""}`);
  if (!combined) return "Global";
  const matches = sourceCountryRules
    .filter(([, pattern]) => pattern.test(combined))
    .map(([label]) => label);
  return uniqueTerms(matches).slice(0, 2).join(" / ") || "Global";
}

function isAllowedSourceMarket(source = {}) {
  const country = sourceCountry(source).toLowerCase();
  return country.split("/").some((part) => {
    const label = part.trim();
    return label === "global" || label === "us" || label === "usa" || label === "u.s.";
  });
}


function addJob(input) {
  const evaluated = evaluateJob(input);
  const job = {
    id: input.id || createId("job"),
    createdAt: input.createdAt || new Date().toISOString(),
    title: normalizeText(input.title),
    company: normalizeText(input.company),
    url: normalizeText(input.url || ""),
    description: normalizeText(input.description),
    comp: normalizeText(input.comp || "Comp unknown"),
    location: normalizeText(input.location || "Location unknown"),
    sourceName: normalizeText(input.sourceName || "Manual intake"),
    notes: input.notes || [],
    ...evaluated
  };
  jobs = [job, ...jobs.filter((existing) => existing.url !== job.url || !job.url)];
  saveJobs();
  return job;
}


function setView(view) {
  elements.navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  elements.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
  elements.viewTitle.textContent = {
    command: "Command Center",
    scanner: "Scanner",
    rater: "Role Rater",
    applier: "Application Desk",
    tracker: "Pipeline Tracker",
    profile: "User Profile",
    sources: "Search Sources"
  }[view];
}

function fillList(container, items = []) {
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.append(li);
  });
}

function openHelp(topicKey = "overview") {
  const topic = helpTopics[topicKey] || helpTopics.overview;
  elements.helpEyebrow.textContent = topic.eyebrow;
  elements.helpTitle.textContent = topic.title;
  elements.helpBody.textContent = topic.body;
  fillList(elements.helpList, topic.bullets);
  elements.helpNextStep.textContent = topic.next;
  elements.helpModal.hidden = false;
}

function closeHelp() {
  elements.helpModal.hidden = true;
}

function openOnboarding(index = 0) {
  onboardingIndex = Math.max(0, Math.min(index, onboardingSteps.length - 1));
  elements.onboardingModal.hidden = false;
  renderOnboardingStep();
}

function closeOnboarding(markSeen = true) {
  elements.onboardingModal.hidden = true;
  if (markSeen) localStorage.setItem(ONBOARDING_KEY, "true");
}

function renderOnboardingStep() {
  const step = onboardingSteps[onboardingIndex];
  if (!step) return;
  setView(step.view);
  elements.onboardingEyebrow.textContent = step.eyebrow;
  elements.onboardingTitle.textContent = step.title;
  elements.onboardingBody.textContent = step.body;
  fillList(elements.onboardingList, step.bullets);
  elements.onboardingBackButton.disabled = onboardingIndex === 0;
  elements.onboardingNextButton.textContent = onboardingIndex === onboardingSteps.length - 1 ? "Finish" : "Next";
  elements.onboardingProgress.innerHTML = "";
  onboardingSteps.forEach((_, index) => {
    const bar = document.createElement("span");
    bar.classList.toggle("is-active", index <= onboardingIndex);
    elements.onboardingProgress.append(bar);
  });
}

function nextOnboardingStep() {
  if (onboardingIndex >= onboardingSteps.length - 1) {
    closeOnboarding(true);
    return;
  }
  onboardingIndex += 1;
  renderOnboardingStep();
}

function previousOnboardingStep() {
  onboardingIndex = Math.max(0, onboardingIndex - 1);
  renderOnboardingStep();
}

function maybeShowOnboarding() {
  if (isScreenshotMode()) return;
  if (!localStorage.getItem(ONBOARDING_KEY)) openOnboarding(0);
}


function createJobCard(job, actions = [], options = {}) {
  const template = document.getElementById("jobCardTemplate");
  const node = template.content.firstElementChild.cloneNode(true);
  if (options.selectable) {
    node.classList.add("is-selectable");
    node.tabIndex = 0;
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `View details for ${job.title} at ${job.company}`);
  }
  if (options.active) node.classList.add("is-selected");
  node.querySelector("h4").textContent = job.title;
  node.querySelector(".job-card-header p").textContent = `${job.company} - ${job.location} - ${job.comp}`;
  node.querySelector(".score-badge").textContent = `${job.score}/100`;
  const tagRow = node.querySelector(".tag-row");
  tagRow.textContent = "";
  job.tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag;
    tagRow.append(pill);
  });
  node.querySelector(".job-reason").textContent = job.reason;
  const actionWrap = node.querySelector(".card-actions");
  actions.forEach((action) => actionWrap.append(action));
  if (options.onSelect) {
    const select = (event) => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      options.onSelect(job);
    };
    node.addEventListener("click", select);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        options.onSelect(job);
      }
    });
  }
  return node;
}

function actionButton(label, handler, className = "status-button") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", handler);
  return button;
}


function createSourceSearchCard(sourceSearch) {
  const card = document.createElement("article");
  card.className = "source-search-card";
  const header = document.createElement("div");
  header.className = "source-search-header";
  header.innerHTML = `<div><div class="source-card-tags"><span class="tag"></span><span class="country-pill"></span></div><h4></h4></div><span class="score-badge"></span>`;
  header.querySelector(".tag").textContent = sourceSearch.scanKind;
  header.querySelector(".country-pill").textContent = sourceSearch.country;
  header.querySelector("h4").textContent = sourceSearch.name;
  header.querySelector(".score-badge").textContent = sourceSearch.type;

  const queryBlock = document.createElement("div");
  queryBlock.className = "source-query-block";
  queryBlock.innerHTML = `<span>Search query</span><p></p>`;
  queryBlock.querySelector("p").textContent = sourceSearch.query || "Source defaults";

  const reason = document.createElement("p");
  reason.className = "source-search-summary";
  reason.textContent = sourceSearch.canAutoScan
    ? `${sourceSearch.summary}. ${sourceSearch.notes}`
    : `${sourceSearch.summary}. Open this source manually; automated web-search scraping is unreliable from the container. ${sourceSearch.notes}`;

  const details = document.createElement("details");
  details.className = "source-search-details";
  details.innerHTML = "<summary>Scan logic</summary>";
  details.append(reason);

  const tags = document.createElement("div");
  tags.className = "tag-row";
  appendPills(tags, sourceSearch.intentPhrases.slice(0, 5), "No profile terms");

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const openLink = document.createElement("a");
  openLink.className = "primary-button";
  openLink.href = sourceSearch.url;
  openLink.target = "_blank";
  openLink.rel = "noreferrer";
  openLink.textContent = "Open search";
  actions.append(openLink);
  actions.append(actionButton("Edit source", () => editSource(sourceSearch.id)));

  card.append(header, queryBlock, tags, details, actions);
  return card;
}


function selectJobDetail(job) {
  selectedDetailJobId = job.id;
  renderRatedJobs();
}

function renderJobDetail(job) {
  elements.detailNav.innerHTML = "";
  elements.detailStats.innerHTML = "";
  elements.detailTags.innerHTML = "";
  elements.detailAccordion.innerHTML = "";
  elements.detailActions.innerHTML = "";
  if (!job) {
    elements.detailTitle.textContent = "Select a posting";
    elements.detailMeta.textContent = "Click any job in the list to inspect the full posting, source, score, and agent notes.";
    elements.detailAccordion.append(createDetailDisclosure("Details", "No job selected.", true));
    return;
  }

  elements.detailTitle.textContent = job.title;
  elements.detailMeta.textContent = `${job.company} - ${job.location} - ${job.comp}`;
  renderDetailNavigation(job);

  [
    ["Score", `${job.score}/100`],
    ["Status", job.status],
    ["Stage", job.stage],
    ["Source", job.sourceName || "Manual intake"]
  ].forEach(([label, value]) => {
    const item = document.createElement("div");
    item.innerHTML = `<span></span><strong></strong>`;
    item.querySelector("span").textContent = label;
    item.querySelector("strong").textContent = value;
    elements.detailStats.append(item);
  });

  (job.tags || []).forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag;
    elements.detailTags.append(pill);
  });

  elements.detailAccordion.append(
    createDetailDisclosure("Overview", buildOverviewList(job), true),
    createDetailDisclosure("Requirements", deriveRequirements(job), true),
    createDetailDisclosure("Agent rationale", job.reason || "No rationale saved."),
    createDetailDisclosure("Full description", formatJobDescription(job.description || "No description saved.")),
    createDetailDisclosure("Source and agent metadata", buildJobMetadata(job))
  );

  if (job.url) {
    const openLink = document.createElement("a");
    openLink.className = "status-button";
    openLink.href = job.url;
    openLink.target = "_blank";
    openLink.rel = "noreferrer";
    openLink.textContent = "Open source";
    elements.detailActions.append(openLink);
  }
  elements.detailActions.append(
    actionButton("More like this", (event) => findMoreLikeJob(job, event.currentTarget)),
    actionButton("Prepare pack", () => {
      selectedDraftJobId = job.id;
      updateJob(job.id, { stage: "ready", status: "ready" });
      setView("applier");
      preparePackWithAgent({ ...job, stage: "ready", status: "ready" });
    }, "primary-button"),
    actionButton("Pass", () => updateJob(job.id, { status: "pass", stage: "review" })),
    actionButton("Remove post", () => deleteJob(job.id), "danger-button")
  );
}

function renderDetailNavigation(job) {
  const visibleJobs = getVisibleRatedJobs();
  const index = visibleJobs.findIndex((item) => item.id === job.id);
  const count = visibleJobs.length;
  const previous = visibleJobs[index - 1];
  const next = visibleJobs[index + 1];

  const position = document.createElement("span");
  position.className = "detail-position";
  position.textContent = count ? `${index + 1} of ${count}` : "0 of 0";

  const previousButton = actionButton("Previous", () => {
    if (previous) selectJobDetail(previous);
  });
  previousButton.disabled = !previous;

  const nextButton = actionButton("Next", () => {
    if (next) selectJobDetail(next);
  });
  nextButton.disabled = !next;

  elements.detailNav.append(previousButton, position, nextButton);
}

function createDetailDisclosure(title, content, open = false) {
  const details = document.createElement("details");
  details.className = "detail-disclosure";
  details.open = open;
  const summary = document.createElement("summary");
  summary.textContent = title;
  const body = document.createElement("div");
  body.className = "detail-disclosure-body";

  if (Array.isArray(content)) {
    const list = document.createElement("ul");
    content.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
    body.append(list);
  } else if (content instanceof Node) {
    body.append(content);
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    body.append(paragraph);
  }

  details.append(summary, body);
  return details;
}

const descriptionHeadingPatterns = [
  /^about\b/i,
  /^about the role\b/i,
  /^about the job\b/i,
  /^about you\b/i,
  /^what you[’']ll do\b/i,
  /^what you'll do\b/i,
  /^what you will do\b/i,
  /^you will\b/i,
  /^you have\b/i,
  /^responsibilities\b/i,
  /^requirements\b/i,
  /^qualifications\b/i,
  /^preferred qualifications\b/i,
  /^nice to have\b/i,
  /^compensation\b/i,
  /^benefits\b/i,
  /^location\b/i,
  /^equal opportunity\b/i
];

function normalizeJobDescriptionText(description = "") {
  return String(description || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[•●▪]/g, "\n- ")
    .replace(/\s*(About the Role|About the Job|About You|What You’ll Do|What You'll Do|What you will do|You Will|Responsibilities|Requirements|Qualifications|Preferred Qualifications|Nice to Have|Compensation|Benefits|Location|Equal Opportunity)\b/g, "\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isDescriptionHeading(line = "") {
  const cleaned = line.replace(/:$/, "").trim();
  if (!cleaned || cleaned.length > 72) return false;
  return descriptionHeadingPatterns.some((pattern) => pattern.test(cleaned));
}

function descriptionSentences(text = "") {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function appendDescriptionParagraphs(container, text = "") {
  const sentences = descriptionSentences(text);
  if (!sentences.length) return;
  const chunks = [];
  for (let index = 0; index < sentences.length; index += 3) {
    chunks.push(sentences.slice(index, index + 3).join(" "));
  }
  chunks.forEach((chunk) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = chunk;
    container.append(paragraph);
  });
}

function appendDescriptionList(container, items = []) {
  const list = document.createElement("ul");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.replace(/^[-*]\s*/, "").trim();
    list.append(li);
  });
  container.append(list);
}

function flushDescriptionBuffer(section, buffer) {
  if (!buffer.length) return;
  const bulletItems = buffer.filter((line) => /^[-*]\s+/.test(line));
  const proseItems = buffer.filter((line) => !/^[-*]\s+/.test(line));
  if (proseItems.length) appendDescriptionParagraphs(section, proseItems.join(" "));
  if (bulletItems.length) appendDescriptionList(section, bulletItems);
  buffer.length = 0;
}

function formatJobDescription(description = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "formatted-description";
  const normalized = normalizeJobDescriptionText(description);
  if (!normalized) {
    const empty = document.createElement("p");
    empty.textContent = "No description saved.";
    wrapper.append(empty);
    return wrapper;
  }

  const lines = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  let section = document.createElement("section");
  const buffer = [];
  wrapper.append(section);

  lines.forEach((line) => {
    if (isDescriptionHeading(line)) {
      flushDescriptionBuffer(section, buffer);
      section = document.createElement("section");
      const heading = document.createElement("h4");
      heading.textContent = line.replace(/:$/, "");
      section.append(heading);
      wrapper.append(section);
      return;
    }
    buffer.push(line);
  });
  flushDescriptionBuffer(section, buffer);

  return wrapper;
}

function buildOverviewList(job) {
  return [
    `Company: ${job.company}`,
    `Location: ${job.location}`,
    `Compensation: ${job.comp}`,
    `Status: ${job.status}`,
    `Pipeline stage: ${job.stage}`,
    `Source: ${job.sourceName || "Manual intake"}`
  ];
}

function deriveRequirements(job) {
  if (Array.isArray(job.requirements) && job.requirements.length) return job.requirements;
  const description = normalizeText(job.description || "");
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const requirementSignals = [
    "required",
    "requirement",
    "must",
    "need",
    "needs",
    "experience",
    "years",
    "proficiency",
    "strong",
    "familiar",
    "skill",
    "build",
    "own",
    "lead",
    "work with",
    "using",
    "preferred"
  ];
  const explicit = sentences
    .filter((sentence) => requirementSignals.some((signal) => sentence.toLowerCase().includes(signal)))
    .slice(0, 8);
  if (explicit.length) return explicit;

  const signals = profileSignals();
  const skillMatches = countTermMatches(description, signals.skills).slice(0, 6);
  const inferred = [];
  if (skillMatches.length) inferred.push(`Likely skills: ${skillMatches.join(", ")}`);
  if (job.tags?.length) inferred.push(`Fit signals: ${job.tags.slice(0, 6).join(", ")}`);
  if (job.location) inferred.push(`Location requirement or preference: ${job.location}`);
  return inferred.length ? inferred : ["No explicit requirements were found in the saved description."];
}

function buildJobMetadata(job) {
  const items = [
    `Job ID: ${job.id}`,
    `Created: ${job.createdAt ? new Date(job.createdAt).toLocaleString() : "Unknown"}`,
    `URL: ${job.url || "Not set"}`,
    `Agent provider: ${job.agentProvider || "Local heuristic"}`,
    `Agent model: ${job.agentModel || "Not set"}`,
    `Agent reviewed: ${job.agentReviewedAt ? new Date(job.agentReviewedAt).toLocaleString() : "Not reviewed by LLM"}`
  ];
  return items;
}


function buildProfileTips(signals = profileSignals()) {
  const tips = [];
  const titlesText = signals.titles.join(" ").toLowerCase();
  const desiredText = signals.desiredKeywords.join(" ").toLowerCase();
  const excludedText = [
    ...signals.excludedKeywords,
    ...signals.excludedCompanies,
    ...signals.excludedLocations,
    ...signals.excludedIndustries
  ].join(" ").toLowerCase();
  const profileText = `${titlesText} ${desiredText}`;
  const bridgeTerms = ["solutions architect", "solutions engineer", "solution architect", "solution engineer", "forward deployed", "customer engineer", "sales engineer", "pre-sales", "post-sales", "customer success"];
  const builderTerms = ["engineer", "platform", "systems", "automation", "infrastructure", "developer", "internal tools", "devops", "linux", "cloud"];
  const aspirationalOnlyTerms = ["builder", "vibe coder", "vibe code"];
  const bridgeInProfile = bridgeTerms.filter((term) => containsIntentTerm(profileText, term)).slice(0, 4);
  const bridgeExcluded = bridgeTerms.filter((term) => containsIntentTerm(excludedText, term));
  const hasBuilderAnchor = builderTerms.some((term) => containsIntentTerm(profileText, term));
  const hasAspirationalOnly = signals.titles.some((term) => aspirationalOnlyTerms.some((aspirational) => containsIntentTerm(term.toLowerCase(), aspirational)));

  if (!signals.titles.length) {
    tips.push({
      tone: "warn",
      title: "Add target titles",
      body: "The scanner needs searchable job titles before it can separate good adjacent roles from random roles."
    });
  } else if (signals.titles.length < 4 || !hasBuilderAnchor || hasAspirationalOnly) {
    tips.push({
      tone: "warn",
      title: "Broaden title anchors",
      body: "Use 4-8 real titles such as AI Systems Engineer, Platform Engineer, Developer Productivity Engineer, or Internal Tools Engineer."
    });
  } else {
    tips.push({
      tone: "good",
      title: "Target titles look searchable",
      body: "Your target titles include real market language the scanner can use as role-shape anchors."
    });
  }

  if (bridgeInProfile.length) {
    tips.push({
      tone: "warn",
      title: "Bridge-role terms are in the search brief",
      body: `${bridgeInProfile.join(", ")} will invite Solutions/FDE/customer-facing matches. Move unwanted role families to exclusions.`
    });
  }

  if (!bridgeExcluded.length) {
    tips.push({
      tone: "warn",
      title: "Add hard exclusions for roles you dislike",
      body: "To keep Solutions/FDE out, exclude solutions architect, solutions engineer, forward deployed, customer engineer, sales engineer, pre-sales, and customer success."
    });
  } else {
    tips.push({
      tone: "good",
      title: "Exclusions are protecting the scan",
      body: "The scanner will remove jobs that contain your excluded role families before ranking."
    });
  }

  if (signals.requiredKeywords.length) {
    tips.push({
      tone: "warn",
      title: "Required keywords can collapse results",
      body: "Required keywords are all mandatory. If you only get one or two jobs, move most required terms into Desired keywords."
    });
  } else {
    tips.push({
      tone: "good",
      title: "No hard keyword gate",
      body: "Leaving Required keywords empty gives the scanner room to find adjacent career-change matches."
    });
  }

  if (signals.remoteOnly) {
    tips.push({
      title: "Remote-only narrows the pool",
      body: "Remote-only is useful, but it can hide strong onsite or hybrid AI/platform roles. Turn it off briefly if you want a market check."
    });
  }

  if (!signals.desiredKeywords.length || signals.desiredKeywords.length < 6) {
    tips.push({
      title: "Use desired keywords as soft direction",
      body: "Add soft terms like Claude, Codex, Gemini, LLM, automation, agentic DevOps, internal tools, developer tools, Linux, and cloud."
    });
  }

  return tips.slice(0, 6);
}

function renderSources() {
  elements.sourceList.innerHTML = "";
  if (!sources.length) {
    elements.sourceList.innerHTML = '<div class="empty-state">No sources yet. Add a job board or company search URL.</div>';
    return;
  }

  sources.forEach((source) => {
    const item = document.createElement("article");
    item.className = `source-item${source.enabled ? "" : " is-disabled"}`;
    const title = document.createElement("h4");
    title.textContent = source.name;
    const copy = document.createElement("p");
    copy.textContent = source.notes || source.url;
    const meta = document.createElement("div");
    meta.className = "source-meta";
    const searchBrief = buildSourceSearchBrief(source);
    [source.type, sourceCountry(source), source.enabled ? "Enabled" : "Disabled", searchBrief.query || "No query"].forEach((value) => {
      const pill = document.createElement("span");
      pill.className = value === sourceCountry(source) ? "country-pill" : "tag";
      pill.textContent = value;
      meta.append(pill);
    });
    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.append(
      actionButton("Edit", () => editSource(source.id), "primary-button"),
      actionButton(source.enabled ? "Disable" : "Enable", () => toggleSource(source.id)),
      actionButton("Delete", () => deleteSource(source.id))
    );
    item.append(title, copy, meta, actions);
    elements.sourceList.append(item);
  });
}

function updateJob(id, changes) {
  jobs = jobs.map((job) => (job.id === id ? { ...job, ...changes } : job));
  saveJobs();
  renderAll();
}

function deleteJob(id) {
  jobs = jobs.filter((job) => job.id !== id);
  if (selectedDraftJobId === id) selectedDraftJobId = null;
  if (selectedDetailJobId === id) selectedDetailJobId = jobs[0]?.id || null;
  saveJobs();
  renderAll();
}

function startNewSearch() {
  jobs = [];
  selectedDraftJobId = null;
  selectedDetailJobId = null;
  saveJobs();
  renderAll();
  setView("scanner");
}

function runHeuristicPipeline() {
  jobs = jobs.map((job) => {
    const evaluated = evaluateJob(job);
    return {
      ...job,
      ...evaluated,
      stage: evaluated.status === "ready" ? "ready" : evaluated.stage || "review"
    };
  });
  saveJobs();
  renderAll();
}

async function runPipeline() {
  if (!jobs.length) {
    setAgentStatus("Add or scan jobs before running the agent pipeline.", "neutral");
    return;
  }
  saveAgentConfigFromForm();
  elements.runPipelineButton.disabled = true;
  elements.runPipelineButton.textContent = "Agent running...";
  setAgentStatus("Asking the orchestrator to evaluate current jobs...", "neutral");
  try {
    const result = await apiPost("/api/agent/evaluate", {
      config: currentAgentConfig(),
      profile,
      jobs
    });
    const byId = new Map((result.jobs || []).map((job) => [job.id, job]));
    jobs = jobs.map((job) => {
      const evaluated = byId.get(job.id);
      return evaluated ? { ...job, ...evaluated } : job;
    });
    saveJobs();
    renderAll();
    setAgentStatus(`Agent reviewed ${result.jobs.length} role${result.jobs.length === 1 ? "" : "s"} using ${result.provider} / ${result.model}.`, "success");
  } catch (error) {
    runHeuristicPipeline();
    setAgentStatus(`Agent pipeline fell back to local heuristics: ${error.message}`, "error");
  } finally {
    elements.runPipelineButton.disabled = false;
    elements.runPipelineButton.textContent = "Run agent pipeline";
  }
}

function saveProfileFromForm() {
  const formData = new FormData(elements.profileForm);
  profile = { ...profile, ...Object.fromEntries(formData.entries()) };
  profile.remoteOnly = elements.profileForm.elements.remoteOnly?.checked || false;
  saveProfile();
  runHeuristicPipeline();
  renderProfile();
}

function clearSourceForm() {
  elements.sourceForm.reset();
  elements.sourceForm.id.value = "";
  elements.sourceForm.enabled.checked = true;
  updateSourceQueryHint();
}

function editSource(id) {
  const source = sources.find((item) => item.id === id);
  if (!source) return;
  elements.sourceForm.id.value = source.id;
  elements.sourceForm.name.value = source.name;
  elements.sourceForm.type.value = source.type;
  elements.sourceForm.url.value = source.url;
  elements.sourceForm.query.value = source.query;
  elements.sourceForm.country.value = source.country || "";
  elements.sourceForm.notes.value = source.notes;
  elements.sourceForm.enabled.checked = source.enabled;
  setView("sources");
}

function toggleSource(id) {
  sources = sources.map((source) => (source.id === id ? { ...source, enabled: !source.enabled } : source));
  saveSources();
  renderAll();
}

function deleteSource(id) {
  sources = sources.filter((source) => source.id !== id);
  if (!deletedSourceIds.includes(id)) {
    deletedSourceIds = [...deletedSourceIds, id];
    saveDeletedSourceIds();
  }
  saveSources();
  clearSourceForm();
  renderAll();
}

function saveSourceFromForm(event) {
  event.preventDefault();
  const formData = new FormData(elements.sourceForm);
  const source = Object.fromEntries(formData.entries());
  source.id = source.id || createId("source");
  source.enabled = elements.sourceForm.enabled.checked;
  source.name = normalizeText(source.name);
  source.url = normalizeText(source.url);
  source.query = normalizeText(source.query);
  source.country = normalizeText(source.country);
  source.notes = normalizeText(source.notes);
  if (!isAllowedSourceMarket(source)) {
    setAgentStatus("Source was not saved because the scanner is currently limited to Global or US sources.", "error");
    return;
  }

  const existing = sources.some((item) => item.id === source.id);
  sources = existing ? sources.map((item) => (item.id === source.id ? source : item)) : [source, ...sources];
  deletedSourceIds = deletedSourceIds.filter((deletedId) => deletedId !== source.id);
  saveDeletedSourceIds();
  saveSources();
  clearSourceForm();
  renderAll();
}

function exportJson() {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), profile, sources, jobs }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "jobhunter-export.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function handleResumeUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  profile.resumeFileName = file.name;
  const lowerName = file.name.toLowerCase();
  const canReadAsText = lowerName.endsWith(".txt") || lowerName.endsWith(".md") || lowerName.endsWith(".text") || lowerName.endsWith(".json");
  if (!canReadAsText) {
    saveProfile();
    renderProfile();
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    elements.profileForm.resumeText.value = String(reader.result || "");
    profile.resumeText = elements.profileForm.resumeText.value;
    saveProfile();
    runHeuristicPipeline();
    renderProfile();
  });
  reader.readAsText(file);
}

function renderAll() {
  renderMetrics();
  renderScanner();
  renderRatedJobs();
  renderApplyJobs();
  renderTracker();
  renderProfile();
  renderSources();
}

elements.navItems.forEach((item) => item.addEventListener("click", () => setView(item.dataset.view)));
elements.helpButtons.forEach((button) => button.addEventListener("click", () => openHelp(button.dataset.helpTopic)));
elements.openHelpButton.addEventListener("click", () => openHelp("overview"));
elements.restartOnboardingButton.addEventListener("click", () => openOnboarding(0));
elements.helpCloseButton.addEventListener("click", closeHelp);
elements.helpDoneButton.addEventListener("click", closeHelp);
elements.helpOnboardingButton.addEventListener("click", () => {
  closeHelp();
  openOnboarding(0);
});
elements.helpModal.addEventListener("click", (event) => {
  if (event.target === elements.helpModal) closeHelp();
});
elements.onboardingCloseButton.addEventListener("click", () => closeOnboarding(true));
elements.onboardingSkipButton.addEventListener("click", () => closeOnboarding(true));
elements.onboardingBackButton.addEventListener("click", previousOnboardingStep);
elements.onboardingNextButton.addEventListener("click", nextOnboardingStep);
elements.onboardingModal.addEventListener("click", (event) => {
  if (event.target === elements.onboardingModal) closeOnboarding(true);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!elements.helpModal.hidden) closeHelp();
  if (!elements.onboardingModal.hidden) closeOnboarding(true);
});
elements.ratingFilter.addEventListener("change", renderRatedJobs);
elements.newSearchButton.addEventListener("click", startNewSearch);
elements.scanButton.addEventListener("click", () => scanActiveSites());
elements.scanProfileButton.addEventListener("click", () => setView("profile"));
elements.scanSourcesButton.addEventListener("click", () => setView("sources"));
elements.runPipelineButton.addEventListener("click", () => runPipeline());
elements.exportButton.addEventListener("click", exportJson);
elements.agentProvider.addEventListener("change", () => {
  const provider = elements.agentProvider.value;
  agentConfig = {
    ...agentConfig,
    provider,
    model: providerDefaults[provider].model,
    baseUrl: providerDefaults[provider].baseUrl
  };
  renderAgentConfig();
});
elements.saveAgentConfigButton.addEventListener("click", saveAgentConfigFromForm);
elements.testAgentButton.addEventListener("click", () => testAgentConnection());
elements.listOllamaModelsButton.addEventListener("click", () => listOllamaModels());
elements.pullOllamaModelButton.addEventListener("click", () => pullOllamaModel());
elements.saveProfileButton.addEventListener("click", saveProfileFromForm);
elements.resumeUpload.addEventListener("change", handleResumeUpload);
elements.sourceForm.addEventListener("submit", saveSourceFromForm);
elements.clearSourceButton.addEventListener("click", clearSourceForm);
elements.resetButton.addEventListener("click", () => {
  jobs = [];
  selectedDraftJobId = null;
  selectedDetailJobId = null;
  saveJobs();
  renderAll();
});
elements.jobForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.jobForm);
  addJob(Object.fromEntries(formData.entries()));
  elements.jobForm.reset();
  renderAll();
  setView("rater");
});

applyScreenshotDemoState();
renderTimeline();
renderAgentConfig();
renderAll();
setView(initialView());
hydrateStateFromServer();
maybeShowOnboarding();
