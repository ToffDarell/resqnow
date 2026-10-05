// src/components/resident/Register.jsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useTranslation,
} from 'react-i18next';

import {
  Accessibility,
  AlertCircle,
  Baby,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  HeartPulse,
  Home,
  Loader2,
  Lock,
  Mail,
  MapPin,
  PersonStanding,
  Phone,
  Shield,
  User,
} from 'lucide-react';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  purokOptions,
} from '../../data/mockData';

import barangayPhoto
  from '../../assets/barangay/barangay-camunatan.jpg';

// ============ INITIAL FORM ============

const INITIAL_FORM = {
  fullName: '',
  phoneNumber: '',
  address: '',
  purok: '',
  email: '',
  password: '',
  confirmPassword: '',
  householdCount: '',
  hasSeniorCitizen: false,
  hasChild: false,
  hasPWD: false,
  hasPregnantPerson: false,
  agreedToTerms: false,
};

// ============ REGISTER PAGE ============

export default function Register() {
  const navigate =
    useNavigate();

  const {
    register,
  } = useAuth();

  const {
    t,
  } = useTranslation();

  const nameRef =
    useRef(null);

  // Registration form
  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM
  );

  // Password visibility
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  // Validation state
  const [
    error,
    setError,
  ] = useState('');

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({});

  const [
    touched,
    setTouched,
  ] = useState({});

  const [
    focusedField,
    setFocusedField,
  ] = useState(null);

  // Submit state
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isSuccess,
    setIsSuccess,
  ] = useState(false);

  // Auto-focus name field
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // ============ UPDATE FIELD ============

  const update = (
    field,
    value
  ) => {
    setForm(
      (prev) => ({
        ...prev,
        [field]: value,
      })
    );

    setFieldErrors(
      (prev) => ({
        ...prev,
        [field]: '',
      })
    );

    setError('');
  };

  // ============ VALIDATION ============

  const validate = (
    name,
    value
  ) => {
    switch (name) {
      case 'fullName':
        return !value.trim()
          ? t(
              'register.fullNameRequired'
            )
          : value.trim().length < 2
          ? t(
              'register.nameTooShort'
            )
          : '';

      case 'email':
        return !value.trim()
          ? t(
              'register.emailRequired'
            )
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              value
            )
          ? t(
              'register.invalidEmail'
            )
          : '';

      case 'phoneNumber': {
        const cleanNumber =
          value.replace(
            /\s/g,
            ''
          );

        if (!cleanNumber) {
          return t(
            'register.contactRequired'
          );
        }

        if (
          !/^(09|\+639)\d{9}$/.test(
            cleanNumber
          )
        ) {
          return t(
            'register.invalidPhone'
          );
        }

        return '';
      }

      case 'address':
        return !value.trim()
          ? t(
              'register.addressRequired'
            )
          : '';

      case 'purok':
        return !value
          ? t(
              'register.purokRequired'
            )
          : '';

      case 'password': {
        if (!value) {
          return t(
            'register.passwordRequired'
          );
        }

        if (
          value.length < 8
        ) {
          return t(
            'register.passwordLength'
          );
        }

        if (
          !/[a-z]/.test(
            value
          )
        ) {
          return t(
            'register.passwordLowercase'
          );
        }

        if (
          !/[A-Z]/.test(
            value
          )
        ) {
          return t(
            'register.passwordUppercase'
          );
        }

        if (
          !/[0-9]/.test(
            value
          )
        ) {
          return t(
            'register.passwordNumber'
          );
        }

        if (
          !/[!@#$%^&*(),.?":{}|<>]/.test(
            value
          )
        ) {
          return t(
            'register.passwordSpecial'
          );
        }

        return '';
      }

      case 'confirmPassword':
        return !value
          ? t(
              'register.confirmRequired'
            )
          : value !==
            form.password
          ? t(
              'register.passwordsDontMatch'
            )
          : '';

      case 'householdCount':
        if (!value) {
          return '';
        }

        if (
          Number(value) < 1 ||
          Number(value) > 100
        ) {
          return 'Enter a valid household count';
        }

        return '';

      default:
        return '';
    }
  };

  // Validate when leaving a field
  const handleBlur = (
    field
  ) => {
    setTouched(
      (prev) => ({
        ...prev,
        [field]: true,
      })
    );

    setFieldErrors(
      (prev) => ({
        ...prev,

        [field]:
          validate(
            field,
            form[field]
          ),
      })
    );

    setFocusedField(
      null
    );
  };

  // ============ PASSWORD STRENGTH ============

  const passwordStrength =
    useMemo(
      () => {
        let score = 0;

        if (
          form.password.length >= 8
        ) {
          score++;
        }

        if (
          /[a-z]/.test(
            form.password
          )
        ) {
          score++;
        }

        if (
          /[A-Z]/.test(
            form.password
          )
        ) {
          score++;
        }

        if (
          /[0-9]/.test(
            form.password
          )
        ) {
          score++;
        }

        if (
          /[!@#$%^&*(),.?":{}|<>]/.test(
            form.password
          )
        ) {
          score++;
        }

        const labels = [
          t(
            'register.veryWeak'
          ),
          t(
            'register.weak'
          ),
          t(
            'register.fair'
          ),
          t(
            'register.good'
          ),
          t(
            'register.strong'
          ),
          t(
            'register.veryStrong'
          ),
        ];

        const colors = [
          'bg-resqnow-critical',
          'bg-resqnow-critical',
          'bg-resqnow-pending',
          'bg-resqnow-caution',
          'bg-resqnow-safe',
          'bg-resqnow-safe',
        ];

        return {
          score,

          label:
            labels[score],

          color:
            colors[score],

          width:
            `${(
              score / 5
            ) * 100}%`,
        };
      },
      [
        form.password,
        t,
      ]
    );

  // ============ SUBMIT ============

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setError('');

      const fieldsToValidate = [
        'fullName',
        'phoneNumber',
        'address',
        'purok',
        'email',
        'password',
        'confirmPassword',
        'householdCount',
      ];

      const errors = {};

      fieldsToValidate.forEach(
        (field) => {
          const fieldError =
            validate(
              field,
              form[field]
            );

          if (fieldError) {
            errors[field] =
              fieldError;
          }
        }
      );

      setFieldErrors(
        errors
      );

      setTouched(
        Object.fromEntries(
          fieldsToValidate.map(
            (field) => [
              field,
              true,
            ]
          )
        )
      );

      // Stop on validation errors.
      if (
        Object.keys(
          errors
        ).length > 0
      ) {
        setError(
          t(
            'register.fixFields'
          )
        );

        return;
      }

      // Resident must confirm information.
      if (
        !form.agreedToTerms
      ) {
        setError(
          t(
            'register.confirmInfoError'
          )
        );

        return;
      }

      setIsSubmitting(
        true
      );

      try {
        await register({
          fullName:
            form.fullName.trim(),

          contactNumber:
            form.phoneNumber.replace(
              /\s/g,
              ''
            ),

          address:
            form.address.trim(),

          purok:
            form.purok,

          email:
            form.email
              .trim()
              .toLowerCase(),

          password:
            form.password,

          password_confirmation:
            form.confirmPassword,

          householdCount:
            form.householdCount
              ? Number(
                  form.householdCount
                )
              : 1,

          householdProfile: {
            hasSeniorCitizen:
              form.hasSeniorCitizen,

            hasChild:
              form.hasChild,

            hasPWD:
              form.hasPWD,

            hasPregnantPerson:
              form.hasPregnantPerson,
          },
        });

        setIsSuccess(
          true
        );
      } catch (
        registerError
      ) {
        const backendErrors =
          registerError?.errors ||
          {};

        // Map Laravel field names
        // to frontend field names.
        const mappedErrors = {
          fullName:
            backendErrors
              .fullName?.[0],

          phoneNumber:
            backendErrors
              .contactNumber?.[0],

          address:
            backendErrors
              .address?.[0],

          purok:
            backendErrors
              .purok?.[0],

          email:
            backendErrors
              .email?.[0],

          password:
            backendErrors
              .password?.[0],

          confirmPassword:
            backendErrors
              .password_confirmation?.[0],

          householdCount:
            backendErrors
              .householdCount?.[0],
        };

        const cleanErrors =
          Object.fromEntries(
            Object.entries(
              mappedErrors
            ).filter(
              ([, value]) =>
                Boolean(
                  value
                )
            )
          );

        setFieldErrors(
          cleanErrors
        );

        setTouched(
          (prev) => ({
            ...prev,

            ...Object.fromEntries(
              Object.keys(
                cleanErrors
              ).map(
                (field) => [
                  field,
                  true,
                ]
              )
            ),
          })
        );

        setError(
          registerError?.message ||
            t(
              'register.fixFields'
            )
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  // ============ SUCCESS SCREEN ============

  if (isSuccess) {
    return (
      <div
        className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4"
        style={{
          backgroundImage:
            `url(${barangayPhoto})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-resqnow-ivory/90 via-white/80 to-resqnow-mist/85 backdrop-blur-[2px]" />

        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgba(31,29,71,0.10)] border border-white/60 px-7 sm:px-10 py-10 sm:py-12 w-full max-w-[440px] text-center">

          <div className="w-[72px] h-[72px] bg-resqnow-safe/15 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-resqnow-safe" />
          </div>

          <h2 className="text-[22px] font-bold text-resqnow-primary mb-2">
            {t(
              'register.accountCreated'
            )}
          </h2>

          <p className="text-[13px] text-resqnow-muted mb-4 leading-relaxed">
            {t(
              'register.accountCreatedMessage'
            )}
          </p>

          <div className="bg-resqnow-pending/10 border border-resqnow-pending/20 rounded-xl px-4 py-3.5 mb-6 text-left">

            <p className="text-[10px] font-bold text-resqnow-pending uppercase tracking-wide mb-1">
              {t(
                'register.pendingVerification'
              )}
            </p>

            <p className="text-[11px] text-resqnow-secondary leading-relaxed">
              {t(
                'register.verificationNote'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/login'
              )
            }
            className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl transition-all text-[14px] shadow-[0_4px_16px_rgba(131,70,242,0.22)] active:scale-[0.98]"
          >
            {t(
              'register.goToLogin'
            )}
          </button>
        </div>
      </div>
    );
  }

  // ============ MAIN FORM ============

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4 py-8"
      style={{
        backgroundImage:
          `url(${barangayPhoto})`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-resqnow-ivory/90 via-white/80 to-resqnow-mist/85 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center gap-5 w-full max-w-[880px]">

        {/* ============ BRANDING ============ */}

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgba(31,29,71,0.09)] border border-white/60 px-8 py-9 flex flex-col items-center text-center w-full max-w-[250px] shrink-0">

          <div className="w-[72px] h-[72px] bg-brand-gradient rounded-2xl flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(131,70,242,0.22)]">
            <Shield
              className="w-[40px] h-[40px] text-white"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-[27px] font-extrabold text-resqnow-primary tracking-tight">
            ResQNow
          </h1>

          <p className="text-[12px] text-resqnow-muted mt-2 leading-relaxed">
            Barangay Camunatan
            <br />
            City of Ilagan
          </p>

          <div className="mt-6 pt-5 border-t border-resqnow-border-soft w-full">

            <div className="flex items-center justify-center gap-1.5">

              <div className="w-1.5 h-1.5 rounded-full bg-resqnow-safe" />

              <span className="text-[9px] text-resqnow-muted font-medium uppercase tracking-wider">
                {t(
                  'register.secureRegistration'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ============ FORM CARD ============ */}

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgba(31,29,71,0.09)] border border-white/60 px-6 sm:px-10 py-8 sm:py-9 w-full max-w-[540px]">

          <h2 className="text-[22px] font-bold text-resqnow-primary mb-1">
            {t(
              'register.createAccount'
            )}
          </h2>

          <p className="text-[12px] text-resqnow-muted mb-7">
            {t(
              'register.registerMessage'
            )}
          </p>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 bg-resqnow-critical/10 border border-resqnow-critical/20 text-resqnow-crimson text-[12px] rounded-xl px-4 py-3 mb-5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />

              <span>
                {error}
              </span>
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
            noValidate
            className="space-y-4"
          >

            {/* PERSONAL INFORMATION */}

            <SectionLabel
              title={
                t(
                  'register.personalInformation'
                )
              }
            />

            <FieldWrapper
              label={`${t(
                'register.fullName'
              )} *`}
              error={
                touched.fullName &&
                fieldErrors.fullName
              }
            >
              <FieldIcon
                icon={
                  User
                }
                active={
                  focusedField ===
                  'fullName'
                }
                error={
                  !!fieldErrors.fullName &&
                  touched.fullName
                }
              />

              <InputField
                ref={
                  nameRef
                }
                type="text"
                value={
                  form.fullName
                }
                onChange={(
                  event
                ) =>
                  update(
                    'fullName',
                    event.target.value
                  )
                }
                onFocus={() =>
                  setFocusedField(
                    'fullName'
                  )
                }
                onBlur={() =>
                  handleBlur(
                    'fullName'
                  )
                }
                placeholder={
                  t(
                    'register.namePlaceholder'
                  )
                }
                error={
                  !!fieldErrors.fullName &&
                  touched.fullName
                }
                autoComplete="name"
              />
            </FieldWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <FieldWrapper
                label={`${t(
                  'register.contactNumber'
                )} *`}
                error={
                  touched.phoneNumber &&
                  fieldErrors.phoneNumber
                }
              >
                <FieldIcon
                  icon={
                    Phone
                  }
                  active={
                    focusedField ===
                    'phoneNumber'
                  }
                  error={
                    !!fieldErrors.phoneNumber &&
                    touched.phoneNumber
                  }
                />

                <InputField
                  type="tel"
                  value={
                    form.phoneNumber
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      'phoneNumber',
                      event.target.value
                    )
                  }
                  onFocus={() =>
                    setFocusedField(
                      'phoneNumber'
                    )
                  }
                  onBlur={() =>
                    handleBlur(
                      'phoneNumber'
                    )
                  }
                  placeholder={
                    t(
                      'register.phonePlaceholder'
                    )
                  }
                  error={
                    !!fieldErrors.phoneNumber &&
                    touched.phoneNumber
                  }
                  autoComplete="tel"
                />
              </FieldWrapper>

              <FieldWrapper
                label={`${t(
                  'register.purok'
                )} *`}
                error={
                  touched.purok &&
                  fieldErrors.purok
                }
              >
                <select
                  value={
                    form.purok
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      'purok',
                      event.target.value
                    )
                  }
                  onFocus={() =>
                    setFocusedField(
                      'purok'
                    )
                  }
                  onBlur={() =>
                    handleBlur(
                      'purok'
                    )
                  }
                  className={`w-full px-4 py-3 rounded-xl text-[14px] text-resqnow-primary outline-none transition-all appearance-none ${
                    touched.purok &&
                    fieldErrors.purok
                      ? 'ring-2 ring-resqnow-critical/30 bg-resqnow-critical/5'
                      : focusedField ===
                        'purok'
                      ? 'ring-2 ring-resqnow-violet/25 bg-white'
                      : 'bg-resqnow-canvas ring-1 ring-resqnow-border'
                  }`}
                >
                  <option value="">
                    {t(
                      'register.selectPurok'
                    )}
                  </option>

                  {purokOptions.map(
                    (
                      purok
                    ) => (
                      <option
                        key={
                          purok
                        }
                        value={
                          purok
                        }
                      >
                        {
                          purok
                        }
                      </option>
                    )
                  )}
                </select>
              </FieldWrapper>
            </div>

            <FieldWrapper
              label={`${t(
                'register.address'
              )} *`}
              error={
                touched.address &&
                fieldErrors.address
              }
            >
              <FieldIcon
                icon={
                  MapPin
                }
                active={
                  focusedField ===
                  'address'
                }
                error={
                  !!fieldErrors.address &&
                  touched.address
                }
              />

              <InputField
                type="text"
                value={
                  form.address
                }
                onChange={(
                  event
                ) =>
                  update(
                    'address',
                    event.target.value
                  )
                }
                onFocus={() =>
                  setFocusedField(
                    'address'
                  )
                }
                onBlur={() =>
                  handleBlur(
                    'address'
                  )
                }
                placeholder={
                  t(
                    'register.addressPlaceholder'
                  )
                }
                error={
                  !!fieldErrors.address &&
                  touched.address
                }
                autoComplete="street-address"
              />
            </FieldWrapper>

            {/* ACCOUNT CREDENTIALS */}

            <SectionLabel
              title={
                t(
                  'register.accountCredentials'
                )
              }
            />

            <FieldWrapper
              label={`${t(
                'register.emailAddress'
              )} *`}
              error={
                touched.email &&
                fieldErrors.email
              }
            >
              <FieldIcon
                icon={
                  Mail
                }
                active={
                  focusedField ===
                  'email'
                }
                error={
                  !!fieldErrors.email &&
                  touched.email
                }
              />

              <InputField
                type="email"
                value={
                  form.email
                }
                onChange={(
                  event
                ) =>
                  update(
                    'email',
                    event.target.value
                  )
                }
                onFocus={() =>
                  setFocusedField(
                    'email'
                  )
                }
                onBlur={() =>
                  handleBlur(
                    'email'
                  )
                }
                placeholder={
                  t(
                    'register.emailPlaceholder'
                  )
                }
                error={
                  !!fieldErrors.email &&
                  touched.email
                }
                autoComplete="email"
                autoCapitalize="off"
              />
            </FieldWrapper>

            {/* PASSWORD */}

            <FieldWrapper
              label={`${t(
                'register.password'
              )} *`}
              error={
                touched.password &&
                fieldErrors.password
              }
            >
              <FieldIcon
                icon={
                  Lock
                }
                active={
                  focusedField ===
                  'password'
                }
                error={
                  !!fieldErrors.password &&
                  touched.password
                }
              />

              <InputField
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={
                  form.password
                }
                onChange={(
                  event
                ) =>
                  update(
                    'password',
                    event.target.value
                  )
                }
                onFocus={() =>
                  setFocusedField(
                    'password'
                  )
                }
                onBlur={() =>
                  handleBlur(
                    'password'
                  )
                }
                placeholder={
                  t(
                    'register.passwordPlaceholder'
                  )
                }
                error={
                  !!fieldErrors.password &&
                  touched.password
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                onMouseDown={(
                  event
                ) =>
                  event.preventDefault()
                }
                onClick={() =>
                  setShowPassword(
                    (prev) =>
                      !prev
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-resqnow-placeholder hover:text-resqnow-violet hover:bg-resqnow-violet/5 transition-colors"
                tabIndex={
                  -1
                }
                aria-label={
                  showPassword
                    ? t(
                        'register.hidePassword'
                      )
                    : t(
                        'register.showPassword'
                      )
                }
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </FieldWrapper>

            {/* PASSWORD STRENGTH */}

            {form.password
              .length > 0 && (
              <div className="p-3 bg-resqnow-canvas rounded-xl border border-resqnow-border-soft">

                <div className="flex items-center gap-2 mb-2">

                  <div className="flex-1 h-1.5 bg-resqnow-border-soft rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width:
                          passwordStrength.width ||
                          '0%',
                      }}
                    />
                  </div>

                  <span className="text-[11px] font-medium text-resqnow-muted">
                    {
                      passwordStrength.label
                    }
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1">

                  <PassIndicator
                    passed={
                      form.password
                        .length >= 8
                    }
                    label={
                      t(
                        'register.atLeast8'
                      )
                    }
                  />

                  <PassIndicator
                    passed={
                      /[a-z]/.test(
                        form.password
                      )
                    }
                    label={
                      t(
                        'register.lowercaseLetter'
                      )
                    }
                  />

                  <PassIndicator
                    passed={
                      /[A-Z]/.test(
                        form.password
                      )
                    }
                    label={
                      t(
                        'register.uppercaseLetter'
                      )
                    }
                  />

                  <PassIndicator
                    passed={
                      /[0-9]/.test(
                        form.password
                      )
                    }
                    label={
                      t(
                        'register.oneNumber'
                      )
                    }
                  />

                  <PassIndicator
                    passed={
                      /[!@#$%^&*(),.?":{}|<>]/.test(
                        form.password
                      )
                    }
                    label={
                      t(
                        'register.specialCharacter'
                      )
                    }
                  />
                </div>
              </div>
            )}

            {/* CONFIRM PASSWORD */}

            <FieldWrapper
              label={`${t(
                'register.confirmPassword'
              )} *`}
              error={
                touched.confirmPassword &&
                fieldErrors.confirmPassword
              }
            >
              <FieldIcon
                icon={
                  Lock
                }
                active={
                  focusedField ===
                  'confirmPassword'
                }
                error={
                  !!fieldErrors.confirmPassword &&
                  touched.confirmPassword
                }
              />

              <InputField
                type={
                  showConfirm
                    ? 'text'
                    : 'password'
                }
                value={
                  form.confirmPassword
                }
                onChange={(
                  event
                ) =>
                  update(
                    'confirmPassword',
                    event.target.value
                  )
                }
                onFocus={() =>
                  setFocusedField(
                    'confirmPassword'
                  )
                }
                onBlur={() =>
                  handleBlur(
                    'confirmPassword'
                  )
                }
                placeholder={
                  t(
                    'register.confirmPasswordPlaceholder'
                  )
                }
                error={
                  !!fieldErrors.confirmPassword &&
                  touched.confirmPassword
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                onMouseDown={(
                  event
                ) =>
                  event.preventDefault()
                }
                onClick={() =>
                  setShowConfirm(
                    (prev) =>
                      !prev
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-resqnow-placeholder hover:text-resqnow-violet hover:bg-resqnow-violet/5 transition-colors"
                tabIndex={
                  -1
                }
                aria-label={
                  showConfirm
                    ? t(
                        'register.hidePassword'
                      )
                    : t(
                        'register.showPassword'
                      )
                }
              >
                {showConfirm ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </FieldWrapper>

            {/* HOUSEHOLD */}

            <SectionLabel
              title={
                t(
                  'register.householdInformation'
                )
              }
            />

            <FieldWrapper
              label={
                t(
                  'register.householdCount'
                )
              }
              error={
                touched.householdCount &&
                fieldErrors.householdCount
              }
            >
              <FieldIcon
                icon={
                  Home
                }
                active={
                  focusedField ===
                  'householdCount'
                }
                error={
                  !!fieldErrors.householdCount &&
                  touched.householdCount
                }
              />

              <InputField
                type="number"
                min="1"
                max="100"
                value={
                  form.householdCount
                }
                onChange={(
                  event
                ) =>
                  update(
                    'householdCount',
                    event.target.value
                  )
                }
                onFocus={() =>
                  setFocusedField(
                    'householdCount'
                  )
                }
                onBlur={() =>
                  handleBlur(
                    'householdCount'
                  )
                }
                placeholder={
                  t(
                    'register.householdPlaceholder'
                  )
                }
                error={
                  !!fieldErrors.householdCount &&
                  touched.householdCount
                }
              />
            </FieldWrapper>

            {/* HOUSEHOLD PROFILE */}

            <div className="grid grid-cols-2 gap-2">

              {[
                {
                  key:
                    'hasSeniorCitizen',

                  label:
                    t(
                      'register.seniorCitizen'
                    ),

                  icon:
                    PersonStanding,
                },
                {
                  key:
                    'hasChild',

                  label:
                    t(
                      'register.child'
                    ),

                  icon:
                    Baby,
                },
                {
                  key:
                    'hasPWD',

                  label:
                    t(
                      'register.pwd'
                    ),

                  icon:
                    Accessibility,
                },
                {
                  key:
                    'hasPregnantPerson',

                  label:
                    t(
                      'register.pregnantPerson'
                    ),

                  icon:
                    HeartPulse,
                },
              ].map(
                ({
                  key,
                  label,
                  icon: Icon,
                }) => (
                  <button
                    type="button"
                    key={
                      key
                    }
                    onClick={() =>
                      update(
                        key,
                        !form[key]
                      )
                    }
                    aria-pressed={
                      form[key]
                    }
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all select-none text-left ${
                      form[key]
                        ? 'border-resqnow-violet/30 bg-resqnow-violet/10 shadow-sm'
                        : 'border-resqnow-border-soft bg-white hover:border-resqnow-violet/20 hover:bg-resqnow-violet/5'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                        form[key]
                          ? 'bg-resqnow-violet border-resqnow-violet'
                          : 'border-resqnow-border'
                      }`}
                    >
                      {form[key] && (
                        <Check
                          className="w-3 h-3 text-white"
                          strokeWidth={
                            3
                          }
                        />
                      )}
                    </div>

                    <Icon
                      className={`w-[17px] h-[17px] shrink-0 ${
                        form[key]
                          ? 'text-resqnow-violet'
                          : 'text-resqnow-muted'
                      }`}
                    />

                    <span
                      className={`text-[11px] sm:text-[12px] font-medium leading-tight ${
                        form[key]
                          ? 'text-resqnow-violet'
                          : 'text-resqnow-secondary'
                      }`}
                    >
                      {
                        label
                      }
                    </span>
                  </button>
                )
              )}
            </div>

            {/* HOME LOCATION */}

            <div>

              <label className="block text-[12px] font-semibold text-resqnow-secondary mb-1.5">
                {t(
                  'register.homeLocation'
                )}
              </label>

              <div className="border-2 border-dashed border-resqnow-border-soft rounded-xl p-4 text-center bg-resqnow-canvas">

                <div className="w-10 h-10 bg-resqnow-violet/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-resqnow-violet" />
                </div>

                <p className="text-[12px] font-medium text-resqnow-secondary">
                  {t(
                    'register.homeLocationPin'
                  )}
                </p>

                <p className="text-[10px] text-resqnow-muted mt-0.5">
                  {t(
                    'register.mapLater'
                  )}
                </p>
              </div>
            </div>

            {/* TERMS */}

            <label className="flex items-start gap-3 cursor-pointer select-none pt-2 pb-1">

              <input
                type="checkbox"
                checked={
                  form.agreedToTerms
                }
                onChange={(
                  event
                ) =>
                  update(
                    'agreedToTerms',
                    event.target.checked
                  )
                }
                className="w-[18px] h-[18px] rounded-md border-resqnow-border accent-resqnow-violet mt-0.5 shrink-0"
              />

              <span className="text-[11px] text-resqnow-muted leading-relaxed">
                {t(
                  'register.confirmInformation'
                )}
              </span>
            </label>

            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 text-[14px] shadow-[0_4px_16px_rgba(131,70,242,0.22)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />

                  {t(
                    'register.creating'
                  )}
                </>
              ) : (
                t(
                  'register.createAccount'
                )
              )}
            </button>
          </form>

          {/* LOGIN */}

          <div className="mt-5 text-center">

            <Link
              to="/login"
              className="text-[12px] text-resqnow-violet font-semibold hover:text-resqnow-primary hover:underline transition-colors"
            >
              {t(
                'login.signIn'
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SECTION LABEL ============

function SectionLabel({
  title,
}) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-1">

      <span className="text-[10px] font-bold text-resqnow-muted uppercase tracking-widest">
        {title}
      </span>

      <div className="flex-1 h-px bg-resqnow-border-soft" />
    </div>
  );
}

// ============ FIELD WRAPPER ============

function FieldWrapper({
  label,
  error,
  children,
}) {
  return (
    <div>

      {label && (
        <label className="block text-[12px] font-semibold text-resqnow-secondary mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="text-[11px] text-resqnow-critical mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ============ FIELD ICON ============

function FieldIcon({
  icon: Icon,
  active,
  error,
}) {
  return (
    <Icon
      className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors pointer-events-none ${
        active
          ? 'text-resqnow-violet'
          : error
          ? 'text-resqnow-critical'
          : 'text-resqnow-placeholder'
      }`}
    />
  );
}

// ============ INPUT FIELD ============

const InputField = ({
  ref,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  error,
  ...rest
}) => {
  return (
    <input
      ref={
        ref
      }
      type={
        type
      }
      value={
        value
      }
      onChange={
        onChange
      }
      onFocus={
        onFocus
      }
      onBlur={
        onBlur
      }
      placeholder={
        placeholder
      }
      className={`w-full pl-[46px] pr-4 py-3 rounded-xl text-[14px] text-resqnow-primary outline-none transition-all ${
        error
          ? 'ring-2 ring-resqnow-critical/30 bg-resqnow-critical/5'
          : 'bg-resqnow-canvas ring-1 ring-resqnow-border focus:ring-2 focus:ring-resqnow-violet/25 focus:bg-white'
      }`}
      {...rest}
    />
  );
};

// ============ PASSWORD REQUIREMENT ============

function PassIndicator({
  passed,
  label,
}) {
  return (
    <div className="flex items-center gap-1.5">

      <div
        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          passed
            ? 'bg-resqnow-safe/15'
            : 'bg-resqnow-border-soft'
        }`}
      >
        {passed ? (
          <Check
            className="w-2 h-2 text-resqnow-safe"
            strokeWidth={
              3
            }
          />
        ) : (
          <div className="w-1 h-1 rounded-full bg-resqnow-placeholder" />
        )}
      </div>

      <span
        className={`text-[10px] transition-colors ${
          passed
            ? 'text-resqnow-safe'
            : 'text-resqnow-muted'
        }`}
      >
        {label}
      </span>
    </div>
  );
}