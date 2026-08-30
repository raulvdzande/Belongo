# Belongo

> A quiz-style test that calculates, for anyone in the world, which country, city, and neighborhood/village fits them best — with a full relocation plan, Plan B, Plan C, and a top-10 ranked list.

Source concept: [`docs/concept-original.md`](docs/concept-original.md) (original Dutch doc, `concept-perfecte-verhuistest.md`). This file is the working English summary used to drive implementation.

Possible names from the original doc: PlekMatch, TerraFit, HomeQuest, WaarHoorJij, RootFinder, PerfectPlace — "Belongo" is the name settled on for this build.

## 1. One-line pitch

A multi-layered test combining personality, budget, wishes, and hard constraints with a global places database, producing a concrete, highly detailed relocation plan — not "you'd love Portugal" but "move to neighborhood X in city Y, here's your budget, visa path, timeline, and step-by-step plan."

What makes it different:
- Multiple question *types* (sliders, swipes, budget games, dilemmas), not just a form.
- Output is an executable relocation plan, not a vibe.
- Plan A / Plan B / Plan C + a top-10 ranked list, so users can actually choose.

## 2. Test structure

The test is made of several parts. Users don't have to complete all of them — the more they do, the sharper the match ("match precision: 62% → 94%" progress indicator).

### Part 1 — 25 categories (75 questions)
25 categories × 3 questions each. This is the core questionnaire. Question types: sliders (e.g. "how important is sunshine?"), multiple choice, agree/disagree statements.

| # | Category | What it measures |
|---|---|---|
| 1 | Climate & weather | Warm/cold, sun, seasons, humidity |
| 2 | Budget & cost of living | Monthly spend capacity/willingness |
| 3 | Housing | Buy vs rent, home type, space |
| 4 | Work & career | Remote, local jobs, entrepreneurship, retired |
| 5 | Language | Willingness to learn a new language / is English enough |
| 6 | Culture & mentality | Formal/informal, pace, directness |
| 7 | Nature & landscape | Sea, mountains, forest, desert, flatland |
| 8 | City vs village | Busyness, density, size |
| 9 | Social life & community | Introvert/extravert, how you make contacts |
| 10 | Safety | Crime, sense of safety |
| 11 | Healthcare | Quality, cost, accessibility |
| 12 | Education | Schools, universities (if kids) |
| 13 | Family & relationship | Alone, partnered, kids, family nearby |
| 14 | Mobility & transport | Car needed, public transit, cycling, walking |
| 15 | Politics & freedom | Stability, personal freedoms |
| 16 | Religion & worldview | Importance of religion in the area |
| 17 | Food & cuisine | Local food, eating out, dietary needs |
| 18 | Hobbies & free time | What you do in spare time |
| 19 | Sports & activities | Outdoor, gym, watersports, winter sports |
| 20 | Nightlife & entertainment | Going out, culture, events |
| 21 | Diversity & expat community | International, welcoming to foreigners |
| 22 | Tax, visa & regulations | Right to live there? Tax burden |
| 23 | Internet & infrastructure | Speed, reliability (for remote work) |
| 24 | Sustainability & environment | Green, air quality, environmental policy |
| 25 | Future & ambitions | Where you want to be in 10 years |

### Part 2 — Image swipe (no questions, just gut feel)
Tinder-style left/right swipe on photos of landscapes, streets, houses, village squares, skylines, cafés. Captures aesthetic/emotional preference people can't always articulate (e.g. someone says "I love cities" but swipes away every busy street and keeps swiping right on quiet villages).

### Part 3 — Budget allocation game
User gets a fictional monthly budget and splits it across rent, food, going out, savings, travel, hobbies. Reveals actual priorities (vs stated ones) and is immediately usable to filter places by affordability.

### Part 4 — Deal-breakers & must-haves (hard filters)
Short list: "What's absolutely NOT okay" and "What's an absolute requirement." E.g. no snow, must be near the sea, no visa nightmare, pet must be allowed. These are hard filters that exclude places outright.

### Part 5 — Dilemmas (this-or-that)
Fast binary choices between scenarios: "Cheap house far from everything" vs "small apartment downtown"; "Great weather, boring city" vs "grey weather, vibrant city." Measures real trade-offs.

### Part 6 — "A day in your ideal life"
User builds an ideal day: wake time, morning routine, commute, evening plans. Translates into concrete place attributes (walkable? transit? beach nearby?).

### Part 7 — Practical constraints
Passport/nationality, remote work status, kids/ages, moving budget, language level. Makes the relocation plan realistic and filters by what's actually legally possible (visa/residency).

## 3. Algorithm / AI design (4 layers)

1. **Profile building** — All answers map to scores across ~25-30 dimensions (e.g. climate preference = 8/10 warm, budget = €1,500/mo, urbanicity = low), each with an importance weight derived from Part 1 + the budget game + dilemmas.
2. **Hard filters** — Immediately exclude places that fail deal-breakers, are unaffordable, or offer no legal residency path.
3. **Match score** — Each place in the database has scores on the same dimensions. Compute a weighted-distance match percentage between user profile and each place.
4. **AI personalization** — An LLM takes the top matches and writes the detailed, personal report: why this place fits, the relocation plan, risks, neighborhood tips. The LLM does not compute the match (the algorithm does, for reliability) — it makes the output human, thorough, and persuasive.

## 4. Output (per user)

- **🏆 Plan A — your best match**: country → city → specific neighborhood/village + match %, per-dimension breakdown, and a full relocation plan (visa/residency type + requirements/cost/timeline, budget breakdown, month-by-month timeline, housing search guidance, work/tax situation, practical steps — bank account, health insurance, pets, language — plus a checklist).
- **🥈 Plan B — the safe/achievable option**: slightly lower match but easier, cheaper, or faster to realize.
- **🥉 Plan C — the wildcard**: a surprising, adventurous match the user wouldn't have thought of themselves.
- **📊 Top-10 ranked list**: filterable (e.g. "Europe only," "within my budget").
- **📄 Full report**: downloadable/shareable PDF — this is also the monetization moment.

## 5. Monetization

**Primary — Freemium:**
- Free: take the test + top-3 countries with match % + a short Plan A teaser.
- Paid (one-time ~€9–19, or subscription): full detailed report, top-10, Plan B & C, complete relocation plan, PDF export.

**Secondary — Affiliate (passive, scales):**
Housing platforms (international rent/buy), flights & international movers, visa/immigration services, expat health insurance & international banks, language-learning apps, travel insurance.

**Later:** premium 1:1 consult referrals, B2B (companies relocating staff internationally), ads (only once traffic is significant, to avoid degrading the experience).

## 6. The hard part: data

There's no ready-made "every village on Earth, scored on 25 dimensions" dataset. Start with open climate/cost-of-living/safety/visa data, existing country/city APIs, and AI-assisted scoring (human-reviewed) — build coverage in phases rather than trying for global day one.

## 7. Roadmap

- **Phase 1 — MVP**: Part 1 (25 categories) + Part 4 (deal-breakers). Database of ~50 countries + ~200 major cities. Output: top-5 + basic Plan A. Goal: prove the concept works and is enjoyable.
- **Phase 2 — The fun layer**: add Part 2 (image swipe) and Part 3 (budget game). AI-generated personal report. Freemium paywall live. Top-10 + Plan B & C.
- **Phase 3 — The dream version**: expand to neighborhoods/villages region by region. All test parts (5, 6, 7). Affiliate partners integrated. Full relocation plan with visa/budget breakdown.

## 8. Repo status

Scaffolded with `create-next-app` (TypeScript, App Router, Tailwind, `src/` dir, ESLint). No product code yet — next step is building the Phase 1 MVP: the 25-category questionnaire, hard-filter logic, a seed dataset (~50 countries / ~200 cities), and a basic match + Plan A output screen.
