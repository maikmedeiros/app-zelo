@AGENTS.md

# Regras de commit (OBRIGATÓRIAS)

## 1. Nunca commitar sem pedido explícito

Nunca executar `git commit`, `git push`, `git merge`, `git rebase` ou qualquer
operação que altere o histórico sem que eu peça explicitamente ("commita",
"faz o commit", "sobe isso").

Ao terminar uma tarefa: parar, relatar o que foi feito e deixar as alterações
apenas no working tree. Eu preciso revisar e validar cada etapa antes de
qualquer commit. Terminar a implementação NÃO autoriza commitar.

Uma autorização vale só para aquele commit — não é permissão permanente.

## 2. Sem co-autoria do Claude

Mensagens de commit não devem conter nenhuma linha `Co-Authored-By:` referente
ao Claude/Anthropic, nem qualquer assinatura, emoji ou rodapé do tipo
"Generated with Claude Code". O commit é meu, com autoria só minha.

Isso vale também para corpos de Pull Request criados via `gh`.

# Comentários no código

Não escrever comentários desnecessários. O código deve ser autoexplicativo:
nomes claros, funções pequenas, tipos expressivos. Se algo precisa de comentário
para ser entendido, o certo é reescrever o código, não explicá-lo.

Os únicos comentários permitidos são `TODO` e `FIXME`:

```ts
// TODO: paginar quando a lista passar de 100 itens
// FIXME: race condition quando o refresh do token acontece durante o fetch
```

Proibido, entre outros: comentários que repetem o que a linha já diz,
cabeçalhos decorativos / separadores de seção, código comentado (usar o git),
narração de mudanças ("adicionado aqui", "novo"), e explicações óbvias de
imports, props ou tipos.

Exceção: diretivas de ferramenta não são comentários e continuam permitidas
(`@ts-expect-error`, `eslint-disable-*`, `biome-ignore`, pragmas do Next como
`'use client'` não são comentários, etc.).

Ao editar um arquivo, remover comentários existentes que violem esta regra.
