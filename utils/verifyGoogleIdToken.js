import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();

export default async function verifyGoogleIdToken(credential) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  if (!GOOGLE_CLIENT_ID) {
    const error = new Error("GOOGLE_CLIENT_ID is Missing");
    error.code = "GOOGLE_CONFIG_MISSING";
    throw error;
  }
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("payload does not exist");
  if (!payload.sub || !payload.email || payload.email_verified !== true)
    throw new Error("payload should contain a sub and a verified email");
  return payload;
}
