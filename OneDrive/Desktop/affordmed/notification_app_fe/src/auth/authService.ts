import { initLogger } from "../utils/logger";
import Log from "../utils/logger";

const BASE_URL = "/api/evaluation-service";
const CLIENT_ID = "996dd63b-3c6b-4999-8cbc-a748a63fd3b4";
const CLIENT_SECRET = "VVBrzEdTkwvxDcKM";

export async function getAuthToken(): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "keshav.23b1531001@abes.ac.in",
        name: "Keshav Singhal",
        rollNo: "2300321530103",
        accessCode: "cXuqht",
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      }),
    });
    if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
    const data = await response.json();
    initLogger(data.access_token);
    Log("frontend", "info", "auth", "Auth token obtained successfully");
    return data.access_token;
  } catch (err) {
    throw err;
  }
}
