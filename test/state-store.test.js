const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const test = require('node:test');
const { DatabaseSync } = require('node:sqlite');
const { createStateStore } = require('../state-store');
const run = promisify(execFile);

test('legacy JSON is imported once, preserved, and jobs can be queried', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jobhunter-migrate-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const legacy = { profile: { name: 'Test' }, jobs: [{ id: 'job1', status: 'applied' }] };
  fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify(legacy));
  const store = createStateStore(dir);
  assert.deepEqual(await store.loadState(), legacy);
  await store.saveState({ ...legacy, profile: { name: 'Updated' } });
  assert.equal((await createStateStore(dir).loadState()).profile.name, 'Updated');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'state.json'))), legacy);
  const db = new DatabaseSync(path.join(dir, 'state.sqlite3'));
  assert.equal(db.prepare("SELECT job_id FROM jobs WHERE status='applied'").get().job_id, 'job1');
  db.close();
});

test('concurrent processes commit complete snapshots without corruption', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jobhunter-concurrent-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  await createStateStore(dir).saveState({});
  const modulePath = require.resolve('../state-store');
  await Promise.all(Array.from({ length: 8 }, (_, i) => run(process.execPath, ['-e',
    `require(${JSON.stringify(modulePath)}).createStateStore(process.argv[1]).saveState({profile:{name:process.argv[2]},jobs:[{id:process.argv[2]}]})`, dir, String(i)])));
  const final = await createStateStore(dir).loadState();
  assert.equal(final.profile.name, final.jobs[0].id);
  const db = new DatabaseSync(path.join(dir, 'state.sqlite3'));
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
  db.close();
});

test('invalid legacy JSON fails visibly and is preserved', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jobhunter-corrupt-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'state.json'), '{bad');
  await assert.rejects(createStateStore(dir).loadState(), SyntaxError);
  assert.equal(fs.readFileSync(path.join(dir, 'state.json'), 'utf8'), '{bad');
});
