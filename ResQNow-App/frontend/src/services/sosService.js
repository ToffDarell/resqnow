import { apiRequest } from './api';
import { openSmsComposer } from '../utils/smsFallback';

const PENDING_SOS_KEY = 'resqnow_pending_sos_request_v1';
const SOS_KEY_MAX_AGE_MS = 10 * 60 * 1000;
const SOS_REQUEST_TIMEOUT_MS = 5000;
const SOS_GPS_TIMEOUT_MS = 3500;

function randomUuid() {
  if (crypto?.randomUUID) return crypto.randomUUID();

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((value) => value.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10).join(''),
  ].join('-');
}

export function getOrCreateSosKey() {
  try {
    const raw = localStorage.getItem(PENDING_SOS_KEY);
    const saved = raw ? JSON.parse(raw) : null;

    if (
      saved?.uuid &&
      Number.isFinite(saved?.createdAt) &&
      Date.now() - saved.createdAt < SOS_KEY_MAX_AGE_MS
    ) {
      return saved.uuid;
    }
  } catch {
    // Generate a fresh key below.
  }

  const uuid = randomUuid();

  try {
    localStorage.setItem(
      PENDING_SOS_KEY,
      JSON.stringify({ uuid, createdAt: Date.now() })
    );
  } catch {
    // Persistence is best-effort. The in-memory key still works.
  }

  return uuid;
}

export function clearPendingSosKey() {
  try {
    localStorage.removeItem(PENDING_SOS_KEY);
  } catch {
    // No-op.
  }
}

export function captureBestEffortLocation({ timeoutMs = SOS_GPS_TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ location: null, outcome: 'unsupported' });
      return;
    }

    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const timer = window.setTimeout(() => {
      finish({ location: null, outcome: 'timeout' });
    }, timeoutMs + 150);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timer);
        finish({
          outcome: 'gps',
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
          },
        });
      },
      (error) => {
        window.clearTimeout(timer);
        finish({
          location: null,
          outcome:
            error?.code === error?.PERMISSION_DENIED
              ? 'denied'
              : error?.code === error?.TIMEOUT
              ? 'timeout'
              : 'unavailable',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 15000,
      }
    );
  });
}

function extractReport(data) {
  return data?.report?.data || data?.report || data?.data || data;
}

async function postSos({ location, idempotencyKey }) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SOS_REQUEST_TIMEOUT_MS);

  try {
    const data = await apiRequest('/api/reports/sos', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'X-Idempotency-Key': `sos-${idempotencyKey}`,
      },
      body: JSON.stringify({
        location: location || null,
      }),
    });

    return {
      report: extractReport(data),
      message: data?.message || 'SOS received by ResQNow.',
      idempotentReplay: Boolean(data?.idempotentReplay),
      activeRescue: Boolean(data?.activeRescue),
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

// Bearer-token auth has no CSRF cookie to refresh.
async function refreshCsrfCookieFast() {}

export async function submitSos({ location, idempotencyKey }) {
  try {
    return await postSos({ location, idempotencyKey });
  } catch (error) {
    if (error?.status !== 419) throw error;

    await refreshCsrfCookieFast();
    return postSos({ location, idempotencyKey });
  }
}

export function buildSosSmsMessage({ user, location, idempotencyKey }) {
  const latitude = Number.isFinite(location?.latitude)
    ? location.latitude
    : Number(user?.homeLocation?.latitude);
  const longitude = Number.isFinite(location?.longitude)
    ? location.longitude
    : Number(user?.homeLocation?.longitude);
  const accuracy = Number.isFinite(location?.accuracy) ? Math.round(location.accuracy) : null;

  return [
    'RESQNOW SOS',
    user?.fullName ? `Resident: ${user.fullName}` : null,
    user?.contactNumber ? `Mobile: ${user.contactNumber}` : null,
    user?.address ? `Saved address: ${user.address}` : null,
    user?.purok ? `Purok: ${user.purok}` : null,
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `GPS: ${latitude.toFixed(6)},${longitude.toFixed(6)}`
      : null,
    accuracy !== null ? `Accuracy: ${accuracy}m` : null,
    idempotencyKey ? `Ref: ${idempotencyKey.slice(0, 8)}` : null,
    'LIFE-THREATENING EMERGENCY. Please contact the resident and coordinate immediate assistance.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function openSosSms({ number, user, location, idempotencyKey }) {
  const body = buildSosSmsMessage({ user, location, idempotencyKey });
  openSmsComposer({ number, body });
}
