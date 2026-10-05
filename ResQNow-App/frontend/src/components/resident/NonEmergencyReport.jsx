// src/components/resident/NonEmergencyReport.jsx

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Tent,
  Stethoscope,
  TreePine,
  Wrench,
  Broom,
  MessageSquare,
  CircleHelp,
  MapPin,
  UserRound,
  Users,
  HandHeart,
  Camera,
  ChevronDown,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  nonEmergencyTypes,
  purokOptions,
} from '../../data/mockData';

import {
  createNonEmergencyReport,
} from '../../services/reportService';

import {
  getStatusStyle,
  getPriorityStyle,
} from '../../utils/statusUtils';

import Modal from '../common/Modal';

// ============ ICONS ============

const iconMap = {
  'evac-assistance': Tent,
  'bhw-assistance': Stethoscope,
  'road-obstruction': TreePine,
  'damaged-facility': Wrench,
  cleanup: Broom,
  'community-concern': MessageSquare,
  'other-assistance': CircleHelp,
};

// ============ CATEGORY INFORMATION ============

const concernCategoryInfo = {
  'evac-assistance': {
    label: 'Evacuation Help',
    description:
      'Non-urgent help preparing for or getting to an evacuation center.',
  },

  'bhw-assistance': {
    label: 'Health Worker Assistance',
    description:
      'Request a BHW visit, health check, or basic health assistance.',
  },

  'road-obstruction': {
    label: 'Blocked Road / Obstruction',
    description:
      'Tree, debris, vehicle, or object is blocking a road or pathway.',
  },

  'damaged-facility': {
    label: 'Damaged Public Facility',
    description:
      'Damaged streetlight, road, drainage, or barangay facility.',
  },

  cleanup: {
    label: 'Community Clean-Up',
    description:
      'Waste, branches, or scattered debris needs barangay clean-up.',
  },

  'community-concern': {
    label: 'Community Concern',
    description:
      'Sanitation, noise, stray animals, or other neighborhood concerns.',
  },

  'other-assistance': {
    label: 'Other Barangay Assistance',
    description:
      'Request barangay help that does not fit the categories above.',
  },
};

function getConcernInfo(type) {
  return (
    concernCategoryInfo[type?.id] || {
      label:
        type?.label || '',
      description: '',
    }
  );
}

// ============ SUBCATEGORIES ============

const subcategories = {
  'evac-assistance': [
    'Transportation',
    'Temporary Shelter',
    'Supplies',
  ],

  'bhw-assistance': [
    'Health Check',
    'Home Visit',
    'Medicine Assistance',
  ],

  'road-obstruction': [
    'Fallen Tree / Branch',
    'Debris Blocking Road',
    'Vehicle / Object Blocking Road',
    'Other Road Obstruction',
  ],

  'damaged-facility': [
    'Street Light',
    'Road',
    'Drainage',
    'Barangay Facility',
  ],

  cleanup: [
    'Waste Collection',
    'Storm Debris / Branches',
    'Drainage Clean-up',
  ],

  'community-concern': [
    'Sanitation',
    'Noise',
    'Stray Animals',
    'Public Area',
  ],
};

const affectedOptions = [
  'Child',
  'Senior Citizen',
  'PWD',
  'Pregnant Person',
  'Injured Person',
];

// ============ MAIN COMPONENT ============

export default function NonEmergencyReport() {
  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  // ============ CONCERN ============

  const [
    selectedType,
    setSelectedType,
  ] = useState(null);

  const [
    subcategory,
    setSubcategory,
  ] = useState('');

  // ============ REPORTING FOR ============

  const [
    reportingFor,
    setReportingFor,
  ] = useState('Myself');

  const [
    personName,
    setPersonName,
  ] = useState('');

  const [
    personContact,
    setPersonContact,
  ] = useState('');

  const [
    relationship,
    setRelationship,
  ] = useState('');

  // ============ LOCATION ============

  const [
    purok,
    setPurok,
  ] = useState(
    user?.purok ||
      'Purok 1'
  );

  const [
    location,
    setLocation,
  ] = useState(
    user?.address || ''
  );

  const [
    landmark,
    setLandmark,
  ] = useState('');

  const [
    showLocation,
    setShowLocation,
  ] = useState(false);

  // ============ DETAILS ============

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    assistance,
    setAssistance,
  ] = useState('');

  const [
    affected,
    setAffected,
  ] = useState([]);

  // ============ PHOTO ============

  // Actual File sent to Laravel.
  const [
    photo,
    setPhoto,
  ] = useState(null);

  // Local browser preview only.
  const [
    photoPreview,
    setPhotoPreview,
  ] = useState('');

  // ============ FORM STATE ============

  const [
    error,
    setError,
  ] = useState('');

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

  // Additional protection against
  // rapid double submission.
  const submissionInFlight =
    useRef(false);

  // ============ CLEAN UP PHOTO PREVIEW ============

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview
        );
      }
    };
  }, [photoPreview]);

  // ============ AVAILABLE SUBCATEGORIES ============

  const availableSubcategories =
    selectedType
      ? subcategories[
          selectedType.id
        ] || []
      : [];

  // ============ AFFECTED INDIVIDUALS ============

  const toggleAffected = (
    item
  ) => {
    setAffected(
      (previous) =>
        previous.includes(item)
          ? previous.filter(
              (person) =>
                person !== item
            )
          : [
              ...previous,
              item,
            ]
    );
  };

  // ============ PHOTO HANDLING ============

  const handlePhoto = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        'image/jpeg',
        'image/png',
      ].includes(file.type)
    ) {
      setError(
        'Please choose a JPG or PNG photo.'
      );

      event.target.value =
        '';

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    // Remove previous object URL.
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    setPhoto(file);

    setPhotoPreview(
      URL.createObjectURL(
        file
      )
    );

    setError('');
  };

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    setPhoto(null);
    setPhotoPreview('');
  };

  // ============ REVIEW ============

  // Bring the field that needs attention into view. Jumping to the top of the
  // page (where the banner is) made "Review Report" feel like a dead button.
  const focusSection = (id) => {
    window.setTimeout(() => {
      const element = document.getElementById(id);

      element?.scrollIntoView({ block: 'center', behavior: 'smooth' });

      if (typeof element?.focus === 'function') {
        element.focus({ preventScroll: true });
      }
    }, 60);
  };

  const handleReview = () => {
    if (
      submissionInFlight.current
    ) {
      return;
    }

    setError('');

    if (!selectedType) {
      setError(
        'Please select a concern type.'
      );

      focusSection('ne-concern');

      return;
    }

    if (
      !location.trim()
    ) {
      setShowLocation(true);

      setError(
        'Please provide the incident location.'
      );

      focusSection('ne-location');

      return;
    }

    if (
      !description.trim()
    ) {
      setError(
        'Please add a short description of the concern.'
      );

      focusSection('ne-description');

      return;
    }

    setShowConfirm(true);
  };

  // ============ SUBMIT TO LARAVEL ============

  const handleSubmit =
    async () => {
      if (
        submissionInFlight.current ||
        !showConfirm ||
        !selectedType
      ) {
        return;
      }

      submissionInFlight.current =
        true;

      setError('');
      setIsSubmitting(true);

      try {
        const forAnotherPerson =
          reportingFor ===
          'Another Person';

        const report =
          await createNonEmergencyReport({
            concernCode:
              selectedType.id,

            subcategory:
              subcategory ||
              undefined,

            reportingFor,

            subjectName:
              forAnotherPerson
                ? personName.trim() ||
                  undefined
                : undefined,

            subjectContact:
              forAnotherPerson
                ? personContact
                    .replace(
                      /[\s-]/g,
                      ''
                    ) ||
                  undefined
                : undefined,

            relationshipNote:
              forAnotherPerson
                ? relationship.trim() ||
                  undefined
                : undefined,

            purok,

            location:
              location.trim(),

            landmark:
              landmark.trim() ||
              undefined,

            description:
              description.trim(),

            requiredAssistance:
              assistance.trim() ||
              undefined,

            affectedIndividuals:
              affected,

            photo:
              photo ||
              undefined,
          });

        // A real submission must return
        // the database-generated report code.
        if (!report?.id) {
          throw new Error(
            'The server did not return a report ID. Check My Reports before submitting again.'
          );
        }

        setSubmittedReport(
          report
        );

        setShowConfirm(false);

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } catch (
        submitError
      ) {
        const validationMessages =
          Object.values(
            submitError?.errors ||
              {}
          ).flat();

        setError(
          validationMessages.find(
            (message) =>
              typeof message ===
              'string'
          ) ||
            submitError?.message ||
            'Unable to submit the report. Please try again.'
        );

        // Keep the review open so the message is
        // seen right where the user just tapped,
        // and Confirm & Submit can be retried.
      } finally {
        submissionInFlight.current =
          false;

        setIsSubmitting(false);
      }
    };

  // ============ SUCCESS SCREEN ============

  if (submittedReport) {
    return (
      <div className="px-4 pt-8 pb-28 min-h-screen">

        <div className="bg-white border border-resqnow-safe/30 rounded-2xl overflow-hidden">

          <div className="h-1 bg-brand-gradient" />

          <div className="p-6 text-center">

            <div className="w-16 h-16 rounded-full bg-resqnow-safe/15 flex items-center justify-center mx-auto mb-4">

              <CheckCircle2 className="w-8 h-8 text-resqnow-safe" />
            </div>

            <h1 className="text-xl font-bold text-resqnow-primary">
              Report Submitted
            </h1>

            <p className="text-[13px] text-resqnow-muted mt-2 leading-relaxed">
              Your report was successfully sent and is awaiting barangay review.
            </p>

            {/* REPORT ID */}
            <div className="mt-5 bg-resqnow-violet/5 border border-resqnow-violet/15 rounded-xl p-4">

              <p className="text-[11px] font-bold text-resqnow-violet uppercase tracking-wide">
                Report ID
              </p>

              <p className="text-lg font-bold text-resqnow-primary mt-1">
                {
                  submittedReport.id
                }
              </p>

              <p className="text-[12px] text-resqnow-muted mt-1">
                {
                  submittedReport.concernType ||
                  getConcernInfo(
                    selectedType
                  ).label
                }
              </p>
            </div>

            {/* SUMMARY */}
            <div className="mt-4 bg-resqnow-canvas rounded-xl p-4 text-left">

              <div className="flex items-center justify-between gap-4 py-2.5 border-b border-resqnow-border-soft">

                <span className="text-[12px] text-resqnow-muted">
                  Status
                </span>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusStyle(
                    submittedReport.status
                  )}`}
                >
                  {
                    submittedReport.status ||
                    'Not provided'
                  }
                </span>
              </div>

              {submittedReport.priority && (
                <div className="flex items-center justify-between gap-4 py-2.5 border-b border-resqnow-border-soft">

                  <span className="text-[12px] text-resqnow-muted">
                    Priority
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getPriorityStyle(
                      submittedReport.priority
                    )}`}
                  >
                    {
                      submittedReport.priority
                    }
                  </span>
                </div>
              )}

              <InfoRow
                label="Location"
                value={
                  submittedReport.location ||
                  location
                }
              />

              <InfoRow
                label="Reporter"
                value={
                  user?.fullName ||
                  user?.name ||
                  'Resident'
                }
              />
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/track/${encodeURIComponent(
                    submittedReport.id
                  )}`
                )
              }
              className="w-full mt-5 min-h-[48px] py-3 rounded-xl bg-brand-gradient text-white text-[14px] font-semibold shadow-[0_4px_16px_rgba(131,70,242,0.20)] active:scale-[0.99] transition-all"
            >
              Track This Report
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/dashboard'
                )
              }
              className="w-full mt-2 min-h-[48px] py-3 rounded-xl border border-resqnow-border bg-white text-resqnow-muted text-[13px] font-semibold hover:bg-resqnow-canvas transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN FORM ============

  return (
    <div className="px-4 pt-5 pb-28 min-h-screen">

      {/* HEADER */}
      <div className="mb-4">

        <h1 className="text-xl font-bold text-resqnow-primary">
          Non-Emergency Report
        </h1>

        <p className="text-[13px] text-resqnow-muted mt-1">
          Report a barangay concern or request assistance.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 text-resqnow-critical shrink-0 mt-0.5" />

          <p className="text-[12px] text-resqnow-crimson leading-relaxed">
            {error}
          </p>
        </div>
      )}

      {/* REPORTING FOR */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <h2 className="text-[15px] font-bold text-resqnow-primary">
          Who is this report for?
        </h2>

        <p className="text-[12px] text-resqnow-muted mt-1">
          Tell us who may need barangay assistance.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">

          <ChoiceButton
            selected={
              reportingFor ===
              'Myself'
            }
            label="Myself"
            icon={UserRound}
            onClick={() =>
              setReportingFor(
                'Myself'
              )
            }
          />

          <ChoiceButton
            selected={
              reportingFor ===
              'Another Person'
            }
            label="Another Person"
            icon={Users}
            onClick={() =>
              setReportingFor(
                'Another Person'
              )
            }
          />
        </div>

        {reportingFor ===
          'Another Person' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-resqnow-border-soft">

            <Field label="Name">
              <input
                type="text"
                value={
                  personName
                }
                onChange={(
                  event
                ) =>
                  setPersonName(
                    event.target
                      .value
                  )
                }
                placeholder="If known"
                className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
              />
            </Field>

            <Field label="Contact Number">
              <input
                type="tel"
                value={
                  personContact
                }
                onChange={(
                  event
                ) =>
                  setPersonContact(
                    event.target
                      .value
                  )
                }
                placeholder="Optional"
                className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
              />
            </Field>

            <div className="sm:col-span-2">

              <Field label="Relationship / Note">
                <input
                  type="text"
                  value={
                    relationship
                  }
                  onChange={(
                    event
                  ) =>
                    setRelationship(
                      event.target
                        .value
                    )
                  }
                  placeholder="Example: Neighbor"
                  className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
                />
              </Field>
            </div>
          </div>
        )}
      </section>

      {/* CONCERN TYPE */}
      <section
        id="ne-concern"
        tabIndex={-1}
        className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4 outline-none"
      >

        <h2 className="text-[15px] font-bold text-resqnow-primary">
          What is your concern?
        </h2>

        <p className="text-[12px] text-resqnow-muted mt-1">
          Select the category that best matches your report.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">

          {nonEmergencyTypes.map(
            (type) => {
              const Icon =
                iconMap[
                  type.id
                ] ||
                CircleHelp;

              const selected =
                selectedType?.id ===
                type.id;

              const info =
                getConcernInfo(
                  type
                );

              return (
                <button
                  key={
                    type.id
                  }
                  type="button"
                  aria-pressed={
                    selected
                  }
                  onClick={() => {
                    setSelectedType(
                      type
                    );

                    setSubcategory(
                      ''
                    );

                    setError('');
                  }}
                  className={`p-3 min-h-[124px] rounded-xl border text-left active:scale-[0.98] transition-all ${
                    type.id ===
                    'other-assistance'
                      ? 'col-span-2'
                      : ''
                  } ${
                    selected
                      ? 'bg-resqnow-violet/10 border-resqnow-violet/30 ring-1 ring-resqnow-violet/15'
                      : 'bg-white border-resqnow-border-soft hover:bg-resqnow-violet/5 hover:border-resqnow-violet/20'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selected
                        ? 'bg-resqnow-violet/15 text-resqnow-violet'
                        : 'bg-resqnow-canvas text-resqnow-muted'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>

                  <p
                    className={`text-[13px] font-bold mt-2 leading-snug ${
                      selected
                        ? 'text-resqnow-violet'
                        : 'text-resqnow-primary'
                    }`}
                  >
                    {
                      info.label
                    }
                  </p>

                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      selected
                        ? 'text-resqnow-violet/80'
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

        {/* SUBCATEGORY */}
        {availableSubcategories.length >
          0 && (
          <div className="mt-4 rounded-xl bg-resqnow-canvas border border-resqnow-border-soft p-3">

            <p className="text-[12px] font-bold text-resqnow-secondary mb-2.5">
              Specify the concern{' '}
              <span className="text-resqnow-muted font-medium">
                (optional)
              </span>
            </p>

            <div className="flex flex-wrap gap-2">

              {availableSubcategories.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={
                      subcategory ===
                      item
                    }
                    onClick={() =>
                      setSubcategory(
                        item
                      )
                    }
                    className={`px-3.5 py-2.5 min-h-[40px] rounded-full text-[12px] font-semibold border active:scale-95 transition-all ${
                      subcategory ===
                      item
                        ? 'bg-resqnow-violet border-resqnow-violet text-white shadow-sm'
                        : 'bg-white border-resqnow-border text-resqnow-muted hover:border-resqnow-violet/40 hover:text-resqnow-violet'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* EVACUATION WARNING */}
        {selectedType?.id ===
          'evac-assistance' && (
          <div className="mt-3 text-[12px] text-resqnow-secondary bg-resqnow-caution/10 border border-resqnow-caution/20 rounded-lg px-3 py-2.5 leading-relaxed">

            In danger right now? Use{' '}

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/submit/emergency'
                )
              }
              className="font-bold text-resqnow-critical underline"
            >
              Emergency Report
              → Urgent
              Evacuation
            </button>{' '}

            instead.
          </div>
        )}
      </section>

      {/* LOCATION */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl overflow-hidden mb-4">

        <button
          type="button"
          onClick={() =>
            setShowLocation(
              (previous) =>
                !previous
            )
          }
          className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-resqnow-canvas transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">

            <MapPin className="w-4 h-4 text-resqnow-violet shrink-0" />

            <div className="min-w-0">

              <h2 className="text-[15px] font-bold text-resqnow-primary">
                Incident Location
              </h2>

              <p className="text-[12px] text-resqnow-muted truncate mt-0.5">
                {location ||
                  'Set where the concern is located'}
              </p>
            </div>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-resqnow-muted shrink-0 transition-transform ${
              showLocation
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {showLocation && (
          <div className="px-4 pb-4 border-t border-resqnow-border-soft">

            <div className="mt-4">

              <Field label="Purok">
                <select
                  value={purok}
                  onChange={(
                    event
                  ) =>
                    setPurok(
                      event.target
                        .value
                    )
                  }
                  className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
                >
                  {purokOptions.map(
                    (item) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>

            <div className="mt-3">

              <Field label="Address / Incident Location">
                <textarea
                  id="ne-location"
                  value={
                    location
                  }
                  onChange={(
                    event
                  ) => {
                    setLocation(
                      event.target
                        .value
                    );

                    setError(
                      ''
                    );
                  }}
                  rows="2"
                  placeholder="Enter the location of the concern"
                  className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary resize-none outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
                />
              </Field>
            </div>

            <div className="mt-3">

              <Field label="Nearby Landmark">
                <input
                  type="text"
                  value={
                    landmark
                  }
                  onChange={(
                    event
                  ) =>
                    setLandmark(
                      event.target
                        .value
                    )
                  }
                  placeholder="Example: Near the elementary school"
                  className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
                />
              </Field>
            </div>

            {/* Honest location reminder.
                Actual pin/map integration is handled
                separately; no fake coordinates. */}
            <div className="mt-3 bg-resqnow-violet/5 border border-dashed border-resqnow-violet/20 rounded-xl p-4 text-center">

              <MapPin className="w-6 h-6 text-resqnow-violet mx-auto" />

              <p className="text-[12px] font-semibold text-resqnow-primary mt-2">
                Check the Incident Address
              </p>

              <p className="text-[11px] text-resqnow-muted mt-1 leading-relaxed">
                Enter the actual location where barangay assistance is needed.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* REPORT DETAILS */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <h2 className="text-[15px] font-bold text-resqnow-primary">
          Report Details
        </h2>

        <p className="text-[12px] text-resqnow-muted mt-1 mb-3">
          Give enough information for barangay personnel to review the concern.
        </p>

        <Field label="Description">

          <textarea
            id="ne-description"
            value={
              description
            }
            onChange={(
              event
            ) => {
              setDescription(
                event.target
                  .value
              );

              setError('');
            }}
            rows="3"
            placeholder="Describe the concern briefly..."
            className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary resize-none outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
          />
        </Field>

        <div className="mt-4">

          <Field label="Assistance Needed">

            <textarea
              value={
                assistance
              }
              onChange={(
                event
              ) =>
                setAssistance(
                  event.target
                    .value
                )
              }
              rows="2"
              placeholder="Example: Clean-up crew, transportation, repair..."
              className="w-full bg-resqnow-canvas border border-resqnow-border rounded-xl px-3 py-3 text-[13px] text-resqnow-primary resize-none outline-none focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10 transition-all"
            />
          </Field>
        </div>
      </section>

      {/* AFFECTED INDIVIDUALS */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <div className="flex items-center gap-2">

          <Users className="w-4 h-4 text-resqnow-violet" />

          <div>

            <h2 className="text-[15px] font-bold text-resqnow-primary">
              Affected Individuals
            </h2>

            <p className="text-[12px] text-resqnow-muted">
              Select all that apply. Optional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">

          {affectedOptions.map(
            (item) => {
              const selected =
                affected.includes(
                  item
                );

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={
                    selected
                  }
                  onClick={() =>
                    toggleAffected(
                      item
                    )
                  }
                  className={`flex items-center gap-2 p-3 min-h-[44px] rounded-xl border text-left active:scale-[0.98] transition-all ${
                    selected
                      ? 'bg-resqnow-violet/10 border-resqnow-violet/30 text-resqnow-violet'
                      : 'bg-white border-resqnow-border-soft text-resqnow-muted hover:bg-resqnow-violet/5'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      selected
                        ? 'bg-resqnow-violet border-resqnow-violet'
                        : 'border-resqnow-border'
                    }`}
                  >
                    {selected && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>

                  <span className="text-[12px] font-medium">
                    {item}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* PHOTO */}
      <section className="bg-white border border-resqnow-border-soft rounded-2xl p-4 mb-4">

        <div className="flex items-center gap-2 mb-3">

          <Camera className="w-4 h-4 text-resqnow-violet" />

          <div>

            <h2 className="text-[15px] font-bold text-resqnow-primary">
              Photo Evidence
            </h2>

            <p className="text-[12px] text-resqnow-muted">
              Optional. JPG or PNG.
            </p>
          </div>
        </div>

        {!photoPreview ? (
          <label className="block border-2 border-dashed border-resqnow-border-soft rounded-xl p-5 text-center cursor-pointer hover:bg-resqnow-violet/5 hover:border-resqnow-violet/20 transition-colors">

            <Camera className="w-6 h-6 text-resqnow-placeholder mx-auto" />

            <p className="text-[13px] font-semibold text-resqnow-secondary mt-2">
              Add Photo
            </p>

            <p className="text-[11px] text-resqnow-muted mt-1">
              JPG or PNG
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={
                handlePhoto
              }
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">

            <img
              src={
                photoPreview
              }
              alt="Report evidence preview"
              className="w-full h-40 object-cover rounded-xl"
            />

            <button
              type="button"
              onClick={
                removePhoto
              }
              aria-label="Remove photo"
              className="absolute top-2 right-2 w-9 h-9 bg-resqnow-primary/80 text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* REPORTER INFO */}
      <div className="bg-resqnow-mint/5 border border-resqnow-mint/15 rounded-xl p-3 mb-4">

        <div className="flex items-start gap-2">

          <HandHeart className="w-4 h-4 text-resqnow-mint shrink-0 mt-0.5" />

          <p className="text-[12px] text-resqnow-secondary leading-relaxed">
            Your account information will be associated with this report automatically.
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/10 px-4 py-3 text-[12px] font-medium text-resqnow-crimson"
        >
          {error}
        </p>
      )}

      {/* REVIEW BUTTON */}
      <button
        type="button"
        onClick={
          handleReview
        }
        disabled={
          isSubmitting
        }
        className="w-full min-h-[48px] py-3.5 rounded-xl bg-brand-gradient text-white text-[14px] font-bold shadow-[0_5px_18px_rgba(131,70,242,0.20)] disabled:opacity-60 active:scale-[0.98] transition-all"
      >
        Review Report
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-2">

        <span className="w-1.5 h-1.5 rounded-full bg-resqnow-pending" />

        <p className="text-[11px] text-resqnow-muted text-center">
          Barangay personnel will review your submitted report.
        </p>
      </div>

      {/* ============ CONFIRMATION MODAL ============ */}

      <Modal
        open={
          showConfirm
        }
        onClose={() => {
          if (
            !isSubmitting
          ) {
            setShowConfirm(
              false
            );
          }
        }}
        title="Confirm Report"
        description="Review the important details before submitting."
        isBusy={
          isSubmitting
        }
      >
        <div className="p-4 pb-6">

          {/* CONCERN */}
          <div className="bg-resqnow-violet/5 border border-resqnow-violet/15 rounded-xl p-3 mb-3">

            <p className="text-[11px] font-bold text-resqnow-violet uppercase tracking-wide">
              Concern Type
            </p>

            <p className="text-[14px] font-semibold text-resqnow-primary mt-1">
              {
                getConcernInfo(
                  selectedType
                ).label
              }
            </p>

            {subcategory && (
              <p className="text-[12px] text-resqnow-violet mt-1">
                {
                  subcategory
                }
              </p>
            )}
          </div>

          {/* GENERAL INFO */}
          <InfoRow
            label="Reporting For"
            value={
              reportingFor
            }
          />

          {reportingFor ===
            'Another Person' &&
            personName && (
              <InfoRow
                label="Person"
                value={
                  personName
                }
              />
            )}

          {reportingFor ===
            'Another Person' &&
            personContact && (
              <InfoRow
                label="Person Contact"
                value={
                  personContact
                }
              />
            )}

          {reportingFor ===
            'Another Person' &&
            relationship && (
              <InfoRow
                label="Relationship / Note"
                value={
                  relationship
                }
              />
            )}

          <InfoRow
            label="Purok"
            value={purok}
          />

          <InfoRow
            label="Location"
            value={
              location
            }
          />

          {landmark && (
            <InfoRow
              label="Landmark"
              value={
                landmark
              }
            />
          )}

          {/* STATUS AFTER SUBMIT */}
          <div className="flex items-center justify-between gap-4 py-3 border-b border-resqnow-border-soft">

            <span className="text-[12px] text-resqnow-muted">
              After Submission
            </span>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-resqnow-pending/15 text-resqnow-pending">
              Pending Verification
            </span>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-4 bg-resqnow-canvas rounded-xl p-3">

            <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide">
              Description
            </p>

            <p className="text-[13px] text-resqnow-secondary mt-1.5 leading-relaxed break-words">
              {
                description
              }
            </p>
          </div>

          {/* ASSISTANCE */}
          {assistance && (
            <div className="mt-3 bg-resqnow-mint/5 border border-resqnow-mint/10 rounded-xl p-3">

              <p className="text-[11px] font-bold text-resqnow-secondary uppercase tracking-wide">
                Assistance Needed
              </p>

              <p className="text-[13px] text-resqnow-secondary mt-1.5 leading-relaxed break-words">
                {
                  assistance
                }
              </p>
            </div>
          )}

          {/* AFFECTED */}
          {affected.length >
            0 && (
            <div className="mt-4">

              <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide">
                Affected Individuals
              </p>

              <div className="flex flex-wrap gap-2 mt-2">

                {affected.map(
                  (item) => (
                    <span
                      key={
                        item
                      }
                      className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-resqnow-violet/10 text-resqnow-violet"
                    >
                      {
                        item
                      }
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* PHOTO */}
          {photoPreview && (
            <div className="mt-4">

              <p className="text-[11px] font-bold text-resqnow-muted uppercase tracking-wide mb-2">
                Photo Evidence
              </p>

              <img
                src={
                  photoPreview
                }
                alt="Attached report evidence"
                className="w-full max-h-56 object-cover rounded-xl border border-resqnow-border-soft"
              />
            </div>
          )}

          {/* SUBMIT ERROR */}
          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/10 px-3.5 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-resqnow-critical" />
              <p className="text-[12px] leading-relaxed text-resqnow-crimson">
                {error}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-2 mt-5">

            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  false
                )
              }
              disabled={
                isSubmitting
              }
              className="min-h-[48px] py-3 rounded-xl border border-resqnow-border bg-white text-resqnow-muted text-[13px] font-semibold hover:bg-resqnow-canvas disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                isSubmitting
              }
              className="min-h-[48px] py-3 rounded-xl bg-brand-gradient text-white text-[13px] font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm & Submit'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============ SMALL COMPONENTS ============

function ChoiceButton({
  selected,
  label,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-pressed={
        selected
      }
      onClick={onClick}
      className={`p-3 min-h-[48px] rounded-xl border flex items-center gap-2.5 text-left active:scale-[0.98] transition-all ${
        selected
          ? 'bg-resqnow-violet/10 border-resqnow-violet/30 text-resqnow-violet'
          : 'bg-white border-resqnow-border-soft text-resqnow-muted hover:bg-resqnow-violet/5'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />

      <span className="text-[12px] font-semibold">
        {label}
      </span>
    </button>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-resqnow-secondary mb-1.5">
        {label}
      </label>

      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-resqnow-border-soft last:border-0">

      <span className="text-[12px] text-resqnow-muted shrink-0">
        {label}
      </span>

      <span className="text-[12px] font-medium text-resqnow-primary text-right break-words">
        {value ||
          'Not provided'}
      </span>
    </div>
  );
}