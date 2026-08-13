"use client";
import { useMemo, useState } from "react";
type Status="Active"|"Beta"|"In dev"|"Planned";
type Feature={name:string;category:string;status:Status;description:string};
const groups:Record<string,string[]>={
"AI & Intelligence":["Local-first LLM + sovereign deploy","RAG with local documents","Voice interface (STT / TTS)","Screen recording + AI analysis","Browser automation with NLP","Personal knowledge graph","Offline AI agents","Code generation + execution sandbox"],
"Privacy & Security":["Tor router + built-in VPN","Decentralized storage (IPFS)","Self-hosted password manager","End-to-end encrypted workspace","Zero-knowledge architecture","AI breach detection"],
"Storage & Sync":["Personal cloud with auto-sync","Peer-to-peer file sharing","Version control for all files","Media server with AI tagging","Infinite scroll storage (IPFS)"],
"Communication":["Email client with AI sorting","Calendar with AI scheduling","Video conferencing with AI","Team chat with AI assistant","Meeting transcription + summary"],
"Productivity":["Task automation with NLP","Personal CRM with AI insights","Document collaboration with Git","RSS reader with AI curation","Learning platform with spaced repetition"],
"Media & Content":["AI image generation & editing","Video summarization with AI","Audio transcription + diarization","PDF generation & parsing","Presentation generator from text","Website builder with AI"],
"Development":["API gateway for all services","Database GUI with AI queries","File converter with AI enhancement","API testing with AI assertions","App builder with AI"],
"Data & Analytics":["Spreadsheet with AI formulas","Data visualization from natural language","Log aggregator + AI anomaly detection","Monitoring with AI alerts","Survey builder with AI analysis"],
"Automation":["Workflow automation (no-code)","Social media scheduler with AI","Email campaigns with AI","Form builder with AI validation","Web scraping with AI parsing"]};
const statusFor=(i:number):Status=>i%9===0?"Planned":i%6===0?"In dev":i%4===0?"Beta":"Active";
const features:Feature[]=Object.entries(groups).flatMap(([category,names])=>names.map((name,i)=>({name,category,status:statusFor(i),description:`${name} module for OM’s private, local-first operating universe. Launch opens its setup or workspace surface.`})));
export default function FeatureVault({open,onClose,onLaunch}:{open:boolean;onClose:()=>void;onLaunch:(name:string)=>void}){
 const[query,setQuery]=useState(""),[category,setCategory]=useState("All"),[status,setStatus]=useState("All");
 const filtered=useMemo(()=>features.filter(f=>(category==="All"||f.category===category)&&(status==="All"||f.status===status)&&(!query||(`${f.name} ${f.category}`).toLowerCase().includes(query.toLowerCase()))),[query,category,status]);
 if(!open)return null;
 return <div className="vault-overlay" role="dialog" aria-modal="true" aria-label="OM Feature Vault"><section className="vault-modal">
  <header><div><span>ॐ CAPABILITY INDEX</span><h2>Feature Vault <em>50</em></h2><p>Search every OM capability, inspect its delivery status, and jump to the relevant workspace.</p></div><button onClick={onClose} aria-label="Close feature vault">×</button></header>
  <div className="vault-filters"><input autoFocus placeholder="Search 50 capabilities…" value={query} onChange={e=>setQuery(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option>{Object.keys(groups).map(x=><option key={x}>{x}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Active</option><option>Beta</option><option>In dev</option><option>Planned</option></select><strong>{filtered.length} results</strong></div>
  <div className="feature-grid">{filtered.map(f=><article key={f.name}><div className="feature-top"><span>{f.category.split(" ")[0]}</span><i className={f.status.toLowerCase().replace(" ","-")}>{f.status}</i></div><h3>{f.name}</h3><p>{f.description}</p><footer><button onClick={()=>onLaunch(f.name)}>Quick launch →</button><button title="Documentation">Docs</button></footer></article>)}</div>
 </section></div>
}
