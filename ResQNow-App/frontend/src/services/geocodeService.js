// src/services/geocodeService.js
//
// Address <-> coordinates through OpenStreetMap Nominatim.
// Public instance: callers must debounce (see the 1 request/second policy)
// and never fire on every keystroke.

const BASE = 'https://nominatim.openstreetmap.org';

// Barangay Camunatan, City of Ilagan. Results inside this box rank first.
const VIEWBOX = '121.84,17.18,121.95,17.09'; // left,top,right,bottom

function shorten(result) {
  const a = result?.address;

  if (!a) {
    return result?.display_name?.split(',').slice(0, 4).join(',').trim() || '';
  }

  const street = [a.house_number, a.road].filter(Boolean).join(' ');

  return [
    street,
    a.neighbourhood || a.suburb || a.quarter,
    a.village || a.hamlet,
    a.city || a.town || a.municipality,
  ]
    .filter(Boolean)
    .join(', ');
}

/** Address text -> first match as { latitude, longitude, label } or null. */
export async function searchAddress(query, signal) {
  const url = new URL(`${BASE}/search`);

  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('countrycodes', 'ph');
  url.searchParams.set('viewbox', VIEWBOX);
  url.searchParams.set('q', query);

  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error('Address lookup failed.');

  const [first] = await response.json();

  if (!first) return null;

  return {
    latitude: Number(Number(first.lat).toFixed(7)),
    longitude: Number(Number(first.lon).toFixed(7)),
    label: shorten(first),
  };
}

/** Coordinates -> short readable address, or '' when nothing useful is found. */
export async function reverseGeocode(latitude, longitude, signal) {
  const url = new URL(`${BASE}/reverse`);

  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));

  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error('Reverse lookup failed.');

  const result = await response.json();

  return result?.error ? '' : shorten(result);
}
