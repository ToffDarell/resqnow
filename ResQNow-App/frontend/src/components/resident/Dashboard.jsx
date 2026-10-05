import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  House,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Tent,
  Users,
  WifiOff,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { getContactDirectory } from '../../services/contactService';
import {
  getEvacuationCenters,
  getOperationalAnnouncements,
} from '../../services/operationsService';
import { getReports } from '../../services/reportService';
import { getStatusStyle } from '../../utils/statusUtils';
import CancelReportModal, { canResidentCancel } from './CancelReportModal';
import SOSAction from './SOSAction';

const TERMINAL_STATUSES = ['Resolved', 'Invalid', 'Cancelled'];
const HOME_REPORT_POLL_MS = 15000;
const HOME_OPERATIONS_POLL_MS = 30000;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  const [reports, setReports] = useState([]);
  const [reportError, setReportError] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsSource, setAnnouncementsSource] = useState('api');
  const [operationsError, setOperationsError] = useState('');
  const [evacuationCenters, setEvacuationCenters] = useState([]);
  const [evacuationSource, setEvacuationSource] = useState('api');
  const [hotline, setHotline] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadReports = useCallback(async () => {
    try {
      const result = await getReports();
      setReports(Array.isArray(result) ? result : []);
      setReportError('');
    } catch (error) {
      setReportError(error?.message || 'Unable to refresh your active rescue status.');
    }
  }, []);

  const loadOperations = useCallback(async () => {
    const homeLat = Number(user?.homeLocation?.latitude);
    const homeLng = Number(user?.homeLocation?.longitude);
    const hasHomeCoordinates = Number.isFinite(homeLat) && Number.isFinite(homeLng);

    try {
      const [announcementResult, evacuationResult] = await Promise.all([
        getOperationalAnnouncements({ limit: 20 }),
        getEvacuationCenters({
          lat: hasHomeCoordinates ? homeLat : undefined,
          lng: hasHomeCoordinates ? homeLng : undefined,
          nearest: true,
          limit: 1,
        }),
      ]);

      setAnnouncements(announcementResult.data);
      setAnnouncementsSource(announcementResult.source);
      setEvacuationCenters(evacuationResult.data);
      setEvacuationSource(evacuationResult.source);
      setOperationsError('');
    } catch (error) {
      setOperationsError(
        error?.message || 'Unable to refresh barangay operational information.'
      );
    }
  }, [user?.homeLocation?.latitude, user?.homeLocation?.longitude]);

  const loadHotline = useCallback(async () => {
    try {
      const { directory } = await getContactDirectory();
      const preferred = directory.contacts.find(
        (contact) => contact.id === 'barangay-emergency-hotline'
      );
      const fallback = directory.contacts.find(
        (contact) => Array.isArray(contact.phoneNumbers) && contact.phoneNumbers.length > 0
      );
      const contact = preferred || fallback;
      const phone = contact?.phoneNumbers?.[0];

      if (phone?.number) {
        setHotline({
          name: contact.name,
          number: phone.number,
          displayNumber: phone.displayNumber || phone.number,
        });
      }
    } catch {
      // contactService already falls back to the bundled saved directory.
    }
  }, []);

  useEffect(() => {
    loadReports();
    loadOperations();
    loadHotline();

    const reportIntervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') loadReports();
    }, HOME_REPORT_POLL_MS);

    const operationsIntervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') loadOperations();
    }, HOME_OPERATIONS_POLL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadReports();
        loadOperations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(reportIntervalId);
      window.clearInterval(operationsIntervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadReports, loadOperations, loadHotline]);

  const activeRescue = useMemo(() => {
    return [...reports]
      .filter(
        (report) =>
          report.reportType === 'Emergency' &&
          !TERMINAL_STATUSES.includes(report.status)
      )
      .sort((a, b) => getReportTime(b) - getReportTime(a))[0] || null;
  }, [reports]);

  const criticalAlert = useMemo(
    () => announcements.find((item) => item.category === 'critical') || null,
    [announcements]
  );

  const barangayUpdates = useMemo(
    () => announcements.filter((item) => item.category !== 'critical').slice(0, 2),
    [announcements]
  );

  const nearestCenter = evacuationCenters[0] || null;

  const callHotline = () => {
    if (hotline?.number) {
      window.location.href = `tel:${hotline.number}`;
      return;
    }
    navigate('/contacts');
  };

  const handleSosCreated = (report) => {
    if (!report?.id) {
      loadReports();
      return;
    }

    setReports((current) => [
      report,
      ...current.filter((item) => item.id !== report.id),
    ]);
  };


  const handleReportCancelled = (updatedReport) => {
    if (updatedReport?.id) {
      setReports((current) => [
        updatedReport,
        ...current.filter((item) => item.id !== updatedReport.id),
      ]);
    } else {
      loadReports();
    }

    setCancelTarget(null);
  };

  return (
    <div className="px-4 pt-2 pb-6 space-y-4">
      {criticalAlert && (
        <CriticalAlertBanner
          alert={criticalAlert}
          onOpen={() => navigate('/updates')}
          source={announcementsSource}
        />
      )}

      {barangayUpdates.length > 0 && (
        <BarangayUpdates
          announcements={barangayUpdates}
          source={announcementsSource}
          onOpen={() => navigate('/updates')}
        />
      )}

      {!isOnline && <OfflineModeBanner />}

      {activeRescue ? (
        <ActiveRescueCard
          report={activeRescue}
          onOpen={() => navigate(`/track/${encodeURIComponent(activeRescue.id)}`)}
          onCancel={() => setCancelTarget(activeRescue)}
        />
      ) : (
        <SOSAction
          user={user}
          hotline={hotline}
          onCreated={handleSosCreated}
          onCallHotline={callHotline}
        />
      )}

      {reportError && (
        <InlineError
          title="Active rescue status could not refresh"
          message={`${reportError} The SOS endpoint still performs its own duplicate protection.`}
          onRetry={loadReports}
        />
      )}

      <QuickAccess
        hotline={hotline}
        onCallHotline={callHotline}
        onHousehold={() => navigate('/settings')}
      />

      <EvacuationCenterCard
        center={nearestCenter}
        source={evacuationSource}
        hasSavedLocation={Boolean(user?.homeLocation?.latitude && user?.homeLocation?.longitude)}
        onCallHotline={callHotline}
      />

      <SafetySnapshot
        offline={!isOnline}
        onOpen={() => navigate('/safety-tips')}
      />

      {operationsError && !criticalAlert && barangayUpdates.length === 0 && !nearestCenter && (
        <InlineError
          title="Barangay information could not refresh"
          message={operationsError}
          onRetry={loadOperations}
        />
      )}

      <CancelReportModal
        open={Boolean(cancelTarget)}
        report={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onCancelled={handleReportCancelled}
      />
    </div>
  );
}

function CriticalAlertBanner({ alert, onOpen, source }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl bg-resqnow-critical text-white px-4 py-3.5 text-left shadow-[0_8px_22px_rgba(217,45,32,0.24)] active:scale-[0.995] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Siren className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em]">
              Critical Barangay Alert
            </span>
            {source === 'cache' && (
              <span className="text-[8px] font-bold bg-white/15 px-2 py-0.5 rounded-full">
                Saved copy
              </span>
            )}
          </div>
          <p className="text-[13px] font-extrabold mt-1 leading-snug">{alert.title}</p>
          <p className="text-[10px] text-white/90 mt-1 line-clamp-2 leading-relaxed">
            {alert.body}
          </p>
          <p className="text-[9px] text-white/75 mt-2">Tap to review the official update.</p>
        </div>
        <ChevronRight className="w-4 h-4 shrink-0 mt-3" />
      </div>
    </button>
  );
}

function BarangayUpdates({ announcements, source, onOpen }) {
  return (
    <section aria-label="Barangay alerts">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-resqnow-muted mb-2">
        Barangay alerts
      </p>
      <div className="space-y-2">
        {announcements.map((item) => {
          const advisory = item.category === 'advisory';
          return (
            <button
              key={item.id}
              type="button"
              onClick={onOpen}
              className={`w-full rounded-2xl border px-3.5 py-3 text-left shadow-[0_5px_16px_rgba(7,55,99,0.06)] active:scale-[0.995] transition-transform ${
                advisory
                  ? 'bg-bgy-yellow-soft border-bgy-yellow/40 border-l-4 border-l-bgy-yellow'
                  : 'bg-white border-resqnow-border-soft border-l-4 border-l-resqnow-violet'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  advisory
                    ? 'bg-bgy-yellow text-bgy-navy'
                    : 'bg-resqnow-violet/10 text-resqnow-violet'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-resqnow-muted">
                      {advisory ? 'Barangay advisory' : 'Barangay announcement'}
                    </p>
                    {source === 'cache' && (
                      <span className="text-[8px] font-bold text-resqnow-pending">Saved copy</span>
                    )}
                  </div>
                  <p className="text-[12px] font-extrabold text-resqnow-primary mt-0.5 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-resqnow-muted mt-0.5 line-clamp-2">
                    {item.body}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-resqnow-muted shrink-0 mt-2" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function OfflineModeBanner() {
  return (
    <section className="rounded-2xl border border-resqnow-pending/30 bg-resqnow-pending/10 px-3.5 py-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-resqnow-pending/15 text-resqnow-pending flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold text-resqnow-primary">Offline Mode</p>
          <p className="text-[10px] text-resqnow-secondary mt-0.5 leading-relaxed">
            Live information may be outdated. SOS still attempts the ResQNow API first and offers SMS/call fallback if delivery cannot be confirmed.
          </p>
        </div>
      </div>
    </section>
  );
}

function ActiveRescueCard({ report, onOpen, onCancel }) {
  const status = getRescueStatus(report);
  const isSos = report.concernCode === 'sos';

  return (
    <section className="bg-white rounded-3xl border-2 border-resqnow-critical/25 overflow-hidden shadow-[0_10px_28px_rgba(217,45,32,0.10)]">
      <div className="px-4 py-3 bg-resqnow-critical/8 border-b border-resqnow-critical/12">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-resqnow-critical">
              Active Rescue
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[14px] font-extrabold text-resqnow-primary">{report.id}</span>
              {isSos && (
                <span className="text-[8px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-resqnow-critical text-white">
                  SOS
                </span>
              )}
            </div>
          </div>
          <span className={`shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(report.status)}`}>
            {report.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-resqnow-critical/10 text-resqnow-critical flex items-center justify-center shrink-0">
            <Siren className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-extrabold text-resqnow-primary">{status.title}</p>
            <p className="text-[10px] text-resqnow-muted mt-1 leading-relaxed">{status.message}</p>
          </div>
        </div>

        {report.location && (
          <div className="mt-3 rounded-xl bg-resqnow-canvas px-3 py-2.5 flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-resqnow-violet mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] font-extrabold text-resqnow-muted uppercase tracking-[0.08em]">Location on report</p>
              <p className="text-[10px] text-resqnow-primary mt-0.5 line-clamp-2">{report.location}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onOpen}
          className="mt-3 w-full min-h-[46px] rounded-xl bg-resqnow-violet text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
        >
          Track Rescue
          <ChevronRight className="w-4 h-4" />
        </button>


        {canResidentCancel(report) && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-2.5 w-full min-h-[44px] rounded-xl border border-resqnow-critical/25 bg-resqnow-critical/5 text-resqnow-critical text-[10px] font-extrabold active:scale-[0.99] transition-transform"
          >
            {isSos ? "I'm Safe / Cancel Rescue" : 'Cancel Report'}
          </button>
        )}
      </div>
    </section>
  );
}

function QuickAccess({ hotline, onCallHotline, onHousehold }) {
  return (
    <section>
      <h2 className="text-[14px] font-extrabold text-resqnow-primary mb-2.5">Quick Access</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onHousehold}
          className="min-h-[82px] bg-white border border-resqnow-violet/20 rounded-2xl px-3 py-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-resqnow-primary">Household Information</p>
            <p className="text-[9px] text-resqnow-muted mt-0.5">Keep emergency profile details current</p>
          </div>
        </button>

        <button
          type="button"
          onClick={onCallHotline}
          className="min-h-[82px] bg-white border border-resqnow-critical/20 rounded-2xl px-3 py-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-resqnow-critical/10 text-resqnow-critical flex items-center justify-center shrink-0">
            <Phone className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-resqnow-primary">Call Barangay Hotline</p>
            <p className="text-[9px] text-resqnow-muted mt-0.5">
              {hotline?.displayNumber || 'One-tap emergency contact'}
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}

function EvacuationCenterCard({ center, source, hasSavedLocation, onCallHotline }) {
  if (!center) {
    return (
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
            <Tent className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-extrabold text-resqnow-primary">Evacuation center information</p>
            <p className="text-[10px] text-resqnow-muted mt-1 leading-relaxed">
              No operational evacuation center has been published in ResQNow yet. Call the barangay for current instructions.
            </p>
            <button
              type="button"
              onClick={onCallHotline}
              className="mt-2.5 min-h-[40px] px-3 rounded-xl border border-resqnow-violet/20 text-resqnow-violet text-[10px] font-extrabold"
            >
              Call Hotline
            </button>
          </div>
        </div>
      </section>
    );
  }

  const statusStyles = {
    open: 'bg-resqnow-safe/10 text-resqnow-safe border-resqnow-safe/20',
    full: 'bg-resqnow-critical/10 text-resqnow-critical border-resqnow-critical/20',
    standby: 'bg-bgy-yellow-soft text-bgy-navy border-bgy-yellow/40',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const occupancyText =
    center.currentOccupancy !== null && center.capacity !== null
      ? `${center.currentOccupancy}/${center.capacity} persons`
      : center.capacity !== null
      ? `Capacity ${center.capacity}`
      : 'Capacity not published';

  return (
    <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden">
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
            <Tent className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-resqnow-muted">
                {center.distanceMeters !== null ? 'Nearest evacuation center' : 'Evacuation center'}
              </p>
              {source === 'cache' && (
                <span className="text-[8px] font-bold text-resqnow-pending">Saved data</span>
              )}
            </div>
            <p className="text-[13px] font-extrabold text-resqnow-primary mt-1">{center.name}</p>
            <p className="text-[10px] text-resqnow-muted mt-1 line-clamp-2">{center.address}</p>
          </div>
          <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-full border ${statusStyles[center.status] || statusStyles.standby}`}>
            {center.status}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-xl bg-resqnow-canvas px-3 py-2">
            <p className="text-resqnow-muted">Occupancy</p>
            <p className="font-bold text-resqnow-primary mt-0.5">{occupancyText}</p>
          </div>
          <div className="rounded-xl bg-resqnow-canvas px-3 py-2">
            <p className="text-resqnow-muted">Distance</p>
            <p className="font-bold text-resqnow-primary mt-0.5">
              {formatDistance(center.distanceMeters, hasSavedLocation)}
            </p>
          </div>
        </div>

        {center.directionsUrl && (
          <a
            href={center.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 min-h-[42px] px-3.5 rounded-xl bg-resqnow-violet text-white text-[10px] font-extrabold flex items-center justify-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </a>
        )}
      </div>
    </section>
  );
}

function SafetySnapshot({ offline, onOpen }) {
  return (
    <section className="bg-white border border-bgy-yellow/35 rounded-2xl overflow-hidden">
      <div className="px-3.5 py-3 bg-bgy-yellow-soft/60 border-b border-bgy-yellow/20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-bgy-yellow text-bgy-navy flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-bgy-navy/70">
            {offline ? 'Offline safety tips' : 'Flood safety snapshot'}
          </p>
          <p className="text-[12px] font-bold text-bgy-navy mt-0.5">Know what to do before water rises</p>
        </div>
      </div>
      <div className="p-3.5 space-y-2 text-[10px] text-resqnow-secondary leading-relaxed">
        <p>• Move to higher ground before floodwater becomes difficult to cross.</p>
        <p>• Turn off electricity only when it is safe to do so.</p>
        <p>• Never walk or drive through fast-moving floodwater.</p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-1 min-h-[40px] text-resqnow-violet font-extrabold flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Open Safety Guides
        </button>
      </div>
    </section>
  );
}

function InlineError({ title, message, onRetry }) {
  return (
    <div role="alert" className="bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-resqnow-critical shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-resqnow-crimson">{title}</p>
          <p className="text-[11px] text-resqnow-secondary mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2.5 min-h-[40px] px-3 rounded-lg border border-resqnow-critical/20 bg-white text-resqnow-crimson text-[10px] font-extrabold flex items-center gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try Again
      </button>
    </div>
  );
}

function getRescueStatus(report) {
  const assignments = Array.isArray(report?.assignedPersonnelList)
    ? report.assignedPersonnelList
    : [];
  const acknowledged = assignments.some((assignment) => assignment?.acknowledged);

  switch (report.status) {
    case 'Submitted':
      return {
        title: report.concernCode === 'sos' ? 'SOS received' : 'Emergency report received',
        message: 'Your emergency is recorded. Keep your phone reachable for barangay coordination.',
      };
    case 'Assigned':
      return acknowledged
        ? {
            title: 'Responder acknowledged',
            message: 'Your assigned responder has confirmed the rescue assignment.',
          }
        : {
            title: 'Responder assigned',
            message: 'A responder has been assigned to your emergency.',
          };
    case 'In Progress':
      return {
        title: 'Response started',
        message: 'The assigned responder has started handling your emergency.',
      };
    case 'Responders En Route':
      return {
        title: 'Responders are on the way',
        message: 'Stay in the safest reachable place and keep your phone accessible.',
      };
    case 'Responded':
      return {
        title: 'Responders arrived / response recorded',
        message: 'An on-scene response has been recorded. Open Track for the confirmed history.',
      };
    default:
      return {
        title: report.latestUpdate || 'Active emergency',
        message: 'Open Track to review the latest confirmed rescue status.',
      };
  }
}

function formatDistance(distanceMeters, hasSavedLocation) {
  if (distanceMeters === null || distanceMeters === undefined) {
    return hasSavedLocation ? 'Not available' : 'Add home pin for distance';
  }
  if (distanceMeters < 1000) return `${distanceMeters} m`;
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function getReportTime(report) {
  const value = report?.updatedAtIso || report?.createdAt || report?.updatedAt || report?.submittedAt;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
}
