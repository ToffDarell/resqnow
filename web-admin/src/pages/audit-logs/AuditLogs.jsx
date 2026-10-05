import { useMemo, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

const categoryOptions = [
  "All Categories",
  "Report Action",
  "Account Action",
  "System Action",
];

const actionStyles = {
  "Report Verified": {
    badge: "bg-[#E8F8F4] text-[#008F78]",
    dot: "bg-[#00C9A7]",
  },

  "Report Invalidated": {
    badge: "bg-[#FEF0F0] text-[#C53030]",
    dot: "bg-[#EF4444]",
  },

  "Priority Confirmed": {
    badge: "bg-[#FFF4D6] text-[#A16207]",
    dot: "bg-[#EAB308]",
  },

  "Priority Changed": {
    badge: "bg-[#FFF4D6] text-[#A16207]",
    dot: "bg-[#EAB308]",
  },

  "Personnel Assigned": {
    badge: "bg-[#EEF2FF] text-[#4F46E5]",
    dot: "bg-[#6366F1]",
  },

  "Report Status Updated": {
    badge: "bg-[#EEF2FF] text-[#4F46E5]",
    dot: "bg-[#6366F1]",
  },

  "Announcement Created": {
    badge: "bg-[#EEF2FF] text-[#4F46E5]",
    dot: "bg-[#6366F1]",
  },

  "Announcement Updated": {
    badge: "bg-[#FFF4D6] text-[#A16207]",
    dot: "bg-[#EAB308]",
  },

  "Announcement Published": {
    badge: "bg-[#E8F8F4] text-[#008F78]",
    dot: "bg-[#00C9A7]",
  },

  "Announcement Archived": {
    badge: "bg-[#F2F4F7] text-[#475467]",
    dot: "bg-[#667085]",
  },

  "Announcement Deleted": {
    badge: "bg-[#FEF0F0] text-[#C53030]",
    dot: "bg-[#EF4444]",
  },

  "Manual Report Added": {
    badge: "bg-[#E8F8F4] text-[#008F78]",
    dot: "bg-[#00C9A7]",
  },
};

function AuditLogs({ logs = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [selectedLogId, setSelectedLogId] = useState(null);

  const { t } = useLanguage();

  /*
    LOG DATA

    The logs prop now comes from App.jsx.

    App.jsx loads the records from:
    MySQL → Laravel API → React

    There are NO mock/sample logs here.
  */
  const allLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      const dateA = a.dateTime
        ? new Date(a.dateTime).getTime()
        : 0;

      const dateB = b.dateTime
        ? new Date(b.dateTime).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [logs]);

  /*
    Automatically display the selected log.

    If no log has been manually selected,
    the newest log is displayed.
  */
  const selectedLog =
    allLogs.find((log) => log.id === selectedLogId) ||
    allLogs[0] ||
    null;

  const filteredLogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return allLogs.filter((log) => {
      const matchesCategory =
        categoryFilter === "All Categories" ||
        log.category === categoryFilter;

      const searchableText = [
        log.id,
        log.user,
        log.role,
        log.action,
        log.target,
        log.field,
        log.oldValue,
        log.newValue,
        log.remarks,
        log.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allLogs, searchTerm, categoryFilter]);

  const reportActionCount = allLogs.filter(
    (log) => log.category === "Report Action",
  ).length;

  const accountActionCount = allLogs.filter(
    (log) => log.category === "Account Action",
  ).length;

  const systemActionCount = allLogs.filter(
    (log) => log.category === "System Action",
  ).length;

  const getActionStyle = (action) =>
    actionStyles[action] || {
      badge: "bg-[#F2F4F7] text-[#475467]",
      dot: "bg-[#667085]",
    };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
            {t("auditLogs")}
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Track all important activities, changes, and updates across the
            ResQNow Web Admin System.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 shadow-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#2ED47A]" />

          <span className="text-xs font-semibold text-[#475467]">
            Audit trail active
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Total Activities"
          value={allLogs.length}
          description="All recorded system activities"
          icon={<ListIcon />}
        />

        <SummaryCard
          label="Report Actions"
          value={reportActionCount}
          description="Changes involving reports"
          icon={<ReportIcon />}
        />

        <SummaryCard
          label="Account Actions"
          value={accountActionCount}
          description="User and personnel activities"
          icon={<UserIcon />}
        />

        <SummaryCard
          label="System Actions"
          value={systemActionCount}
          description="Announcements and system activities"
          icon={<SettingsIcon />}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.8fr)]">
        {/* ACTIVITY HISTORY */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          {/* FILTER BAR */}
          <div className="flex shrink-0 flex-col gap-3 border-b border-[#E4E7EC] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#101C2E]">
                {t("activityHistory")}
              </h2>

              <p className="mt-0.5 text-xs text-[#667085]">
                {filteredLogs.length} of {allLogs.length} logs displayed
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* SEARCH */}
              <div className="relative min-w-0 sm:w-64">
                <SearchIcon />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search activities..."
                  className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] pl-9 pr-3 text-xs text-[#101C2E] outline-none transition focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
                />
              </div>

              {/* CATEGORY FILTER */}
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="h-9 rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-xs font-medium text-[#475467] outline-none focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
              >
                {categoryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-[#FCFCFD]">
                <tr className="border-b border-[#E4E7EC]">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#667085]">
                    Date & Time
                  </th>

                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#667085]">
                    User
                  </th>

                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#667085]">
                    Action
                  </th>

                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#667085]">
                    Change
                  </th>

                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#667085]">
                    Target
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => {
                  const style = getActionStyle(log.action);

                  const isSelected =
                    selectedLog?.id === log.id;

                  return (
                    <tr
                      key={log.id}
                      onClick={() =>
                        setSelectedLogId(log.id)
                      }
                      className={`cursor-pointer border-b border-[#F0F1F3] transition hover:bg-[#F9F7FF] ${
                        isSelected
                          ? "bg-[#EAF1FA]"
                          : "bg-white"
                      }`}
                    >
                      {/* DATE */}
                      <td className="px-4 py-3">
                        <div className="whitespace-nowrap text-xs font-semibold text-[#344054]">
                          {formatDateTime(log.dateTime)}
                        </div>

                        <div className="mt-0.5 text-[11px] font-medium text-[#98A2B3]">
                          {log.id}
                        </div>
                      </td>

                      {/* USER */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D6E4F5] text-[11px] font-bold text-[#1F5FA6]">
                            {getInitials(
                              log.user ||
                                "Administrator",
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#344054]">
                              {log.user ||
                                "Administrator"}
                            </p>

                            <p className="truncate text-[11px] text-[#98A2B3]">
                              {log.role ||
                                "Barangay Administrator"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                          />

                          {log.action}
                        </span>
                      </td>

                      {/* CHANGE */}
                      <td className="px-4 py-3">
                        <div className="min-w-[180px]">
                          <div className="text-xs font-semibold text-[#475467]">
                            {log.oldValue || "—"}

                            <span className="mx-1.5 text-[#1F5FA6]">
                              →
                            </span>

                            <span className="text-[#101C2E]">
                              {log.newValue || "—"}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-[#98A2B3]">
                            {log.field ||
                              "System Activity"}
                          </p>
                        </div>
                      </td>

                      {/* TARGET */}
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-[#F2F4F7] px-2 py-1 font-mono text-[11px] font-semibold text-[#475467]">
                          {log.target || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center"
                    >
                      <p className="text-sm font-bold text-[#344054]">
                        No audit logs found
                      </p>

                      <p className="mt-1 text-xs text-[#98A2B3]">
                        Try adjusting your search or category
                        filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* LOG DETAILS */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          <div className="shrink-0 border-b border-[#E4E7EC] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F5FA6]">
              Log Details
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#101C2E]">
              {t("activityInformation")}
            </h2>
          </div>

          {selectedLog ? (
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {/* ACTION */}
              <div className="rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#98A2B3]">
                      Action
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#101C2E]">
                      {selectedLog.action}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F4] px-2.5 py-1 text-[11px] font-bold text-[#008F78]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2ED47A]" />

                    {selectedLog.status ||
                      "Success"}
                  </span>
                </div>
              </div>

              {/* CHANGE */}
              <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#98A2B3]">
                  Change Made
                </p>

                <p className="mt-2 text-xs font-bold text-[#344054]">
                  {selectedLog.field ||
                    "System Activity"}
                </p>

                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3">
                    <p className="text-[11px] font-bold uppercase text-[#B42318]">
                      Old Value
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#344054]">
                      {selectedLog.oldValue || "—"}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-[#1F5FA6]">
                    →
                  </span>

                  <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF3] p-3">
                    <p className="text-[11px] font-bold uppercase text-[#027A48]">
                      New Value
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#344054]">
                      {selectedLog.newValue || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-4">
                <DetailRow
                  label="Log ID"
                  value={selectedLog.id}
                  mono
                />

                <DetailRow
                  label="Date & Time"
                  value={formatDateTime(
                    selectedLog.dateTime,
                  )}
                />

                <DetailRow
                  label="User"
                  value={
                    selectedLog.user ||
                    "Administrator"
                  }
                />

                <DetailRow
                  label="Role"
                  value={
                    selectedLog.role ||
                    "Barangay Administrator"
                  }
                />

                <DetailRow
                  label="Category"
                  value={selectedLog.category}
                />

                <DetailRow
                  label="Target"
                  value={
                    selectedLog.target || "—"
                  }
                  mono
                />
              </div>

              {/* REMARKS */}
              <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#98A2B3]">
                  Reason / Remarks
                </p>

                <p className="mt-2 text-xs leading-5 text-[#475467]">
                  {selectedLog.remarks ||
                    "No remarks provided."}
                </p>
              </div>

              {/* SECURITY */}
              <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-[#F9F7FF] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D6E4F5] text-[#1F5FA6]">
                    <ShieldIcon />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#101C2E]">
                      Audit Trail Record
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-[#667085]">
                      This activity is permanently recorded in the
                      ResQNow database for administrative accountability
                      and system monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center">
              <p className="text-sm text-[#98A2B3]">
                No audit logs have been recorded yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function SummaryCard({
  label,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#667085]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#101C2E]">
            {value}
          </p>

          <p className="mt-0.5 text-[11px] font-medium text-[#98A2B3]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF1FA] text-[#1F5FA6]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F0F1F3] py-2.5 last:border-b-0">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[#98A2B3]">
        {label}
      </span>

      <span
        className={`text-right text-xs font-semibold text-[#344054] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================
   HELPERS
========================= */

function getInitials(name = "Administrator") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateTime(dateTime) {
  if (!dateTime) return "—";

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return dateTime;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/* =========================
   ICONS
========================= */

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5.5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0-1.03 1.56 1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 5 6v5c0 4.5 2.9 8.4 7 10 4.1-1.6 7-5.5 7-10V6z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </svg>
  );
}

export default AuditLogs;