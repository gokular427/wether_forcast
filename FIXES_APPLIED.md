# Fixes applied

- Replaced the distorted hand-drawn India SVG with a geographically projected offline India map.
- City markers now use the latitude/longitude values already present in `mockForecastData.ts`.
- Kept region click selection, selected-region rings, confidence colors, legend, and hover details.
- Added keyboard activation for map markers.
- Corrected SIH year from 2024 to 2026 in the sidebar footer.
- Reworded demo/model-validation labels to avoid presenting simulated metrics as verified IMD/IMDAA results.
- Reworded explainability notes so rule-based demo contributions are not presented as real SHAP output.
- Clarified that production data sources are target integrations while the current demo is local/deterministic.
- Performed a syntax transpilation check across every `.ts` / `.tsx` file; all files passed syntax validation.

Note: Full `npm run build` could not be executed in this environment because project dependencies were not locally installed and external package installation was unavailable. The TypeScript/TSX source itself was syntax-checked successfully.
