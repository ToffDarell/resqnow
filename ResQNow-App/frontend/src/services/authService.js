// src/services/authService.js

import {
  apiRequest,
  clearAuthToken,
  getCsrfCookie,
  setAuthToken,
} from './api';

// ============ RESPONSE HELPER ============
// Laravel resources may be returned directly
// or inside a data wrapper.
function getUserFromResponse(data) {
  return (
    data?.user?.data ||
    data?.user ||
    data?.data ||
    data ||
    null
  );
}

// ============ REGISTER ============

export async function registerResident(
  residentData
) {
  await getCsrfCookie();

  return apiRequest(
    '/api/register',
    {
      method: 'POST',

      body:
        JSON.stringify(
          residentData
        ),
    }
  );
}

// ============ LOGIN ============

export async function loginResident(
  credentials
) {
  await getCsrfCookie();

  const data =
    await apiRequest(
      '/api/login',
      {
        method: 'POST',

        body:
          JSON.stringify(
            credentials
          ),
      }
    );

  // Bearer token for every later request.
  if (data?.token) {
    setAuthToken(data.token);
  }

  return getUserFromResponse(
    data
  );
}

// ============ FORGOT PASSWORD ============

export async function forgotPassword({ email }) {
  return apiRequest(
    '/api/forgot-password',
    {
      method: 'POST',

      body:
        JSON.stringify({
          email,
        }),
    }
  );
}

// ============ CURRENT USER ============

export async function getCurrentUser() {
  const data =
    await apiRequest(
      '/api/user'
    );

  return getUserFromResponse(
    data
  );
}

// ============ UPDATE PROFILE ============

export async function updateResidentProfile(
  profileData
) {
  await getCsrfCookie();

  const data =
    await apiRequest(
      '/api/profile',
      {
        method: 'PUT',

        body:
          JSON.stringify(
            profileData
          ),
      }
    );

  return getUserFromResponse(
    data
  );
}

// ============ LOGOUT ============

export async function logoutResident() {
  try {
    return await apiRequest(
      '/api/logout',
      {
        method: 'POST',
      }
    );
  } finally {
    clearAuthToken();
  }
}