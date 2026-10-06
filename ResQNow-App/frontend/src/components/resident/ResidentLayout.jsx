import { useCallback, useEffect, useState } from 'react';
// src/components/resident/ResidentLayout.jsx
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  MapPin,
  CirclePlus,
  Bell,
  Phone,
  Shield,
  ShieldCheck,
  MessageSquareText,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { getNotifications } from '../../services/notificationService';

// ============ RESIDENT LAYOUT ============
// Keeps the original folder-shaped ResQNow shell while applying the
// official Barangay blue/yellow identity. Existing routes are unchanged.
export default function ResidentLayout() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnlineStatus();

  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const result = await getNotifications();
      setUnreadCount(result.unreadCount || 0);
    } catch {
      // Preserve the last confirmed count on temporary failures.
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshUnreadCount();
      }
    }, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshUnreadCount();
      }
    };

    const handleNotificationsChanged = () => {
      refreshUnreadCount();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener(
      'resqnow:notifications-changed',
      handleNotificationsChanged
    );

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener(
        'resqnow:notifications-changed',
        handleNotificationsChanged
      );
    };
  }, [refreshUnreadCount]);

  const firstLetter = (user?.fullName || t('common.resident'))
    .charAt(0)
    .toUpperCase();

  const currentLang = i18n.language?.startsWith('tl')
    ? 'TL'
    : i18n.language?.startsWith('ilo')
    ? 'ILO'
    : 'EN';

  const toggleLanguage = () => {
    const next = currentLang === 'EN' ? 'tl' : currentLang === 'TL' ? 'ilo' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('resqnow_language', next);
  };

  const reportActive = location.pathname.startsWith('/submit');

  const getActiveTab = () => {
    if (location.pathname.startsWith('/dashboard')) return 0;
    if (location.pathname.startsWith('/track')) return 1;
    if (location.pathname.startsWith('/submit')) return 2;
    if (location.pathname.startsWith('/safety-tips')) return 3;
    if (location.pathname.startsWith('/contacts')) return 4;
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen resqnow-page pb-28 overflow-x-hidden">
      {/* ============ ORIGINAL FOLDER HEADER / NEW CIVIC PALETTE ============ */}
      <header className="relative min-h-[136px] bg-resqnow-violet overflow-hidden pt-[env(safe-area-inset-top,0px)]">
        {/* Keep the original subtle texture, but remove the old gradient. */}
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

        <div className="relative z-20 max-w-lg mx-auto px-3.5 pt-3.5 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
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
                  Resident
                </span>
              </div>

              <p className="text-[9px] font-medium text-white/80 mt-0.5">
                Barangay Camunatan Emergency Response
              </p>
            </div>
          </button>

          {/* Notification & Language stay in the top header, beside the profile. */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Switch language"
              className="h-9 px-2 rounded-xl bg-white/12 border border-white/20 flex items-center justify-center text-white font-black text-[11px] tracking-wider backdrop-blur-sm hover:bg-white/20 active:scale-90 transition-all shadow-xs"
              title="Switch language (EN / TL / ILO)"
            >
              {currentLang}
            </button>

            <button
              type="button"
              onClick={() => navigate('/notifications')}
              aria-label={t('nav.notifications') || t('nav.updates') || 'Notifications'}
              className="relative w-9 h-9 rounded-xl bg-white/12 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm hover:bg-white/20 active:scale-90 transition-all"
            >
              <Bell className="w-4 h-4" />

              {unreadCount > 0 && (
                <span
                  key={unreadCount}
                  className="resqnow-badge-pop absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-resqnow-critical text-white text-[8px] font-extrabold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              aria-label={t('nav.profileSettings')}
              className="w-9 h-9 rounded-full bg-bgy-yellow border-2 border-white text-bgy-navy flex items-center justify-center font-extrabold text-[12px] shadow-sm active:scale-95 transition-transform"
            >
              {firstLetter}
            </button>
          </div>
        </div>

        {/* ============ ORIGINAL FOLDER SHAPE ============ */}
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

      <div
        className="relative z-30 h-[2px] -mt-px"
        style={{ background: 'var(--bgy-bg)' }}
      />

      {/* ============ PAGE CONTENT ============ */}
      <main className="relative z-20 max-w-lg mx-auto">
        <div key={location.pathname} className="resqnow-page-transition">
          <Outlet />
        </div>
      </main>

      {/* ============ BOTTOM NAVIGATION ============ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-3 pointer-events-none"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <nav className="relative max-w-lg mx-auto h-[72px] bg-white/95 backdrop-blur-xl border border-resqnow-border-soft rounded-[24px] shadow-[0_8px_30px_rgba(7,55,99,0.13)] pointer-events-auto">
          {/* Keep the original sliding active-pill behavior. */}
          {activeTab !== null && !reportActive && (
            <div className="absolute left-1.5 right-1.5 top-[12px] h-[48px] pointer-events-none z-0">
              <div
                className="w-1/5 h-full flex justify-center transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${activeTab * 100}%)` }}
              >
                <div className="w-[58px] h-[48px] rounded-[16px] bg-resqnow-violet/10 shadow-[0_4px_14px_rgba(11,79,156,0.10)]" />
              </div>
            </div>
          )}

          <div className="relative z-10 grid grid-cols-5 items-center h-full px-1.5">
            <NavItem to="/dashboard" icon={Home} label={t('nav.home')} />
            <NavItem to="/track" icon={MapPin} label={t('nav.track')} />

            {/* One primary report entry point. No duplicate Home CTA. */}
            <div className="relative h-full flex flex-col items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate(isOnline ? '/submit' : '/submit/emergency?offline=1')
                }
                aria-label={isOnline ? t('nav.submitReport') : 'Prepare emergency SMS fallback'}
                className={`absolute -top-6 w-[64px] h-[64px] rounded-full bg-resqnow-critical text-white flex items-center justify-center border-4 border-white ring-2 ring-bgy-yellow/70 transition-all duration-300 ease-out active:scale-90 ${
                  reportActive
                    ? '-translate-y-1 scale-[1.06] shadow-[0_10px_28px_rgba(217,45,32,0.34)]'
                    : 'shadow-[0_8px_22px_rgba(217,45,32,0.27)] hover:-translate-y-1 hover:scale-[1.03]'
                }`}
              >
                {isOnline ? (
                  <CirclePlus
                    className={`w-8 h-8 transition-all duration-300 ${
                      reportActive ? 'rotate-90 scale-110' : ''
                    }`}
                  />
                ) : (
                  <MessageSquareText className="w-7 h-7" />
                )}
              </button>

              <span className="text-[10px] font-extrabold text-resqnow-critical mb-1">
                {isOnline ? t('nav.report') : 'SMS SOS'}
              </span>
            </div>

            <NavItem
              to="/safety-tips"
              icon={ShieldCheck}
              label={t('nav.safety')}
            />
            <NavItem to="/contacts" icon={Phone} label={t('nav.contacts')} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className="relative h-full flex items-center justify-center px-1 focus:outline-none"
    >
      {({ isActive }) => (
        <div
          className={`relative z-10 w-full max-w-[58px] h-[48px] rounded-[16px] flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-out active:scale-95 ${
            isActive
              ? 'text-resqnow-violet -translate-y-0.5'
              : 'text-resqnow-muted hover:text-resqnow-primary'
          }`}
        >
          <Icon
            className={`w-5 h-5 transition-all duration-300 ${
              isActive ? '-translate-y-0.5 scale-110' : ''
            }`}
            strokeWidth={isActive ? 2.4 : 2}
          />

          <span
            className={`text-[11px] leading-tight whitespace-nowrap transition-all duration-300 ${
              isActive ? 'font-bold -translate-y-0.5' : 'font-medium'
            }`}
          >
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}
