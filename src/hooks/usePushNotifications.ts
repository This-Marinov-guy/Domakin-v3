import { useEffect } from 'react';
import { requestPushPermission } from '@/utils/firebase';
import { useServer } from '@/hooks/useServer';

const FCM_TOKEN_KEY = 'fcm_token_registered';

export const usePushNotifications = (isAdmin: boolean) => {
  const { sendRequest } = useServer();

  useEffect(() => {
    if (!isAdmin || typeof window === 'undefined') return;

    // Skip if token was already sent in this session
    if (sessionStorage.getItem(FCM_TOKEN_KEY)) return;

    const registerToken = async () => {
      const token = await requestPushPermission();
      
      if (!token) return;

      const res = await sendRequest(
        'user/fcm-token',
        'PATCH',
        { token },
        {},
        { withLoading: false, withError: false }
      );

      if (res?.status) {
        sessionStorage.setItem(FCM_TOKEN_KEY, 'true');
      }
    };

    registerToken();
  }, [isAdmin]);
};
