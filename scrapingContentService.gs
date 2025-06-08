function fetchHtml(url) {
  if (typeof url !== 'string' || !url) {
    throw new Error('fetchHtml: Missing URL');
  }
  if (!isValidUrl(url)) {
    throw new Error('fetchHtml: Invalid URL: ' + url);
  }
  try {
    var response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      validateHttpsCertificates: true
    });
    var code = response.getResponseCode();
    if (code < 200 || code >= 300) {
      throw new Error('HTTP ' + code);
    }
    return response.getContentText();
  } catch (e) {
    throw new Error('fetchHtml: Unable to fetch URL: ' + url + '. ' + e.message);
  }
}

/**
 * Escapes special characters in a string for use in a regular expression.
 *
 * @param {string} str The input string.
 * @returns {string} The escaped string.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts all headings (<h1> to <h6>) from the webpage at the given URL.
 *
 * @param {string} url The webpage URL.
 * @returns {string[]} Array of heading HTML strings.
 * @throws {Error} If fetching the URL fails.
 */
function getHeadings(url) {
  var html = fetchHtml(url);
  var regex = /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi;
  var matches = html.match(regex);
  return matches || [];
}

/**
 * Extracts all paragraph (<p>) elements from the webpage at the given URL.
 *
 * @param {string} url The webpage URL.
 * @returns {string[]} Array of paragraph HTML strings.
 * @throws {Error} If fetching the URL fails.
 */
function getp(url) {
  var html = fetchHtml(url);
  var regex = /<p[^>]*>[\s\S]*?<\/p>/gi;
  var matches = html.match(regex);
  return matches || [];
}

/**
 * Extracts all image source URLs from the webpage at the given URL.
 *
 * @param {string} url The webpage URL.
 * @returns {string[]} Array of image src attribute values.
 * @throws {Error} If fetching the URL fails.
 */
function getImg(url) {
  var html = fetchHtml(url);
  var regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  var result = [];
  var match;
  while ((match = regex.exec(html)) !== null) {
    result.push(match[1]);
  }
  return result;
}

/**
 * Extracts elements matching a simple CSS selector (#id, .class, or tag) from the webpage.
 *
 * @param {string} url The webpage URL.
 * @param {string} selector The CSS selector string.
 * @returns {string[]} Array of matching HTML element strings.
 * @throws {Error} If fetching the URL fails or the selector is invalid.
 */
function getSelector(url, selector) {
  if (typeof selector !== 'string' || !selector) {
    throw new Error('getSelector: Missing selector');
  }
  var html = fetchHtml(url);
  var results = [], regex;
  if (selector.charAt(0) === '#') {
    var id = selector.slice(1);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) {
      throw new Error('getSelector: Invalid ID selector: ' + selector);
    }
    var escId = escapeRegex(id);
    regex = new RegExp(
      '<([a-z][a-z0-9-]*)\\b[^>]*\\bid=["\']' + escId + '["\'][^>]*>[\\s\\S]*?<\\/\\1>',
      'gi'
    );
    results = html.match(regex) || [];
  } else if (selector.charAt(0) === '.') {
    var cls = selector.slice(1);
    if (!/^[A-Za-z0-9_-]+$/.test(cls)) {
      throw new Error('getSelector: Invalid class selector: ' + selector);
    }
    var escCls = escapeRegex(cls);
    regex = new RegExp(
      '<([a-z][a-z0-9-]*)\\b[^>]*\\bclass=["\'][^"\']*\\b' + escCls + '\\b[^"\']*["\'][^>]*>[\\s\\S]*?<\\/\\1>',
      'gi'
    );
    results = html.match(regex) || [];
  } else {
    if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(selector)) {
      throw new Error('getSelector: Invalid tag selector: ' + selector);
    }
    var tag = selector.toLowerCase();
    regex = new RegExp('<' + tag + '\\b[^>]*>[\\s\\S]*?<\\/' + tag + '>', 'gi');
    results = html.match(regex) || [];
  }
  return results;
}