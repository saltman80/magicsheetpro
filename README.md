# MagicSheetPro

MagicSheetPro is a standalone Google Apps Script project designed to run alongside a private Google Sheet named **"Magic Pro Sheet"**. It provides a collection of SEO utilities powered by DuckDuckGo scraping and OpenAI text generation.

## Features

- **SEO AI Tools menu** – Adds a custom menu when the spreadsheet opens. From here you can launch a dark themed sidebar for configuration.
- **Sidebar UI** – Enter and save your OpenAI API key, fetch available models and choose one for all AI calls. Settings are stored via `PropertiesService`.
- **OpenAI integration** – Uses `UrlFetchApp` for all HTTP requests. `aiService.gs` implements `AI_OpenAI` and helper functions for text and list generation.
- **Scraping utilities** – DuckDuckGo SERP scraping, page metadata extraction and content helpers implemented in `scrapingService.gs`, `scrapingMetaService.gs` and `scrapingContentService.gs`.
- **Domain helpers** – Utility functions in `domainService.gs` for checking URLs and HTTP status codes.

## File Overview

```
uiHandler.gs              – Registers the "SEO AI Tools" menu and renders the sidebar
sidebarComponent.html     – HTML/CSS/JS for the settings sidebar
settingsService.gs        – Get/set OpenAI API key and selected model via PropertiesService
utilityService.gs         – Shared helpers for property I/O, billing error handling and HTML parsing
modelService.gs           – Fetches available OpenAI models and stores the selection
aiService.gs              – Core OpenAI chat completion helpers
scrapingService.gs        – DuckDuckGo search and page data collection
scrapingMetaService.gs    – Meta tag and heading extraction helpers
scrapingContentService.gs – Page content helpers (paragraphs, images, selectors)
domainService.gs          – Domain and URL validation helpers
```

## Using the Script

1. Create or open a Google Sheet named **"Magic Pro Sheet"**.
2. Deploy these script files in the Script Editor (or push them with [clasp](https://github.com/google/clasp)).
3. Reload the spreadsheet. A **"SEO AI Tools"** menu will appear.
4. Choose **Settings** from the menu to open the sidebar.
5. Enter your OpenAI API key and click **Save API Key**.
6. Click **Fetch Models** to retrieve the list of available OpenAI models, select one and **Save Model**.

All preferences persist between uses thanks to `PropertiesService`. The script performs network calls exclusively via `UrlFetchApp`.

