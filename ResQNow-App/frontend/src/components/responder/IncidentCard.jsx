import {
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Siren,
} from 'lucide-react';

import {
  getPriorityStyle,
  getStatusStyle,
} from '../../utils/statusUtils';

export default function IncidentCard({ report, onOpen }) {
  const isEmergency = report.reportType === 'Emergency';

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(31,29,71,.05)] hover:border-resqnow-violet/25 active:scale-[.995] transition-all"
    >
      <div className={`h-1 ${isEmergency ? 'bg-emergency-gradient' : 'bg-info-gradient'}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isEmergency
                ? 'bg-resqnow-critical/10 text-resqnow-critical'
                : 'bg-resqnow-info/10 text-resqnow-info'
            }`}
          >
            {isEmergency ? <Siren className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold text-resqnow-muted">{report.id}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusStyle(report.status)}`}>
                {report.status}
              </span>
              <span className={`text-[10px] font-bold border px-2 py-1 rounded-full ${getPriorityStyle(report.priority)}`}>
                {report.priority}
              </span>
            </div>

            <p className="text-[15px] font-bold text-resqnow-primary mt-1.5 line-clamp-2">
              {report.concernType}
            </p>
          </div>

          <ChevronRight className="w-4 h-4 text-resqnow-placeholder mt-2 shrink-0" />
        </div>

        <div className="mt-3 grid gap-2">
          <div className="flex items-start gap-2 text-[12px] text-resqnow-muted">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{report.location || 'Location not provided'}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-resqnow-placeholder">
            <Clock3 className="w-3.5 h-3.5 shrink-0" />
            <span>{report.submittedAt || report.createdAt || 'Submission time unavailable'}</span>
          </div>
        </div>

        {report.latestUpdate && (
          <div className="mt-3 rounded-xl bg-resqnow-canvas px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wide font-bold text-resqnow-placeholder">Latest activity</p>
            <p className="text-[12px] text-resqnow-secondary mt-1 line-clamp-2">{report.latestUpdate}</p>
          </div>
        )}
      </div>
    </button>
  );
}
