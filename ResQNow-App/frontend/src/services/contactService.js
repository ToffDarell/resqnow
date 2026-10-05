// src/services/contactService.js
import { apiRequest } from './api';
import savedDirectory from '../data/contactDirectory.json';

export function validateContactDirectory(value) {
  if (
    !value || !Array.isArray(value.contacts) || !value.meta ||
    !value.evacuationInformation || !value.barangayServices ||
    !Array.isArray(value.barangayServices.emergency) ||
    !Array.isArray(value.barangayServices.nonEmergency) ||
    !Array.isArray(value.communicationProcedure?.channels)
  ) {
    throw new Error('The contact directory response is incomplete.');
  }

  const ids = new Set();
  for (const contact of value.contacts) {
    if (
      !contact?.id || ids.has(contact.id) || !contact.name ||
      !['barangay', 'emergency', 'health', 'community', 'additional'].includes(contact.group) ||
      !Array.isArray(contact.phoneNumbers) ||
      contact.phoneNumbers.some((phone) => typeof phone.number !== 'string')
    ) {
      throw new Error('A contact directory entry is invalid.');
    }
    ids.add(contact.id);
  }
  return value;
}

// The bundled list keeps contact information available if the directory
// endpoint is not installed yet or cannot be reached. The screen labels it
// as saved information; a successful API response replaces the whole list.
export async function getContactDirectory() {
  let timeout;
  const controller = new AbortController();
  try {
    const response = await Promise.race([
      apiRequest('/api/contacts', { signal: controller.signal }),
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
          reject(new Error('Contact request timed out.'));
        }, 7000);
      }),
    ]);
    return {
      directory: validateContactDirectory(response?.data ?? response),
      source: 'api',
    };
  } catch (error) {
    const status = Number(error?.status ?? error?.statusCode ?? error?.response?.status);
    // Respect authentication failures instead of turning them into a fallback.
    if (status === 401 || status === 403) throw error;
    return { directory: validateContactDirectory(savedDirectory), source: 'saved' };
  } finally {
    clearTimeout(timeout);
  }
}
