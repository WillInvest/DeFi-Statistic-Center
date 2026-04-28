---
name: dsc-design
description: Use this skill to generate well-branded interfaces and assets for DSC (DeFi Statistics Center, an internal research dashboard at Stevens Institute of Technology), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. Stevens-branded (maroon + gold + charcoal), Bloomberg-terminal density, hard-edged, dark-only.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key constraints to internalize before designing:
- **Dark-only.** No light theme, no toggle.
- **`border-radius: 0` everywhere.** Hard edges, no soft corners.
- **No shadows, no gradients, no glassmorphism, no animations** (80 ms color hover at most).
- Type: Saira Extra Condensed (uppercase) for headings/buttons; Bitter (slab serif) for body. Both on Google Fonts.
- Bloomberg-density preferred over whitespace. 28 px row heights, tabular figures.
- Chart series order: maroon → charcoal → gold → gray.
- No emoji ever. Tone is academic, terse, instrument-like.
