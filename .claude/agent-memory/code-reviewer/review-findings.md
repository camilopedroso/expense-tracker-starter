---
name: review-findings
description: Status dos achados de code review em src/ (abertos/corrigidos), para não repetir nem re-reportar itens resolvidos
metadata:
  type: project
---

Primeiro review completo: 2026-10-22 (HEAD 12e1a13). Lint limpo nessa data.
Confira no código antes de mudar o status. Nenhum falso positivo rejeitado pelo usuário até agora.

**Em aberto (2026-10-22)**
- CRIT TransactionForm: data via `toISOString()` (UTC) -> dia seguinte à noite em fusos negativos (BR). format.js já faz parsing local; falta o inverso na criação.
- CRIT TransactionForm: descrição só com espaços passa (`!description` sem trim); sem `required`, falha silenciosa.
- IMP TransactionForm: default `"food"` hardcoded (useState e reset) acoplado à lista de categories do App.
- IMP ConfirmModal: sem restauração de foco após fechar (botão Delete some -> foco vai pro body), sem focus trap, sem aria-labelledby/describedby. Sugerido `<dialog>` nativo + showModal().
- IMP App.css ~174: `outline: none` em `:focus` do recharts (accessibilityLayer é true por padrão no recharts 3) -> foco de teclado invisível.
- SUG App: `categories` recriado a cada render (mover p/ módulo); setState não funcional em add/delete.
- SUG format.js vs formatCurrency.js: dois módulos de formatação, unificar.
- SUG sort por `b.id - a.id` depende de id numérico (Date.now); quebra se migrar p/ UUID.
- SUG Lógica "filtrar expense e somar" duplicada em Summary e SpendingChart.
- SUG ThemeToggle: chave "theme" e lógica duplicadas com script inline do index.html.

**Já OK (não reportar):** amount convertido com Number; keys estáveis (t.id); datas exibidas com parsing local; Intl para moeda/data; prefers-reduced-motion respeitado; ThemeToggle trata localStorage indisponível.
