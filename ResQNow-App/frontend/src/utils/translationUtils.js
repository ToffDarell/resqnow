// src/utils/translationUtils.js

// ============ REPORT TYPES ============
// Maps backend values to translation keys
const reportTypeKeys = {
  Emergency:
    'reportType.emergency',

  'Non-Emergency':
    'reportType.nonEmergency',
};

// ============ CONCERN TYPES ============
// Stored report values stay unchanged
const concernKeys = {
  'Life and Death Emergency':
    'emergency.categories.lifeDeath.label',

  'Life-Threatening':
    'emergency.categories.lifeDeath.label',

  'Fire Emergency':
    'emergency.categories.fire.label',

  'Medical Emergency':
    'emergency.categories.medical.label',

  'Public Safety / Violence':
    'emergency.categories.violence.label',

  'Violence / Safety Threat':
    'emergency.categories.violence.label',

  'Flood Rescue Needed':
    'emergency.categories.flood.label',

  'Flood Rescue':
    'emergency.categories.flood.label',

  'Road Accident':
    'emergency.categories.accident.label',

  'Immediate Evacuation':
    'emergency.categories.evacuation.label',

  'Urgent Evacuation':
    'emergency.categories.evacuation.label',

  'Evacuation Assistance':
    'nonEmergency.categories.evacuation.label',

  'Evacuation Preparation':
    'nonEmergency.categories.evacuation.label',

  'Evacuation Help':
    'nonEmergency.categories.evacuation.label',

  'Barangay Health Worker Assistance':
    'nonEmergency.categories.healthWorker.label',

  'Health Worker Assistance':
    'nonEmergency.categories.healthWorker.label',

  'Road Obstruction':
    'nonEmergency.categories.roadObstruction.label',

  'Blocked Road / Obstruction':
    'nonEmergency.categories.roadObstruction.label',

  'Damaged Facility':
    'nonEmergency.categories.damagedFacility.label',

  'Damaged Public Facility':
    'nonEmergency.categories.damagedFacility.label',

  'Clean-up Assistance':
    'nonEmergency.categories.cleanup.label',

  'Community Clean-Up':
    'nonEmergency.categories.cleanup.label',

  'Community Concern':
    'nonEmergency.categories.community.label',

  'Other Assistance':
    'nonEmergency.categories.other.label',

  'Other Barangay Assistance':
    'nonEmergency.categories.other.label',
};

// ============ AFFECTED PEOPLE ============
const affectedKeys = {
  Child:
    'nonEmergency.affected.child',

  'Senior Citizen':
    'nonEmergency.affected.seniorCitizen',

  PWD:
    'nonEmergency.affected.pwd',

  'Pregnant Person':
    'nonEmergency.affected.pregnantPerson',

  'Injured Person':
    'nonEmergency.affected.injuredPerson',
};

// ============ TRANSLATE VALUE ============
// Translate known backend values
// Unknown values stay unchanged
function translateValue(
  value,
  map,
  t
) {
  const key =
    map[value];

  if (!key || !t) {
    return value;
  }

  return t(key);
}

// Translate report type
function getReportTypeLabel(
  value,
  t
) {
  return translateValue(
    value,
    reportTypeKeys,
    t
  );
}

// Translate concern type
function getConcernLabel(
  value,
  t
) {
  return translateValue(
    value,
    concernKeys,
    t
  );
}

// Translate affected person
function getAffectedLabel(
  value,
  t
) {
  return translateValue(
    value,
    affectedKeys,
    t
  );
}

export {
  getReportTypeLabel,
  getConcernLabel,
  getAffectedLabel,
};