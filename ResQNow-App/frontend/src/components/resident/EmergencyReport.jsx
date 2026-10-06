// src/components/resident/EmergencyReport.jsx

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Flame,
  Stethoscope,
  ShieldAlert,
  Waves,
  Car,
  Tent,
  MapPin,
  Phone,
  ChevronDown,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Loader2,
  LocateFixed,
  ShieldCheck,
  Pencil,
  Users,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { emergencyTypes } from '../../data/mockData';
import { createEmergencyReport, uploadReportEvidence } from '../../services/reportService';
import { getBarangayHotline } from '../../utils/contactUtils';
import { buildEmergencySmsMessage, openSmsComposer } from '../../utils/smsFallback';

// ============ ICONS ============
const HOTLINE = getBarangayHotline();
const EMERGENCY_DRAFT_KEY = 'resqnow_emergency_draft_v1';
const MAX_EVIDENCE_SIZE = 5 * 1024 * 1024;

const iconMap = {
  HeartPulse,
  Flame,
  Stethoscope,
  ShieldAlert,
  Waves,
  Car,
  Tent,
};

// ============ EMERGENCY CATEGORY INFO ============
// Resident-friendly labels and descriptions
const emergencyCategoryInfo = {
  'life-death': {
    label: 'Life-Threatening',
    description:
      "Someone's life is in immediate danger.",
  },

  fire: {
    label: 'Fire Emergency',
    description:
      'Active fire, heavy smoke, or immediate fire danger.',
  },

  medical: {
    label: 'Medical Emergency',
    description:
      'Serious injury, illness, or urgent medical help.',
  },

  violence: {
    label: 'Violence / Safety Threat',
    description:
      'Violence, threats, or immediate danger from another person.',
  },

  flood: {
    label: 'Flood Rescue',
    description:
      'Urgent rescue or assistance because of flooding.',
  },

  accident: {
    label: 'Road Accident',
    description:
      'Vehicle crash or serious road-related accident.',
  },

  evacuation: {
    label: 'Urgent Evacuation',
    description:
      'Immediate help is needed to evacuate safely.',
  },
};

// Get information for an emergency type
function getEmergencyInfo(type) {
  return (
    emergencyCategoryInfo[type?.id] || {
      label: type?.label || '',
      description: '',
    }
  );
}

// ============ EMERGENCY REPORT ============
// Fast emergency reporting flow for residents
export default function EmergencyReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  // Emergency form state
  const [selectedType, setSelectedType] =
    useState(null);

  const [locationMode, setLocationMode] =
    useState(null);

  const [location, setLocation] =
    useState('');

  const [latitude, setLatitude] =
    useState(null);

  const [longitude, setLongitude] =
    useState(null);

  const [locationAccuracy, setLocationAccuracy] =
    useState(null);

  const [locationCapturedAt, setLocationCapturedAt] =
    useState(null);

  const [isLocating, setIsLocating] =
    useState(false);

  // Reporting for another person
  const [
    reportingForOther,
    setReportingForOther,
  ] = useState(false);

  const [victimName, setVictimName] =
    useState('');

  const [
    victimContact,
    setVictimContact,
  ] = useState('');

  // Optional information
  const [
    showOptional,
    setShowOptional,
  ] = useState(false);

  const [landmark, setLandmark] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photoUploadStatus, setPhotoUploadStatus] = useState('idle');
  const [photoUploadError, setPhotoUploadError] = useState('');
  const evidenceUploadReportRef = useRef(null);

  // Form and submission state
  const [error, setError] =
    useState('');

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    submittedReport,
    setSubmittedReport,
  ] = useState(null);

  const [notice, setNotice] = useState('');
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [forceSmsFallback, setForceSmsFallback] = useState(false);
  const useSmsFallback = !isOnline || forceSmsFallback;

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoError('Choose a JPG or PNG photo.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_EVIDENCE_SIZE) {
      setPhotoError('The photo must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoError('');
    setError('');
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    setPhotoError('');
    setPhotoUploadStatus('idle');
    setPhotoUploadError('');
  };

  const startPhotoUpload = async (reportCode, evidencePhoto) => {
    evidenceUploadReportRef.current = reportCode;
    setPhotoUploadStatus('uploading');
    setPhotoUploadError('');

    try {
      await uploadReportEvidence(reportCode, evidencePhoto);
      if (evidenceUploadReportRef.current === reportCode) {
        setPhotoUploadStatus('uploaded');
      }
    } catch (uploadError) {
      if (evidenceUploadReportRef.current === reportCode) {
        setPhotoUploadStatus('failed');
        setPhotoUploadError(
          uploadError.message || 'The report was sent, but the photo could not be uploaded.'
        );
      }
    }
  };

  // Restore the resident's unfinished emergency draft.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(EMERGENCY_DRAFT_KEY);
      const draft = raw ? JSON.parse(raw) : null;

      if (draft) {
        const type = emergencyTypes.find((item) => item.id === draft.selectedTypeId);
        if (type) setSelectedType(type);
        if (typeof draft.location === 'string') setLocation(draft.location);
        if (typeof draft.locationMode === 'string') setLocationMode(draft.locationMode);
        if (Number.isFinite(draft.latitude)) setLatitude(draft.latitude);
        if (Number.isFinite(draft.longitude)) setLongitude(draft.longitude);
        if (Number.isFinite(draft.locationAccuracy)) setLocationAccuracy(draft.locationAccuracy);
        if (typeof draft.locationCapturedAt === 'string') setLocationCapturedAt(draft.locationCapturedAt);
        if (typeof draft.landmark === 'string') setLandmark(draft.landmark);
        if (typeof draft.description === 'string') setDescription(draft.description);
        if (typeof draft.reportingForOther === 'boolean') setReportingForOther(draft.reportingForOther);
        if (typeof draft.victimName === 'string') setVictimName(draft.victimName);
        if (typeof draft.victimContact === 'string') setVictimContact(draft.victimContact);
        setNotice('Your saved emergency draft was restored.');
      }
    } catch {
      // Ignore malformed local drafts.
    } finally {
      setDraftHydrated(true);
    }
  }, []);

  // Keep emergency details locally so a weak connection does not erase work.
  useEffect(() => {
    if (!draftHydrated || submittedReport) return;

    const draft = {
      selectedTypeId: selectedType?.id || null,
      location,
      locationMode,
      latitude,
      longitude,
      locationAccuracy,
      locationCapturedAt,
      landmark,
      description,
      reportingForOther,
      victimName,
      victimContact,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(EMERGENCY_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Best-effort offline draft only.
    }
  }, [
    draftHydrated,
    submittedReport,
    selectedType,
    location,
    locationMode,
    latitude,
    longitude,
    locationAccuracy,
    locationCapturedAt,
    landmark,
    description,
    reportingForOther,
    victimName,
    victimContact,
  ]);

  // ============ LOCATION ============
  // Clear location metadata when switching away
  // from the currently captured GPS position.
  const clearGpsMetadata = () => {
    setLocationAccuracy(null);
    setLocationCapturedAt(null);
  };

  // Capture the resident's current device location.
  // This is intentionally separate from the saved
  // home address because the emergency may happen
  // somewhere else.
  const useCurrentLocation = () => {
    setError('');

    if (!navigator.geolocation) {
      setError(
        'Current GPS location is not supported on this device. Use your saved address or enter the location manually.'
      );
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(
          position.coords.latitude
        );
        const lng = Number(
          position.coords.longitude
        );
        const accuracy = Number(
          position.coords.accuracy
        );
        const capturedAt = new Date(
          position.timestamp || Date.now()
        ).toISOString();

        setLatitude(lat);
        setLongitude(lng);
        setLocationAccuracy(
          Number.isFinite(accuracy)
            ? accuracy
            : null
        );
        setLocationCapturedAt(capturedAt);

        // Keep a truthful human-readable value even
        // without depending on an external geocoder.
        setLocation(
          `Current GPS location (${lat.toFixed(6)}, ${lng.toFixed(6)})`
        );

        setLocationMode('gps');
        setError('');
        setIsLocating(false);
      },
      (geoError) => {
        let message =
          'Unable to get your current location. Use your saved address or enter the emergency location manually.';

        if (geoError.code === 1) {
          message =
            'Location permission was denied. Allow location access, use your saved address, or enter the emergency location manually.';
        } else if (geoError.code === 2) {
          message =
            'Your current GPS location is unavailable. Use your saved address or enter the emergency location manually.';
        } else if (geoError.code === 3) {
          message =
            'Getting your current location took too long. Try again, use your saved address, or enter the location manually.';
        }

        setError(message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Use the resident's saved home address.
  // Saved home coordinates are included when the
  // profile has them, but are not described as GPS.
  const useSavedLocation = () => {
    const savedAddress =
      user?.address?.trim();

    if (!savedAddress) {
      setError(
        'No saved home address is available. Enter the emergency location manually.'
      );
      setLocationMode('manual');
      return;
    }

    const savedLat = Number(
      user?.homeLocation?.latitude
    );
    const savedLng = Number(
      user?.homeLocation?.longitude
    );

    setLocation(savedAddress);
    setLocationMode('saved');
    setLatitude(
      Number.isFinite(savedLat)
        ? savedLat
        : null
    );
    setLongitude(
      Number.isFinite(savedLng)
        ? savedLng
        : null
    );
    clearGpsMetadata();
    setError('');
  };

  // Allow resident to enter the actual incident
  // location manually when GPS/saved home is not right.
  const startManualEntry = () => {
    setLocation('');
    setLocationMode('manual');
    setLatitude(null);
    setLongitude(null);
    clearGpsMetadata();
    setError('');
  };

  // ============ VALIDATE REPORT ============
  // Check required emergency information
  // before opening confirmation
  const handleSend = () => {
    setError('');

    if (!selectedType) {
      setError(
        'Please select the type of emergency.'
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    if (!location.trim()) {
      setError(
        'Please set your location so responders know where to go.'
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    setShowConfirm(true);
  };

  const openOfflineSmsFallback = () => {
    if (!HOTLINE?.number) {
      setError('Barangay hotline number is unavailable. Open Contacts and call the barangay directly.');
      return;
    }

    const body = buildEmergencySmsMessage({
      emergencyType: getEmergencyInfo(selectedType).label,
      reporterName: user?.fullName || 'Resident',
      contactNumber: user?.contactNumber || '',
      location: location.trim(),
      latitude,
      longitude,
      landmark: landmark.trim(),
      description: description.trim(),
    });

    try {
      openSmsComposer({ number: HOTLINE.number, body });
      setShowConfirm(false);
      setNotice('The SMS app was opened with your emergency details. Review the message and press Send.');
    } catch (smsError) {
      setError(smsError.message || 'Unable to open the SMS app.');
    }
  };

  // ============ SUBMIT REPORT ============
  // Submit online when available; otherwise hand off to the native SMS app.
  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setError('');
    setNotice('');

    if (useSmsFallback) {
      openOfflineSmsFallback();
      return;
    }

    setIsSubmitting(true);

    try {
      const report =
        await createEmergencyReport({
          // Laravel validates this
          // against the canonical concern codes
          concernCode:
            selectedType.id,

          location:
            location.trim(),

          reportingForOther,

          // Only send victim information
          // when reporting for someone else
          subjectName:
            reportingForOther &&
            victimName.trim()
              ? victimName.trim()
              : undefined,

          subjectContact:
            reportingForOther &&
            victimContact.trim()
              ? victimContact
                  .replace(/\s/g, '')
                  .trim()
              : undefined,

          landmark:
            landmark.trim() ||
            undefined,

          description:
            description.trim() ||
            undefined,

          latitude,
          longitude,
          locationSource:
            locationMode || undefined,
          locationAccuracy:
            locationMode === 'gps'
              ? locationAccuracy
              : undefined,
          locationCapturedAt:
            locationMode === 'gps'
              ? locationCapturedAt
              : undefined,
        });

      // Store Laravel's actual report response.
      // Example ID: EM-000001
      setSubmittedReport(report);
      setForceSmsFallback(false);

      // The emergency is already recorded before optional evidence uploads.
      if (photo) {
        void startPhotoUpload(report.id, photo);
      }

      try {
        localStorage.removeItem(EMERGENCY_DRAFT_KEY);
      } catch {
        // Ignore local-storage cleanup failures.
      }

      setShowConfirm(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (submitError) {
      // Get the first Laravel validation message
      // when available.
      const validationMessages =
        Object.values(
          submitError.errors || {}
        ).flat();

      const message =
        validationMessages[0] ||
        submitError.message ||
        'Unable to submit the emergency report. Please try again.';

      setError(message);

      if (submitError?.status === 0) {
        setForceSmsFallback(true);
        setNotice('The ResQNow server could not be reached. Your draft is saved. Review the form again to open the SMS fallback, or call the barangay hotline now.');
      }

      // Close modal so the resident can
      // see and correct the problem.
      setShowConfirm(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ RESET FORM ============
  const resetForm = () => {
    evidenceUploadReportRef.current = null;
    setSubmittedReport(null);

    setSelectedType(null);
    setLocation('');
    setLocationMode(null);
    setLatitude(null);
    setLongitude(null);
    setLocationAccuracy(null);
    setLocationCapturedAt(null);
    setIsLocating(false);

    setLandmark('');
    setDescription('');
    setPhoto(null);
    setPhotoPreview('');
    setPhotoError('');
    setPhotoUploadStatus('idle');
    setPhotoUploadError('');

    setVictimName('');
    setVictimContact('');

    setReportingForOther(false);
    setShowOptional(false);

    setShowConfirm(false);
    setError('');
    setNotice('');

    try {
      localStorage.removeItem(EMERGENCY_DRAFT_KEY);
    } catch {
      // Ignore local-storage cleanup failures.
    }
  };

  // ============ SUCCESS ============
  if (submittedReport) {
    return (
      <div className="px-4 pt-6 pb-28 min-h-screen">

        {/* Success card */}
        <div className="bg-white border border-resqnow-safe/30 rounded-2xl overflow-hidden">

          {/* Success line */}
          <div className="h-1 bg-active-gradient" />

          <div className="p-5 text-center">

            {/* Success icon */}
            <div className="w-14 h-14 rounded-full bg-resqnow-safe/15 flex items-center justify-center mx-auto mb-3">

              <CheckCircle2 className="w-7 h-7 text-resqnow-safe" />
            </div>

            <h1 className="text-lg font-bold text-resqnow-primary">
              Emergency Report Submitted
            </h1>

            <p className="text-[12px] text-resqnow-muted mt-1.5 leading-relaxed">
              Your emergency report has been received by ResQNow. Keep your phone nearby while barangay response is being coordinated.
            </p>

            {/* REAL REPORT ID FROM LARAVEL */}
            <div className="mt-4 bg-resqnow-safe/10 border border-resqnow-safe/20 rounded-xl p-3.5">

              <p className="text-[10px] font-bold text-resqnow-safe uppercase tracking-wide">
                Report ID
              </p>

              <p className="text-lg font-bold text-resqnow-primary mt-0.5">
                {submittedReport.id}
              </p>

              <p className="text-[11px] text-resqnow-muted mt-0.5">
                {getEmergencyInfo(
                  selectedType
                ).label}
              </p>
            </div>

            {/* Report summary */}
            <div className="mt-4 text-left bg-resqnow-canvas rounded-xl p-3.5">

              <InfoRow
                label="Reporter"
                value={
                  user?.fullName ||
                  'Resident'
                }
              />

              <InfoRow
                label="Location"
                value={
                  submittedReport.location ||
                  location
                }
              />

              {reportingForOther &&
                victimName && (
                  <InfoRow
                    label="For"
                    value={
                      submittedReport.subjectName ||
                      victimName
                    }
                  />
                )}

              {/* Backend status */}
              <div className="flex justify-between gap-4 py-1">

                <span className="text-[11px] text-resqnow-muted shrink-0">
                  Status
                </span>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-resqnow-info/15 text-resqnow-info">
                  {submittedReport.status ||
                    'Submitted'}
                </span>
              </div>
            </div>

            {photo && (
              <div className="mt-3 rounded-xl bg-resqnow-canvas px-3.5 py-3 text-left">
                <div className="flex items-center gap-2">
                  {photoUploadStatus === 'uploading' ? (
                    <Loader2 className="w-4 h-4 text-resqnow-violet animate-spin shrink-0" />
                  ) : (
                    <Camera className="w-4 h-4 text-resqnow-violet shrink-0" />
                  )}
                  <p className="text-[11px] font-semibold text-resqnow-primary">
                    {photoUploadStatus === 'uploaded' && 'Photo evidence attached'}
                    {photoUploadStatus === 'uploading' && 'Uploading photo evidence'}
                    {photoUploadStatus === 'failed' && 'Report sent; photo upload failed'}
                    {photoUploadStatus === 'idle' && 'Photo evidence is optional'}
                  </p>
                </div>
                {photoUploadStatus === 'failed' && (
                  <div className="mt-2">
                    <p role="alert" className="text-[10px] text-resqnow-critical">
                      {photoUploadError}
                    </p>
                    <button
                      type="button"
                      onClick={() => void startPhotoUpload(submittedReport.id, photo)}
                      className="mt-2 min-h-10 rounded-lg border border-resqnow-border-soft bg-white px-3 text-[11px] font-semibold text-resqnow-primary"
                    >
                      Retry photo upload
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* View this report */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/track/${submittedReport.id}`
                )
              }
              className="w-full mt-4 py-3 rounded-xl bg-brand-gradient text-white text-[13px] font-semibold active:scale-[0.99] transition-all"
            >
              Track This Report
            </button>

            {HOTLINE && (
              <a
                href={HOTLINE.href}
                className="w-full mt-2 min-h-[46px] rounded-xl border border-resqnow-critical/25 bg-resqnow-critical/5 text-resqnow-critical text-[12px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Barangay Hotline
              </a>
            )}

            {/* Back home */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/dashboard'
                )
              }
              className="w-full mt-2 py-3 rounded-xl border border-resqnow-border bg-white text-resqnow-muted text-[12px] font-semibold hover:bg-resqnow-canvas transition-colors"
            >
              Back to Home
            </button>

            {/* Submit another */}
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-2 py-3 rounded-xl border border-resqnow-border-soft bg-white text-resqnow-muted text-[12px] font-semibold hover:bg-resqnow-canvas transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN FORM ============
  return (
    <div className="px-4 pt-4 pb-28 min-h-screen">

      {/* ============ HEADER ============ */}
      <div className="mb-3">

        <div className="flex items-center gap-2">

          <AlertTriangle className="w-5 h-5 text-resqnow-critical" />

          <h1 className="text-lg font-bold text-resqnow-primary">
            Emergency Report
          </h1>
        </div>
      </div>

      {!isOnline && (
        <div className="mb-3 flex items-start gap-2 bg-resqnow-pending/10 border border-resqnow-pending/25 rounded-xl px-3 py-2.5">
          <Phone className="w-4 h-4 text-resqnow-pending mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-resqnow-primary">Offline Mode</p>
            <p className="text-[10px] text-resqnow-secondary mt-0.5 leading-relaxed">
              Your form is saved on this device. Complete the emergency details, then ResQNow will open a formatted SMS for you to review and send.
            </p>
          </div>
        </div>
      )}

      {notice && (
        <div className="mb-3 flex items-start gap-2 bg-resqnow-violet/8 border border-resqnow-violet/20 rounded-xl px-3 py-2.5">
          <ShieldCheck className="w-4 h-4 text-resqnow-violet mt-0.5 shrink-0" />
          <p className="text-[11px] text-resqnow-secondary">{notice}</p>
        </div>
      )}

      {/* ============ ERROR ============ */}
      {error && (
        <div className="mb-3 flex items-start gap-2 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl px-3 py-2.5">

          <AlertTriangle className="w-4 h-4 text-resqnow-critical mt-0.5 shrink-0" />

          <p className="text-[11px] text-resqnow-crimson">
            {error}
          </p>
        </div>
      )}

      {/* ============ EMERGENCY TYPE ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-3 mb-3">

        <h2 className="text-sm font-bold text-resqnow-primary px-1 mb-2">
          What is the emergency?
        </h2>

        <div className="grid grid-cols-2 gap-2">

          {emergencyTypes.map(
            (type) => {
              const Icon =
                iconMap[type.icon] ||
                AlertTriangle;

              const selected =
                selectedType?.id ===
                type.id;

              const info =
                getEmergencyInfo(
                  type
                );

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(
                      type
                    );

                    setError('');
                  }}
                  className={`p-2.5 min-h-[112px] rounded-xl border text-left active:scale-[0.98] transition-all ${
                    type.id ===
                    'evacuation'
                      ? 'col-span-2'
                      : ''
                  } ${
                    selected
                      ? 'bg-resqnow-critical/10 border-resqnow-critical/30 ring-1 ring-resqnow-critical/20'
                      : 'bg-white border-resqnow-border-soft hover:border-resqnow-critical/30 hover:bg-resqnow-critical/5'
                  }`}
                >

                  {/* Category icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selected
                        ? 'bg-resqnow-critical/15 text-resqnow-critical'
                        : 'bg-resqnow-canvas text-resqnow-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Category label */}
                  <p
                    className={`text-[12px] font-bold mt-2 leading-snug ${
                      selected
                        ? 'text-resqnow-critical'
                        : 'text-resqnow-primary'
                    }`}
                  >
                    {info.label}
                  </p>

                  {/* Description */}
                  <p
                    className={`text-[9px] mt-1.5 leading-relaxed ${
                      selected
                        ? 'text-resqnow-critical/80'
                        : 'text-resqnow-muted'
                    }`}
                  >
                    {
                      info.description
                    }
                  </p>
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-3 mb-3">

        <div className="px-1 mb-2">

          <div className="flex items-center gap-2">

            <MapPin className="w-4 h-4 text-resqnow-violet" />

            <h2 className="text-sm font-bold text-resqnow-primary">
              Where should responders go?
            </h2>
          </div>

          <p className="text-[10px] text-resqnow-muted mt-0.5">
            Choose the actual emergency location. Current GPS is best when available.
          </p>
        </div>

        {/* Current GPS */}
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={isLocating}
          className={`w-full flex items-center gap-2.5 p-3 rounded-xl border active:scale-[0.99] transition-all disabled:opacity-70 ${
            locationMode === 'gps'
              ? 'bg-resqnow-violet/10 border-resqnow-violet/30'
              : 'bg-resqnow-violet border-resqnow-violet hover:bg-resqnow-violet/90'
          }`}
        >

          {isLocating ? (
            <Loader2 className="w-5 h-5 text-white animate-spin shrink-0" />
          ) : (
            <LocateFixed
              className={`w-5 h-5 shrink-0 ${
                locationMode === 'gps'
                  ? 'text-resqnow-violet'
                  : 'text-white'
              }`}
            />
          )}

          <div className="flex-1 text-left">

            <p
              className={`text-[12px] font-semibold ${
                locationMode === 'gps'
                  ? 'text-resqnow-primary'
                  : 'text-white'
              }`}
            >
              {isLocating
                ? 'Getting current GPS location...'
                : locationMode === 'gps'
                  ? 'Current GPS location captured'
                  : 'Use Current GPS Location'}
            </p>

            {locationMode === 'gps' && (
              <>
                <p className="text-[10px] text-resqnow-violet mt-0.5 break-words">
                  {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                </p>

                {locationAccuracy !== null && (
                  <p className="text-[10px] text-resqnow-muted mt-0.5">
                    Accuracy approximately ±{Math.round(locationAccuracy)} meters
                  </p>
                )}
              </>
            )}
          </div>

          {locationMode === 'gps' && (
            <ShieldCheck className="w-5 h-5 text-resqnow-violet shrink-0" />
          )}
        </button>

        {locationMode === 'gps' &&
          locationAccuracy !== null &&
          locationAccuracy > 100 && (
            <div className="mt-2 rounded-xl border border-resqnow-pending/25 bg-resqnow-pending/5 px-3 py-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-resqnow-pending mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-resqnow-primary">
                    GPS accuracy is limited (about ±{Math.round(locationAccuracy)} m)
                  </p>
                  <p className="text-[10px] text-resqnow-muted mt-1 leading-relaxed">
                    Add a nearby landmark or try GPS again to help responders locate the exact place. You can still continue if the situation is urgent.
                  </p>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={isLocating}
                    className="mt-2 min-h-[36px] px-3 rounded-lg border border-resqnow-pending/25 bg-white text-resqnow-pending text-[10px] font-bold disabled:opacity-60"
                  >
                    Try GPS Again
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Saved home address */}
        <button
          type="button"
          onClick={useSavedLocation}
          className={`mt-2 w-full flex items-center gap-2.5 p-3 rounded-xl border text-left active:scale-[0.99] transition-all ${
            locationMode === 'saved'
              ? 'bg-resqnow-info/10 border-resqnow-info/30'
              : 'bg-white border-resqnow-border-soft hover:border-resqnow-info/30'
          }`}
        >
          <MapPin
            className={`w-5 h-5 shrink-0 ${
              locationMode === 'saved'
                ? 'text-resqnow-info'
                : 'text-resqnow-muted'
            }`}
          />

          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-resqnow-primary">
              Use Saved Home Address
            </p>
            <p className="text-[10px] text-resqnow-muted mt-0.5 break-words">
              {user?.address || 'No saved address available'}
            </p>
          </div>

          {locationMode === 'saved' && (
            <ShieldCheck className="w-5 h-5 text-resqnow-info shrink-0" />
          )}
        </button>

        {/* Manual location */}
        {locationMode === 'manual' ? (
          <div className="mt-2">
            <textarea
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setError('');
              }}
              rows="2"
              autoFocus
              placeholder={
                reportingForOther
                  ? 'Where is the person located?'
                  : 'Type the emergency location'
              }
              className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[12px] text-resqnow-primary resize-none outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={startManualEntry}
            className="mt-2 w-full flex items-center gap-2.5 p-3 rounded-xl border border-resqnow-border-soft bg-white text-left hover:border-resqnow-violet/30 active:scale-[0.99] transition-all"
          >
            <Pencil className="w-5 h-5 text-resqnow-muted shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-resqnow-primary">
                Enter Another Location
              </p>
              <p className="text-[10px] text-resqnow-muted mt-0.5">
                Use this when the emergency is somewhere else.
              </p>
            </div>
          </button>
        )}

        {/* Landmark stays visible because it materially helps responders. */}
        <div className="mt-3 pt-3 border-t border-resqnow-border-soft">
          <label className="block text-[11px] font-semibold text-resqnow-secondary mb-1">
            Nearest Landmark
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="Example: Blue gate beside the covered court"
            className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[12px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
          />
          <p className="text-[10px] text-resqnow-muted mt-1">
            Strongly recommended — landmarks help responders find the exact place faster.
          </p>
        </div>
      </section>

      {/* ============ REPORTING FOR SOMEONE ELSE ============ */}
      <section
        className={`rounded-2xl border p-3 mb-3 transition-colors ${
          reportingForOther
            ? 'border-resqnow-violet/30 bg-resqnow-violet/5'
            : 'border-resqnow-border-soft bg-white'
        }`}
      >

        <button
          type="button"
          onClick={() =>
            setReportingForOther(
              (prev) => !prev
            )
          }
          className="w-full flex items-center gap-2.5 text-left"
        >

          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              reportingForOther
                ? 'bg-resqnow-violet/10 text-resqnow-violet'
                : 'bg-resqnow-canvas text-resqnow-muted'
            }`}
          >
            <Users className="w-4 h-4" />
          </div>

          <div className="flex-1">

            <p
              className={`text-[13px] font-bold ${
                reportingForOther
                  ? 'text-resqnow-violet'
                  : 'text-resqnow-primary'
              }`}
            >
              Reporting for someone else?
            </p>

            <p className="text-[10px] text-resqnow-muted mt-0.5">
              {reportingForOther
                ? "Add the victim's details below."
                : 'Tap if the emergency is for another person.'}
            </p>
          </div>

          {/* Toggle */}
          <div
            className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${
              reportingForOther
                ? 'bg-resqnow-violet'
                : 'bg-resqnow-border'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                reportingForOther
                  ? 'left-[22px]'
                  : 'left-0.5'
              }`}
            />
          </div>
        </button>

        {/* Victim information */}
        {reportingForOther && (
          <div className="mt-3 pt-3 border-t border-resqnow-violet/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">

            <div>

              <label className="block text-[10px] font-semibold text-resqnow-secondary mb-1">
                Victim Name
              </label>

              <input
                type="text"
                value={victimName}
                onChange={(e) =>
                  setVictimName(
                    e.target.value
                  )
                }
                placeholder="I don't know the name"
                className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[12px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
              />
            </div>

            <div>

              <label className="block text-[10px] font-semibold text-resqnow-secondary mb-1">
                Victim Contact
              </label>

              <input
                type="tel"
                value={victimContact}
                onChange={(e) =>
                  setVictimContact(
                    e.target.value
                  )
                }
                placeholder="Optional"
                className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[12px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
              />
            </div>
          </div>
        )}
      </section>

      {/* ============ REPORTER INFO ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-3 mb-3">

        <div className="flex items-center gap-2 px-1">

          <ShieldCheck className="w-4 h-4 text-resqnow-mint shrink-0" />

          <p className="text-[11px] text-resqnow-muted">
            Your name, contact, address, and purok are connected to your resident account.
          </p>
        </div>
      </section>

      {/* ============ OPTIONAL DETAILS ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-3">

        <button
          type="button"
          onClick={() =>
            setShowOptional(
              (prev) => !prev
            )
          }
          className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-resqnow-canvas transition-colors"
        >

          <div>

            <h2 className="text-[13px] font-bold text-resqnow-primary">
              Optional Details
            </h2>

            <p className="text-[10px] text-resqnow-muted mt-0.5">
              Add a short description if it helps responders prepare.
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-resqnow-muted transition-transform ${
              showOptional
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {showOptional && (
          <div className="px-3.5 pb-3.5 border-t border-resqnow-border-soft">

            <div className="mt-3">

              <label className="block text-[11px] font-semibold text-resqnow-secondary mb-1">
                Short Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows="2"
                placeholder="Briefly describe what is happening..."
                className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-2.5 text-[12px] text-resqnow-primary resize-none outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10"
              />
            </div>
          </div>
        )}
      </section>

      {/* ============ OPTIONAL PHOTO EVIDENCE ============ */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-3 mb-3">
        <div className="flex items-center gap-2 px-1 mb-2">
          <Camera className="w-4 h-4 text-resqnow-violet" />
          <div>
            <h2 className="text-[13px] font-bold text-resqnow-primary">
              Photo Evidence <span className="font-medium text-resqnow-muted">(Optional)</span>
            </h2>
            <p className="text-[10px] text-resqnow-muted mt-0.5">
              JPG or PNG up to 5 MB. Attach only if it is safe; never delay reporting.
            </p>
          </div>
        </div>

        {useSmsFallback ? (
          <p className="rounded-xl bg-resqnow-caution/10 px-3 py-2.5 text-[11px] text-resqnow-secondary">
            Photo upload is unavailable in SMS fallback. Send the SMS now and contact the barangay with evidence when safe.
          </p>
        ) : photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Emergency evidence preview"
              className="w-full h-40 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={removePhoto}
              aria-label="Remove emergency evidence photo"
              className="absolute top-2 right-2 w-11 h-11 bg-resqnow-primary/85 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block min-h-12 border-2 border-dashed border-resqnow-border-soft rounded-xl p-4 text-center cursor-pointer hover:bg-resqnow-violet/5 hover:border-resqnow-violet/20 focus-within:ring-2 focus-within:ring-resqnow-violet/30 transition-colors">
            <span className="text-[12px] font-semibold text-resqnow-secondary">
              Add Photo
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoChange}
              className="sr-only"
              aria-label="Add optional emergency photo evidence"
            />
          </label>
        )}

        {photoError && (
          <p role="alert" className="mt-2 text-[11px] font-semibold text-resqnow-critical">
            {photoError}
          </p>
        )}
      </section>

      {/* ============ SIGNAL WARNING ============ */}
      <div className="flex items-start gap-2 bg-resqnow-caution/10 border border-resqnow-caution/20 rounded-xl px-3 py-2.5 mb-3">

        <Phone className="w-3.5 h-3.5 text-resqnow-caution mt-0.5 shrink-0" />

        <p className="text-[10px] text-resqnow-secondary leading-relaxed flex-1">
          Weak signal? Call the hotline directly.{' '}

          {HOTLINE ? (
            <a
              href={HOTLINE.href}
              className="font-bold text-resqnow-primary underline"
            >
              Call {HOTLINE.displayNumber}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/contacts')}
              className="font-bold text-resqnow-primary underline"
            >
              View Contacts
            </button>
          )}
        </p>
      </div>

      {/* ============ SEND ============ */}
      <button
        type="button"
        onClick={handleSend}
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl bg-emergency-gradient text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,45,85,0.35)] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {useSmsFallback ? 'Review SMS Emergency Fallback' : 'Review Emergency Report'}
      </button>

      <p className="text-[10px] text-resqnow-muted text-center mt-2 leading-relaxed">
        Review the details before sending. If the situation is life-threatening, call the barangay hotline immediately.
      </p>

      {/* ============ CONFIRM MODAL ============ */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">

          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5">

            <div className="flex items-center gap-2 mb-3">

              <AlertTriangle className="w-5 h-5 text-resqnow-critical" />

              <h3 className="text-base font-bold text-resqnow-primary">
                Confirm Emergency Report
              </h3>
            </div>

            <p className="text-[12px] text-resqnow-muted leading-relaxed mb-3">
              {useSmsFallback
                ? 'The online service is unavailable. ResQNow will open your phone SMS app with these emergency details already formatted. Review the message and press Send in the SMS app.'
                : 'Check the details below. Sending this report will share your resident account information and emergency location with authorized barangay personnel.'}
            </p>

            {/* Confirmation information */}
            <div className="bg-resqnow-canvas rounded-xl p-3.5 mb-4">

              <InfoRow
                label="Type"
                value={getEmergencyInfo(
                  selectedType
                ).label}
              />

              <InfoRow
                label="Location"
                value={location}
              />

              {locationMode === 'gps' &&
                locationAccuracy !== null && (
                  <InfoRow
                    label="GPS accuracy"
                    value={`±${Math.round(locationAccuracy)} m`}
                  />
                )}

              <InfoRow
                label="Reporter"
                value={
                  user?.fullName ||
                  'Resident'
                }
              />

              <InfoRow
                label="Contact"
                value={
                  user?.contactNumber ||
                  'Not provided'
                }
              />

              {reportingForOther &&
                victimName && (
                  <InfoRow
                    label="Victim"
                    value={
                      victimName
                    }
                  />
                  )}

              {photo && (
                <InfoRow
                  label="Photo evidence"
                  value={useSmsFallback ? 'Not included in SMS' : 'Uploads after the report is sent'}
                />
              )}
            </div>

            {/* REAL API SUBMIT */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emergency-gradient text-white text-[14px] font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99] transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                useSmsFallback ? 'Open SMS App' : 'Send Emergency Report'
              )}
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  false
                )
              }
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl border border-resqnow-border bg-white text-resqnow-muted text-[13px] font-semibold hover:bg-resqnow-canvas disabled:opacity-60 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ INFO ROW ============
function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex justify-between gap-4 py-1">

      <span className="text-[11px] text-resqnow-muted shrink-0">
        {label}
      </span>

      <span className="text-[11px] font-medium text-resqnow-primary text-right break-words">
        {value}
      </span>
    </div>
  );
}
