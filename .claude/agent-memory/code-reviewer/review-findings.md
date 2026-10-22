---
name: review-findings
description: Status dos achados de code review em src/ (abertos/corrigidos), para não repetir nem re-reportar itens resolvidos
metadata:
  type: project
---

Review 1: 2026-10-22 (HEAD 12e1a13). Re-review das correções: 2026-10-22 (HEAD 150cf46, branch fix/code-review-findings). Lint limpo nas duas.
Confira no código antes de mudar o status. Nenhum falso positivo rejeitado pelo usuário até agora.

**Em aberto (achados novos do re-review, 2026-10-22)**
- SUG ConfirmModal: `opener` = `document.activeElement` lido no render; no Safari/Firefox macOS clique não foca botão -> opener = body (isConnected) e o fallback (h2) nunca é usado. Sugerido ignorar body ou capturar o opener no onClick do Delete.
- SUG ConfirmModal: clique no backdrop via `e.target === e.currentTarget` fecha se o usuário arrastar seleção de texto de dentro p/ fora.
- SUG App.css `.modal::backdrop` usa `var(--overlay)`: só herda custom props em Chrome 122+/FF 120+/Safari 17.4+; antes disso backdrop fica transparente.

**Mitigados por decisão (só documentados com comentário; não re-reportar)**
- sort `b.id - a.id` depende de id numérico (Date.now).
- ThemeToggle x script inline do index.html: chave "theme" duplicada (script precisa rodar antes do bundle).

**Corrigidos em 150cf46 (verificado)**: data local (todayISO em format.js); trim + required + setCustomValidity na descrição; default = categories[0]; ConfirmModal em `<dialog>` nativo com showModal, aria-labelledby, foco restaurado (opener ou h2 fallback); outline do recharts só some em :not(:focus-visible); CATEGORIES e sumByType em src/transactions.js; formatCurrency unificado em format.js; setState funcional.

**Já OK (não reportar):** amount convertido com Number; keys estáveis (t.id); datas exibidas com parsing local; Intl para moeda/data; prefers-reduced-motion respeitado; ThemeToggle trata localStorage indisponível; ConfirmModal sob StrictMode (cleanup simulado tenta focar opener inerte, re-run pula showModal) funciona; guard `Number(amount) > 0` é defensivo (required/min bloqueiam antes).
