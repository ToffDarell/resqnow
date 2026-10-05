export function normalizePhoneNumber(number) {
  return String(number || '').replace(/[^+\d]/g, '');
}

export function buildEmergencySmsMessage({
  emergencyType,
  reporterName,
  contactNumber,
  location,
  latitude,
  longitude,
  landmark,
  description,
}) {
  const lines = [
    'RESQNOW EMERGENCY SOS',
    emergencyType ? `Type: ${emergencyType}` : null,
    reporterName ? `Reporter: ${reporterName}` : null,
    contactNumber ? `Contact: ${contactNumber}` : null,
    location ? `Location: ${location}` : null,
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : null,
    landmark ? `Landmark: ${landmark}` : null,
    description ? `Details: ${description}` : null,
    'Please confirm receipt and coordinate barangay assistance.',
  ].filter(Boolean);

  return lines.join('\n');
}

export function openSmsComposer({ number, body }) {
  const phone = normalizePhoneNumber(number);

  if (!phone) {
    throw new Error('Barangay hotline number is unavailable.');
  }

  window.location.href = `sms:${phone}?body=${encodeURIComponent(body)}`;
}
