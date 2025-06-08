function updateProperty(key, value) {
  if (typeof key !== 'string') {
    throw new Error('Invalid property key: must be a string.');
  }
  key = key.trim();
  if (key === '') {
    throw new Error('Invalid property key: cannot be empty.');
  }
  if (value === null || value === undefined) {
    throw new Error('Invalid property value: cannot be null or undefined.');
  }
  var valueStr;
  if (typeof value === 'object') {
    try {
      valueStr = JSON.stringify(value);
    } catch (e) {
      throw new Error('Failed to serialize property value: ' + e.message);
    }
  } else {
    valueStr = String(value);
  }
  if (valueStr.trim() === '') {
    throw new Error('Invalid property value: cannot be an empty string.');
  }
  PropertiesService.getScriptProperties().setProperty(key, valueStr);
}

/**
 * Retrieves a user property.
 *
 * @param {string} key The property key.
 * @return {string|null} The stored property value, or null if not set.
 * @throws {Error} If key is not a non-empty string.
 */
function getProperty(key) {
  if (typeof key !== 'string') {
    throw new Error('Invalid property key: must be a string.');
  }
  key = key.trim();
  if (key === '') {
    throw new Error('Invalid property key: cannot be empty.');
  }
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * Deletes a user property.
 *
 * @param {string} key The property key.
 * @throws {Error} If key is not a non-empty string.
 */
function removeProperty(key) {
  if (typeof key !== 'string') {
    throw new Error('Invalid property key: must be a string.');
  }
  key = key.trim();
  if (key === '') {
    throw new Error('Invalid property key: cannot be empty.');
  }
  PropertiesService.getScriptProperties().deleteProperty(key);
}

/**
 * Handles billing-related errors by notifying the user; logs and rethrows other errors.
 *
 * @param {Error} err The error object to handle.
 * @throws {Error} Always rethrows the received error after handling.
 */
function handleBillingError(err) {
  if (!(err instanceof Error) || typeof err.message !== 'string') {
    throw new Error('Invalid error object passed to handleBillingError.');
  }
  var message = err.message || '';
  if (message.toLowerCase().includes('billing')) {
    try {
      SpreadsheetApp.getUi().alert('Billing error encountered: ' + message);
    } catch (uiError) {
      Logger.log('Unable to show UI alert: ' + uiError);
    }
    throw err;
  }
  Logger.log('Non-billing error in handleBillingError: ' + message);
  throw err;
}

/**
 * Parses an HTML string into an XmlService document.
 *
 * @param {string} html The raw HTML string to parse.
 * @return {XmlService.Document} The parsed XML document.
 * @throws {Error} If html is not a non-empty string or parsing fails.
 */
function parseHtml(html) {
  if (typeof html !== 'string') {
    throw new Error('Invalid HTML input: must be a string.');
  }
  html = html.trim();
  if (html === '') {
    throw new Error('Invalid HTML input: cannot be empty.');
  }
  try {
    return XmlService.parse(html);
  } catch (e) {
    throw new Error('Failed to parse HTML: ' + e.message);
  }
}