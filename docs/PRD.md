# PRD — Social Copy Multiplier

## Problem

Every social platform has its own dialect — length, tone, hashtag etiquette, emoji density, CTA style. Teams either post the same copy everywhere (and it reads wrong on three of four platforms) or hand-tune each one (and the brand voice drifts, and it takes an hour). Consistency and platform-nativeness feel like a tradeoff.

## Solution

Social Copy Multiplier takes one core message and, in a single pass, generates platform-native variants for every channel at once — each obeying that platform's constraints while staying inside a brand-voice configuration you control. The brand voice is defined once; the platform rules are encoded as a reference framework; anyone can produce a full, on-brand social set from a side panel in seconds.

## Users

Brand & design owners (who set the voice and platform rules) and non-designers — social managers, founders, marketers — who need channel-native copy fast without off-brand drift.

### Primary personas

1. **The Brand/Design Owner** — defines the voice, rules, and standards. Wants leverage: to encode their judgment once and have it applied everywhere without becoming a bottleneck.
2. **The Non-Designer Producer** — needs on-brand output but lacks design/brand training. Wants speed and confidence that what they ship won't be "off."

## Goals

- **G1 — On-brand by default.** Output should be consistent with the brand system without the user having to know the rules.
- **G2 — Self-serve.** A non-designer completes the task end-to-end without escalating to the design team.
- **G3 — Owned system.** The brand rules live as a readable, versionable reference framework (markdown), not tribal knowledge.
- **G4 — Zero backend.** No accounts, no server, no data collection — trust and auditability by design.

## Requirements

### Functional
- Accept the user's input: One core message and a brand-voice configuration (tone, banned words, emoji policy, hashtag strategy).
- Produce: Simultaneous platform-native variants (Pinterest, Instagram, X/Twitter, LinkedIn) generated in parallel, each within platform constraints and brand voice.
- Let the brand owner configure voice/rules that constrain every generation.
- Store settings locally; never require an account.

### Non-functional
- **Privacy:** all data stays on-device except the direct, user-keyed call to Anthropic Claude (bring-your-own API key), all platforms generated in parallel via Promise.all.
- **Latency:** a full generation completes in a few seconds.
- **Auditability:** the entire behavior is open source and inspectable.
- **Extensibility:** the rule set is modular markdown, editable without touching code.

## Success & adoption metrics

| Metric | Definition | Target signal |
|---|---|---|
| Activation | User completes one real generation | First-session success |
| Self-serve rate | Tasks completed without design-team review | ↑ over time |
| On-brand acceptance | Output shipped with minimal edits | Low edit distance |
| Repeat use | Return within 7 days | Habitual use |
| Rule reuse | Brand config reused across generations | Encoded voice pays off |

## Non-goals

- Not an autonomous agent, and not an evals harness. This is an **AI skill**: a structured, human-directed instruction set that produces reliable, on-brand output.
- Not a content database or CMS.
- Not a replacement for the brand/design owner — a force multiplier for them.
