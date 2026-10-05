// src/utils/contactUtils.js

import savedDirectory from '../data/contactDirectory.json';

export function toTelephoneHref(number) {
  if (typeof number !== 'string') return null;

  const cleaned = number.replace(/[\s().-]/g, '');

  if (/^09\d{9}$/.test(cleaned)) {
    return `tel:+63${cleaned.slice(1)}`;
  }

  if (/^0\d{9,10}$/.test(cleaned)) {
    return `tel:+63${cleaned.slice(1)}`;
  }

  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
    return `tel:${cleaned}`;
  }

  if (/^\d{3,6}$/.test(cleaned)) {
    return `tel:${cleaned}`;
  }

  return null;
}

export function getBarangayHotline() {
  const contact = savedDirectory?.contacts?.find(
    (item) => item.id === 'barangay-emergency-hotline'
  );

  const phone = contact?.phoneNumbers?.[0];
  const href = toTelephoneHref(phone?.number);

  if (!phone || !href) return null;

  return {
    name: contact.name,
    number: phone.number,
    displayNumber: phone.displayNumber || phone.number,
    href,
  };
}
