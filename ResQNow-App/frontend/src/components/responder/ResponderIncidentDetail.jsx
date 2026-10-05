import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import {
  acknowledgeAssignment,
  getAssignedReport,
  performResponderAction,
} from '../../services/responderService';
import { getPriorityStyle, getStatusStyle } from '../../utils/statusUtils';
import ResponderAssignedMap from './ResponderAssignedMap';
import {
  contactTarget,
  directionsInfo,
  formatClock,
  formatDateTime,
  getCurrentAssignment,
  getPrimaryAction,
} from './responderViewUtils';

const secondaryActionValues = [
  'note',
  'support',
  'unable-locate',
  'invalid-finding',
];

const tacticalActionLabels = {
  acknowledge: 'Acknowledge Mission',
  start: 'Start Response',
  'en-route': 'Mark En Route',
  arrived: 'On Scene',
  resolve: 'Victim Secured / Resolve',
};

function tacticalActionLabel(action) {
  return tacticalActionLabels[action?.value] || action?.label || 'Update Mission';
}

export default function ResponderIncidentDetail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId } = useParams();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [actionSheet, setActionSheet] = useState(null);
  const [actionSaving, setActionSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadReport = useCallback(async () => {
    setError('');
    setErrorStatus(null);
    if (!report) setIsLoading(true);

    try {
      const data = await getAssignedReport(reportId);
      setReport(data);
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError?.message || 'Unable to open this incident.');
      setErrorStatus(requestError?.status || null);
      if ([403, 404].includes(requestError?.status)) {
        setReport(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [reportId, report]);

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const currentAssignment = useMemo(
    () => getCurrentAssignment(report, user?.id),
    [report, user?.id]
  );

  const call = contactTarget(report);
  const directions = directionsInfo(report);
  const nextAction = getPrimaryAction(report);

  const secondaryActions = useMemo(
    () =>
      (report?.responderActions || []).filter((action) =>
        secondaryActionValues.includes(action.value)
      ),
    [report]
  );

  const checklist = useMemo(() => {
    const latest = [...(report?.events || [])]
      .reverse()
      .find((event) => Array.isArray(event.checklist) && event.checklist.length);

    return latest?.checklist || [];
  }, [report]);

  function goBack() {
    if (location.state?.returnTo) {
      navigate(-1);
      return;
    }
    navigate('/responder/missions');
  }

  async function saveResponderAction(action, remarks = '') {
    if (!report || actionSaving) return;

    setActionSaving(true);
    setActionError('');
    setActionSuccess('');

    try {
      const updated =
        action.value === 'acknowledge'
          ? await acknowledgeAssignment(report.id, report.version)
          : await performResponderAction(report.id, {
              action: action.value,
              remarks: remarks.trim() || null,
              expectedVersion: report.version,
            });

      setReport(updated);
      setLastUpdated(new Date());
      setActionSheet(null);
      setActionSuccess(`${action.label} saved successfully.`);
    } catch (requestError) {
      const message =
        requestError?.status === 409
          ? 'This incident changed while you were viewing it. Refresh the report before trying again.'
          : requestError?.message || 'Unable to save this responder action.';

      setActionError(message);

      if ([403, 404].includes(requestError?.status)) {
        setActionSheet(null);
        setReport(null);
        setErrorStatus(requestError.status);
        setError(message);
      }
    } finally {
      setActionSaving(false);
    }
  }

  if (isLoading && !report) {
    return (
      <div className="px-4 pt-4 pb-28 min-h-screen">
        <div className="h-[620px] animate-pulse rounded-2xl border border-resqnow-border-soft bg-white" />
      </div>
    );
  }

  if (!report) {
    const accessRemoved = [403, 404].includes(errorStatus);

    return (
      <div className="px-4 pt-4 pb-28 min-h-screen">
        <div className="rounded-2xl border border-resqnow-critical/20 bg-white p-7 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-resqnow-critical" />
          <p className="mt-3 text-[14px] font-bold text-resqnow-primary">
            {accessRemoved
              ? 'This incident is no longer available to your account'
              : 'Unable to open report'}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-resqnow-muted">
            {accessRemoved
              ? 'It may have been reassigned, closed, or your access may have changed.'
              : error || 'Report unavailable.'}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {!accessRemoved && (
              <button
                type="button"
                onClick={loadReport}
                className="min-h-[44px] rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/5 px-4 text-[11px] font-bold text-resqnow-violet"
              >
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={goBack}
              className="min-h-[44px] rounded-xl bg-brand-gradient px-4 text-[11px] font-bold text-white"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-28 min-h-screen space-y-4">
      <section>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-[40px] items-center gap-2 text-[11px] font-bold text-resqnow-muted hover:text-resqnow-violet"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="hidden sm:inline text-[9px] text-resqnow-placeholder">
                Updated {formatClock(lastUpdated)}
              </span>
            )}
            <button
              type="button"
              onClick={loadReport}
              disabled={isLoading}
              aria-label="Refresh report"
              className="w-10 h-10 rounded-xl border border-resqnow-border-soft bg-white text-resqnow-violet flex items-center justify-center shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-resqnow-violet">
            Report {report.id}
          </p>
          <h1 className="mt-1 text-[21px] font-extrabold text-resqnow-primary">
            {report.concernType}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getPriorityStyle(report.priority)}`}>
              {report.priority} priority
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(report.status)}`}>
              {report.status}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[12px] text-resqnow-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {report.location || 'Location unavailable'}
              {report.landmark ? ` · ${report.landmark}` : ''}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Reporter location</p>
            <h2 className="mt-0.5 text-[14px] font-bold text-resqnow-primary">Incident map</h2>
            <p className="mt-0.5 text-[9px] text-resqnow-muted">Submitted report coordinates · not live resident tracking</p>
          </div>
          <MapPin className="h-5 w-5 shrink-0 text-resqnow-critical" />
        </div>
        <ResponderAssignedMap
          reports={[report]}
          heightClass="h-[240px]"
          showLegend={false}
          ariaLabel={`Reporter location for ${report.id}`}
        />
      </section>

      {actionSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-resqnow-safe/25 bg-resqnow-safe/10 p-3 text-[11px] text-resqnow-safe"
        >
          <p className="font-bold">{actionSuccess}</p>
          <p className="mt-1 text-resqnow-muted">The saved incident state has been refreshed from the server.</p>
        </div>
      )}

      {error && report && (
        <div role="status" className="rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/8 p-3 text-[11px] text-resqnow-crimson">
          <p className="font-bold">Update not refreshed</p>
          <p className="mt-1">{error}</p>
          <p className="mt-1 text-resqnow-muted">
            Showing the previously loaded incident details
            {lastUpdated ? ` from ${formatClock(lastUpdated)}` : ''}.
          </p>
        </div>
      )}

      <section className="grid grid-cols-2 gap-2">
        {call.href ? (
          <a
            href={call.href}
            className="min-h-[54px] rounded-xl border border-resqnow-safe/20 bg-resqnow-safe/10 px-3 text-resqnow-safe flex flex-col items-center justify-center text-center active:scale-[.98] transition-transform"
          >
            <span className="inline-flex items-center gap-2 text-[12px] font-bold">
              <Phone className="h-4 w-4" />
              {call.label}
            </span>
            <span className="mt-0.5 max-w-full truncate text-[9px] font-medium text-resqnow-muted">
              {call.name}
            </span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="min-h-[54px] rounded-xl border border-resqnow-border-soft bg-resqnow-canvas px-3 text-resqnow-placeholder flex flex-col items-center justify-center opacity-75"
          >
            <span className="inline-flex items-center gap-2 text-[12px] font-bold">
              <Phone className="h-4 w-4" />
              No phone
            </span>
          </button>
        )}

        <a
          href={directions.href}
          target="_blank"
          rel="noreferrer"
          className="min-h-[54px] rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/10 px-3 text-resqnow-violet flex flex-col items-center justify-center text-center active:scale-[.98] transition-transform"
        >
          <span className="inline-flex items-center gap-2 text-[12px] font-bold">
            <Navigation className="h-4 w-4" />
            {directions.label}
          </span>
          <span className="mt-0.5 text-[9px] font-medium text-resqnow-muted">
            {directions.detail}
          </span>
        </a>
      </section>

      {nextAction && (
        <section className="rounded-2xl border border-resqnow-violet/15 bg-white p-4 shadow-[0_4px_16px_rgba(31,29,71,.05)]">
          <p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-resqnow-violet">
            What should I do next?
          </p>
          <h2 className="mt-1 text-[14px] font-bold text-resqnow-primary">
            {tacticalActionLabel(nextAction)}
          </h2>
          <button
            type="button"
            onClick={() => setActionSheet(nextAction)}
            className="mt-3 min-h-[50px] w-full rounded-xl bg-brand-gradient px-4 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(131,70,242,.18)] active:scale-[.99]"
          >
            {tacticalActionLabel(nextAction)}
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
        <h2 className="text-[15px] font-bold text-resqnow-primary">Victim / household intelligence</h2>
        <p className="mt-0.5 text-[10px] text-resqnow-muted">Operational flags from the report and resident household profile. No counts are inferred from boolean profile flags.</p>
        <div className="mt-3 grid gap-3">
          <InfoRow
            icon={BadgeCheck}
            label="Affected individuals"
            value={(report.responderIntel?.affectedIndividuals || report.affectedIndividuals || []).length ? (report.responderIntel?.affectedIndividuals || report.affectedIndividuals).join(', ') : 'No affected-individual flags recorded'}
          />
          <InfoRow
            icon={ShieldCheck}
            label="Household vulnerability flags"
            value={(report.responderIntel?.householdFlags || []).length ? report.responderIntel.householdFlags.join(', ') : 'No household vulnerability flags recorded'}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
        <h2 className="text-[15px] font-bold text-resqnow-primary">Original resident report</h2>
        <div className="mt-3 rounded-xl bg-resqnow-canvas p-3.5 text-[13px] leading-relaxed text-resqnow-secondary">
          {report.description || 'No description was provided.'}
        </div>

        <div className="mt-4 space-y-3">
          <InfoRow
            icon={MapPin}
            label="Incident location"
            value={`${report.location || 'Location unavailable'}${report.landmark ? ` · ${report.landmark}` : ''}`}
          />
          <InfoRow
            icon={UserRound}
            label="Reporter"
            value={
              report.reporter
                ? `${report.reporter.fullName || 'Resident'}${report.reporter.contactNumber ? ` · ${report.reporter.contactNumber}` : ''}`
                : 'Reporter details unavailable'
            }
          />
          {report.reportingFor && report.reportingFor !== 'Myself' && (
            <InfoRow
              icon={UserRound}
              label="Person involved"
              value={`${report.subjectName || 'Name unavailable'}${report.subjectContact ? ` · ${report.subjectContact}` : ''}`}
            />
          )}
          <InfoRow
            icon={ShieldCheck}
            label="Assigned personnel"
            value={report.assignedPersonnel || 'Assignment unavailable'}
          />
          <InfoRow
            icon={BadgeCheck}
            label="Latest coordination note"
            value={report.barangayRemarks || report.latestUpdate || 'No additional note yet.'}
          />
        </div>

        {currentAssignment?.assignedAt && (
          <p className="mt-4 text-[10px] text-resqnow-placeholder">
            Assigned {formatDateTime(currentAssignment.assignedAt)}
          </p>
        )}

        {report.photoUrl && (
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-placeholder">
              Resident evidence
            </p>
            <img
              src={report.photoUrl}
              alt={`Evidence for ${report.id}`}
              className="mt-2 max-h-[360px] w-full rounded-xl border border-resqnow-border-soft object-cover"
            />
          </div>
        )}
      </section>

      {(report.attentionRequests || []).length > 0 && (
        <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
          <h2 className="text-[15px] font-bold text-resqnow-primary">Coordination requests</h2>
          <div className="mt-3 space-y-2">
            {report.attentionRequests.map((request) => (
              <div key={request.id} className="rounded-xl bg-resqnow-canvas p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[12px] font-bold text-resqnow-primary">
                    {String(request.kind || 'Request').replaceAll('-', ' ')}
                  </p>
                  <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${request.acknowledged ? 'bg-resqnow-safe/10 text-resqnow-safe' : 'bg-resqnow-caution/15 text-resqnow-pending'}`}>
                    {request.acknowledged ? 'Acknowledged' : 'Pending'}
                  </span>
                </div>
                {request.response && (
                  <p className="mt-2 text-[11px] leading-relaxed text-resqnow-muted">{request.response}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-resqnow-primary">Status history</h2>
            <p className="mt-0.5 text-[10px] text-resqnow-muted">Saved activity for this report.</p>
          </div>
          <Clock3 className="h-5 w-5 text-resqnow-violet" />
        </div>

        <div className="mt-4 space-y-0">
          {(report.events || []).length ? (
            report.events.map((event, index) => (
              <div key={event.id || `${event.activity || event.status}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
                {index < report.events.length - 1 && (
                  <span className="absolute left-[7px] top-4 bottom-0 w-px bg-resqnow-border-soft" />
                )}
                <span className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-[3px] border-white bg-resqnow-violet shadow" />
                <div>
                  <p className="text-[13px] font-bold text-resqnow-primary">
                    {event.status || event.activity || 'Update'}
                  </p>
                  <p className="mt-1 text-[11px] text-resqnow-muted">
                    {event.actor?.fullName || 'System'} · {formatDateTime(event.createdAt)}
                  </p>
                  {(event.remarks || event.activity) && (
                    <p className="mt-1 text-[12px] leading-relaxed text-resqnow-secondary">
                      {event.remarks || event.activity}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[12px] text-resqnow-muted">No saved event history is available yet.</p>
          )}
        </div>
      </section>

      {checklist.length > 0 && (
        <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-resqnow-primary">Saved checklist</h2>
              <p className="mt-0.5 text-[10px] text-resqnow-muted">Checklist items already stored on this incident.</p>
            </div>
            <ClipboardCheck className="h-5 w-5 text-resqnow-violet" />
          </div>
          <div className="mt-3 grid gap-2">
            {checklist.map((item) => (
              <div key={String(item)} className="flex items-center gap-3 rounded-xl border border-resqnow-safe/25 bg-resqnow-safe/8 px-3 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-resqnow-safe" />
                <span className="text-[12px] font-semibold text-resqnow-secondary">{String(item)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {secondaryActions.length > 0 && (
        <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_5px_18px_rgba(31,29,71,.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-resqnow-primary">Other response options</h2>
              <p className="mt-0.5 text-[10px] text-resqnow-muted">Additional actions currently permitted for this report.</p>
            </div>
            <MessageSquare className="h-5 w-5 text-resqnow-violet" />
          </div>

          <div className="mt-3 grid gap-2">
            {secondaryActions.map((action) => (
              <button
                key={action.value}
                type="button"
                onClick={() => setActionSheet(action)}
                className="min-h-[48px] flex items-center justify-between gap-3 rounded-xl border border-resqnow-violet/15 bg-resqnow-violet/5 px-3 text-left"
              >
                <span className="text-[12px] font-bold text-resqnow-primary">{action.label}</span>
                <MessageSquare className="h-4 w-4 text-resqnow-violet" />
              </button>
            ))}
          </div>
        </section>
      )}

      {actionSheet && (
        <ActionPreviewSheet
          action={actionSheet}
          onClose={() => {
            if (!actionSaving) {
              setActionSheet(null);
              setActionError('');
            }
          }}
          onSave={saveResponderAction}
          isSaving={actionSaving}
          error={actionError}
        />
      )}
    </div>
  );
}

function ActionPreviewSheet({ action, onClose, onSave, isSaving, error }) {
  const [remarks, setRemarks] = useState('');
  const needsOutcome = action.value === 'resolve';
  const needsRemarks = ['note', 'support', 'unable-locate', 'invalid-finding', 'resolve'].includes(action.value);
  const supportedNow = ['acknowledge', 'start', 'en-route', 'arrived', 'resolve'].includes(action.value);
  const missingOutcome = needsOutcome && !remarks.trim();

  async function handleSubmit() {
    if (!supportedNow || isSaving || missingOutcome) return;
    await onSave(action, remarks);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-resqnow-primary/35 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={action.label}>
      <div className="flex max-h-[calc(100dvh-12px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-10px_40px_rgba(31,29,71,.20)] sm:max-h-[90dvh] sm:rounded-[24px]">
        <div className="flex items-start justify-between gap-3 border-b border-resqnow-border-soft px-4 py-4">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Responder action</p>
            <h2 className="mt-1 text-[17px] font-bold text-resqnow-primary">{action.label}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-10 h-10 rounded-xl bg-resqnow-canvas text-resqnow-muted flex items-center justify-center disabled:opacity-50"
            aria-label="Close responder action"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[110px] sm:pb-4">
          {supportedNow ? (
            <div className="rounded-xl border border-resqnow-info/20 bg-resqnow-info/8 p-3 text-[11px] leading-relaxed text-resqnow-secondary">
              This action will be saved to the ResQNow server and added to the incident history. The resident will see the updated report state after refresh.
            </div>
          ) : (
            <div className="rounded-xl border border-resqnow-caution/25 bg-resqnow-caution/10 p-3 text-[11px] leading-relaxed text-resqnow-secondary">
              This secondary response form is prepared, but its dedicated server endpoint is not connected yet. Use the main lifecycle actions for tomorrow&apos;s demonstration.
            </div>
          )}

          {needsRemarks && (
            <label className="mt-4 block">
              <span className="text-[11px] font-bold text-resqnow-secondary">
                {needsOutcome ? 'Outcome summary' : 'Remarks'}
                {needsOutcome ? ' *' : ''}
              </span>
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                rows={4}
                maxLength={2000}
                placeholder={needsOutcome ? 'Summarize the response outcome…' : 'Add field details or context…'}
                className="mt-1.5 w-full resize-none rounded-xl border border-resqnow-border bg-resqnow-canvas px-3 py-3 text-[12px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
              />
              {missingOutcome && (
                <p className="mt-1.5 text-[10px] font-semibold text-resqnow-critical">
                  An outcome summary is required before resolving the report.
                </p>
              )}
            </label>
          )}

          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/8 p-3 text-[11px] text-resqnow-crimson">
              {error}
            </div>
          )}

          <div className="sticky bottom-0 -mx-4 mt-4 grid grid-cols-2 gap-2 border-t border-resqnow-border-soft bg-white/95 px-4 pb-2 pt-3 backdrop-blur">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-h-[46px] rounded-xl border border-resqnow-border-soft bg-white text-[11px] font-bold text-resqnow-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!supportedNow || isSaving || missingOutcome}
              className="min-h-[46px] rounded-xl bg-brand-gradient px-3 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSaving ? 'Saving…' : supportedNow ? `Confirm ${action.label}` : 'API pending'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-resqnow-violet/8 text-resqnow-violet">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-resqnow-placeholder">{label}</p>
        <p className="mt-1 break-words text-[12px] font-semibold leading-relaxed text-resqnow-secondary">{value}</p>
      </div>
    </div>
  );
}
