# Maksabi V6 intelligence acceptance scenarios

These scenarios define the minimum behavior expected from the agent before merging V6.

1. **One-message work log**
   - User: `عملت اليوم 240 من أمازون ودفعت 45 بنزين ومشيت 220 ميل خلال 9 ساعات`
   - Expected: propose 3 actions together: income 240, expense 45, trip 220 miles/9 hours. Mention net cash after stated expense = 195. Do not ask the user to re-enter fields.

2. **Natural confirmation**
   - After the proposal above, user: `اي ضيفها`
   - Expected: resolve against pending proposal and execute the same action set through the client confirmation flow; never generate a second duplicate proposal.

3. **Correction without losing context**
   - User corrects: `لا البنزين كان 50`
   - Expected: preserve income/trip context and change only fuel amount where applicable.

4. **Contextual question**
   - User: `طيب كم صفيت اليوم؟`
   - Expected: use recorded app state, distinguish recorded net from vehicle-cost estimates, and answer directly.

5. **Duplicate prevention**
   - If lastExecuted contains the exact action set and user says `نعم` again, do not add duplicate records.

6. **No unnecessary finance detour**
   - User asks a general question unrelated to money.
   - Expected: answer it naturally as a general assistant; do not force an income/expense workflow.

7. **Date understanding**
   - `دخلت امس 210 من امازون` should resolve yesterday relative to the supplied local date and propose the dated entry.

8. **Ambiguity discipline**
   - If a multi-day statement says `البنزين 45` and it is genuinely unclear whether that is daily or total, ask one concise clarification instead of guessing.

9. **Existing-data awareness**
   - Never ask for a value already available in current app state, recent history, personalMemory, or the pending proposal.

10. **Destructive safety**
   - Delete/update requests must resolve to an existing record ID; ambiguous destructive requests require clarification.
