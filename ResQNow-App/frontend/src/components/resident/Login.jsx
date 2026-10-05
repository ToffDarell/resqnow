// src/components/resident/Login.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Shield,
  Mail,
  Lock,
  ExternalLink,
  AlertCircle,
  Loader2,
  Radio,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import barangayPhoto from '../../assets/barangay/barangay-camunatan.jpg';

// ============ LOGIN PAGE ============
// Login page used by residents
export default function Login() {
  // Used for changing pages
  const navigate = useNavigate();

  // Real Laravel login function
  const { login } = useAuth();

  // Used to focus the email input
  const emailRef = useRef(null);

  // Login form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login options
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form messages and validation
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // ============ LOAD REMEMBERED EMAIL ============
  // Restore saved email and focus the input
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(
      'resqnow_remembered_email'
    );

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    emailRef.current?.focus();
  }, []);

  // ============ VALIDATION ============
  // Check each field for errors
  const validateField = (name, value) => {
    if (
      name === 'email' &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return 'Please enter a valid email address';
    }

    if (
      name === 'password' &&
      touched.password &&
      !value
    ) {
      return 'Password is required';
    }

    return '';
  };

  // Check field when user leaves the input
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateField(
        field,
        field === 'email'
          ? email
          : password
      ),
    }));

    setFocusedField(null);
  };

  // Clear field error when user focuses the input
  const handleFocus = (field) => {
    setFocusedField(field);

    setFieldErrors((prev) => ({
      ...prev,
      [field]: '',
    }));

    setError('');
  };

  // ============ LOGIN ============
  // Login resident through Laravel API
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const errors = {
      email: !email.trim()
        ? 'Email is required'
        : validateField(
            'email',
            email
          ),

      password: !password.trim()
        ? 'Password is required'
        : '',
    };

    setFieldErrors(errors);

    setTouched({
      email: true,
      password: true,
    });

    // Stop login if there are errors
    if (
      errors.email ||
      errors.password
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Login using the shared Laravel Sanctum session.
      const loggedInUser = await login({
        email: email
          .trim()
          .toLowerCase(),

        password,

        remember: rememberMe,
      });

      // Save only the email
      if (rememberMe) {
        localStorage.setItem(
          'resqnow_remembered_email',
          email
            .trim()
            .toLowerCase()
        );
      } else {
        localStorage.removeItem(
          'resqnow_remembered_email'
        );
      }

      // Route the authenticated account to its own interface.
      navigate(
        loggedInUser?.role === 'responder'
          ? '/responder/dashboard'
          : '/dashboard',
        { replace: true }
      );
    } catch (loginError) {
      const backendErrors =
        loginError.errors || {};

      setError(
        loginError.message ||
        'Unable to sign in. Please try again.'
      );

      setFieldErrors({
        email:
          backendErrors.email?.[0] ||
          ' ',

        password:
          backendErrors.password?.[0] ||
          ' ',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-resqnow-ivory flex items-center justify-center p-0 sm:p-5">

      {/* ============ LOGIN CONTAINER ============ */}
      {/* Main login card for mobile and desktop */}
      <div className="w-full min-h-screen sm:min-h-0 sm:max-w-[900px] bg-white sm:rounded-3xl sm:shadow-[0_16px_50px_rgba(31,29,71,0.12)] sm:border sm:border-resqnow-border-soft overflow-hidden md:grid md:grid-cols-[0.9fr_1.1fr]">

        {/* ============ BARANGAY PHOTO ============ */}
        {/* Actual Barangay Camunatan photo */}
        <section
          className="relative min-h-[225px] md:min-h-[650px] bg-cover bg-center"
          style={{
            backgroundImage:
              `url(${barangayPhoto})`,
          }}
        >
          {/* Dark brand overlay for readable text */}
          <div className="absolute inset-0 bg-linear-to-br from-resqnow-primary/80 via-resqnow-violet/60 to-resqnow-mint/45" />

          {/* Small grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize:
                '22px 22px',
            }}
          />

          {/* Brand content */}
          <div className="relative z-10 h-full min-h-[225px] md:min-h-[650px] p-6 md:p-8 flex flex-col justify-between">

            {/* ResQNow brand */}
            <div className="flex items-center gap-3">

              {/* Temporary shield until final logo is decided */}
              <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center">
                <Shield
                  className="w-6 h-6 text-white"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h1 className="text-[22px] font-extrabold text-white leading-tight">
                  ResQNow
                </h1>

                <p className="text-[10px] text-white/80">
                  Barangay Camunatan
                </p>
              </div>
            </div>

            {/* Welcome text */}
            <div className="max-w-[320px]">

              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                Resident Emergency Reporting
              </p>

              <h2 className="text-[24px] md:text-[30px] font-bold text-white mt-2 leading-tight">
                Fast help starts with the right information.
              </h2>

              <p className="text-[12px] md:text-[13px] text-white/80 mt-2 leading-relaxed">
                Report emergencies, request barangay assistance, and track your submitted reports.
              </p>
            </div>
          </div>
        </section>

        {/* ============ LOGIN FORM ============ */}
        <section className="px-6 py-7 sm:px-9 sm:py-9 md:px-10 md:py-10 flex flex-col justify-center">

          {/* Login heading */}
          <div className="mb-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-resqnow-violet">
              Resident Access
            </p>

            <h2 className="text-[24px] font-bold text-resqnow-primary mt-1">
              Welcome back
            </h2>

            <p className="text-[12px] text-resqnow-muted mt-1">
              Sign in to access your ResQNow account.
            </p>
          </div>

          {/* ============ ERROR MESSAGE ============ */}
          {/* Shows backend or validation errors */}
          {error && (
            <div className="flex items-start gap-2.5 bg-resqnow-critical/10 border border-resqnow-critical/20 text-resqnow-crimson text-[12px] rounded-xl px-4 py-3 mb-5">

              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />

              <span>
                {error}
              </span>
            </div>
          )}

          {/* ============ LOGIN FORM ============ */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-[12px] font-semibold text-resqnow-secondary mb-1.5">
                Email Address
              </label>

              <div
                className={`relative rounded-xl transition-all ${
                  fieldErrors.email
                    ? 'ring-2 ring-resqnow-critical/30'
                    : focusedField === 'email'
                    ? 'ring-2 ring-resqnow-violet/25'
                    : 'ring-1 ring-resqnow-border'
                }`}
              >

                {/* Email icon */}
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] ${
                    focusedField === 'email'
                      ? 'text-resqnow-violet'
                      : fieldErrors.email
                      ? 'text-resqnow-critical'
                      : 'text-resqnow-placeholder'
                  }`}
                />

                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(
                      e.target.value
                    );

                    setFieldErrors(
                      (prev) => ({
                        ...prev,
                        email: '',
                      })
                    );

                    setError('');
                  }}
                  onFocus={() =>
                    handleFocus('email')
                  }
                  onBlur={() =>
                    handleBlur('email')
                  }
                  placeholder="you@example.com"
                  className={`w-full pl-[46px] pr-4 py-3.5 rounded-xl text-[14px] text-resqnow-primary outline-none ${
                    fieldErrors.email
                      ? 'bg-resqnow-critical/5'
                      : 'bg-resqnow-canvas'
                  }`}
                  autoComplete="email"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </div>

              {/* Email validation */}
              {fieldErrors.email &&
                fieldErrors.email !==
                  ' ' && (
                  <p className="text-[11px] text-resqnow-critical mt-1.5 ml-1">
                    {
                      fieldErrors.email
                    }
                  </p>
                )}
            </div>

            {/* Password */}
            <div>

              <label className="block text-[12px] font-semibold text-resqnow-secondary mb-1.5">
                Password
              </label>

              <div
                className={`relative rounded-xl transition-all ${
                  fieldErrors.password &&
                  touched.password
                    ? 'ring-2 ring-resqnow-critical/30'
                    : focusedField ===
                      'password'
                    ? 'ring-2 ring-resqnow-violet/25'
                    : 'ring-1 ring-resqnow-border'
                }`}
              >

                {/* Password icon */}
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] ${
                    focusedField ===
                    'password'
                      ? 'text-resqnow-violet'
                      : fieldErrors.password &&
                        touched.password
                      ? 'text-resqnow-critical'
                      : 'text-resqnow-placeholder'
                  }`}
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(
                      e.target.value
                    );

                    setFieldErrors(
                      (prev) => ({
                        ...prev,
                        password: '',
                      })
                    );

                    setError('');
                  }}
                  onFocus={() =>
                    handleFocus(
                      'password'
                    )
                  }
                  onBlur={() =>
                    handleBlur(
                      'password'
                    )
                  }
                  placeholder="••••••••"
                  className={`w-full pl-[46px] pr-12 py-3.5 rounded-xl text-[14px] text-resqnow-primary outline-none ${
                    fieldErrors.password &&
                    touched.password
                      ? 'bg-resqnow-critical/5'
                      : 'bg-resqnow-canvas'
                  }`}
                  autoComplete="current-password"
                />

                {/* Show or hide password */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-resqnow-placeholder hover:text-resqnow-violet hover:bg-resqnow-violet/5 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>

              {/* Password validation */}
              {fieldErrors.password &&
                fieldErrors.password !==
                  ' ' && (
                  <p className="text-[11px] text-resqnow-critical mt-1.5 ml-1">
                    {
                      fieldErrors.password
                    }
                  </p>
                )}
            </div>

            {/* ============ LOGIN OPTIONS ============ */}
            <div className="flex items-center justify-between gap-3">

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer select-none">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded border-resqnow-border accent-resqnow-violet"
                />

                <span className="text-[11px] text-resqnow-muted">
                  Remember me
                </span>
              </label>

              {/* Forgot Password */}
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[11px] font-semibold text-resqnow-violet hover:text-resqnow-primary transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* ============ SIGN IN BUTTON ============ */}
            {/* Main normal action uses the ResQNow brand gradient */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-gradient text-white py-3.5 rounded-xl text-[14px] font-semibold shadow-[0_6px_18px_rgba(131,70,242,0.20)] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />

                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* ============ CREATE ACCOUNT ============ */}
          <div className="mt-6 text-center">

            <p className="text-[12px] text-resqnow-muted">
              Don't have a resident account?{' '}

              <Link
                to="/register"
                className="text-resqnow-violet font-semibold hover:text-resqnow-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* ============ RESPONDER ACCESS ============ */}
          {/* Secondary access for assigned responders */}
          <div className="mt-7 pt-5 border-t border-resqnow-border-soft">

            <div className="flex items-start gap-3">

              {/* Responder icon */}
              <div className="w-9 h-9 rounded-xl bg-resqnow-insight/10 flex items-center justify-center shrink-0">

                <Radio className="w-4 h-4 text-resqnow-insight" />
              </div>

              <div className="flex-1">

                <p className="text-[11px] font-bold text-resqnow-secondary">
                  Emergency Responder?
                </p>

                <p className="text-[10px] text-resqnow-muted mt-1 leading-relaxed">
                  Use the responder portal to view assigned incidents and update response status.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/responder/login')}
                  className="mt-3 text-[11px] font-semibold text-resqnow-violet hover:text-resqnow-primary flex items-center gap-1.5"
                >
                  Responder Access

                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-1.5">

            <span className="w-1.5 h-1.5 rounded-full bg-resqnow-safe" />

            <p className="text-[9px] text-resqnow-placeholder uppercase tracking-wider">
              Secure Resident Access
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}