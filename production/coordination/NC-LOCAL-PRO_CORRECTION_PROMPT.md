# NC-LOCAL-PRO HARMONIOUS CORRECTION — Instructional Prompt

**Origin:** MMS Engineering Health Audit, 2026-08-17
**Target repo:** `MMS-NCLP/nc-local-pro`
**Priority:** Critical — build is silently broken, 2 critical + 12 high security vulnerabilities
**Constraint:** Do not break existing functionality. Each fix should be independently committable. Run `next build` after each phase to confirm progress.

---

Paste the section below into a Claude session where nc-local-pro is the working directory.

---

## PROMPT START

You are performing a harmonious correction on the nc-local-pro repository. This is a Next.js 14 application using Prisma, privately held by MMS-NCLP. An engineering health audit on 2026-08-17 found that the build is silently broken and there are critical security vulnerabilities. Your job is to fix these issues methodically without introducing regressions or changing business logic.

### Context

The `package.json` build script is `"build": "prisma generate"` — it never runs `next build`. Running `next build` directly reveals the app fails to compile. TypeScript `tsc --noEmit` passes cleanly, so type-level code is fine. The problems are syntax errors, React rules violations, and ESLint build-time errors.

### Phase 1 — Fix the Build Blockers (do these in order)

1. **Fix the parse error in `src/api/lib/notificationService.ts:271`** — there is a syntax error (`',' expected`). Read the file, find the exact error, fix it. This is likely a missing comma, bracket, or misplaced token.

2. **Fix the conditional useEffect in `src/app/(community)/community/page.tsx:1122`** — a `useEffect` is being called conditionally, which violates the Rules of Hooks. The hook must be called unconditionally at the top level of the component. Move the condition inside the effect body, or restructure the component so the hook always runs.

3. **Fix the ESLint `react/no-unescaped-entities` errors** — there are 100+ instances across dozens of pages where apostrophes and quotes in JSX text content aren't escaped. Replace `'` with `&apos;` or `{&apos;}`, and `"` with `&quot;` where flagged. You can search for the pattern and fix in bulk. Be careful not to modify string literals in JavaScript — only fix unescaped entities in JSX text content.

4. **Fix the ESLint config gap** — somewhere a `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment references a rule that isn't defined in `.eslintrc.json` (which only extends `next/core-web-vitals`). Either add `@typescript-eslint/no-explicit-any` to the ESLint config, or remove the disable comment if the rule isn't needed.

After each fix, run `npx next build` to confirm the error count decreases. After all four, the build should pass.

### Phase 2 — Fix the Build Script

Once `next build` passes, update `package.json`:

```json
"build": "prisma generate && next build"
```

Verify with `npm run build` — it should now run the full pipeline.

### Phase 3 — Patch Critical Security Vulnerabilities

Run `npm audit` to see current state. Then:

1. Run `npm audit fix` for non-breaking fixes first.
2. Specifically address:
   - `next-auth`: OAuth state/nonce binding bypass and email-normalization homoglyph bypass. Check if upgrading `next-auth` to the latest patch resolves these. These are authentication-critical.
   - `shell-quote`: DoS/injection. Upgrade to patched version.
   - `nodemailer`: SMTP command injection and SSRF. Upgrade to patched version.
   - `ws`: Upgrade to patched version.
3. Run `npm audit` again to confirm resolution of critical and high findings.
4. Do NOT attempt the Next.js 14 -> 16 or React 18 -> 19 major version bumps in this correction. Those are separate planned upgrades.

### Phase 4 — Verify and Commit

1. Run `npm run build` — should pass end to end (prisma generate + next build).
2. Run `tsc --noEmit` — should still pass.
3. Commit in logical groups:
   - "Fix build blockers: parse error, conditional hook, unescaped entities, ESLint config"
   - "Fix build script to run next build after prisma generate"
   - "Patch critical and high security vulnerabilities"

### What NOT to Do

- Do not upgrade Next.js or React major versions
- Do not refactor business logic
- Do not add tests (there are none configured — that's a separate initiative)
- Do not modify Prisma schema or migrations
- Do not change deployment configuration (vercel.json)

## PROMPT END
