# JobHunter

JobHunter is a local-first career management system for running a focused job search from one workspace: tune a profile, scan job sources, rate fit, prepare application packs, and track the pipeline.

The app is intentionally small: dependency-free browser UI, plain Node.js orchestrator, local state persistence, and optional provider-backed AI drafting through Ollama, OpenAI, Claude, or Gemini.

## What It Does

- Guided onboarding and contextual help for the full workflow.
- My Profile page for target titles, desired keywords, required keywords, exclusions, location, work authorization, resume text, and positioning.
- Search Sources page for enabled US/global job sites and company boards.
- Job Scanner that prioritizes direct Greenhouse/Lever-style boards and treats web-search sources as manual review sources.
- Job Rater that scores jobs against the profile, filters hard exclusions, and keeps resume overlap as supporting evidence.
- "More like this" search from a selected job.
- Full job description formatting for easier review.
- Job Applier for draft application packs.
- Job Tracker board for review, ready, applied, and interview stages.
- Orchestrator-backed state persistence for profile, jobs, sources, and agent settings.
- JSON export for portable search data.

## Quick Start

Run the Node orchestrator:

```bash
npm start
```

Open:

```text
http://127.0.0.1:8090
```

The app can also be viewed as static files for UI-only work, but provider calls, state mirroring, and scan endpoints require `npm start` or a container run.

## Test And Validate

Run syntax checks and the automated test suite:

```bash
npm run check
```

Run only tests:

```bash
npm test
```

The tests use Node's built-in test runner and do not require external services or network access. They cover:

- Remote-only and Remote US filtering.
- Rejection of non-US remote regions.
- Matching technical AI/builder roles for a career-change profile.
- Blocking unwanted Solutions/FDE/customer-facing roles unless explicitly requested.
- Exclusion filtering before jobs are returned.
- State API persistence.
- Static app shell availability for onboarding and help UI.

## Recommended Workflow

1. Open `My Profile`.
2. Add real target titles you would actually click.
3. Put soft search direction in `Desired keywords`.
4. Keep `Required keywords` empty until scans are healthy.
5. Put roles you never want in `Exclude keywords`.
6. Review or tune `Search Sources`.
7. Run `Job Scanner`.
8. Triage results in `Job Rater`.
9. Prepare applications in `Job Applier`.
10. Move opportunities through `Job Tracker`.

For an AI builder/platform search, a good starter shape is:

```text
Target titles:
AI Systems Engineer, AI Automation Engineer, Developer Productivity Engineer,
Platform Engineer, Internal Tools Engineer

Desired keywords:
Claude, Codex, Gemini, LLM, automation, agentic DevOps,
infrastructure automation, developer tools, internal tools, Linux

Exclude keywords:
solutions architect, solutions engineer, forward deployed, customer engineer,
sales engineer, pre-sales, customer success
```

## Agent Orchestrator

The orchestrator is `server.js`. It serves the app and brokers provider calls so API keys do not have to live in browser storage.

Default provider:

- Ollama
- Model: `llama3.1:8b`
- Base URL: `http://127.0.0.1:11434`

Optional provider env vars:

```bash
cp .env.example .env
# edit .env if using hosted providers
```

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `OLLAMA_BASE_URL`
- `JOBHUNTER_OLLAMA_MODEL`
- `JOBHUNTER_OLLAMA_MEMORY`
- `JOBHUNTER_OLLAMA_CPUS`
- `JOBHUNTER_OLLAMA_STORE`
- `JOBHUNTER_DATA_STORE`

Session API keys entered in the UI are sent only to the local orchestrator and are not stored in browser localStorage.

## Persistence

Browser localStorage holds the active UI state. The orchestrator also mirrors profile, jobs, sources, deleted source IDs, and agent settings to:

```text
~/.jobhunter/data/state.json
```

In a plain `npm start` run, the default server data directory is:

```text
.jobhunter-data/state.json
```

That local directory is ignored by Git.

## Apple Container First

Apple Container is the preferred local container runtime for this project. The Apple stack starts two containers:

- `jobhunter-ollama`, running the official `ollama/ollama` image.
- `jobhunter-orchestrator`, running the JobHunter app and provider broker.

```bash
./scripts/run-orchestrator.sh apple
```

This builds `jobhunter-orchestrator` from `Containerfile` and publishes:

```text
http://127.0.0.1:8090
```

It also publishes Ollama to:

```text
http://127.0.0.1:11434
```

Inside the Apple Container network, the orchestrator talks to Ollama at:

```text
http://jobhunter-ollama.test:11434
```

Stop it with:

```bash
./scripts/stop-orchestrator.sh apple
```

Pull or list models from the host through the published Ollama API:

```bash
./scripts/ollama-model.sh pull llama3.1:8b
./scripts/ollama-model.sh list
```

## Docker Fallback

Use Docker when Apple Container is unavailable:

```bash
cp .env.example .env
./scripts/run-orchestrator.sh docker
```

Or with Compose:

```bash
docker compose up --build
```

Stop Docker mode with:

```bash
./scripts/stop-orchestrator.sh docker
```

## Clear Results And Rescan

To keep your profile and sources but clear current job results:

1. Open `Job Rater`.
2. Click `Clear Results`.
3. You will land back on `Job Scanner`.
4. Adjust My Profile or Search Sources if needed.
5. Click `Scan active sites`.

`Clear Results` only removes saved job posts. It does not delete your profile, sources, provider settings, or Ollama models.

## Project Layout

```text
app.js                 Browser app logic
server.js              Node orchestrator, API routes, provider calls, scanner logic
index.html             App shell
styles.css             App styling
career-ops-sources.js  Seeded source catalog
test/                  Node test suite
scripts/               Container and model helper scripts
Containerfile          Apple Container image
Dockerfile             Docker fallback image
compose.yaml           Docker Compose fallback
```

## Roadmap

- Add richer direct connectors for Ashby and more ATS APIs.
- Parse PDF/DOCX resumes server-side into structured candidate profiles.
- Add SQLite persistence beyond browser localStorage and JSON state mirroring.
- Generate tailored PDF application artifacts.
- Add scan evidence and an audit log for each agent action.
- Keep human approval before any submission.

## Product Principle

The app should feel like a calm career desk: the system searches, sorts, drafts, and remembers; the user decides what gets sent.
