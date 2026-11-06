const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { Readable } = require("node:stream");
const test = require("node:test");

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "jobhunter-test-"));

const {
  createServer,
  isRemoteCompatibleJob,
  isUsWorkCompatibleJob,
  rankJobLeads,
  scoreJobLead
} = require("../server");

function baseProfile(overrides = {}) {
  return {
    targetTitles: "AI systems specialist, vibe coder, builder",
    desiredKeywords: "vibe code, claude, codex, gemini, linux admin, builder",
    requiredKeywords: "",
    preferredIndustries: "",
    excludedKeywords: "",
    excludedCompanies: "",
    excludedLocations: "",
    excludedIndustries: "",
    location: "Remote US",
    remoteOnly: true,
    workAuth: "US citizen",
    skills: "Linux, cloud, bash, python, automation",
    resumeText: "Senior DevOps engineer using Linux, cloud, Python, Bash, automation, Claude, Codex, and Gemini.",
    ...overrides
  };
}

function job(overrides = {}) {
  return {
    title: "Software Engineer, AI Agents",
    company: "Example AI",
    url: "https://example.com/jobs/ai-agents",
    location: "Remote - United States",
    comp: "Comp unknown",
    sourceName: "Example",
    description: "Build LLM agent automation, internal tools, Linux cloud workflows, and Python services.",
    ...overrides
  };
}

function closeIfOpen(server) {
  return new Promise((resolve, reject) => {
    if (!server.listening) {
      resolve();
      return;
    }
    server.close((error) => error ? reject(error) : resolve());
  });
}

function invoke(server, { method = "GET", url = "/", body } = {}) {
  const handler = server.listeners("request")[0];
  const rawBody = body === undefined ? "" : JSON.stringify(body);
  const req = new Readable({
    read() {
      this.push(rawBody || null);
      this.push(null);
    }
  });
  req.method = method;
  req.url = url;
  req.headers = {
    host: "127.0.0.1",
    "content-type": "application/json"
  };

  return new Promise((resolve) => {
    const chunks = [];
    const res = {
      statusCode: 200,
      headers: {},
      writeHead(statusCode, headers = {}) {
        this.statusCode = statusCode;
        this.headers = { ...this.headers, ...headers };
      },
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      write(chunk) {
        chunks.push(Buffer.from(chunk));
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.from(chunk));
        const text = Buffer.concat(chunks).toString("utf8");
        resolve({
          status: this.statusCode,
          headers: this.headers,
          text,
          json: () => JSON.parse(text)
        });
      }
    };
    handler(req, res);
  });
}

test("remote-only and Remote US filters accept US remote jobs", () => {
  const profile = baseProfile();
  const candidate = job();

  assert.equal(isRemoteCompatibleJob(candidate), true);
  assert.equal(isUsWorkCompatibleJob(candidate, profile), true);
});

test("Remote US profile rejects non-US remote regions", () => {
  const profile = baseProfile();

  assert.equal(isUsWorkCompatibleJob(job({ location: "Remote (Singapore)" }), profile), false);
  assert.equal(isUsWorkCompatibleJob(job({ title: "Forward Deployed Engineer APAC", location: "Remote, APAC" }), profile), false);
  assert.equal(isUsWorkCompatibleJob(job({ location: "Remote - US" }), profile), true);
});

test("career-change profile matches technical builder roles without requiring solutions roles", () => {
  const profile = baseProfile();
  const candidate = scoreJobLead(job(), profile, { name: "Example", intentPhrases: [] });

  assert.equal(candidate.intentMismatch, false);
  assert.equal(candidate.blockedTerms.length, 0);
  assert.ok(candidate.scanRelevance >= 0);
  assert.ok(candidate.scanMatches.includes("AI builder role") || candidate.scanMatches.includes("technical builder role"));
});

test("solutions and forward-deployed roles are not accepted unless profile asks for them", () => {
  const profile = baseProfile();
  const fde = scoreJobLead(job({
    title: "Forward Deployed Engineer, AI",
    url: "https://example.com/jobs/fde",
    description: "Work with customers on AI agent implementation and deployment."
  }), profile, { name: "Example", intentPhrases: [] });
  const solutions = scoreJobLead(job({
    title: "AI Solutions Engineer",
    url: "https://example.com/jobs/solutions",
    description: "Pre-sales customer engineering for AI platform deployments."
  }), profile, { name: "Example", intentPhrases: [] });

  assert.equal(fde.intentMismatch, true);
  assert.equal(solutions.intentMismatch, true);
});

test("rankJobLeads removes excluded roles before returning results", () => {
  const profile = baseProfile({
    excludedKeywords: "solutions engineer, forward deployed, customer success"
  });
  const results = rankJobLeads([
    job({ title: "AI Solutions Engineer", url: "https://example.com/jobs/solutions" }),
    job({ title: "Forward Deployed Engineer", url: "https://example.com/jobs/fde" }),
    job({ title: "Software Engineer, AI Agents", url: "https://example.com/jobs/ai-agents" })
  ], profile, 10, { name: "Example", intentPhrases: [] });

  assert.deepEqual(results.map((result) => result.title), ["Software Engineer, AI Agents"]);
});

test("state API saves and returns persisted profile data", async () => {
  const server = createServer();
  try {
    const payload = {
      state: {
        profile: baseProfile({ name: "Test User" }),
        jobs: [job()],
        sources: [],
        deletedSourceIds: [],
        agentConfig: { provider: "ollama", model: "qwen3:8b" }
      }
    };
    const saveResponse = await invoke(server, { method: "POST", url: "/api/state", body: payload });
    assert.equal(saveResponse.status, 200);
    const saved = saveResponse.json();
    assert.equal(saved.state.profile.name, "Test User");
    assert.equal(saved.state.jobs.length, 1);

    const getResponse = await invoke(server, { method: "GET", url: "/api/state" });
    assert.equal(getResponse.status, 200);
    const loaded = getResponse.json();
    assert.equal(loaded.state.profile.name, "Test User");
    assert.equal(loaded.state.jobs[0].title, "Software Engineer, AI Agents");
  } finally {
    await closeIfOpen(server);
  }
});

test("static app shell includes onboarding and help affordances", async () => {
  const server = createServer();
  try {
    const response = await invoke(server, { method: "GET", url: "/" });
    assert.equal(response.status, 200);
    const html = response.text;
    assert.match(html, /Start guide/);
    assert.match(html, /id="onboardingModal"/);
    assert.match(html, /id="helpModal"/);
    assert.match(html, /Career management system/i);
  } finally {
    await closeIfOpen(server);
  }
});
