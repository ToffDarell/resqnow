import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';

import { cancelReport } from '../../services/reportService';

const CANCELLABLE_STATUSES = [
  'Submitted',
  'Pending Verification',
  'Verified',
  'Assigned',
  'In Progress',
  'Responders En Route',
];

function reasonOptions(report) {
  const isSos = report?.concernCode === 'sos';
  const emergency = report?.reportType === 'Emergency';

  if (isSos) {
    return [
      ['safe_now', 'I am safe now'],
      ['accidental', 'Accidental SOS'],
      ['help_elsewhere', 'Help arrived from another source'],
      ['duplicate', 'Duplicate SOS / report'],
      ['other', 'Other'],
    ];
  }

  if (emergency) {
    return [
      ['safe_now', 'I am safe now'],
      ['accidental', 'Submitted by mistake'],
      ['help_elsewhere', 'Help arrived from another source'],
      ['duplicate', 'Duplicate report'],
      ['no_longer_needed', 'Assistance is no longer needed'],
      ['other', 'Other'],
    ];
  }

  return [
    ['issue_resolved', 'Issue already resolved'],
    ['accidental', 'Submitted by mistake'],
    ['duplicate', 'Duplicate report'],
    ['help_elsewhere', 'Help arrived from another source'],
    ['no_longer_needed', 'Assistance is no longer needed'],
    ['other', 'Other'],
  ];
}

export function canResidentCancel(report) {
  if (!report?.status) return false;
  return CANCELLABLE_STATUSES.includes(report.status);
}

export default function CancelReportModal({
  open,
  report,
  onClose,
  onCancelled,
}) {
  const options = useMemo(() => reasonOptions(report), [report]);
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setRemarks('');
      setError('');
      setSubmitting(false);
    }
  }, [open, report?.id]);

  if (!open || !report) return null;

  const isSos = report.concernCode === 'sos';
  const isEmergency = report.reportType === 'Emergency';
  const heading = isSos
    ? "I'm Safe / Cancel Rescue"
    : isEmergency
    ? 'Cancel Emergency Report'
    : 'Cancel Report';

  const intro = isSos
    ? 'Only cancel if you are safe, the SOS was accidental, or rescue is no longer required.'
    : isEmergency
    ? 'Only cancel if emergency assistance is no longer required.'
    : 'Cancel this request only if barangay assistance is no longer needed.';

  const submit = async () => {
    if (!reason || submitting) return;

    if (reason === 'other' && !remarks.trim()) {
      setError('Please briefly explain why you are cancelling this report.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const updated = await cancelReport(report.id, {
        reason,
        remarks,
        expectedVersion: report.version,
      });

      window.dispatchEvent(
        new CustomEvent('resqnow:notifications-changed')
      );

      onCancelled?.(updated);
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to cancel this report. Refresh it and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-slate-950/55 px-3 pt-6 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-report-title"
    >
      <div className="w-full max-w-md max-h-[calc(100dvh-24px)] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-4 border-b border-resqnow-border-soft flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-resqnow-critical/10 text-resqnow-critical flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p id="cancel-report-title" className="text-[15px] font-extrabold text-resqnow-primary">
              {heading}
            </p>
            <p className="text-[10px] text-resqnow-muted mt-1 leading-relaxed">
              {intro}
            </p>
            <p className="text-[10px] font-bold text-resqnow-secondary mt-1.5">
              {report.id} · {report.concernType}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close cancellation dialog"
            className="w-9 h-9 rounded-xl border border-resqnow-border-soft text-resqnow-muted flex items-center justify-center disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-4">
          <p className="text-[11px] font-extrabold text-resqnow-primary mb-2.5">
            Why are you cancelling?
          </p>

          <div className="space-y-2">
            {options.map(([value, label]) => (
              <label
                key={value}
                className={`min-h-[44px] rounded-xl border px-3 py-2.5 flex items-center gap-3 cursor-pointer ${
                  reason === value
                    ? 'border-resqnow-violet bg-resqnow-violet/5'
                    : 'border-resqnow-border-soft bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={value}
                  checked={reason === value}
                  onChange={() => setReason(value)}
                  className="accent-resqnow-violet"
                />
                <span className="text-[11px] font-semibold text-resqnow-primary">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {reason === 'other' && (
            <div className="mt-3">
              <label className="text-[10px] font-bold text-resqnow-muted" htmlFor="cancel-remarks">
                Brief explanation
              </label>
              <textarea
                id="cancel-remarks"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value.slice(0, 500))}
                rows={3}
                placeholder="Tell the barangay why this report is being cancelled."
                className="mt-1.5 w-full rounded-xl border border-resqnow-border px-3 py-2.5 text-[12px] text-resqnow-primary outline-none focus:border-resqnow-violet/50 focus:ring-2 focus:ring-resqnow-violet/10"
              />
              <p className="text-[9px] text-resqnow-muted text-right mt-1">
                {remarks.length}/500
              </p>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-3 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/10 px-3 py-2.5">
              <p className="text-[10px] font-semibold text-resqnow-crimson leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <div className="sticky bottom-0 -mx-4 mt-4 grid grid-cols-2 gap-2.5 border-t border-resqnow-border-soft bg-white/95 px-4 pt-3 pb-2 backdrop-blur">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="min-h-[46px] rounded-xl border border-resqnow-border bg-white text-[11px] font-extrabold text-resqnow-primary disabled:opacity-50"
            >
              Keep Report Active
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!reason || submitting}
              className="min-h-[46px] rounded-xl bg-resqnow-critical text-white text-[11px] font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
