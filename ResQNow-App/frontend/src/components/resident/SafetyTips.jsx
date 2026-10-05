// src/components/resident/SafetyTips.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ShieldCheck,
  HeartPulse,
  Flame,
  Stethoscope,
  ShieldAlert,
  Waves,
  Car,
  Tent,
  Users,
  HandHeart,
  TreePine,
  Wrench,
  Broom,
  CircleHelp,
} from 'lucide-react';

import { safetyTips } from '../../data/mockData';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const SAFETY_CACHE_KEY = 'resqnow_safety_guides_cache_v1';

// ============ TIP ICONS ============
// Map each safety tip ID to an icon
const iconMap = {
  'life-death': HeartPulse,
  fire: Flame,
  medical: Stethoscope,
  violence: ShieldAlert,
  flood: Waves,
  accident: Car,
  evacuation: Tent,
  'evac-assistance': Tent,
  'bhw-assistance': HandHeart,
  'road-obstruction': TreePine,
  'damaged-facility': Wrench,
  cleanup: Broom,
  'community-concern': Users,
  'other-assistance': CircleHelp,
};

// ============ SAFETY TIPS ============
// Quick safety guides for emergencies and barangay concerns
export default function SafetyTips() {
  const isOnline = useOnlineStatus();

  const guides = useMemo(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(SAFETY_CACHE_KEY) || 'null');
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch {
      // Fall back to bundled guides.
    }
    return safetyTips;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAFETY_CACHE_KEY, JSON.stringify(safetyTips));
    } catch {
      // Local caching is best-effort.
    }
  }, []);

  // Currently opened safety guide
  const [openId, setOpenId] = useState(null);

  // Toggle a safety tip open or closed
  const toggle = (id) => {
    setOpenId((prev) =>
      prev === id ? null : id
    );
  };

  return (
    <div className="min-h-screen">

      <main className="max-w-lg mx-auto px-4 pt-5 pb-28">

        {/* ============ INTRO BANNER ============ */}
        <div className="bg-brand-gradient rounded-2xl p-4 mb-5 text-white flex items-start gap-3 shadow-[0_6px_18px_rgba(131,70,242,0.18)]">

          {/* Safety icon */}
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Stay informed. Stay safe.
            </p>

            <p className="text-[12px] text-white/90 leading-relaxed mt-0.5">
              These quick guides help you respond correctly to emergencies and community concerns covered by ResQNow.
            </p>
          </div>
        </div>

        {!isOnline && (
          <div className="mb-4 rounded-xl border border-resqnow-pending/25 bg-resqnow-pending/10 px-3.5 py-3">
            <p className="text-[11px] font-bold text-resqnow-primary">Offline safety access</p>
            <p className="text-[10px] text-resqnow-secondary mt-0.5">These saved guides remain available while live services are offline.</p>
          </div>
        )}

        {/* ============ TIP GROUPS ============ */}
        {guides.map((group) => {
          const isEmergency =
            group.category === 'Emergency Safety';

          return (
            <section
              key={group.category}
              className="mb-6"
            >
              {/* Group heading */}
              <div className="flex items-center gap-2 mb-2 px-1">

                <span
                  className={`w-2 h-2 rounded-full ${
                    isEmergency
                      ? 'bg-resqnow-critical'
                      : 'bg-resqnow-info'
                  }`}
                />

                <h2
                  className={`text-[11px] font-bold uppercase tracking-widest ${
                    isEmergency
                      ? 'text-resqnow-critical'
                      : 'text-resqnow-info'
                  }`}
                >
                  {group.category}
                </h2>
              </div>

              {/* Tip list */}
              <div className="bg-white rounded-2xl border border-resqnow-border-soft divide-y divide-resqnow-border-soft overflow-hidden">

                {group.items.map((item) => {
                  const Icon =
                    iconMap[item.id] ||
                    ShieldCheck;

                  const isOpen =
                    openId === item.id;

                  return (
                    <div key={item.id}>

                      {/* ============ TIP BUTTON ============ */}
                      <button
                        type="button"
                        onClick={() =>
                          toggle(item.id)
                        }
                        aria-expanded={isOpen}
                        className={`w-full min-h-[60px] flex items-center gap-3 px-4 py-3.5 text-left active:scale-[0.995] transition-all ${
                          isOpen
                            ? isEmergency
                              ? 'bg-resqnow-critical/5'
                              : 'bg-resqnow-info/5'
                            : 'hover:bg-resqnow-canvas'
                        }`}
                      >
                        {/* Tip icon */}
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isEmergency
                              ? 'bg-resqnow-critical/10'
                              : 'bg-resqnow-info/10'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              isEmergency
                                ? 'text-resqnow-critical'
                                : 'text-resqnow-info'
                            }`}
                          />
                        </div>

                        {/* Tip title */}
                        <div className="flex-1 min-w-0">

                          <p className="text-[13px] font-semibold text-resqnow-primary">
                            {item.title}
                          </p>

                          <p className="text-[11px] text-resqnow-muted mt-0.5">
                            {item.tips.length}{' '}
                            {item.tips.length === 1
                              ? 'reminder'
                              : 'reminders'}
                          </p>
                        </div>

                        {/* Accordion arrow */}
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                            isOpen
                              ? isEmergency
                                ? 'rotate-180 text-resqnow-critical'
                                : 'rotate-180 text-resqnow-info'
                              : 'text-resqnow-muted'
                          }`}
                        />
                      </button>

                      {/* ============ TIP CONTENT ============ */}
                      {isOpen && (
                        <ul className="px-4 pb-4 pt-1 space-y-2 bg-resqnow-canvas/70">

                          {item.tips.map(
                            (tip, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2.5 text-[12px] text-resqnow-secondary leading-relaxed"
                              >
                                {/* Reminder bullet */}
                                <span
                                  className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isEmergency
                                      ? 'bg-resqnow-critical'
                                      : 'bg-resqnow-info'
                                  }`}
                                />

                                <span>
                                  {tip}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ============ SIGNAL NOTE ============ */}
        <div className="bg-resqnow-caution/10 border border-resqnow-caution/20 rounded-xl px-4 py-3">

          <p className="text-[10px] text-resqnow-secondary text-center leading-relaxed">
            If an emergency report cannot be sent because of weak internet or mobile signal, use the Contacts page to call the barangay hotline directly.
          </p>
        </div>
      </main>
    </div>
  );
}