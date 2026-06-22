import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function hasServiceAccountEnv() {
  return (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

function serviceAccountEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required Firebase environment variable: ${name}`);
  }

  return value;
}

export function getFirebaseAdminDb() {
  if (!getApps().length) {
    if (hasServiceAccountEnv()) {
      initializeApp({
        credential: cert({
          projectId: serviceAccountEnv("FIREBASE_PROJECT_ID"),
          clientEmail: serviceAccountEnv("FIREBASE_CLIENT_EMAIL"),
          privateKey: serviceAccountEnv("FIREBASE_PRIVATE_KEY").replace(
            /\\n/g,
            "\n",
          ),
        }),
      });
    } else {
      initializeApp();
    }
  }

  return getFirestore();
}
