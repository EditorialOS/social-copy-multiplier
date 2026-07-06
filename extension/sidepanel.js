// Social Copy Multiplier — side panel
// One message → Pinterest, Instagram Post, Instagram Story, X.

let apiKey = '';
let brand = { name: '', voice: '', audience: '', benefits: '' };
let messageType = 'general';

const PLATFORM_LABELS = [
  { key: 'pinterest', name: 'Pinterest' },
  { key: 'instagram_post', name: 'Instagram Post' },
  { key: 'instagram_story', name: 'Instagram Story' },
  { key: 'twitter', name: 'X (Twitter)' }
];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('settingsBtn').addEventListener('click', toggleSettings);
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
  document.getElementById('generateBtn').addEventListener('click', generateSocialCopy);
  document.getElementById('coreMessage').addEventListener('input', updateCharCount);

  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      selectType(this.getAttribute('data-type'));
    });
  });

  // Load settings and any text sent from the context menu / shortcut
  chrome.storage.local.get(['apiKey', 'brand', 'selectedText', 'timestamp'], (result) => {
    if (result.apiKey) {
      apiKey = result.apiKey;
    } else {
      document.getElementById('settingsSection').classList.remove('hidden');
    }
    if (result.brand) {
      brand = { ...brand, ...result.brand };
    }
    fillSettingsForm();

    if (result.selectedText && result.timestamp && Date.now() - result.timestamp < 5000) {
      document.getElementById('coreMessage').value = result.selectedText;
      updateCharCount();
      chrome.storage.local.remove(['selectedText', 'timestamp']);
    }
  });

  // Selection can arrive after the panel is already open
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.selectedText?.newValue) {
      document.getElementById('coreMessage').value = changes.selectedText.newValue;
      updateCharCount();
      chrome.storage.local.remove(['selectedText', 'timestamp']);
    }
  });
});

function updateCharCount() {
  const text = document.getElementById('coreMessage').value;
  document.getElementById('charCount').textContent = text.length + ' characters';
}

function toggleSettings() {
  document.getElementById('settingsSection').classList.toggle('hidden');
}

function fillSettingsForm() {
  document.getElementById('apiKeyInput').value = apiKey;
  document.getElementById('brandName').value = brand.name;
  document.getElementById('brandVoice').value = brand.voice;
  document.getElementById('brandAudience').value = brand.audience;
  document.getElementById('brandBenefits').value = brand.benefits;
}

function saveSettings() {
  const keyInput = document.getElementById('apiKeyInput').value.trim();
  if (!keyInput) {
    showError('Enter your Anthropic API key to save settings.');
    return;
  }

  apiKey = keyInput;
  brand = {
    name: document.getElementById('brandName').value.trim(),
    voice: document.getElementById('brandVoice').value.trim(),
    audience: document.getElementById('brandAudience').value.trim(),
    benefits: document.getElementById('brandBenefits').value.trim()
  };

  // Stored locally on this device only
  chrome.storage.local.set({ apiKey, brand }, () => {
    document.getElementById('settingsSection').classList.add('hidden');
    hideError();
  });
}

function selectType(type) {
  messageType = type;
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-type="${type}"]`).classList.add('active');
}

function showError(msg) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = msg;
  errorDiv.style.display = 'block';
}

function hideError() {
  document.getElementById('errorMessage').style.display = 'none';
}

async function generateSocialCopy() {
  const coreMessage = document.getElementById('coreMessage').value.trim();

  if (!coreMessage) {
    showError('Enter your core message.');
    return;
  }
  if (!apiKey) {
    showError('Add your Anthropic API key in settings.');
    document.getElementById('settingsSection').classList.remove('hidden');
    return;
  }

  hideError();
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('loadingMessage').style.display = 'flex';
  document.getElementById('results').innerHTML = '';
  document.getElementById('emptyState').style.display = 'none';

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'generateSocialCopy',
      data: { coreMessage, messageType, apiKey, brand }
    });

    if (response.success) {
      displayResults(response.socialCopy);
    } else {
      showError(response.error || 'Generation failed. Check your API key and try again.');
    }
  } catch (err) {
    showError(err.message);
  } finally {
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('loadingMessage').style.display = 'none';
  }
}

function displayResults(socialCopy) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<div class="results-title">Ready to post</div>';

  PLATFORM_LABELS.forEach(platform => {
    const copy = socialCopy[platform.key] || '';

    const card = document.createElement('div');
    card.className = 'platform-card';

    const header = document.createElement('div');
    header.className = 'platform-header';

    const title = document.createElement('h3');
    title.textContent = platform.name;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(copy).then(() => {
        copyBtn.textContent = 'Copied';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });

    header.appendChild(title);
    header.appendChild(copyBtn);

    const body = document.createElement('div');
    body.className = 'platform-body';

    const pre = document.createElement('pre');
    pre.textContent = copy;

    const count = document.createElement('div');
    count.className = 'char-count';
    count.textContent = copy.length + ' characters';

    body.appendChild(pre);
    body.appendChild(count);

    card.appendChild(header);
    card.appendChild(body);
    resultsDiv.appendChild(card);
  });
}
