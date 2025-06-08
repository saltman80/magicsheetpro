function fetchOpenAIModels() {
  const apiKey = settingsService.getApiKey();
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('OpenAI API Key is not set.');
  }
  const url = 'https://api.openai.com/v1/models';
  const options = {
    method: 'GET',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + apiKey
    }
  };
  let response;
  try {
    response = UrlFetchApp.fetch(url, options);
  } catch (e) {
    throw new Error('Network error while fetching OpenAI models: ' + e.message);
  }
  const code = response.getResponseCode();
  const text = response.getContentText();
  if (code !== 200) {
    throw new Error('Failed to fetch OpenAI models. HTTP ' + code + ': ' + text);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON received from OpenAI models endpoint: ' + e.message + '. Response: ' + text);
  }
  if (!data || !Array.isArray(data.data)) {
    throw new Error('Unexpected response format: missing data array.');
  }
  const ids = [];
  data.data.forEach((item, index) => {
    if (item && typeof item.id === 'string') {
      ids.push(item.id);
    } else {
      Logger.warn('Skipping invalid model entry at index ' + index + ': ' + JSON.stringify(item));
    }
  });
  return ids;
}

function listModelIds(models) {
  if (!models) {
    throw new Error('Missing input: models');
  }
  if (!Array.isArray(models)) {
    throw new Error('Invalid input: models must be an array');
  }
  const ids = [];
  models.forEach((item, index) => {
    if (typeof item === 'string') {
      ids.push(item);
    } else if (item && typeof item.id === 'string') {
      ids.push(item.id);
    } else {
      Logger.warn('Invalid model item at index ' + index + ': ' + JSON.stringify(item));
    }
  });
  return ids;
}

function getAvailableModels() {
  return listModelIds(fetchOpenAIModels());
}

function saveSelectedModel(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Missing or invalid input: id must be a non-empty string.');
  }
  const available = getAvailableModels();
  if (!available.includes(id)) {
    Logger.warn('Selected model "' + id + '" is not in the list of available models.');
  }
  settingsService.setModel(id);
  return 'Model saved';
}

var modelService = {
  fetchOpenAIModels: fetchOpenAIModels,
  listModelIds: listModelIds,
  getAvailableModels: getAvailableModels,
  saveSelectedModel: saveSelectedModel
};
