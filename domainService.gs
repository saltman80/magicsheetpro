const BASE_FETCH_OPTIONS = {
  muteHttpExceptions: true,
  followRedirects: true
};

/**
 * Normalizes and validates a URL string.
 *
 * Ensures that the URL has a protocol and is properly encoded.
 *
 * @param {string} url The URL to normalize.
 * @return {string} The normalized URL.
 * @throws {Error} If the input is missing or invalid.
 */
function normalizeUrl(url) {
  if (!url) {
    throw new Error('normalizeUrl: Missing URL input.');
  }
  const str = url.toString().trim();
  const withProtocol = /^https?:\/\//i.test(str) ? str : 'http://' + str;
  let urlObj;
  try {
    urlObj = new URL(withProtocol);
  } catch (e) {
    throw new Error('normalizeUrl: Invalid URL format. ' + e.message);
  }
  return urlObj.href;
}

/**
 * Validates whether a string is a properly formatted HTTP/HTTPS URL.
 *
 * @param {string} url The URL to validate.
 * @return {boolean} True if the URL is valid and uses HTTP/HTTPS protocol.
 */
function isValidUrl(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return false;
  }
  try {
    new URL(trimmed);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Checks if the given URL is reachable by performing a GET request
 * and evaluating the HTTP status code (< 400).
 *
 * @param {string} url The URL to check.
 * @return {boolean} True if reachable (status < 400), false otherwise.
 * @throws {Error} If the input is missing.
 */
function domainCheck(url) {
  if (!url) {
    throw new Error('domainCheck: Missing URL input.');
  }
  const normalized = normalizeUrl(url);
  const options = { ...BASE_FETCH_OPTIONS, method: 'get' };
  try {
    const response = UrlFetchApp.fetch(normalized, options);
    return response.getResponseCode() < 400;
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves the HTTP status code for a given URL.
 *
 * @param {string} url The URL to fetch.
 * @return {number} HTTP status code.
 * @throws {Error} If the input is missing or the request fails.
 */
function getHttpStatus(url) {
  if (!url) {
    throw new Error('getHttpStatus: Missing URL input.');
  }
  let normalized;
  try {
    normalized = normalizeUrl(url);
  } catch (e) {
    throw new Error('getHttpStatus: ' + e.message);
  }
  const options = { ...BASE_FETCH_OPTIONS, method: 'get' };
  try {
    const response = UrlFetchApp.fetch(normalized, options);
    return response.getResponseCode();
  } catch (e) {
    throw new Error('getHttpStatus: Failed to fetch URL. ' + e.message);
  }
}

/**
 * Measures the response time (in milliseconds) of a URL by performing
 * a GET request and timing the round trip.
 *
 * @param {string} url The URL to test.
 * @return {number} Response time in milliseconds.
 * @throws {Error} If the input is missing or the request fails.
 */
function getDomainResponseTime(url) {
  if (!url) {
    throw new Error('getDomainResponseTime: Missing URL input.');
  }
  let normalized;
  try {
    normalized = normalizeUrl(url);
  } catch (e) {
    throw new Error('getDomainResponseTime: ' + e.message);
  }
  const options = { ...BASE_FETCH_OPTIONS, method: 'get' };
  const start = Date.now();
  try {
    UrlFetchApp.fetch(normalized, options);
    return Date.now() - start;
  } catch (e) {
    throw new Error('getDomainResponseTime: Failed to fetch URL. ' + e.message);
  }
}

/**
 * Checks if a domain supports HTTPS (SSL/TLS) by attempting
 * a GET request over HTTPS and evaluating the status code (200?399).
 *
 * @param {string} url The URL to check.
 * @return {boolean} True if HTTPS is supported, false otherwise.
 * @throws {Error} If the input is missing.
 */
function checkDomainSSL(url) {
  if (!url) {
    throw new Error('checkDomainSSL: Missing URL input.');
  }
  let normalized;
  try {
    normalized = normalizeUrl(url);
  } catch (e) {
    throw new Error('checkDomainSSL: ' + e.message);
  }
  const httpsUrl = normalized.replace(/^http:\/\//i, 'https://');
  const options = { ...BASE_FETCH_OPTIONS, method: 'get' };
  try {
    const response = UrlFetchApp.fetch(httpsUrl, options);
    const code = response.getResponseCode();
    return code >= 200 && code < 400;
  } catch (e) {
    return false;
  }
}

var domainService = {
  normalizeUrl: normalizeUrl,
  isValidUrl: isValidUrl,
  domainCheck: domainCheck,
  getHttpStatus: getHttpStatus,
  getDomainResponseTime: getDomainResponseTime,
  checkDomainSSL: checkDomainSSL
};
