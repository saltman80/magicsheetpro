function getMetaTitle(url) {
  if (url === undefined) throw new Error('Missing URL parameter');
  if (typeof url !== 'string') throw new Error('URL must be a string');
  var u = url.trim();
  if (!u) throw new Error('URL cannot be empty');
  if (!isValidUrl(u)) throw new Error('Invalid URL: ' + u);
  var resp;
  try {
    resp = UrlFetchApp.fetch(u, { muteHttpExceptions: true });
  } catch (e) {
    throw new Error('Fetch error: ' + e.message);
  }
  var code = resp.getResponseCode();
  if (code < 200 || code >= 300) throw new Error('Request failed with status ' + code);
  var html = resp.getContentText();
  var match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function getMetaDescription(url) {
  if (url === undefined) throw new Error('Missing URL parameter');
  if (typeof url !== 'string') throw new Error('URL must be a string');
  var u = url.trim();
  if (!u) throw new Error('URL cannot be empty');
  if (!isValidUrl(u)) throw new Error('Invalid URL: ' + u);
  var resp;
  try {
    resp = UrlFetchApp.fetch(u, { muteHttpExceptions: true });
  } catch (e) {
    throw new Error('Fetch error: ' + e.message);
  }
  var code = resp.getResponseCode();
  if (code < 200 || code >= 300) throw new Error('Request failed with status ' + code);
  var html = resp.getContentText();
  var match = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["'][^>]*>/i);
  return match ? match[1].trim() : '';
}

function getH1(url) {
  if (url === undefined) throw new Error('Missing URL parameter');
  if (typeof url !== 'string') throw new Error('URL must be a string');
  var u = url.trim();
  if (!u) throw new Error('URL cannot be empty');
  if (!isValidUrl(u)) throw new Error('Invalid URL: ' + u);
  var resp;
  try {
    resp = UrlFetchApp.fetch(u, { muteHttpExceptions: true });
  } catch (e) {
    throw new Error('Fetch error: ' + e.message);
  }
  var code = resp.getResponseCode();
  if (code < 200 || code >= 300) throw new Error('Request failed with status ' + code);
  var html = resp.getContentText();
  var match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? match[1].trim() : '';
}

function getH2(url) {
  if (url === undefined) throw new Error('Missing URL parameter');
  if (typeof url !== 'string') throw new Error('URL must be a string');
  var u = url.trim();
  if (!u) throw new Error('URL cannot be empty');
  if (!isValidUrl(u)) throw new Error('Invalid URL: ' + u);
  var resp;
  try {
    resp = UrlFetchApp.fetch(u, { muteHttpExceptions: true });
  } catch (e) {
    throw new Error('Fetch error: ' + e.message);
  }
  var code = resp.getResponseCode();
  if (code < 200 || code >= 300) throw new Error('Request failed with status ' + code);
  var html = resp.getContentText();
  var re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  var matches = [], m;
  while ((m = re.exec(html)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

var scrapingMetaService = {
  getMetaTitle: getMetaTitle,
  getMetaDescription: getMetaDescription,
  getH1: getH1,
  getH2: getH2
};
