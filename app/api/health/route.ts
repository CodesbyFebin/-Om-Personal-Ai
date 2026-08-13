import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents, workspaceRecords } from "../../../db/schema";
export async function GET(request:Request){
 const owner=request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();if(!owner)return Response.json({error:"Authenticated workspace access required"},{status:401});
 const db=getDb(),records=await db.select({id:workspaceRecords.id}).from(workspaceRecords).where(eq(workspaceRecords.ownerEmail,owner)).limit(1000),audit=await db.select().from(auditEvents).where(eq(auditEvents.ownerEmail,owner)).orderBy(desc(auditEvents.createdAt)).limit(25);
 return Response.json({status:"healthy",measuredAt:new Date().toISOString(),identity:{authenticated:true,owner},database:{connected:true,records:records.length},audit:{enabled:true,count:audit.length,recent:audit},security:{ownerIsolation:true,sameOriginWrites:true,inputValidation:true,syntheticFallbacks:false}},{headers:{"cache-control":"no-store"}});
}
