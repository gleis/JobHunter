const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

function createStateStore(dataDir) {
  function withDatabase(operation) {
    fs.mkdirSync(dataDir, { recursive: true });
    const db = new DatabaseSync(path.join(dataDir, "state.sqlite3"));
    try {
      db.exec("PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;");
      db.exec("CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL);" +
        "CREATE TABLE IF NOT EXISTS jobs (position INTEGER PRIMARY KEY, job_id TEXT, status TEXT, payload TEXT NOT NULL);" +
        "CREATE INDEX IF NOT EXISTS jobs_status ON jobs(status);");
      db.exec("BEGIN IMMEDIATE");
      try {
        if (!db.prepare("SELECT id FROM state WHERE id=1").get()) {
          const legacy = path.join(dataDir, "state.json");
          if (fs.existsSync(legacy)) write(db, JSON.parse(fs.readFileSync(legacy, "utf8")));
        }
        const value = operation(db);
        db.exec("COMMIT");
        return value;
      } catch (error) { db.exec("ROLLBACK"); throw error; }
    } finally { db.close(); }
  }
  function write(db, payload) {
    db.prepare("INSERT INTO state(id,payload) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload")
      .run(JSON.stringify(payload));
    db.exec("DELETE FROM jobs");
    const insert = db.prepare("INSERT INTO jobs(position,job_id,status,payload) VALUES(?,?,?,?)");
    (Array.isArray(payload.jobs) ? payload.jobs : []).forEach((job, index) =>
      insert.run(index, String(job?.id ?? index), String(job?.status ?? ""), JSON.stringify(job)));
  }
  return {
    async loadState() {
      return withDatabase(db => JSON.parse(db.prepare("SELECT payload FROM state WHERE id=1").get()?.payload || "{}"));
    },
    async saveState(state) {
      const payload = { profile: state.profile || {}, jobs: Array.isArray(state.jobs) ? state.jobs : [],
        sources: Array.isArray(state.sources) ? state.sources : [],
        deletedSourceIds: Array.isArray(state.deletedSourceIds) ? state.deletedSourceIds : [],
        agentConfig: state.agentConfig || {}, updatedAt: new Date().toISOString() };
      return withDatabase(db => { write(db, payload); return payload; });
    }
  };
}
module.exports = { createStateStore };
