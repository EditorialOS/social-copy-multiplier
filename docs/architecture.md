# Architecture — Social Copy Multiplier

## Overview

Social Copy Multiplier is a Chrome side-panel extension (Manifest V3). It has three layers: a **front-end surface**, an **AI/model layer**, and a **prompt layer** that binds the brand system to user input.

```
┌─────────────────────────────────────────────┐
│  Front-end surface (Chrome side-panel extension)   │
│  • collects user input                        │
│  • stores settings locally (chrome.storage)   │
└───────────────┬───────────────────────────────┘
                │  composes
                ▼
┌─────────────────────────────────────────────┐
│  Prompt layer (the AI skill)                 │
│  • design-system.md rules + ai-skills/*.md    │
│  • user input + locked sections               │
│  • assembles a structured instruction set     │
└───────────────┬───────────────────────────────┘
                │  request (user's own API key)
                ▼
┌─────────────────────────────────────────────┐
│  AI/model layer                              │
│  • Anthropic Claude (bring-your-own API key), all platforms generated in parallel via Promise.all
│  • called directly from the browser           │
└─────────────────────────────────────────────┘
```

## 1. Front-end surface

- Built on Chrome **Manifest V3**.
- A side panel (`chrome.sidePanel`) keeps the tool alongside the page you're working on.
- Settings, brand config, and the API key are persisted with `chrome.storage` — local only.

## 2. Prompt layer (the AI skill)

This is the design-critical layer. It:

- Loads the brand rules from the design system as a reference framework.
- Merges them with the user's input and any locked content.
- Produces a **structured instruction set** with explicit constraints, format specs, and examples — see [`../ai-skills/platform-adaptation-skill.md`](../ai-skills/platform-adaptation-skill.md).
- Because the rules are markdown, they are edited without touching code.

## 3. AI/model layer

- Anthropic Claude (bring-your-own API key), all platforms generated in parallel via Promise.all.
- The request goes **directly from the browser** to `api.anthropic.com` using the user's own key — there is no intermediary server.
- All platform variants are generated **in parallel** (`Promise.all`) for speed.

## Data flow & privacy

1. User enters input in the extension.
2. The prompt layer assembles the instruction set locally.
3. A single authenticated request goes to the model provider.
4. The response is rendered in the UI.

No data touches any server operated by this project — because there isn't one. See [`../PRIVACY.md`](../PRIVACY.md).

## Why this shape

The architecture is deliberately thin so the **design system and the AI skill** — not the plumbing — are the substance. It's a demonstration that a well-structured markdown reference framework plus a small, honest surface is enough to make on-brand production self-serve.
