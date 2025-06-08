function _validateUrl(url) {
  if (!url || typeof url !== 'string') throw new Error('URL must be a non-empty string');
  const trimmed = url.trim();
  if (!domainService.isValidUrl(trimmed)) throw new Error('Invalid URL: ' + trimmed);
  return trimmed;
}

function _fetchUrl(url) {
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();
    const content = response.getContentText();
    if (code < 200 || code >= 300) throw new Error('HTTP error ' + code);
    return { code, content };
  } catch (e) {
    throw new Error('Fetch failed for ' + url + ': ' + e.message);
  }
}

function _flatten(arr) {
  const res = [];
  arr.forEach(el => {
    if (Array.isArray(el)) res.push(..._flatten(el));
    else res.push(el);
  });
  return res;
}

function _decodeEntities(str) {
  if (!str) return '';
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, match => {
    switch (match) {
      case '&amp;': return '&';
      case '&lt;': return '<';
      case '&gt;': return '>';
      case '&quot;': return '"';
      case '&#39;': return "'";
      default: return match;
    }
  });
}

function _parseSerp(html, count) {
  const regex = /<a[^>]*class=["']result__a["'][^>]*href=["']([^"']+)["']/ig;
  const results = [];
  let match;
  while (results.length < count && (match = regex.exec(html)) !== null) {
    results.push(match[1]);
  }
  return results;
}

/**
 * Fetches the raw HTML content of a URL.
 * @param {string} url The URL to fetch.
 * @returns {string} The HTML content.
 * @customfunction
 */
function visit(url) {
  const validated = _validateUrl(url);
  return _fetchUrl(validated).content;
}

/**
 * Returns top DuckDuckGo SERP result URLs for a query.
 * @param {string} query The search query.
 * @param {number} count Number of results to return.
 * @returns {Array<string>} An array of result URLs.
 * @customfunction
 */
function serp(query, count) {
  if (!query || typeof query !== 'string') throw new Error('Query must be a non-empty string');
  const num = count == null ? 10 : parseInt(count, 10);
  if (isNaN(num) || num < 1) throw new Error('Count must be a positive integer');
  const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
  const html = _fetchUrl(url).content;
  return _parseSerp(html, num);
}

/**
 * Returns a horizontal array of top 5 DuckDuckGo SERP result URLs.
 * @param {string} query The search query.
 * @returns {Array<string>} An array of result URLs.
 * @customfunction
 */
function bulkserp(query) {
  if (!query || typeof query !== 'string') throw new Error('Query must be a non-empty string');
  const results = serp(query, 5);
  return [results];
}

/**
 * Fetches status code, title, meta description, and H1 text for each URL.
 * @param {...*} urls A list or range of URLs.
 * @returns {Array<Array>} A 2D array: [URL, HTTP status, Title, Description, H1 texts].
 * @customfunction
 */
function pagedata() {
  if (arguments.length === 0) throw new Error('At least one URL is required');
  const input = Array.prototype.slice.call(arguments);
  const flat = _flatten(input).filter(u => typeof u === 'string' && u.trim());
  const rows = [];
  const reqs = [];
  const reqIndices = [];
  flat.forEach((u, i) => {
    const trimmed = u.trim();
    if (domainService.isValidUrl(trimmed)) {
      reqs.push({ url: trimmed, muteHttpExceptions: true });
      reqIndices.push(i);
      rows[i] = null;
    } else {
      rows[i] = [u, 'Invalid URL', '', '', ''];
    }
  });
  if (reqs.length) {
    const responses = UrlFetchApp.fetchAll(reqs);
    let respCounter = 0;
    reqIndices.forEach(origIndex => {
      const u = flat[origIndex].trim();
      const resp = responses[respCounter++];
      const code = resp.getResponseCode();
      const html = resp.getContentText();
      let title = '';
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) title = _decodeEntities(titleMatch[1].trim());
      let desc = '';
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
      if (descMatch) desc = _decodeEntities(descMatch[1].trim());
      const h1Texts = [];
      const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/ig;
      let h1m;
      while ((h1m = h1Regex.exec(html)) !== null) {
        const text = h1m[1].replace(/<[^>]+>/g, '').trim();
        if (text) h1Texts.push(_decodeEntities(text));
      }
      rows[origIndex] = [u, code, title, desc, h1Texts.join(' | ')];
    });
  }
  return rows;
}