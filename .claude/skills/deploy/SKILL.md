---
name: deploy
description: Faz o deploy do expense tracker para a área de stage — roda os testes, gera o pacote de produção e faz o push para o branch `staging`. Use quando o usuário pedir para fazer deploy ou publicar em stage.
disable-model-invocation: true
---

# Deploy para stage

Siga os passos abaixo **em ordem**. Se qualquer passo falhar, pare imediatamente, mostre a saída do erro ao usuário e **não** continue para os passos seguintes.

## 0. Pré-verificações

1. Rode `git status --porcelain`. Se houver alterações não commitadas, pare e pergunte ao usuário se quer commitá-las antes — o deploy publica apenas o que está commitado.
2. Anote o branch atual (`git branch --show-current`) e o commit (`git rev-parse --short HEAD`) para o relatório final.

## 1. Rodar todos os testes

1. Rode `npm run lint`. Erros de lint reprovam o deploy.
2. Verifique se `package.json` tem um script `test`:
   - Se tiver, rode `npm test`. Qualquer falha reprova o deploy.
   - Se não tiver, avise o usuário que ainda não existe framework de testes configurado e que apenas o lint foi executado.

## 2. Gerar o pacote de produção

1. Rode `npm run build`.
2. Confirme que `dist/index.html` existe e que `dist/assets/` não está vazio. Caso contrário, o build é considerado falho.

## 3. Push para stage

A área de stage é o branch `staging` no remote `origin`.

1. Rode `git fetch origin`.
2. Faça o push do commit atual para stage: `git push origin HEAD:staging`.
   - Se o push for rejeitado por não ser fast-forward, **não** use `--force`. Pare e explique ao usuário que `staging` tem commits que não estão no branch atual, e pergunte como proceder.

## 4. Relatório

Ao final, informe de forma curta:
- branch e commit publicados;
- resultado do lint e dos testes (ou que não há testes configurados);
- que o build foi gerado em `dist/`;
- que o push para `origin/staging` foi concluído.
