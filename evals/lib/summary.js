// Prints a compact table of one eval run: pass or fail, provider, case and scores.
// Usage: npm run summary [evalId]   (defaults to the latest run)
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const id = process.argv[2] ?? 'latest';
const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'promptfoo-')), 'eval.json');
execFileSync('npx', ['promptfoo', 'export', 'eval', id, '-o', file], { stdio: 'ignore' });
const { evalId, results } = JSON.parse(fs.readFileSync(file, 'utf8'));

const rows = results.results
  .map((r) => {
    const out = r.response?.output;
    const scores = out && typeof out === 'object' && out.scores
      ? Object.entries(out.scores).map(([k, v]) => `${k}=${v}`).join(' ')
      : '';
    const failedChecks = (r.gradingResult?.componentResults ?? [])
      .filter((c) => !c.pass && c.assertion?.value)
      .map((c) => `failed: ${c.assertion.value}`);
    const why = r.success ? '' : failedChecks.join('; ') || (r.error ?? '').split('\n')[0].slice(0, 120);
    return [r.success ? 'PASS' : 'FAIL', r.provider.label ?? r.provider.id, r.testCase.description, scores, why];
  })
  .sort((a, b) => a[1].localeCompare(b[1]) || a[2].localeCompare(b[2]));

const passed = rows.filter((r) => r[0] === 'PASS').length;
console.log(`${evalId}: ${passed}/${rows.length} passed\n`);
const width = [4, Math.max(...rows.map((r) => r[1].length)), Math.max(...rows.map((r) => r[2].length))];
for (const [status, provider, test, scores, why] of rows) {
  console.log([status, provider.padEnd(width[1]), test.padEnd(width[2]), scores].join('  '));
  if (why) console.log(`      ${why}`);
}
