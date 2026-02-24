importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// NOTE: Service workers cannot access process.env — values are hardcoded here.
firebase.initializeApp({
  apiKey: 'AIzaSyC6yW9RFFibXYl45AawrHfi7EoCRI3NsKE',
  projectId: 'domakin-user-engagement',
  messagingSenderId: '753338139574',
  appId: '1:753338139574:web:08b55fe0cc79bea6ecb717',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/android-chrome-512x512.png",
  });
});
