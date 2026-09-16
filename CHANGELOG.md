# Changelog

## V6 intelligence

- Added deterministic local-date context for `today` / `yesterday` reasoning.
- Added server-derived daily totals (income, expense, net, miles, hours) so the agent can answer from recorded state instead of repeatedly asking the user.
- Expanded recent conversational context from 36 to 48 messages.
- Strengthened natural Arabic confirmation and short follow-up handling.
- Added explicit correction behavior: preserve prior context and update only the corrected detail.
- Added duplicate-awareness instructions using client `lastExecuted` state.
- Added proactive arithmetic guidance for net, hourly and per-mile analysis.
- Preserved general-assistant behavior outside finance.
- Added deployment health/version endpoints and acceptance scenarios.
