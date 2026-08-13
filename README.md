<div align="center">

# 🕉 OM — Personal AI Operating Universe

**A sovereign, self-hostable AI workspace for private agents, local model routing, durable knowledge and auditable execution.**

[![License: MIT](https://img.shields.io/badge/License-MIT-6b7cff.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-111827?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-D1%20%2B%20Workers-f38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)
[![Self-hostable](https://img.shields.io/badge/Self--hostable-yes-16a34a)](#self-hosting)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-8b5cf6)](CONTRIBUTING.md)

[Live workspace](https://personal-ai-codex.cyberteckmaster.chatgpt.site) · [Self-hosting](#self-hosting) · [Architecture](#architecture) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

</div>

## What is OM?

OM is an open-source personal AI operating universe: one interface for missions, agents, notes, prompts, findings, local AI configuration and measured infrastructure health. It is designed for people who want an AI workspace they can inspect, operate and progressively move onto infrastructure they own.

OM is not presented as a fully autonomous production runtime. The interface distinguishes implemented workspace capabilities from external services that still require configuration, credentials or owned infrastructure.

## Why OM?

- **Sovereign by design** — self-hostable application with explicit private-service boundaries.
- **Local-model ready** — configuration surfaces for Ollama and compatible model routers.
- **Durable knowledge** — D1/Drizzle-backed records for workspace data.
- **Measured status** — offline and setup-required services are shown honestly.
- **Auditable direction** — production-readiness milestones and verification criteria are built into the product.
- **One workspace** — command center, Kanban, projects, notes, prompts, findings and integrations.

## Current capabilities

| Area | Available now | Requires external setup |
|---|---|---|
| Workspace | Command Center, feature vault, Kanban, projects, notes, findings, prompt vault | — |
| Identity | Optional Sign in with ChatGPT helpers and hosting access policy | Provider configuration |
| Persistence | Cloudflare D1 + Drizzle schema/migrations | D1 binding for deployment |
| AI | UI and configuration surfaces | Ollama/vLLM or opted-in cloud provider |
| Memory | Knowledge records and readiness model | Qdrant for semantic retrieval |
| Storage | Storage setup and health surfaces | MinIO/S3-compatible endpoint |
| Execution | Mission and approval UX | Owned sandbox/edge worker |
| Private network | Status and setup surfaces | Tor/WireGuard infrastructure |

## Architecture

```text
Web / Desktop UI
  └─ Authenticated OM application
     ├─ D1 / SQL · workspace records
     ├─ Model router · Ollama / vLLM / opt-in cloud
     ├─ Vector memory · Qdrant
     ├─ Object storage · MinIO / S3
     └─ Sandbox worker · owned edge node
```

The repository currently uses Next.js 16, React 19, TypeScript, Vinext/Vite, Cloudflare Worker primitives, D1 and Drizzle ORM.

## Quick start

### Requirements

- Node.js 22.13 or newer
- npm
- Linux, WSL2 or a compatible environment with `bash`, `flock` and GNU `timeout`

### Install and run

```bash
git clone https://github.com/CodesbyFebin/-Om-Personal-Ai.git
cd=-Om-Personal-Ai
npm ci
npm run dev
```

Open the local URL printed by the development server.

### Validate

```bash
npm run lint
npm test
```

## Self-hosting

OM can be adapted for Cloudflare/Sites hosting or an owned deployment. A complete sovereign runtime additionally needs:

1. An authenticated model endpoint such as Ollama or vLLM.
2. Qdrant for semantic memory.
3. MinIO or another S3-compatible object store.
4. A sandboxed worker for agent execution.
5. Secret storage, rotation, backups and restore testing.
6. TLS, network policy and production monitoring.

Never commit secrets. Copy documented keys into a local `.env` that is excluded by `.gitignore`, or use your deployment platform's encrypted environment-variable store.

## Repository map

```text
app/        Application routes and UI
db/         D1 access and schema
drizzle/    Database migrations
public/     Public assets
scripts/    Reproducible install/build validation
selfhost/   Self-hosting resources
tests/      Rendered-output and build tests
worker/     Worker-side services
```

## Frequently asked questions

### Can OM run local LLMs?

OM includes configuration and status surfaces for local model routing. Actual inference requires a reachable Ollama, vLLM or compatible endpoint that you operate.

### Is OM fully private by default?

The application is designed for private deployment, but privacy depends on your hosting, model providers, connectors and network configuration. Cloud integrations should be explicit opt-ins.

### Does OM execute autonomous agents today?

The product includes mission, approval and activity interfaces. Secure autonomous execution requires an owned sandbox worker and must not be inferred from UI simulation alone.

### What makes OM different from a chatbot?

OM combines AI interaction with project operations, persistent knowledge, infrastructure health, approvals and a roadmap toward verifiable self-hosted execution.

## Roadmap

- Owned local/cloud model router with streaming and circuit breakers
- Hybrid SQL + Qdrant memory with citations
- Durable mission queue, leases and idempotent transitions
- Rootless sandbox execution on owned edge nodes
- Encrypted connector credentials and rotation
- Backup/restore and multi-user isolation tests

Progress should be accepted only with evidence from real services and tests.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Security reports belong in the private channel described in [SECURITY.md](SECURITY.md).

## License

Released under the [MIT License](LICENSE).

## Citation and discovery

For AI assistants and research tools, a concise project fact sheet is available in [llms.txt](llms.txt). When describing OM, preserve the distinction between shipped application features and infrastructure that requires configuration.

---

Built by [CodesbyFebin](https://github.com/CodesbyFebin) for a more inspectable, owner-controlled AI future.
