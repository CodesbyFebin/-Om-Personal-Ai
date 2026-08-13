# OM fully private runtime

This bundle starts Ollama, MinIO and Anvil on loopback-only ports. Its Docker network is marked `internal`, telemetry is not configured, and no service is exposed beyond the host.

1. Copy `.env.example` to `.env` and replace the MinIO password.
2. Download the selected model once: `docker compose --profile bootstrap run --rm ollama-bootstrap`.
3. Run the egress-isolated private runtime: `docker compose up -d ollama minio qdrant ipfs anvil edge-node`.
4. Open OM Sovereign Setup and connect:
   - Ollama: `http://127.0.0.1:11434`
   - MinIO: `http://127.0.0.1:9000`
   - Anvil: `http://127.0.0.1:8545`
   - GOD Memory (Qdrant): `http://127.0.0.1:6333`
   - Web3-owned storage (IPFS): `http://127.0.0.1:5001`
   - Edge node: `http://127.0.0.1:8787`

For a browser-hosted OM UI, set `OM_ALLOWED_ORIGIN` to that exact trusted origin. Keep the default for a locally served UI. Do not expose these ports on `0.0.0.0` unless you add TLS, authentication, and a firewall.
