import { useEffect, useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useServer } from "@/hooks/useServer";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import Skeleton from "react-loading-skeleton";
import { showStandardNotification } from "@/utils/helpers";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const NotificationSettings = () => {
  const [saving, setSaving] = useState(false);
  const { isInstalled } = usePWAInstall();
  const { requestPermission, permissionStatus } = usePushNotifications();
  const { sendRequest } = useServer();
  const {
    userStore: {
      notificationPreferences,
      notificationPreferencesLoading,
      setNotificationPreferences,
      loadNotificationPreferences,
    },
  } = useStore();

  const pushDenied = permissionStatus === "denied";
  const loading = notificationPreferencesLoading || saving;
  const disabledPush = pushDenied || !isInstalled || loading;

  useEffect(() => {
    loadNotificationPreferences();
  }, [loadNotificationPreferences]);

  const save = async (email: boolean, push: boolean) => {
    setSaving(true);
    const prevEmail = notificationPreferences.email;
    const prevPush = notificationPreferences.push;
    setNotificationPreferences(email, push);

    const res = await sendRequest(
      "/user/notification-settings",
      "PATCH",
      { email_notifications: email, push_notifications: push },
    );

    if (res?.status) {
      showStandardNotification("success", "Settings saved.", { theme: "light" });
    } else {
      setNotificationPreferences(prevEmail, prevPush);
    }
    setSaving(false);
  };

  const handleEmailToggle = () =>
    save(!notificationPreferences.email, notificationPreferences.push);

  const handlePushToggle = async () => {
    const next = !notificationPreferences.push;
    if (next) {
      setSaving(true);
      const granted = await requestPermission();
      if (!granted) { setSaving(false); return; }
    }
    save(notificationPreferences.email, next);
  };

  return (
    <ul className="bg-white card-box border-20 p-4 mt-20">
      <li>
        <div className="d-flex align-items-center gap-3 mb-3">
          <h5 className="m-0">Notification Preferences</h5>
        </div>
        <p className="text-muted mb-4">
          Choose how you&apos;d like to receive updates and alerts.
        </p>
        {loading ? (
          <div className="d-flex flex-wrap gap-2">
            <Skeleton height={52} width={96} borderRadius={16} />
            <Skeleton height={52} width={96} borderRadius={16} />
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            <div className="checkbox-card-type">
              <input
                type="checkbox"
                className="btn-check"
                id="notif-email"
                autoComplete="off"
                checked={notificationPreferences.email}
                disabled={saving}
                onChange={handleEmailToggle}
              />
              <label
                className="btn d-flex align-items-center text-center rounded-4 fs-12"
                htmlFor="notif-email"
              >
                <i className="fa-regular fa-envelope fs-5 mb-1"></i>
                <span>Email</span>
              </label>
            </div>

            <div className="checkbox-card-type">
              <input
                type="checkbox"
                className="btn-check"
                id="notif-push"
                autoComplete="off"
                checked={notificationPreferences.push}
                disabled={disabledPush || saving}
                onChange={handlePushToggle}
              />
              <label
                className={`btn d-flex align-items-center text-center rounded-4 fs-12 ${pushDenied ? "opacity-50" : ""}`}
                htmlFor="notif-push"
              >
                <i className="fa-regular fa-bell fs-5 mb-1"></i>
                <span>Push</span>
              </label>
            </div>
          </div>
        )}

        {!loading && disabledPush && (
          <p className="text-muted mt-3 mb-0">
            <i className="fa-regular fa-circle-info me-1"></i>
            Push notifications are only enabled on downloaded apps and when notifications are allowed.
          </p>
        )}
      </li>
    </ul>
  );
};

export default observer(NotificationSettings);
