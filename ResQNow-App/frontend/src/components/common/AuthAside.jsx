// src/components/common/AuthAside.jsx
import { ShieldCheck } from 'lucide-react';
import barangayPhoto from '../../assets/barangay/barangay-camunatan.jpg';

/**
 * Left panel shared by the sign-in, forgot-password and responder screens.
 * Same structure as the web admin's login.
 */
export default function AuthAside({ eyebrow, title, text, children }) {
  return (
    <aside className="relative hidden overflow-hidden bg-[#101C2E] text-white lg:block">
      <div className="sticky top-0 flex h-dvh flex-col justify-between">
        <img
          src={barangayPhoto}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#101C2E]/75" />

        <div className="relative z-10 flex items-center gap-2.5 p-12">
          <ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
          <p className="text-xl font-bold tracking-tight">ResQNow</p>
        </div>

        <div className="relative z-10 max-w-md p-12">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{text}</p>
          {children}
        </div>

        <p className="relative z-10 p-12 text-xs text-white/50">
          Barangay Camunatan · City of Ilagan
        </p>
      </div>
    </aside>
  );
}
