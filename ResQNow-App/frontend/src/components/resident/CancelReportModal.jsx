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
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-report-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
        onClick={!submitting ? onClose : undefined}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md max-h-[90dvh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D92D20] to-[#F97316] shrink-0" />

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-start gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D92D20] flex items-center justify-center shrink-0 ring-1 ring-red-100">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p id="cancel-report-title" className="text-[15px] font-extrabold text-[#1F2937] leading-snug">
              {heading}
            </p>
            <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">
              {intro}
            </p>
            <p className="text-[11px] font-bold text-[#374151] mt-1.5 font-mono tracking-tight">
              {report.id} · {report.concernType}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close cancellation dialog"
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] text-[#9CA3AF] flex items-center justify-center hover:bg-slate-50 hover:text-[#374151] transition disabled:opacity-40 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ────────────────────────────── */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
          <p className="text-[11px] font-extrabold text-[#1F2937] uppercase tracking-wide mb-3">
            Why are you cancelling?
          </p>

          <div className="space-y-2">
            {options.map(([value, label]) => (
              <label
                key={value}
                className={`min-h-[46px] rounded-xl border px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  reason === value
                    ? 'border-[#0B4F9C] bg-[#EEF4FA] ring-1 ring-[#0B4F9C]/20'
                    : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={value}
                  checked={reason === value}
                  onChange={() => setReason(value)}
                  className="accent-[#0B4F9C] w-4 h-4 shrink-0"
                />
                <span className="text-[13px] font-semibold text-[#1F2937]">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {reason === 'other' && (
            <div className="mt-4">
              <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide" htmlFor="cancel-remarks">
                Brief explanation
              </label>
              <textarea
                id="cancel-remarks"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value.slice(0, 500))}
                rows={3}
                placeholder="Tell the barangay why this report is being cancelled."
                className="mt-1.5 w-full rounded-xl border border-[#D1D5DB] px-3.5 py-2.5 text-[13px] text-[#1F2937] outline-none focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10 resize-none transition"
              />
              <p className="text-[10px] text-[#9CA3AF] text-right mt-0.5">
                {remarks.length}/500
              </p>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-3 rounded-xl border border-[#D92D20]/20 bg-[#FFF0F3] px-3.5 py-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" />
              <p className="text-[12px] font-semibold text-[#B42318] leading-relaxed">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* ── ACTION FOOTER (outside scroll) ────────────── */}
        <div
          className="shrink-0 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-[#E5E7EB] bg-white flex gap-3"
        >
          {/* Keep Active */}
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 h-12 rounded-xl border border-[#D1D5DB] bg-white text-[13px] font-bold text-[#374151] hover:bg-slate-50 transition active:scale-[0.98] disabled:opacity-40"
          >
            Keep Active
          </button>

          {/* Confirm Cancel */}
          <button
            type="button"
            onClick={submit}
            disabled={!reason || submitting}
            className="flex-1 h-12 rounded-xl bg-[#D92D20] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#B42318] transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-900/20"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
