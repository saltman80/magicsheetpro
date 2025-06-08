function assertValidString(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${name} must be a non-empty string.`);
  }
}

/**
 * Normalize a URL by ensuring it has a valid HTTP(S) protocol.
 * @private
 * @param {string} url The URL to normalize.
 * @returns {string} The normalized URL string.
 * @throws {Error} If the URL is invalid or uses a non-HTTP(S) protocol.
 */
function normalizeUrl(url) {
  assertValidString(url, 'URL');
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  let urlObj;
  try {
    urlObj = new URL(trimmed);
  } catch (e) {
    throw new Error('Invalid URL format.');
  }
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    throw new Error('URL must use http or https protocol.');
  }
  return urlObj.toString();
}

/**
 * Checks if a URL string is a valid HTTP(S) URL.
 * @param {string} url The URL to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
function isValidUrl(url) {
  try {
    normalizeUrl(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves the HTTP status code for a URL. Attempts a HEAD request first,
 * and falls back to GET if the server returns 405 Method Not Allowed.
 * @param {string} url The URL to check.
 * @returns {number} The HTTP status code.
 * @throws {Error} If fetching the URL fails.
 */
function getHttpStatus(url) {
  assertValidString(url, 'URL');
  const normalized = normalizeUrl(url);
  const optionsHead = {
    method: 'head',
    muteHttpExceptions: true
  };
  let response = UrlFetchApp.fetch(normalized, optionsHead);
  let code = response.getResponseCode();
  if (code === 405) {
    const optionsGet = {
      method: 'get',
      muteHttpExceptions: true
    };
    response = UrlFetchApp.fetch(normalized, optionsGet);
    code = response.getResponseCode();
  }
  return code;
}

/**
 * Checks if the domain (URL) is reachable with a status code less than 400.
 * @param {string} url The URL to check.
 * @returns {boolean} True if the URL response code is less than 400, false otherwise.
 */
function domainCheck(url) {
  if (!isValidUrl(url)) {
    return false;
  }
  try {
    const code = getHttpStatus(url);
    return code < 400;
  } catch (e) {
    Logger.warn('domainCheck failed for URL "' + url + '": ' + e);
    return false;
  }
}