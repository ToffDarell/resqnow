// src/components/resident/TrackReports.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Search,
  Siren,
  FileText,
  MapPin,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Activity,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import {
  getReports,
} from '../../services/reportService';

import {
  getStatusStyle,
  getPriorityStyle,
} from '../../utils/statusUtils';

// ============ FILTER OPTIONS ============

const filters = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'Emergency',
    label: 'Emergency',
  },
  {
    id: 'Non-Emergency',
    label: 'Non-Emergency',
  },
];

// ============ TRACK REPORTS ============

export default function TrackReports() {
  const navigate =
    useNavigate();

  // ============ REPORT DATA ============

  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState('');

  const [
    lastChecked,
    setLastChecked,
  ] = useState(null);

  // ============ FILTERS ============

  const [
    filter,
    setFilter,
  ] = useState('all');

  const [
    search,
    setSearch,
  ] = useState('');

  // ============ LOAD REPORTS ============

  const loadReports =
    useCallback(
      async ({
        refresh = false,
      } = {}) => {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setLoadError('');

        try {
          const residentReports =
            await getReports();

          setReports(
            Array.isArray(
              residentReports
            )
              ? residentReports
              : []
          );

          setLastChecked(
            new Date()
          );
        } catch (error) {
          /**
           * IMPORTANT:
           *
           * Do not erase reports that were already
           * loaded successfully just because a later
           * refresh fails.
           */
          setLoadError(
            error?.message ||
              'Unable to load your reports.'
          );
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // ============ COUNTS ============

  /**
   * OPEN
   *
   * Any report that has not reached a terminal
   * state is still open.
   */
  const openCount =
    useMemo(
      () =>
        reports.filter(
          (report) =>
            ![
              'Resolved',
              'Invalid',
              'Cancelled',
            ].includes(
              report.status
            )
        ).length,
      [reports]
    );

  /**
   * PENDING
   *
   * A subset of open reports that are still
   * awaiting barangay verification.
   */
  const pendingCount =
    useMemo(
      () =>
        reports.filter(
          (report) =>
            report.status ===
            'Pending Verification'
        ).length,
      [reports]
    );

  const closedCount =
    useMemo(
      () =>
        reports.filter(
          (report) =>
            [
              'Resolved',
              'Invalid',
              'Cancelled',
            ].includes(
              report.status
            )
        ).length,
      [reports]
    );

  const emergencyCount =
    useMemo(
      () =>
        reports.filter(
          (report) =>
            report.reportType ===
            'Emergency'
        ).length,
      [reports]
    );

  const nonEmergencyCount =
    useMemo(
      () =>
        reports.filter(
          (report) =>
            report.reportType ===
            'Non-Emergency'
        ).length,
      [reports]
    );

  // ============ FILTER + SEARCH ============

  const filteredReports =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return reports.filter(
        (report) => {
          const matchesFilter =
            filter === 'all' ||
            report.reportType ===
              filter;

          const searchableValues = [
            report.id,
            report.concernType,
            report.subcategory,
            report.location,
            report.landmark,
            report.status,
            report.priority,
          ];

          const matchesSearch =
            !query ||
            searchableValues.some(
              (value) =>
                String(
                  value || ''
                )
                  .toLowerCase()
                  .includes(
                    query
                  )
            );

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      reports,
      filter,
      search,
    ]);

  // ============ LAST CHECKED ============

  const lastCheckedText =
    lastChecked
      ? lastChecked.toLocaleTimeString(
          'en-PH',
          {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
          }
        )
      : '';

  // ============ INITIAL LOADING ============

  if (
    isLoading &&
    reports.length === 0
  ) {
    return (
      <div className="px-4 pt-5 pb-28 min-h-screen">

        <div className="mb-5">

          <h1 className="text-xl font-bold text-resqnow-primary">
            Track Reports
          </h1>

          <p className="text-[13px] text-resqnow-muted mt-1">
            Monitor the progress and status of your submitted reports.
          </p>
        </div>

        <div className="bg-white border border-resqnow-border-soft rounded-2xl py-14 px-6 text-center">

          <Loader2 className="w-7 h-7 text-resqnow-violet animate-spin mx-auto" />

          <p className="text-[12px] text-resqnow-muted mt-3">
            Loading your reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-28 min-h-screen">

      {/* ============ PAGE HEADER ============ */}
      <div className="mb-4">

        <div className="flex items-start justify-between gap-3">

          <div>

            <h1 className="text-xl font-bold text-resqnow-primary">
              Track Reports
            </h1>

            <p className="text-[13px] text-resqnow-muted mt-1 leading-relaxed">
              Monitor the progress and status of your submitted reports.
            </p>

            <p className="text-[11px] text-resqnow-muted mt-1">
              {isRefreshing
                ? 'Refreshing reports...'
                : lastCheckedText
                ? `Last checked ${lastCheckedText}`
                : 'Checking reports...'}
            </p>
          </div>

          {/* Normal refresh control */}
          <button
            type="button"
            onClick={() =>
              loadReports({
                refresh: true,
              })
            }
            disabled={
              isRefreshing
            }
            aria-label="Refresh reports"
            className="w-10 h-10 rounded-xl border border-resqnow-violet/15 bg-resqnow-violet/5 text-resqnow-violet flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-resqnow-violet/10 active:scale-95 transition-all"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ============ ERROR ============ */}
      {loadError && (
        <div
          role="alert"
          className="mb-4 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl p-3"
        >
          <div className="flex items-start gap-2.5">

            <AlertCircle className="w-4 h-4 text-resqnow-critical mt-0.5 shrink-0" />

            <div className="flex-1">

              <p className="text-[12px] font-semibold text-resqnow-crimson">
                Could not refresh your reports
              </p>

              <p className="text-[12px] text-resqnow-secondary mt-1 leading-relaxed">
                {loadError}
              </p>

              {reports.length >
                0 && (
                <p className="text-[11px] text-resqnow-muted mt-1">
                  Showing the last successfully loaded information.
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  loadReports({
                    refresh: true,
                  })
                }
                disabled={
                  isRefreshing
                }
                className="mt-3 min-h-[40px] px-3 py-2 rounded-lg border border-resqnow-critical/20 bg-white text-resqnow-crimson text-[12px] font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                {isRefreshing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}

                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SUMMARY ============ */}
      <div className="grid grid-cols-3 gap-2 mb-5">

        {/* OPEN */}
        <SummaryCard
          icon={Activity}
          value={
            openCount
          }
          label="Open"
          color="violet"
        />

        {/* PENDING */}
        <SummaryCard
          icon={Clock}
          value={
            pendingCount
          }
          label="Pending"
          color="pending"
        />

        {/* RESOLVED */}
        <SummaryCard
          icon={
            CheckCircle2
          }
          value={
            closedCount
          }
          label="Closed"
          color="safe"
        />
      </div>

      {/* ============ SEARCH ============ */}
      <div className="relative mb-3">

        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resqnow-placeholder" />

        <input
          type="search"
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target
                .value
            )
          }
          placeholder="Search ID, concern, location, status..."
          aria-label="Search reports"
          className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl pl-10 pr-4 py-3 min-h-[46px] text-[13px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
        />
      </div>

      {/* ============ TYPE FILTERS ============ */}
      <div className="grid grid-cols-[0.65fr_1fr_1.35fr] gap-2 mb-3">

  {filters.map((item) => {
    const count =
      item.id === 'all'
        ? reports.length
        : item.id === 'Emergency'
        ? emergencyCount
        : nonEmergencyCount;

    const selected =
      filter === item.id;

    return (
      <button
        key={item.id}
        type="button"
        aria-pressed={selected}
        onClick={() =>
          setFilter(item.id)
        }
        className={`min-w-0 min-h-[44px] px-2 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap border active:scale-95 transition-all ${
          selected
            ? 'bg-resqnow-violet text-white border-resqnow-violet shadow-[0_4px_12px_rgba(131,70,242,0.18)]'
            : 'bg-white text-resqnow-muted border-resqnow-border-soft hover:border-resqnow-violet/30 hover:text-resqnow-violet'
        }`}
      >
        {item.label}

        <span
          className={`ml-1 ${
            selected
              ? 'text-white/80'
              : 'text-resqnow-muted'
          }`}
        >
          {count}
        </span>
      </button>
    );
  })}
</div>

      {/* ============ RESULT COUNT ============ */}
      <div className="flex items-center gap-2 px-1 mb-2">

        <SlidersHorizontal className="w-3.5 h-3.5 text-resqnow-muted" />

        <p className="text-[11px] text-resqnow-muted">

          {
            filteredReports.length
          }{' '}

          {filteredReports.length ===
          1
            ? 'report'
            : 'reports'}{' '}

          found
        </p>
      </div>

      {/* ============ REPORT LIST ============ */}
      {filteredReports.length >
      0 ? (
        <div className="space-y-3">

          {filteredReports.map(
            (report) => {
              const isEmergency =
                report.reportType ===
                'Emergency';

              return (
                <button
                  key={
                    report.id
                  }
                  type="button"
                  onClick={() =>
                    navigate(
                      `/track/${encodeURIComponent(
                        report.id
                      )}`
                    )
                  }
                  className="w-full bg-white border border-resqnow-border-soft rounded-2xl p-4 text-left hover:border-resqnow-border hover:shadow-[0_4px_14px_rgba(31,29,71,0.06)] active:scale-[0.99] transition-all"
                >

                  {/* HEADING */}
                  <div className="flex items-start gap-3">

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isEmergency
                          ? 'bg-resqnow-critical/10 text-resqnow-critical'
                          : 'bg-resqnow-violet/10 text-resqnow-violet'
                      }`}
                    >
                      {isEmergency ? (
                        <Siren className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">

                      {/* ID + TYPE */}
                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="text-[11px] font-bold text-resqnow-muted">
                          {
                            report.id
                          }
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isEmergency
                              ? 'bg-resqnow-critical/15 text-resqnow-critical'
                              : 'bg-resqnow-violet/15 text-resqnow-violet'
                          }`}
                        >
                          {
                            report.reportType
                          }
                        </span>
                      </div>

                      {/* CONCERN */}
                      <p className="text-[14px] font-semibold text-resqnow-primary mt-1">
                        {
                          report.concernType
                        }
                      </p>

                      {report.subcategory && (
                        <p className="text-[11px] text-resqnow-muted mt-0.5">
                          {
                            report.subcategory
                          }
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-resqnow-placeholder shrink-0 mt-3" />
                  </div>

                  {/* LOCATION */}
                  {report.location && (
                    <div className="flex items-start gap-2 mt-3 text-[12px] text-resqnow-muted">

                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />

                      <span className="line-clamp-2">
                        {
                          report.location
                        }
                      </span>
                    </div>
                  )}

                  {/* LATEST UPDATE */}
                  {report.latestUpdate && (
                    <div className="mt-3 bg-resqnow-canvas rounded-xl px-3 py-2.5">

                      <p className="text-[10px] font-bold text-resqnow-muted uppercase tracking-wide">
                        Latest Update
                      </p>

                      <p className="text-[12px] text-resqnow-secondary mt-1 leading-relaxed line-clamp-2">
                        {
                          report.latestUpdate
                        }
                      </p>
                    </div>
                  )}

                  {/* STATUS + PRIORITY */}
                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-resqnow-border-soft">

                    <div className="flex items-center gap-2 flex-wrap">

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {
                          report.status
                        }
                      </span>

                      {report.priority && (
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getPriorityStyle(
                            report.priority
                          )}`}
                        >
                          {
                            report.priority
                          }
                        </span>
                      )}
                    </div>

                    {/* SUBMITTED TIME */}
                    {report.submittedAt && (
                      <div className="flex items-center gap-1 text-[10px] text-resqnow-muted shrink-0">

                        <Clock className="w-3 h-3" />

                        <span>
                          {
                            report.submittedAt
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>
      ) : (
        /* ============ EMPTY STATE ============ */
        !loadError && (
          <div className="bg-white border border-resqnow-border-soft rounded-2xl py-12 px-6 text-center">

            <div className="w-12 h-12 rounded-full bg-resqnow-canvas flex items-center justify-center mx-auto mb-3">

              <Search className="w-6 h-6 text-resqnow-placeholder" />
            </div>

            <p className="text-[14px] font-semibold text-resqnow-primary">

              {reports.length ===
              0
                ? 'No reports yet'
                : 'No reports found'}
            </p>

            <p className="text-[12px] text-resqnow-muted mt-1 leading-relaxed">

              {reports.length ===
              0
                ? 'Your submitted Emergency and Non-Emergency reports will appear here.'
                : 'Try changing your search or report filter.'}
            </p>
          </div>
        )
      )}
    </div>
  );
}

// ============ SUMMARY CARD ============

function SummaryCard({
  icon: Icon,
  value,
  label,
  color,
}) {
  const colors = {
    violet: {
      icon:
        'text-resqnow-violet',

      background:
        'bg-resqnow-violet/10',

      border:
        'border-resqnow-violet/20',
    },

    pending: {
      icon:
        'text-resqnow-pending',

      background:
        'bg-resqnow-pending/10',

      border:
        'border-resqnow-pending/20',
    },

    safe: {
      icon:
        'text-resqnow-safe',

      background:
        'bg-resqnow-safe/10',

      border:
        'border-resqnow-safe/20',
    },
  };

  const selected =
    colors[color] ||
    colors.violet;

  return (
    <div
      className={`bg-white border ${selected.border} rounded-2xl px-2 py-3 text-center`}
    >
      <div
        className={`w-8 h-8 rounded-xl ${selected.background} flex items-center justify-center mx-auto`}
      >
        <Icon
          className={`w-4 h-4 ${selected.icon}`}
        />
      </div>

      <p className="text-lg font-bold text-resqnow-primary mt-1">
        {value}
      </p>

      <p className="text-[11px] text-resqnow-muted mt-0.5">
        {label}
      </p>
    </div>
  );
}