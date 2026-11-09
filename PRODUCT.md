# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS 4 and Radix primitives, as in the owner's MINDSTACK project (confirmed 2026-11-05). Deployed on Vercel. The engine in `lib/` stays framework-free.

## Users

Two audiences, both confirmed:

- **A customer-service agent at MénageSimple** (home cleaning, French-speaking Switzerland) working through the support inbox several times a day: reads a customer message, checks the prepared draft, edits it, sends it or hands it to a colleague.
- **Luca Bernardi, founder of Stonks Holding AG**, evaluating a job candidate's take-home challenge. He opens the demo cold and must understand within seconds what he is looking at, then try it.

## Product Purpose

A copilot for the support team that prepares replies from verified facts of the public website, checks its own figures and promises without AI, and hands the message to a human whenever money, damage, an absent cleaner, personal data, a legal threat or a contradictory point of the website is involved. A person always reviews before sending. Success: fast, correct, policy-consistent answers on simple questions; zero sensitive case marked ready to send.

## Positioning

Facts first, AI second. The model only understands and writes; every number, promise and hand-off decision is verified by code against a fact sheet where each fact carries its exact quote and page. The project also exposes the five points where the company's own website contradicts itself.

## Operating Context

- Triage of an inbox sorted by urgency, the six contact-form reasons of MénageSimple, statuses: ready, to review, to hand off, to archive.
- A test bench of 60 invented messages (40 base, 20 control written afterwards), comparing the local model (Mistral 7B) with a rules-only baseline.
- Pages: Copilot (inbox, draft, checks, cited facts), Test bench, Website consistency, Method.
- French interface. Messages may arrive in French, English, German or Italian.

## Capabilities and Constraints

- Prototype, not affiliated with MénageSimple SA; invented messages, facts from the public site read on 5 November 2026. This disclaimer must stay visible.
- Zero cost: local model, free hosting; the online demo replays recorded model answers and falls back to rules without AI for new messages.
- No account, no database, no personal data.

## Brand Commitments

- Do not imitate MénageSimple's branding (logo, colours): the demo must not pass for an official MénageSimple tool.
- The owner rejects: a marketing-site feel (it must feel like an application people use), clutter, and the generic "AI default" look.

## Evidence on Hand

- `data/facts.yaml` (41 facts with quotes), `data/contradictions.yaml` (5 contradictions), `eval/results/*.json` and `eval/RAPPORT.md` (benchmark), `recordings/ollama-mistral.json` (real model answers).
- No customer testimonials, no real customer messages, no usage metrics: never invent them.

## Product Principles

1. The human decides; the interface makes the state and the reason obvious at a glance.
2. Every claim on screen traces back to a source the user can open.
3. Show failures as plainly as successes.
4. Understandable in seconds by a newcomer, efficient for an agent who uses it all day.

## Accessibility & Inclusion

WCAG 2.2 AA: keyboard navigation through the inbox, visible focus, sufficient contrast, status never conveyed by colour alone, reduced motion respected.
