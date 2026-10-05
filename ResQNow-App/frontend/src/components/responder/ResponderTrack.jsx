import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BriefcaseMedical,
  CheckCircle2,
  ChevronRight,
  Map,
  MapPin,
  RefreshCw,
  Siren,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { getAssignedReports } from '../../services/responderService';
import { getPriorityStyle, getStatusStyle } from '../../utils/statusUtils';
import {
  formatClock,
  getPrimaryAction,
  isOpenReport,
  sortOperationalReports,
} from './responderViewUtils';

export default function ResponderTrack() {
  const { user } = useAuth();
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
      setError(requestError?.message || 'Unable to load assigned missions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const active = useMemo(
    () => sortOperationalReports(reports.filter(isOpenReport), user?.id),
    [reports, user?.id]
  );

  const closed = useMemo(
    () => reports.filter((report) => !isOpenReport(report)),
    [reports]
  );

  return (
    <div className="px-4 pt-4 pb-28 min-h-screen">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">
            Dispatcher-assigned only
          </p>
          <h1 className="mt-1 text-[21px] font-extrabold text-resqnow-primary">Missions</h1>
          <p className="mt-1 text-[10px] text-resqnow-muted">
            No incident catalog. Only missions assigned to your responder account appear here.
          </p>
          {lastUpdated && (
            <p className="mt-1 text-[9px] text-resqnow-placeholder">Updated {formatClock(lastUpdated)}</p>
          )}
        </div>

        <button
          type="button"
          onClick={load}
          disabled={isLoading}
          aria-label="Refresh missions"
          className="w-11 h-11 rounded-xl border border-resqnow-border-soft bg-white text-resqnow-violet flex items-center justify-center shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </section>

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-resqnow-critical/20 bg-resqnow-critical/8 p-3 text-[11px] text-resqnow-crimson">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section className="mt-4 rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-critical">Active missions</p>
            <p className="mt-1 text-[12px] font-semibold text-resqnow-muted">
              {active.length} currently assigned and operational
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/responder/missions/map')}
            disabled={!active.length}
            className="min-h-[42px] rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/5 px-3 text-[10px] font-bold text-resqnow-violet flex items-center gap-2 disabled:opacity-40"
          >
            <Map className="h-4 w-4" /> Assigned Map
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {isLoading && !reports.length ? (
            <div className="h-32 animate-pulse rounded-xl bg-resqnow-canvas" />
          ) : active.length ? (
            active.map((report) => (
              <MissionCard
                key={report.id}
                report={report}
                onOpen={() => navigate(`/responder/missions/${report.id}`)}
              />
            ))
          ) : (
            <div className="rounded-xl bg-resqnow-canvas px-4 py-7 text-center">
              <CheckCircle2 className="mx-auto h-7 w-7 text-resqnow-safe" />
              <p className="mt-2 text-[12px] font-bold text-resqnow-primary">No active missions</p>
              <p className="mt-1 text-[10px] text-resqnow-muted">Wait for dispatcher assignment.</p>
            </div>
          )}
        </div>
      </section>

      {closed.length > 0 && (
        <section className="mt-4 rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <BriefcaseMedical className="h-4 w-4 text-resqnow-violet" />
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Completed mission records</p>
              <p className="mt-0.5 text-[10px] text-resqnow-muted">Closed reports still linked to your current assignment history.</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {closed.map((report) => (
              <MissionCard
                key={report.id}
                report={report}
                onOpen={() => navigate(`/responder/missions/${report.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MissionCard({ report, onOpen }) {
  const nextAction = getPrimaryAction(report);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl border border-resqnow-border-soft bg-white p-3.5 text-left hover:border-resqnow-violet/25 active:scale-[.995] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.reportType === 'Emergency' ? 'bg-resqnow-critical/10 text-resqnow-critical' : 'bg-resqnow-violet/10 text-resqnow-violet'}`}>
          {report.reportType === 'Emergency' ? <Siren className="h-5 w-5" /> : <BriefcaseMedical className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-resqnow-primary">{report.id}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold ${getPriorityStyle(report.priority)}`}>
              {report.priority}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${getStatusStyle(report.status)}`}>
              {report.status}
            </span>
          </div>
          <p className="mt-1 text-[13px] font-bold text-resqnow-primary">{report.concernType}</p>
          <div className="mt-1.5 flex items-start gap-1.5 text-[10px] text-resqnow-muted">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="line-clamp-2">{report.location || 'Location unavailable'}</span>
          </div>
          {nextAction && (
            <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-resqnow-violet">
              Next: {nextAction.label}
            </p>
          )}
        </div>

        <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-resqnow-placeholder" />
      </div>
    </button>
  );
}
