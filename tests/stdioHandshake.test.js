/**
 * Stdio handshake regression test.
 *
 * Spawns the built server and drives a 2025-era client handshake over stdio
 * (initialize -> notifications/initialized -> tools/list). Guards the
 * serveStdio factory wiring: every tool must be registered on the per-connection
 * McpServer instance, and the 2025-era path must keep working for clients
 * (Claude Desktop etc.) that have not moved to 2026-07-28.
 *
 * Skips when build/index.js is absent (run `npm run build` first).
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverPath = path.join(repoRoot, 'build', 'index.js');

const EXPECTED_TOOLS = [
  'security_dashboard',
  'analyze_security_risks',
  'create_improvement_plan',
  'discover_assets',
  'analyze_email_security',
  'api_discovery',
  'analyze_issue_types',
  'validate_data_completeness',
  'query_security_data'
];

function startServer() {
  const child = spawn(process.execPath, [serverPath], {
    env: { ...process.env, SECURITY_SCORECARD_API_TOKEN: 'test-token-not-used' },
    stdio: ['pipe', 'pipe', 'pipe']
  });
  const pending = new Map();
  let buffer = '';
  child.stdout.on('data', chunk => {
    buffer += chunk.toString();
    let nl;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      const msg = JSON.parse(line);
      if (msg.id !== undefined && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    }
  });
  const request = (id, method, params) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 10_000);
    pending.set(id, msg => { clearTimeout(timer); resolve(msg); });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
  const notify = (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  return { child, request, notify };
}

describe('stdio handshake (2025-era client)', { skip: !existsSync(serverPath) && 'build/index.js missing - run npm run build' }, () => {
  test('initialize negotiates a 2025-era version and tools/list exposes all 9 tools', async () => {
    const { child, request, notify } = startServer();
    try {
      const init = await request(1, 'initialize', {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'handshake-test', version: '0' }
      });
      assert.equal(init.error, undefined, `initialize failed: ${JSON.stringify(init.error)}`);
      assert.equal(init.result.protocolVersion, '2025-06-18');
      assert.equal(init.result.serverInfo.name, 'SSC MCP Server');
      assert.ok(init.result.capabilities.tools, 'server must advertise tools capability');

      notify('notifications/initialized');

      const list = await request(2, 'tools/list', {});
      assert.equal(list.error, undefined, `tools/list failed: ${JSON.stringify(list.error)}`);
      const names = list.result.tools.map(t => t.name).sort();
      assert.deepEqual(names, [...EXPECTED_TOOLS].sort());

      const dashboard = list.result.tools.find(t => t.name === 'security_dashboard');
      assert.equal(dashboard.inputSchema.type, 'object');
      assert.ok(dashboard.inputSchema.properties.domain, 'z.object() wrapping must still emit the domain property');
      assert.deepEqual(dashboard.inputSchema.properties.response_mode.enum, ['minimal', 'standard', 'detailed']);
    } finally {
      child.kill();
    }
  });
});
