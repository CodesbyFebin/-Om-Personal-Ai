import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type D1Binding = Parameters<typeof drizzle>[0];
declare global { var __OM_D1__: D1Binding | undefined; }

export function getDb() {
  if (!globalThis.__OM_D1__) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(globalThis.__OM_D1__, { schema });
}
