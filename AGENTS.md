# Development notes for Security Scorecard MCP

This document provides guidance for working on the MCP repository.

## Goals
- Provide a **rock solid setup** experience for non-developers, primarily targeting Windows&nbsp;11.
- Ensure the MCP exposes tools that allow an LLM to query SecurityScorecard data and assemble remediation reports.
- Support grouping findings by category and per asset so SMEs and project managers can plan improvements.

## Quick setup
1. Install **Node.js 18+**.
2. Run `setup.ps1` (Windows) or `setup.sh` (Linux/macOS).
   - The script asks for your company domain and API token.
   - These values are stored in `.env` for subsequent runs.
   - Pass `--dev`/`-Dev` to install the latest development build instead of the
     stable release.
3. Start the server with `node build/index.js`.

## Release channels
`setup.*` and `scripts/update.*` download prebuilt files from GitHub releases.
They default to the latest stable release. Supply `--dev` (or `-Dev` on Windows)
to fetch the most recent development build instead.

## Developing and building
1. Clone the repository and install dependencies:
   ```powershell
   npm install
   ```
2. The server entry point lives in `build/index.js`. New functionality can be added directly or by creating TypeScript files under a `src/` folder and compiling with `npx tsc`.
3. When implementing new MCP tools, mirror the patterns already used in `build/index.js`. Tools should return a short Markdown summary followed by a JSON code block for the LLM.
4. Use `build_docs/api_test_tool.js` to validate API endpoints before adding them to the server.
5. Keep `setup.ps1` in sync with any new environment variables or configuration settings so non-developers have a smooth experience.

## Suggested next steps
- Add helper tools to query findings by asset and by category.
- Expose a function that collects all findings for a domain and outputs remediation recommendations grouped by factor.
- Document new capabilities in `README.md` and provide examples for Windows&nbsp;11 users.

## Current priorities
- **Fix API endpoint paths** so all tools call the documented `/companies/{scorecard_identifier}/issues/active` and `/historical` routes.
- **Parse API responses using the `data` + `pagination` structure** while keeping backward compatibility with legacy `entries` responses.
- **Implement robust pagination** that follows `pagination.has_next` for page-based and `next_cursor` for cursor-based endpoints.
- Update tests and documentation to reflect these changes and emphasize the new `status` parameter for active vs. historical issues.

## Testing and debugging
- Coordinate testing with Claude Desktop using `live-scorecard-server/test-plan.md`.
- Before testing, rebuild the server with `npm run build` and start it via `node build/index.js`.
- Claude should follow the test plan and produce a markdown report summarizing pass/fail results for each tool.
