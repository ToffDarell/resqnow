// src/components/resident/EmergencyContacts.jsx

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
  HeartPulse,
  Info,
  LifeBuoy,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Shield,
  Stethoscope,
  Users,
  Wrench,
} from 'lucide-react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getContactDirectory } from '../../services/contactService';

const focusClass =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-resqnow-violet focus-visible:ring-offset-2';

const categoryConfig = {
  barangay: {
    title: 'Barangay Officials',
    icon: Users,
  },
  emergency: {
    title: 'Emergency Services',
    icon: LifeBuoy,
  },
  health: {
    title: 'Health Services',
    icon: Stethoscope,
  },
  community: {
    title: 'Community Services',
    icon: Building2,
  },
};

function phoneHref(number) {
  if (typeof number !== 'string') {
    return null;
  }

  const cleaned = number.replace(/[\s().-]/g, '');

  if (/^09\d{9}$/.test(cleaned)) {
    return `tel:+63${cleaned.slice(1)}`;
  }

  if (/^0\d{9,10}$/.test(cleaned)) {
    return `tel:+63${cleaned.slice(1)}`;
  }

  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
    return `tel:${cleaned}`;
  }

  if (/^\d{3,6}$/.test(cleaned)) {
    return `tel:${cleaned}`;
  }

  return null;
}

function safeExternalUrl(value, type = 'website') {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    const url = new URL(value);

    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password
    ) {
      return null;
    }

    const host = url.hostname.toLowerCase();

    if (
      type === 'facebook' &&
      host !== 'facebook.com' &&
      !host.endsWith('.facebook.com')
    ) {
      return null;
    }

    if (
      type === 'messenger' &&
      ![
        'm.me',
        'messenger.com',
        'www.messenger.com',
      ].includes(host)
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function mapsUrl(contact) {
  if (!contact?.address) {
    return null;
  }

  const query = encodeURIComponent(
    `${contact.name}, ${contact.address}`
  );

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getContactIcon(contact) {
  switch (contact?.category) {
    case 'Fire':
      return Flame;

    case 'Police':
      return Shield;

    case 'Medical':
      return HeartPulse;

    case 'Rescue':
      return LifeBuoy;

    case 'Maintenance':
      return Wrench;

    default:
      return Building2;
  }
}

function ExternalAction({
  href,
  icon: Icon,
  children,
}) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-resqnow-border-soft bg-white px-3 py-2.5 text-[11px] font-semibold text-resqnow-violet hover:bg-resqnow-canvas active:scale-[0.99] transition-all ${focusClass}`}
    >
      <Icon
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      />

      <span>{children}</span>

      <ExternalLink
        className="w-3.5 h-3.5 shrink-0"
        aria-hidden="true"
      />
    </a>
  );
}

function CategoryCard({
  icon: Icon,
  title,
  count,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[104px] rounded-2xl border border-resqnow-border-soft bg-white p-3.5 text-left hover:border-resqnow-violet/30 hover:bg-resqnow-canvas active:scale-[0.99] transition-all ${focusClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 flex items-center justify-center">
          <Icon
            className="w-4.5 h-4.5 text-resqnow-violet"
            aria-hidden="true"
          />
        </div>

        <span className="text-[10px] font-semibold text-resqnow-muted">
          {count}
        </span>
      </div>

      <p className="mt-3 text-[12px] font-bold leading-snug text-resqnow-primary">
        {title}
      </p>

    </button>
  );
}

function ContactListItem({
  contact,
  onClick,
  showAddress = false,
}) {
  const Icon = getContactIcon(contact);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[68px] flex items-center gap-3 rounded-xl border border-resqnow-border-soft bg-white px-3 py-2.5 text-left hover:bg-resqnow-canvas active:scale-[0.995] transition-all ${focusClass}`}
    >
      <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 flex items-center justify-center shrink-0">
        <Icon
          className="w-4 h-4 text-resqnow-violet"
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-resqnow-primary leading-snug">
          {contact.name}
        </p>

        {(contact.role || contact.category) && (
          <p className="mt-0.5 text-[9px] text-resqnow-muted line-clamp-1">
            {contact.role || contact.category}
          </p>
        )}

        {showAddress && contact.address && (
          <p className="mt-1 text-[9px] text-resqnow-secondary line-clamp-1">
            {contact.address}
          </p>
        )}
      </div>

      <ChevronRight
        className="w-4 h-4 text-resqnow-muted shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}

function ContactDetail({
  contact,
  onBack,
}) {
  const Icon = getContactIcon(contact);

  const callablePhones =
    Array.isArray(contact?.phoneNumbers)
      ? contact.phoneNumbers.filter((phone) =>
          phoneHref(phone?.number)
        )
      : [];

  const facebookUrl =
    safeExternalUrl(
      contact?.facebookUrl,
      'facebook'
    );

  const messengerUrl =
    safeExternalUrl(
      contact?.messengerUrl,
      'messenger'
    );

  const websiteUrl =
    safeExternalUrl(
      contact?.websiteUrl
    );

  const mapUrl =
    mapsUrl(contact);

  const validEmail =
    typeof contact?.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      contact.email
    );

  return (
    <div className="min-h-screen px-4 pt-4 pb-32">
      <button
        type="button"
        onClick={onBack}
        className={`min-h-[40px] inline-flex items-center gap-1.5 text-[11px] font-semibold text-resqnow-violet ${focusClass}`}
      >
        <ArrowLeft
          className="w-4 h-4"
          aria-hidden="true"
        />

        Back to list
      </button>

      <section className="mt-2 rounded-2xl border border-resqnow-border-soft bg-white overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-resqnow-violet/10 flex items-center justify-center shrink-0">
              <Icon
                className="w-5 h-5 text-resqnow-violet"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-snug text-resqnow-primary">
                {contact.name}
              </p>

              {(contact.role ||
                contact.category) && (
                <p className="mt-1 text-[10px] leading-relaxed text-resqnow-muted">
                  {contact.role ||
                    contact.category}
                </p>
              )}
            </div>
          </div>

          {contact.address && (
            <div className="mt-4 pt-4 border-t border-resqnow-border-soft">
              <p className="text-[9px] font-bold uppercase tracking-wide text-resqnow-muted">
                Address
              </p>

              <div className="mt-1.5 flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 text-resqnow-violet shrink-0 mt-0.5"
                  aria-hidden="true"
                />

                <p className="text-[11px] leading-relaxed text-resqnow-secondary">
                  {contact.address}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-resqnow-border-soft">
            <p className="text-[9px] font-bold uppercase tracking-wide text-resqnow-muted">
              Contact numbers
            </p>

            {callablePhones.length > 0 ? (
              <div className="mt-2 space-y-2">
                {callablePhones.map(
                  (phone) => (
                    <a
                      key={
                        phone.id ||
                        `${phone.label}-${phone.number}`
                      }
                      href={phoneHref(
                        phone.number
                      )}
                      className={`min-h-[52px] flex items-center gap-3 rounded-xl border border-resqnow-border-soft bg-resqnow-canvas px-3 py-2.5 hover:border-resqnow-violet/30 active:scale-[0.99] transition-all ${focusClass}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <Phone
                          className="w-4 h-4 text-resqnow-violet"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-resqnow-muted">
                          {phone.label ||
                            'Phone'}
                        </p>

                        <p className="mt-0.5 text-[12px] font-bold text-resqnow-primary break-words">
                          {phone.displayNumber ||
                            phone.number}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold text-resqnow-violet">
                        Call
                      </span>
                    </a>
                  )
                )}
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-resqnow-muted">
                Contact number not yet provided.
              </p>
            )}
          </div>

          {(facebookUrl ||
            messengerUrl ||
            websiteUrl ||
            mapUrl ||
            validEmail) && (
            <div className="mt-4 pt-4 border-t border-resqnow-border-soft">
              <p className="text-[9px] font-bold uppercase tracking-wide text-resqnow-muted">
                Other options
              </p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <ExternalAction
                  href={facebookUrl}
                  icon={Globe}
                >
                  Facebook
                </ExternalAction>

                <ExternalAction
                  href={messengerUrl}
                  icon={MessageCircle}
                >
                  Messenger
                </ExternalAction>

                <ExternalAction
                  href={websiteUrl}
                  icon={Globe}
                >
                  Website
                </ExternalAction>

                <ExternalAction
                  href={mapUrl}
                  icon={MapPin}
                >
                  Google Maps
                </ExternalAction>

                {validEmail && (
                  <a
                    href={`mailto:${contact.email}`}
                    className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-resqnow-border-soft bg-white px-3 py-2.5 text-[11px] font-semibold text-resqnow-violet hover:bg-resqnow-canvas active:scale-[0.99] transition-all ${focusClass}`}
                  >
                    Email
                  </a>
                )}
              </div>
            </div>
          )}

          {contact.notes && (
            <div className="mt-4 pt-4 border-t border-resqnow-border-soft">
              <p className="text-[9px] font-bold uppercase tracking-wide text-resqnow-muted">
                Notes
              </p>

              <p className="mt-1.5 text-[10px] leading-relaxed text-resqnow-secondary">
                {contact.notes}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ContactListView({
  title,
  subtitle,
  contacts,
  onBack,
  onSelect,
  showAddress = false,
}) {
  return (
    <div className="min-h-screen px-4 pt-4 pb-32">
      <button
        type="button"
        onClick={onBack}
        className={`min-h-[40px] inline-flex items-center gap-1.5 text-[11px] font-semibold text-resqnow-violet ${focusClass}`}
      >
        <ArrowLeft
          className="w-4 h-4"
          aria-hidden="true"
        />

        All categories
      </button>

      <div className="mt-2 mb-3">
        <h1 className="text-lg font-bold text-resqnow-primary">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-[11px] leading-relaxed text-resqnow-muted">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {contacts.map((contact) => (
          <ContactListItem
            key={contact.id}
            contact={contact}
            showAddress={showAddress}
            onClick={() =>
              onSelect(contact)
            }
          />
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="rounded-2xl border border-resqnow-border-soft bg-white p-5 text-center">
          <p className="text-[12px] text-resqnow-muted">
            No contacts are currently available in this category.
          </p>
        </div>
      )}
    </div>
  );
}


const MAP_CACHE_PREFIX = 'resqnow_contact_map_v1';
const GEOCODE_DELAY_MS = 1100;

// Verified Camunatan Barangay Hall coordinate.
// This guarantees the map can render immediately even while service
// addresses are still being located in the background.
const CAMUNATAN_BARANGAY_HALL = {
  lat: 17.135891,
  lng: 121.892464,
};

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function mapPinLabel(point) {
  if (point.isBarangay) return 'B';
  if (point.contact?.group === 'emergency') return 'E';
  if (point.contact?.group === 'health') return 'H';
  if (point.contact?.group === 'community') return 'C';
  return 'S';
}

function createMapPin(point) {
  const label = mapPinLabel(point);

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:30px;
        height:30px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:#8346F2;
        border:3px solid #ffffff;
        box-shadow:0 3px 10px rgba(31,29,71,0.22);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <span style="
          transform:rotate(45deg);
          color:#ffffff;
          font-size:10px;
          line-height:1;
          font-weight:800;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        ">${label}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

function coordinateCacheKey(candidate) {
  return `${MAP_CACHE_PREFIX}:${candidate.id}`;
}

function readCachedCoordinate(candidate) {
  try {
    const raw = localStorage.getItem(
      coordinateCacheKey(candidate)
    );

    if (!raw) return null;

    const cached = JSON.parse(raw);

    if (
      cached?.query !== candidate.query ||
      !Number.isFinite(cached?.lat) ||
      !Number.isFinite(cached?.lng)
    ) {
      return null;
    }

    return {
      ...candidate,
      lat: cached.lat,
      lng: cached.lng,
    };
  } catch {
    return null;
  }
}

function saveCachedCoordinate(candidate, lat, lng) {
  try {
    localStorage.setItem(
      coordinateCacheKey(candidate),
      JSON.stringify({
        query: candidate.query,
        lat,
        lng,
      })
    );
  } catch {
    // Local storage is optional. The map still works without caching.
  }
}

async function geocodeCandidate(candidate) {
  if (
    Number.isFinite(candidate?.lat) &&
    Number.isFinite(candidate?.lng)
  ) {
    return {
      point: candidate,
      usedNetwork: false,
    };
  }

  const cached = readCachedCoordinate(candidate);

  if (cached) {
    return {
      point: cached,
      usedNetwork: false,
    };
  }

  const url = new URL(
    'https://nominatim.openstreetmap.org/search'
  );

  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'ph');
  url.searchParams.set('q', candidate.query);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Location lookup failed.');
  }

  const results = await response.json();
  const first = results?.[0];

  if (!first) {
    return {
      point: null,
      usedNetwork: true,
    };
  }

  const lat = Number(first.lat);
  const lng = Number(first.lon);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return {
      point: null,
      usedNetwork: true,
    };
  }

  saveCachedCoordinate(candidate, lat, lng);

  return {
    point: {
      ...candidate,
      lat,
      lng,
    },
    usedNetwork: true,
  };
}

function ContactDirectoryMap({
  barangayName,
  locations,
  onSelectContact,
}) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [mapError, setMapError] = useState('');

  const candidates = useMemo(() => {
    const barangayLabel =
      barangayName || 'Barangay Camunatan';

    const barangayPoint = {
      id: 'barangay-camunatan-map',
      name: barangayLabel,
      address: `${barangayLabel}, City of Ilagan, Isabela, Philippines`,
      query: `${barangayLabel}, City of Ilagan, Isabela, Philippines`,
      lat: CAMUNATAN_BARANGAY_HALL.lat,
      lng: CAMUNATAN_BARANGAY_HALL.lng,
      isBarangay: true,
      contact: null,
    };

    const servicePoints = locations.map((contact) => ({
      id: contact.id,
      name: contact.name,
      address: contact.address,
      query: `${contact.name}, ${contact.address}, Philippines`,
      isBarangay: false,
      contact,
    }));

    return [barangayPoint, ...servicePoints];
  }, [barangayName, locations]);

  useEffect(() => {
    let cancelled = false;

    async function locateContacts() {
      setIsLocating(true);
      setMapError('');
      setPoints([]);
      setSelectedPoint(null);

      let foundCount = 0;

      for (const candidate of candidates) {
        if (cancelled) return;

        try {
          const {
            point,
            usedNetwork,
          } = await geocodeCandidate(candidate);

          if (cancelled) return;

          if (point) {
            foundCount += 1;

            setPoints((current) => {
              if (
                current.some(
                  (item) => item.id === point.id
                )
              ) {
                return current;
              }

              return [...current, point];
            });
          }

          if (usedNetwork) {
            await wait(GEOCODE_DELAY_MS);
          }
        } catch {
          if (cancelled) return;
        }
      }

      if (cancelled) return;

      if (foundCount === 0) {
        setMapError(
          'Map locations could not be loaded. Contact details are still available in the categories above.'
        );
      }

      setIsLocating(false);
    }

    locateContacts();

    return () => {
      cancelled = true;
    };
  }, [candidates]);

  useEffect(() => {
    if (!mapElementRef.current) {
      return undefined;
    }

    if (!mapInstanceRef.current) {
      const firstPoint =
        points[0] || {
          lat: CAMUNATAN_BARANGAY_HALL.lat,
          lng: CAMUNATAN_BARANGAY_HALL.lng,
        };

      const map = L.map(mapElementRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
      }).setView(
        [firstPoint.lat, firstPoint.lng],
        15
      );

      const tiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; OpenStreetMap contributors',
        }
      );

      tiles.on('tileerror', () => {
        setMapError(
          'Map tiles could not be loaded. Check the internet connection.'
        );
      });

      tiles.addTo(map);

      L.control
        .zoom({
          position: 'bottomright',
        })
        .addTo(map);

      markerLayerRef.current =
        L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markerLayer = markerLayerRef.current;

    markerLayer.clearLayers();

    const bounds = [];

    points.forEach((point) => {
      const marker = L.marker(
        [point.lat, point.lng],
        {
          icon: createMapPin(point),
          title: point.name,
        }
      );

      marker.bindTooltip(point.name, {
        direction: 'top',
        offset: [0, -24],
      });

      marker.on('click', () => {
        setSelectedPoint(point);
      });

      marker.addTo(markerLayer);
      bounds.push([point.lat, point.lng]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 15);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, {
        padding: [28, 28],
        maxZoom: 15,
      });
    }

    window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return undefined;
  }, [points]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerLayerRef.current = null;
      }
    };
  }, []);

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-resqnow-border-soft bg-white">
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-resqnow-border-soft">
        <MapPin
          className="w-4 h-4 text-resqnow-violet"
          aria-hidden="true"
        />

        <h2 className="text-[13px] font-bold text-resqnow-primary">
          Service Map
        </h2>
      </div>

      <div className="relative h-56 bg-resqnow-canvas">
        <div
          ref={mapElementRef}
          className="absolute inset-0 z-0"
          aria-label="Map of barangay and service locations"
        />

        {isLocating && (
          <div className="absolute right-2 top-2 z-[500] flex items-center gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 shadow-sm">
            <Loader2
              className="w-3.5 h-3.5 animate-spin text-resqnow-violet"
              aria-hidden="true"
            />

            <span className="text-[9px] font-medium text-resqnow-muted">
              Loading pins
            </span>
          </div>
        )}
      </div>

      {(selectedPoint || mapError) && (
        <div className="px-3.5 py-3">
        {selectedPoint && (
          <div className="rounded-xl border border-resqnow-border-soft bg-resqnow-canvas p-3">
            <p className="text-[11px] font-bold text-resqnow-primary">
              {selectedPoint.name}
            </p>

            <p className="mt-1 text-[9px] leading-relaxed text-resqnow-muted">
              {selectedPoint.address}
            </p>

            {selectedPoint.contact && (
              <button
                type="button"
                onClick={() =>
                  onSelectContact(
                    selectedPoint.contact
                  )
                }
                className={`mt-2 min-h-[40px] px-3 rounded-lg text-[10px] font-bold text-resqnow-violet hover:bg-white transition-colors ${focusClass}`}
              >
                View contact details
              </button>
            )}
          </div>
        )}

        {mapError && (
          <div className={`${selectedPoint ? 'mt-3' : ''} flex items-start gap-2 rounded-xl border border-resqnow-border-soft bg-resqnow-canvas px-3 py-2.5`}>
            <Info
              className="w-4 h-4 shrink-0 text-resqnow-muted mt-0.5"
              aria-hidden="true"
            />

            <p className="text-[9px] leading-relaxed text-resqnow-muted">
              {mapError}
            </p>
          </div>
        )}
        </div>
      )}
    </section>
  );
}

export default function EmergencyContacts() {
  const [
    directory,
    setDirectory,
  ] = useState(null);

  const [
    source,
    setSource,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    retry,
    setRetry,
  ] = useState(0);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(null);

  const [
    selectedContact,
    setSelectedContact,
  ] = useState(null);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError('');

    getContactDirectory()
      .then((result) => {
        if (ignore) {
          return;
        }

        setDirectory(
          result.directory
        );

        setSource(
          result.source
        );
      })
      .catch(() => {
        if (ignore) {
          return;
        }

        setDirectory(null);

        setError(
          'Unable to access contacts. Please check your connection and try again.'
        );
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [retry]);

  const hotline =
    useMemo(() => {
      if (!directory?.contacts) {
        return null;
      }

      return (
        directory.contacts.find(
          (contact) =>
            contact.id ===
            'barangay-emergency-hotline'
        ) || null
      );
    }, [directory]);

  const personnel =
    useMemo(() => {
      if (!directory?.contacts) {
        return [];
      }

      return directory.contacts.filter(
        (contact) =>
          contact.group ===
            'barangay' &&
          contact.id !==
            hotline?.id
      );
    }, [
      directory,
      hotline,
    ]);

  const agencies =
    useMemo(() => {
      if (!directory?.contacts) {
        return [];
      }

      return directory.contacts.filter(
        (contact) =>
          contact.group !==
          'barangay'
      );
    }, [directory]);

  const emergencyContacts =
    useMemo(
      () =>
        agencies.filter(
          (contact) =>
            contact.group ===
            'emergency'
        ),
      [agencies]
    );

  const healthContacts =
    useMemo(
      () =>
        agencies.filter(
          (contact) =>
            contact.group ===
            'health'
        ),
      [agencies]
    );

  const communityContacts =
    useMemo(
      () =>
        agencies.filter(
          (contact) =>
            contact.group ===
            'community'
        ),
      [agencies]
    );

  const serviceLocations =
    useMemo(
      () =>
        agencies.filter(
          (contact) =>
            Boolean(
              contact.address
            )
        ),
      [agencies]
    );

  const primaryPhone =
    hotline?.phoneNumbers?.find(
      (phone) =>
        phoneHref(phone.number)
    ) || null;

  if (!directory) {
    return (
      <div className="min-h-screen px-4 pt-4 pb-28">
        <h1 className="text-lg font-bold text-resqnow-primary">
          Emergency & Community Contacts
        </h1>

        <div
          className="mt-4 rounded-2xl border border-resqnow-border-soft bg-white p-5"
          role="status"
        >
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-resqnow-muted">
              <Loader2
                className="w-4 h-4 animate-spin"
                aria-hidden="true"
              />

              Loading contacts...
            </p>
          ) : (
            <>
              <p className="text-sm text-resqnow-secondary">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setRetry(
                    (value) =>
                      value + 1
                  )
                }
                className={`mt-3 min-h-[44px] rounded-xl bg-resqnow-violet px-4 text-sm font-semibold text-white ${focusClass}`}
              >
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (selectedContact) {
    return (
      <ContactDetail
        contact={
          selectedContact
        }
        onBack={() =>
          setSelectedContact(null)
        }
      />
    );
  }

  if (activeCategory) {
    const config =
      categoryConfig[
        activeCategory
      ];

    const contactsByCategory = {
      barangay: personnel,
      emergency:
        emergencyContacts,
      health: healthContacts,
      community:
        communityContacts,
    };

    return (
      <ContactListView
        title={
          config.title
        }
        subtitle={
          config.description
        }
        contacts={
          contactsByCategory[
            activeCategory
          ] || []
        }
        onBack={() =>
          setActiveCategory(null)
        }
        onSelect={
          setSelectedContact
        }
      />
    );
  }

  return (
    <div className="min-h-screen px-4 pt-4 pb-32">
      <div className="mb-3">
        <h1 className="text-lg font-bold leading-snug text-resqnow-primary">
          Emergency & Community Contacts
        </h1>

      </div>

      {/* Barangay hotline */}
      <section className="mb-4 rounded-2xl bg-brand-gradient p-4 text-white shadow-[0_8px_20px_rgba(131,70,242,0.18)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Building2
              className="w-5 h-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide">
              Barangay Hotline
            </p>

            <p className="mt-0.5 text-[13px] font-bold">
              {
                directory.meta
                  .barangayName
              }
            </p>

            <p className="mt-0.5 text-lg font-bold tracking-wide">
              {primaryPhone?.displayNumber ||
                'Number not yet provided'}
            </p>
          </div>
        </div>

        {primaryPhone && (
          <a
            href={phoneHref(
              primaryPhone.number
            )}
            className={`mt-3 min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[12px] font-bold text-resqnow-violet active:scale-[0.99] transition-all ${focusClass}`}
          >
            <Phone
              className="w-4 h-4"
              aria-hidden="true"
            />

            Call Barangay Hotline
          </a>
        )}
      </section>

      {source === 'saved' && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl border border-resqnow-border-soft bg-white px-3 py-2"
        >
          <Info
            className="w-4 h-4 shrink-0 text-resqnow-muted"
            aria-hidden="true"
          />

          <p className="flex-1 text-[10px] leading-relaxed text-resqnow-muted">
            Showing saved contact details. Refresh when connected for the latest directory.
          </p>

          <button
            type="button"
            disabled={
              loading
            }
            onClick={() =>
              setRetry(
                (value) =>
                  value + 1
              )
            }
            aria-label="Refresh contact directory"
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-resqnow-violet disabled:opacity-50 ${focusClass}`}
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {/* Contact categories */}
      <section>
        <div className="mb-2.5">
          <h2 className="text-[14px] font-bold text-resqnow-primary">
            Contact Categories
          </h2>

        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <CategoryCard
            icon={
              categoryConfig
                .barangay.icon
            }
            title={
              categoryConfig
                .barangay.title
            }
            count={
              personnel.length
            }
            onClick={() =>
              setActiveCategory(
                'barangay'
              )
            }
          />

          <CategoryCard
            icon={
              categoryConfig
                .emergency.icon
            }
            title={
              categoryConfig
                .emergency.title
            }
            count={
              emergencyContacts.length
            }
            onClick={() =>
              setActiveCategory(
                'emergency'
              )
            }
          />

          <CategoryCard
            icon={
              categoryConfig
                .health.icon
            }
            title={
              categoryConfig
                .health.title
            }
            description={
              categoryConfig
                .health.description
            }
            count={
              healthContacts.length
            }
            onClick={() =>
              setActiveCategory(
                'health'
              )
            }
          />

          <CategoryCard
            icon={
              categoryConfig
                .community.icon
            }
            title={
              categoryConfig
                .community.title
            }
            count={
              communityContacts.length
            }
            onClick={() =>
              setActiveCategory(
                'community'
              )
            }
          />
        </div>
      </section>

      {/* Display map with geocoded service pins */}
      <ContactDirectoryMap
        barangayName={
          directory.meta.barangayName
        }
        locations={
          serviceLocations
        }
        onSelectContact={
          setSelectedContact
        }
      />

      {/* Directory source */}
      <div className="mt-5 text-[9px] leading-relaxed text-resqnow-muted">
        <p>
          Barangay details supplied by the project team. City contact information follows the available directory data.
        </p>

        {safeExternalUrl(
          directory.meta
            .citySourceUrl
        ) && (
          <a
            href={safeExternalUrl(
              directory.meta
                .citySourceUrl
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-1 inline-flex min-h-[40px] items-center gap-1 font-semibold text-resqnow-violet underline ${focusClass}`}
          >
            View City of Ilagan contact directory

            <ExternalLink
              className="w-3 h-3"
              aria-hidden="true"
            />
          </a>
        )}
      </div>
    </div>
  );
}
