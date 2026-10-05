// src/components/resident/ResetPassword.jsx

import {
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
} from 'lucide-react';

import {
  apiRequest,
  getCsrfCookie,
} from '../../services/api';

import {
  useAuth,
} from '../../context/AuthContext';

// ============ PASSWORD REQUIREMENTS ============

function getPasswordChecks(password) {
  return {
    length:
      password.length >= 8,

    lowercase:
      /[a-z]/.test(password),

    uppercase:
      /[A-Z]/.test(password),

    number:
      /\d/.test(password),

    symbol:
      /[^A-Za-z0-9]/.test(password),
  };
}

// ============ RESET PASSWORD ============

export default function ResetPassword() {
  const navigate =
    useNavigate();

  const {
  logout,
  } = useAuth();

  const [
    searchParams,
  ] = useSearchParams();

  // Laravel places these values in the reset link.
  const token =
    searchParams.get(
      'token'
    ) || '';

  const email =
    searchParams.get(
      'email'
    ) || '';

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({});

  const [
    isSuccess,
    setIsSuccess,
  ] = useState(false);

  // ============ PASSWORD CHECKS ============

  const passwordChecks =
    useMemo(
      () =>
        getPasswordChecks(
          password
        ),
      [password]
    );

  const passwordIsValid =
    Object
      .values(
        passwordChecks
      )
      .every(Boolean);

  const passwordsMatch =
    password !== '' &&
    password ===
      passwordConfirmation;

  const linkIsValid =
    Boolean(
      token &&
      email
    );

  // ============ SUBMIT ============

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        isSubmitting ||
        isSuccess
      ) {
        return;
      }

      setErrorMessage('');
      setFieldErrors({});

      // The URL itself must contain both values.
      if (!linkIsValid) {
        setErrorMessage(
          'This password reset link is incomplete or invalid.'
        );

        return;
      }

      // Mirror the Laravel password policy.
      if (!passwordIsValid) {
        setFieldErrors({
          password: [
            'Your password does not meet all password requirements.',
          ],
        });

        return;
      }

      if (
        password !==
        passwordConfirmation
      ) {
        setFieldErrors({
          password_confirmation: [
            'The password confirmation does not match.',
          ],
        });

        return;
      }

      setIsSubmitting(true);

      try {
        /**
         * When called from the React SPA,
         * initialize the Sanctum CSRF cookie
         * before making the POST request.
         */
        await getCsrfCookie();

await apiRequest(
  '/api/reset-password',
  {
    method: 'POST',

    body:
      JSON.stringify({
        token,
        email,
        password,

        password_confirmation:
          passwordConfirmation,
      }),
  }
);

/**
 * A browser may still have an authenticated
 * resident session while opening a reset link.
 *
 * After successfully resetting the password,
 * end that existing session so "Back to Sign In"
 * really returns to the login page.
 */
try {
  await logout();
} catch (logoutError) {
  /**
   * The password reset already succeeded.
   *
   * AuthContext clears its local user state in
   * logout() even if the server-side logout fails,
   * so we must not report the password reset itself
   * as failed here.
   */
  if (import.meta.env.DEV) {
    console.error(
      'Session cleanup after password reset failed:',
      logoutError
    );
  }
}

// Remove password values from component state.
setPassword('');
setPasswordConfirmation('');

setIsSuccess(true);

setIsSuccess(true);
      } catch (error) {
        setFieldErrors(
          error?.errors || {}
        );

        setErrorMessage(
          error?.message ||
            'Unable to reset your password. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  // ============ SUCCESS ============

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-resqnow-canvas px-4 py-8 flex items-center justify-center">

        <div className="w-full max-w-md">

          <div className="bg-white border border-resqnow-border-soft rounded-3xl p-6 shadow-[0_10px_30px_rgba(31,29,71,0.06)]">

            <div className="w-14 h-14 rounded-2xl bg-resqnow-safe/10 flex items-center justify-center mx-auto">

              <CheckCircle2 className="w-7 h-7 text-resqnow-safe" />
            </div>

            <div className="text-center mt-4">

              <h1 className="text-xl font-bold text-resqnow-primary">
                Password reset
              </h1>

              <p className="text-[13px] text-resqnow-muted mt-2 leading-relaxed">
                Your password has been changed successfully.
                You can now sign in using your new password.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/login',
                  {
                    replace: true,
                  }
                )
              }
              className="w-full min-h-[48px] mt-6 rounded-xl bg-brand-gradient text-white text-[13px] font-semibold active:scale-[0.99] transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-resqnow-canvas px-4 py-8 flex items-center justify-center">

      <div className="w-full max-w-md">

        {/* ============ HEADER ============ */}
        <div className="text-center mb-5">

          <div className="w-14 h-14 rounded-2xl bg-resqnow-violet/10 text-resqnow-violet flex items-center justify-center mx-auto">

            <KeyRound className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-resqnow-primary mt-4">
            Reset Password
          </h1>

          <p className="text-[13px] text-resqnow-muted mt-2 leading-relaxed">
            Create a new password for your ResQNow resident account.
          </p>
        </div>

        {/* ============ INVALID LINK ============ */}
        {!linkIsValid && (
          <div className="bg-white border border-resqnow-border-soft rounded-3xl p-5">

            <div
              role="alert"
              className="bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl p-3"
            >
              <div className="flex items-start gap-2.5">

                <AlertCircle className="w-5 h-5 text-resqnow-critical shrink-0 mt-0.5" />

                <div>

                  <p className="text-[13px] font-semibold text-resqnow-crimson">
                    Invalid reset link
                  </p>

                  <p className="text-[12px] text-resqnow-secondary mt-1 leading-relaxed">
                    This link is missing the information required to reset your password.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="mt-4 min-h-[46px] w-full rounded-xl border border-resqnow-violet/20 bg-resqnow-violet/5 text-resqnow-violet text-[13px] font-semibold flex items-center justify-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {/* ============ RESET FORM ============ */}
        {linkIsValid && (
          <form
            onSubmit={
              handleSubmit
            }
            className="bg-white border border-resqnow-border-soft rounded-3xl p-5 shadow-[0_10px_30px_rgba(31,29,71,0.05)]"
          >

            {/* ACCOUNT */}
            <div className="bg-resqnow-canvas rounded-xl p-3 mb-5">

              <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-muted">
                Account
              </p>

              <p className="text-[13px] font-medium text-resqnow-primary mt-1 break-all">
                {email}
              </p>
            </div>

            {/* GENERAL ERROR */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 bg-resqnow-critical/10 border border-resqnow-critical/20 rounded-xl p-3"
              >
                <div className="flex items-start gap-2.5">

                  <AlertCircle className="w-4 h-4 text-resqnow-critical mt-0.5 shrink-0" />

                  <p className="text-[12px] text-resqnow-crimson leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* NEW PASSWORD */}
            <div>

              <label
                htmlFor="password"
                className="text-[12px] font-semibold text-resqnow-primary"
              >
                New Password
              </label>

              <div className="relative mt-1.5">

                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resqnow-muted" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) => {
                    setPassword(
                      event.target.value
                    );

                    setErrorMessage('');
                    setFieldErrors({});
                  }}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  className={`w-full min-h-[48px] rounded-xl border bg-white pl-10 pr-12 py-3 text-[13px] text-resqnow-primary outline-none transition-all ${
                    fieldErrors
                      .password
                      ? 'border-resqnow-critical focus:ring-2 focus:ring-resqnow-critical/10'
                      : 'border-resqnow-border focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-resqnow-muted hover:text-resqnow-violet"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {fieldErrors
                .password?.[0] && (
                <p className="text-[11px] text-resqnow-critical mt-1.5">
                  {
                    fieldErrors
                      .password[0]
                  }
                </p>
              )}
            </div>

            {/* PASSWORD REQUIREMENTS */}
            <div className="bg-resqnow-canvas rounded-xl p-3 mt-3">

              <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-muted mb-2">
                Password requirements
              </p>

              <div className="grid grid-cols-1 gap-1.5">

                <Requirement
                  passed={
                    passwordChecks.length
                  }
                  text="At least 8 characters"
                />

                <Requirement
                  passed={
                    passwordChecks.uppercase &&
                    passwordChecks.lowercase
                  }
                  text="Uppercase and lowercase letters"
                />

                <Requirement
                  passed={
                    passwordChecks.number
                  }
                  text="At least one number"
                />

                <Requirement
                  passed={
                    passwordChecks.symbol
                  }
                  text="At least one symbol"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mt-4">

              <label
                htmlFor="passwordConfirmation"
                className="text-[12px] font-semibold text-resqnow-primary"
              >
                Confirm New Password
              </label>

              <div className="relative mt-1.5">

                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resqnow-muted" />

                <input
                  id="passwordConfirmation"
                  type={
                    showConfirmation
                      ? 'text'
                      : 'password'
                  }
                  value={
                    passwordConfirmation
                  }
                  onChange={(
                    event
                  ) => {
                    setPasswordConfirmation(
                      event.target.value
                    );

                    setErrorMessage('');

                    setFieldErrors(
                      (current) => {
                        const next = {
                          ...current,
                        };

                        delete next.password_confirmation;

                        return next;
                      }
                    );
                  }}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  className={`w-full min-h-[48px] rounded-xl border bg-white pl-10 pr-12 py-3 text-[13px] text-resqnow-primary outline-none transition-all ${
                    fieldErrors
                      .password_confirmation
                      ? 'border-resqnow-critical focus:ring-2 focus:ring-resqnow-critical/10'
                      : 'border-resqnow-border focus:border-resqnow-violet/40 focus:ring-2 focus:ring-resqnow-violet/10'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmation(
                      (value) =>
                        !value
                    )
                  }
                  aria-label={
                    showConfirmation
                      ? 'Hide password confirmation'
                      : 'Show password confirmation'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-resqnow-muted hover:text-resqnow-violet"
                >
                  {showConfirmation ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {passwordConfirmation &&
                passwordsMatch && (
                  <p className="text-[11px] text-resqnow-safe mt-1.5">
                    Passwords match.
                  </p>
                )}

              {fieldErrors
                .password_confirmation?.[0] && (
                <p className="text-[11px] text-resqnow-critical mt-1.5">
                  {
                    fieldErrors
                      .password_confirmation[0]
                  }
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full min-h-[48px] mt-5 rounded-xl bg-brand-gradient text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>

            {/* BACK TO LOGIN */}
            <Link
              to="/login"
              className="mt-3 min-h-[44px] w-full text-[12px] font-semibold text-resqnow-violet flex items-center justify-center"
            >
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

// ============ REQUIREMENT ============

function Requirement({
  passed,
  text,
}) {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
          passed
            ? 'bg-resqnow-safe/15'
            : 'bg-resqnow-border-soft'
        }`}
      >
        {passed && (
          <CheckCircle2 className="w-3 h-3 text-resqnow-safe" />
        )}
      </div>

      <span
        className={`text-[11px] ${
          passed
            ? 'text-resqnow-safe'
            : 'text-resqnow-muted'
        }`}
      >
        {text}
      </span>
    </div>
  );
}