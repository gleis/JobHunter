// Read-only check of the seeded public Greenhouse/Lever API endpoints.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const catalog = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'career-ops-sources.js'), 'utf8') + '\ncareerOpsSources');
(async () => {
  const results = [];
  for (const source of catalog) {
    if (source.enabled === false) continue;
    let url;
    const greenhouse = source.url.match(/(?:job-boards(?:\.eu)?|boards)\.greenhouse\.io\/([^/?#]+)/i);
    const lever = source.url.match(/jobs\.lever\.co\/([^/?#]+)/i);
    if (greenhouse) url = `https://boards-api.greenhouse.io/v1/boards/${greenhouse[1]}/jobs`;
    if (lever) url = `https://api.lever.co/v0/postings/${lever[1]}?mode=json`;
    if (!url) continue;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const data = response.ok ? await response.json() : null;
      const jobs = lever ? data : data?.jobs;
      results.push({ id: source.id, url, status: response.status, valid: response.ok && Array.isArray(jobs), count: Array.isArray(jobs) ? jobs.length : null });
    } catch (error) {
      results.push({ id: source.id, url, valid: false, error: error.message });
    }
  }
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
  if (results.some(result => !result.valid)) process.exitCode = 1;
})();
