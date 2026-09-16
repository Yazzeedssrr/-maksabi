# V8 Integration

`lib/insights.js` is deliberately independent of the UI and AI API. The next UI integration should import or bundle these pure functions into the client and render three outputs on Home:

1. `summarizeDay(d, day())` for today's factual metrics.
2. `buildBrief(summary)` for the proactive local brief.
3. `nextBestAction(summary)` for one focused recommendation.

The AI endpoint should receive the same computed summary in `context` so narrative answers and local dashboard calculations use one factual base. Mutating actions remain subject to the existing explicit confirmation flow.

Do not ask the model to calculate values that `insights.js` can calculate deterministically.
