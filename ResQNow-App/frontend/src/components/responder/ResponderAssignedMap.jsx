import { MapPin } from 'lucide-react';
import { validCoordinates } from './responderViewUtils';

const pinTone = {
  High: {
    pin: 'bg-resqnow-critical border-resqnow-critical/30',
    dot: 'bg-resqnow-critical',
    label: 'High',
  },
  Medium: {
    pin: 'bg-resqnow-pending border-resqnow-pending/30',
    dot: 'bg-resqnow-pending',
    label: 'Medium',
  },
  Low: {
    pin: 'bg-resqnow-info border-resqnow-info/30',
    dot: 'bg-resqnow-info',
    label: 'Low',
  },
};

function mercatorY(latitude) {
  const clamped =
    Math.max(
      -85,
      Math.min(
        85,
        latitude
      )
    );

  const radians =
    (clamped * Math.PI) / 180;

  return Math.log(
    Math.tan(
      Math.PI / 4 +
      radians / 2
    )
  );
}

function buildBounds(points) {
  if (!points.length) {
    return null;
  }

  let minLat =
    Math.min(
      ...points.map(
        (point) => point.lat
      )
    );

  let maxLat =
    Math.max(
      ...points.map(
        (point) => point.lat
      )
    );

  let minLng =
    Math.min(
      ...points.map(
        (point) => point.lng
      )
    );

  let maxLng =
    Math.max(
      ...points.map(
        (point) => point.lng
      )
    );

  const minLatSpan = 0.01;
  const minLngSpan = 0.01;

  if (
    maxLat - minLat <
    minLatSpan
  ) {
    const center =
      (maxLat + minLat) / 2;

    minLat =
      center -
      minLatSpan / 2;

    maxLat =
      center +
      minLatSpan / 2;
  }

  if (
    maxLng - minLng <
    minLngSpan
  ) {
    const center =
      (maxLng + minLng) / 2;

    minLng =
      center -
      minLngSpan / 2;

    maxLng =
      center +
      minLngSpan / 2;
  }

  const latPadding =
    (maxLat - minLat) * 0.22;

  const lngPadding =
    (maxLng - minLng) * 0.22;

  return {
    minLat:
      Math.max(
        -85,
        minLat - latPadding
      ),

    maxLat:
      Math.min(
        85,
        maxLat + latPadding
      ),

    minLng:
      Math.max(
        -180,
        minLng - lngPadding
      ),

    maxLng:
      Math.min(
        180,
        maxLng + lngPadding
      ),
  };
}

function positionFor(
  point,
  bounds
) {
  const x =
    (
      (
        point.lng -
        bounds.minLng
      ) /
      Math.max(
        0.000001,
        bounds.maxLng -
        bounds.minLng
      )
    ) * 100;

  const north =
    mercatorY(
      bounds.maxLat
    );

  const south =
    mercatorY(
      bounds.minLat
    );

  const current =
    mercatorY(
      point.lat
    );

  const y =
    (
      (
        north -
        current
      ) /
      Math.max(
        0.000001,
        north -
        south
      )
    ) * 100;

  return {
    left:
      `${Math.max(
        3,
        Math.min(
          97,
          x
        )
      )}%`,

    top:
      `${Math.max(
        5,
        Math.min(
          95,
          y
        )
      )}%`,
  };
}

function osmEmbedUrl(
  bounds
) {
  if (!bounds) {
    return null;
  }

  const bbox = [
    bounds.minLng,
    bounds.minLat,
    bounds.maxLng,
    bounds.maxLat,
  ].join(',');

  return (
    'https://www.openstreetmap.org/export/embed.html' +
    `?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik`
  );
}

export default function ResponderAssignedMap({
  reports,
  onSelect,

  // Normal compact Track map.
  heightClass = 'h-[250px]',

  showLegend = true,

  // Full-screen mode.
  fill = false,

  // Allow map interaction only in
  // the dedicated full map screen.
  interactive = false,

  ariaLabel =
    'Assigned incident map',
}) {
  const mapped =
    reports
      .map(
        (report) => {
          const coordinates =
            validCoordinates(
              report
            );

          return coordinates
            ? {
                report,
                ...coordinates,
              }
            : null;
        }
      )
      .filter(Boolean);

  const bounds =
    buildBounds(
      mapped
    );

  const embedUrl =
    osmEmbedUrl(
      bounds
    );

  const wrapperClass =
    fill
      ? 'h-full min-h-0'
      : '';

  const mapHeightClass =
    fill
      ? 'h-full min-h-0'
      : heightClass;

  if (!mapped.length) {
    return (
      <div
        className={`${wrapperClass} ${mapHeightClass} rounded-2xl border border-resqnow-border-soft bg-resqnow-canvas flex flex-col items-center justify-center px-5 text-center`}
        role="img"
        aria-label={ariaLabel}
      >
        <div className="w-11 h-11 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>

        <p className="mt-3 text-[13px] font-bold text-resqnow-primary">
          No mapped incident locations
        </p>

        <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-resqnow-muted">
          Assigned reports without coordinates remain available in Missions.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        fill
          ? 'h-full min-h-0'
          : ''
      }
    >
      <div
        className={`relative ${mapHeightClass} overflow-hidden rounded-2xl border border-resqnow-border-soft bg-[#eaf4f2]`}
        role="group"
        aria-label={ariaLabel}
      >
        {embedUrl && (
          <iframe
            title="OpenStreetMap incident locations"
            src={embedUrl}
            loading="lazy"
            tabIndex={
              interactive
                ? 0
                : -1
            }
            aria-hidden={
              interactive
                ? undefined
                : true
            }
            className={`absolute inset-0 h-full w-full border-0 opacity-95 ${
              interactive
                ? 'pointer-events-auto'
                : 'pointer-events-none'
            }`}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-white/[0.02]" />

        {mapped.map(
          ({
            report,
            lat,
            lng,
          }) => {
            const tone =
              pinTone[
                report.priority
              ] ||
              pinTone.Low;

            const style =
              positionFor(
                {
                  lat,
                  lng,
                },
                bounds
              );

            return (
              <button
                key={report.id}
                type="button"
                onClick={() =>
                  onSelect?.(
                    report
                  )
                }
                style={style}
                className="group absolute z-[20] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                aria-label={`Open ${report.id}, ${report.priority || 'unknown'} priority`}
              >
                <span
                  className={`w-10 h-10 rounded-full border-4 border-white shadow-[0_5px_14px_rgba(31,29,71,.25)] flex items-center justify-center text-white ${tone.pin}`}
                >
                  <MapPin
                    className="w-5 h-5"
                    strokeWidth={2.4}
                  />
                </span>

                <span className="mt-1 inline-flex rounded-lg border border-resqnow-border-soft bg-white/95 px-2 py-1 text-[9px] font-extrabold text-resqnow-primary shadow-sm group-hover:border-resqnow-violet/30">
                  {report.id}
                </span>
              </button>
            );
          }
        )}

        <div className="absolute left-3 top-3 z-[30] rounded-lg border border-resqnow-border-soft bg-white/95 px-2.5 py-1.5 text-[9px] font-bold text-resqnow-secondary shadow-sm">
          Assigned locations
        </div>

        {fill && (
          <div className="absolute bottom-10 left-3 z-[30] rounded-xl border border-resqnow-border-soft bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {[
                'High',
                'Medium',
                'Low',
              ].map(
                (
                  priority
                ) => (
                  <span
                    key={
                      priority
                    }
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-resqnow-muted"
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${pinTone[priority].dot}`}
                    />

                    {
                      pinTone[
                        priority
                      ].label
                    }
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {!fill &&
        showLegend && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
            {[
              'High',
              'Medium',
              'Low',
            ].map(
              (
                priority
              ) => (
                <span
                  key={
                    priority
                  }
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-resqnow-muted"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${pinTone[priority].dot}`}
                  />

                  {
                    pinTone[
                      priority
                    ].label
                  }
                </span>
              )
            )}
          </div>
        )}
    </div>
  );
}