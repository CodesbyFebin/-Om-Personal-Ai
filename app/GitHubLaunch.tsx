"use client";
import Link from "next/link";
import { useState } from "react";

const topics=["sovereign-ai","self-hosted","ai-workspace","personal-ai","nextjs","react","typescript","cloudflare-workers","d1-database","ai-agents","knowledge-management","productivity","privacy-first","open-source","developer-tools","ai-routing","llm-integration","ollama","docker","self-hosting"];
const description="Sovereign, self-hosted personal AI workspace with durable memory, audited missions, private integrations and owned infrastructure.";
const readme=`# 🕉 OM · Personal AI Operating Universe

[![Live](https://img.shields.io/badge/demo-live-22c55e)](https://personal-ai-codex.cyberteckmaster.chatgpt.site)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-14b8a6.svg)](CONTRIBUTING.md)
[![Readiness](https://img.shields.io/badge/readiness-7.2%2F10-6366f1)](https://personal-ai-codex.cyberteckmaster.chatgpt.site/production-readiness)

> ${description}

## Live workspace

[Open OM](https://personal-ai-codex.cyberteckmaster.chatgpt.site)

## Why OM

OM gives builders an owner-authenticated workspace for durable records, attributed audit events, bounded AI missions and explicit sovereign-service connections. It reports external services offline until authenticated probes succeed.

## Verified today

- Owner-authenticated web workspace
- D1-backed durable records with per-owner isolation
- Server-side validation and same-origin write protection
- Attributed audit events and live health API
- AI mission queue with explicit execution boundaries
- Production readiness and self-hosting guides

## Sovereign runtime targets

Ollama/vLLM, Qdrant, MinIO, Redis, PostgreSQL and the sandbox edge worker are opt-in self-host components. They are not presented as online without evidence.

## Development

\`\`\`bash
npm ci
npm run lint
npm run build
npm run dev
\`\`\`

See [the self-hosting guide](https://personal-ai-codex.cyberteckmaster.chatgpt.site/self-hosting-guide) for the owned-infrastructure path.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Security issues should be disclosed privately rather than posted publicly.

## License

MIT © Febin Francis / CyberTeck Labs`;
const contributing=`# Contributing to OM

Thank you for improving OM. Open an issue before large changes, keep pull requests focused, and preserve the product rule: no synthetic result may be presented as measured truth.

## Workflow
1. Fork the repository and create a descriptive branch.
2. Install with \`npm ci\`.
3. Make the smallest coherent change.
4. Run \`npm run lint && npm run build\`.
5. Document security, migration and user-facing effects in the PR.

## Security
Never commit credentials, tokens or personal data. Report vulnerabilities privately to the maintainer. Do not include exploit details in a public issue before remediation.

## Conduct
Be respectful, evidence-led and constructive. Harassment, spam and deceptive claims are not accepted.`;

export default function GitHubLaunch(){const[copied,setCopied]=useState("");const copy=async(id:string,value:string)=>{await navigator.clipboard.writeText(value);setCopied(id);setTimeout(()=>setCopied(""),1300)};return <main className="github-launch"><header><Link href="/">‹ Command Center</Link><div><small>OPEN-SOURCE LAUNCH CONTROL</small><h1>GitHub launch kit</h1><p>Everything needed to prepare OM’s repository identity, discovery metadata, documentation and community workflow—without claiming external actions were completed.</p></div><a href="https://github.com/CodesbyFebin/-Om-Personal-Ai" target="_blank" rel="noreferrer">Open current repository ↗</a></header><section className="github-overview"><article><small>TARGET NAME</small><h2>om-personal-ai-universe</h2><p>Rename in GitHub Settings → General. Existing GitHub links normally redirect, but update badges, clones and deployment integrations afterward.</p><button onClick={()=>copy("name","om-personal-ai-universe")}>{copied==="name"?"Copied ✓":"Copy name"}</button></article><article><small>ABOUT DESCRIPTION</small><h2>Optimized and truthful</h2><p>{description}</p><button onClick={()=>copy("description",description)}>{copied==="description"?"Copied ✓":"Copy description"}</button></article></section><section className="github-card"><div className="github-head"><div><small>DISCOVERY</small><h2>20 repository topics</h2></div><button onClick={()=>copy("topics",topics.join(", "))}>{copied==="topics"?"Copied ✓":"Copy all"}</button></div><div className="topic-cloud">{topics.map(x=><span key={x}>{x}</span>)}</div></section><section className="github-card"><div className="github-head"><div><small>README.MD</small><h2>Accurate repository landing page</h2></div><button onClick={()=>copy("readme",readme)}>{copied==="readme"?"Copied ✓":"Copy README"}</button></div><pre>{readme}</pre></section><div className="github-grid"><section className="github-card"><div className="github-head"><div><small>CONTRIBUTING.MD</small><h2>Contributor workflow</h2></div><button onClick={()=>copy("contributing",contributing)}>{copied==="contributing"?"Copied ✓":"Copy file"}</button></div><pre>{contributing}</pre></section><section className="github-card"><small>LICENSE + COMMUNITY</small><h2>Repository essentials</h2><ul><li>Add the standard MIT license with copyright “Febin Francis / CyberTeck Labs”.</li><li>Add SECURITY.md with private disclosure instructions.</li><li>Add CITATION.cff after the canonical repository URL is final.</li><li>Use GitHub’s real build status—not invented “10/10” or “A+” badges.</li><li>Upload a 1200×630 social preview in repository settings.</li></ul></section></div><section className="github-card"><small>LAUNCH DISTRIBUTION</small><h2>Share responsibly</h2><div className="share-grid">{[["LinkedIn","Founder story, verified capabilities and live link"],["Dev.to","Technical architecture and self-host tutorial"],["Reddit","Community-relevant build log; disclose ownership"],["X","Short launch thread with demo and repository"],["Issues","Acknowledge quickly, reproduce, label and update"],["Pull requests","Review evidence, test changes and explain decisions"],["Discussions","Welcome questions and link canonical answers"],["Releases","Publish changelog, migration notes and known limits"]].map(x=><article key={x[0]}><strong>{x[0]}</strong><p>{x[1]}</p><em>Manual / authorization required</em></article>)}</div></section></main>}
