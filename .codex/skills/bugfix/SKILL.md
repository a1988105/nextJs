---
name: bugfix
description: Root-cause debugging workflow for fixing software bugs. Use when Codex is asked to investigate, debug, repair, or review a defect; when a failure needs reproduction or expected-vs-actual analysis; when tests should be added before or alongside a fix; or when the user wants a bug fix explained by cause, impact, and verification.
---

# Root-Cause Bugfix

Use this skill to fix bugs by proving the failure mode before changing code, then applying the smallest correct fix and verifying nearby behavior.

## Workflow

1. Establish the failure scenario.
   - Reproduce it with an existing command, test, UI flow, or minimal local case when possible.
   - If reproduction is not practical, infer the scenario from code paths, logs, stack traces, issue text, or user-provided symptoms and state the inference.

2. Define expected vs. actual behavior.
   - Name the contract the code should satisfy.
   - Identify whether the failure is a crash, incorrect output, stale state, race, validation gap, data mismatch, integration issue, or regression.

3. Trace to root cause before editing.
   - Follow the data/control path to the first incorrect assumption or state transition.
   - Prefer reading call sites, tests, schema/types, and recent related code over guessing.
   - Distinguish root cause from the visible symptom.

4. Check test coverage.
   - Look for existing tests that should have caught the issue.
   - Add or update a focused failing test when practical.
   - If a test is not practical, document why and choose the narrowest available verification.

5. Implement the smallest correct fix.
   - Preserve established patterns and public contracts.
   - Fix the general cause, not only the single observed input, unless a business rule explicitly requires a special case.
   - Avoid broad refactors, masking exceptions, swallowing errors, or weakening validation to make the symptom disappear.

6. Verify the change.
   - Run the most relevant targeted test first.
   - Run broader tests or checks when the touched code is shared, user-facing, or risky.
   - Inspect related edge cases that use the same root cause path.

7. Report the result.
   - Summarize root cause, fix, and verification.
   - Mention any test gaps, assumptions, or residual risk.

## Rules

- Do not guess when code, tests, logs, or a minimal reproduction can answer the question.
- Do not apply a workaround that leaves the underlying cause intact.
- Do not mask exceptions or add catch-all fallbacks unless the domain contract explicitly calls for them.
- Do not hardcode a special input, user, route, timestamp, or environment unless the business rule requires it.
- Ask before implementing when the expected behavior depends on unclear product or domain rules.
- Keep unrelated cleanup out of the patch.

## Useful Checks

- Search for sibling code paths that already handle the case correctly.
- Compare type/schema assumptions at boundaries such as API responses, forms, database rows, cache entries, and route params.
- Check initialization and lifecycle order for state, hooks, subscriptions, async effects, and event handlers.
- Check nullability, empty collections, time zones, number/string coercion, precision, and stale cached values.
- Check whether tests assert the important behavior or only assert implementation details.
