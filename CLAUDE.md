# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course: a React expense tracker that **intentionally** ships with a bug, poor UI and messy code, to be fixed incrementally. Expect to refactor rather than preserve existing patterns.

## Commands

- `npm install` — install dependencies
- `npm run dev` — Vite dev server at http://localhost:5173
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.js`)

There is no test framework configured.

## Environment note

On this machine (Windows), Node.js was installed via winget during a session. Shells opened before that install may lack `node`/`npm` on PATH; in PowerShell, refresh it with:
`$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

## Architecture

React 19 + Vite 7, plain JavaScript (JSX), no router, no state library, no backend or persistence.

The entire app lives in a single component, `src/App.jsx`:
- `transactions` state is seeded with hardcoded sample data and is lost on reload.
- Form fields (description, amount, type, category) and filters (type, category) are each separate `useState` hooks.
- Totals (income, expenses, balance) and the filtered list are derived on every render, not stored.
- The `categories` list is defined inline and shared by the add form and the category filter.

Transaction shape: `{ id, description, amount, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. `amount` is stored as a **number**: the seed data uses numeric literals and `handleSubmit` converts the form input with `Number(amount)`. The totals use `reduce` with `+` and rely on this, so any new code that creates transactions must convert `amount` too.

Styling is plain CSS: `src/index.css` (global) and `src/App.css` (component classes such as `summary-card`, `income-amount`, `expense-amount`).

ESLint rule of note: `no-unused-vars` ignores names that start with an uppercase letter or underscore.
