import { useEffect, useState } from 'react';
import { requestPushPermission } from '@/utils/firebase';
import { useServer } from '@/hooks/useServer';
import { FCM_TOKEN_KEY } from '@/utils/defines';
import { usePWAInstall } from './usePWAInstall';


export const usePushNotifications = (isAdmin = false) => {
  const { sendRequest } = useServer();
  const { isInstalled } = usePWAInstall();

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setPermissionStatus(Notification.permission);
  }, []);

  const registerToken = async (withConsent = true): Promise<boolean> => {
    // Only allow to register token if the app is installed
    if (!isInstalled) return false;

    const token = await requestPushPermission(withConsent);    

    if (!token) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermissionStatus(Notification.permission);
      }
      return false;
    }

    setPermissionStatus('granted');

    const res = await sendRequest(
      '/user/fcm-token',
      'PATCH',
      { token },
      {},
      { withLoading: false, withError: false }
    );

    if (res?.status) {
      console.log('res', res);
      sessionStorage.setItem(FCM_TOKEN_KEY, 'true');
      return true;
    }

    return false;
  };

  return { requestPermission: registerToken, permissionStatus };
};
