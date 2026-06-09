# Belgrave Capital — Writing Preferences

Guidance for drafting research memos, about copy, and site content.

## Branding

- Use **Belgrave Capital** (not "LTD") in all user-facing copy.
- Legal disclaimer may reference "Belgrave Capital" as the entity name.
- About copy: one line on what the firm is. No process description, no client-access boilerplate.

## Memo structure

Each note follows **Situation → Complication → Action** internally. Do **not** label these sections with headings.

1. **Intro line** — all caps, format: `DAY MONTH DATE — CITY — ENTITY`  
   Example: `TUESDAY JUNE 9 — LONDON — BELGRAVE MANAGEMENT`  
   Use the `memo-intro` CSS class (`text-transform: uppercase`).

2. **Situation** — 1–2 tight paragraphs. What is happening and what matters now. Include Polymarket implied probabilities where relevant.

3. **Complication** — 1 paragraph. Why the setup is non-obvious or what breaks if the consensus is wrong.

4. **Action** — wrap in `<div class="memo-action">`. Bold red text. Direct positioning and trade expression. No preamble.

## Tone

- **Desk note, not pedagogy.** Never explain what CPI is, how Polymarket works, or how markets react to data. Assume the reader knows.
- **Summarized.** Cut filler, hedge words, and repeated ideas. Every sentence should carry information.
- **Proper capitalization** site-wide. No forced lowercase.

## Charts

- One chart per memo, tied to the catalyst. Prefer live Polymarket implied % (D3 bar chart).
- Chart title format: `Core CPI YoY — May 2026 (Polymarket)` or equivalent.
- Cite current implied probabilities in the Situation paragraph; the chart visualizes the same data.

## List / metadata

- Table columns: `dd/mm/yyyy`, title, tags.
- Tags: title case (`Macro`, `Rates`, `CPI`).
- Memo titles: title case (`Macro Note`).

## Disclaimer

- Standard fund disclaimer at the bottom of every memo and the about page.
- Fixed site links: Disclaimer (bottom left), About (bottom right), Client Login (top right).
