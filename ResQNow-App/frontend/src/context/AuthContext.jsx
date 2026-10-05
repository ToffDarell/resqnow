// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { clearAuthToken, getAuthToken } from '../services/api';
import {
  getCurrentUser,
  loginResident,
  logoutResident,
  registerResident,
  updateResidentProfile,
} from '../services/authService';

// Only residents and responders use this app; administrators sign in at
// the web admin.
const APP_ROLES = ['resident', 'responder'];

const AuthContext =
  createContext(null);

// ============ AUTH PROVIDER ============

export function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  // ============ RESTORE SESSION ============
  // Check Laravel when the app first opens.

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      // Remove old mock authentication.
      localStorage.removeItem(
        'resqnow_resident'
      );

      // Signed out: skip the network round-trip entirely.
      if (!getAuthToken()) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const currentUser =
          await getCurrentUser();

        if (isMounted) {
          if (APP_ROLES.includes(currentUser?.role)) {
            setUser(
              currentUser
            );
          } else {
            // A token from another portal (for example an admin): drop it.
            clearAuthToken();
            setUser(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }

        // 401 simply means the resident
        // is not currently signed in.
        if (
          error.status !== 401 &&
          import.meta.env.DEV
        ) {
          console.error(
            'Session restore failed:',
            error
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(
            false
          );
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============ LOGIN ============

  const login = async (
    credentials
  ) => {
    const loggedInUser =
      await loginResident(
        credentials
      );

    if (!APP_ROLES.includes(loggedInUser?.role)) {
      clearAuthToken();

      const rejected = new Error(
        'The email or password you entered is incorrect.'
      );

      rejected.status = 422;

      throw rejected;
    }

    setUser(
      loggedInUser
    );

    return loggedInUser;
  };

  // ============ REGISTER ============

  const register = async (
    residentData
  ) => {
    return registerResident(
      residentData
    );
  };

  // ============ LOGOUT ============

  const logout = async () => {
    try {
      await logoutResident();
    } finally {
      // Clear frontend state even when
      // the server session already expired.
      setUser(null);

      localStorage.removeItem(
        'resqnow_resident'
      );
    }
  };

  // ============ REFRESH USER ============

  const refreshUser = async () => {
    const currentUser =
      await getCurrentUser();

    setUser(
      currentUser
    );

    return currentUser;
  };

  // ============ UPDATE PROFILE ============
  // Persist profile changes to Laravel/MySQL,
  // then replace the current user with the
  // fresh user returned by the backend.

  const updateProfile = async (
    updates
  ) => {
    const updatedUser =
      await updateResidentProfile(
        updates
      );

    setUser(
      updatedUser
    );

    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        isLoggedIn:
          !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============ AUTH HOOK ============

export function useAuth() {
  const ctx =
    useContext(
      AuthContext
    );

  if (!ctx) {
    throw new Error(
      'useAuth must be inside AuthProvider'
    );
  }

  return ctx;
}