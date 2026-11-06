const { execFileSync } = require("node:child_process");
const { readdirSync } = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
for (const file of ["server.js", "state-store.js", "app.js", "career-ops-sources.js",
  ...readdirSync(path.join(root, "modules")).filter(f => f.endsWith(".js")).map(f => `modules/${f}`)]) {
  execFileSync(process.execPath, ["--check", path.join(root, file)], { stdio: "inherit" });
}
