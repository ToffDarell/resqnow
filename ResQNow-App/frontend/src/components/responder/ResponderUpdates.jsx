import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

import { getAssignedReports } from '../../services/responderService';

export default function ResponderUpdates() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      setReports(await getAssignedReports());
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError?.message || 'Unable to load responder updates.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updates = useMemo(() => {
    return reports
      .flatMap((report) =>
        (report.events || []).map((event) => ({
          ...event,
          reportId: report.id,
          concernType: report.concernType,
          priority: report.priority,
        }))
      )
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [reports]);

  return (
    <div className="px-4 pt-4 pb-28 min-h-screen">
      <section className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg font-bold text-resqnow-primary">Updates</h1>
          <p className="mt-0.5 text-[11px] text-resqnow-muted">
            Status and field activity from your assigned incidents.
          </p>
          {lastUpdated && (
            <p className="mt-1 text-[9px] text-resqnow-placeholder">
              Last synced {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={load}
          disabled={isLoading}
          aria-label="Refresh responder updates"
          className="w-10 h-10 rounded-xl border border-resqnow-border-soft bg-white text-resqnow-violet flex items-center justify-center shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </section>

      {error && (
        <div className="mb-3 flex items-start gap-3 rounded-2xl border border-resqnow-critical/20 bg-resqnow-critical/8 p-3 text-[11px] text-resqnow-crimson">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-bold">Unable to refresh updates</p>
            <p className="mt-1">{error}</p>
            {updates.length > 0 && <p className="mt-1 text-resqnow-muted">Showing previously loaded activity.</p>}
          </div>
        </div>
      )}

      {isLoading && !updates.length ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl border border-resqnow-border-soft bg-white" />
          ))}
        </div>
      ) : updates.length ? (
        <div className="space-y-3">
          {updates.map((update) => {
            const important = ['Assigned', 'In Progress', 'Responders En Route', 'Responded', 'Resolved'].includes(update.status);
            const Icon = important ? CheckCircle2 : MessageSquare;

            return (
              <button
                key={`${update.reportId}-${update.id}`}
                type="button"
                onClick={() => navigate(`/responder/missions/${update.reportId}`)}
                className="flex w-full items-start gap-3 rounded-2xl border border-resqnow-border-soft bg-white p-4 text-left shadow-[0_4px_16px_rgba(31,29,71,.05)] hover:border-resqnow-violet/25"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${update.priority === 'High' ? 'bg-resqnow-critical/10 text-resqnow-critical' : 'bg-resqnow-violet/10 text-resqnow-violet'}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-bold text-resqnow-primary">{update.status || update.activity || 'Report update'}</p>
                    <span className="rounded-full bg-resqnow-canvas px-2 py-1 text-[9px] font-bold text-resqnow-muted">{update.reportId}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-resqnow-muted">
                    {update.remarks || update.activity || `${update.concernType} was updated.`}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[10px] text-resqnow-placeholder">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(update.createdAt)}
                    {update.actor?.fullName ? ` · ${update.actor.fullName}` : ''}
                  </p>
                </div>

                <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-resqnow-placeholder" />
              </button>
            );
          })}
        </div>
      ) : !error ? (
        <div className="rounded-2xl border border-resqnow-border-soft bg-white px-5 py-12 text-center">
          <Bell className="mx-auto h-8 w-8 text-resqnow-placeholder" />
          <p className="mt-3 text-[13px] font-bold text-resqnow-primary">No report activity yet</p>
          <p className="mt-1 text-[11px] text-resqnow-muted">Saved status and field events will appear here.</p>
        </div>
      ) : null}
    </div>
  );
}

function formatDate(value) {
  if (!value) return 'Time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });
}
