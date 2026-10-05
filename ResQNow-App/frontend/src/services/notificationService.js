import {
  apiRequest,
  getCsrfCookie,
} from './api';

export async function getNotifications() {
  const data = await apiRequest(
    '/api/notifications'
  );

  return {
    notifications:
      Array.isArray(data?.data)
        ? data.data
        : [],
    unreadCount:
      Number(data?.unreadCount) || 0,
  };
}

export async function getNotification(
  notificationId
) {
  const data = await apiRequest(
    `/api/notifications/${encodeURIComponent(
      notificationId
    )}`
  );

  return data?.data || data || null;
}

export async function markNotificationRead(
  notificationId
) {
  await getCsrfCookie();

  const data = await apiRequest(
    `/api/notifications/${encodeURIComponent(
      notificationId
    )}/read`,
    {
      method: 'PATCH',
    }
  );

  return data?.data || data || null;
}

export async function markAllNotificationsRead() {
  await getCsrfCookie();

  return apiRequest(
    '/api/notifications/read-all',
    {
      method: 'PATCH',
    }
  );
}
