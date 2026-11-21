# Recovery prompt

Use when a phase breaks and two fix attempts have failed.

```
Read CLAUDE.md and plan.md. Something is broken in Phase <X>.

What I expected: <expected>
What happened: <actual, paste the error>

Do this in order:
1. Reproduce the failure with the smallest command possible and show the output.
2. State the root cause in one sentence before changing anything.
3. Propose the fix and the files it touches. Wait for my yes.
4. Apply the fix, rerun the Phase <X> test from plan.md, show the result.
5. Add the cause to "What was tried and failed" in CLAUDE.md.

Do not refactor unrelated code. Do not touch files outside the Phase <X> scope lock. If the fix needs a schema or dependency change, stop and ask.
```
