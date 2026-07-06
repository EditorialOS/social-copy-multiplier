# Social Copy Multiplier

![version](https://img.shields.io/badge/version-1.0.0-blue)
![status](https://img.shields.io/badge/status-portfolio--ready-brightgreen)
![type](https://img.shields.io/badge/type-AI%20skill-8A2BE2)
![design tool](https://img.shields.io/badge/design-brand%20system-ff69b4)
![platform](https://img.shields.io/badge/platform-Chrome%20MV3-orange)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

> **One message, platform-perfect everywhere.**

Social Copy Multiplier takes one core message and, in a single pass, generates platform-native variants for every channel at once — each obeying that platform's constraints while staying inside a brand-voice configuration you control. The brand voice is defined once; the platform rules are encoded as a reference framework; anyone can produce a full, on-brand social set from a side panel in seconds.

**The design/brand problem it solves:** Every social platform has its own dialect — length, tone, hashtag etiquette, emoji density, CTA style. Teams either post the same copy everywhere (and it reads wrong on three of four platforms) or hand-tune each one (and the brand voice drifts, and it takes an hour). Consistency and platform-nativeness feel like a tradeoff.

---

## 30-second tour

If you only have half a minute, look here:

- **[`ai-skills/platform-adaptation-skill.md`](ai-skills/platform-adaptation-skill.md)** — the AI skill itself: a structured, markdown instruction set that turns brand rules into reliably on-brand output. *This is the heart of the project.*
- **[`docs/design-system.md`](docs/design-system.md)** — the brand system as source of truth: voice, tone, type/color/layout and content rules the tool enforces.
- **[`docs/PRD.md`](docs/PRD.md)** — the product thinking: problem, users, goals, and adoption metrics.
- **[`docs/architecture.md`](docs/architecture.md)** — how it works: UI surface, the AI/model layer, and the prompt layer that binds them.
- **[`extension/`](extension/) + demo** — the working Chrome side-panel extension (Manifest V3). *(Demo GIF: see `docs/demo.gif` once added.)*

---

## Who it's for

Brand & design owners (who set the voice and platform rules) and non-designers — social managers, founders, marketers — who need channel-native copy fast without off-brand drift.

## How it works (in one paragraph)

Social Copy Multiplier is a Chrome side-panel extension (Manifest V3). The brand owner defines the voice and rules **once** as a markdown reference framework (see [`docs/design-system.md`](docs/design-system.md) and [`ai-skills/platform-adaptation-skill.md`](ai-skills/platform-adaptation-skill.md)). At runtime, the tool composes those rules with the user's input into a structured prompt and sends it to Anthropic Claude (bring-your-own API key), all platforms generated in parallel via Promise.all. The result is on-brand output that a non-designer can produce without ever seeing the underlying system.

- **Input:** One core message and a brand-voice configuration (tone, banned words, emoji policy, hashtag strategy).
- **Output:** Simultaneous platform-native variants (Pinterest, Instagram, X/Twitter, LinkedIn) generated in parallel, each within platform constraints and brand voice.

## Install & use

1. Clone this repo.
2. In Chrome, open `chrome://extensions`, enable **Developer mode**, and click **Load unpacked**.
3. Select the [`extension/`](extension/) folder.
4. Open the extension, add your Anthropic API key (stored locally, never sent to any server but Anthropic), and go.

> No accounts. No backend. No analytics. See [PRIVACY.md](PRIVACY.md).

## How it stays on-brand

On-brand output is not luck — it's a designed system:

1. **The brand voice is encoded, not remembered.** Tone, vocabulary, and rules live in [`docs/design-system.md`](docs/design-system.md) as the single source of truth.
2. **The AI skill enforces it.** [`ai-skills/platform-adaptation-skill.md`](ai-skills/platform-adaptation-skill.md) is a structured instruction set with explicit constraints, examples, and guardrails — the same discipline you'd apply to a component library, applied to language.
3. **Adaptation is bounded.** The tool only flexes what should flex (platform format); everything the brand must protect stays fixed.
4. **Anyone can self-serve.** Non-designers produce on-brand work because the design system is doing the work for them — invisibly.

---

## Why this exists (portfolio note)

This repo is part of a small suite of tools exploring one idea: **the best design systems are increasingly invisible — AI skills, brand-encoded tools, and markdown reference frameworks that let anyone produce on-brand work.** Demonstrates encoding platform + brand rules as a reference framework and shipping it as a self-serve tool — the invisible design system that lets anyone produce on-brand, channel-native work.

**Related tools in the suite:**
- [Message Variant Engine](https://github.com/EditorialOS/message-variant-engine) — one message, every audience, on-brand.
- [Brief Engine](https://github.com/EditorialOS/brief-engine) — scattered inputs → structured, on-brand brief.
- [Social Copy Multiplier](https://github.com/EditorialOS/social-copy-multiplier) — one message, platform-perfect everywhere.

## License

MIT — see [LICENSE](LICENSE).
