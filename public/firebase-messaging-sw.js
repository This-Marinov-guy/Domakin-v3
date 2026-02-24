importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// NOTE: Service workers cannot access process.env — values are hardcoded here.
firebase.initializeApp({
  apiKey: 'AIzaSyC6yW9RFFibXYl45AawrHfi7EoCRI3NsKE',
  projectId: 'domakin-user-engagement',
  messagingSenderId: '753338139574',
  appId: '1:753338139574:web:08b55fe0cc79bea6ecb717',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // When the message has a 'notification' payload, the browser shows it automatically.
  // Do not call showNotification here or the user gets two notifications.
  if (payload.notification) {
    return;
  }
  // Data-only message: we are responsible for showing it
  const title = payload.data?.title || "Notification";
  const body = payload.data?.body || "";
  const url = payload.data?.url || "/";
  self.registration.showNotification(title, {
    body,
    icon: "/android-chrome-512x512.png",
    data: { url },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0];
        client.navigate(url);
        client.focus();
      } else {
        self.clients.openWindow(url);
      }
    })
  );
});
