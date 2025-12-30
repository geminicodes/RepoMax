import admin from "firebase-admin";
import { getEnv } from "./env";

let initialized = false;

export function initializeFirebase() {
  if (initialized) return;

  const env = getEnv();
  const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON ?? env.GCP_SERVICE_ACCOUNT_JSON ?? undefined;

  if (!raw) {
    // Fall back to Application Default Credentials if configured.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: env.FIREBASE_PROJECT_ID ?? env.GOOGLE_CLOUD_PROJECT_ID ?? env.GCP_PROJECT_ID
    });
    initialized = true;
    return;
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON: must be valid JSON.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(parsed),
    projectId:
      env.FIREBASE_PROJECT_ID ??
      parsed.project_id ??
      env.GOOGLE_CLOUD_PROJECT_ID ??
      env.GCP_PROJECT_ID
  });

  initialized = true;
}

export function getAuth() {
  initializeFirebase();
  return admin.auth();
}

export function getFirestore() {
  initializeFirebase();
  return admin.firestore();
}

export { admin };

