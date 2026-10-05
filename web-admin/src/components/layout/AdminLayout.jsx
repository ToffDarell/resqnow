import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AdminLayout({
  children,
  activePage,
  onNavigate,
  onLogout,
  onAddManualReport,
  // RBAC
  currentUser,
  can,
  systemSettings,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const withClose = (handler) => (...args) => {
    closeMenu();
    handler?.(...args);
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--canvas-neutral)]">
      {/* MOBILE BACKDROP */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#101C2E]/50 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={withClose(onNavigate)}
        onLogout={onLogout}
        onAddManualReport={withClose(onAddManualReport)}
        // RBAC
        currentUser={currentUser}
        can={can}
        systemSettings={systemSettings}
        // MOBILE DRAWER
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          currentUser={currentUser}
          onMenuClick={() => setIsMenuOpen(true)}
        />

        <section className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;
