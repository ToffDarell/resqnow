import { Building2, MapPinned, ShieldAlert } from 'lucide-react';

// Public reference point for Camunatan Barangay Hall, City of Ilagan.
// This is an operational orientation point only; it is not a live command-center feed.
const CAMUNATAN_COMMAND = {
  lat: 17.135891,
  lng: 121.892464,
};

function osmEmbedUrl() {
  const latSpan = 0.018;
  const lngSpan = 0.022;
  const bbox = [
    CAMUNATAN_COMMAND.lng - lngSpan,
    CAMUNATAN_COMMAND.lat - latSpan,
    CAMUNATAN_COMMAND.lng + lngSpan,
    CAMUNATAN_COMMAND.lat + latSpan,
  ].join(',');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${CAMUNATAN_COMMAND.lat}%2C${CAMUNATAN_COMMAND.lng}`;
}

export default function ResponderOverviewMap({ awareness }) {
  const active = Number(awareness?.activeEmergencyCount ?? 0);
  const waiting = Number(awareness?.unassignedEmergencyCount ?? 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-resqnow-border-soft bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 px-3.5 pt-3.5 pb-2.5">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">
            Barangay overview
          </p>
          <h2 className="mt-0.5 text-[14px] font-extrabold text-resqnow-primary">
            Camunatan operational area
          </h2>
          <p className="mt-0.5 text-[9px] leading-relaxed text-resqnow-muted">
            Command reference + incident counts. Exact unassigned victim locations remain dispatcher-restricted.
          </p>
        </div>
        <MapPinned className="h-5 w-5 shrink-0 text-resqnow-violet" />
      </div>

      <div className="relative h-[232px] border-y border-resqnow-border-soft bg-[#eaf4f2]">
        <iframe
          title="Barangay Camunatan overview map"
          src={osmEmbedUrl()}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full border-0 pointer-events-none opacity-95"
        />

        <div className="absolute left-3 top-3 z-20 rounded-xl border border-resqnow-border-soft bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[9px] font-extrabold text-resqnow-primary">
            <Building2 className="h-3.5 w-3.5 text-resqnow-violet" />
            Barangay Hall reference
          </div>
        </div>

        {waiting > 0 && (
          <div className="absolute right-3 top-3 z-20 rounded-xl border border-resqnow-critical/20 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[9px] font-extrabold text-resqnow-critical">
              <ShieldAlert className="h-3.5 w-3.5" />
              {waiting} awaiting assignment
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="rounded-xl bg-resqnow-canvas p-3">
          <p className="text-[18px] font-extrabold text-resqnow-primary">{active}</p>
          <p className="mt-0.5 text-[9px] font-bold text-resqnow-muted">Active emergencies</p>
        </div>
        <div className="rounded-xl bg-resqnow-critical/6 p-3">
          <p className="text-[18px] font-extrabold text-resqnow-critical">{waiting}</p>
          <p className="mt-0.5 text-[9px] font-bold text-resqnow-muted">Awaiting dispatch</p>
        </div>
      </div>
    </section>
  );
}
