import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ClipboardList,
  FileCheck2,
  FileText,
  MapPin,
  Plus,
} from "lucide-react";

import { getAllIncidents, getAllReports } from "../../services/reportsService";

import { useLanguage } from "../../hooks/useLanguage";

/* =========================================================
   HELPERS
========================================================= */

function formatTime(dateValue) {
  if (!dateValue) return "Unknown";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUpdateType(incident) {
  const status = incident.status || "";

  if (status === "Resolved" || status === "Closed") {
    return "success";
  }

  if (status === "Dispatched" || status === "In Progress") {
    return "info";
  }

  return "danger";
}

function getUpdateIcon(type) {
  if (type === "success") {
    return Check;
  }

  if (type === "info") {
    return Plus;
  }

  return AlertTriangle;
}

function getIncidentIconStyle(type) {
  if (type === "success") {
    return "bg-[#EDFFF5] text-[#2ED47A]";
  }

  if (type === "info") {
    return "bg-[#EEF8FF] text-[#38BDF8]";
  }

  return "bg-[#FFF0F3] text-[#D90429]";
}

function getStatusBadgeStyle(status) {
  switch (status) {
    case "Resolved":
      return "bg-[#EDFFF5] text-[#027A48]";

    case "Dispatched":
      return "bg-[#EEF8FF] text-[#2563EB]";

    case "In Progress":
      return "bg-[#EAF1FA] text-[#1F5FA6]";

    case "Pending Response":
      return "bg-[#FFF0F3] text-[#D90429]";

    default:
      return "bg-[#FFF4EC] text-[#B54708]";
  }
}

/* =========================================================
   STATIC CARD CONFIGURATION
========================================================= */

const statConfig = [
  {
    titleKey: "totalReports",
    icon: FileText,
    accent: "#1F5FA6",
    iconBg: "bg-[#EAF1FA]",
    iconColor: "text-[#1F5FA6]",
  },

  {
    titleKey: "emergencyReports",
    icon: AlertTriangle,
    accent: "#FF2D55",
    iconBg: "bg-[#FFF0F3]",
    iconColor: "text-[#FF2D55]",
  },

  {
    titleKey: "nonEmergencyReports",
    icon: FileCheck2,
    accent: "#38BDF8",
    iconBg: "bg-[#EEF8FF]",
    iconColor: "text-[#38BDF8]",
  },

  {
    titleKey: "pendingVerification",
    icon: ClipboardList,
    accent: "#FF8C42",
    iconBg: "bg-[#FFF4EC]",
    iconColor: "text-[#FF8C42]",
  },

  {
    titleKey: "resolvedReports",
    icon: Check,
    accent: "#2ED47A",
    iconBg: "bg-[#EDFFF5]",
    iconColor: "text-[#2ED47A]",
  },
];

export default function Dashboard({
  onNavigate,
  reportUpdates = {},
  autoRefresh = true,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  const hour = currentDate.getHours();

 const greetingKey =
  hour >= 5 && hour < 12
    ? "goodMorningAdmin"
    : hour >= 12 && hour < 18
      ? "goodAfternoonAdmin"
      : "goodEveningAdmin";
  const { t } = useLanguage();

  /* =========================================================
     STATE
  ========================================================= */

  const [reports, setReports] = useState([]);

  const [incidents, setIncidents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  const loadDashboardData = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const [reportsData, incidentsData] = await Promise.all([
        getAllReports(),
        getAllIncidents(),
      ]);

      setReports(reportsData || []);

      setIncidents(incidentsData || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);

      setError(err.message || "Unable to load dashboard data.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  /* =========================================================
     LOAD WHEN DASHBOARD OPENS
  ========================================================= */

  useEffect(() => {
    const load = async () => {
      await loadDashboardData(true);
    };

    load();

    if (!autoRefresh) {
      return undefined;
    }

    const refreshInterval = setInterval(() => {
      loadDashboardData(false);
    }, 15000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [autoRefresh]);

  /* =========================================================
     APPLY LOCAL REPORT UPDATES
  ========================================================= */

  const updatedReports = useMemo(() => {
    return reports.map((report) => {
      if (reportUpdates[report.id]) {
        return {
          ...report,
          ...reportUpdates[report.id],
        };
      }

      return report;
    });
  }, [reports, reportUpdates]);

  /* =========================================================
     DASHBOARD STATISTICS
  ========================================================= */

  const totalReports = updatedReports.length;

  const emergencyReports = updatedReports.filter((report) => {
    const type = (report.type || report.report_type || "").toLowerCase();

    return (
      type.includes("emergency") ||
      type.includes("fire") ||
      type.includes("flood")
    );
  }).length;

  const nonEmergencyReports = totalReports - emergencyReports;

  const pendingVerification = updatedReports.filter(
    (report) => report.verification === "Pending",
  ).length;

  const resolvedReports = updatedReports.filter((report) => {
    const relatedIncident = incidents.find(
      (incident) => incident.report_id === report.databaseId,
    );

    return (
      relatedIncident && ["Resolved", "Closed"].includes(relatedIncident.status)
    );
  }).length;

  const dashboardStats = [
    {
      ...statConfig[0],
      value: totalReports,
      textKey: "reportsRecorded",
    },

    {
      ...statConfig[1],
      value: emergencyReports,
      textKey: "emergencyCases",
    },

    {
      ...statConfig[2],
      value: nonEmergencyReports,
      textKey: "nonEmergencyCases",
    },

    {
      ...statConfig[3],
      value: pendingVerification,
      textKey: "awaitingReview",
    },

    {
      ...statConfig[4],
      value: resolvedReports,
      textKey: "successfullyResolved",
    },
  ];

  /* =========================================================
     ACTIVE INCIDENTS
  ========================================================= */

  const activeIncidents = useMemo(() => {
    return incidents.filter(
      (incident) => !["Resolved", "Closed"].includes(incident.status),
    );
  }, [incidents]);

  const activeIncident = activeIncidents[0] || null;

  const urgentReports = useMemo(() => {
    return updatedReports.filter((report) => {
      if (!["Critical", "High"].includes(report.priority)) {
        return false;
      }

      const relatedIncident = incidents.find(
        (incident) => incident.report_id === report.databaseId,
      );

      if (
        relatedIncident &&
        ["Resolved", "Closed"].includes(relatedIncident.status)
      ) {
        return false;
      }

      return true;
    });
  }, [updatedReports, incidents]);

  /* =========================================================
     LIVE UPDATES
  ========================================================= */

  const dashboardUpdates = useMemo(() => {
    return [...incidents]
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);

        const dateB = new Date(b.updated_at || b.created_at);

        return dateB - dateA;
      })
      .slice(0, 5)
      .map((incident) => {
        const type = getUpdateType(incident);

        return {
          id: incident.id,

          time: formatTime(incident.updated_at || incident.created_at),

          title: incident.title || incident.type || "Emergency Incident",

          description:
            incident.description || "No incident description provided.",

          location: incident.location || "Location not specified",

          status: incident.status || "Pending Response",

          priority: incident.priority || "Not Prioritized",

          incidentCode:
            incident.incident_code ||
            `INC-${String(incident.id).padStart(4, "0")}`,

          type,

          icon: getUpdateIcon(type),
        };
      });
  }, [incidents]);

  /* =========================================================
     PRIORITY OVERVIEW
  ========================================================= */

  const priorityCounts = useMemo(() => {
    const priorityCounts = {
      Critical: 0,
      High: 0,
      Moderate: 0,
      Low: 0,
    };

    updatedReports.forEach((report) => {
      const priority = report.priority;

      if (priority && priorityCounts[priority] !== undefined) {
        priorityCounts[priority] += 1;
      }
    });

    return priorityCounts;
  }, [updatedReports]);

  const priorityTotal = Object.values(priorityCounts).reduce(
    (total, value) => total + value,
    0,
  );

  const priorityData = [
    {
      labelKey: "critical",
      value: priorityCounts.Critical,
      color: "bg-[#D90429]",
    },

    {
      labelKey: "high",
      value: priorityCounts.High,
      color: "bg-[#FF2D55]",
    },

    {
      labelKey: "moderate",
      value: priorityCounts.Moderate,
      color: "bg-[#FF8C42]",
    },

    {
      labelKey: "low",
      value: priorityCounts.Low,
      color: "bg-[#38BDF8]",
    },
  ];

  /* =========================================================
   DATE & TIME
========================================================= */

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedDayTime = currentDate.toLocaleString(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        {/* =====================================================
           HEADER
        ===================================================== */}

        <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-[24px] font-bold leading-tight text-[var(--text-primary)]">
  {t(greetingKey)}
</h1>

            <p className="mt-1 text-[14px] text-[var(--text-muted)]">
              {t("dashboardSituation")}
            </p>
          </div>

          {/* DATE CARD */}

          <div className="hidden items-center gap-3 rounded-xl border border-[var(--border-mist)] bg-white px-3.5 py-2.5 shadow-sm md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FA] text-[#1F5FA6]">
              <CalendarDays size={19} />
            </div>

            <div>
              <p className="text-[15px] font-bold text-[var(--text-primary)]">
                {formattedDate}
              </p>

              <p className="text-[13px] text-[var(--text-muted)]">
                {formattedDayTime}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
           TOP STATISTICS
        ===================================================== */}

        <section className="grid shrink-0 grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.titleKey}
                className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="absolute left-0 right-0 top-0 h-1 opacity-90"
                  style={{ backgroundColor: stat.accent }}
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t(stat.titleKey)}
                    </p>

                    <p className="mt-1.5 text-[28px] font-extrabold leading-none text-[#101C2E]">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${stat.iconBg}`}
                  >
                    <Icon size={20} className={stat.iconColor} />
                  </div>
                </div>

                <p className="mt-2.5 text-[12px] font-medium text-slate-500">
                  {t(stat.textKey)}
                </p>
              </div>
            );
          })}
        </section>

        {/* =====================================================
           URGENT EMERGENCY REPORTS
        ===================================================== */}

        <section className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8ECF1] px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={19} className="text-[#D90429]" />

              <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
                {t("urgentEmergencyReports")}
              </h2>
            </div>

            <span className="rounded-full bg-[#FFF0F3] px-3 py-1 text-xs font-bold text-[#D90429]">
              {urgentReports.length}
            </span>
          </div>

          <div className="p-4">
            {urgentReports.length === 0 ? (
              <div className="flex min-h-[100px] items-center justify-center text-center">
                <p className="text-sm text-[var(--text-muted)]">
                  {t("noUrgentEmergencyReports")}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {urgentReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 border-l-4 border-l-[#D90429] bg-white p-3.5 shadow-xs transition hover:bg-slate-50/70"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-red-200/60 bg-red-50 px-2 py-0.5 text-[11px] font-bold text-[#D90429]">
                          {report.priority || "Urgent"}
                        </span>

                        <span className="text-xs font-semibold text-slate-500">
                          {report.report_type ||
                            report.type ||
                            "Emergency Report"}
                        </span>
                      </div>

                      <p className="mt-1.5 truncate text-sm font-bold text-[#101C2E]">
                        {report.description || "No description provided."}
                      </p>

                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                        <MapPin size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate">{report.location || "Location not specified"}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate?.("report-details", report)}
                      className="shrink-0 rounded-lg bg-[#1F5FA6] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#174A86] active:scale-95"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
           MAIN CONTENT
        ===================================================== */}

        <section className="grid min-h-[450px] grid-cols-1 gap-3 xl:grid-cols-[1.25fr_0.9fr]">
          {/* ===================================================
             LEFT COLUMN
          =================================================== */}

          <div className="flex min-h-0 flex-col gap-3">
            {/* ================================================
               ACTIVE INCIDENT
            ================================================ */}

            <section className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white shadow-sm">
              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-[#E8ECF1] px-4 py-3">
                <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
                  {t("activeIncident")}
                </h2>

                <div className="flex items-center gap-2 rounded-full bg-[#FFF0F3] px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF2D55]" />

                  <span className="text-sm font-semibold text-[#D90429]">
                    {activeIncident
                      ? t("activeIncidentStatus")
                      : t("noActiveIncident")}
                  </span>
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-4">
                {loading ? (
                  <div className="flex min-h-[170px] items-center justify-center">
                    <p className="text-sm text-[var(--text-muted)]">
                      {t("loadingIncident")}
                    </p>
                  </div>
                ) : activeIncident ? (
                  <>
                    {/* ALERT CARD */}

                    <div className="rounded-xl bg-[#B42318] p-5 text-white">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#D90429]">
                            <AlertTriangle size={25} />
                          </div>

                          <div>
                            <h3 className="text-[21px] font-bold">
                              {activeIncident.title ||
                                activeIncident.type ||
                                t("emergencyIncident")}
                            </h3>

                            <p className="mt-1 text-sm text-white/85">
                              {activeIncident.description ||
                                t("emergencyResponseMonitoring")}
                            </p>
                          </div>
                        </div>

                        <div className="hidden text-right sm:block">
                          <p className="text-xs font-medium text-white/75">
                            {t("currentStatus")}
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            {activeIncident.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-lg bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {t("incidentId")}
                        </p>

                        <p className="mt-1 font-bold text-[var(--text-primary)]">
                          {activeIncident.incident_code ||
                            `INC-${String(activeIncident.id).padStart(4, "0")}`}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {t("location")}
                        </p>

                        <p className="mt-1 truncate font-bold text-[var(--text-primary)]">
                          {activeIncident.location || t("notSpecified")}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {t("status")}
                        </p>

                        <p className="mt-1 font-bold text-[var(--text-primary)]">
                          {activeIncident.status}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#FFF0F3] p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#B42318]">
                          {t("priority")}
                        </p>

                        <p className="mt-1 font-bold text-[#D90429]">
                          {activeIncident.priority || t("notPrioritized")}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[170px] flex-col items-center justify-center p-6 text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={26} strokeWidth={2.5} />
                    </div>

                    <h3 className="mt-1 text-base font-bold text-[#101C2E]">
                      {t("noActiveIncidents")}
                    </h3>

                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                      {t("allIncidentsResolved")}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ================================================
               PRIORITY OVERVIEW
            ================================================ */}

            <section className="flex min-h-[220px] flex-1 flex-col rounded-xl border border-[var(--border-soft)] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                  {t("priorityOverview")}
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {priorityTotal} {t("reports") || "Reports"}
                </span>
              </div>

              <div className="mt-4 flex flex-1 flex-col items-center gap-6 sm:flex-row">
                {/* DONUT */}
                <div className="relative flex shrink-0 items-center justify-center">
                  <div
                    className="relative h-[136px] w-[136px] rounded-full shadow-inner transition-transform hover:scale-105 duration-300"
                    style={{
                      background:
                        priorityTotal > 0
                          ? `conic-gradient(
                              #D90429 0deg ${(priorityCounts.Critical / priorityTotal) * 360}deg,
                              #FF2D55 ${(priorityCounts.Critical / priorityTotal) * 360}deg ${
                                ((priorityCounts.Critical + priorityCounts.High) / priorityTotal) * 360
                              }deg,
                              #FF8C42 ${
                                ((priorityCounts.Critical + priorityCounts.High) / priorityTotal) * 360
                              }deg ${
                                ((priorityCounts.Critical +
                                  priorityCounts.High +
                                  priorityCounts.Moderate) /
                                  priorityTotal) *
                                360
                              }deg,
                              #38BDF8 ${
                                ((priorityCounts.Critical +
                                  priorityCounts.High +
                                  priorityCounts.Moderate) /
                                  priorityTotal) *
                                360
                              }deg 360deg
                            )`
                          : "#F1F5F9",
                    }}
                  >
                    <div className="absolute inset-[16px] flex flex-col items-center justify-center rounded-full bg-white shadow-xs">
                      <span className="text-2xl font-black leading-none text-[#101C2E]">
                        {priorityTotal}
                      </span>

                      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t("reports") || "Reports"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LEGEND */}
                <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  {priorityData.map((item) => {
                    const percentage =
                      priorityTotal > 0
                        ? Math.round((item.value / priorityTotal) * 100)
                        : 0;

                    return (
                      <div
                        key={item.labelKey}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 transition hover:bg-slate-100/70"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`}
                          />
                          <span className="truncate text-xs font-semibold text-slate-700">
                            {t(item.labelKey)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-[#101C2E]">
                            {item.value}
                          </span>
                          <span className="min-w-[34px] rounded bg-white px-1.5 py-0.5 text-right text-[10px] font-bold text-slate-500 shadow-xs border border-slate-200/60">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* ===================================================
             LIVE UPDATES
          =================================================== */}

          <section className="flex min-h-[450px] flex-col overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white p-4 shadow-sm">
            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-[#E8ECF1] pb-3">
              <h2 className="text-[19px] font-bold text-[var(--text-primary)]">
                {t("liveUpdates")}
              </h2>

              <button
                type="button"
                onClick={() => onNavigate?.("live-updates")}
                className="
                  text-sm font-semibold
                  text-[var(--brand-primary)]
                  transition
                  hover:text-[#1F5FA6]
                "
              >
                {t("viewAllUpdates")} →
              </button>
            </div>

            {/* ERROR */}

            {error ? (
              <div className="flex flex-1 items-center justify-center text-center">
                <div>
                  <AlertTriangle className="mx-auto text-[#D90429]" size={30} />

                  <p className="mt-3 text-sm text-[#D90429]">{error}</p>

                  <button
                    type="button"
                    onClick={loadDashboardData}
                    className="mt-3 text-sm font-semibold text-[#1F5FA6]"
                  >
                    {t("tryAgain")}
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">
                  {t("loadingUpdates")}
                </p>
              </div>
            ) : dashboardUpdates.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <ClipboardList size={22} />
                </div>
                <p className="text-sm font-bold text-[#101C2E]">
                  {t("noIncidentUpdates")}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  New response activities will appear here.
                </p>
              </div>
            ) : (
              <div className="relative mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="absolute bottom-4 left-[21px] top-4 w-px bg-[#D9E0E8]" />

                <div className="space-y-0">
                  {dashboardUpdates.map((update, index) => {
                    const Icon = update.icon;

                    const iconStyle = getIncidentIconStyle(update.type);

                    return (
                      <div
                        key={update.id}
                        className={`relative flex gap-4 py-4 ${
                          index !== dashboardUpdates.length - 1
                            ? "border-b border-[#EEF1F4]"
                            : ""
                        }`}
                      >
                        {/* ICON */}

                        <div
                          className={`
                              relative z-10 flex
                              h-[44px] w-[44px]
                              shrink-0 items-center
                              justify-center rounded-full
                              ${iconStyle}
                            `}
                        >
                          <Icon size={19} strokeWidth={2} />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[13px] font-medium text-[var(--text-muted)]">
                              {update.time}
                            </p>

                            <span
                              className={`
                                  rounded-full px-2.5 py-1
                                  text-xs font-semibold
                                  ${getStatusBadgeStyle(update.status)}
                                `}
                            >
                              {update.status}
                            </span>
                          </div>

                          <h3 className="mt-1 text-[16px] font-bold text-[var(--text-primary)]">
                            {update.title}
                          </h3>

                          <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-muted)]">
                            {update.description}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                              <MapPin size={13} />

                              {update.location}
                            </span>

                            <span>{update.incidentCode}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
