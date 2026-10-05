import { useEffect, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { login } from "../services/authService";

import camunatanEntrance from "../assets/camunatan-entrance.png";

function AdminLogin({ onLogin }) {
  const usernameRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("resqnow_admin_remembered_username") || "";
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    return Boolean(
      localStorage.getItem("resqnow_admin_remembered_username")
    );
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleFocus = (field) => {
    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setError("");
  };

  const handleBlur = (field) => {
    if (field === "username" && !username.trim()) {
      setFieldErrors((current) => ({
        ...current,
        username: "Username is required",
      }));
    }

    if (field === "password" && !password.trim()) {
      setFieldErrors((current) => ({
        ...current,
        password: "Password is required",
      }));
    }

  };

const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");

  const errors = {
    username: !username.trim() ? "Username is required" : "",
    password: !password.trim() ? "Password is required" : "",
  };

  setFieldErrors(errors);

  if (errors.username || errors.password) {
    return;
  }

  setIsSubmitting(true);

  try {
    /*
     * The backend currently authenticates using email.
     * The existing UI still calls this field "Username",
     * so we send the entered value as the email.
     */
  const result = await login(
  username.trim(),
  password,
  rememberMe,
);

    /*
     * Only remember the username/email locally.
     * Never store the password.
     */
    if (rememberMe) {
      localStorage.setItem(
        "resqnow_admin_remembered_username",
        username.trim(),
      );
    } else {
      localStorage.removeItem(
        "resqnow_admin_remembered_username",
      );
    }

    /*
     * Pass the authenticated backend user
     * back to App.jsx.
     */
    if (onLogin) {
      onLogin(result.user);
    }
  } catch (error) {
    console.error("Login failed:", error);

    setError(
      error.message ||
        "Unable to sign in. Please check your credentials.",
    );
  } finally {
    setIsSubmitting(false);
  }
};
  const inputClass = (field) =>
    `h-11 w-full rounded-md border bg-white pl-10 text-sm text-[#101C2E] outline-none transition-colors placeholder:text-slate-400 ${
      fieldErrors[field]
        ? "border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20"
        : "border-slate-300 focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/20"
    }`;

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* BRAND PANEL */}
      <aside className="relative hidden overflow-hidden bg-[#101C2E] text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src={camunatanEntrance}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#101C2E]/70" />

        <div className="relative z-10 p-12">
          <p className="text-xl font-bold tracking-tight">ResQNow</p>
        </div>

        <div className="relative z-10 max-w-md p-12">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Hazard reporting and emergency response, in one place.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Verify reports, prioritize incidents, and coordinate responders for
            Barangay Camunatan, City of Ilagan.
          </p>
        </div>

        <p className="relative z-10 p-12 text-xs text-white/50">
          Barangay Camunatan, City of Ilagan
        </p>
      </aside>

      {/* FORM */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="mb-8 text-lg font-bold tracking-tight text-[#101C2E] lg:hidden">
            ResQNow
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-[#101C2E]">
            Sign in
          </h2>

          <p className="mt-1.5 text-sm text-slate-500">
            Authorized barangay personnel only.
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
            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  ref={usernameRef}
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setFieldErrors((current) => ({ ...current, username: "" }));
                    setError("");
                  }}
                  onFocus={() => handleFocus("username")}
                  onBlur={() => handleBlur("username")}
                  placeholder="you@example.com"
                  autoComplete="username"
                  className={`${inputClass("username")} pr-3`}
                />
              </div>

              {fieldErrors.username && (
                <p className="mt-1.5 text-xs text-[#D92D20]">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((current) => ({ ...current, password: "" }));
                    setError("");
                  }}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputClass("password")} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-[#D92D20]">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* REMEMBER ME */}
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1F5FA6] focus:ring-[#1F5FA6] focus:ring-offset-0"
              />

              <span className="text-sm text-slate-600">Remember me</span>
            </label>

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1F5FA6] text-sm font-semibold text-white transition-colors hover:bg-[#174A86] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-500">
            This portal is for authorized barangay administrators and emergency
            response personnel. Activity is logged.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;
