import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workspaceRecords = sqliteTable("workspace_records", {
  id: text("id").primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  section: text("section").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("records_owner_section_idx").on(table.ownerEmail, table.section, table.updatedAt)]);

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  detail: text("detail").notNull().default(""),
  createdAt: text("created_at").notNull(),
}, (table) => [index("audit_owner_created_idx").on(table.ownerEmail, table.createdAt)]);
