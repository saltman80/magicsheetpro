function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SEO AI Tools')
    .addItem('Settings', 'showSettingsSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSettingsSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('sidebarComponent')
    .setTitle('SEO AI Settings');
  SpreadsheetApp.getUi().showSidebar(html);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}