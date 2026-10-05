// src/components/resident/ReportDetail.jsx

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ChevronLeft,
  Siren,
  FileText,
  MapPin,
  Phone,
  Clock,
  UserRound,
  MessageSquareText,
  Check,
  Circle,
  AlertTriangle,
  CheckCircle2,
  Users,
  HandHeart,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import {
  getReport,
} from '../../services/reportService';

import {
  getStatusStyle,
  getPriorityStyle,
} from '../../utils/statusUtils';
import { getBarangayHotline } from '../../utils/contactUtils';
import CancelReportModal, { canResidentCancel } from './CancelReportModal';

const ACTIVE_REPORT_POLL_MS = 15000;
const HOTLINE = getBarangayHotline();

function formatIsoDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString(
    'en-PH',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  );
}

function getResidentTimelineLabel(status) {
  switch (status) {
    case 'Submitted':
      return 'Report received';
    case 'Pending Verification':
      return 'Barangay reviewing report';
    case 'Verified':
      return 'Report verified';
    case 'Assigned':
      return 'Responder assigned';
    case 'Acknowledged':
      return 'Responder acknowledged your report';
    case 'In Progress':
      return 'Response started';
    case 'Responders En Route':
      return 'Responders are on the way';
    case 'Responded':
      return 'Responders arrived / response recorded';
    case 'Resolved':
      return 'Report resolved';
    case 'Invalid':
      return 'Report closed as invalid';
    case 'Cancelled':
      return 'Report cancelled';
    default:
      return status;
  }
}

// ============ TIMELINE STYLE ============

function getTimelineStyle(status) {
  switch (status) {
    case 'Submitted':
      return {
        circle: 'bg-resqnow-violet text-white',
        line: 'bg-resqnow-violet/30',
      };

    case 'Pending Verification':
      return {
        circle: 'bg-slate-500 text-white',
        line: 'bg-slate-300',
      };

    case 'Verified':
      return {
        circle: 'bg-resqnow-safe text-white',
        line: 'bg-resqnow-safe/30',
      };

    case 'Assigned':
    case 'Acknowledged':
      return {
        circle: 'bg-resqnow-insight text-white',
        line: 'bg-resqnow-insight/30',
      };

    case 'In Progress':
    case 'Responders En Route':
      return {
        circle: 'bg-resqnow-pending text-white',
        line: 'bg-resqnow-pending/30',
      };

    case 'Responded':
      return {
        circle: 'bg-resqnow-indigo text-white',
        line: 'bg-resqnow-indigo/30',
      };

    case 'Resolved':
      return {
        circle: 'bg-resqnow-safe text-white',
        line: 'bg-resqnow-safe/30',
      };

    case 'Invalid':
      return {
        circle: 'bg-resqnow-crimson text-white',
        line: 'bg-resqnow-crimson/30',
      };

    case 'Cancelled':
      return {
        circle: 'bg-slate-500 text-white',
        line: 'bg-slate-300',
      };

    default:
      return {
        circle: 'bg-slate-500 text-white',
        line: 'bg-slate-300',
      };
  }
}

// ============ REPORT DETAIL ============

export default function ReportDetail() {
  const navigate =
    useNavigate();

  const {
    reportId,
  } = useParams();

  // ============ REPORT STATE ============

  const [
    report,
    setReport,
  ] = useState(null);

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

  const requestInFlightRef =
    useRef(false);

  const [cancelOpen, setCancelOpen] = useState(false);

  // ============ LOAD REPORT ============

  const loadReport =
    useCallback(
      async ({
        refresh = false,
        silent = false,
      } = {}) => {
        if (
          requestInFlightRef.current
        ) {
          return;
        }

        requestInFlightRef.current =
          true;

        if (
          refresh &&
          !silent
        ) {
          setIsRefreshing(true);
        } else if (!refresh) {
          setIsLoading(true);
        }

        setLoadError('');

        try {
          const result =
            await getReport(
              reportId
            );

          setReport(result);

          setLastChecked(
            new Date()
          );
        } catch (error) {
          /**
           * 404 means the report really
           * could not be found for this resident.
           *
           * In that case we should stop showing
           * an old/stale report.
           */
          if (
            error?.status === 404
          ) {
            setReport(null);

            setLoadError(
              'The report you are looking for does not exist or is no longer available.'
            );
          } else {
            /**
             * For temporary network/server
             * failures, keep the last successful
             * report on screen.
             */
            setLoadError(
              error?.message ||
                'Unable to load this report.'
            );
          }
        } finally {
          setIsLoading(false);

          if (!silent) {
            setIsRefreshing(false);
          }

          requestInFlightRef.current =
            false;
        }
      },
      [reportId]
    );

  // ============ INITIAL LOAD ============

  useEffect(() => {
    /**
     * Clear the previous report when
     * navigating to a different report ID.
     */
    setReport(null);
    setLastChecked(null);
    setLoadError('');

    loadReport();
  }, [
    reportId,
    loadReport,
  ]);

  // ============ ACTIVE REPORT AUTO-REFRESH ============

  useEffect(() => {
    if (
      !report ||
      report.status === 'Resolved' ||
      report.status === 'Invalid' ||
      report.status === 'Cancelled'
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(
        () => {
          if (
            document.visibilityState !==
            'visible'
          ) {
            return;
          }

          loadReport({
            refresh: true,
            silent: true,
          });
        },
        ACTIVE_REPORT_POLL_MS
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    report?.status,
    reportId,
    loadReport,
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
    !report
  ) {
    return (
      <div className="px-4 pt-5 pb-28 min-h-screen">

        <button
          type="button"
          onClick={() =>
            navigate('/track')
          }
          className="flex items-center gap-1.5 text-[12px] font-medium text-resqnow-muted hover:text-resqnow-violet mb-6"
        >
          <ChevronLeft className="w-4 h-4" />

          Back to Track
        </button>

        <div className="bg-white border border-resqnow-border-soft rounded-2xl py-14 px-6 text-center">

          <Loader2 className="w-7 h-7 text-resqnow-violet animate-spin mx-auto" />

          <p className="text-[12px] text-resqnow-muted mt-3">
            Loading report...
          </p>
        </div>
      </div>
    );
  }

  // ============ REPORT UNAVAILABLE ============

  if (!report) {
    return (
      <div className="px-4 pt-5 pb-28 min-h-screen">

        <button
          type="button"
          onClick={() =>
            navigate('/track')
          }
          className="flex items-center gap-1.5 text-[12px] font-medium text-resqnow-muted hover:text-resqnow-violet active:scale-95 transition-all mb-6"
        >
          <ChevronLeft className="w-4 h-4" />

          Back to Track
        </button>

        <div className="bg-white border border-resqnow-border-soft rounded-2xl py-12 px-6 text-center">

          <div className="w-12 h-12 rounded-full bg-resqnow-canvas flex items-center justify-center mx-auto mb-3">

            <FileText className="w-6 h-6 text-resqnow-placeholder" />
          </div>

          <p className="text-[15px] font-semibold text-resqnow-primary">
            Report unavailable
          </p>

          <p className="text-[12px] text-resqnow-muted mt-1 leading-relaxed">
            {loadError ||
              'The report could not be loaded.'}
          </p>

          <button
            type="button"
            onClick={() =>
              loadReport()
            }
            disabled={
              isLoading
            }
            className="mt-4 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/5 text-resqnow-violet text-[12px] font-bold disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}

            Try Again
          </button>

          <button
            type="button"
            onClick={() =>
              navigate('/track')
            }
            className="mt-2 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-brand-gradient text-white text-[13px] font-semibold"
          >
            View My Reports
          </button>
        </div>
      </div>
    );
  }

  // ============ REPORT STATE ============

  const isEmergency =
    report.reportType ===
    'Emergency';

  const isResolved =
    report.status ===
    'Resolved';

  const isInvalid =
    report.status ===
    'Invalid';


  const isCancelled =
    report.status ===
    'Cancelled';

  const canCancel =
    canResidentCancel(report);

  const timeline =
    Array.isArray(
      report.timeline
    )
      ? report.timeline
      : [];

  const assignments =
    Array.isArray(
      report.assignedPersonnelList
    )
      ? report.assignedPersonnelList
      : [];

  const acknowledgedAssignment =
    assignments.find(
      (assignment) =>
        assignment?.acknowledged
    );

  const displayTimeline =
    timeline.flatMap((step) => {
      const currentStep = {
        ...step,
        displayLabel:
          getResidentTimelineLabel(
            step.status
          ),
      };

      if (
        step.status ===
          'Assigned' &&
        acknowledgedAssignment
      ) {
        return [
          currentStep,
          {
            status:
              'Acknowledged',
            displayLabel:
              getResidentTimelineLabel(
                'Acknowledged'
              ),
            date:
              formatIsoDateTime(
                acknowledgedAssignment.acknowledgedAt
              ),
            done: true,
          },
        ];
      }

      return [currentStep];
    });

  return (
    <div className="px-4 pt-5 pb-28 min-h-screen">

      {/* ============ TOP BAR ============ */}
      <div className="flex items-start justify-between gap-3 mb-4">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate('/track')
            }
            className="flex items-center gap-1.5 text-[12px] font-medium text-resqnow-muted hover:text-resqnow-violet active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />

            Back to Track
          </button>

          <p className="text-[11px] text-resqnow-muted mt-1.5 ml-1">

            {isRefreshing
              ? 'Refreshing report...'
              : lastCheckedText
              ? `Last checked ${lastCheckedText}`
              : 'Checking report...'}
          </p>

          {!isResolved &&
            !isInvalid &&
            !isCancelled && (
              <p className="text-[10px] text-resqnow-muted mt-0.5 ml-1">
                Auto-checking every 15 seconds while this report is active
              </p>
            )}
        </div>

        {/* Normal refresh control */}
        <button
          type="button"
          onClick={() =>
            loadReport({
              refresh: true,
            })
          }
          disabled={
            isRefreshing
          }
          aria-label="Refresh report"
          className="w-10 h-10 rounded-xl border border-resqnow-violet/15 bg-resqnow-violet/5 text-resqnow-violet flex items-center justify-center shrink-0 hover:bg-resqnow-violet/10 disabled:opacity-50 active:scale-95 transition-all"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ============ REFRESH ERROR ============ */}
      {loadError && (
        <div
          role="alert"
          className="mb-4 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl p-3"
        >
          <div className="flex items-start gap-2.5">

            <AlertCircle className="w-4 h-4 text-resqnow-critical mt-0.5 shrink-0" />

            <div className="flex-1">

              <p className="text-[12px] font-semibold text-resqnow-crimson">
                Could not refresh this report
              </p>

              <p className="text-[12px] text-resqnow-secondary mt-1 leading-relaxed">
                {loadError}
              </p>

              <p className="text-[11px] text-resqnow-muted mt-1">
                Showing the last successfully loaded information.
              </p>

              <button
                type="button"
                onClick={() =>
                  loadReport({
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

      {/* ============ REPORT HEADER ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-4">

        <div
          className={`h-1 ${
            isEmergency
              ? 'bg-emergency-gradient'
              : 'bg-brand-gradient'
          }`}
        />

        <div className="p-4">

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

              <div className="flex items-center gap-2 flex-wrap">

                <span className="text-[11px] font-bold text-resqnow-muted">
                  {report.id}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEmergency
                      ? 'bg-resqnow-critical/15 text-resqnow-critical'
                      : 'bg-resqnow-violet/15 text-resqnow-violet'
                  }`}
                >
                  {report.reportType}
                </span>

                {report.priority && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(
                      report.priority
                    )}`}
                  >
                    {report.priority}{' '}
                    Priority
                  </span>
                )}
              </div>

              <h1 className="text-lg font-bold text-resqnow-primary mt-1">
                {
                  report.concernType
                }
              </h1>

              {report.subcategory && (
                <p className="text-[12px] text-resqnow-muted mt-0.5">
                  {
                    report.subcategory
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CURRENT STATUS ============ */}
      <section
        aria-live="polite"
        className={`border rounded-2xl p-4 mb-4 ${
          isResolved
            ? 'bg-resqnow-safe/10 border-resqnow-safe/20'
            : isInvalid
            ? 'bg-resqnow-crimson/10 border-resqnow-crimson/20'
            : isCancelled
            ? 'bg-slate-100 border-slate-200'
            : 'bg-white border-resqnow-border-soft'
        }`}
      >

        <p
          className={`text-[11px] font-bold uppercase tracking-wider ${
            isResolved
              ? 'text-resqnow-safe'
              : isInvalid
              ? 'text-resqnow-crimson'
              : isCancelled
              ? 'text-slate-600'
              : 'text-resqnow-muted'
          }`}
        >
          Current Status
        </p>

        <div className="flex items-center justify-between gap-3 mt-2">

          <span
            className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${getStatusStyle(
              report.status
            )}`}
          >
            {report.status}
          </span>

          {report.updatedAt && (
            <div
              className={`flex items-center gap-1 text-[10px] ${
                isResolved
                  ? 'text-resqnow-safe'
                  : isInvalid
                  ? 'text-resqnow-crimson'
                  : isCancelled
                  ? 'text-slate-600'
                  : 'text-resqnow-muted'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />

              Updated{' '}
              {report.updatedAt}
            </div>
          )}
        </div>

        {report.latestUpdate && (
          <div
            className={`mt-4 rounded-xl p-3 ${
              isResolved ||
              isInvalid ||
              isCancelled
                ? 'bg-white/70'
                : 'bg-resqnow-canvas'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-muted">
              Latest Update
            </p>

            <p className="text-[12px] text-resqnow-secondary mt-1 leading-relaxed">
              {
                report.latestUpdate
              }
            </p>
          </div>
        )}

        {isResolved &&
          report.resolvedRemarks && (
            <div className="mt-3 pt-3 border-t border-resqnow-safe/20">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 text-resqnow-safe" />

                <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-safe">
                  Resolution Remarks
                </p>
              </div>

              <p className="text-[12px] text-resqnow-secondary mt-1.5 leading-relaxed">
                {
                  report.resolvedRemarks
                }
              </p>
            </div>
          )}

        {!isResolved && !isInvalid && !isCancelled && HOTLINE && (
          <a
            href={HOTLINE.href}
            className="mt-4 min-h-[44px] w-full rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/5 text-resqnow-violet text-[11px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          >
            <Phone className="w-4 h-4" />
            Call Barangay Hotline
          </a>
        )}


        {canCancel && (
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="mt-2.5 min-h-[44px] w-full rounded-xl border border-resqnow-critical/25 bg-resqnow-critical/5 text-resqnow-critical text-[11px] font-bold flex items-center justify-center active:scale-[0.99] transition-transform"
          >
            {report.concernCode === 'sos'
              ? "I'm Safe / Cancel Rescue"
              : 'Cancel Report'}
          </button>
        )}
      </section>

      {/* ============ REPORT PROGRESS ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <h2 className="text-[15px] font-bold text-resqnow-primary mb-4">
          Report Progress
        </h2>

        {displayTimeline.length > 0 ? (
          <div>

            {displayTimeline.map(
              (
                step,
                index
              ) => {
                const isLast =
                  index ===
                  displayTimeline.length -
                    1;

                const timelineStyle =
                  getTimelineStyle(
                    step.status
                  );

                return (
                  <div
                    key={`${step.status}-${index}`}
                    className="flex gap-3"
                  >

                    <div className="flex flex-col items-center">

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          step.done
                            ? timelineStyle.circle
                            : 'bg-resqnow-canvas text-resqnow-placeholder border border-resqnow-border-soft'
                        }`}
                      >
                        {step.done ? (
                          <Check
                            className="w-4 h-4"
                            strokeWidth={
                              3
                            }
                          />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                      </div>

                      {!isLast && (
                        <div
                          className={`w-0.5 min-h-[46px] flex-1 ${
                            step.done
                              ? timelineStyle.line
                              : 'bg-resqnow-border-soft'
                          }`}
                        />
                      )}
                    </div>

                    <div
                      className={`flex-1 ${
                        isLast
                          ? ''
                          : 'pb-5'
                      }`}
                    >

                      <p
                        className={`text-[12px] font-semibold ${
                          step.done
                            ? 'text-resqnow-primary'
                            : 'text-resqnow-muted'
                        }`}
                      >
                        {
                          step.displayLabel ||
                          step.status
                        }
                      </p>

                      <p className="text-[11px] text-resqnow-muted mt-0.5">
                        {step.date ||
                          'Waiting for update'}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p className="text-[12px] text-resqnow-muted">
            No status updates are available yet.
          </p>
        )}
      </section>

      {/* ============ ASSIGNED PERSONNEL ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <div className="flex items-center gap-2 mb-3">

          <UserRound className="w-4 h-4 text-resqnow-insight" />

          <h2 className="text-[15px] font-bold text-resqnow-primary">
            Assigned Personnel
          </h2>
        </div>

        {report.assignedPersonnel ? (
          <div className="flex items-center gap-3 bg-resqnow-insight/5 border border-resqnow-insight/10 rounded-xl p-3">

            <div className="w-9 h-9 rounded-full bg-resqnow-insight/15 text-resqnow-insight flex items-center justify-center">

              <UserRound className="w-4 h-4" />
            </div>

            <div>

              <p className="text-[12px] font-semibold text-resqnow-primary">
                {
                  report.assignedPersonnel
                }
              </p>

              <p className="text-[11px] text-resqnow-muted mt-0.5">
                Assigned to this report
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-resqnow-canvas rounded-xl p-3">

            <p className="text-[12px] text-resqnow-muted">
              No personnel has been assigned yet.
            </p>
          </div>
        )}
      </section>

      {/* ============ LOCATION ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <div className="flex items-center gap-2 mb-3">

          <MapPin className="w-4 h-4 text-resqnow-violet" />

          <h2 className="text-[15px] font-bold text-resqnow-primary">
            Incident Location
          </h2>
        </div>

        <div className="bg-resqnow-canvas rounded-xl p-3">

          <p className="text-[12px] font-semibold text-resqnow-primary leading-relaxed">
            {report.location ||
              'No location provided.'}
          </p>

          {report.landmark && (
            <p className="text-[11px] text-resqnow-muted mt-1">
              Landmark:{' '}
              {report.landmark}
            </p>
          )}

          {report.purok && (
            <p className="text-[11px] text-resqnow-muted mt-1">
              Purok:{' '}
              {report.purok}
            </p>
          )}

          {report.locationSource ===
            'gps' &&
            report.locationAccuracy !==
              null &&
            report.locationAccuracy !==
              undefined && (
              <div className="mt-2 pt-2 border-t border-resqnow-border-soft">
                <p className="text-[11px] text-resqnow-muted">
                  GPS accuracy: approximately ±{Math.round(
                    Number(
                      report.locationAccuracy
                    )
                  )} m
                </p>

                {Number(
                  report.locationAccuracy
                ) > 100 && (
                  <p className="text-[11px] text-resqnow-caution mt-1 leading-relaxed">
                    GPS accuracy is limited. A nearby landmark can help responders locate the incident faster.
                  </p>
                )}
              </div>
            )}
        </div>
      </section>

      {/* ============ REPORT INFORMATION ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <div className="flex items-center gap-2 mb-3">

          <FileText className="w-4 h-4 text-resqnow-violet" />

          <h2 className="text-[15px] font-bold text-resqnow-primary">
            Report Information
          </h2>
        </div>

        <InfoRow
          label="Submitted"
          value={
            report.submittedAt
          }
        />

        <InfoRow
          label="Report Type"
          value={
            report.reportType
          }
        />

        <InfoRow
          label="Concern"
          value={
            report.concernType
          }
        />

        {report.subcategory && (
          <InfoRow
            label="Subcategory"
            value={
              report.subcategory
            }
          />
        )}

        {report.reportingFor && (
          <InfoRow
            label="Reporting For"
            value={
              report.reportingFor
            }
          />
        )}

        {/* DESCRIPTION */}
        <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

          <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide">
            Description
          </p>

          <p className="text-[12px] text-resqnow-secondary mt-1.5 leading-relaxed break-words">
            {report.description ||
              'No description provided.'}
          </p>
        </div>

        {/* ASSISTANCE */}
        {report.requiredAssistance && (
          <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

            <div className="flex items-center gap-2">

              <HandHeart className="w-4 h-4 text-resqnow-violet" />

              <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide">
                Assistance Needed
              </p>
            </div>

            <p className="text-[12px] text-resqnow-secondary mt-1.5 leading-relaxed break-words">
              {
                report.requiredAssistance
              }
            </p>
          </div>
        )}

        {/* AFFECTED INDIVIDUALS */}
        {report.affectedIndividuals
          ?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

            <div className="flex items-center gap-2 mb-2">

              <Users className="w-4 h-4 text-resqnow-violet" />

              <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide">
                Affected Individuals
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              {report.affectedIndividuals.map(
                (person) => (
                  <span
                    key={person}
                    className="text-[11px] font-medium px-2.5 py-1 bg-resqnow-violet/10 text-resqnow-violet rounded-full"
                  >
                    {person}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* PERSON / VICTIM */}
        {(report.subjectName ||
          report.subjectContact) && (
          <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

            <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide mb-2">
              Person Information
            </p>

            {report.subjectName && (
              <InfoRow
                label="Name"
                value={
                  report.subjectName
                }
              />
            )}

            {report.subjectContact && (
              <InfoRow
                label="Contact"
                value={
                  report.subjectContact
                }
              />
            )}

            {report.relationshipNote && (
              <InfoRow
                label="Relationship / Note"
                value={
                  report.relationshipNote
                }
              />
            )}
          </div>
        )}

        {/* PHOTO */}
        {report.photoUrl && (
          <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

            <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide mb-2">
              Photo Evidence
            </p>

            <img
              src={
                report.photoUrl
              }
              alt="Report evidence"
              className="w-full max-h-64 object-cover rounded-xl border border-resqnow-border-soft"
            />
          </div>
        )}
      </section>

      {/* ============ BARANGAY REMARKS ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <div className="flex items-center gap-2 mb-3">

          <MessageSquareText className="w-4 h-4 text-resqnow-info" />

          <h2 className="text-[15px] font-bold text-resqnow-primary">
            Barangay Remarks
          </h2>
        </div>

        {report.barangayRemarks ? (
          <div className="bg-resqnow-info/5 border border-resqnow-info/10 rounded-xl p-3">

            <p className="text-[12px] text-resqnow-secondary leading-relaxed">
              {
                report.barangayRemarks
              }
            </p>
          </div>
        ) : (
          <div className="bg-resqnow-canvas rounded-xl p-3">

            <p className="text-[12px] text-resqnow-muted">
              No barangay remarks available yet.
            </p>
          </div>
        )}
      </section>

      {/* ============ INVALID REPORT ============ */}
      {report.invalidReason && (
        <section className="bg-resqnow-crimson/10 border border-resqnow-crimson/20 rounded-2xl p-4">

          <div className="flex items-center gap-2 mb-2">

            <AlertTriangle className="w-5 h-5 text-resqnow-crimson" />

            <h2 className="text-[15px] font-bold text-resqnow-crimson">
              Report Marked Invalid
            </h2>
          </div>

          <p className="text-[11px] font-bold text-resqnow-crimson uppercase tracking-wide">
            Reason
          </p>

          <p className="text-[12px] text-resqnow-secondary mt-1 leading-relaxed">
            {
              report.invalidReason
            }
          </p>
        </section>
      )}

      <CancelReportModal
        open={cancelOpen}
        report={report}
        onClose={() => setCancelOpen(false)}
        onCancelled={(updatedReport) => {
          setReport(updatedReport);
          setLastChecked(new Date());
          setCancelOpen(false);
        }}
      />
    </div>
  );
}

// ============ INFO ROW ============

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-resqnow-border-soft last:border-0">

      <span className="text-[12px] text-resqnow-muted shrink-0">
        {label}
      </span>

      <span className="text-[12px] font-medium text-resqnow-primary text-right break-words">
        {value ||
          'Not provided'}
      </span>
    </div>
  );
}