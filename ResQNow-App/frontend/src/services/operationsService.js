import { apiRequest } from './api';

const ANNOUNCEMENT_CACHE_KEY = 'resqnow_announcements_cache_v1';
const EVACUATION_CACHE_KEY = 'resqnow_evacuation_centers_cache_v1';

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        cachedAt: new Date().toISOString(),
      })
    );
  } catch {
    // Local cache is best-effort only.
  }
}

export async function getOperationalAnnouncements({ limit = 20 } = {}) {
  try {
    const response = await apiRequest(`/api/announcements?limit=${limit}`);
    const data = Array.isArray(response?.data) ? response.data : [];
    writeCache(ANNOUNCEMENT_CACHE_KEY, data);
    return { data, source: 'api', cachedAt: null };
  } catch (error) {
    const cached = readCache(ANNOUNCEMENT_CACHE_KEY);

    if (cached?.data) {
      return {
        data: Array.isArray(cached.data) ? cached.data : [],
        source: 'cache',
        cachedAt: cached.cachedAt || null,
        error,
      };
    }

    throw error;
  }
}

export async function getEvacuationCenters({ lat, lng, nearest = false, limit = 20 } = {}) {
  const params = new URLSearchParams();

  if (Number.isFinite(lat)) params.set('lat', String(lat));
  if (Number.isFinite(lng)) params.set('lng', String(lng));
  if (nearest) params.set('nearest', '1');
  params.set('limit', String(limit));

  try {
    const response = await apiRequest(`/api/evacuation-centers?${params.toString()}`);
    const data = Array.isArray(response?.data) ? response.data : [];
    writeCache(EVACUATION_CACHE_KEY, data);
    return { data, source: 'api', cachedAt: null };
  } catch (error) {
    const cached = readCache(EVACUATION_CACHE_KEY);

    if (cached?.data) {
      return {
        data: Array.isArray(cached.data) ? cached.data : [],
        source: 'cache',
        cachedAt: cached.cachedAt || null,
        error,
      };
    }

    throw error;
  }
}
