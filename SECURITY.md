# Security Policy

## Supported version

Security fixes target the current `main` branch.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting feature for this repository when available, or contact the repository owner through their verified GitHub profile.

Include the affected component, impact, reproduction steps and a minimal proof of concept. Do not access data you do not own, disrupt services or publish details before remediation.

## Security principles

- No secrets in source control.
- Server-side authorization for sensitive operations.
- Explicit allowlists for outbound network access.
- Sandboxed execution for untrusted workloads.
- Measured service status; no synthetic output represented as real.
- Attributable audit records and tested backups before production sign-off.
