import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import barangayPhoto from '../../assets/barangay/barangay-camunatan.jpg';

export default function ResponderLogin() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resqnow_responder_email');

    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }

    emailRef.current?.focus();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your responder email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const account = await login({
        email: email.trim().toLowerCase(),
        password,
        remember,
      });

      if (account?.role !== 'responder') {
        await logout();
        setError('This portal is for verified responder accounts only.');
        return;
      }

      if (remember) {
        localStorage.setItem('resqnow_responder_email', email.trim().toLowerCase());
      } else {
        localStorage.removeItem('resqnow_responder_email');
      }

      navigate('/responder/dashboard', { replace: true });
    } catch (loginError) {
      setError(loginError?.message || 'Unable to sign in to the responder portal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-resqnow-ivory flex items-center justify-center p-0 sm:p-5">
      <div className="w-full min-h-screen sm:min-h-0 sm:max-w-[900px] bg-white sm:rounded-3xl sm:shadow-[0_16px_50px_rgba(31,29,71,0.12)] sm:border sm:border-resqnow-border-soft overflow-hidden md:grid md:grid-cols-[0.9fr_1.1fr]">
        <section
          className="relative min-h-[225px] md:min-h-[650px] bg-cover bg-center"
          style={{ backgroundImage: `url(${barangayPhoto})` }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-resqnow-primary/80 via-resqnow-violet/60 to-resqnow-mint/45" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative z-10 h-full min-h-[225px] md:min-h-[650px] p-6 md:p-8 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-[22px] font-extrabold text-white leading-tight">ResQNow</h1>
                <p className="text-[10px] text-white/80">Barangay Camunatan</p>
              </div>
            </div>

            <div className="max-w-[320px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">Responder Field Access</p>
              <h2 className="text-[24px] md:text-[30px] font-bold text-white mt-2 leading-tight">Assigned incidents, one coordinated response.</h2>
              <p className="text-[12px] md:text-[13px] text-white/80 mt-2 leading-relaxed">
                Open resident reports assigned to you, call the reporter, navigate to the incident, and review field updates.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-7 sm:px-9 sm:py-9 md:px-10 md:py-10 flex flex-col justify-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mb-5 inline-flex items-center gap-1.5 self-start text-[11px] font-semibold text-resqnow-muted hover:text-resqnow-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Resident access
          </button>

          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-resqnow-violet">Responder Access</p>
            <h2 className="text-[24px] font-bold text-resqnow-primary mt-1">Welcome back</h2>
            <p className="text-[12px] text-resqnow-muted mt-1">Sign in to access your assigned response workspace.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/8 px-4 py-3 text-[12px] text-resqnow-crimson">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="responder-email" className="mb-1.5 block text-[11px] font-bold text-resqnow-secondary">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-resqnow-placeholder" />
                <input
                  id="responder-email"
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="responder@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-resqnow-border bg-resqnow-canvas py-3.5 pl-11 pr-4 text-[13px] outline-none focus:border-resqnow-violet/50 focus:ring-2 focus:ring-resqnow-violet/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="responder-password" className="mb-1.5 block text-[11px] font-bold text-resqnow-secondary">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-resqnow-placeholder" />
                <input
                  id="responder-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-resqnow-border bg-resqnow-canvas py-3.5 pl-11 pr-12 text-[13px] outline-none focus:border-resqnow-violet/50 focus:ring-2 focus:ring-resqnow-violet/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-resqnow-placeholder hover:text-resqnow-violet"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-[11px] text-resqnow-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 accent-resqnow-violet"
              />
              Remember this email and keep me signed in
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-gradient text-[13px] font-bold text-white shadow-[0_8px_22px_rgba(131,70,242,.20)] disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-resqnow-muted">
            Need resident reporting?{' '}
            <Link to="/login" className="font-bold text-resqnow-violet">Go to Resident Access</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
