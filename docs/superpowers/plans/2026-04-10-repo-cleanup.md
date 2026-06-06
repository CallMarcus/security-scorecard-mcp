# Repo Cleanup for SSC Sharing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dead weight, fix vulnerabilities, rename to single-server layout, and polish the repo for sharing with SecurityScorecard.

**Architecture:** Single MCP server (`src/index.ts`, renamed from `simplified-index.ts`). Remove the comprehensive 16-tool server, all backup files, and internal-only docs. Update deps to fix 7 CVEs (4 HIGH). Update README and CLAUDE.md to reflect the single-server reality.

**Tech Stack:** Node.js 18+, MCP SDK 1.29.0, TypeScript 5.9.3, esbuild

---

### Task 1: Delete dead files

**Files:**
- Delete: `src/index.ts` (comprehensive server, 1392 lines)
- Delete: `src/index.ts.backup` (5319 lines)
- Delete: `src/simplified-index.ts.backup` (1515 lines)
- Delete: `src/simplified-index.ts.old` (1515 lines)
- Delete: `DEPENDABOT_PR_REVIEW.md`
- Delete: `PR_DESCRIPTION.md`
- Delete: `ZOD_V4_TEST_REPORT.md`
- Delete: `RAG.md`
- Delete: `TEST-PLAN-CLAUDE-DESKTOP.md`

- [ ] **Step 1: Delete backup and old source files**

```bash
git rm src/index.ts src/index.ts.backup src/simplified-index.ts.backup src/simplified-index.ts.old
```

- [ ] **Step 2: Delete internal-only docs**

```bash
git rm DEPENDABOT_PR_REVIEW.md PR_DESCRIPTION.md ZOD_V4_TEST_REPORT.md RAG.md TEST-PLAN-CLAUDE-DESKTOP.md
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove comprehensive server, backups, and internal docs"
```

---

### Task 2: Delete dead tests

8 test files import `ScoreImpactSecurityScorecardServer` from the now-deleted `src/index.ts`. `validation_suite.test.ts` imports `@jest/globals` but Jest is not installed — it never ran. The `tests/api/` directory is empty.

**Files:**
- Delete: `tests/benchmarkGradeRequirements.test.ts`
- Delete: `tests/calculateFactorScoreImpact.test.ts`
- Delete: `tests/findHighImpactFindingsAcrossAssets.test.ts`
- Delete: `tests/getIssuesByRoi.test.ts`
- Delete: `tests/getQuickWins.test.ts`
- Delete: `tests/getScoreImprovementRoadmap.test.ts`
- Delete: `tests/makeRequest.test.ts`
- Delete: `tests/simulateScoreImprovement.test.ts`
- Delete: `tests/validation_suite.test.ts`
- Delete: `tests/api/` (empty directory)

- [ ] **Step 1: Delete dead test files**

```bash
git rm tests/benchmarkGradeRequirements.test.ts tests/calculateFactorScoreImpact.test.ts tests/findHighImpactFindingsAcrossAssets.test.ts tests/getIssuesByRoi.test.ts tests/getQuickWins.test.ts tests/getScoreImprovementRoadmap.test.ts tests/makeRequest.test.ts tests/simulateScoreImprovement.test.ts tests/validation_suite.test.ts
```

- [ ] **Step 2: Remove empty tests/api directory**

```bash
rm -rf tests/api
```

Note: `git rm` doesn't handle empty dirs; plain `rm -rf` is fine since git doesn't track directories.

- [ ] **Step 3: Verify surviving tests still pass**

```bash
npm test
```

Expected: `basic_validation.test.js` and `apiReferenceClientHybridSearch.test.js` both run (some may skip without API token, that's fine).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove dead tests (comprehensive server + broken Jest suite)"
```

---

### Task 3: Rename simplified-index.ts to index.ts

Now that the comprehensive server is gone, `simplified-index.ts` becomes `index.ts`. Update the class name, startup message, and all references.

**Files:**
- Rename: `src/simplified-index.ts` -> `src/index.ts`
- Modify: `src/index.ts` (the renamed file — class name, startup log)
- Modify: `package.json:5,10-12` (main entry, start scripts)

- [ ] **Step 1: Rename the file via git**

```bash
git mv src/simplified-index.ts src/index.ts
```

- [ ] **Step 2: Update class name and startup message in src/index.ts**

In `src/index.ts`, rename the class and update the log message:

- Change `class SimplifiedSecurityScorecardServer` to `class SecurityScorecardServer` (line 17)
- Change `new SimplifiedSecurityScorecardServer()` to `new SecurityScorecardServer()` (line 670)
- Change the startup log `"✅ SecurityScorecard MCP Server (Streamlined) running"` to `"SecurityScorecard MCP Server running"` (line 665)

- [ ] **Step 3: Update package.json**

Change `main` and npm scripts:

```json
"main": "build/index.js",
"scripts": {
    "build": "tsc",
    "build:fast": "esbuild src/*.ts src/**/*.ts --outdir=build --format=esm --platform=node --target=es2020",
    "start": "node build/index.js",
    "test": "node --test tests/*.test.js",
    "test:ts": "node --test tests/*.test.ts",
    "api:fetch": "bash tools/update_api_spec.sh",
    "api:generate": "python split_swagger.py",
    "api:embed": "node --loader ts-node/esm src/integration/api-reference-embeddings.ts",
    "api:test": "npm run test",
    "api:validate": "node examples/basic_usage.js",
    "api:update": "npm run api:generate && npm run api:embed",
    "api:full": "npm run api:fetch && npm run api:update && npm run build",
    "dev:api": "npm run api:update && npm run build",
    "validate": "python validate_mcp_tools.py",
    "validate:full": "powershell -ExecutionPolicy Bypass -File run_validation.ps1",
    "test:validation": "npm run test"
},
```

Removed: `start:original`, `start:simplified`. Changed: `main` and `start` point to `build/index.js`.

- [ ] **Step 4: Rebuild and verify**

```bash
npm run build:fast
npm test
```

Expected: Build succeeds, tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename simplified-index.ts to index.ts (single server)"
```

---

### Task 4: Fix vulnerabilities and update dependencies

**Files:**
- Modify: `package.json` (dependency versions)
- Regenerate: `package-lock.json`

- [ ] **Step 1: Remove unused `sharp` dependency**

```bash
npm uninstall sharp
```

`sharp` is not imported anywhere in `src/`. This removes a native binary dependency.

- [ ] **Step 2: Update MCP SDK to fix HIGH CVE (cross-client data leak)**

```bash
npm install @modelcontextprotocol/sdk@^1.29.0
```

- [ ] **Step 3: Update other outdated dependencies**

```bash
npm install dotenv@^17.4.1 zod@^4.3.6
npm install -D @types/node@^25.6.0 esbuild@^0.27.7
```

Note: Keep `esbuild` on 0.27.x (not 0.28.x) to avoid potential breaking changes in a cleanup PR. Keep `typescript` at 5.9.3 (already latest 5.x).

- [ ] **Step 4: Fix transitive vulnerabilities**

```bash
npm audit fix
```

This addresses the `hono`, `@hono/node-server`, `path-to-regexp`, `ajv`, `diff`, and `qs` CVEs via transitive dependency updates.

- [ ] **Step 5: Verify no remaining high/critical vulnerabilities**

```bash
npm audit
```

Expected: 0 high/critical vulnerabilities. Low/moderate from transitive deps are acceptable.

- [ ] **Step 6: Rebuild and test**

```bash
npm run build:fast
npm test
```

Expected: Build succeeds, tests pass with updated deps.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: fix 7 CVEs, remove unused sharp, update outdated packages"
```

---

### Task 5: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README.md**

Key changes:
1. Remove the "Comprehensive Version" section (lines 69-71) — that server no longer exists
2. Fix tool count: change "8 specialized tools" to the actual count (verify from `src/index.ts` tool registrations)
3. Update config example: change `build/simplified-index.js` to `build/index.js` (line 35)
4. Update "Project Structure" section: remove `simplified-index.ts` and `index.ts` dual listing, show single `index.ts`
5. Update "Testing" section: remove reference to `TEST-PLAN-CLAUDE-DESKTOP.md` (deleted)
6. Fix the tools table to match the actual registered tools in the renamed `src/index.ts`

- [ ] **Step 2: Verify no remaining references to "simplified" or "comprehensive"**

```bash
grep -in "simplified\|comprehensive\|streamlined" README.md
```

Expected: No matches (or only if used in a generic sense, not referencing the old dual-server setup).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README for single-server layout"
```

---

### Task 6: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update CLAUDE.md**

Key changes:
1. Remove the "Dual Server Design" framing from Overview — there's one server now
2. Remove all references to `simplified-index.ts`, `start:simplified`, `start:original`
3. Remove the "Comprehensive" server description under Architecture
4. Update "Adding a New Tool" section to reference `src/index.ts` (not `simplified-index.ts`)
5. Update the Project Structure tree to show single `index.ts`
6. Remove "Comprehensive version" from Tool Response Guidelines
7. Update dependency list: remove `sharp`, update MCP SDK version to ^1.29.0
8. Update npm scripts section: remove `start:original`, `start:simplified`

- [ ] **Step 2: Verify no stale references**

```bash
grep -in "simplified\|comprehensive\|16 tools\|start:original\|start:simplified\|sharp" CLAUDE.md
```

Expected: No matches.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for single-server layout and updated deps"
```

---

### Task 7: Final verification

- [ ] **Step 1: Clean rebuild**

```bash
rm -rf build
npm run build:fast
```

Expected: Build completes successfully.

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: All surviving tests pass.

- [ ] **Step 3: Check for any remaining references to deleted files**

```bash
grep -rn "simplified-index\|index\.ts\.backup\|\.ts\.old\|DEPENDABOT_PR_REVIEW\|PR_DESCRIPTION\|ZOD_V4\|TEST-PLAN-CLAUDE\|RAG\.md\|start:original\|start:simplified" --include="*.ts" --include="*.js" --include="*.json" --include="*.md" --include="*.ps1" --include="*.sh" --include="*.py" .
```

Expected: No matches in tracked files (may appear in `node_modules/`, that's fine).

- [ ] **Step 4: Verify npm audit is clean**

```bash
npm audit
```

Expected: 0 high/critical vulnerabilities.

- [ ] **Step 5: Verify the server starts**

```bash
echo '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}},"id":1}' | timeout 5 node build/index.js 2>/dev/null || true
```

Expected: Server starts and responds to the initialize message (may hang waiting for more input — that's expected for stdio transport; we just want no crash).

- [ ] **Step 6: Commit any fixups, if needed**

Only if previous steps revealed issues that needed fixing.
