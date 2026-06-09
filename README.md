# CI-AGENT / CI Dashboard

Public static dashboard for competitive-intelligence metrics built from CNBV regulatory files, Banxico FX, and generated JSON/JS artifacts.

## Public hosting

Target host: Cloudflare Pages.

Suggested Cloudflare Pages settings:

- Project name: `ci-agent-ci-dashboard`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`

## Data architecture

The public site contains only static assets and generated dashboard data. Secrets and raw processing stay outside the repo on the CI Agent VPS.

Pipeline source of truth on the VPS:

```text
/root/ci-project/ingestion/build_pipeline.py
/root/ci-project/ingestion/validate_pipeline.py
```

Generated public artifacts:

```text
generated/data_generated.js
generated/live_override.js
```

## Do not commit

```text
.env
Banxico token
DuckDB databases
raw CNBV source files unless intentionally publishing them
```
