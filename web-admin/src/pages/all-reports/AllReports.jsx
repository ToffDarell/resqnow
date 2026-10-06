import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, RefreshCw } from "lucide-react";

import {
  getAllIncidents,
  getAllReports,
} from "../../services/reportsService";
import { useLanguage } from "../../hooks/useLanguage";

const priorityStyles = {
  Critical: "bg-[#D90429]/10 text-[#D90429] border-[#D90429]/20",

  High: "bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20",

  Moderate: "bg-[#FF8C42]/10 text-[#FF8C42] border-[#FF8C42]/20",

  Low: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/20",

  "Not Prioritized": "bg-[#667085]/10 text-[#667085] border-[#667085]/20",
};

const verificationStyles = {
  Pending: "bg-[#FF8C42]/10 text-[#B54708] border-[#FED7AA]",

  Verified: "bg-[#2ED47A]/10 text-[#027A48] border-[#A6F4C5]",

  Returned: "bg-[#D90429]/10 text-[#B42318] border-[#FECDCA]",
};

const statusStyles = {
  "For Verification": "bg-[#FF8C42]/10 text-[#B54708]",

  "For Prioritization": "bg-[#1F5FA6]/10 text-[#174A86]",

  Prioritized: "bg-[#2ED47A]/10 text-[#027A48]",

  Assigned: "bg-[#5B8DC9]/10 text-[#4F46E5]",

  "In Progress": "bg-[#5B8DC9]/10 text-[#4F46E5]",

  "Responders En Route": "bg-[#1F5FA6]/10 text-[#174A86]",

  Resolved: "bg-[#2ED47A]/10 text-[#027A48]",
};

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="text-2xl font-extrabold leading-none text-[#101C2E]">
          {value}
        </p>

        <span className="text-xs font-medium text-slate-500">
          {detail}
        </span>
      </div>
    </div>
  );
}

function AllReports({ onOpenReport, selectedResident, reportUpdates = {} }) {
  const { t } = useLanguage();

  const [reports, setReports] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ==============================
  // LOAD REPORTS FROM DATABASE
  // ==============================

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [reportsData, incidentsData] = await Promise.all([
        getAllReports(),
        getAllIncidents(),
      ]);

      setReports(reportsData || []);
      setIncidents(incidentsData || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError(err.message || "Unable to load reports from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        const [reportsData, incidentsData] = await Promise.all([
          getAllReports(),
          getAllIncidents(),
        ]);

        if (cancelled) return;

        setReports(reportsData || []);
        setIncidents(incidentsData || []);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load reports:", err);
        setError(err.message || "Unable to load reports from the server.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==============================
  // APPLY LOCAL REPORT UPDATES
  // ==============================

  const updatedReports = useMemo(() => {
    return reports.map((report) => {
      const reportDatabaseId =
        report.databaseId ??
        (String(report.id || "").match(/\d+$/)
          ? Number(String(report.id).match(/\d+$/)[0])
          : null);

      const matchedIncident =
        reportUpdates[report.id]?.incident ||
        incidents.find((incident) => {
          const incidentReportId =
            incident.report_id ??
            incident.report?.id ??
            null;

          return (
            Number(incidentReportId) === Number(reportDatabaseId) ||
            incident.incident_code ===
              `INC-${String(reportDatabaseId || "").padStart(4, "0")}`
          );
        });

      return {
        ...report,
        ...(reportUpdates[report.id] || {}),
        incident: matchedIncident || reportUpdates[report.id]?.incident || null,
      };
    });
  }, [reports, incidents, reportUpdates]);

  // ==============================
  // FILTER REPORTS
  // ==============================

  const filteredReports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return updatedReports.filter((report) => {
      const matchesResident =
        !selectedResident || report.reporter === selectedResident.name;

      const matchesSearch =
        normalizedSearch === "" ||
        report.id?.toLowerCase().includes(normalizedSearch) ||
        report.type?.toLowerCase().includes(normalizedSearch) ||
        report.category?.toLowerCase().includes(normalizedSearch) ||
        report.location?.toLowerCase().includes(normalizedSearch) ||
        report.reporter?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      return (
        matchesResident && matchesSearch && matchesStatus && matchesPriority
      );
    });
  }, [
    updatedReports,
    searchTerm,
    statusFilter,
    priorityFilter,
    selectedResident,
  ]);

  // ==============================
  // STATISTICS
  // ==============================

  const pendingCount = updatedReports.filter(
    (report) => report.verification === "Pending",
  ).length;

  const criticalCount = updatedReports.filter(
    (report) => report.priority === "Critical",
  ).length;

  const activeCount = updatedReports.filter(
    (report) => report.status !== "Resolved",
  ).length;

  const resolvedCount = updatedReports.filter(
    (report) => report.status === "Resolved",
  ).length;

  // ==============================
  // LOADING STATE
  // ==============================

  if (loading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D6E4F5] border-t-[#1F5FA6]" />

          <p className="mt-4 text-sm font-medium text-[var(--text-muted)]">
            {t("loadingReports")}
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR STATE
  // ==============================

  if (error) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <div className="rounded-xl border border-[#FECDCA] bg-[#FFFBFA] px-8 py-6 text-center">
          <p className="text-sm font-bold text-[#B42318]">
            {t("unableToLoadReports")}
          </p>

          <p className="mt-2 text-sm text-[#667085]">{error}</p>

          <button
            onClick={() => loadReports(true)}
            className="mt-4 rounded-lg bg-[#1F5FA6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1F5FA6]"
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // MAIN PAGE
  // ==============================

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* ================= HEADER ================= */}

      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {t("allReportsPageTitle")}
          </h1>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {t("allReportsDescription")}
          </p>
        </div>

        <button
          onClick={() => loadReports(true)}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-white px-4 text-sm font-semibold text-[#475467] shadow-sm transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />

          {t("refresh")}
        </button>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label={t("totalReports")}
          value={updatedReports.length}
          detail={t("allSubmissions")}
        />

        <StatCard
          label={t("activeReports")}
          value={activeCount}
          detail={t("needsAction")}
        />

        <StatCard
          label={t("pendingVerification")}
          value={pendingCount}
          detail={t("needsReview")}
        />

        <StatCard
          label={t("criticalReports")}
          value={criticalCount}
          detail={`${resolvedCount} ${t("resolvedCount")}`}
        />
      </div>

      {/* ================= REPORT TABLE ================= */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white shadow-sm">
        {/* ================= FILTER BAR ================= */}

        <div className="flex shrink-0 flex-col gap-3 border-b border-[var(--border-soft)] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* SEARCH */}

            <div className="flex h-10 min-w-0 max-w-[420px] flex-1 items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[#F8FAFC] px-3 transition focus-within:border-[#1F5FA6] focus-within:bg-white">
              <Search
                size={18}
                className="shrink-0 text-[var(--text-muted)]"
                strokeWidth={2}
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("searchReportsLocationsReporters")}
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            <span className="hidden shrink-0 text-xs font-medium text-[#98A2B3] xl:block">
              {filteredReports.length} {t("reportsCountOf")}{" "}
              {updatedReports.length} {t("reportsCount")}
            </span>
          </div>

          {/* FILTERS */}

          <div className="flex shrink-0 items-center gap-2">
            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm font-medium text-[#475467] outline-none transition focus:border-[#1F5FA6]"
            >
              <option value="All">{t("allStatus")}</option>

              <option value="For Verification">For Verification</option>

              <option value="For Prioritization">For Prioritization</option>

              <option value="Prioritized">Prioritized</option>

              <option value="Assigned">Assigned</option>

              <option value="In Progress">In Progress</option>

              <option value="Responders En Route">Responders En Route</option>

              <option value="Resolved">Resolved</option>
            </select>

            {/* PRIORITY FILTER */}

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="h-10 rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm font-medium text-[#475467] outline-none transition focus:border-[#1F5FA6]"
            >
              <option value="All">{t("allPriority")}</option>

              <option value="Not Prioritized">Not Prioritized</option>

              <option value="Critical">Critical</option>

              <option value="High">High</option>

              <option value="Moderate">Moderate</option>

              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="min-h-0 flex-1 overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr className="border-b border-[var(--border-soft)]">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("report")}
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("location")}
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("submitted")}
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("priority")}
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("verification")}
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("status")}
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Incident
                </th>

                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E4E7EC]">
              {filteredReports.map((report) => {
                const priorityClass =
                  priorityStyles[report.priority] ||
                  priorityStyles["Not Prioritized"];

                const verificationClass =
                  verificationStyles[report.verification] ||
                  verificationStyles.Pending;

                const statusClass =
                  statusStyles[report.status] ||
                  "bg-[#667085]/10 text-[#667085]";

                return (
                  <tr
                    key={report.id}
                    className="group cursor-pointer transition hover:bg-slate-50/80"
                    onClick={() => onOpenReport?.(report)}
                  >
                    {/* REPORT */}

                    <td className="px-4 py-3.5">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF1FA] text-sm font-bold text-[#174A86]">
                          {report.type?.charAt(0) || "R"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                            {report.id}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                            {report.type} • {report.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* LOCATION */}

                    <td className="max-w-[220px] px-4 py-3.5">
                      <p className="truncate text-sm font-medium text-[#344054]">
                        {report.location}
                      </p>
                    </td>

                    {/* SUBMITTED */}

                    <td className="whitespace-nowrap px-4 py-3.5">
                      <p className="text-xs font-medium text-[var(--text-muted)]">
                        {report.submitted}
                      </p>
                    </td>

                    {/* PRIORITY */}

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${priorityClass}`}
                      >
                        {report.priority === "Critical"
                          ? t("critical")
                          : report.priority === "High"
                            ? t("high")
                            : report.priority === "Moderate"
                              ? t("moderate")
                              : report.priority === "Low"
                                ? t("low")
                                : t("notPrioritized")}
                      </span>
                    </td>

                    {/* VERIFICATION */}

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${verificationClass}`}
                      >
                        {report.verification || "Pending"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClass}`}
                      >
                        {report.status === "Resolved"
                          ? t("resolved")
                          : report.status || "Unknown"}
                      </span>
                    </td>

                    {/* INCIDENT */}

                    <td className="px-4 py-3.5">
                      {report.incident ? (
                        <div className="flex min-w-[150px] flex-col gap-1">
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {report.incident.incident_code ||
                              `INC-${String(report.incident.id).padStart(4, "0")}`}
                          </span>

                          <span
                            className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              report.incident.status === "Resolved" ||
                              report.incident.status === "Closed"
                                ? "bg-[#EDFFF5] text-[#027A48]"
                                : report.incident.status === "Dispatched"
                                  ? "bg-[#EEF8FF] text-[#2563EB]"
                                  : report.incident.status === "In Progress"
                                    ? "bg-[#EAF1FA] text-[#1F5FA6]"
                                    : "bg-[#FFF0F3] text-[#D90429]"
                            }`}
                          >
                            {report.incident.status || "Pending Response"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#98A2B3]">
                          No incident
                        </span>
                      )}
                    </td>

                    {/* OPEN */}

                    <td className="px-3 py-3.5 text-right">
                      <ChevronRight
                        size={18}
                        className="text-[#98A2B3] transition group-hover:text-[#1F5FA6]"
                      />
                    </td>
                  </tr>
                );
              })}

              {/* ================= EMPTY STATE ================= */}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1FA] text-[#1F5FA6]">
                        <Search size={22} strokeWidth={2} />
                      </div>

                      <p className="mt-3 text-sm font-bold text-[var(--text-primary)]">
                        {t("noReportsFound")}
                      </p>

                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {t("changeSearchOrFilters")}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= FOOTER ================= */}

        <div className="flex shrink-0 items-center justify-between border-t border-[var(--border-soft)] bg-[#FCFCFD] px-4 py-3">
          <p className="text-xs font-medium text-[var(--text-muted)]">
            {t("showing")}{" "}
            <span className="font-bold text-[#344054]">
              {filteredReports.length}
            </span>{" "}
            {t("reportsCount")}
          </p>

          <p className="hidden text-xs text-[#98A2B3] sm:block">
            {t("selectReportForDetails")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AllReports;
