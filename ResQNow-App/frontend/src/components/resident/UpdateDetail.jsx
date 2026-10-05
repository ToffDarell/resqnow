import {
  useEffect,
  useState,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Megaphone,
} from 'lucide-react';

import {
  getNotification,
  markNotificationRead,
} from '../../services/notificationService';
import { getReport } from '../../services/reportService';

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function UpdateDetail() {
  const navigate = useNavigate();
  const { updateId } = useParams();
  const [notification, setNotification] = useState(null);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError('');

      try {
        let current = await getNotification(updateId);

        if (!current.readAt) {
          try {
            current = await markNotificationRead(updateId);
            window.dispatchEvent(
              new Event('resqnow:notifications-changed')
            );
          } catch {
            // Read state failure must not block content.
          }
        }

        if (cancelled) return;
        setNotification(current);

        if (current.reportCode) {
          try {
            const currentReport = await getReport(current.reportCode);
            if (!cancelled) setReport(currentReport);
          } catch {
            if (!cancelled) setReport(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error?.message || 'Unable to load this update.'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [updateId]);

  if (isLoading) {
    return (
      <div className="px-4 pt-5 pb-28 min-h-screen">
        <BackButton onClick={() => navigate('/updates')} />
        <div className="py-16 text-center">
          <Loader2 className="w-7 h-7 text-resqnow-violet animate-spin mx-auto" />
          <p className="text-[12px] text-resqnow-muted mt-3">
            Loading update...
          </p>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="px-4 pt-5 pb-28 min-h-screen">
        <BackButton onClick={() => navigate('/updates')} />
        <div className="mt-8 bg-white border border-resqnow-border-soft rounded-2xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-resqnow-critical mx-auto" />
          <p className="text-sm font-bold text-resqnow-primary mt-3">
            Update unavailable
          </p>
          <p className="text-[11px] text-resqnow-muted mt-1">
            {loadError || 'This update could not be loaded.'}
          </p>
        </div>
      </div>
    );
  }

  const isAnnouncement = notification.kind === 'announcement';
  const Icon = isAnnouncement ? Megaphone : FileText;

  return (
    <div className="px-4 pt-5 pb-28 min-h-screen">
      <BackButton onClick={() => navigate('/updates')} />

      <article className="mt-2 bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden">
        <div className="h-1 bg-brand-gradient" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-resqnow-violet">
                {isAnnouncement ? 'Barangay Announcement' : 'Report Update'}
              </p>
              <h1 className="text-[17px] font-bold text-resqnow-primary mt-1 leading-snug">
                {notification.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-resqnow-muted">
                <Clock3 className="w-3.5 h-3.5" />
                {formatTime(notification.createdAt)}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-resqnow-canvas p-3">
            <p className="text-[12px] text-resqnow-secondary leading-relaxed">
              {notification.message}
            </p>
          </div>
        </div>
      </article>

      {notification.reportCode && (
        <section className="mt-3 bg-white border border-resqnow-border-soft rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-resqnow-safe" />
            <h2 className="text-[13px] font-bold text-resqnow-primary">
              Confirmed Report State
            </h2>
          </div>

          <div className="rounded-xl bg-resqnow-canvas p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-resqnow-muted">Report</span>
              <span className="text-[11px] font-bold text-resqnow-violet">
                {notification.reportCode}
              </span>
            </div>

            {report?.status && (
              <div className="flex items-center justify-between gap-3 mt-2">
                <span className="text-[11px] text-resqnow-muted">Current Status</span>
                <span className="text-[11px] font-bold text-resqnow-primary">
                  {report.status}
                </span>
              </div>
            )}

            {report?.latestUpdate && (
              <p className="text-[11px] text-resqnow-secondary mt-3 leading-relaxed">
                {report.latestUpdate}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate(`/track/${notification.reportCode}`)}
            className="w-full mt-3 min-h-[46px] rounded-xl bg-brand-gradient text-white text-[12px] font-bold"
          >
            Open Report
          </button>
        </section>
      )}
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[40px] flex items-center gap-1.5 text-[11px] font-semibold text-resqnow-violet"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Updates
    </button>
  );
}
