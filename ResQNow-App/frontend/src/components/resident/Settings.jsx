// src/components/resident/Settings.jsx
import { apiRequest, getCsrfCookie } from '../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  MapPinned,
  Users,
  ShieldCheck,
  LockKeyhole,
  Languages,
  Bell,
  FileText,
  Megaphone,
  Siren,
  ChevronDown,
  Pencil,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  LogOut,
  Loader2,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { purokOptions } from '../../data/mockData';
import { supportedLanguages } from '../../i18n/i18n';

// ============ SETTINGS PAGE ============
// Resident profile, security, preferences, privacy, and sign out
export default function Settings() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { t, i18n } = useTranslation();

  // Accordion state
  const [openSection, setOpenSection] = useState('profile');

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);

  // Resident information
  const [fullName, setFullName] = useState(
    user?.fullName || ''
  );

  const [contactNumber, setContactNumber] = useState(
    user?.contactNumber || ''
  );

  const [email, setEmail] = useState(
    user?.email || ''
  );

  const [address, setAddress] = useState(
    user?.address || ''
  );

  const [purok, setPurok] = useState(
    user?.purok || 'Purok 1'
  );

  const [householdCount, setHouseholdCount] = useState(
    user?.householdCount || 1
  );

  // Household information
  const [householdProfile, setHouseholdProfile] = useState({
    hasSeniorCitizen:
      user?.householdProfile?.hasSeniorCitizen || false,

    hasChild:
      user?.householdProfile?.hasChild || false,

    hasPWD:
      user?.householdProfile?.hasPWD || false,

    hasPregnantPerson:
      user?.householdProfile?.hasPregnantPerson || false,
  });

  // Profile feedback
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    reportUpdates: true,
    announcements: true,
    emergencyAlerts: true,
  });

  const [preferencesSaved, setPreferencesSaved] =
    useState(false);

  // ============ ACCORDION ============
  // Open or close a settings section
  const toggleSection = (section) => {
    setOpenSection((prev) =>
      prev === section
        ? null
        : section
    );
  };

  // ============ LANGUAGE ============
  // Change resident app language
  const handleLanguageChange = async (e) => {
    const newLanguage =
      e.target.value;

    await i18n.changeLanguage(
      newLanguage
    );

    setPreferencesSaved(false);
  };

  // ============ HOUSEHOLD ============
  // Toggle household characteristic
  const toggleHousehold = (key) => {
    if (!isEditing) return;

    setHouseholdProfile((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ============ PROFILE ============
  // Validate and save resident profile
  const handleProfileSave = async () => {
  if (isProfileSaving) {
    return;
  }

  setProfileError('');
  setProfileSaved(false);

  const normalizedFullName =
    fullName.trim();

  let normalizedContactNumber =
    contactNumber.replace(
      /\s/g,
      ''
    );

  // Standardize +639XXXXXXXXX to 09XXXXXXXXX.
  if (
    normalizedContactNumber.startsWith(
      '+639'
    )
  ) {
    normalizedContactNumber =
      `09${normalizedContactNumber.slice(4)}`;
  }

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  const normalizedAddress =
    address.trim();

  // ============ FRONTEND VALIDATION ============

  if (!normalizedFullName) {
    setProfileError(
      t(
        'settings.fullNameRequired'
      )
    );

    return;
  }

  if (
    !/^09\d{9}$/.test(
      normalizedContactNumber
    )
  ) {
    setProfileError(
      t(
        'settings.invalidMobile'
      )
    );

    return;
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail
    )
  ) {
    setProfileError(
      t(
        'settings.invalidEmail'
      )
    );

    return;
  }

  if (!normalizedAddress) {
    setProfileError(
      t(
        'settings.addressRequired'
      )
    );

    return;
  }

  setIsProfileSaving(true);

  try {
    // This now calls PUT /api/profile
    // through AuthContext -> authService.
    const updatedUser =
      await updateProfile({
        fullName:
          normalizedFullName,

        contactNumber:
          normalizedContactNumber,

        email:
          normalizedEmail,

        address:
          normalizedAddress,

        purok,

        householdCount:
          Number(
            householdCount
          ),

        householdProfile: {
          ...householdProfile,
        },
      });

    // Use the fresh values returned by Laravel/MySQL.
    setFullName(
      updatedUser?.fullName ??
        normalizedFullName
    );

    setContactNumber(
      updatedUser?.contactNumber ??
        normalizedContactNumber
    );

    setEmail(
      updatedUser?.email ??
        normalizedEmail
    );

    setAddress(
      updatedUser?.address ??
        normalizedAddress
    );

    setPurok(
      updatedUser?.purok ??
        purok
    );

    setHouseholdCount(
      updatedUser?.householdCount ??
        householdCount
    );

    const freshHousehold =
      updatedUser?.householdProfile ??
      householdProfile;

    setHouseholdProfile({
      hasSeniorCitizen:
        Boolean(
          freshHousehold
            ?.hasSeniorCitizen
        ),

      hasChild:
        Boolean(
          freshHousehold
            ?.hasChild
        ),

      hasPWD:
        Boolean(
          freshHousehold
            ?.hasPWD
        ),

      hasPregnantPerson:
        Boolean(
          freshHousehold
            ?.hasPregnantPerson
        ),
    });

    // Only show success after Laravel succeeds.
    setIsEditing(false);
    setProfileSaved(true);

    window.setTimeout(
      () => {
        setProfileSaved(false);
      },
      2500
    );
  } catch (error) {
    const backendErrors =
      error?.errors || {};

    const firstBackendError = [
      backendErrors
        ?.fullName?.[0],

      backendErrors
        ?.contactNumber?.[0],

      backendErrors
        ?.email?.[0],

      backendErrors
        ?.address?.[0],

      backendErrors
        ?.purok?.[0],

      backendErrors
        ?.householdCount?.[0],
    ].find(Boolean);

    setProfileError(
      firstBackendError ||
        error?.message ||
        'Unable to update your profile. Please try again.'
    );

    // Keep Edit mode open when save fails.
  } finally {
    setIsProfileSaving(false);
  }
};

  // Cancel profile editing and restore
  // the latest values from the authenticated user.
  const handleCancelEdit = () => {
    setFullName(
      user?.fullName || ''
    );

    setContactNumber(
      user?.contactNumber || ''
    );

    setEmail(
      user?.email || ''
    );

    setAddress(
      user?.address || ''
    );

    setPurok(
      user?.purok || 'Purok 1'
    );

    setHouseholdCount(
      user?.householdCount ?? 1
    );

    setHouseholdProfile({
      hasSeniorCitizen:
        user?.householdProfile
          ?.hasSeniorCitizen ?? false,

      hasChild:
        user?.householdProfile
          ?.hasChild ?? false,

      hasPWD:
        user?.householdProfile
          ?.hasPWD ?? false,

      hasPregnantPerson:
        user?.householdProfile
          ?.hasPregnantPerson ?? false,
    });

    setProfileError('');
    setProfileSaved(false);
    setIsEditing(false);
  };

  // ============ PASSWORD ============
  // Check password requirements
  const validPassword = (password) => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  // Validate and save password
  const handlePasswordSave = async () => {
    if (isPasswordSaving) {
      return;
    }

    setPasswordError('');
    setPasswordSaved(false);

    // Current password required
    if (!currentPassword) {
      setPasswordError(
        t(
          'settings.currentPasswordRequired'
        )
      );

      return;
    }

    // New password must meet Laravel policy
    if (
      !validPassword(
        newPassword
      )
    ) {
      setPasswordError(
        t(
          'settings.newPasswordInvalid'
        )
      );

      return;
    }

    // Confirmation must match
    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        t(
          'settings.passwordMismatch'
        )
      );

      return;
    }

    // Do not allow obvious same-password attempt
    if (
      currentPassword ===
      newPassword
    ) {
      setPasswordError(
        'Your new password must be different from your current password.'
      );

      return;
    }

    setIsPasswordSaving(true);

    try {
      await getCsrfCookie();

      await apiRequest(
        '/api/change-password',
        {
          method: 'POST',

          body:
            JSON.stringify({
              currentPassword,

              password:
                newPassword,

              password_confirmation:
                confirmPassword,
            }),
        }
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setPasswordSaved(true);

      window.setTimeout(
        () => {
          setPasswordSaved(false);
        },
        2500
      );
    } catch (error) {
      const currentPasswordError =
        error?.errors
          ?.currentPassword?.[0];

      const newPasswordError =
        error?.errors
          ?.password?.[0];

      setPasswordError(
        currentPasswordError ||
          newPasswordError ||
          error?.message ||
          'Unable to change your password. Please try again.'
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // ============ NOTIFICATIONS ============
  // Toggle notification preference
  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setPreferencesSaved(false);
  };

  // Mock save preferences
  const handlePreferencesSave = () => {
    setPreferencesSaved(true);

    setTimeout(() => {
      setPreferencesSaved(false);
    }, 2500);
  };

  // ============ LOGOUT ============
  // Sign resident out
  const handleLogout = () => {
    logout();

    navigate(
      '/login',
      {
        replace: true,
      }
    );
  };

  // Avatar letter
  const firstLetter = (
    user?.fullName ||
    t('settings.resident')
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="px-4 pt-4 pb-28 min-h-screen">

      {/* ============ HEADER ============ */}
      <div className="mb-3">

        <h1 className="text-lg font-bold text-resqnow-primary">
          {t('settings.title')}
        </h1>

        <p className="text-[11px] text-resqnow-muted mt-0.5">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* ============ PROFILE SUMMARY ============ */}
      <section className="bg-brand-gradient rounded-2xl p-4 text-white mb-3 shadow-[0_8px_20px_rgba(131,70,242,0.18)]">

        <div className="flex items-center gap-3">

          <div className="w-14 h-14 rounded-full bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">
              {firstLetter}
            </span>
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-1.5">

              <p className="text-[15px] font-bold truncate">
                {user?.fullName ||
                  t(
                    'settings.resident'
                  )}
              </p>

              {user?.accountStatus ===
                'Verified' && (
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              )}
            </div>

            <p className="text-[10px] text-white/80 mt-0.5">
              {user?.accountStatus ===
              'Verified'
                ? t(
                    'settings.verifiedResident'
                  )
                : user?.accountStatus ||
                  t(
                    'settings.resident'
                  )}
            </p>

            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-white/70" />

              <p className="text-[10px] text-white/80 truncate">
                {user?.purok ||
                  'Barangay Camunatan'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setOpenSection(
                'profile'
              );

              setIsEditing(true);
            }}
            aria-label={
              t(
                'settings.editProfile'
              )
            }
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 hover:bg-white/30 active:scale-95 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ============ PERSONAL & HOUSEHOLD ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-3">

        <button
          type="button"
          onClick={() =>
            toggleSection(
              'profile'
            )
          }
          aria-expanded={
            openSection ===
            'profile'
          }
          className="w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-resqnow-canvas active:bg-resqnow-violet/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
            <UserRound className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <p className="text-[13px] font-bold text-resqnow-primary">
              {t(
                'settings.personalHousehold'
              )}
            </p>

            <p className="text-[9px] text-resqnow-muted mt-0.5">
              {t(
                'settings.personalHouseholdHint'
              )}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-resqnow-muted transition-transform ${
              openSection ===
              'profile'
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {openSection ===
          'profile' && (
          <div className="px-4 pb-4 border-t border-resqnow-border-soft">

            <div className="flex items-center justify-between mt-4 mb-3">

              <p className="text-[11px] font-bold text-resqnow-secondary">
                {t(
                  'settings.residentInformation'
                )}
              </p>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    setIsEditing(true)
                  }
                  className="min-h-[36px] flex items-center gap-1 px-2 text-[10px] font-bold text-resqnow-violet"
                >
                  <Pencil className="w-3 h-3" />

                  {t(
                    'settings.edit'
                  )}
                </button>
              )}
            </div>

            {/* Profile error */}
            {profileError && (
              <div className="flex items-start gap-2 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl px-3 py-2.5 mb-3">

                <AlertCircle className="w-4 h-4 text-resqnow-critical shrink-0 mt-0.5" />

                <p className="text-[10px] text-resqnow-crimson">
                  {profileError}
                </p>
              </div>
            )}

            {/* Profile success */}
            {profileSaved && (
              <div className="flex items-center gap-2 bg-resqnow-safe/10 border border-resqnow-safe/20 rounded-xl px-3 py-2.5 mb-3">

                <CheckCircle2 className="w-4 h-4 text-resqnow-safe" />

                <p className="text-[10px] font-semibold text-resqnow-safe">
                  {t(
                    'settings.profileUpdated'
                  )}
                </p>
              </div>
            )}

            {/* Profile fields */}
            <div className="space-y-3">

              <ProfileField
                icon={UserRound}
                label={t(
                  'settings.fullName'
                )}
                value={fullName}
                editing={isEditing}
                onChange={
                  setFullName
                }
                emptyText={t(
                  'settings.notProvided'
                )}
              />

              <ProfileField
                icon={Phone}
                label={t(
                  'settings.contactNumber'
                )}
                value={contactNumber}
                editing={isEditing}
                onChange={
                  setContactNumber
                }
                type="tel"
                emptyText={t(
                  'settings.notProvided'
                )}
              />

              <ProfileField
                icon={Mail}
                label={t(
                  'settings.email'
                )}
                value={email}
                editing={isEditing}
                onChange={
                  setEmail
                }
                type="email"
                emptyText={t(
                  'settings.notProvided'
                )}
              />

              <ProfileField
                icon={MapPin}
                label={t(
                  'settings.address'
                )}
                value={address}
                editing={isEditing}
                onChange={
                  setAddress
                }
                emptyText={t(
                  'settings.notProvided'
                )}
              />

              {/* Purok */}
              <div>
                <label className="text-[9px] font-semibold text-resqnow-muted">
                  {t(
                    'settings.purok'
                  )}
                </label>

                {isEditing ? (
                  <select
                    value={purok}
                    onChange={(e) =>
                      setPurok(
                        e.target.value
                      )
                    }
                    className="w-full mt-1 bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[11px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
                  >
                    {purokOptions.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <p className="text-[12px] font-semibold text-resqnow-primary mt-1">
                    {purok}
                  </p>
                )}
              </div>
            </div>

            {/* ============ HOME LOCATION ============ */}
            <div className="mt-4">

              <p className="text-[11px] font-bold text-resqnow-secondary mb-2">
                {t(
                  'settings.homeLocation'
                )}
              </p>

              <div className="bg-resqnow-violet/5 border border-resqnow-violet/15 rounded-xl p-3 flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
                  <MapPinned className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-[10px] font-bold text-resqnow-primary">
                    {t(
                      'settings.savedHomeLocation'
                    )}
                  </p>

                  <p className="text-[9px] text-resqnow-violet mt-0.5 truncate">
                    {address ||
                      purok}
                  </p>

                  <p className="text-[8px] text-resqnow-muted mt-0.5">
                    {t(
                      'settings.mapLater'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ============ HOUSEHOLD ============ */}
            <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-resqnow-violet" />

                <p className="text-[11px] font-bold text-resqnow-secondary">
                  {t(
                    'settings.householdInformation'
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between bg-resqnow-canvas rounded-xl p-3">

                <div>
                  <p className="text-[10px] font-semibold text-resqnow-secondary">
                    {t(
                      'settings.householdMembers'
                    )}
                  </p>

                  <p className="text-[9px] text-resqnow-muted mt-0.5">
                    {t(
                      'settings.householdMembersHint'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        setHouseholdCount(
                          (prev) =>
                            Math.max(
                              1,
                              prev - 1
                            )
                        )
                      }
                      aria-label={
                        t(
                          'settings.decreaseHousehold'
                        )
                      }
                      className="w-9 h-9 rounded-lg border border-resqnow-border bg-white flex items-center justify-center text-resqnow-muted hover:text-resqnow-violet hover:border-resqnow-violet/30 active:scale-95 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="w-7 text-center text-[13px] font-bold text-resqnow-primary">
                    {householdCount}
                  </span>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        setHouseholdCount(
                          (prev) =>
                            prev + 1
                        )
                      }
                      aria-label={
                        t(
                          'settings.increaseHousehold'
                        )
                      }
                      className="w-9 h-9 rounded-lg border border-resqnow-border bg-white flex items-center justify-center text-resqnow-muted hover:text-resqnow-violet hover:border-resqnow-violet/30 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[9px] font-semibold text-resqnow-muted mt-3 mb-2">
                {t(
                  'settings.householdProfile'
                )}
              </p>

              <div className="grid grid-cols-2 gap-2">

                <HouseholdOption
                  label={t(
                    'settings.seniorCitizen'
                  )}
                  selected={
                    householdProfile.hasSeniorCitizen
                  }
                  disabled={!isEditing}
                  onClick={() =>
                    toggleHousehold(
                      'hasSeniorCitizen'
                    )
                  }
                />

                <HouseholdOption
                  label={t(
                    'settings.child'
                  )}
                  selected={
                    householdProfile.hasChild
                  }
                  disabled={!isEditing}
                  onClick={() =>
                    toggleHousehold(
                      'hasChild'
                    )
                  }
                />

                <HouseholdOption
                  label={t(
                    'settings.pwd'
                  )}
                  selected={
                    householdProfile.hasPWD
                  }
                  disabled={!isEditing}
                  onClick={() =>
                    toggleHousehold(
                      'hasPWD'
                    )
                  }
                />

                <HouseholdOption
                  label={t(
                    'settings.pregnantPerson'
                  )}
                  selected={
                    householdProfile.hasPregnantPerson
                  }
                  disabled={!isEditing}
                  onClick={() =>
                    toggleHousehold(
                      'hasPregnantPerson'
                    )
                  }
                />
              </div>
            </div>

            {/* Save profile */}
            {isEditing && (
              <div className="grid grid-cols-2 gap-2 mt-4">

                <button
                  type="button"
                  onClick={
                    handleCancelEdit
              }
              disabled={
              isProfileSaving
              }
              className="min-h-[44px] py-2.5 rounded-xl border border-resqnow-border bg-white text-resqnow-muted text-[11px] font-semibold hover:bg-resqnow-canvas disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              {t(
                'settings.cancel'
          )}
        </button>

        <button
          type="button"
          onClick={
            handleProfileSave
        }
        disabled={
          isProfileSaving
        }
        className="min-h-[44px] py-2.5 rounded-xl bg-brand-gradient text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(131,70,242,0.16)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
      >
        {isProfileSaving ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />

            {t(
              'common.loading'
          )}
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5" />

          {t(
            'settings.saveChanges'
        )}
      </>
    )}
  </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ============ ACCOUNT & SECURITY ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-3">

        <button
          type="button"
          onClick={() =>
            toggleSection(
              'security'
            )
          }
          aria-expanded={
            openSection ===
            'security'
          }
          className="w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-resqnow-canvas active:bg-resqnow-violet/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
            <LockKeyhole className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <p className="text-[13px] font-bold text-resqnow-primary">
              {t(
                'settings.security'
              )}
            </p>

            <p className="text-[9px] text-resqnow-muted mt-0.5">
              {t(
                'settings.securityHint'
              )}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-resqnow-muted transition-transform ${
              openSection ===
              'security'
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {openSection ===
          'security' && (
          <div className="px-4 pb-4 border-t border-resqnow-border-soft">

            <div className="mt-4 space-y-3">

              {passwordError && (
                <div className="flex items-start gap-2 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl px-3 py-2.5">

                  <AlertCircle className="w-4 h-4 text-resqnow-critical shrink-0 mt-0.5" />

                  <p className="text-[10px] text-resqnow-crimson">
                    {passwordError}
                  </p>
                </div>
              )}

              {passwordSaved && (
                <div className="flex items-center gap-2 bg-resqnow-safe/10 border border-resqnow-safe/20 rounded-xl px-3 py-2.5">

                  <CheckCircle2 className="w-4 h-4 text-resqnow-safe" />

                  <p className="text-[10px] font-semibold text-resqnow-safe">
                    {t(
                      'settings.passwordUpdated'
                    )}
                  </p>
                </div>
              )}

              <PasswordField
                label={t(
                  'settings.currentPassword'
                )}
                value={
                  currentPassword
                }
                onChange={
                  setCurrentPassword
                }
                show={
                  showPasswords
                }
              />

              <PasswordField
                label={t(
                  'settings.newPassword'
                )}
                value={
                  newPassword
                }
                onChange={
                  setNewPassword
                }
                show={
                  showPasswords
                }
              />

              <PasswordField
                label={t(
                  'settings.confirmPassword'
                )}
                value={
                  confirmPassword
                }
                onChange={
                  setConfirmPassword
                }
                show={
                  showPasswords
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPasswords(
                    (prev) =>
                      !prev
                  )
                }
                className="min-h-[36px] flex items-center gap-1.5 text-[10px] font-semibold text-resqnow-muted hover:text-resqnow-violet transition-colors"
              >
                {showPasswords ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}

                {showPasswords
                  ? t(
                      'settings.hidePasswords'
                    )
                  : t(
                      'settings.showPasswords'
                    )}
              </button>

              <div className="bg-resqnow-canvas border border-resqnow-border-soft rounded-xl p-3">

                <p className="text-[9px] font-bold text-resqnow-secondary">
                  {t(
                    'settings.passwordRequirements'
                  )}
                </p>

                <p className="text-[9px] text-resqnow-muted mt-1 leading-relaxed">
                  {t(
                    'settings.passwordRequirementsText'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handlePasswordSave
                }
                disabled={
                  isPasswordSaving
                }
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-brand-gradient text-white text-[11px] font-bold shadow-[0_4px_14px_rgba(131,70,242,0.16)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {isPasswordSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />

                    Changing Password...
                  </>
                ) : (
                  t(
                    'settings.changePassword'
                  )
              )}
            </button>
            </div>
          </div>
        )}
      </section>

      {/* ============ PREFERENCES ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-3">

        <button
          type="button"
          onClick={() =>
            toggleSection(
              'preferences'
            )
          }
          aria-expanded={
            openSection ===
            'preferences'
          }
          className="w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-resqnow-canvas active:bg-resqnow-violet/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <p className="text-[13px] font-bold text-resqnow-primary">
              {t(
                'settings.preferences'
              )}
            </p>

            <p className="text-[9px] text-resqnow-muted mt-0.5">
              {t(
                'settings.preferencesHint'
              )}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-resqnow-muted transition-transform ${
              openSection ===
              'preferences'
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {openSection ===
          'preferences' && (
          <div className="px-4 pb-4 border-t border-resqnow-border-soft">

            {/* ============ LANGUAGE ============ */}
            <div className="mt-4">

              <div className="flex items-center gap-2 mb-2">

                <Languages className="w-4 h-4 text-resqnow-violet" />

                <p className="text-[11px] font-bold text-resqnow-secondary">
                  {t(
                    'settings.language'
                  )}
                </p>
              </div>

              <select
                value={(
                  i18n.resolvedLanguage ||
                  i18n.language ||
                  'en'
                ).split('-')[0]}
                onChange={
                  handleLanguageChange
                }
                className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[11px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
              >
                {supportedLanguages.map(
                  (language) => (
                    <option
                      key={
                        language.code
                      }
                      value={
                        language.code
                      }
                    >
                      {t(
                        language.labelKey
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Notifications */}
            <div className="mt-4 pt-4 border-t border-resqnow-border-soft">

              <p className="text-[11px] font-bold text-resqnow-secondary mb-2.5">
                {t(
                  'settings.notifications'
                )}
              </p>

              <div className="space-y-2">

                <NotificationOption
                  icon={FileText}
                  title={t(
                    'settings.reportUpdates'
                  )}
                  description={t(
                    'settings.reportUpdatesHint'
                  )}
                  enabled={
                    notifications.reportUpdates
                  }
                  onClick={() =>
                    toggleNotification(
                      'reportUpdates'
                    )
                  }
                />

                <NotificationOption
                  icon={Megaphone}
                  title={t(
                    'settings.announcements'
                  )}
                  description={t(
                    'settings.announcementsHint'
                  )}
                  enabled={
                    notifications.announcements
                  }
                  onClick={() =>
                    toggleNotification(
                      'announcements'
                    )
                  }
                />

                <NotificationOption
                  icon={Siren}
                  title={t(
                    'settings.emergencyAlerts'
                  )}
                  description={t(
                    'settings.emergencyAlertsHint'
                  )}
                  enabled={
                    notifications.emergencyAlerts
                  }
                  onClick={() =>
                    toggleNotification(
                      'emergencyAlerts'
                    )
                  }
                  important
                />
              </div>
            </div>

            {preferencesSaved && (
              <div className="mt-3 flex items-center gap-2 bg-resqnow-safe/10 border border-resqnow-safe/20 rounded-xl px-3 py-2.5">

                <CheckCircle2 className="w-4 h-4 text-resqnow-safe" />

                <p className="text-[10px] font-semibold text-resqnow-safe">
                  {t(
                    'settings.preferencesSaved'
                  )}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={
                handlePreferencesSave
              }
              className="w-full min-h-[44px] mt-3 py-2.5 rounded-xl bg-brand-gradient text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(131,70,242,0.16)] active:scale-[0.98] transition-all"
            >
              <Save className="w-3.5 h-3.5" />

              {t(
                'settings.savePreferences'
              )}
            </button>
          </div>
        )}
      </section>

      {/* ============ PRIVACY & DATA ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-3">

        <button
          type="button"
          onClick={() =>
            toggleSection(
              'privacy'
            )
          }
          aria-expanded={
            openSection ===
            'privacy'
          }
          className="w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-resqnow-canvas active:bg-resqnow-info/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-resqnow-info/10 text-resqnow-info flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div className="flex-1">

            <p className="text-[13px] font-bold text-resqnow-primary">
              {t(
                'settings.privacy'
              )}
            </p>

            <p className="text-[9px] text-resqnow-muted mt-0.5">
              {t(
                'settings.privacyHint'
              )}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-resqnow-muted transition-transform ${
              openSection ===
              'privacy'
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {openSection ===
          'privacy' && (
          <div className="px-4 pb-4 border-t border-resqnow-border-soft">

            <div className="mt-4 bg-resqnow-info/5 border border-resqnow-info/15 rounded-xl p-3">

              <div className="flex items-start gap-2">

                <ShieldCheck className="w-4 h-4 text-resqnow-info mt-0.5 shrink-0" />

                <div>
                  <p className="text-[10px] font-bold text-resqnow-info">
                    {t(
                      'settings.residentDataPrivacy'
                    )}
                  </p>

                  <p className="text-[9px] text-resqnow-secondary mt-1 leading-relaxed">
                    {t(
                      'settings.privacyMessage'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-resqnow-muted mt-3 leading-relaxed">
              {t(
                'settings.privacyDetails'
              )}
            </p>
          </div>
        )}
      </section>

      {/* ============ SIGN OUT ============ */}
      <button
        type="button"
        onClick={
          handleLogout
        }
        className="w-full min-h-[44px] py-3 rounded-xl border border-resqnow-crimson/20 bg-resqnow-crimson/10 text-resqnow-crimson text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-resqnow-crimson/15 active:scale-[0.98] transition-all"
      >
        <LogOut className="w-4 h-4" />

        {t(
          'settings.signOut'
        )}
      </button>

      <p className="text-[9px] text-resqnow-muted text-center mt-2">
        {t(
          'settings.residentId'
        )}
        :{' '}
        {user?.id ||
          t(
            'settings.notAvailable'
          )}
      </p>
    </div>
  );
}

// ============ PROFILE FIELD ============
// Profile field that becomes editable
function ProfileField({
  icon: Icon,
  label,
  value,
  editing,
  onChange,
  emptyText,
  type = 'text',
}) {
  return (
    <div>

      <label className="text-[9px] font-semibold text-resqnow-muted">
        {label}
      </label>

      {editing ? (
        <div className="relative mt-1">

          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-resqnow-placeholder" />

          <input
            type={type}
            value={value}
            onChange={(e) =>
              onChange(
                e.target.value
              )
            }
            className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-1">

          <Icon className="w-3.5 h-3.5 text-resqnow-muted" />

          <p className="text-[12px] font-semibold text-resqnow-primary break-words">
            {value ||
              emptyText}
          </p>
        </div>
      )}
    </div>
  );
}

// ============ HOUSEHOLD OPTION ============
// Normal selection uses Violet
function HouseholdOption({
  label,
  selected,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        disabled
      }
      aria-pressed={
        selected
      }
      className={`min-h-[44px] p-2.5 rounded-xl border text-[10px] font-semibold text-left transition-all ${
        selected
          ? 'bg-resqnow-violet/10 border-resqnow-violet/30 text-resqnow-violet'
          : 'bg-white border-resqnow-border-soft text-resqnow-muted'
      } ${
        disabled
          ? 'cursor-default'
          : 'hover:border-resqnow-violet/30 hover:bg-resqnow-violet/5 active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center gap-2">

        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
            selected
              ? 'bg-resqnow-violet border-resqnow-violet'
              : 'border-resqnow-border'
          }`}
        >
          {selected && (
            <CheckCircle2 className="w-3 h-3 text-white" />
          )}
        </div>

        {label}
      </div>
    </button>
  );
}

// ============ PASSWORD FIELD ============
// Shared password field
function PasswordField({
  label,
  value,
  onChange,
  show,
}) {
  return (
    <div>

      <label className="block text-[9px] font-semibold text-resqnow-muted mb-1">
        {label}
      </label>

      <input
        type={
          show
            ? 'text'
            : 'password'
        }
        value={
          value
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[11px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
      />
    </div>
  );
}

// ============ NOTIFICATION OPTION ============
// Notification setting with normal Violet toggle
function NotificationOption({
  icon: Icon,
  title,
  description,
  enabled,
  onClick,
  important = false,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        enabled
      }
      className="w-full min-h-[60px] flex items-center gap-3 p-3 rounded-xl bg-resqnow-canvas border border-transparent text-left hover:border-resqnow-border-soft active:scale-[0.995] transition-all"
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          important
            ? 'bg-resqnow-critical/10 text-resqnow-critical'
            : 'bg-resqnow-info/10 text-resqnow-info'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1">

        <p className="text-[11px] font-bold text-resqnow-primary">
          {title}
        </p>

        <p className="text-[9px] text-resqnow-muted mt-0.5">
          {description}
        </p>
      </div>

      <div
        className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${
          enabled
            ? 'bg-resqnow-violet'
            : 'bg-resqnow-border'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
            enabled
              ? 'left-[22px]'
              : 'left-0.5'
          }`}
        />
      </div>
    </button>
  );
}