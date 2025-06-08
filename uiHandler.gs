function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SEO AI Tools')
    .addItem('Settings', 'showSettingsSidebar')
    .addToUi();
  openWelcomeSheet();
}

function onInstall(e) {
  onOpen(e);
}

function showSettingsSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('sidebarComponent')
    .setTitle('SEO AI Settings');
  SpreadsheetApp.getUi().showSidebar(html);
  openFunctionReferenceSheet();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function openWelcomeSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName('Welcome');
  if (!sheet) {
    sheet = ss.insertSheet('Welcome');
  } else {
    sheet.clear();
  }
  sheet.setHiddenGridlines(true);
  const maxRows = sheet.getMaxRows();
  const maxCols = sheet.getMaxColumns();
  sheet.getRange(1, 1, maxRows, maxCols)
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff');
  sheet.getRange('A1:D1').merge().setValue('MagicSheetPro')
    .setFontSize(24).setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.getRange('A2:D2').merge().setValue('Welcome')
    .setFontSize(18).setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.getRange('A3:D3').merge().setValue('Let the magic begin!')
    .setHorizontalAlignment('center');
  sheet.getRange('A4:D4').merge()
    .setValue('19 functions ready to go! Add OpenAI key to sidebar to get started and select your favorite model!')
    .setHorizontalAlignment('center');
  sheet.activate();
}

function openFunctionReferenceSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName('Function Reference');
  if (!sheet) {
    sheet = ss.insertSheet('Function Reference');
  } else {
    sheet.clear();
  }
  const data = [['Function', 'Description']].concat(getFunctionReferenceData());
  sheet.getRange(1, 1, data.length, 2).setValues(data);
  sheet.getRange(1, 1, 1, 2)
    .setBackground('#2b2b2b')
    .setFontColor('#ffffff')
    .setFontWeight('bold');
  sheet.getRange(2, 1, data.length - 1, 2).setFontColor('#ffffff').setBackground('#3c3c3c');
  sheet.setFrozenRows(1);
  sheet.activate();
}

function getFunctionReferenceData() {
  return [
    ['AI_OpenAI', "Calls OpenAI's chat completion API"],
    ['aitext', 'Returns raw text completion from OpenAI'],
    ['ailist', 'Returns a vertical list from OpenAI'],
    ['ailisth', 'Returns a horizontal list from OpenAI'],
    ['visit', 'Fetches the HTML of a URL'],
    ['serp', 'Gets top search result URLs from DuckDuckGo'],
    ['bulkserp', 'Returns top 5 result URLs horizontally'],
    ['pagedata', 'Retrieves status, title, description and H1s for URLs'],
    ['normalizeUrl', 'Normalizes and validates a URL'],
    ['isValidUrl', 'Checks if a string is a valid URL'],
    ['domainCheck', 'Checks if a URL is reachable'],
    ['getHttpStatus', 'Retrieves HTTP status code'],
    ['getDomainResponseTime', 'Measures response time for a URL'],
    ['checkDomainSSL', 'Checks if a domain supports HTTPS'],
    ['fetchOpenAIModels', 'Gets available OpenAI model IDs'],
    ['listModelIds', 'Extracts model IDs from a list'],
    ['getAvailableModels', 'Returns list of OpenAI model IDs'],
    ['saveSelectedModel', 'Stores selected OpenAI model ID'],
    ['fetchHtml', 'Fetches webpage HTML'],
    ['escapeRegex', 'Escapes characters for regex'],
    ['getHeadings', 'Gets heading tags from a webpage'],
    ['getp', 'Gets paragraph tags from a webpage'],
    ['getImg', 'Gets image URLs from a webpage'],
    ['getSelector', 'Gets elements matching a CSS selector'],
    ['getMetaTitle', 'Gets the title from a URL'],
    ['getMetaDescription', 'Gets meta description from a URL'],
    ['getH1', 'Gets first H1 text from a URL'],
    ['getH2', 'Gets H2 texts from a URL'],
    ['setApiKey', 'Stores the OpenAI API key'],
    ['getApiKey', 'Retrieves the stored API key'],
    ['setModel', 'Stores the selected model ID'],
    ['getModel', 'Retrieves the stored model ID'],
    ['updateProperty', 'Updates a user property'],
    ['getProperty', 'Gets a user property'],
    ['removeProperty', 'Deletes a user property'],
    ['handleBillingError', 'Shows billing related alerts'],
    ['parseHtml', 'Parses HTML into XML document'],
    ['onOpen', 'Adds the SEO AI Tools menu'],
    ['onInstall', 'Runs on install to add menu'],
    ['showSettingsSidebar', 'Opens the settings sidebar'],
    ['include', 'Includes an HTML file']
  ];
}