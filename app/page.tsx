"use client";
import { useEffect, useMemo, useState } from "react";
import SovereignSetup from "./SovereignSetup";

const nav = [["⌘","New thread"],["⌕","Search"],["▱","Workspace"],["◈","Missions"],["◎","Agents"],["◇","GOD Memory"],["⌁","GOD Router"],["⬢","Sovereign setup"]];
const files = [{name:"apps/web",meta:"Next.js · modified",dot:"green"},{name:"packages/ai",meta:"Router · 6 files",dot:"violet"},{name:"infra",meta:"Docker · clean",dot:"blue"}];
const activity = [{icon:"✓",title:"Inspected the workspace",body:"Found 48 files across 3 packages",time:"2s"},{icon:"↳",title:"Read the task context",body:"Loaded memory, active mission, and coding preferences",time:"1s"},{icon:"⚙",title:"Planning implementation",body:"Mapping authentication flow and protected routes",time:"now"}];

export default function Home() {
  const [active,setActive]=useState("Workspace"); const [prompt,setPrompt]=useState(""); const [running,setRunning]=useState(true);
  const [approval,setApproval]=useState<"pending"|"approved"|"denied">("pending"); const [mobileNav,setMobileNav]=useState(false);
  const [messages,setMessages]=useState<string[]>([]); const [branch,setBranch]=useState("main");
  const [petState,setPetState]=useState<"sleeping"|"waking"|"ready"|"thinking">("sleeping");
  const [sovereignOpen,setSovereignOpen]=useState(false);
  const status=useMemo(()=>running?"Working":"Paused",[running]);
  useEffect(()=>{if(petState!=="waking")return;const timer=setTimeout(()=>setPetState("ready"),900);return()=>clearTimeout(timer)},[petState]);
  function wakeOm(){setPetState("waking")}
  function submit(){const value=prompt.trim();if(!value)return;if(/(^|\s)om([!,.?\s]|$)/i.test(value)){wakeOm();setPrompt("");return}setMessages(p=>[...p,value]);setPrompt("");setRunning(true);setPetState("thinking");setTimeout(()=>setPetState("ready"),1600)}
  return <main className="app-shell">
    <aside className={`sidebar ${mobileNav?"open":""}`}>
      <div className="brand-row"><div className="brand-mark">ॐ</div><div><strong>OM</strong><span>Personal AI Universe</span></div><button className="icon-button close-mobile" onClick={()=>setMobileNav(false)} aria-label="Close navigation">×</button></div>
      <nav className="primary-nav" aria-label="Main navigation">{nav.map(([icon,label],index)=><button key={label} className={`${active===label?"active":""} ${index===0?"new-thread":""}`} onClick={()=>{setActive(label);setMobileNav(false);if(["Sovereign setup","GOD Router","GOD Memory"].includes(label))setSovereignOpen(true)}}><span className="nav-icon">{icon}</span><span>{label}</span>{label==="Agents"&&<em>4</em>}</button>)}</nav>
      <div className="sidebar-section"><p className="eyebrow">Recent</p><button className="recent active-recent"><i/>Build auth flow<span>12m</span></button><button className="recent"><i/>Fix model router<span>2h</span></button><button className="recent"><i/>Review deployment<span>1d</span></button></div>
      <div className="user-card"><div className="avatar">FF</div><div><strong>Febin Francis</strong><span>Sovereign workspace</span></div><button aria-label="Workspace menu">•••</button></div>
    </aside>
    <section className="workspace">
      <header className="topbar"><button className="icon-button menu-mobile" onClick={()=>setMobileNav(true)} aria-label="Open navigation">☰</button><div className="crumb"><span className="project-dot"/>om-universe <b>/</b> <strong>Build auth flow</strong></div><div className="top-actions"><button className="branch" onClick={()=>setBranch(branch==="main"?"om/auth-flow":"main")}>⑂ {branch}⌄</button><button className="privacy-top" title="Owner-only private workspace">● Fully private</button><button className={`run-button ${running?"running":""}`} onClick={()=>setRunning(!running)}>{running?"■ Stop":"▶ Run"}</button></div></header>
      <div className="main-grid"><section className="conversation">
        <div className="thread-heading"><div><p className="status-line"><span className={running?"pulse":"paused"}/>{status} in OM Universe</p><h1>Build the authentication flow</h1></div><span className="model-pill">OM Intelligence · High⌄</span></div>
        <div className="user-prompt"><div className="prompt-avatar">F</div><div><p>Implement secure authentication for the web app. Add sign in, protected routes, and session handling. Preserve the existing architecture and run the tests.</p><span>Febin · 12 minutes ago</span></div></div>
        <div className="agent-response"><div className="om-avatar">ॐ</div><div className="response-body"><p>I’ll first inspect the existing app structure and authentication boundaries, then implement the smallest secure change and verify the complete flow.</p>
          <div className="activity-list">{activity.map((item,i)=><div className="activity-row" key={item.title}><span className={`activity-icon ${i===2&&running?"spin":""}`}>{item.icon}</span><div><strong>{item.title}</strong><p>{item.body}</p></div><time>{item.time}</time></div>)}</div>
          <div className="plan-card"><div className="plan-head"><strong>Implementation plan</strong><span>2 of 4</span></div><div className="progress"><i/></div><label><span className="done">✓</span><del>Inspect app architecture and route boundaries</del></label><label><span className="done">✓</span><del>Add session utilities and authentication middleware</del></label><label><span className="in-progress"/>Build sign-in screen and protected app shell <em>In progress</em></label><label><span className="todo"/>Run tests and verify the browser flow</label></div>
          {approval==="pending"?<div className="approval-card"><div className="approval-icon">!</div><div><strong>Approval required</strong><p>OM wants to add the authentication dependency <code>@auth/core</code>.</p><div className="command">npm install @auth/core</div><div className="approval-actions"><button className="approve" onClick={()=>setApproval("approved")}>Approve once</button><button onClick={()=>setApproval("denied")}>Deny</button></div></div></div>:<div className={`decision ${approval}`}>{approval==="approved"?"✓ Dependency approved — execution resumed":"× Request denied — plan will be adjusted"}</div>}
        </div></div>
        {messages.map((m,i)=><div className="user-prompt followup" key={`${m}-${i}`}><div className="prompt-avatar">F</div><div><p>{m}</p><span>Just now</span></div></div>)}
        <div className="composer-wrap"><div className="composer"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}}} placeholder="Ask OM to build, review, or fix something…" aria-label="Message OM"/><div className="composer-footer"><div><button aria-label="Attach context">＋</button><button className="context-button">◎ Add context</button></div><div><span>⌘ ↵</span><button className="send" onClick={submit} aria-label="Send message">↑</button></div></div></div><p className="composer-note">OM can make mistakes. Review changes before merging.</p></div>
      </section>
      <aside className="context-panel"><div className="context-tabs"><button className="active">Context</button><button>Changes <span>6</span></button></div>
        <section><div className="panel-title"><strong>Workspace</strong><button>•••</button></div><div className="repo-card"><span className="repo-icon">⌑</span><div><strong>personal-ai-cloud</strong><p>cybertecklabs-labs</p></div><span className="private">Private</span></div>{files.map(f=><button className="file-row" key={f.name}><span className={`file-dot ${f.dot}`}/><div><strong>{f.name}</strong><p>{f.meta}</p></div><span>›</span></button>)}</section>
        <section><div className="panel-title"><strong>Sovereign stack</strong><span className="healthy"><i/>Private</span></div><div className="metric"><span>GOD Router</span><strong>Local models</strong></div><div className="metric"><span>GOD Memory</span><strong>Qdrant local</strong></div><div className="metric"><span>Owned storage</span><strong>IPFS + MinIO</strong></div><div className="metric"><span>Edge node</span><strong>Self-host</strong></div><button className="open-sovereign" onClick={()=>setSovereignOpen(true)}>Configure private stack →</button></section>
        <section><div className="panel-title"><strong>Memory</strong><button>Manage</button></div><div className="memory-item"><span>◇</span><p><strong>Project preference</strong>Use local-first models and preserve sovereign deployment options.</p></div><div className="memory-item"><span>◇</span><p><strong>Coding style</strong>Production-ready changes, explicit verification, no placeholders.</p></div></section>
        <section className="token-section"><div className="panel-title"><strong>Context window</strong><span>38%</span></div><div className="token-bar"><i/></div><p>76k of 200k tokens used</p></section>
      </aside></div>
    </section>
    <button className={`om-pet ${petState}`} onClick={()=>petState==="sleeping"?wakeOm():setPetState("ready")} aria-label={petState==="sleeping"?"Wake OM companion":"OM companion is ready"}>
      <span className="om-orbit outer"/><span className="om-orbit inner"/><span className="om-energy"/><span className="om-glyph">ॐ</span>
      <span className="om-star one">✦</span><span className="om-star two">✧</span>
      <span className="pet-bubble"><strong>{petState==="sleeping"?"OM is resting":petState==="waking"?"Waking up…":petState==="thinking"?"OM is thinking":"OM is ready"}</strong><small>{petState==="sleeping"?'Type “OM” to wake':petState==="ready"?"Ready for tasks":"Personal AI Universe"}</small></span>
      <span className="pet-status"/>
    </button>
    <SovereignSetup open={sovereignOpen} onClose={()=>{setSovereignOpen(false);setActive("Workspace")}} />
  </main>
}
