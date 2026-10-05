import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BriefcaseMedical,
  Home,
  Phone,
  Shield,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const navItems = [
  {
    to: '/responder/dashboard',
    icon: Home,
    label: 'Home',
    active: (pathname) => pathname.startsWith('/responder/dashboard'),
  },
  {
    to: '/responder/missions',
    icon: BriefcaseMedical,
    label: 'Missions',
    active: (pathname) =>
      pathname.startsWith('/responder/missions') ||
      pathname.startsWith('/responder/incidents') ||
      pathname.startsWith('/responder/track'),
  },
  {
    to: '/responder/contacts',
    icon: Phone,
    label: 'Contacts',
    active: (pathname) => pathname.startsWith('/responder/contacts'),
  },
];

export default function ResponderLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fullScreenMap =
    location.pathname === '/responder/missions/map' ||
    location.pathname === '/responder/incidents/map';

  const firstLetter = (user?.fullName || user?.name || 'R').charAt(0).toUpperCase();
  const activeTab = navItems.findIndex((item) => item.active(location.pathname));

  return (
    <div className="min-h-screen responder-page pb-28 overflow-x-hidden">
      {!fullScreenMap && (
        <header className="relative h-[132px] bg-resqnow-violet overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-20 max-w-lg mx-auto px-4 pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/responder/dashboard')}
              className="min-h-[48px] flex items-center gap-2.5 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-bgy-yellow text-bgy-navy border border-white/30 flex items-center justify-center shadow-sm shrink-0">
                <Shield className="w-5 h-5" strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[17px] font-extrabold tracking-[-0.02em] text-white leading-tight">
                    ResQNow
                  </p>
                  <span className="inline-flex text-[8px] font-extrabold uppercase tracking-[0.12em] text-bgy-navy bg-bgy-yellow px-1.5 py-0.5 rounded-full">
                    Responder
                  </span>
                </div>
                <p className="text-[9px] font-medium text-white/80 mt-0.5">
                  Barangay Camunatan Response Operations
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/responder/updates')}
                aria-label="Operational updates"
                className="relative w-10 h-10 rounded-xl bg-white/12 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm hover:bg-white/20 active:scale-90 transition-all"
              >
                <Bell className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/responder/profile')}
                aria-label="Responder profile"
                className="w-10 h-10 rounded-full bg-bgy-yellow border-2 border-white text-bgy-navy flex items-center justify-center font-extrabold text-[13px] shadow-sm active:scale-95 transition-transform"
              >
                {firstLetter}
              </button>
            </div>
          </div>

          <svg
            className="absolute bottom-0 left-0 w-full h-[55px] z-10 block"
            viewBox="0 0 500 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="
                M0,34
                C8,18 25,12 50,12
                H160
                C184,12 198,16 217,28
                L250,47
                C265,55 282,57 307,57
                H500
                V60
                H0
                Z
              "
              fill="var(--bgy-bg)"
            />
            <rect x="0" y="58" width="500" height="2" fill="var(--bgy-bg)" />
          </svg>

          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] z-[11]"
            style={{ background: 'var(--bgy-bg)' }}
          />
        </header>
      )}

      {!fullScreenMap && (
        <div
          className="relative z-30 h-[2px] -mt-px"
          style={{ background: 'var(--bgy-bg)' }}
        />
      )}

      <main className={fullScreenMap ? 'relative z-20' : 'relative z-20 max-w-lg mx-auto'}>
        <div key={location.pathname} className={fullScreenMap ? '' : 'resqnow-page-transition'}>
          <Outlet />
        </div>
      </main>

      {!fullScreenMap && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-3 pointer-events-none"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <nav className="relative max-w-lg mx-auto h-[72px] bg-white/95 backdrop-blur-xl border border-resqnow-border-soft rounded-[24px] shadow-[0_8px_30px_rgba(7,55,99,0.13)] pointer-events-auto">
            {activeTab >= 0 && (
              <div className="absolute left-1.5 right-1.5 top-[12px] h-[48px] pointer-events-none z-0">
                <div
                  className="w-1/3 h-full flex justify-center transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(${activeTab * 100}%)` }}
                >
                  <div className="w-[64px] h-[48px] rounded-[16px] bg-resqnow-violet/10 shadow-[0_4px_14px_rgba(11,79,156,0.10)]" />
                </div>
              </div>
            )}

            <div className="relative z-10 grid grid-cols-3 items-center h-full px-2">
              {navItems.map((item) => (
                <ResponderNavItem
                  key={item.to}
                  {...item}
                  currentPath={location.pathname}
                />
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

function ResponderNavItem({ to, icon: Icon, label, active, currentPath }) {
  const selected = active(currentPath);

  return (
    <NavLink
      to={to}
      className="relative h-full flex items-center justify-center px-1 focus:outline-none"
      aria-current={selected ? 'page' : undefined}
    >
      <div
        className={`relative z-10 w-full max-w-[64px] h-[48px] rounded-[16px] flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-out active:scale-95 ${
          selected
            ? 'text-resqnow-violet -translate-y-0.5'
            : 'text-resqnow-muted hover:text-resqnow-primary'
        }`}
      >
        <Icon
          className={`w-5 h-5 transition-all duration-300 ${selected ? '-translate-y-0.5 scale-110' : ''}`}
          strokeWidth={selected ? 2.4 : 2}
        />
        <span
          className={`text-[10px] whitespace-nowrap transition-all duration-300 ${
            selected ? 'font-bold -translate-y-0.5' : 'font-medium'
          }`}
        >
          {label}
        </span>
      </div>
    </NavLink>
  );
}
