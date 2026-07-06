// Social Copy Multiplier — Editorial OS
// One message → platform-ready social copy.
// Brand voice is user-configured, never hardcoded.

const API_MODEL = 'claude-sonnet-4-6';

// Clicking the toolbar icon opens the side panel directly (no popup)
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  chrome.contextMenus.create({
    id: 'generateSocialCopy',
    title: 'Multiply into social copy',
    contexts: ['selection']
  });
});

// Right-click on selected text → open panel pre-filled with the selection
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generateSocialCopy') {
    chrome.sidePanel.open({ windowId: tab.windowId });
    chrome.storage.local.set({
      selectedText: info.selectionText,
      timestamp: Date.now()
    });
  }
});

// Keyboard shortcut → grab current selection via scripting (activeTab is
// granted by the command gesture), then open the panel
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'open-multiplier') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.sidePanel.open({ windowId: tab.windowId });

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });
    if (result?.result) {
      chrome.storage.local.set({
        selectedText: result.result,
        timestamp: Date.now()
      });
    }
  } catch (e) {
    // Restricted pages (chrome://, Web Store) don't allow injection — the
    // panel still opens, just without prefilled text.
  }
});

// Generation requests from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateSocialCopy') {
    generateSocialCopy(request.data)
      .then(socialCopy => sendResponse({ success: true, socialCopy }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // async response
  }
});

// ============================================
// GENERATION
// ============================================

const MESSAGE_TYPE_CONTEXT = {
  pricing: 'Focus on value, savings, and affordability',
  announcement: 'Lead with what is new and why it matters now',
  offer: 'Create urgency, highlight the limited-time nature, clear CTA',
  feature: 'Explain the benefit clearly and show what friction it removes',
  general: 'General marketing message'
};

const PLATFORMS = [
  {
    name: 'Pinterest',
    key: 'pinterest',
    instructions: `Create Pinterest pin copy (description):
- 300-500 characters ideal
- Benefit-focused and aspirational
- Include practical details (price, coverage, features) when present in the message
- Use emojis sparingly (2-3 max)
- Add a clear call-to-action
- Format: Title (hook), description (benefits), CTA
- Think: "Save this for later" energy`
  },
  {
    name: 'Instagram Post',
    key: 'instagram_post',
    instructions: `Create Instagram post caption:
- 125-150 words ideal
- Start with a hook (emoji + question OR bold statement)
- Conversational and relatable
- Include 2-3 line breaks for readability
- Use relevant emojis (3-5 total)
- End with clear CTA
- Add "Link in bio" or "Tap link in bio"
- Think: Scroll-stopping, shareable`
  },
  {
    name: 'Instagram Story',
    key: 'instagram_story',
    instructions: `Create Instagram Story text:
- 15-30 words MAX (must be readable quickly)
- Start with attention-grabber (emoji + short phrase)
- One key benefit or offer
- Clear swipe-up CTA
- Use line breaks between elements
- Think: 3 seconds to read and swipe`
  },
  {
    name: 'X (Twitter)',
    key: 'twitter',
    instructions: `Create X post:
- 200-280 characters (leave room for link)
- Hook first line (bold statement, question, or surprising fact)
- One clear benefit or insight
- Conversational and punchy
- Minimal emojis (0-2)
- Think: Quotable, repostable`
  }
];

function buildBrandBlock(brand) {
  if (!brand) return 'BRAND: not specified — infer an appropriate voice from the core message itself.';
  const lines = [];
  if (brand.name) lines.push(`BRAND: ${brand.name}`);
  if (brand.voice) lines.push(`VOICE: ${brand.voice}`);
  if (brand.audience) lines.push(`AUDIENCE: ${brand.audience}`);
  if (brand.benefits) lines.push(`KEY BENEFITS: ${brand.benefits}`);
  return lines.length
    ? lines.join('\n')
    : 'BRAND: not specified — infer an appropriate voice from the core message itself.';
}

async function generateSocialCopy(data) {
  const { coreMessage, messageType, apiKey, brand } = data;

  if (!apiKey) {
    throw new Error('API key not configured.');
  }

  const brandBlock = buildBrandBlock(brand);
  const typeContext = MESSAGE_TYPE_CONTEXT[messageType] || MESSAGE_TYPE_CONTEXT.general;

  // All four platforms generate in parallel
  const results = await Promise.all(PLATFORMS.map(async (platform) => {
    const prompt = `${brandBlock}

CORE MESSAGE:
${coreMessage}

MESSAGE TYPE: ${messageType}
CONTEXT: ${typeContext}

PLATFORM: ${platform.name}
${platform.instructions}

Write ${platform.name} copy for this message. Return ONLY the copy, no explanations or meta-commentary.`;

    // Direct call from the service worker — host_permissions covers CORS.
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: API_MODEL,
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API request failed (${response.status})`);
    }

    const result = await response.json();
    const text = result.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n')
      .trim();

    return [platform.key, text];
  }));

  return Object.fromEntries(results);
}
