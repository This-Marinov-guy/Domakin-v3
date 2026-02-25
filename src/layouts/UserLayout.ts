import React, { useEffect, useState } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useStore } from '@/stores/storeContext';
import { FCM_TOKEN_KEY } from '@/utils/defines';
import { useLocation } from 'react-use';

const UserLayout = () => {
    const { userStore: { user, userLoading, notificationPreferences } } = useStore();
    const { requestPermission } = usePushNotifications();
    const location = useLocation();

    useEffect(() => {
        if (!location?.pathname?.includes('account') || !user || !notificationPreferences.push) {
            return;
        }

        if (sessionStorage.getItem(FCM_TOKEN_KEY)) return;

        requestPermission();
    }, [userLoading]);

    return null;
}

export default UserLayout