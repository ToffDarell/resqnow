// src/components/common/LocationPicker.jsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Loader2, MapPin, Trash2 } from 'lucide-react';

// Barangay Camunatan, City of Ilagan.
const DEFAULT_CENTER = [17.135891, 121.892464];
const DEFAULT_ZOOM = 16;
const PIN_ZOOM = 18;

// Inline SVG pin: Leaflet's bundled marker images do not resolve under Vite.
const PIN_ICON = L.divIcon({
  className: 'resqnow-pin',
  html: `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17 1C8.2 1 1 8 1 16.7c0 11.4 14.2 25.4 15 26.2.5.5 1.5.5 2 0C18.8 42.1 33 28.1 33 16.7 33 8 25.8 1 17 1z"
            fill="#1F5FA6" stroke="#fff" stroke-width="2"/>
      <circle cx="17" cy="16.5" r="5.5" fill="#fff"/>
    </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 43],
});

function format(value) {
  return `${Number(value).toFixed(6)}`;
}

/**
 * Pin a location on a Leaflet map.
 *
 * value:    { latitude, longitude, focus? } | null (focus: fly the map to it)
 * onChange: called with the new { latitude, longitude }, or null when removed
 *
 * The pin can be placed by tapping the map, dragged to adjust, or set from
 * the device's GPS.
 */
export default function LocationPicker({ value, onChange, labels = {} }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);

  const [status, setStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const text = {
    locate: 'Use my current location',
    locating: 'Finding you…',
    remove: 'Remove pin',
    hint: 'Tap the map to drop a pin, then drag it to your exact home.',
    placed: 'Pin placed. Drag it to adjust.',
    unavailable: 'Location is not available on this device.',
    denied: 'We could not get your location. Tap the map to place the pin instead.',
    ...labels,
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create the map once.
  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: value
        ? [value.latitude, value.longitude]
        : DEFAULT_CENTER,
      zoom: value ? PIN_ZOOM : DEFAULT_ZOOM,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const place = (latlng) => {
      onChangeRef.current?.({
        latitude: Number(latlng.lat.toFixed(7)),
        longitude: Number(latlng.lng.toFixed(7)),
      });
    };

    map.on('click', (event) => place(event.latlng));

    mapRef.current = map;

    // The container may be laid out after mount (grid / lazy).
    const resize = window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      window.clearTimeout(resize);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the marker in sync with the value.
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    if (!value) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const position = [value.latitude, value.longitude];

    if (!markerRef.current) {
      const marker = L.marker(position, {
        icon: PIN_ICON,
        draggable: true,
        keyboard: true,
        title: 'Home location',
      }).addTo(map);

      marker.on('dragend', () => {
        const next = marker.getLatLng();

        onChangeRef.current?.({
          latitude: Number(next.lat.toFixed(7)),
          longitude: Number(next.lng.toFixed(7)),
        });
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(position);
    }

    if (value.focus) {
      // Pin set by something other than the user's own tap/drag
      // (for example a matched address): bring it into view.
      map.flyTo(position, PIN_ZOOM, { duration: 0.8 });
    } else if (!map.getBounds().contains(position)) {
      map.setView(position, Math.max(map.getZoom(), PIN_ZOOM));
    }
  }, [value]);

  function locate() {
    if (!navigator.geolocation) {
      setStatus(text.unavailable);
      return;
    }

    setIsLocating(true);
    setStatus('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);

        const next = {
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
        };

        onChange?.(next);
        mapRef.current?.setView(
          [next.latitude, next.longitude],
          PIN_ZOOM
        );
      },
      () => {
        setIsLocating(false);
        setStatus(text.denied);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
      <div
        ref={containerRef}
        className="h-64 w-full bg-slate-100 sm:h-72"
        role="application"
        aria-label="Map for pinning your home location"
      />

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2.5">
        <button
          type="button"
          onClick={locate}
          disabled={isLocating}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Crosshair className="h-3.5 w-3.5" />
          )}
          {isLocating ? text.locating : text.locate}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange?.(null);
              setStatus('');
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#B42318]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {text.remove}
          </button>
        )}

        <p
          className="ml-auto flex items-center gap-1 text-[11px] text-slate-500"
          aria-live="polite"
        >
          <MapPin className="h-3 w-3 shrink-0" />
          {value
            ? `${format(value.latitude)}, ${format(value.longitude)}`
            : status || text.hint}
        </p>
      </div>

      {value && status && (
        <p className="border-t border-slate-200 px-3 py-2 text-[11px] text-[#B42318]">
          {status}
        </p>
      )}
    </div>
  );
}
