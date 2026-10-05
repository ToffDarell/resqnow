import { useEffect, useState } from "react";

import AdminLogin from "./auth/AdminLogin";

import AdminLayout from "./components/layout/AdminLayout";

import Dashboard from "./pages/dashboard/Dashboard";

import AuditLogs from "./pages/audit-logs/AuditLogs";

import SettingsRoles from "./pages/settings/SettingsRoles";

import ManualAddReport from "./pages/manual-report/ManualAddReport";

import AnnouncementsPage from "./pages/announcements/AnnouncementsPage";

import IncidentMap from "./pages/map/IncidentMap";

import AllReports from "./pages/all-reports/AllReports";

import LiveUpdates from "./pages/live-updates/LiveUpdates";

import Verification from "./pages/verification/Verification";

import ReportDetails from "./pages/report-details/ReportDetails";

import Prioritization from "./pages/prioritization/Prioritization";

import ResidentsPage from "./pages/residents/ResidentsPage";

import PersonnelPage from "./pages/personnel/PersonnelPage";

import LanguageProvider from "./context/LanguageProvider";

import { ROLES, hasPermission, normalizeRole } from "./data/roles";

import { createAuditLog, getAllAuditLogs } from "./services/reportsService";

import {
  getCurrentUser,
  getStoredUser,
  isAuthenticated as hasAuthToken,
  logout as logoutUser,
} from "./services/authService";

function App() {
  /* =========================
     AUTHENTICATION
  ========================= */

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return hasAuthToken();
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredUser();
  });

  /* =========================
     NAVIGATION / RBAC
  ========================= */

  const [activePage, setActivePage] = useState("dashboard");
  const can = (permission) => {
    if (!currentUser) {
      return false;
    }

    return hasPermission(currentUser.role, permission);
  };

  const [selectedReport, setSelectedReport] = useState(null);

  const [selectedResident, setSelectedResident] = useState(null);

  /* =========================
     SHARED REPORT DATA
  ========================= */

  const [reportUpdates, setReportUpdates] = useState({});

  /* =========================
     AUDIT LOGS
  ========================= */

  const [auditLogs, setAuditLogs] = useState([]);

  /* =========================
     GLOBAL SYSTEM SETTINGS
  ========================= */

  const [systemSettings, setSystemSettings] = useState({
    systemName: "ResQNow",
    barangayName: "Barangay Camunatan",
    cityName: "City of Ilagan",
    language: "English",
    notifications: true,
    criticalAlerts: true,
    assignmentAlerts: true,
    announcementAlerts: true,
    autoRefresh: true,
  });

  /* =========================
     AUTHENTICATION HANDLERS
  ========================= */

  const handleLogin = (user) => {
    const normalizedUser = {
      ...user,
      id: user.id, // Explicitly map user_id for A04 personnel assignments
      role: normalizeRole(user.role),
    };
    
    setCurrentUser(normalizedUser);
    setIsAuthenticated(true);
    setActivePage("dashboard");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setCurrentUser(null);

      setIsAuthenticated(false);

      setActivePage("dashboard");

      setSelectedReport(null);

      setSelectedResident(null);
    }
  };
  /* =========================
   VERIFY AUTHENTICATION
========================= */

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (!hasAuthToken()) {
        return;
      }

      try {
        const user = await getCurrentUser();

        const normalizedUser = {
          ...user,
          role: normalizeRole(user.role),
        };

        /*
         * The Web Admin is limited to defined operational roles.
         */
        if (!Object.values(ROLES).includes(normalizedUser.role)) {
          localStorage.removeItem("resqnow_token");
          localStorage.removeItem("resqnow_user");

          setCurrentUser(null);
          setIsAuthenticated(false);

          return;
        }

        setCurrentUser(normalizedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication verification failed:", error);

        localStorage.removeItem("resqnow_token");
        localStorage.removeItem("resqnow_user");

        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    verifyAuthentication();
  }, []);

  /* =========================
     NAVIGATION
  ========================= */

  const handleNavigate = (pageId) => {
    if (pageId !== "all-reports") {
      setSelectedResident(null);
    }

    setActivePage(pageId);
  };

  /* =========================
     REPORT SELECTION
  ========================= */

  const handleOpenReport = (report) => {
    const latestReport = {
      ...report,
      ...(reportUpdates[report.id] || {}),
    };

    setSelectedReport(latestReport);

    setActivePage("report-details");
  };

  /* =========================
     RESIDENT REPORTS
  ========================= */

  const handleViewResidentReports = (resident) => {
    setSelectedResident(resident);

    setActivePage("all-reports");
  };

  /* =========================
     SHARED REPORT UPDATE
  ========================= */

  const handleReportUpdate = (updatedReport) => {
    if (!updatedReport?.id) return;

    setReportUpdates((currentUpdates) => {
      const existingUpdate = currentUpdates[updatedReport.id] || {};

      return {
        ...currentUpdates,

        [updatedReport.id]: {
          ...existingUpdate,
          ...updatedReport,
        },
      };
    });

    /* Keep selected report synchronized */

    setSelectedReport((currentReport) => {
      if (!currentReport || currentReport.id !== updatedReport.id) {
        return currentReport;
      }

      return {
        ...currentReport,
        ...updatedReport,
      };
    });
  };

  /* =========================
     LOAD AUDIT LOGS
  ========================= */

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        const data = await getAllAuditLogs();

        const formattedLogs = data.map((log) => ({
          id: `LOG-${log.id}`,

          action: log.action,

          category: log.category,

          target: log.target || "—",

          field: log.field || "—",

          oldValue:
            log.old_value === null ||
            log.old_value === undefined ||
            log.old_value === ""
              ? "—"
              : String(log.old_value),

          newValue:
            log.new_value === null ||
            log.new_value === undefined ||
            log.new_value === ""
              ? "—"
              : String(log.new_value),

          remarks: log.remarks || "No remarks provided.",

          user: log.user_name || "Administrator",

          role: log.user_role || "Barangay Administrator",

          dateTime: log.created_at,

          status: log.status || "Success",
        }));

        setAuditLogs(formattedLogs);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      }
    };

    if (isAuthenticated) {
      loadAuditLogs();
    }
  }, [isAuthenticated]);

  /* =========================
     AUDIT LOG MANAGEMENT
  ========================= */

  const addAuditLog = async ({
    action,
    category = "Report Action",
    target,
    field,
    oldValue,
    newValue,
    remarks = "",
    status = "Success",
  }) => {
    const adminData = JSON.parse(
      sessionStorage.getItem("resqnow_admin_user") || "{}",
    );

    const auditLogData = {
      action,
      category,
      target: target || null,
      field: field || null,

      old_value:
        oldValue === undefined || oldValue === null || oldValue === ""
          ? null
          : String(oldValue),

      new_value:
        newValue === undefined || newValue === null || newValue === ""
          ? null
          : String(newValue),

      remarks: remarks || null,

      user_name: adminData.username || adminData.name || "Administrator",

      user_role: adminData.role || "Barangay Administrator",

      status,
    };

    try {
      const result = await createAuditLog(auditLogData);

      const savedLog = result.data;

      const newLog = {
        id: `LOG-${savedLog.id}`,

        action: savedLog.action,

        category: savedLog.category,

        target: savedLog.target || "—",

        field: savedLog.field || "—",

        oldValue:
          savedLog.old_value === null ||
          savedLog.old_value === undefined ||
          savedLog.old_value === ""
            ? "—"
            : String(savedLog.old_value),

        newValue:
          savedLog.new_value === null ||
          savedLog.new_value === undefined ||
          savedLog.new_value === ""
            ? "—"
            : String(savedLog.new_value),

        remarks: savedLog.remarks || "No remarks provided.",

        user: savedLog.user_name || "Administrator",

        role: savedLog.user_role || "Barangay Administrator",

        dateTime: savedLog.created_at || new Date().toISOString(),

        status: savedLog.status || "Success",
      };

      setAuditLogs((currentLogs) => [newLog, ...currentLogs]);
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  };

  /* =========================
     GLOBAL SETTINGS UPDATE
  ========================= */

  const handleSettingsUpdate = (updatedSettings, changes = []) => {
    setSystemSettings(updatedSettings);

    /*
      Record every changed setting
      in the Audit Logs.
    */

    changes.forEach((change) => {
      addAuditLog({
        action: change.action || "System Setting Updated",

        category: "System Action",

        target: "SYSTEM-SETTINGS",

        field: change.field,

        oldValue: change.oldValue,

        newValue: change.newValue,

        remarks: change.remarks || "System setting was updated.",
      });
    });
  };

  /* =========================
     PAGE RENDERING
  ========================= */

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            onOpenReport={handleOpenReport}
            onNavigate={handleNavigate}
            reportUpdates={reportUpdates}
            autoRefresh={systemSettings.autoRefresh}
          />
        );

      case "all-reports":
        return (
          <AllReports
            onOpenReport={handleOpenReport}
            selectedResident={selectedResident}
            reportUpdates={reportUpdates}
          />
        );

      case "verification":
        return (
          <Verification
            reportUpdates={reportUpdates}
            onVerificationUpdate={handleReportUpdate}
            onAddAuditLog={addAuditLog}
            onNavigate={handleNavigate}
          />
        );

      case "prioritization":
        return (
          <Prioritization
            reportUpdates={reportUpdates}
            onPriorityUpdate={handleReportUpdate}
            onAddAuditLog={addAuditLog}
            onNavigate={handleNavigate}
            onOpenReport={handleOpenReport}
          />
        );

      case "map":
        return <IncidentMap autoRefresh={systemSettings.autoRefresh} />;

      case "live-updates":
        return (
          <LiveUpdates
            onBack={() => handleNavigate("dashboard")}
            autoRefresh={systemSettings.autoRefresh}
          />
        );

      case "residents":
        return (
          <ResidentsPage onViewResidentReports={handleViewResidentReports} />
        );

      case "personnel":
        return (
          <PersonnelPage
            onOpenReport={handleOpenReport}
            reportUpdates={reportUpdates}
          />
        );

      case "announcements":
        return <AnnouncementsPage onAddAuditLog={addAuditLog} />;

      case "audit-logs":
        return <AuditLogs logs={auditLogs} />;

      case "settings":
        return (
          <SettingsRoles
            systemSettings={systemSettings}
            onSettingsUpdate={handleSettingsUpdate}
            onAddAuditLog={addAuditLog}
          />
        );

      case "manual-report":
        return <ManualAddReport />;

      case "report-details":
        return (
          <ReportDetails
            key={selectedReport?.id}
            report={selectedReport}
            onBack={() => handleNavigate("all-reports")}
            onReportUpdate={handleReportUpdate}
            onAddAuditLog={addAuditLog}
          />
        );

      default:
        return (
          <div className="flex min-h-full items-center justify-center">
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-8 py-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-[#1F5FA6]">
                ResQNow Web Admin
              </p>

              <h1 className="mt-2 text-2xl font-extrabold text-[#101C2E]">
                Module Not Implemented Yet
              </h1>

              <p className="mt-2 text-sm text-[#667085]">
                This module will be implemented in a future phase.
              </p>
            </div>
          </div>
        );
    }
  };

  /* =========================
     LOGIN SCREEN
  ========================= */

  if (!isAuthenticated) {
    return (
      <LanguageProvider language={systemSettings?.language || "English"}>
        <AdminLogin onLogin={handleLogin} />
      </LanguageProvider>
    );
  }

  /* =========================
     ADMIN SYSTEM
  ========================= */

  return (
    <LanguageProvider language={systemSettings.language}>
      <AdminLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onAddManualReport={() => handleNavigate("manual-report")}
        currentUser={currentUser}
        can={can}
        systemSettings={systemSettings}
      >
        {renderPage()}
      </AdminLayout>
    </LanguageProvider>
  );
}

export default App;
