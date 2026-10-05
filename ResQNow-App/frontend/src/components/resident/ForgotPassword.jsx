// src/components/resident/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Mail, MailCheck } from 'lucide-react';

import { forgotPassword } from '../../services/authService';
import AuthAside from '../common/AuthAside';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const clean = email.trim().toLowerCase();

    if (!clean) {
      setError('Email is required');
      return;
    }

    if (!EMAIL_PATTERN.test(clean)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await forgotPassword({ email: clean });
      setSentTo(clean);
    } catch (requestError) {
      setError(
        requestError.errors?.email?.[0] ||
          requestError.message ||
          'We could not process your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <AuthAside
        eyebrow="Account recovery"
        title="Locked out? We’ll get you back in."
        text="Enter the email you registered with and we will send you a link to choose a new password."
      />

      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="mb-8 text-lg font-bold tracking-tight text-[#101C2E] lg:hidden">
            ResQNow
          </p>

          {sentTo ? (
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FA]">
                <MailCheck className="h-6 w-6 text-[#1F5FA6]" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#101C2E]">
                Check your email
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                If an account exists for{' '}
                <span className="font-medium text-slate-700">{sentTo}</span>,
                a password reset link is on its way. The link expires after a
                short time.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                No email after a few minutes? Check your spam folder, or ask
                barangay personnel to help you recover your account.
              </p>
              <Link
                to="/login"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-md bg-[#1F5FA6] text-sm font-semibold text-white transition-colors hover:bg-[#174A86]"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold tracking-tight text-[#101C2E]">
                Forgot your password?
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                We’ll email you a link to reset it.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-2.5 rounded-md border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-3 text-sm text-[#B42318]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError('');
                      }}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(error)}
                      className={`h-11 w-full rounded-md border bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 ${
                        error
                          ? 'border-[#FDA29B] focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/15'
                          : 'border-slate-300 focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/15'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1F5FA6] text-sm font-semibold text-white transition-colors hover:bg-[#174A86] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1F5FA6]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
