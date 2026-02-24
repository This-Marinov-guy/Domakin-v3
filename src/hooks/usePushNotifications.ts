import { useEffect, useState } from 'react';
import { requestPushPermission } from '@/utils/firebase';
import { useServer } from '@/hooks/useServer';

const FCM_TOKEN_KEY = 'fcm_token_registered';

export const usePushNotifications = (isAdmin = false) => {
  const { sendRequest } = useServer();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setPermissionStatus(Notification.permission);
  }, []);

  const registerToken = async (): Promise<boolean> => {
    const token = await requestPushPermission();    

    if (!token) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermissionStatus(Notification.permission);
      }
      return false;
    }

    setPermissionStatus('granted');

    const res = await sendRequest(
      'user/fcm-token',
      'PATCH',
      { token },
      {},
      { withLoading: false, withError: false }
    );

    if (res?.status) {
      sessionStorage.setItem(FCM_TOKEN_KEY, 'true');
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!isAdmin || typeof window === 'undefined') return;
    if (sessionStorage.getItem(FCM_TOKEN_KEY)) return;
    registerToken();
  }, [isAdmin]);

  return { requestPermission: registerToken, permissionStatus };
};
