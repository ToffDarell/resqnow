import {
  LayoutDashboard,
  FileText,
  BadgeCheck,
  ListFilter,
  MapPinned,
  Users,
  UserCog,
  Megaphone,
  ClipboardList,
  Settings,
  Plus,
  LogOut,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { getCurrentUser } from "../../services/authService";

function Sidebar({
  activePage = "dashboard",
  onNavigate,
  onAddManualReport,
  onLogout,
  // RBAC
  currentUser,
  can,
  // GLOBAL SYSTEM SETTINGS
  systemSettings,
  // MOBILE DRAWER
  isOpen = false,
  onClose,
}) {
  const { t } = useLanguage();
  const [systemStatus, setSystemStatus] = useState("operational");
  const [lastSync, setLastSync] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSystemStatus = async () => {
      try {
        await getCurrentUser();

        if (!isMounted) return;

        setSystemStatus("operational");
        setLastSync(new Date());
      } catch (error) {
        console.error("System health check failed:", error);

        if (!isMounted) return;

        setSystemStatus("error");
        setLastSync(new Date());
      }
    };

    checkSystemStatus();

    const statusInterval = setInterval(() => {
      checkSystemStatus();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(statusInterval);
    };
  }, []);

  const getLastSyncText = () => {
    const seconds = Math.floor(
      (currentTime.getTime() - lastSync.getTime()) / 1000,
    );

    if (seconds < 5) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds} sec ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes === 1) {
      return "1 min ago";
    }

    return `${minutes} min ago`;
  };

  const navigationGroups = [
    {
      label: t("overview"),
      items: [
        {
          id: "dashboard",
          label: t("dashboard"),
          icon: LayoutDashboard,
          permission: "dashboard.view",
        },
      ],
    },
    {
      label: t("operations"),
      items: [
        {
          id: "all-reports",
          label: t("allReports"),
          icon: FileText,
          permission: "reports.view",
        },
        {
          id: "verification",
          label: t("verification"),
          icon: BadgeCheck,
          permission: "verification.view",
        },
        {
          id: "prioritization",
          label: t("prioritization"),
          icon: ListFilter,
          permission: "prioritization.view",
        },
        {
          id: "map",
          label: t("incidentMap"),
          icon: MapPinned,
          permission: "map.view",
        },
      ],
    },
    {
      label: t("management"),
      items: [
        {
          id: "residents",
          label: t("residents"),
          icon: Users,
          permission: "residents.view",
        },
        {
          id: "personnel",
          label: t("personnel"),
          icon: UserCog,
          permission: "personnel.view",
        },
        {
          id: "announcements",
          label: t("announcements"),
          icon: Megaphone,
          permission: "announcements.view",
        },
      ],
    },
    {
      label: t("system"),
      items: [
        {
          id: "audit-logs",
          label: t("auditLogs"),
          icon: ClipboardList,
          permission: "audit.view",
        },
        {
          id: "settings",
          label: t("settingsRoles"),
          icon: Settings,
          permission: "settings.view",
        },
      ],
    },
  ];

  const handleNavigation = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  const handleManualReport = () => {
    if (onAddManualReport) {
      onAddManualReport();
    }
  };

  // Filter navigation based on permissions
  const visibleNavigationGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.permission) return true;

        return can ? can(item.permission) : true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const canCreateReport = can ? can("reports.create") : true;

  const initials = (currentUser?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col
        bg-[#101C2E] text-white
        transition-transform duration-200 ease-out
        lg:static lg:z-auto lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* BRAND */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div className="min-w-0">
          <div className="truncate text-lg font-bold leading-none tracking-tight">
            {systemSettings?.systemName || "ResQNow"}
          </div>

          <p className="mt-1 truncate text-[11px] text-white/55">
            {t("barangayWebAdmin")}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleNavigationGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {group.label}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activePage === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      relative flex h-9 w-full items-center gap-3
                      rounded-md px-3 text-left text-sm transition-colors
                      ${
                        isActive
                          ? "bg-white/10 font-medium text-white"
                          : "text-white/65 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[#5B8DC9]" />
                    )}

                    <Icon size={17} strokeWidth={1.75} className="shrink-0" />

                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* BOTTOM AREA */}
      <div className="shrink-0 space-y-3 border-t border-white/10 p-3">
        {canCreateReport && (
          <button
            type="button"
            onClick={handleManualReport}
            className="
              flex h-10 w-full items-center justify-center gap-2
              rounded-md bg-[#D92D20] px-4 text-sm font-semibold text-white
              transition-colors hover:bg-[#B42318]
            "
          >
            <Plus size={16} strokeWidth={2.25} />

            <span>{t("addManualReport")}</span>
          </button>
        )}

        {/* USER */}
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {currentUser?.name || t("administrator")}
            </p>

            <p className="truncate text-[11px] capitalize text-white/50">
              {currentUser?.role || t("administrator")}
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label={t("signOut")}
            title={t("signOut")}
            className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-2 px-2 text-[11px] text-white/55">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              systemStatus === "operational" ? "bg-[#2ED47A]" : "bg-[#F04438]"
            }`}
          />

          <span className="truncate">
            {systemStatus === "operational"
              ? t("allSystemsOperational")
              : "System connection issue"}
            {" · "}
            {getLastSyncText()}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
