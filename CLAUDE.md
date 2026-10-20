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

`src/App.jsx` owns the shared state: `transactions` is seeded with hardcoded sample data and is lost on reload, and the `categories` list is defined inline. It composes three child components, passing them props:
- `src/Summary.jsx` receives `transactions` and derives income, expenses and balance on every render (not stored).
- `src/TransactionForm.jsx` owns the form fields (description, amount, type, category) as separate `useState` hooks, builds the new transaction and hands it to `App` via `onAdd`.
- `src/TransactionList.jsx` owns the filters (type, category) as `useState` hooks and derives the filtered list on every render.

Transaction shape: `{ id, description, amount, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. `amount` is stored as a **number**: the seed data uses numeric literals and `TransactionForm`'s `handleSubmit` converts the form input with `Number(amount)`. The totals use `reduce` with `+` and rely on this, so any new code that creates transactions must convert `amount` too.

Styling is plain CSS: `src/index.css` (global) and `src/App.css` (component classes such as `summary-card`, `income-amount`, `expense-amount`).

ESLint rule of note: `no-unused-vars` ignores names that start with an uppercase letter or underscore.
