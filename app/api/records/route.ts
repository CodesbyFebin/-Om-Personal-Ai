import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents, workspaceRecords } from "../../../db/schema";

const sections=new Set(["ai-kanban","project-tracker","keep-notes","my-findings","prompt-vault","private-browser","audio-deck","notebooklm","integrations","git-selfhost","ubuntu-server","marketplace","sovereign-setup","private-mode","teammate-backed","feature-vault"]);
const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().replace(/[\u0000-\u001f\u007f]/g,"").slice(0,max):"";
function identity(request:Request){return request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase()||null}
function sameOrigin(request:Request){const origin=request.headers.get("origin");return !origin||origin===new URL(request.url).origin}
function unauthorized(){return Response.json({error:"Authenticated workspace access required"},{status:401})}

export async function GET(request:Request){
 const owner=identity(request);if(!owner)return unauthorized();
 const url=new URL(request.url),section=clean(url.searchParams.get("section"),64);if(!sections.has(section))return Response.json({error:"Invalid section"},{status:400});
 const db=getDb(),records=await db.select().from(workspaceRecords).where(and(eq(workspaceRecords.ownerEmail,owner),eq(workspaceRecords.section,section))).orderBy(desc(workspaceRecords.updatedAt)).limit(200);
 return Response.json({records},{headers:{"cache-control":"no-store"}});
}
export async function POST(request:Request){
 const owner=identity(request);if(!owner)return unauthorized();if(!sameOrigin(request))return Response.json({error:"Cross-origin write rejected"},{status:403});
 const body=await request.json().catch(()=>null) as Record<string,unknown>|null,section=clean(body?.section,64),title=clean(body?.title,160),detail=clean(body?.detail,8000);
 if(!sections.has(section)||!title)return Response.json({error:"Valid section and title are required"},{status:400});
 const now=new Date().toISOString(),id=crypto.randomUUID(),db=getDb();
 await db.batch([db.insert(workspaceRecords).values({id,ownerEmail:owner,section,title,detail,createdAt:now,updatedAt:now}),db.insert(auditEvents).values({id:crypto.randomUUID(),ownerEmail:owner,action:"record.created",targetType:section,targetId:id,detail:title,createdAt:now})]);
 return Response.json({record:{id,section,title,detail,status:"active",createdAt:now,updatedAt:now}},{status:201});
}
export async function DELETE(request:Request){
 const owner=identity(request);if(!owner)return unauthorized();if(!sameOrigin(request))return Response.json({error:"Cross-origin write rejected"},{status:403});
 const id=clean(new URL(request.url).searchParams.get("id"),80);if(!id)return Response.json({error:"Record id required"},{status:400});
 const db=getDb(),existing=await db.select().from(workspaceRecords).where(and(eq(workspaceRecords.id,id),eq(workspaceRecords.ownerEmail,owner))).limit(1);if(!existing[0])return Response.json({error:"Record not found"},{status:404});
 const now=new Date().toISOString();await db.batch([db.delete(workspaceRecords).where(and(eq(workspaceRecords.id,id),eq(workspaceRecords.ownerEmail,owner))),db.insert(auditEvents).values({id:crypto.randomUUID(),ownerEmail:owner,action:"record.deleted",targetType:existing[0].section,targetId:id,detail:existing[0].title,createdAt:now})]);
 return Response.json({ok:true});
}
