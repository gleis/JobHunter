const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 8090);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, ".jobhunter-data");
const { loadState, saveState } = require("./state-store").createStateStore(DATA_DIR);

const providerDefaults = {
  ollama: {
    label: "Ollama",
    baseUrl: "http://127.0.0.1:11434",
    model: "qwen3:8b",
    envBaseUrl: "OLLAMA_BASE_URL"
  },
  openai: {
    label: "OpenAI",
    baseUrl: "https://api.openai.com",
    model: "gpt-4.1-mini",
    envKey: "OPENAI_API_KEY"
  },
  claude: {
    label: "Claude",
    baseUrl: "https://api.anthropic.com",
    model: "claude-3-5-sonnet-latest",
    envKey: "ANTHROPIC_API_KEY"
  },
  gemini: {
    label: "Gemini",
    baseUrl: "https://generativelanguage.googleapis.com",
    model: "gemini-2.5-flash",
    envKey: "GEMINI_API_KEY"
  }
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_500_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function cleanText(value = "", limit = 6000) {
  return String(value).replace(/\s+/g, " ").trim().slice(0, limit);
}

function normalizeConfig(config = {}) {
  const provider = providerDefaults[config.provider] ? config.provider : "ollama";
  const defaults = providerDefaults[provider];
  return {
    provider,
    label: defaults.label,
    baseUrl: String(config.baseUrl || process.env[defaults.envBaseUrl] || defaults.baseUrl).replace(/\/$/, ""),
    model: String(config.model || defaults.model),
    apiKey: config.apiKey || process.env[defaults.envKey] || ""
  };
}

function parseJsonFromText(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Provider returned an empty response");
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) return JSON.parse(fenced[1]);
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
    throw new Error("Provider response was not valid JSON");
  }
}

function toStatus(score) {
  if (score >= 78) return "ready";
  if (score >= 60) return "watch";
  return "pass";
}

function normalizeEvaluation(job, evaluated = {}) {
  const score = Math.max(0, Math.min(100, Number(evaluated.score || 0)));
  const status = ["ready", "watch", "pass"].includes(evaluated.status) ? evaluated.status : toStatus(score);
  return {
    id: job.id,
    score,
    status,
    stage: status === "ready" ? "ready" : "review",
    tags: Array.isArray(evaluated.tags) && evaluated.tags.length ? evaluated.tags.slice(0, 6).map(String) : ["AI reviewed"],
    reason: cleanText(evaluated.reason || "AI reviewed this role against the saved profile.", 900),
    agentProvider: evaluated.agentProvider,
    agentModel: evaluated.agentModel,
    agentReviewedAt: new Date().toISOString()
  };
}

async function callProvider(rawConfig, messages, options = {}) {
  const config = normalizeConfig(rawConfig);
  if (config.provider !== "ollama" && !config.apiKey) {
    throw new Error(`${config.label} needs an API key. Set ${providerDefaults[config.provider].envKey} or enter a key in the UI for this session.`);
  }

  if (config.provider === "ollama") return callOllama(config, messages, options);
  if (config.provider === "openai") return callOpenAI(config, messages, options);
  if (config.provider === "claude") return callClaude(config, messages, options);
  if (config.provider === "gemini") return callGemini(config, messages, options);
  throw new Error(`Unsupported provider: ${config.provider}`);
}

async function checkedFetch(url, fetchOptions) {
  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    throw new Error(`Could not reach ${url}: ${error.message}`);
  }
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 600)}`);
  }
  return text ? JSON.parse(text) : {};
}

async function checkedFetchText(url, fetchOptions = {}) {
  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    throw new Error(`Could not reach ${url}: ${error.message}`);
  }
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 600)}`);
  }
  return text;
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveDuckDuckGoHref(href = "") {
  const cleaned = decodeHtml(href);
  try {
    const url = cleaned.startsWith("//") ? new URL(`https:${cleaned}`) : new URL(cleaned);
    const redirected = url.searchParams.get("uddg");
    return redirected ? decodeURIComponent(redirected) : url.toString();
  } catch {
    return cleaned;
  }
}

function inferCompanyFromTitle(title = "", fallback = "") {
  const separators = [" - ", " | ", " at ", " @ "];
  for (const separator of separators) {
    if (title.includes(separator)) {
      const parts = title.split(separator).map((part) => part.trim()).filter(Boolean);
      if (separator.trim() === "at" || separator.trim() === "@") return parts.at(-1) || fallback;
      return parts.at(-1) || fallback;
    }
  }
  return fallback || "Unknown company";
}

function splitTerms(value = "") {
  return cleanText(value, 2000)
    .split(/[,;\n]/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function wordsFrom(value = "") {
  return cleanText(value, 2000)
    .toLowerCase()
    .match(/\b[a-z][a-z0-9#+.-]{2,}\b/g) || [];
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

function isTruthy(value) {
  return value === true || value === "true" || value === "on" || value === "1";
}

function isRemoteCompatibleJob(job = {}) {
  const locationText = cleanText(`${job.title || ""} ${job.location || ""}`, 1000).toLowerCase();
  const descriptionText = cleanText(job.description || "", 8000).toLowerCase();
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

function isUsWorkCompatibleJob(job = {}, profile = {}) {
  const profileLocation = cleanText(profile.location || "", 1000).toLowerCase();
  const auth = cleanText(profile.workAuth || "", 1000).toLowerCase();
  const wantsUsWork = /\bus\b|\bu\.s\.\b|\busa\b|united states|remote us|remote - us|north america|citizen|no sponsorship/.test(`${auth} ${profileLocation}`);
  if (!wantsUsWork) return true;
  const locationText = cleanText(`${job.title || ""} ${job.location || ""}`, 1000).toLowerCase();
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

function profileScanTerms(profile = {}) {
  const directTerms = [
    ...splitTerms(profile.targetTitles),
    ...splitTerms(profile.desiredKeywords),
    ...splitTerms(profile.requiredKeywords),
    ...splitTerms(profile.preferredIndustries),
    isTruthy(profile.remoteOnly) ? "remote" : ""
  ];
  const wordTerms = wordsFrom(directTerms.join(" "))
    .filter((word) => !["remote", "engineer", "specialist", "manager", "senior", "lead"].includes(word));
  return [...new Set([...directTerms.map((term) => term.toLowerCase()), ...wordTerms])].slice(0, 40);
}

function intentPhrases(profile = {}, source = {}) {
  return [
    ...splitTerms(profile.targetTitles),
    ...splitTerms(profile.desiredKeywords),
    ...splitTerms(profile.requiredKeywords),
    ...splitTerms(profile.preferredIndustries),
    ...(Array.isArray(source.intentPhrases) ? source.intentPhrases : [])
  ]
    .map((term) => cleanText(term, 120).toLowerCase())
    .filter((term) => term.length >= 4 && !genericIntentWords.has(term));
}

function sourceQueryWords(source = {}) {
  const query = cleanText(source.query || "", 1000)
    .replace(/\b(?:site|url|intitle|inurl):[^\s)]+/gi, " ")
    .replace(/\bOR\b/gi, " ");
  return wordsFrom(query).filter((word) => !genericIntentWords.has(word));
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsIntentTerm(text = "", term = "") {
  const cleaned = cleanText(term).toLowerCase();
  if (!cleaned) return false;
  if (cleaned.includes(" ")) return text.includes(cleaned);
  return new RegExp(`\\b${escapeRegExp(cleaned)}\\b`, "i").test(text);
}

function strongIntentWords(profile = {}, source = {}) {
  const hasStructuredIntent = Boolean(
    splitTerms(profile.targetTitles).length ||
    splitTerms(profile.desiredKeywords).length ||
    splitTerms(profile.requiredKeywords).length ||
    splitTerms(profile.preferredIndustries).length ||
    (Array.isArray(source.intentPhrases) && source.intentPhrases.length)
  );
  const text = [
    profile.targetTitles,
    profile.desiredKeywords,
    profile.requiredKeywords,
    profile.preferredIndustries,
    ...(Array.isArray(source.intentPhrases) ? source.intentPhrases : []),
    hasStructuredIntent ? "" : sourceQueryWords(source).join(" ")
  ].filter(Boolean).join(" ");
  return [...new Set(wordsFrom(text).filter((word) => !genericIntentWords.has(word) && word !== "ai"))].slice(0, 30);
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

function profileAllowsBridgeRoles(profile = {}) {
  const profileText = [
    profile.targetTitles,
    profile.desiredKeywords,
    profile.requiredKeywords,
    profile.preferredIndustries
  ].filter(Boolean).join(" ").toLowerCase();
  return hasAnyTerm(profileText, bridgeRoleTitleTerms);
}

function profileAllowsImplementationRoles(profile = {}) {
  const profileText = [
    profile.targetTitles,
    profile.desiredKeywords,
    profile.requiredKeywords,
    profile.preferredIndustries
  ].filter(Boolean).join(" ").toLowerCase();
  return hasAnyTerm(profileText, ["implementation", "technical onboarding", "deployment", "professional services"]);
}

function profileAllowsEnablementRoles(profile = {}) {
  const profileText = [
    profile.targetTitles,
    profile.desiredKeywords,
    profile.requiredKeywords,
    profile.preferredIndustries
  ].filter(Boolean).join(" ").toLowerCase();
  return hasAnyTerm(profileText, ["enablement", "evangelist", "developer advocate"]);
}

function technicalBuilderEvidence(job, profile = {}) {
  const title = cleanText(job.title || "").toLowerCase();
  const text = cleanText(`${job.title || ""} ${job.company || ""} ${job.location || ""} ${job.description || ""}`, 8000).toLowerCase();
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
    profile.targetTitles,
    profile.desiredKeywords,
    profile.skills,
    profile.resumeText
  ].filter(Boolean).join(" ").toLowerCase(), [
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

function roleFitEvidence(job, profile = {}, source = {}) {
  const title = cleanText(job.title || "").toLowerCase();
  const text = cleanText(`${job.title || ""} ${job.company || ""} ${job.location || ""} ${job.description || ""}`, 8000).toLowerCase();
  const phrases = [...new Set(intentPhrases(profile, source))];
  const reasons = [];
  if (!phrases.length) return { matched: true, reasons, phraseHits: [] };

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
  const allowsBridgeRoles = profileAllowsBridgeRoles(profile);
  const allowsImplementationRoles = profileAllowsImplementationRoles(profile);
  const allowsEnablementRoles = profileAllowsEnablementRoles(profile);
  reasons.push(...technicalBuilderEvidence(job, profile));

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

  return { matched: Boolean(reasons.length), reasons: [...new Set(reasons)], phraseHits: titlePhraseHits };
}

function matchIntent(job, profile = {}, source = {}) {
  const roleEvidence = roleFitEvidence(job, profile, source);
  if (roleEvidence.matched) {
    return { matched: true, phraseHits: roleEvidence.phraseHits, titleWordHits: roleEvidence.reasons, textWordHits: [] };
  }
  if (!intentPhrases(profile, source).length && !strongIntentWords(profile, source).length) {
    return { matched: true, phraseHits: [], titleWordHits: [], textWordHits: [] };
  }
  return { matched: false, phraseHits: [], titleWordHits: [], textWordHits: [] };
}

function scoreJobLead(job, profile = {}, source = {}) {
  const title = cleanText(job.title || "").toLowerCase();
  const text = cleanText(`${job.title || ""} ${job.company || ""} ${job.location || ""} ${job.description || ""}`, 6000).toLowerCase();
  const profileTerms = profileScanTerms(profile);
  let score = 0;
  const matched = [];
  const remoteMismatch = isTruthy(profile.remoteOnly) && !isRemoteCompatibleJob(job);
  const regionMismatch = !isUsWorkCompatibleJob(job, profile);
  const intent = matchIntent(job, profile, source);

  profileTerms.forEach((term) => {
    const lower = term.toLowerCase();
    if (!lower) return;
    if (title.includes(lower)) {
      score += lower.includes(" ") ? 22 : 8;
      matched.push(term);
    } else if (text.includes(lower)) {
      score += lower.includes(" ") ? 8 : 2;
      matched.push(term);
    }
  });

  ["ai", "llm", "agent", "automation", "developer tools", "internal tools", "infrastructure", "platform", "linux", "cloud", "python", "bash"].forEach((term) => {
    if (title.includes(term)) score += 8;
    else if (text.includes(term)) score += 2;
  });

  const excluded = [
    ...splitTerms(profile.excludedKeywords),
    ...splitTerms(profile.excludedCompanies),
    ...splitTerms(profile.excludedLocations),
    ...splitTerms(profile.excludedIndustries)
  ].filter(Boolean);
  const blocked = excluded.filter((term) => text.includes(term.toLowerCase()));
  if (blocked.length) score -= 100;
  if (remoteMismatch) score -= 100;
  if (regionMismatch) score -= 100;
  if (!intent.matched) score -= 100;
  score += Math.min(36, intent.phraseHits.length * 14 + intent.titleWordHits.length * 8);

  return {
    ...job,
    scanRelevance: score,
    scanMatches: [...new Set([...matched, ...intent.phraseHits, ...intent.titleWordHits])].slice(0, 8),
    blockedTerms: blocked,
    remoteMismatch,
    regionMismatch,
    intentMismatch: !intent.matched
  };
}

function rankJobLeads(jobs, profile = {}, limit = 8, source = {}) {
  const ranked = jobs
    .map((job) => scoreJobLead(job, profile, source))
    .filter((job) => job.scanRelevance >= 0 && !job.blockedTerms.length && !job.remoteMismatch && !job.regionMismatch && !job.intentMismatch)
    .sort((a, b) => b.scanRelevance - a.scanRelevance);

  const matched = ranked.filter((job) => job.scanRelevance > 0);
  return (matched.length ? matched : ranked).slice(0, limit);
}

function parseDuckDuckGoResults(html, source) {
  if (/anomaly-modal|Unfortunately, bots use DuckDuckGo too/i.test(html)) {
    throw new Error("DuckDuckGo returned a bot challenge");
  }
  const results = [];
  const blocks = html.split(/<div[^>]+class="[^"]*result[^"]*"[^>]*>/i).slice(1);
  for (const block of blocks) {
    const anchor = block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!anchor) continue;
    const snippetMatch = block.match(/<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      || block.match(/<div[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const url = resolveDuckDuckGoHref(anchor[1]);
    if (!url || url.includes("duckduckgo.com/y.js")) continue;
    const title = decodeHtml(anchor[2]);
    const snippet = decodeHtml(snippetMatch?.[1] || "");
    if (!title) continue;
    results.push({
      title,
      company: source.type === "Company" ? source.name : inferCompanyFromTitle(title, source.name),
      url,
      location: "Location unknown",
      comp: "Comp unknown",
      sourceName: source.name,
      description: cleanText(`${snippet || title} Source query: ${source.query}. Source notes: ${source.notes || "None."}`, 1800)
    });
    if (results.length >= 3) break;
  }
  return results;
}

function stripHtml(value = "") {
  return decodeHtml(String(value).replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n"));
}

function greenhouseBoardFromSource(source) {
  const text = `${source.url || ""} ${source.notes || ""}`;
  const apiMatch = text.match(/boards-api\.greenhouse\.io\/v1\/boards\/([^/\s]+)\/jobs/i);
  if (apiMatch) return apiMatch[1];
  const boardMatch = text.match(/(?:job-boards(?:\.eu)?|boards)\.greenhouse\.io\/([^/?#\s]+)/i);
  return boardMatch ? boardMatch[1] : "";
}

function leverCompanyFromSource(source) {
  const match = String(source.url || "").match(/jobs\.lever\.co\/([^/?#\s]+)/i);
  return match ? match[1] : "";
}

function isDirectJobBoardSource(source = {}) {
  return /boards-api\.greenhouse\.io|job-boards\.greenhouse\.io|boards\.greenhouse\.io|jobs\.lever\.co/i
    .test(`${source.url || ""} ${source.notes || ""}`);
}

async function scanGreenhouseSource(source) {
  const board = greenhouseBoardFromSource(source);
  if (!board) return [];
  const data = await checkedFetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`, {
    method: "GET",
    headers: { "accept": "application/json" }
  });
  return (data.jobs || []).map((job) => ({
    title: job.title || "Untitled role",
    company: source.name,
    url: job.absolute_url || source.url,
    location: job.location?.name || "Location unknown",
    comp: "Comp unknown",
    sourceName: source.name,
    description: cleanText(stripHtml(job.content || job.title || ""), 3000),
    requirements: extractRequirementLines(stripHtml(job.content || ""))
  }));
}

async function scanLeverSource(source) {
  const company = leverCompanyFromSource(source);
  if (!company) return [];
  const data = await checkedFetch(`https://api.lever.co/v0/postings/${company}?mode=json`, {
    method: "GET",
    headers: { "accept": "application/json" }
  });
  return (Array.isArray(data) ? data : []).map((job) => ({
    title: job.text || "Untitled role",
    company: source.name,
    url: job.hostedUrl || job.applyUrl || source.url,
    location: job.categories?.location || "Location unknown",
    comp: "Comp unknown",
    sourceName: source.name,
    description: cleanText(stripHtml(job.descriptionPlain || job.description || ""), 3000),
    requirements: extractRequirementLines(stripHtml([job.descriptionPlain, ...(job.lists || []).map((list) => `${list.text}: ${(list.content || "").replace(/<[^>]*>/g, " ")}`)].filter(Boolean).join("\n")))
  }));
}

function extractRequirementLines(text = "") {
  const lines = String(text)
    .split(/\n|•|- /)
    .map((line) => cleanText(line, 260))
    .filter((line) => line.length > 28);
  const signals = ["required", "requirements", "experience", "years", "proficient", "strong", "familiar", "skill", "must", "preferred", "you have", "you will"];
  return lines
    .filter((line) => signals.some((signal) => line.toLowerCase().includes(signal)))
    .slice(0, 8);
}

async function callOllama(config, messages, options) {
  const data = await checkedFetch(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
      format: options.json ? "json" : undefined,
      options: { temperature: options.temperature ?? 0.2 }
    })
  });
  return data.message?.content || "";
}

async function callOpenAI(config, messages, options) {
  const data = await checkedFetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${config.apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.2,
      response_format: options.json ? { type: "json_object" } : undefined
    })
  });
  return data.choices?.[0]?.message?.content || "";
}

async function callClaude(config, messages, options) {
  const system = messages.find((message) => message.role === "system")?.content || "";
  const userMessages = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({ role: message.role === "assistant" ? "assistant" : "user", content: message.content }));
  const data = await checkedFetch(`${config.baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: options.maxTokens || 1800,
      temperature: options.temperature ?? 0.2,
      system,
      messages: userMessages
    })
  });
  return data.content?.map((part) => part.text || "").join("\n") || "";
}

async function callGemini(config, messages, options) {
  const system = messages.find((message) => message.role === "system")?.content || "";
  const prompt = messages
    .filter((message) => message.role !== "system")
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n\n");
  const model = config.model.startsWith("models/") ? config.model : `models/${config.model}`;
  const data = await checkedFetch(`${config.baseUrl}/v1beta/${model}:generateContent`, {
    method: "POST",
    headers: {
      "x-goog-api-key": config.apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        responseMimeType: options.json ? "application/json" : "text/plain"
      }
    })
  });
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
}

function buildProfileSummary(profile = {}) {
  return {
    targetTitles: profile.targetTitles || "",
    location: profile.location || "",
    compensation: profile.compTarget || "",
    workAuth: profile.workAuth || "",
    skills: profile.skills || "",
    desiredKeywords: profile.desiredKeywords || "",
    requiredKeywords: profile.requiredKeywords || "",
    preferredIndustries: profile.preferredIndustries || "",
    excludedKeywords: profile.excludedKeywords || "",
    excludedCompanies: profile.excludedCompanies || "",
    excludedLocations: profile.excludedLocations || "",
    excludedIndustries: profile.excludedIndustries || "",
    positioning: profile.summary || "",
    resumeExcerpt: cleanText(profile.resumeText || "", 3500)
  };
}

async function handleAgentTest(req, res) {
  const body = await readJson(req);
  const config = normalizeConfig(body.config);
  const text = await callProvider(config, [
    { role: "system", content: "You are a concise connection tester. Return JSON only." },
    { role: "user", content: 'Return {"ok":true,"summary":"connected"} if you can respond.' }
  ], { json: true, maxTokens: 200 });
  const parsed = parseJsonFromText(text);
  sendJson(res, 200, {
    ok: Boolean(parsed.ok),
    summary: parsed.summary || `Connected to ${config.label}`,
    provider: config.provider,
    model: config.model
  });
}

async function handleStateGet(req, res) {
  const state = await loadState();
  sendJson(res, 200, { ok: true, state });
}

async function handleStateSave(req, res) {
  const body = await readJson(req);
  const state = await saveState(body.state || body);
  sendJson(res, 200, { ok: true, state });
}

function ollamaUrlFromConfig(rawConfig = {}) {
  const config = normalizeConfig({ ...rawConfig, provider: "ollama" });
  return config.baseUrl;
}

async function handleOllamaModels(req, res) {
  const body = await readJson(req);
  const baseUrl = ollamaUrlFromConfig(body.config);
  const data = await checkedFetch(`${baseUrl}/api/tags`, {
    method: "GET",
    headers: { "content-type": "application/json" }
  });
  sendJson(res, 200, {
    ok: true,
    baseUrl,
    models: (data.models || []).map((model) => ({
      name: model.name,
      size: model.size,
      modifiedAt: model.modified_at
    }))
  });
}

async function handleOllamaPull(req, res) {
  const body = await readJson(req);
  const baseUrl = ollamaUrlFromConfig(body.config);
  const model = cleanText(body.model || body.config?.model || "", 200);
  if (!model) throw new Error("Choose an Ollama model to pull.");
  const data = await checkedFetch(`${baseUrl}/api/pull`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: model, stream: false })
  });
  sendJson(res, 200, {
    ok: true,
    baseUrl,
    model,
    status: data.status || "pulled"
  });
}

async function scanSource(source, profile = {}, options = {}) {
  if (isDirectJobBoardSource(source)) {
    const directResults = [
      ...(await scanGreenhouseSource(source).catch(() => [])),
      ...(await scanLeverSource(source).catch(() => []))
    ];
    return rankJobLeads(directResults, profile, 8, source);
  }

  if (options.allowWebSearch !== true) return [];

  const query = cleanText(source.query || source.name, 500);
  if (!query) return [];
  const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const html = await checkedFetchText(searchUrl, {
    headers: {
      "user-agent": "JobHunter/0.1 (+local career search tool)",
      "accept": "text/html"
    }
  });
  return rankJobLeads(parseDuckDuckGoResults(html, source), profile, 8, source);
}

async function handleScan(req, res) {
  const body = await readJson(req);
  const sources = Array.isArray(body.sources) ? body.sources : [];
  const profile = body.profile || {};
  const allowWebSearch = body.allowWebSearch === true;
  const maxSources = Math.max(1, Math.min(Number(body.maxSources || 20), 80));
  const selectedSources = sources.slice(0, maxSources);
  const scanCandidates = allowWebSearch
    ? selectedSources
    : selectedSources.filter((source) => isDirectJobBoardSource(source));
  const skippedSources = selectedSources
    .filter((source) => !allowWebSearch && !isDirectJobBoardSource(source))
    .map((source) => ({ source: source.name, reason: "Manual web-search source" }));
  const settled = await Promise.allSettled(scanCandidates.map((source) => scanSource(source, profile, { allowWebSearch })));
  const jobs = [];
  const errors = [];
  const seenUrls = new Set();

  settled.forEach((result, index) => {
    const source = scanCandidates[index];
    if (result.status === "rejected") {
      errors.push({ source: source.name, error: result.reason.message });
      return;
    }
    result.value.forEach((job) => {
      if (seenUrls.has(job.url)) return;
      seenUrls.add(job.url);
      jobs.push({
        ...job,
        description: cleanText([
          job.description,
          job.scanMatches?.length ? `Scanner matched profile terms: ${job.scanMatches.join(", ")}.` : "",
          Number.isFinite(job.scanRelevance) ? `Scanner relevance: ${job.scanRelevance}.` : ""
        ].filter(Boolean).join(" "), 3000)
      });
    });
  });

  sendJson(res, 200, {
    ok: true,
    scannedSources: scanCandidates.length,
    requestedSources: selectedSources.length,
    skippedSources,
    jobs,
    errors
  });
}

async function handleEvaluate(req, res) {
  const body = await readJson(req);
  const config = normalizeConfig(body.config);
  const jobs = Array.isArray(body.jobs) ? body.jobs.slice(0, 20) : [];
  const rawProfile = body.profile || {};
  const profile = buildProfileSummary(rawProfile);
  const compactJobs = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    compensation: job.comp,
    sourceName: job.sourceName,
    description: cleanText(job.description, 1800)
  }));

  const text = await callProvider(config, [
    {
      role: "system",
      content: [
        "You are JobHunter's career operations evaluator.",
        "Rate jobs against the candidate profile, search brief, resume evidence, and exclusions.",
        "Respect required and excluded terms. If a role violates exclusions, score it low and status pass.",
        "Return JSON only with shape {\"jobs\":[{\"id\":\"\",\"score\":0,\"status\":\"ready|watch|pass\",\"tags\":[\"\"],\"reason\":\"\"}]}."
      ].join(" ")
    },
    {
      role: "user",
      content: JSON.stringify({ profile, jobs: compactJobs })
    }
  ], { json: true, maxTokens: 3200 });

  const parsed = parseJsonFromText(text);
  const byId = new Map((parsed.jobs || []).map((job) => [job.id, job]));
  const evaluatedJobs = jobs.map((job) => normalizeEvaluation(job, {
    ...(byId.get(job.id) || {}),
    agentProvider: config.label,
    agentModel: config.model
  })).map((evaluated, index) => {
    const job = jobs[index];
    const deterministic = scoreJobLead(job, rawProfile, {
      name: job.sourceName || "Existing job",
      intentPhrases: intentPhrases(rawProfile)
    });
    if (deterministic.blockedTerms?.length) {
      return {
        ...evaluated,
        score: 12,
        status: "pass",
        stage: "review",
        tags: ["excluded", ...deterministic.blockedTerms.slice(0, 3)],
        reason: `Filtered out because it matched excluded profile terms: ${deterministic.blockedTerms.join(", ")}.`
      };
    }
    if (deterministic.remoteMismatch) {
      return {
        ...evaluated,
        score: 18,
        status: "pass",
        stage: "review",
        tags: ["remote only"],
        reason: "Filtered out because Remote only is enabled and this role does not show a remote-work signal."
      };
    }
    if (deterministic.regionMismatch) {
      return {
        ...evaluated,
        score: 18,
        status: "pass",
        stage: "review",
        tags: ["region mismatch"],
        reason: "Filtered out because the role appears restricted to a non-US region while your profile indicates US work authorization."
      };
    }
    if (deterministic.intentMismatch) {
      return {
        ...evaluated,
        score: 22,
        status: "pass",
        stage: "review",
        tags: ["outside profile"],
        reason: "Filtered out because the role title and responsibilities do not match the saved target role shape closely enough."
      };
    }
    return evaluated;
  });

  sendJson(res, 200, {
    ok: true,
    provider: config.provider,
    model: config.model,
    jobs: evaluatedJobs
  });
}

async function handleDraft(req, res) {
  const body = await readJson(req);
  const config = normalizeConfig(body.config);
  const profile = buildProfileSummary(body.profile || {});
  const job = body.job || {};

  const text = await callProvider(config, [
    {
      role: "system",
      content: [
        "You are JobHunter's application pack writer.",
        "Create a practical application pack for a human to review before submitting.",
        "Do not claim the candidate has experience not supported by the profile.",
        "Return JSON only with shape {\"pack\":\"markdown text\"}."
      ].join(" ")
    },
    {
      role: "user",
      content: JSON.stringify({
        profile,
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          compensation: job.comp,
          sourceName: job.sourceName,
          score: job.score,
          tags: job.tags,
          reason: job.reason,
          description: cleanText(job.description, 2600)
        }
      })
    }
  ], { json: true, maxTokens: 3000 });

  const parsed = parseJsonFromText(text);
  sendJson(res, 200, {
    ok: true,
    provider: config.provider,
    model: config.model,
    pack: parsed.pack || text
  });
}

async function serveStatic(req, res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(ROOT, safePath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    const type = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "content-type": type, "content-length": data.length });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

function createServer() {
  return http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        dataDir: DATA_DIR,
        providers: Object.fromEntries(Object.entries(providerDefaults).map(([key, value]) => [key, {
          label: value.label,
          baseUrl: value.baseUrl,
          model: value.model,
          needsKey: Boolean(value.envKey),
          envConfigured: value.envKey ? Boolean(process.env[value.envKey]) : true
        }]))
      });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/state") return await handleStateGet(req, res);
    if (req.method === "POST" && url.pathname === "/api/state") return await handleStateSave(req, res);
    if (req.method === "POST" && url.pathname === "/api/agent/test") return await handleAgentTest(req, res);
    if (req.method === "POST" && url.pathname === "/api/agent/evaluate") return await handleEvaluate(req, res);
    if (req.method === "POST" && url.pathname === "/api/agent/draft") return await handleDraft(req, res);
    if (req.method === "POST" && url.pathname === "/api/scan") return await handleScan(req, res);
    if (req.method === "POST" && url.pathname === "/api/ollama/models") return await handleOllamaModels(req, res);
    if (req.method === "POST" && url.pathname === "/api/ollama/pull") return await handleOllamaPull(req, res);
    if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res, url.pathname);
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
  }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log(`JobHunter running at http://${HOST}:${PORT}`);
    console.log(`Default agent provider: Ollama at ${process.env.OLLAMA_BASE_URL || providerDefaults.ollama.baseUrl}`);
  });
}

module.exports = {
  createServer,
  cleanText,
  splitTerms,
  containsIntentTerm,
  isRemoteCompatibleJob,
  isUsWorkCompatibleJob,
  profileScanTerms,
  intentPhrases,
  scoreJobLead,
  rankJobLeads,
  normalizeEvaluation,
  parseDuckDuckGoResults,
  resolveDuckDuckGoHref,
  isDirectJobBoardSource,
  profileAllowsBridgeRoles,
  profileAllowsImplementationRoles,
  profileAllowsEnablementRoles,
  technicalBuilderEvidence
};
