const OPENAI_API_KEY_PROP = 'OPENAI_API_KEY';
const OPENAI_MODEL_ID_PROP = 'OPENAI_MODEL_ID';

function setApiKey(key) {
  if (typeof key !== 'string') {
    throw new Error('API key must be a string.');
  }
  var trimmed = key.trim();
  if (!trimmed) {
    throw new Error('API key is required.');
  }
  utilityService.updateProperty(OPENAI_API_KEY_PROP, trimmed);
}

function getApiKey() {
  var key = utilityService.getProperty(OPENAI_API_KEY_PROP);
  return key ? key.trim() : null;
}

function setModel(modelId) {
  if (typeof modelId !== 'string') {
    throw new Error('Model ID must be a string.');
  }
  var trimmed = modelId.trim();
  if (!trimmed) {
    throw new Error('Model ID is required.');
  }
  utilityService.updateProperty(OPENAI_MODEL_ID_PROP, trimmed);
}

function getModel() {
  var modelId = utilityService.getProperty(OPENAI_MODEL_ID_PROP);
  return modelId ? modelId.trim() : null;
}

var settingsService = {
  setApiKey: setApiKey,
  getApiKey: getApiKey,
  setModel: setModel,
  getModel: getModel
};
