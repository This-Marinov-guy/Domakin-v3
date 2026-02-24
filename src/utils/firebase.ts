import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

export async function requestPushPermission(withConsent = true): Promise<string | null> {
  try {
    if (withConsent) {
      const supported = await isSupported();
      if (!supported) return null;

      if (typeof window === "undefined") return null;
      if (!("serviceWorker" in navigator)) return null;

      if (Notification.permission === "denied") return null;

      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return null;
      }
    }

    // ✅ Register YOUR SW explicitly (only change the version to force a new registration)
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js?v=1",
      { scope: "/" }
    );


    const messaging = getMessaging(getFirebaseApp());

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration, // ✅ critical
    });

    console.log("token", token);
    return token || null;
  } catch (error) {
    console.log("FCM getToken error:", error);
    return null;
  }
}
