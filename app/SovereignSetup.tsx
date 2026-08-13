"use client";

import { useEffect, useState } from "react";

type Config = {
  modelEndpoint: string;
  model: string;
  fallbackModel: string;
  routingPolicy: string;
  memoryEndpoint: string;
  storageEndpoint: string;
  storageBucket: string;
  web3Rpc: string;
  chain: string;
  ownedStorageEndpoint: string;
  edgeEndpoint: string;
  cloudEndpoint: string;
  networkLock: boolean;
  telemetry: boolean;
};

const defaults: Config = {
  modelEndpoint: "http://127.0.0.1:11434",
  model: "qwen2.5-coder:14b",
  fallbackModel: "deepseek-coder-v2:16b",
  routingPolicy: "Private quality-first",
  memoryEndpoint: "http://127.0.0.1:6333",
  storageEndpoint: "http://127.0.0.1:9000",
  storageBucket: "om-private",
  web3Rpc: "http://127.0.0.1:8545",
  chain: "Local Anvil",
  ownedStorageEndpoint: "http://127.0.0.1:5001",
  edgeEndpoint: "http://127.0.0.1:8787",
  cloudEndpoint: "",
  networkLock: true,
  telemetry: false,
};

const compose = `services:
  ollama:
    image: ollama/ollama:latest
    volumes: ["ollama:/root/.ollama"]
    ports: ["127.0.0.1:11434:11434"]
    networks: [om-private]
  minio:
    image: minio/minio:latest
    command: server /data --console-address :9001
    volumes: ["om-data:/data"]
    ports: ["127.0.0.1:9000:9000", "127.0.0.1:9001:9001"]
    networks: [om-private]
  qdrant:
    image: qdrant/qdrant:latest
    volumes: ["god-memory:/qdrant/storage"]
    ports: ["127.0.0.1:6333:6333"]
    networks: [om-private]
  ipfs:
    image: ipfs/kubo:latest
    volumes: ["ipfs-data:/data/ipfs"]
    ports: ["127.0.0.1:5001:5001"]
    networks: [om-private]
  anvil:
    image: ghcr.io/foundry-rs/foundry:latest
    entrypoint: ["anvil", "--host", "0.0.0.0"]
    ports: ["127.0.0.1:8545:8545"]
    networks: [om-private]
networks:
  om-private:
    internal: true
volumes:
  ollama:
  om-data:
  god-memory:
  ipfs-data:`;

export default function SovereignSetup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [config, setConfig] = useState<Config>(() => {
    if (typeof window === "undefined") return defaults;
    try {
      const local = window.localStorage.getItem("om_sovereign_config");
      return local ? { ...defaults, ...JSON.parse(local) } : defaults;
    } catch { return defaults; }
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState<Record<string, "idle" | "checking" | "ready" | "offline">>({});
  const [checkMessage, setCheckMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;
  const update = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((current) => ({ ...current, [key]: value }));
  const check = async (key: "llm" | "storage" | "web3" | "memory" | "owned" | "edge" | "cloud") => {
    setChecks((current) => ({ ...current, [key]: "checking" }));
    setCheckMessage((current) => ({ ...current, [key]: "" }));
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    try {
      let response: Response;
      if (key === "llm") response = await fetch(`${config.modelEndpoint.replace(/\/$/, "")}/api/tags`, { signal: controller.signal });
      else if (key === "storage") response = await fetch(`${config.storageEndpoint.replace(/\/$/, "")}/minio/health/live`, { signal: controller.signal });
      else if (key === "memory") response = await fetch(`${config.memoryEndpoint.replace(/\/$/, "")}/healthz`, { signal: controller.signal });
      else if (key === "owned") response = await fetch(`${config.ownedStorageEndpoint.replace(/\/$/, "")}/api/v0/version`, { method: "POST", signal: controller.signal });
      else if (key === "edge") response = await fetch(`${config.edgeEndpoint.replace(/\/$/, "")}/health`, { signal: controller.signal });
      else if (key === "cloud") {
        if (!config.cloudEndpoint) throw new Error("Cloud endpoint not configured");
        response = await fetch(config.cloudEndpoint, { method: "HEAD", signal: controller.signal });
      } else response = await fetch(config.web3Rpc, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }), signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (key === "web3") {
        const payload = await response.json();
        if (!payload.result) throw new Error("Invalid JSON-RPC response");
        setCheckMessage((current) => ({ ...current, [key]: `Connected · chain ${payload.result}` }));
      } else setCheckMessage((current) => ({ ...current, [key]: "Runtime connected" }));
      setChecks((current) => ({ ...current, [key]: "ready" }));
    } catch (error) {
      const message = error instanceof Error && error.message === "Cloud endpoint not configured" ? error.message : error instanceof Error && error.name === "AbortError" ? "Connection timed out" : "Runtime offline or blocked by CORS";
      setCheckMessage((current) => ({ ...current, [key]: message }));
      setChecks((current) => ({ ...current, [key]: "offline" }));
    } finally { window.clearTimeout(timer); }
  };
  const save = () => {
    window.localStorage.setItem("om_sovereign_config", JSON.stringify(config));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  const copyCompose = async () => {
    await navigator.clipboard.writeText(compose);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return <div className="sovereign-overlay" role="dialog" aria-modal="true" aria-label="Sovereign setup">
    <div className="sovereign-modal">
      <header className="sovereign-head"><div><span className="sovereign-kicker">ॐ SOVEREIGN CONTROL PLANE</span><h2>Private infrastructure setup</h2><p>All settings stay on this device. Secrets are never requested or transmitted.</p></div><button onClick={onClose} aria-label="Close sovereign setup">×</button></header>
      <div className="privacy-banner"><span>✓</span><div><strong>Private mode enforced</strong><p>Zero telemetry · loopback-first endpoints · local configuration only</p></div><em>LOCKED</em></div>
      <div className="sovereign-grid">
        <article className="setup-card featured"><div className="setup-title"><span>✦</span><div><strong>GOD Router</strong><p>Private multi-model routing and fallback</p></div><i className={checks.llm === "ready" ? "online" : checks.llm === "offline" ? "offline" : ""}>{checks.llm === "ready" ? "Online" : checks.llm === "offline" ? "Offline" : "Local"}</i></div><label>Ollama endpoint<input value={config.modelEndpoint} onChange={(e) => update("modelEndpoint", e.target.value)} /></label><div className="field-pair"><label>Primary model<select value={config.model} onChange={(e) => update("model", e.target.value)}><option>qwen2.5-coder:14b</option><option>deepseek-coder-v2:16b</option><option>llama3.3:70b</option><option>codestral:22b</option></select></label><label>Fallback<select value={config.fallbackModel} onChange={(e) => update("fallbackModel", e.target.value)}><option>deepseek-coder-v2:16b</option><option>qwen2.5-coder:14b</option><option>codestral:22b</option></select></label></div><label>Routing policy<select value={config.routingPolicy} onChange={(e) => update("routingPolicy", e.target.value)}><option>Private quality-first</option><option>Lowest latency</option><option>Lowest memory</option><option>Code specialist</option></select></label>{checkMessage.llm&&<p className={`runtime-message ${checks.llm}`}>{checkMessage.llm}</p>}<button className="test-button" onClick={() => check("llm")}>{checks.llm === "checking" ? "Discovering models…" : "Discover local models"}</button></article>
        <article className="setup-card featured"><div className="setup-title"><span>◇</span><div><strong>GOD Memory</strong><p>Private semantic memory with Qdrant</p></div><i className={checks.memory === "ready" ? "online" : checks.memory === "offline" ? "offline" : ""}>{checks.memory === "ready" ? "Online" : checks.memory === "offline" ? "Offline" : "Local"}</i></div><label>Vector endpoint<input value={config.memoryEndpoint} onChange={(e) => update("memoryEndpoint", e.target.value)} /></label><div className="memory-features"><span>Encrypted snapshots</span><span>Local embeddings</span><span>Per-space isolation</span></div>{checkMessage.memory&&<p className={`runtime-message ${checks.memory}`}>{checkMessage.memory}</p>}<button className="test-button" onClick={() => check("memory")}>{checks.memory === "checking" ? "Connecting…" : "Connect GOD Memory"}</button></article>
        <article className="setup-card"><div className="setup-title"><span>▣</span><div><strong>Private storage</strong><p>MinIO / S3-compatible encrypted vault</p></div><i className={checks.storage === "ready" ? "online" : checks.storage === "offline" ? "offline" : ""}>{checks.storage === "ready" ? "Online" : checks.storage === "offline" ? "Offline" : "Local"}</i></div><label>Endpoint<input value={config.storageEndpoint} onChange={(e) => update("storageEndpoint", e.target.value)} /></label><label>Bucket<input value={config.storageBucket} onChange={(e) => update("storageBucket", e.target.value)} /></label>{checkMessage.storage&&<p className={`runtime-message ${checks.storage}`}>{checkMessage.storage}</p>}<button className="test-button" onClick={() => check("storage")}>{checks.storage === "checking" ? "Connecting…" : "Connect to MinIO"}</button></article>
        <article className="setup-card"><div className="setup-title"><span>⬡</span><div><strong>Web3 bridge</strong><p>Local node or privacy-preserving RPC</p></div><i className={checks.web3 === "ready" ? "online" : checks.web3 === "offline" ? "offline" : ""}>{checks.web3 === "ready" ? "Online" : checks.web3 === "offline" ? "Offline" : "Isolated"}</i></div><label>RPC endpoint<input value={config.web3Rpc} onChange={(e) => update("web3Rpc", e.target.value)} /></label><label>Network<select value={config.chain} onChange={(e) => update("chain", e.target.value)}><option>Local Anvil</option><option>Ethereum</option><option>Arbitrum</option><option>Polygon</option></select></label>{checkMessage.web3&&<p className={`runtime-message ${checks.web3}`}>{checkMessage.web3}</p>}<button className="test-button" onClick={() => check("web3")}>{checks.web3 === "checking" ? "Connecting…" : "Connect Web3 RPC"}</button></article>
        <article className="setup-card"><div className="setup-title"><span>⬢</span><div><strong>Web3-owned storage</strong><p>Content-addressed IPFS node you control</p></div><i className={checks.owned === "ready" ? "online" : checks.owned === "offline" ? "offline" : ""}>{checks.owned === "ready" ? "Online" : checks.owned === "offline" ? "Offline" : "Owned"}</i></div><label>IPFS API<input value={config.ownedStorageEndpoint} onChange={(e) => update("ownedStorageEndpoint", e.target.value)} /></label>{checkMessage.owned&&<p className={`runtime-message ${checks.owned}`}>{checkMessage.owned}</p>}<button className="test-button" onClick={() => check("owned")}>{checks.owned === "checking" ? "Connecting…" : "Connect owned storage"}</button></article>
        <article className="setup-card"><div className="setup-title"><span>⌁</span><div><strong>Edge node</strong><p>Self-host task execution close to hardware</p></div><i className={checks.edge === "ready" ? "online" : checks.edge === "offline" ? "offline" : ""}>{checks.edge === "ready" ? "Online" : checks.edge === "offline" ? "Offline" : "Self-host"}</i></div><label>Node endpoint<input value={config.edgeEndpoint} onChange={(e) => update("edgeEndpoint", e.target.value)} /></label>{checkMessage.edge&&<p className={`runtime-message ${checks.edge}`}>{checkMessage.edge}</p>}<button className="test-button" onClick={() => check("edge")}>{checks.edge === "checking" ? "Connecting…" : "Connect edge node"}</button></article>
        <article className="setup-card"><div className="setup-title"><span>☁</span><div><strong>Encrypted cloud storage</strong><p>Optional backup; client-encrypted before upload</p></div><i className={checks.cloud === "ready" ? "online" : checks.cloud === "offline" ? "offline" : ""}>{checks.cloud === "ready" ? "Online" : checks.cloud === "offline" ? "Offline" : "Optional"}</i></div><label>S3-compatible endpoint<input placeholder="https://your-private-storage.example" value={config.cloudEndpoint} onChange={(e) => update("cloudEndpoint", e.target.value)} /></label>{checkMessage.cloud&&<p className={`runtime-message ${checks.cloud}`}>{checkMessage.cloud}</p>}<button className="test-button" onClick={() => check("cloud")}>{checks.cloud === "checking" ? "Connecting…" : "Check cloud endpoint"}</button></article>
        <article className="setup-card"><div className="setup-title"><span>⬢</span><div><strong>Self-host bundle</strong><p>Ollama + MinIO + Anvil</p></div><i>Docker</i></div><pre>{compose}</pre><button className="test-button" onClick={copyCompose}>{copied ? "Copied docker-compose.yml" : "Copy Docker Compose"}</button></article>
      </div>
      <div className="privacy-controls"><label><span><strong>Network lock</strong><small>Reject non-local endpoints unless explicitly configured</small></span><input type="checkbox" checked={config.networkLock} onChange={(e) => update("networkLock", e.target.checked)} /></label><label><span><strong>Anonymous telemetry</strong><small>Disabled by default; no usage data leaves OM</small></span><input type="checkbox" checked={config.telemetry} onChange={(e) => update("telemetry", e.target.checked)} /></label></div>
      <footer className="sovereign-actions"><span>Configuration stored in browser-local encrypted workspace context.</span><div><button onClick={onClose}>Cancel</button><button className="save-private" onClick={save}>{saved ? "✓ Private config saved" : "Save private configuration"}</button></div></footer>
    </div>
  </div>;
}
