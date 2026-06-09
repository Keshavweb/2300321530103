const BASE_URL = "/api/evaluation-service";
type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "api"|"component"|"hook"|"page"|"state"|"style"|"auth"|"config"|"middleware"|"utils";
 
let _token: string | null = null;
export function initLogger(token: string): void { _token = token; }
export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
  if (!_token) return;
  try {
    await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${_token}` },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch {}
}
export default Log;
