import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Ambulance,
  Building2,
  LifeBuoy,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Route,
  Siren,
  Stethoscope,
  Users,
  Wrench,
} from 'lucide-react';

import { getContactDirectory } from '../../services/contactService';
import {
  getResponderEvacuationCenters,
  getResponderOperations,
} from '../../services/responderService';

const contactCategories = [
  { key: 'barangay', label: 'Barangay Officials', icon: Users },
  { key: 'emergency', label: 'Emergency Services', icon: LifeBuoy },
  { key: 'health', label: 'Health Services', icon: Stethoscope },
  { key: 'community', label: 'Community Services', icon: Building2 },
];

function telHref(number) {
  const cleaned = String(number || '').replace(/[^+\d]/g, '');
  return cleaned ? `tel:${cleaned}` : null;
}

function occupancyText(center) {
  const current = Number(center?.currentOccupancy);
  const capacity = Number(center?.capacity);

  if (!Number.isFinite(current) || !Number.isFinite(capacity) || capacity <= 0) {
    return 'Occupancy not published';
  }

  const percent = Math.max(0, Math.min(100, Math.round((current / capacity) * 100)));
  return `${current} / ${capacity} · ${percent}% occupied`;
}

export default function ResponderContacts() {
  const [directory, setDirectory] = useState(null);
  const [centers, setCenters] = useState([]);
  const [operations, setOperations] = useState(null);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('emergency');
  const evacuationRef = useRef(null);

  async function load() {
    setLoading(true);
    setError('');

    try {
      const [contactResult, evacuationResult, operationsResult] = await Promise.allSettled([
        getContactDirectory(),
        getResponderEvacuationCenters({ limit: 20 }),
        getResponderOperations(),
      ]);
      const messages = [];

      if (contactResult.status === 'fulfilled') {
        setDirectory(contactResult.value.directory);
        setSource(contactResult.value.source);
      } else {
        messages.push(contactResult.reason?.message || 'Unable to load contact directory.');
      }

      if (evacuationResult.status === 'fulfilled') {
        setCenters(evacuationResult.value);
      } else {
        setCenters([]);
        messages.push(evacuationResult.reason?.message || 'Unable to load evacuation-center status.');
      }

      if (operationsResult.status === 'fulfilled') {
        setOperations(operationsResult.value);
      }

      setError(messages[0] || '');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatcher = useMemo(() => {
    const contacts = directory?.contacts || [];
    return (
      contacts.find((contact) => contact.id === 'barangay-emergency-hotline') ||
      contacts.find((contact) => contact.group === 'barangay' && contact.phoneNumbers?.length) ||
      null
    );
  }, [directory]);

  const dispatcherPhone = dispatcher?.phoneNumbers?.[0] || null;
  const dispatcherHref = telHref(dispatcherPhone?.number);

  const groupedContacts = useMemo(() => {
    const contacts = (directory?.contacts || []).filter((contact) => contact.id !== dispatcher?.id);
    return contactCategories.reduce((accumulator, category) => {
      accumulator[category.key] = contacts.filter((contact) => contact.group === category.key);
      return accumulator;
    }, {});
  }, [directory, dispatcher]);

  function scrollToEvacuation() {
    evacuationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="px-4 pt-4 pb-40 min-h-screen space-y-4">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Field coordination</p>
          <h1 className="mt-1 text-[21px] font-extrabold text-resqnow-primary">Contacts & Operational Services</h1>
          <p className="mt-1 text-[10px] leading-relaxed text-resqnow-muted">
            Tactical support actions, dispatcher access, emergency contacts, and published evacuation-center status.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          aria-label="Refresh contacts and centers"
          className="w-11 h-11 rounded-xl border border-resqnow-border-soft bg-white text-resqnow-violet flex items-center justify-center shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </section>

      {error && (
        <div role="status" className="flex items-start gap-2 rounded-2xl border border-resqnow-caution/30 bg-resqnow-caution/10 p-3 text-[10px] text-resqnow-secondary">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-resqnow-caution" />
          <p>{error}</p>
        </div>
      )}

      <section className="rounded-2xl border border-resqnow-critical/20 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-resqnow-critical/10 text-resqnow-critical flex items-center justify-center shrink-0">
            <Siren className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-critical">Emergency command</p>
            <h2 className="mt-1 text-[15px] font-extrabold text-resqnow-primary">
              {dispatcher?.name || 'Barangay Dispatcher / Emergency Hotline'}
            </h2>
            <p className="mt-1 text-[10px] text-resqnow-muted">
              {dispatcherPhone?.displayNumber || dispatcherPhone?.number || 'No dispatcher number published'}
            </p>
            {source === 'saved' && (
              <p className="mt-1 text-[9px] text-resqnow-placeholder">Showing saved directory details while the live directory is unavailable.</p>
            )}
          </div>
        </div>

        {dispatcherHref ? (
          <a
            href={dispatcherHref}
            className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-resqnow-critical px-4 text-[11px] font-extrabold text-white"
          >
            <Phone className="h-4 w-4" /> Call Dispatcher Now
          </a>
        ) : (
          <div className="mt-3 rounded-xl bg-resqnow-canvas p-3 text-center text-[10px] text-resqnow-muted">
            Dispatcher number has not been published.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-sm">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Operational services</p>
          <h2 className="mt-0.5 text-[14px] font-bold text-resqnow-primary">Quick field support</h2>
          <p className="mt-1 text-[9px] leading-relaxed text-resqnow-muted">
            These actions use currently connected ResQNow data. Digital backup/equipment tickets are not claimed until a dispatcher workflow exists.
          </p>
        </div>

        <div className="mt-3 grid gap-2">
          <OperationalServiceCard
            icon={Route}
            title="Evacuation Center Routing"
            description={centers.length ? `${centers.length} published center${centers.length === 1 ? '' : 's'} available for routing.` : 'Review published centers or call the dispatcher for routing instructions.'}
            actionLabel="View Centers"
            onAction={scrollToEvacuation}
          />
          <OperationalServiceCard
            icon={Ambulance}
            title="Request Backup / Medical"
            description="Contact the barangay dispatcher immediately for additional responders, ambulance, police, or medical support."
            actionLabel={dispatcherHref ? 'Call Dispatcher' : 'No Number Published'}
            href={dispatcherHref}
            critical
          />
          <OperationalServiceCard
            icon={Wrench}
            title="Equipment & Assets"
            description={`Current asset: ${operations?.currentAsset || operations?.teamName || 'Not assigned'}. Report damage or replacement needs through the dispatcher.`}
            actionLabel={dispatcherHref ? 'Report by Call' : 'No Number Published'}
            href={dispatcherHref}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-resqnow-violet" />
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Emergency & community contacts</p>
            <h2 className="text-[14px] font-bold text-resqnow-primary">Field contact directory</h2>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {contactCategories.map(({ key, label, icon: Icon }) => {
            const count = groupedContacts[key]?.length || 0;
            const selected = expandedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setExpandedCategory(selected ? '' : key)}
                className={`min-h-[96px] rounded-2xl border p-3 text-left transition-all active:scale-[.99] ${
                  selected
                    ? 'border-resqnow-violet/30 bg-resqnow-violet/5'
                    : 'border-resqnow-border-soft bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[9px] font-bold text-resqnow-placeholder">{count}</span>
                </div>
                <p className="mt-2 text-[11px] font-extrabold leading-snug text-resqnow-primary">{label}</p>
              </button>
            );
          })}
        </div>

        {expandedCategory && (
          <div className="mt-3 space-y-2">
            {(groupedContacts[expandedCategory] || []).length ? (
              groupedContacts[expandedCategory].map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))
            ) : (
              <div className="rounded-xl bg-resqnow-canvas px-3 py-4 text-center text-[10px] text-resqnow-muted">
                No published contacts in this category.
              </div>
            )}
          </div>
        )}
      </section>

      <section ref={evacuationRef} className="scroll-mt-24 rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-resqnow-violet" />
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Evacuation centers</p>
            <h2 className="text-[14px] font-bold text-resqnow-primary">Published operational status</h2>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {loading && !centers.length ? (
            <div className="h-28 animate-pulse rounded-xl bg-resqnow-canvas" />
          ) : centers.length ? (
            centers.map((center) => <EvacuationCenterCard key={center.id} center={center} />)
          ) : (
            <div className="rounded-xl bg-resqnow-canvas px-4 py-6 text-center">
              <MapPin className="mx-auto h-6 w-6 text-resqnow-placeholder" />
              <p className="mt-2 text-[12px] font-bold text-resqnow-primary">No operational center published</p>
              <p className="mt-1 text-[10px] leading-relaxed text-resqnow-muted">
                ResQNow will not invent an evacuation destination. Call the dispatcher for routing instructions.
              </p>
            </div>
          )}
        </div>
      </section>

      {dispatcherHref && (
        <div className="fixed left-0 right-0 bottom-[92px] z-40 px-4 pointer-events-none">
          <a
            href={dispatcherHref}
            className="pointer-events-auto mx-auto flex min-h-[54px] max-w-lg items-center justify-center gap-2 rounded-2xl bg-resqnow-critical px-4 text-[13px] font-extrabold text-white shadow-[0_10px_28px_rgba(217,45,32,.28)]"
          >
            <Phone className="h-5 w-5" />
            Call Barangay Dispatcher
          </a>
        </div>
      )}
    </div>
  );
}

function OperationalServiceCard({ icon: Icon, title, description, actionLabel, onAction, href, critical = false }) {
  const actionClass = critical
    ? 'bg-resqnow-critical text-white'
    : 'bg-resqnow-violet/8 text-resqnow-violet';

  return (
    <div className="rounded-2xl border border-resqnow-border-soft bg-resqnow-canvas p-3.5">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${critical ? 'bg-resqnow-critical/10 text-resqnow-critical' : 'bg-resqnow-violet/10 text-resqnow-violet'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold text-resqnow-primary">{title}</p>
          <p className="mt-1 text-[9px] leading-relaxed text-resqnow-muted">{description}</p>
        </div>
      </div>

      {href ? (
        <a href={href} className={`mt-3 min-h-[42px] rounded-xl px-3 text-[10px] font-extrabold flex items-center justify-center gap-2 ${actionClass}`}>
          <Phone className="h-4 w-4" /> {actionLabel}
        </a>
      ) : onAction ? (
        <button type="button" onClick={onAction} className={`mt-3 min-h-[42px] w-full rounded-xl px-3 text-[10px] font-extrabold ${actionClass}`}>
          {actionLabel}
        </button>
      ) : (
        <button disabled className="mt-3 min-h-[42px] w-full rounded-xl bg-resqnow-border-soft px-3 text-[10px] font-bold text-resqnow-placeholder">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ContactRow({ contact }) {
  const phone = contact.phoneNumbers?.find((item) => telHref(item.number)) || contact.phoneNumbers?.[0];
  const href = telHref(phone?.number);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-resqnow-canvas p-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-resqnow-primary">{contact.name}</p>
        <p className="mt-0.5 text-[9px] text-resqnow-muted">
          {contact.role || contact.category || phone?.displayNumber || phone?.number || 'Contact details not published'}
        </p>
        {phone && <p className="mt-1 text-[9px] font-semibold text-resqnow-secondary">{phone.displayNumber || phone.number}</p>}
      </div>
      {href && (
        <a
          href={href}
          aria-label={`Call ${contact.name}`}
          className="w-10 h-10 rounded-xl bg-white border border-resqnow-violet/20 text-resqnow-violet flex items-center justify-center shrink-0"
        >
          <Phone className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function EvacuationCenterCard({ center }) {
  const call = telHref(center.contactNumber);
  const status = String(center.status || 'standby').toUpperCase();
  const statusClass =
    center.status === 'open'
      ? 'bg-resqnow-safe/10 text-resqnow-safe'
      : center.status === 'full' || center.status === 'closed'
      ? 'bg-resqnow-critical/10 text-resqnow-critical'
      : 'bg-resqnow-caution/15 text-resqnow-caution';

  return (
    <div className="rounded-xl border border-resqnow-border-soft bg-white p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-extrabold text-resqnow-primary">{center.name}</p>
          <p className="mt-1 text-[10px] text-resqnow-muted">{center.address}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-[8px] font-extrabold ${statusClass}`}>{status}</span>
      </div>

      <p className="mt-2 text-[10px] font-semibold text-resqnow-secondary">{occupancyText(center)}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {center.directionsUrl ? (
          <a
            href={center.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[42px] rounded-xl bg-resqnow-violet/8 text-resqnow-violet text-[10px] font-bold flex items-center justify-center gap-1.5"
          >
            <Navigation className="h-4 w-4" /> Navigate
          </a>
        ) : (
          <button disabled className="min-h-[42px] rounded-xl bg-resqnow-canvas text-resqnow-placeholder text-[10px] font-bold">No coordinates</button>
        )}
        {call ? (
          <a href={call} className="min-h-[42px] rounded-xl border border-resqnow-violet/20 text-resqnow-violet text-[10px] font-bold flex items-center justify-center gap-1.5">
            <Phone className="h-4 w-4" /> Call Center
          </a>
        ) : (
          <button disabled className="min-h-[42px] rounded-xl border border-resqnow-border-soft text-resqnow-placeholder text-[10px] font-bold">No phone</button>
        )}
      </div>
    </div>
  );
}
