# Social Copy Multiplier — Editorial OS

> One message → all platforms.

A Chrome side-panel extension that turns one core message into platform-optimized social copy for Pinterest, Instagram Posts, Instagram Stories, and X — each generated in parallel against that platform's real constraints (length, format, hook style, CTA conventions).

**Your brand, your key.** Set your brand voice once in Settings — name, voice, audience, key benefits — and every generation uses it. No brand context is hardcoded. The extension calls the Anthropic API directly with your own key, stored locally on your device.

## Features

- **Four platforms in parallel** — Pinterest pin copy, Instagram caption, Story text, and X post generated simultaneously, each against platform-specific constraints
- **Configurable brand voice** — set it once in Settings; applies to every generation. Leave it blank and the tool infers an appropriate voice from your message.
- **Message types** — Pricing/Offer, Announcement, Promotion, Feature, or General, each steering the framing
- **Three entry points** — click the toolbar icon, right-click any selected text ("Multiply into social copy"), or press Ctrl+Shift+Y (⌘⇧Y on Mac) to open the panel with your current selection pre-filled
- **One-click copy** per platform, with character counts

## Installation

**From the Chrome Web Store:** (link once published)

**Developer mode:**
1. Download or clone this folder
2. Open `chrome://extensions/`
3. Enable Developer mode (top right)
4. Click "Load unpacked" and select this folder

Open the panel, add your Anthropic API key and (optionally) your brand voice in Settings, and generate.

## Architecture notes

MV3 with a service-worker backend and a side-panel UI. No content scripts: the keyboard shortcut is registered through the `commands` API, and text selection is read with a one-shot `chrome.scripting.executeScript` under `activeTab` — granted only by your explicit gesture, on that tab, at that moment. API calls go directly from the service worker to `api.anthropic.com` (declared host permission); all four platform generations run through `Promise.all`.

## Privacy

Your API key, brand settings, and messages are stored locally and sent only to the Anthropic API. See [PRIVACY.md](../PRIVACY.md).

---

## Chrome Web Store listing copy

**Name:** Social Copy Multiplier - Editorial OS

**Short description (≤132 chars):**
Turn one core message into platform-ready copy for Pinterest, Instagram, and X — in your brand voice, with your own API key.

**Detailed description:**

Stop reformatting the same message four times.

Social Copy Multiplier takes one core message and generates platform-optimized copy for Pinterest, Instagram Posts, Instagram Stories, and X — simultaneously, each respecting that platform's real constraints: character limits, hook conventions, emoji norms, CTA style.

YOUR BRAND VOICE
Set your brand name, voice, audience, and key benefits once in Settings. Every generation uses them. Nothing is hardcoded — this works for any brand, product, or project.

THREE WAYS IN
• Click the toolbar icon to open the side panel
• Select text on any page → right-click → "Multiply into social copy"
• Press Ctrl+Shift+Y (⌘⇧Y on Mac) to open with your selection pre-filled

BRING YOUR OWN KEY
Requires an Anthropic API key (console.anthropic.com). Your key and settings live in local storage on your device and are sent only to the Anthropic API — no middleman servers, no accounts, no analytics, no data collection.

Part of Editorial OS: systems for content and communications teams.

**Category:** Productivity
