const BASE_URL = "http://4.224.186.213/evaluation-service";
 
type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils" | "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
 
let authToken: string | null = null;
 
export function initLogger(token: string): void {
  authToken = token;
}
 
export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
  if (!authToken) { console.warn("[Logger] No token"); return; }
  try {
    await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) { console.warn("[Logger] Error:", err); }
}
 
export default Log;
