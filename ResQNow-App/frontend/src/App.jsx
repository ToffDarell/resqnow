import { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

import LoadingSpinner from './components/common/LoadingSpinner';

import Login from './components/resident/Login';
import Register from './components/resident/Register';
import ResidentLayout from './components/resident/ResidentLayout';
const Dashboard = lazy(() => import('./components/resident/Dashboard'));
const SubmitReportChoice = lazy(() => import('./components/resident/SubmitReportChoice'));
const EmergencyReport = lazy(() => import('./components/resident/EmergencyReport'));
const NonEmergencyReport = lazy(() => import('./components/resident/NonEmergencyReport'));
const TrackReports = lazy(() => import('./components/resident/TrackReports'));
const ReportDetail = lazy(() => import('./components/resident/ReportDetail'));
const EmergencyContacts = lazy(() => import('./components/resident/EmergencyContacts'));
const Notifications = lazy(() => import('./components/resident/Notifications'));
const Settings = lazy(() => import('./components/resident/Settings'));
const SafetyTips = lazy(() => import('./components/resident/SafetyTips'));
const Updates = lazy(() => import('./components/resident/Updates'));
const UpdateDetail = lazy(() => import('./components/resident/UpdateDetail'));

import ForgotPassword from './components/resident/ForgotPassword';
import ResetPassword from './components/resident/ResetPassword';
import ResponderLogin from './components/responder/ResponderLogin';
import ResponderLayout from './components/responder/ResponderLayout';
const ResponderDashboard = lazy(() => import('./components/responder/ResponderDashboard'));
const ResponderTrack = lazy(() => import('./components/responder/ResponderTrack'));
const ResponderFullMap = lazy(() => import('./components/responder/ResponderFullMap'));
const ResponderIncidentDetail = lazy(() => import('./components/responder/ResponderIncidentDetail'));
const ResponderContacts = lazy(() => import('./components/responder/ResponderContacts'));
const ResponderUpdates = lazy(() => import('./components/responder/ResponderUpdates'));
const ResponderProfile = lazy(() => import('./components/responder/ResponderProfile'));

function homeForRole(role) {
  if (role === 'responder') {
    return '/responder/dashboard';
  }

  return '/dashboard';
}

function ProtectedRoute({
  children,
  roles,
  loginPath = '/login',
}) {
  const {
    isLoggedIn,
    isLoading,
    user,
  } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner message="Checking secure session..." />
    );
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to={loginPath}
        replace
      />
    );
  }

  if (
    roles?.length &&
    !roles.includes(user?.role)
  ) {
    return (
      <Navigate
        to={homeForRole(user?.role)}
        replace
      />
    );
  }

  return children;
}

function PublicRoute({
  children,
}) {
  const {
    isLoggedIn,
    isLoading,
    user,
  } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner message="Checking session..." />
    );
  }

  if (isLoggedIn) {
    return (
      <Navigate
        to={homeForRole(user?.role)}
        replace
      />
    );
  }

  return children;
}

function UnknownRoute() {
  const {
    isLoggedIn,
    isLoading,
    user,
  } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner message="Checking session..." />
    );
  }

  return (
    <Navigate
      to={
        isLoggedIn
          ? homeForRole(user?.role)
          : '/login'
      }
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner message="Loading..." />}>
<Routes>

          {/* ============ PUBLIC ============ */}

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/responder/login"
            element={
              <PublicRoute>
                <ResponderLogin />
              </PublicRoute>
            }
          />


          {/* ============ RESIDENT ============ */}

          <Route
            element={
              <ProtectedRoute
                roles={['resident']}
              >
                <ResidentLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/submit"
              element={<SubmitReportChoice />}
            />

            <Route
              path="/submit/emergency"
              element={<EmergencyReport />}
            />

            <Route
              path="/submit/non-emergency"
              element={<NonEmergencyReport />}
            />

            <Route
              path="/track"
              element={<TrackReports />}
            />

            <Route
              path="/track/:reportId"
              element={<ReportDetail />}
            />

            <Route
              path="/contacts"
              element={<EmergencyContacts />}
            />

            <Route
              path="/updates"
              element={<Updates />}
            />

            <Route
              path="/updates/:updateId"
              element={<UpdateDetail />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/profile"
              element={<Settings />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/safety-tips"
              element={<SafetyTips />}
            />
          </Route>


          {/* ============ RESPONDER ============ */}

          <Route
            path="/responder"
            element={<Navigate to="/responder/dashboard" replace />}
          />

          <Route
            element={
              <ProtectedRoute
                roles={['responder']}
                loginPath="/responder/login"
              >
                <ResponderLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/responder/dashboard" element={<ResponderDashboard />} />

            <Route path="/responder/missions" element={<ResponderTrack />} />
            <Route path="/responder/missions/map" element={<ResponderFullMap />} />
            <Route path="/responder/missions/:reportId" element={<ResponderIncidentDetail />} />

            <Route path="/responder/contacts" element={<ResponderContacts />} />
            <Route path="/responder/updates" element={<ResponderUpdates />} />
            <Route path="/responder/profile" element={<ResponderProfile />} />

            {/* Legacy URLs kept as safe redirects / compatibility routes. */}
            <Route path="/responder/incidents" element={<Navigate to="/responder/missions" replace />} />
            <Route path="/responder/track" element={<Navigate to="/responder/missions" replace />} />
            <Route path="/responder/incidents/map" element={<Navigate to="/responder/missions/map" replace />} />
            <Route path="/responder/incidents/:reportId" element={<ResponderIncidentDetail />} />
            <Route path="/responder/settings" element={<Navigate to="/responder/profile" replace />} />
            <Route path="/responder/safety-tips" element={<Navigate to="/responder/dashboard" replace />} />
            <Route path="/responder/map" element={<Navigate to="/responder/missions" replace />} />
          </Route>


          {/* ============ FALLBACK ============ */}

          <Route
            path="*"
            element={<UnknownRoute />}
          />

        </Routes>
</Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}