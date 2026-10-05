import { useContext, useEffect, useRef, useState } from "react";

import { Bell, Menu, Search, X } from "lucide-react";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/reportsService";

import LanguageContext from "../../context/LanguageContextValue";

function Topbar({ currentUser, onMenuClick }) {
  const languageContext = useContext(LanguageContext);

  const t = languageContext?.t || ((key) => key);

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        if (isMounted) {
          setLoadingNotifications(true);
        }

        const [data, unreadCount] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount(),
        ]);

        if (isMounted) {
          setNotifications(data);
          setUnreadNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        if (isMounted) {
          setLoadingNotifications(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    if (notification.is_read) {
      return;
    }

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.id === notification.id
            ? {
                ...currentNotification,
                is_read: true,
              }
            : currentNotification,
        ),
      );

      setUnreadNotificationCount((current) => Math.max(0, current - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );

      setUnreadNotificationCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    console.log("Searching for:", query);

    // Frontend placeholder.
    // This will later connect to Laravel API search.
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "critical_report":
        return "bg-[#D90429]";

      case "personnel_assignment":
        return "bg-[#FF8C42]";

      case "announcement_published":
        return "bg-[#38BDF8]";

      default:
        return "bg-[#38BDF8]";
    }
  };

  return (
    <header className="relative z-40 shrink-0 border-b border-[var(--border-soft)] bg-[var(--card-white)]">
      

      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--canvas-neutral)] lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* SEARCH */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="
              flex h-10 w-full max-w-[500px] items-center gap-3
              rounded-lg border border-[var(--border-soft)]
              bg-[var(--canvas-neutral)]
              px-4 transition
              focus-within:border-[var(--brand-primary)]
              focus-within:bg-white
              focus-within:ring-2
              focus-within:ring-[var(--brand-primary)]/10
            "
          >
            <Search
              size={18}
              className="shrink-0 text-[var(--text-muted)]"
              strokeWidth={2}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchReportsResidentsLocations")}
              className="
                min-w-0 flex-1 bg-transparent text-sm
                text-[var(--text-primary)]
                outline-none
                placeholder:text-[var(--text-placeholder)]
              "
              aria-label={t("searchReportsResidentsLocations")}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="
                  text-[var(--text-placeholder)]
                  transition
                  hover:text-[var(--text-muted)]
                "
                aria-label={t("clearSearch")}
              >
                <X size={17} strokeWidth={2.5} />
              </button>
            )}
          </form>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* NOTIFICATIONS */}
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              aria-label={t("notifications")}
              onClick={() => setShowNotifications((current) => !current)}
              className={`
                relative flex h-10 w-10 items-center justify-center
                rounded-lg border transition
                ${
                  showNotifications
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-md"
                    : "border-[var(--border-soft)] bg-white text-[var(--text-muted)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                }
              `}
            >
              <Bell size={19} strokeWidth={2} />

              {/* NOTIFICATION BADGE */}
              {unreadNotificationCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-[var(--critical-rose)]" />
              )}
            </button>

            {/* NOTIFICATION PANEL */}
            {showNotifications && (
              <div
                className="
                  absolute right-0 top-12 w-[min(360px,calc(100vw-2rem))]
                  overflow-hidden rounded-xl
                  border border-[var(--border-soft)]
                  bg-white
                  shadow-lg
                "
              >
                {/* PANEL HEADER */}
                <div className="border-b border-[var(--border-soft)] bg-[var(--soft-blue-mist)] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {t("notifications")}
                      </h3>

                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {t("latestSystemActivity")}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--brand-primary)] shadow-sm">
                      {unreadNotificationCount} {t("new")}
                    </span>
                  </div>
                </div>

                {/* NOTIFICATION LIST */}
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`
                          flex w-full items-start gap-3
                          border-b border-[#F2F4F7]
                          px-4 py-3 text-left
                          transition hover:bg-[#F9FAFB]
                          ${
                            !notification.is_read
                              ? "bg-[var(--soft-blue-mist)]/40"
                              : ""
                          }
                        `}
                      >
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${getNotificationColor(
                            notification.type,
                          )}`}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-[var(--text-placeholder)]">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* PANEL FOOTER */}
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={
                    loadingNotifications || unreadNotificationCount === 0
                  }
                  className="
                    w-full border-t border-[var(--border-soft)]
                    px-4 py-3 text-center text-xs
                    font-semibold text-[var(--brand-primary)]
                    transition
                    hover:bg-[var(--soft-blue-mist)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* ADMIN PROFILE */}
          <div className="flex items-center gap-3 pl-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#101C2E] text-xs font-semibold text-white">
              {(currentUser?.name || "A")
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {currentUser?.name || t("administrator")}
              </p>

              <p className="truncate text-xs capitalize text-[var(--text-muted)]">
                {currentUser?.role || t("barangayPersonnel")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
