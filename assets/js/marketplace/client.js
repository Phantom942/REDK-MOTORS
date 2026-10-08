import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { readMarketplaceConfig } from "./config.js";

let client;

export function getSupabase() {
  if (client) return client;
  const cfg = readMarketplaceConfig();
  if (!cfg?.supabaseUrl || !cfg?.supabaseAnonKey) {
    throw new Error("marketplace_not_configured");
  }
  client = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export function isConfigured() {
  const cfg = readMarketplaceConfig();
  return Boolean(cfg?.enabled && cfg?.supabaseUrl && cfg?.supabaseAnonKey);
}
