import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  BadgeCheck,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  Truck,
  Radio,
  UserRound,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { apiRequest, getCsrfCookie } from '../../services/api';
import { getResponderOperations } from '../../services/responderService';

const preferenceKey = 'resqnow_responder_preferences';

export default function ResponderProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState('account');
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [preferences, setPreferences] = useState({
    assignmentUpdates: true,
    fieldActivity: true,
    urgentAlerts: true,
  });
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [operations, setOperations] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) || 'null');
      if (saved && typeof saved === 'object') {
        setPreferences((current) => ({ ...current, ...saved }));
      }
    } catch {
      // Keep defaults when saved preferences are malformed.
    }
  }, []);

  useEffect(() => {
    let active = true;

    getResponderOperations()
      .then((data) => {
        if (active) setOperations(data);
      })
      .catch(() => {
        // Profile still works when operational metadata is temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  const firstLetter = (user?.fullName || 'Responder')
    .charAt(0)
    .toUpperCase();

  function toggleSection(section) {
    setOpenSection((current) => current === section ? null : section);
  }

  function togglePreference(key) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
    setPreferencesSaved(false);
  }

  function savePreferences() {
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    setPreferencesSaved(true);
    window.setTimeout(() => setPreferencesSaved(false), 2200);
  }

  async function handlePasswordSave(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Complete all password fields.');
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError('Use at least 8 characters with an uppercase letter, number, and symbol.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsSavingPassword(true);

    try {
      await getCsrfCookie();
      await apiRequest('/api/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
    } catch (requestError) {
      setPasswordError(
        requestError?.errors?.currentPassword?.[0] ||
        requestError?.errors?.password?.[0] ||
        requestError?.message ||
        'Unable to change password.'
      );
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/responder/login', { replace: true });
  }

  return (
    <div className="px-4 pt-4 pb-28 min-h-screen">
      <div className="mb-3">
        <h1 className="text-lg font-bold text-resqnow-primary">Profile & Settings</h1>
        <p className="text-[11px] text-resqnow-muted mt-0.5">Responder account, security, and on-device preferences.</p>
      </div>

      <section className="bg-brand-gradient rounded-2xl p-4 text-white mb-3 shadow-[0_8px_20px_rgba(131,70,242,0.18)]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">{firstLetter}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[15px] font-bold truncate">{user?.fullName || 'Responder'}</p>
              {user?.accountStatus === 'Verified' && <ShieldCheck className="w-4 h-4 text-white shrink-0" />}
            </div>
            <p className="text-[10px] text-white/80 mt-0.5">
              {user?.accountStatus === 'Verified' ? 'Verified responder' : user?.accountStatus || 'Responder'}
            </p>
            <p className="text-[10px] text-white/80 mt-1 truncate">Barangay Camunatan</p>
          </div>
        </div>
      </section>

      <section className="mb-3 rounded-2xl border border-resqnow-border-soft bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">Operational identity</p>
            <p className="mt-1 text-[12px] font-semibold text-resqnow-muted">Dispatcher-facing readiness information.</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${operations?.isOnDuty ? 'bg-resqnow-safe/10 text-resqnow-safe' : 'bg-resqnow-canvas text-resqnow-muted'}`}>
            {operations?.isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <InfoLine icon={Radio} label="Responder role" value={operations?.responderRole || 'Emergency Responder'} />
          <InfoLine icon={Truck} label="Asset / team" value={operations?.currentAsset || operations?.teamName || 'Not assigned'} />
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-resqnow-placeholder">Duty status is changed from Home. Asset and team values are displayed only when operational data has been assigned.</p>
      </section>

      <SettingsSection
        icon={UserRound}
        title="Account information"
        subtitle="Responder identity and access"
        open={openSection === 'account'}
        onToggle={() => toggleSection('account')}
      >
        <div className="space-y-3">
          <InfoLine icon={UserRound} label="Full name" value={user?.fullName || 'Unavailable'} />
          <InfoLine icon={Mail} label="Email" value={user?.email || 'Unavailable'} />
          <InfoLine icon={BadgeCheck} label="Account status" value={user?.accountStatus || 'Unavailable'} />
          <InfoLine icon={Building2} label="Barangay assignment" value="Barangay Camunatan" />
          <InfoLine icon={ShieldCheck} label="Report access" value="Only incidents actively assigned to this responder account" />
        </div>
      </SettingsSection>

      <SettingsSection
        icon={LockKeyhole}
        title="Password & security"
        subtitle="Change your responder password"
        open={openSection === 'security'}
        onToggle={() => toggleSection('security')}
      >
        <form onSubmit={handlePasswordSave} className="space-y-3">
          {passwordError && (
            <div className="flex items-start gap-2 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/10 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-resqnow-critical" />
              <p className="text-[10px] text-resqnow-crimson">{passwordError}</p>
            </div>
          )}

          {passwordSaved && (
            <div className="flex items-center gap-2 rounded-xl border border-resqnow-safe/20 bg-resqnow-safe/10 px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-resqnow-safe" />
              <p className="text-[10px] font-semibold text-resqnow-safe">Password changed successfully.</p>
            </div>
          )}

          <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} show={showPasswords} />
          <PasswordField label="New password" value={newPassword} onChange={setNewPassword} show={showPasswords} />
          <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} show={showPasswords} />

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowPasswords((value) => !value)}
              className="min-h-[40px] inline-flex items-center gap-2 text-[10px] font-bold text-resqnow-violet"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPasswords ? 'Hide passwords' : 'Show passwords'}
            </button>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="min-h-[44px] rounded-xl bg-brand-gradient px-4 text-[11px] font-bold text-white disabled:opacity-60"
            >
              {isSavingPassword ? 'Saving...' : 'Change password'}
            </button>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection
        icon={Bell}
        title="Notification preferences"
        subtitle="Choose what this device highlights"
        open={openSection === 'notifications'}
        onToggle={() => toggleSection('notifications')}
      >
        <div className="space-y-2">
          <PreferenceRow
            title="Assignment updates"
            subtitle="Assigned and reassigned incident changes"
            checked={preferences.assignmentUpdates}
            onChange={() => togglePreference('assignmentUpdates')}
          />
          <PreferenceRow
            title="Field activity"
            subtitle="Status and coordination activity"
            checked={preferences.fieldActivity}
            onChange={() => togglePreference('fieldActivity')}
          />
          <PreferenceRow
            title="Urgent alerts"
            subtitle="High-priority responder notices"
            checked={preferences.urgentAlerts}
            onChange={() => togglePreference('urgentAlerts')}
          />
        </div>

        <button
          type="button"
          onClick={savePreferences}
          className="mt-3 min-h-[44px] w-full rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/5 text-[11px] font-bold text-resqnow-violet"
        >
          {preferencesSaved ? 'Preferences saved on this device' : 'Save preferences'}
        </button>
      </SettingsSection>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-resqnow-critical/25 bg-resqnow-critical/5 text-[12px] font-bold text-resqnow-crimson"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, subtitle, open, onToggle, children }) {
  return (
    <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-resqnow-canvas transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-resqnow-primary">{title}</p>
          <p className="text-[9px] text-resqnow-muted mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-resqnow-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 py-4 border-t border-resqnow-border-soft">
          {children}
        </div>
      )}
    </section>
  );
}

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-resqnow-canvas p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-resqnow-violet" />
      <div className="min-w-0">
        <p className="text-[9px] font-semibold text-resqnow-muted">{label}</p>
        <p className="mt-1 break-words text-[12px] font-semibold text-resqnow-primary">{value}</p>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show }) {
  return (
    <label className="block">
      <span className="text-[9px] font-semibold text-resqnow-muted">{label}</span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        className="mt-1 w-full rounded-xl border border-resqnow-border bg-resqnow-canvas px-3 py-3 text-[12px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
      />
    </label>
  );
}

function PreferenceRow({ title, subtitle, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full min-h-[56px] rounded-xl bg-resqnow-canvas px-3 py-2.5 flex items-center gap-3 text-left"
    >
      <div className="flex-1">
        <p className="text-[11px] font-bold text-resqnow-primary">{title}</p>
        <p className="mt-0.5 text-[9px] text-resqnow-muted">{subtitle}</p>
      </div>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-resqnow-violet' : 'bg-resqnow-border'}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
    </button>
  );
}
