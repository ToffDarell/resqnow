import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  BellRing,
  CheckCheck,
  ChevronRight,
  FileText,
  Loader2,
  Megaphone,
  RefreshCw,
} from 'lucide-react';

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/notificationService';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'report', label: 'My Reports' },
  { id: 'announcement', label: 'Announcements' },
];

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStyle(kind) {
  if (kind === 'announcement') {
    return {
      Icon: Megaphone,
      label: 'Barangay Announcement',
      iconClass: 'bg-resqnow-pending/10 text-resqnow-pending',
    };
  }

  if (kind === 'report') {
    return {
      Icon: FileText,
      label: 'Report Update',
      iconClass: 'bg-resqnow-violet/10 text-resqnow-violet',
    };
  }

  return {
    Icon: BellRing,
    label: 'Update',
    iconClass: 'bg-resqnow-info/10 text-resqnow-info',
  };
}

export default function Updates() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [loadError, setLoadError] = useState('');
  const requestInFlight = useRef(false);

  const loadUpdates = useCallback(async ({ refresh = false } = {}) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;

    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const result = await getNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      setLoadError('');
    } catch (error) {
      setLoadError(
        error?.message || 'Unable to load your updates.'
      );
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUpdates();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadUpdates({ refresh: true });
      }
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [loadUpdates]);

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((item) => item.kind === filter);
  }, [notifications, filter]);

  const openNotification = async (notification) => {
    if (!notification.readAt) {
      try {
        const updated = await markNotificationRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === updated.id ? updated : item
          )
        );
        setUnreadCount((current) => Math.max(0, current - 1));
        window.dispatchEvent(
          new Event('resqnow:notifications-changed')
        );
      } catch {
        // Opening the update should still be possible.
      }
    }

    navigate(`/updates/${notification.id}`);
  };

  const markAllRead = async () => {
    if (isMarkingAll || unreadCount === 0) return;
    setIsMarkingAll(true);

    try {
      await markAllNotificationsRead();
      const now = new Date().toISOString();
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          readAt: item.readAt || now,
        }))
      );
      setUnreadCount(0);
      setLoadError('');
      window.dispatchEvent(
        new Event('resqnow:notifications-changed')
      );
    } catch (error) {
      setLoadError(
        error?.message || 'Unable to mark updates as read.'
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div className="px-4 pt-5 pb-28 min-h-screen">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-resqnow-primary">
            Updates
          </h1>
          <p className="text-xs text-resqnow-muted mt-1 leading-relaxed">
            Confirmed report activity and barangay notifications for your account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadUpdates({ refresh: true })}
          disabled={isRefreshing}
          aria-label="Refresh updates"
          className="w-10 h-10 rounded-xl border border-resqnow-violet/15 bg-resqnow-violet/5 text-resqnow-violet flex items-center justify-center shrink-0 disabled:opacity-50"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>

      {loadError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/10 p-3 flex gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-resqnow-critical mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-resqnow-crimson">
              Could not refresh updates
            </p>
            <p className="text-[11px] text-resqnow-secondary mt-1">
              {loadError}
            </p>
            {notifications.length > 0 && (
              <p className="text-[10px] text-resqnow-muted mt-1">
                Showing the last confirmed update list.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((item) => {
            const selected = filter === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`shrink-0 min-h-[42px] px-3.5 rounded-full text-[11px] font-semibold border transition-all ${
                  selected
                    ? 'bg-resqnow-violet text-white border-resqnow-violet'
                    : 'bg-white text-resqnow-muted border-resqnow-border-soft'
                }`}
              >
                {item.label}
                {item.id === 'all' && unreadCount > 0 && (
                  <span
                    className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      selected
                        ? 'bg-white/20 text-white'
                        : 'bg-resqnow-critical/10 text-resqnow-critical'
                    }`}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={isMarkingAll}
            className="shrink-0 min-h-[42px] px-3 rounded-xl text-[10px] font-bold text-resqnow-violet border border-resqnow-violet/15 bg-resqnow-violet/5 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isMarkingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            Mark read
          </button>
        )}
      </div>

      {isLoading && notifications.length === 0 ? (
        <div className="py-16 text-center">
          <Loader2 className="w-7 h-7 text-resqnow-violet animate-spin mx-auto" />
          <p className="text-[12px] text-resqnow-muted mt-3">
            Loading confirmed updates...
          </p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2.5">
          {filtered.map((notification) => {
            const { Icon, label, iconClass } = getStyle(notification.kind);

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotification(notification)}
                className={`w-full text-left rounded-2xl border p-4 transition-all active:scale-[0.99] ${
                  notification.readAt
                    ? 'border-resqnow-border-soft bg-white'
                    : 'border-resqnow-violet/20 bg-resqnow-violet/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-wide text-resqnow-muted">
                        {label}
                      </span>

                      {!notification.readAt && (
                        <span
                          className="w-1.5 h-1.5 bg-resqnow-critical rounded-full"
                          aria-label="Unread"
                        />
                      )}

                      {notification.reportCode && (
                        <span className="text-[9px] font-bold text-resqnow-violet">
                          {notification.reportCode}
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] font-semibold text-resqnow-primary mt-1 leading-snug">
                      {notification.title}
                    </p>

                    <p className="text-[11px] text-resqnow-muted mt-1 leading-relaxed">
                      {notification.message}
                    </p>

                    <p className="text-[10px] text-resqnow-muted mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-resqnow-placeholder shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-resqnow-canvas flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-resqnow-placeholder" />
          </div>
          <p className="text-sm font-semibold text-resqnow-primary">
            No confirmed updates yet
          </p>
          <p className="text-[11px] text-resqnow-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Responder activity and official notifications for your account will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
