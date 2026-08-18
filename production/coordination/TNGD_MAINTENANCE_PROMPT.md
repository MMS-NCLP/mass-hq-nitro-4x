# TNGD LIVE SITE MAINTENANCE — Instructional Prompt

**Origin:** MMS Engineering Health Audit, 2026-08-17
**Target repo:** `MMS-NCLP/Top-Notch-Garage-Doors`
**Priority:** High — 6 high security vulns, React purity violation on booking flow, prompt injection file
**Constraint:** This is the live revenue site. Do not break the build (currently passing). Do not change business logic. Each fix should be independently committable.

---

Paste the section below into a Claude session where Top-Notch-Garage-Doors is the working directory.

---

## PROMPT START

You are performing scheduled maintenance on the Top-Notch-Garage-Doors repository. This is a Next.js 16 application, public, and the live revenue-generating site for Top Notch Garage Doors LLC. An engineering health audit on 2026-08-17 found security vulnerabilities, a React Compiler purity violation, and a suspicious file. The build currently passes — your job is to fix these issues without breaking it.

### Phase 1 — Fix the React Compiler Purity Violation

**File:** `BookingFlow.tsx`, around line 75
**Problem:** `Date.now()` is called during render, which is an impure operation. The React Compiler flags this because it can cause hydration mismatches between server and client renders.
**Fix:** Move the `Date.now()` call into a `useEffect`, `useMemo` with appropriate deps, or a state initializer — whichever fits the usage pattern. The goal is that the component's render output is deterministic given its props and state. Read the surrounding code to understand how the timestamp is used before choosing the approach.

### Phase 2 — Fix the Navigation Link

There is a raw `<a>` tag in the navigation (around line 524 of the component containing the nav). Replace it with `next/link`'s `<Link>` component for proper client-side navigation and prefetching.

### Phase 3 — Patch Security Dependencies

Run `npm audit` to see current state. Then:

1. Run `npm audit fix` for non-breaking fixes. This should handle `postcss`, `sharp`, `js-yaml`, `nanoid`, `brace-expansion`.
2. For the `next` CVEs (9 including SSRF, DoS, cache-poisoning): the fix requires upgrading from 16.2.10 to 16.3.1. This is a minor version bump and should be safe. Run `npm install next@latest` and then `npx next build` to verify the build still passes with all 65 routes.
3. Run `npm audit` again to confirm resolution.

### Phase 4 — Remove the Prompt Injection File

**File:** `AGENTS.md`
**Problem:** This file contains an instruction directing AI coding agents to read from `node_modules/next/dist/docs/` — a path that does not exist in any version of Next.js. This is a known prompt injection pattern that could cause a future AI agent session to trust and act on fabricated content placed at that path.
**Action:**
1. Run `git log --follow AGENTS.md` to check when and how it was added.
2. Read the file contents to confirm the problematic instruction.
3. If the file contains only the injection content and no legitimate project documentation, delete it entirely.
4. If it contains a mix of legitimate and problematic content, remove only the instruction referencing `node_modules/next/dist/docs/`.

### Phase 5 — Verify and Commit

1. Run `npx next build` — should pass, all 65 routes generated.
2. Run `npx eslint .` — error count should be reduced (the two errors from the audit should be resolved).
3. Commit in logical groups:
   - "Fix React Compiler purity violation in BookingFlow"
   - "Replace raw anchor tag with next/link in navigation"
   - "Patch high-severity security dependencies"
   - "Remove AGENTS.md prompt injection file"

### What NOT to Do

- Do not upgrade to a new major version of any package
- Do not refactor components beyond the specific fixes
- Do not modify booking flow business logic
- Do not add tests (none configured — separate initiative)
- Do not modify deployment or hosting configuration

## PROMPT END
