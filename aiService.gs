function AI_OpenAI() {
  var args = Array.prototype.slice.call(arguments);
  if (!args || args.length === 0) {
    throw new Error('AI_OpenAI requires at least one input argument.');
  }
  var prompt = args.map(function(a){ return String(a); }).join(' ');
  var apiKey = settingsService.getApiKey();
  var model = settingsService.getModel();
  if (!apiKey) {
    throw new Error('OpenAI API key is not set. Configure it via the SEO AI Tools settings.');
  }
  if (!model) {
    throw new Error('OpenAI model is not set. Configure it via the SEO AI Tools settings.');
  }
  var url = 'https://api.openai.com/v1/chat/completions';
  var payload = JSON.stringify({
    model: model,
    messages: [{ role: 'user', content: prompt }]
  });
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + apiKey },
    payload: payload,
    muteHttpExceptions: true
  };
  var lastError;
  for (var i = 0; i < 3; i++) {
    try {
      var response = UrlFetchApp.fetch(url, options);
      var code = response.getResponseCode();
      var text = response.getContentText();
      if (code >= 200 && code < 300) {
        var data = JSON.parse(text);
        if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0 ||
            !data.choices[0].message || typeof data.choices[0].message.content !== 'string') {
          throw new Error('Unexpected API response structure.');
        }
        return data.choices[0].message.content.trim();
      } else {
        var errorMsg;
        try {
          var err = JSON.parse(text);
          errorMsg = err.error && err.error.message ? err.error.message : text;
        } catch (e) {
          errorMsg = text;
        }
        lastError = new Error('OpenAI API error: ' + errorMsg);
        if (/billing/i.test(errorMsg)) {
          throw new Error('OpenAI billing error: ' + errorMsg);
        }
        Utilities.sleep(Math.pow(2, i) * 1000);
        continue;
      }
    } catch (e) {
      lastError = e;
      if (i === 2 || /billing/i.test(e.message)) {
        break;
      }
      Utilities.sleep(Math.pow(2, i) * 1000);
    }
  }
  throw new Error('OpenAI call failed after multiple attempts: ' + lastError.message);
}

function aitext(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('aitext requires a non-empty prompt string.');
  }
  return AI_OpenAI(prompt);
}

function ailist(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('ailist requires a non-empty prompt string.');
  }
  var txt = AI_OpenAI('List items:\n' + prompt);
  if (!txt || typeof txt !== 'string') {
    return [];
  }
  var items = txt.trim()
    .split(/\r?\n/)
    .map(function(s){ return s.replace(/^[-?\*\d\.\s]+/, '').trim(); })
    .filter(function(s){ return s; });
  return items.map(function(item){ return [item]; });
}

function ailisth(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('ailisth requires a non-empty prompt string.');
  }
  var txt = AI_OpenAI('Horizontal list:\n' + prompt);
  if (!txt || typeof txt !== 'string') {
    return [[]];
  }
  var items = txt.trim()
    .split(/\r?\n/)
    .map(function(s){ return s.replace(/^[-?\*\d\.\s]+/, '').trim(); })
    .filter(function(s){ return s; });
  return [items];
}