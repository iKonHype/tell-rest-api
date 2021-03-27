/**
 * @description Default service return structure
 * @typedef {Object} defaultReturnType
 * @property {object|string|object[]|string[]} result promise results
 * @property {boolean} success true|false
 */
const defaultReturnType = {
  result: null,
  success: null,
};

/**
 * @description Response return structure
 * @typedef {object} Response
 * @property {object|string|object[]|string[]} result promise results
 * @property {boolean} success true|false
 * @property {string} msg comment on the response
 */
const Response = {
  result: null,
  success: null,
  msg: null,
};

/**
 * @description Default location structure
 * @typedef {Object} Location
 * @property {string} line Street address
 * @property {string} city Hometown
 * @property {string} postal Area postal code
 * @property {string} district Home district
 */
const Location = {
  line: null,
  city: null,
  postal: null,
  district: null,
};
