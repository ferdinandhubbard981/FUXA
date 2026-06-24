# agents.md — Quick onboarding for automated agents

Purpose
- Single-file summary to help automated agents quickly understand the repo layout, entry points, and where to look first. Designed to save tokens and avoid re-scanning unchanged areas.

High-level stack
- Backend: Node.js (CommonJS) — code under `server/`.
- Frontend: Angular SPA — code under `client/`.
- Desktop UI: Electron app — `app/electron/`.
- Integrations: Node-RED custom nodes under `node-red/node-red-contrib-fuxa/`.
- Deployment: Docker resources at repo root (`compose.yml`, `Dockerfile`).

Canonical entry points & folders (search priority)
1. `server/api/` — API route handlers and controllers (first stop for endpoint logic).
2. `server/docs/openapi.yaml` — canonical API specification (use this before scanning code).
3. `server/main.js` — server process entry.
4. `server/runtime/` — background jobs, scheduler, logger, runtime glue.
5. `client/src/` — Angular app source; `client/src/main.ts` boots the app.
6. `app/electron/` — Electron main and UI pages.
7. `node-red/node-red-contrib-fuxa/` — Node-RED nodes and wiring.
8. `docs/`, `README.md`, `CONTRIBUTING.md` — human docs and setup hints.

Config & runtime data
- Default runtime config: `server/settings.default.js`.
- Persisted settings & uploads: `server/_appdata/`.
- Data store: `server/_db/`.
- Logs: `server/_logs/`.
- Generated assets and large binary folders: `server/_images/`, `server/_webcam_snapshots/` (avoid scanning unless needed).

Common tasks (concise)
- Find canonical API: read `server/docs/openapi.yaml` first, then `server/api/` for implementation.
- Run/build: check `package.json` in each component (`server/`, `client/`, `app/electron/`) for exact `start`, `dev`, and `build` scripts.
- Containerized run: use `compose.yml` and `Dockerfile` at repo root.
- Tests: see `test/` and `client/e2e/` for integration/e2e tests.

Token- and context-saving heuristics
- Prefer `server/docs/openapi.yaml` and `server/settings.default.js` for API/config questions.
- Restrict full-text searches to the prioritized folders above.
- Skip large binary directories (`server/_images/`, `_webcam_snapshots/`) unless investigating assets.
- When changing APIs, update `openapi.yaml` and client code together; run tests in `test/` and `client/e2e/`.

Safety & modification rules (agents)
- Do NOT modify `server/_db/` or `server/_appdata/` without explicit instruction.
- Avoid mass refactors across backend and frontend in a single change; break into small, testable PRs.

Where to look for more context
- High-level: `README.md`, `docs/`.
- Implementation: `server/api/`, `server/runtime/`, `client/src/app/`.

Quick search order (recommended)
1. `server/docs/openapi.yaml`
2. `server/api/`
3. `server/runtime/`
4. `client/src/`
5. `app/electron/`
6. `node-red/node-red-contrib-fuxa/`

If stuck
- Read `README.md` and `docs/` for the intended behavior; consult `server/settings.default.js` for default config and environment expectations.

(End of agents summary)