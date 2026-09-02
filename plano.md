# Plano de ação — front-end do Zelo

## Contexto

**Ponto de partida.** `app-zelo/` é um repositório vazio (git inicializado, zero commits). A
API vive em [`../zelo`](../zelo) e está pronta: **93 rotas**, **79 capabilities**, 18 recursos
de topo mais os aninhados. O back-end é Node 24 + Express 5 + TypeScript 6, Clean
Architecture, PostgreSQL sem ORM, e roda em `http://localhost:3003` com prefixo `/v1`.

**Resultado pretendido:** uma aplicação **Next.js 16 (App Router) + React 19** que consome **todos os
93 endpoints**, com login, navegação guiada por capability, e as telas que sustentam a
demonstração do TCC nos quatro perfis do sistema (`ADMINISTRADOR`, `COORDENACAO`, `PROFESSOR`,
`RESPONSAVEL`).

**Regra de ouro deste plano:** nenhum endpoint fica órfão. A [seção 9](#9-matriz-de-cobertura)
é a matriz que amarra cada rota da API a uma fase e a uma tela — é ela que fecha o critério de
"tudo integrado".

## Estado atual — 31/08/2026

Scaffold criado com **Next.js 16.3.3** — não a 15, como este plano supunha ao ser escrito.
As diferenças que a 16 impôs estão registradas no [§12](#12-registro-de-execução).

| Fase                               | Estado |
| ---------------------------------- | ------ |
| 0 — Fundação e tooling             | ✅     |
| 1 — BFF, camada de API e contratos | ✅     |
| 2 — Autenticação e autorização     | ✅     |
| 3 — Design system e shell          | ✅     |
| 4 — Feed e postagens               | ✅     |
| 5 — Agenda do aluno                | ✅     |
| 6 — Turmas, alunos e matrículas    | ✅     |
| 7 — Pessoas, papéis e usuários     | ✅     |
| 8 — Vínculos e acessos             | ✅     |
| 9 — Consentimento (LGPD)           | ✅     |
| 10 — Relatórios e modelos          | ✅     |
| 11 — Administração e perfis        | ✅     |
| 12 — Acessibilidade e polimento    | ✅     |
| 13 — Build, deploy e docs          | ⬜     |

---

## 1. Decisões de stack

| Decisão             | Escolha                                                             | Porquê                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework           | **Next.js 16 (App Router) + React 19 + TypeScript**                 | Decisão do projeto. O App Router traz o que este sistema precisa: Server Components para carregar lista já renderizada, roteamento por arquivo e um servidor próprio para o BFF (§3.1).        |
| Arquitetura de rede | **Next como BFF** — o navegador nunca fala com `:3003`              | É o ganho decisivo do Next aqui: a sessão vira cookie **first-party** do domínio do front, some o CORS, some o problema de imagem autenticada (§3.6) e o endereço da API deixa de ser público. |
| Renderização        | Server Components para leitura; Client Components para interação    | Lista, detalhe e relatório chegam prontos do servidor. Composer, comentário, reação e formulário são clientes. Regra escrita na §5.                                                            |
| Roteamento          | **App Router** com route groups `(auth)` e `(app)`                  | O layout autenticado carrega a sessão uma vez e a distribui por contexto, em vez de cada página buscar de novo.                                                                                |
| Estado de servidor  | **TanStack Query v5** no cliente, com hidratação do servidor        | Paginação, invalidação após escrita e reação otimista. `HydrationBoundary` evita o refetch do que o Server Component já trouxe.                                                                |
| Estado de UI        | Hooks locais + Context só para sessão e tema                        | Não antecipar abstração — mesma régua do back-end.                                                                                                                                             |
| Formulários         | **React Hook Form + Zod 4**                                         | O back valida com Zod 4; espelhar os schemas dá erro imediato e mensagem idêntica.                                                                                                             |
| Escritas            | **Route Handlers** (`/api/v1/[...path]`) + TanStack Query mutations | Server Actions ficam de fora: o contrato já é REST, e envelopar cada `POST` numa action esconderia o status HTTP que a UI precisa distinguir (409 × 422 × 413).                                |
| Estilo              | **Tailwind CSS 4** + tokens CSS próprios                            | Velocidade sem CSS órfão. Os tokens ficam em `:root`, então o tema troca em um lugar só.                                                                                                       |
| Componentes         | **Radix UI Primitives** (headless)                                  | Diálogo, menu, tabs e combobox com acessibilidade (foco, ARIA, teclado) já resolvida.                                                                                                          |
| Ícones              | **lucide-react**                                                    | Tree-shakeable, traço consistente.                                                                                                                                                             |
| Datas               | **date-fns** + locale `pt-BR`                                       | A API troca `YYYY-MM-DD` e ISO-8601; a formatação é sempre de exibição.                                                                                                                        |
| Testes              | **Vitest + Testing Library + MSW**                                  | MSW dá o contrato da API sem subir banco — e vira a prova documentada de que o front fala o dialeto certo.                                                                                     |
| Lint                | **ESLint 9 (flat) + Prettier**, config alinhada ao back             | Um TCC com dois padrões de formatação é um TCC com ruído de diff.                                                                                                                              |
| Gerenciador         | **npm** (Node 24, `.nvmrc` espelhando o back)                       | Paridade com `../zelo`.                                                                                                                                                                        |
| Idioma              | **Código e rota em inglês; UI em pt-BR**                            | Mesma regra do back-end (CLAUDE.md §3). Texto de interface centralizado em `shared/i18n/pt-BR.ts`.                                                                                             |

**Fora de escopo** (segue o recorte do back-end): notificação push/e-mail, visão
computacional, multi-escola na UI (a escola sai do ator), tempo real, i18n multi-idioma.

---

## 2. Arquitetura de pastas

App Router na raiz; a lógica de cada recurso agrupada em `src/modules/`, espelhando a
organização do back-end — **por recurso, com a feature na ponta** — para que quem lê os dois
repositórios ache a mesma coisa no mesmo lugar.

```
src/
├── proxy.ts                           # porteiro: sem cookie de sessão → /login
│                                      # (em Next 16 o middleware chama-se proxy)
├── app/
│   ├── layout.tsx                     # html/body, fontes, tema, Providers
│   ├── providers.tsx                  # QueryClient, SessionProvider, Toaster
│   ├── (auth)/login/page.tsx          # público
│   ├── (app)/
│   │   ├── layout.tsx                 # AppShell + sessão carregada no servidor
│   │   ├── page.tsx                   # redireciona conforme perfil
│   │   ├── feed/…                     # /feed, /feed/nova, /feed/[postId]
│   │   ├── students/[studentId]/…     # visão geral, journal, consents, reports
│   │   ├── classes/[classId]/…        # detalhe, consents
│   │   ├── people/ guardians/ teachers/ users/
│   │   ├── enrollments/ guardian-links/ teacher-links/ class-accesses/
│   │   ├── reports/ report-templates/
│   │   ├── roles/ role-grants/ school-years/
│   │   └── account/
│   ├── api/
│   │   ├── auth/login/route.ts        # repassa o Set-Cookie da API (§3.2)
│   │   ├── auth/logout/route.ts
│   │   └── v1/[...path]/route.ts      # proxy catch-all para os 93 endpoints
│   ├── 403/page.tsx · not-found.tsx · error.tsx · global-error.tsx
├── config/
│   ├── env.ts                         # variáveis validadas por Zod — lança no boot
│   ├── features.ts                    # espelho do enum Feature do back (79 capabilities)
│   └── navigation.ts                  # itens de menu, cada um declarando sua capability
├── shared/
│   ├── api/
│   │   ├── server.ts                  # 'server-only': fetch → API, encaminha o cookie
│   │   ├── client.ts                  # 'use client': fetch → /api/v1, same-origin
│   │   ├── errors.ts                  # ApiError tipado por statusCode
│   │   ├── query-keys.ts              # fábrica central de chaves do TanStack Query
│   │   └── types.ts                   # Paginated<T>, Collection<T>, ApiErrorBody
│   ├── components/                    # design system (§4.3)
│   ├── hooks/                         # useSession, useCan, useUrlPagination, useDebounce
│   ├── utils/                         # cpf, phone, date, personName
│   └── i18n/pt-BR.ts                  # rótulos, enums traduzidos, mensagens
└── modules/
    └── <recurso>/
        ├── api/                       # 1 arquivo por endpoint (server fn + hook cliente)
        ├── components/                # componentes só desse recurso
        ├── schemas/                   # espelho Zod do contrato de entrada do back
        └── types.ts                   # espelho dos *Output do back
```

**Regras que valem para todo o repositório:**

1. **Nenhum `fetch` fora de `shared/api/`.** Server Component usa `server.ts`; Client Component
   usa `client.ts`. Não existe terceiro caminho.
2. **`page.tsx` e `layout.tsx` são finos** — montam a tela e delegam. Lógica de recurso mora em
   `modules/`, não em `app/`.
3. **`'use client'` é a exceção, declarada o mais fundo possível na árvore.** Uma página não
   vira cliente inteira porque tem um botão interativo: o botão é que é cliente.
4. **Nenhuma string mágica de capability.** Sempre `Feature.PostCreate`, nunca `'CREATE:POST'`.
5. **Nenhuma chave de query solta.** Toda chave sai de `query-keys.ts`, para que a invalidação
   após escrita não dependa de alguém lembrar o array certo.
6. **Um arquivo por endpoint** em `api/`, nomeado pela feature do back
   (`find-list-posts.ts`, `create-post.ts`), para que a correspondência seja literal.
7. **`server-only` e `client-only`** importados nos módulos correspondentes — o erro de
   importar o lado errado aparece no build, não em runtime.

---

## 3. O contrato da API e o BFF

Levantado lendo `../zelo/src`. É este contrato que a Fase 1 codifica.

### 3.1 Topologia

```
navegador ──► Next (:3000) ──► API Zelo (:3003/v1) ──► PostgreSQL
           first-party      server-to-server
           mesmo domínio     sem CORS
```

O navegador **nunca** chama `:3003`. Consequências, todas boas:

- **A sessão vira cookie first-party.** Sem cross-site, `SameSite=Lax` deixa de ser
  limitação — vale inclusive para `<img>` (§3.6).
- **CORS deixa de existir no caminho crítico.** `ALLOW_ORIGIN_LIST` do back segue configurado,
  mas o front não depende dele (requisição servidor→servidor não manda `Origin`).
- **`API_URL` é variável de servidor**, nunca `NEXT_PUBLIC_`. O endereço e a porta da API não
  chegam ao bundle.
- **Custo:** um salto de rede a mais e um arquivo de proxy. Barato pelo que entrega.

### 3.2 Como a sessão atravessa o BFF

1. `POST /api/auth/login` (Route Handler) recebe e-mail e senha, chama `POST :3003/v1/sessions`.
2. A API responde `201` com `Set-Cookie: ZELO_APP_DEV=…; HttpOnly; Path=/; SameSite=Lax`.
   Como o cookie **não declara `Domain`** (`SESSION_COOKIE_DOMAIN` fica vazio), o handler pode
   repassar o header como veio e o navegador o grava no domínio do **Next**.
3. Toda leitura seguinte lê o cookie com `cookies()` (Server Component) ou o recebe na
   requisição (Route Handler) e o encaminha no header `Cookie` para a API.
4. `POST /api/auth/logout` chama `DELETE :3003/v1/sessions/current` e repassa o `Set-Cookie` de
   expiração.

**A leitura do cookie é só encaminhamento.** O front não decodifica, não valida e não confia
nele — quem decide se a sessão vale é o `injectActor` do back, sempre.

### 3.3 Envelope de resposta

| Formato          | Corpo                                                | Onde aparece                         |
| ---------------- | ---------------------------------------------------- | ------------------------------------ |
| Item             | o objeto direto                                      | `GET /posts/:id`, todo `POST`        |
| Coleção paginada | `{ results, page, limit, totalResults, totalPages }` | todo `GET` de lista                  |
| Coleção simples  | `{ results }`                                        | `GET /reaction-types`                |
| Bytes            | `Content-Type: image/*` + corpo binário              | `GET .../media/:id`, `GET .../photo` |
| Vazio            | `204`, sem corpo                                     | todo `DELETE`                        |

`totalPages` **vem pronto do banco** — o front nunca calcula.

### 3.4 Erros

Corpo uniforme: `{ error, message, cause?, stack? }`. `cause` só chega para `ValidationError`
(é o relatório das `issues` do Zod) e fora de produção.

| Status  | Classe                     | O que o front faz                                                                           |
| ------- | -------------------------- | ------------------------------------------------------------------------------------------- |
| 400     | `ValidationError`          | Mapeia `cause[].path` → campo do formulário e mostra a mensagem no campo.                   |
| 401     | `UnauthorizedError`        | Server Component: `redirect('/login?next=…')`. Cliente: derruba o cache da sessão e navega. |
| 403     | `ForbiddenError`           | `redirect('/403')` — **nunca** é bug de rota, é capability faltando.                        |
| 404     | `NotFoundError`            | `notFound()` no servidor; estado vazio dedicado no cliente.                                 |
| 409     | `ConflictError`            | Toast com a mensagem do back (ex.: e-mail já em uso).                                       |
| 413     | `PayloadTooLargeError`     | Mensagem no campo de upload, citando o limite de 10 MB.                                     |
| 422     | `UnprocessableEntityError` | Toast: regra de negócio violada.                                                            |
| 500/502 | `InternalServerError`      | `error.tsx` com botão de tentar de novo.                                                    |

**O 401 é tratado em dois lugares só** — `server.ts` e `client.ts`. Página nenhuma trata 401.

### 3.5 Autorização no cliente

`GET /sessions/current` devolve:

```ts
{ id, name, email, roles: string[], permissions: string[], classes: string[] }
```

`permissions` vem no formato de **três segmentos** — `ACAO:RECURSO:ABRANGENCIA`, ex.
`VIEW:POST:TURMA`. O `(app)/layout.tsx` carrega isso **uma vez, no servidor**, e injeta num
`SessionProvider`. Daí saem os dois helpers:

- `can(Feature.PostCreate)` → existe alguma concessão daquela capability, em qualquer
  abrangência. Governa **exibir ou não** o botão/menu.
- `scopesOf(Feature.PostView)` → `['TURMA']`. Governa o que a tela **pede** à API.

Existem nas duas metades: `hasCapability(session, feature)` puro em `shared/auth/`, usado
tanto pelo Server Component quanto pelo hook `useCan`.

> **A UI esconder o botão não é autorização** — quem autoriza é o `canRequest` do back. O
> guard do front existe para não oferecer caminho que termina em 403.

O `proxy.ts` faz só o porteiro barato: **sem cookie, sem página autenticada**. Ele não
consulta a API (edge runtime + uma ida ao banco por navegação seria caro e frágil); quem
confere de verdade é o layout, no servidor.

### 3.6 Imagens autenticadas

`GET /posts/:postId/media/:mediaId` e `GET /people/:personId/photo` devolvem **bytes atrás de
autenticação**. Com o BFF isso deixa de ser problema: `<img src="/api/v1/people/…/photo">` é
requisição **same-origin**, o navegador manda o cookie sem hesitar, e o proxy o encaminha.

Duas decisões:

- **Sem `next/image` para mídia autenticada.** O otimizador busca a imagem por conta própria,
  sem o cookie do usuário, e levaria 401. Usa-se `<img>` com `loading="lazy"` e `width`/`height`
  declarados. O `next/image` fica para os assets estáticos da marca.
- O Route Handler de proxy repassa `Content-Type`, `Content-Length` e `Cache-Control:
private, max-age=…` — é imagem de criança, cache compartilhado está fora de questão.

### 3.7 Uploads

`PUT /people/:personId/photo` e `POST /posts/:postId/media` recebem **`multipart/form-data`**
com o campo obrigatoriamente chamado **`file`**. Limite de 10 MB. O back confere a assinatura
real dos bytes — **só JPEG, PNG e WebP** (SVG é recusado de propósito). O front valida o mesmo
antes de subir, para dar erro sem gastar a viagem.

O proxy encaminha o corpo como **stream**, sem bufferizar, e o `next.config.ts` eleva o limite
de corpo do Route Handler para acomodar os 10 MB.

### 3.8 Enums (espelhados em `shared/i18n/pt-BR.ts`)

| Enum                     | Valores                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `CLASS_SHIFTS`           | `MANHA`, `TARDE`, `INTEGRAL`                                                                            |
| `POST_AUDIENCES`         | `TURMA`, `ALUNO`                                                                                        |
| `POST_TYPES`             | `REGISTRO_DIARIO`, `RECADO`, `EVENTO`                                                                   |
| `POST_STATUSES`          | `RASCUNHO`, `PUBLICADA`, `REMOVIDA`                                                                     |
| `COMMENT_STATUSES`       | `PUBLICADO`, `REMOVIDO_PELO_AUTOR`, `REMOVIDO_PELA_ESCOLA`                                              |
| `JOURNAL_ENTRY_STATUSES` | `PUBLICADA`, `REMOVIDA_PELO_AUTOR`, `REMOVIDA_PELA_ESCOLA`                                              |
| `RELATIONSHIPS`          | `MAE`, `PAI`, `AVO`, `TIO`, `IRMAO`, `TUTOR_LEGAL`, `OUTRO`                                             |
| `TEACHER_ROLES`          | `TITULAR`, `AUXILIAR`, `VOLANTE`                                                                        |
| `ACCESS_REASONS`         | `COORDENACAO`, `DIRECAO`, `SECRETARIA`, `SUBSTITUICAO`, `ESTAGIO`, `OUTRO`                              |
| `CONSENT_TYPES`          | `IMAGEM_INTERNA`, `IMAGEM_EXTERNA`, `TRATAMENTO_BIOMETRICO`                                             |
| `CONSENT_ORIGINS`        | `TERMO_MATRICULA`, `PORTAL_RESPONSAVEL`, `IMPORTACAO`, `SOLICITACAO_VERBAL`                             |
| `REPORT_DIMENSIONS`      | `ACOLHIMENTO`, `ALIMENTACAO`, `SONO`, `SOCIALIZACAO`, `AUTONOMIA`, `LINGUAGEM`, `DESENVOLVIMENTO_MOTOR` |
| `REPORT_LEVELS`          | `NAO_OBSERVADO`, `EM_INICIO`, `EM_DESENVOLVIMENTO`, `CONSOLIDADO`                                       |
| `REPORT_STATUSES`        | `RASCUNHO`, `PUBLICADO`                                                                                 |
| `SCOPES`                 | `PROPRIA`, `TURMA`, `ESCOLA`                                                                            |

**Enum nunca aparece cru na tela.** `IMAGEM_EXTERNA` vira "Uso externo da imagem"; a tabela de
tradução mora num arquivo só.

---

## 4. Design do sistema

### 4.1 Princípios (o que a literatura de produto educacional cobra)

1. **Mobile-first de verdade.** Responsável abre no celular, no ponto de ônibus, uma vez por
   dia. O feed é a tela que precisa ser perfeita em 360 px de largura.
2. **Privacidade visível, não escondida.** Consentimento de imagem é recurso de primeira classe
   do modelo — então é recurso de primeira classe da interface: estado atual, histórico datado
   e revogação em um clique.
3. **Sem métrica de vaidade.** Nada de contagem de visualização, ranking ou "engajamento".
   Reação existe para a família dizer "vi e gostei", e para. Feed é **cronológico**.
4. **Acessibilidade WCAG 2.2 AA** como requisito, não como acabamento: contraste ≥ 4.5:1, alvo
   de toque ≥ 44 px, navegação completa por teclado, `prefers-reduced-motion` respeitado.
5. **Linguagem acolhedora e concreta.** "Ana ainda não tem turma neste ano" no lugar de
   "Nenhum registro encontrado". Erro fala o que fazer a seguir.
6. **Rascunho é estado explícito.** Postagem e relatório nascem `RASCUNHO`; publicar é ação
   separada, com confirmação — publicar para famílias é irreversível na prática.
7. **Trabalho do professor em três toques.** Registrar o dia da turma é a tarefa mais repetida
   do sistema: escolher turma → escrever/foto → publicar.

### 4.2 Identidade visual

| Token          | Valor                                                                         | Uso                                                     |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| `--brand`      | `#2F6F62` (verde-sálvia)                                                      | Ação primária, marca. Sóbrio, legível, não infantiliza. |
| `--brand-soft` | `#E7F1EE`                                                                     | Fundo de destaque, chip ativo                           |
| `--accent`     | `#E8A33D` (âmbar)                                                             | Estado "atenção", rascunho, pendência                   |
| `--danger`     | `#C0392B`                                                                     | Remoção, revogação                                      |
| `--surface`    | `#FFFFFF` / `#14181B`                                                         | Cartão                                                  |
| `--bg`         | `#F7F8F7` / `#0E1113`                                                         | Fundo                                                   |
| Tipografia     | Inter via `next/font/google` (self-hosted, sem FOUT), 16 px base, escala 1.25 | Números tabulares em tabela                             |
| Raio           | 12 px (cartão), 8 px (controle)                                               |                                                         |
| Grid           | 4 px                                                                          | Espaçamento sempre múltiplo                             |

Tema claro e escuro pelos mesmos tokens, com `prefers-color-scheme` como padrão e troca manual
persistida em cookie — **cookie, não `localStorage`**: assim o servidor já renderiza no tema
certo e não há flash de tema errado na primeira pintura.

### 4.3 Componentes do design system (Fase 3)

`Button` · `IconButton` · `Input` · `Textarea` · `Select` · `Combobox` (busca assíncrona, base
de todo seletor de pessoa/aluno/turma) · `Checkbox` · `Switch` · `DatePicker` · `FileDropzone` ·
`Card` · `Badge` · `Avatar` · `Table` (com `DataTable` paginado) · `Tabs` · `Dialog` ·
`AlertDialog` (confirmação destrutiva) · `Sheet` (mobile) · `DropdownMenu` · `Toast` ·
`Skeleton` · `EmptyState` · `ErrorState` · `Pagination` · `PageHeader` · `Breadcrumbs` ·
`Gallery` (lightbox de mídia) · `ConsentBadge` · `LevelPicker` (níveis do relatório).

Cada um marcado como servidor ou cliente de propósito: `Card`, `Badge`, `EmptyState` e
`PageHeader` são **Server Components** (não têm estado) — é isso que mantém o bundle pequeno.

### 4.4 Navegação por perfil

O menu é **derivado das capabilities**, não do nome do perfil — `config/navigation.ts` declara
a capability de cada item e o shell filtra. Um perfil customizado criado em `POST /roles` ganha
a navegação certa sem uma linha de código nova.

| Perfil            | O que vê                                                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RESPONSAVEL**   | Feed · Meus filhos (perfil, agenda, relatórios) · Consentimentos · Minha conta                                                                                                                           |
| **PROFESSOR**     | Feed · Nova postagem · Minhas turmas · Alunos · Agenda · Relatórios · Minha conta                                                                                                                        |
| **COORDENACAO**   | Tudo do professor + Cadastros (pessoas, alunos, responsáveis, professores, usuários) · Turmas e matrículas · Vínculos · Acessos a turma · Consentimentos por turma · Anos letivos · Concessões de perfil |
| **ADMINISTRADOR** | Tudo + Perfis e permissões                                                                                                                                                                               |

### 4.5 Mapa de rotas (App Router)

```
app/(auth)/login                                      público
app/(app)/                                            → redireciona conforme perfil
app/(app)/feed                                        lista (filtro: turma, aluno, tipo, status)
app/(app)/feed/nova                                   composer (rascunho → mídia → publicar)
app/(app)/feed/[postId]                               detalhe, galeria, comentários, reações
app/(app)/students                                    lista de alunos
app/(app)/students/[studentId]                        visão geral
app/(app)/students/[studentId]/journal                agenda diária
app/(app)/students/[studentId]/consents               histórico de consentimento
app/(app)/students/[studentId]/reports                relatórios do aluno
app/(app)/classes · classes/[classId] · classes/[classId]/consents
app/(app)/people · people/[personId]
app/(app)/guardians · guardians/[guardianId]
app/(app)/teachers · teachers/[teacherId]
app/(app)/users · users/[userId]
app/(app)/enrollments · guardian-links · teacher-links · class-accesses
app/(app)/reports · reports/[reportId]
app/(app)/report-templates · report-templates/[templateId]
app/(app)/school-years
app/(app)/roles · roles/[roleId] · role-grants
app/(app)/account
app/403 · app/not-found
```

Cada pasta ganha seu `loading.tsx` com skeleton — é o que dá navegação instantânea com
streaming em vez de tela branca.

---

## 5. Convenções de integração

Cada endpoint vira **um arquivo** em `modules/<recurso>/api/`, com nome idêntico ao da feature
do back-end. `GET /posts` → `find-list-posts.ts`.

```ts
// modules/posts/api/find-list-posts.ts
import 'server-only';
export const findListPosts = (params: FindListPostsParams) =>
  serverApi.get<Paginated<PostOutput>>('/posts', { params }); // Server Component

// modules/posts/api/find-list-posts.client.ts
('use client');
export const useFindListPosts = (params: FindListPostsParams) =>
  useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => clientApi.get<Paginated<PostOutput>>('/posts', { params }),
  });
```

**Quando é servidor e quando é cliente:**

| Situação                                     | Onde roda                                                                                                                                          |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primeira carga de lista ou detalhe           | **Server Component** (`serverApi`)                                                                                                                 |
| Paginação, busca e filtro na mesma tela      | **Cliente** — a URL muda, o Server Component re-renderiza via `searchParams`; só o que precisa ser instantâneo (busca com debounce) usa `useQuery` |
| Toda escrita (`POST`/`PATCH`/`PUT`/`DELETE`) | **Cliente**, via `useMutation` → `/api/v1/…`                                                                                                       |
| Bytes de imagem                              | `<img src="/api/v1/…">`, sem passar por JS                                                                                                         |

Regras:

- **Filtro e paginação vivem em `searchParams`**, nunca em estado local — a página sobrevive ao
  refresh e ao link compartilhado. Padrão `limit=20`, teto `100`.
- **Toda escrita invalida** as chaves do recurso e dos derivados, e chama `router.refresh()`
  quando a tela de origem é Server Component (é o que sincroniza os dois caches).
- **Mutação otimista só onde o custo do erro é zero:** reação. O resto espera a resposta.
- **Schema Zod do front espelha o do back**, inclusive `strictObject` no corpo de escrita e os
  `refine` cruzados (`audience: TURMA` exige `classIds` e recusa `studentIds`). O front não
  inventa regra nem afrouxa a do back.
- **`z.guid()`, nunca `z.uuid()`** — o back usa UUIDs sentinela que o `uuid()` do Zod 4 recusa.
- **`cache: 'no-store'` no `serverApi` por padrão.** Dado escolar é por usuário e por
  abrangência; cache compartilhado entre requisições é vazamento, não otimização.

---

## 6. Ambiente e execução

`.env.local` do front:

```
API_URL=http://localhost:3003/v1        # servidor apenas — NUNCA NEXT_PUBLIC_
SESSION_COOKIE_NAME=ZELO_APP_DEV        # precisa bater com o do back
NEXT_PUBLIC_UPLOAD_MAX_BYTES=10485760
```

Validado por Zod em `config/env.server.ts` e `config/env.public.ts` — variável faltando
**lança no boot**, como no back. São dois arquivos porque `server-only` contamina o módulo
inteiro; e o público lê `process.env.NEXT_PUBLIC_*` por acesso **literal**, que é o que o
Next inlina no bundle. As de
servidor ficam num objeto que importa `server-only`, então vazar uma delas para o cliente é
erro de build.

```bash
cd ../zelo && npm run db:up && npm run db:seed && npm run dev   # API em :3003
cd app-zelo && npm run dev                                      # Next em :3000
```

`http://localhost:3000` já está no `ALLOW_ORIGIN_LIST` do back — não é necessário para o BFF,
mas mantém a porta aberta para depuração direta.

---

## 7. Testes

| Camada         | Ferramenta      | O que cobre                                                           |
| -------------- | --------------- | --------------------------------------------------------------------- |
| Contrato       | MSW             | Handler por endpoint, devolvendo o **envelope real** da API           |
| Unidade        | Vitest          | `hasCapability`/`scopesOf`, formatadores, schemas Zod, o proxy do BFF |
| Componente     | Testing Library | Formulário com 400 mapeado, guard escondendo ação sem capability      |
| Fluxo          | Vitest + MSW    | Login → feed → criar rascunho → subir mídia → publicar                |
| Acessibilidade | `vitest-axe`    | Zero violação nas telas principais                                    |

Server Components são testados como função assíncrona (chamando e inspecionando a árvore
retornada), não pelo DOM. Não haverá E2E com navegador: o custo não se paga no recorte do TCC.

**Quando.** A suíte automatizada entra **de uma vez, depois da Fase 12**, e não fase a fase.
Decisão de 31/08/2026: com o contrato do back ainda sendo exercido pela primeira vez, mock
escrito cedo vira mock errado — a régua de cada fase é a API real em `:3003`. O item 1.10
(primeiro handler MSW) migrou para cá.

---

## 8. Fases

Cada fase termina com `npm run build` + `npm run lint` limpos e a tela exercitada contra a API
**real** rodando em `:3003` (não só contra o MSW).

### Fase 0 — Fundação e tooling ✅

**0.1** Scaffold: `npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir`,
Node 24 no `.nvmrc`.
**0.2** TypeScript estrito: `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, alias
`@/*` → `src/*`.
**0.3** ESLint 9 flat (`eslint-config-next` + `jsx-a11y`) + Prettier alinhado ao back-end.
**0.4** Husky + lint-staged + commitlint (Conventional Commits) — paridade com `../zelo`.
**0.5** Tokens de `:root` (§4.2) no `globals.css`, Tailwind 4 lendo deles; `next/font` com Inter.
**0.6** `config/env.server.ts` (com `server-only`) e `config/env.public.ts`, ambos validados
por Zod.
**0.7** `next.config.ts`: `output: 'standalone'`, `poweredByHeader: false`,
`experimental.proxyClientMaxBodySize: '12mb'` e headers de segurança (`X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Robots-Tag`).
**0.8** Estrutura de pastas da §2, vazia mas criada.
**0.9** Scripts de gate: `typecheck` (`next typegen && tsc --noEmit` — os tipos de rota do
Next são gerados, e sem o `typegen` o `tsc` sozinho não acha `LayoutProps`), `lint:eslint:*`,
`lint:prettier:*` e o `lint` que roda os três. Primeiro commit.

### Fase 1 — BFF, camada de API e contratos ✅

**1.1** `shared/api/server.ts` (`server-only`): fetch tipado para `API_URL`, lê o cookie com
`cookies()` e o encaminha, `cache: 'no-store'`, serialização de query omitindo `undefined`.
**1.2** `app/api/v1/[...path]/route.ts`: proxy catch-all para `GET|POST|PUT|PATCH|DELETE`,
encaminhando cookie, corpo (inclusive `multipart` em stream), `Content-Type`, status e
`Set-Cookie`. **Uma allowlist de prefixos de caminho** impede que o proxy vire encaminhador
aberto.
**1.3** `shared/api/client.ts` (`use client`): fetch para `/api/v1/…`, same-origin.
**1.4** `shared/api/errors.ts`: `ApiError` com `statusCode`, `error`, `message`, `cause`, e o
helper `fieldErrorsFrom(cause)` que converte as `issues` do Zod em `Record<campo, mensagem>`.
**1.5** Tratamento de **401** nos dois lados (§3.4).
**1.6** `shared/api/types.ts`: `Paginated<T>`, `Collection<T>`, `ApiErrorBody`.
**1.7** `shared/api/query-keys.ts`: fábrica hierárquica por recurso.
**1.8** `providers.tsx` com `QueryClient` (sem retry em 4xx, `staleTime` 30 s) e
`HydrationBoundary`.
**1.9** `config/features.ts`: as **79 capabilities** copiadas do enum do back.
**1.10** ~~MSW configurado com o primeiro handler (`/sessions`), provando o envelope.~~
**Adiado para a fase de testes** (§7): a suíte automatizada inteira entra no fim, e até lá a
verificação de cada fase é contra a API real em `:3003`.

### Fase 2 — Autenticação e autorização ✅

`POST /sessions` · `GET /sessions/current` · `DELETE /sessions/current`

**2.1** `app/api/auth/login/route.ts` e `logout/route.ts` com o repasse de `Set-Cookie` (§3.2).
**2.2** Tela de login em `(auth)/login`: e-mail + senha, 401 mostrado na tela (não em toast),
estado de envio, `autocomplete` correto, `?next=` respeitado no retorno.
**2.3** `proxy.ts` (o antigo `middleware.ts`): sem cookie → `/login?next=…`; com cookie → segue. Matcher excluindo
`/api`, `/_next` e estáticos.
**2.4** `(app)/layout.tsx` carrega `GET /sessions/current` no servidor e injeta no
`SessionProvider`. 401 aqui → `redirect('/login')`.
**2.5** `hasCapability` / `scopesOf` em `shared/auth/`, mais o hook `useCan` no cliente.
**2.6** `<RequireCapability>` para servidor e cliente. Usa `redirect('/403')`, e **não** o
`forbidden()` do Next: essa função ainda é canary (exige `experimental.authInterrupts`), e
não se apoia um TCC em API instável.
**2.7** Logout limpando o cache do Query por inteiro e o cookie.
**2.8** **Verificação:** login com os perfis do seed e URL fora do perfil caindo em `/403`. O
menu da §4.4 sai desta verificação: o `AppShell` é o passo 3.1, então a conferência do menu
por perfil acontece no fim da Fase 3.

### Fase 3 — Design system e shell ✅

**3.1** `AppShell`: cabeçalho com identidade e avatar, navegação lateral no desktop, barra
inferior no mobile, `skip-to-content`.
**3.2** Os componentes da §4.3, com estados de foco/erro/desabilitado e uma rota `/dev/ui`
disponível só fora de produção.
**3.3** `DataTable` paginado ligado a `searchParams`, com `EmptyState` e `ErrorState`.
**3.4** `Combobox` assíncrono com `useDebounce` — a base de todo seletor de aluno/pessoa/turma.
**3.5** Tema claro/escuro por cookie (sem flash) e `prefers-reduced-motion`.
**3.6** `loading.tsx` com skeleton em cada segmento de rota; `error.tsx` e `global-error.tsx`.

### Fase 4 — Feed e postagens ✅

`GET|POST /posts` · `GET|PATCH|DELETE /posts/:postId` · `POST /posts/:postId/publication` ·
`GET|POST /posts/:postId/comments` · `DELETE /posts/:postId/comments/:commentId` ·
`GET|POST /posts/:postId/media` · `GET|DELETE /posts/:postId/media/:mediaId` ·
`GET|PUT|DELETE /posts/:postId/reactions` · `GET /reaction-types`

**4.1** Feed como Server Component lendo `searchParams` (turma, aluno, tipo, status, página).
Cartão com autor, turma/alunos, tipo, data de referência, miniaturas, contagem de reação e
comentário. Rascunho com selo âmbar.
**4.2** Detalhe: galeria com lightbox e navegação por teclado, corpo completo.
**4.3** Composer (cliente) em três passos — audiência (`TURMA` × `ALUNO`, com as regras
cruzadas da §5), conteúdo, mídia. Salva rascunho a cada passo;
`POST /posts/:postId/publication` só no fim, com `AlertDialog`.
**4.4** Mídia: dropzone com validação de tipo/tamanho **antes** do upload, progresso, remoção,
ordenação.
**4.5** Comentários: lista paginada, criação, remoção. Remover comentário **de outro** abre
diálogo pedindo o `reason` (o back exige quando quem remove não é o autor); remover o próprio
não pede. Comentário removido aparece como "removido pela escola/pelo autor", nunca some.
**4.6** Reações: `GET /reaction-types` alimenta a barra; `PUT` faz upsert, `DELETE` remove.
Atualização otimista, com `mine` do resumo marcando a escolha do ator.
**4.7** **Verificação:** o ciclo completo como professor (criar → mídia → publicar) e a leitura
como responsável, confirmando que a família só enxerga a turma do filho.

### Fase 5 — Agenda do aluno ✅

`GET|POST /students/:studentId/journal` · `PATCH|DELETE /students/:studentId/journal/:entryId`

**5.1** Linha do tempo por dia, com filtro de data em `?date=`.
**5.2** Composição de entrada, incluindo **resposta** (`repliesToId`) — a conversa
escola↔família sobre a criança, indentada sob a entrada original.
**5.3** Edição (`PATCH`) mostrando "editado em"; remoção com `reason` opcional e o mesmo
tratamento de tombstone da §4.5.
**5.4** **Verificação:** professor escreve, responsável responde, ambos veem o fio.

### Fase 6 — Turmas, alunos e matrículas ✅

`GET|POST /classes` · `GET|PATCH|DELETE /classes/:classId` ·
`GET|POST /students` · `GET|PATCH|DELETE /students/:studentId` ·
`GET|POST /enrollments` · `DELETE /enrollments/:enrollmentId`

**6.1** Lista de turmas (filtro por ano letivo e turno) com contagem de alunos.
**6.2** Detalhe da turma em abas paralelas do App Router: Alunos · Professores · Postagens ·
Consentimentos.
**6.3** Lista de alunos com busca, filtro por turma e por ativo; foto pelo proxy.
**6.4** Visão geral do aluno: dados, turma vigente, responsáveis, atalhos para agenda,
consentimentos e relatórios.
**6.5** Matrícula: criar (aluno + turma + data) e encerrar. O `DELETE` **encerra a vigência**,
não apaga — a UI diz "encerrar matrícula", nunca "excluir".
**6.6** Excluir turma exibe o motivo da recusa quando há matrícula vigente (409 do back).

### Fase 7 — Pessoas, papéis e usuários ✅

`GET|POST /people` · `GET|PATCH /people/:personId` ·
`GET|PUT|DELETE /people/:personId/photo` ·
`GET|POST /guardians` · `GET|PATCH /guardians/:guardianId` ·
`GET|POST /teachers` · `GET|PATCH /teachers/:teacherId` ·
`GET|POST /users` · `GET|PATCH|DELETE /users/:userId`

**7.1** Busca de pessoas por nome e **por CPF** (com e sem máscara), com o filtro `role=none`
em destaque — é ele que fecha o cadastro em duas etapas, achando quem ficou sem papel.
**7.2** Formulário de pessoa com validação de CPF no cliente (mesmo algoritmo do back) e campos
anuláveis de propósito (apagar telefone errado é correção legítima).
**7.3** Fluxo em duas etapas explícito na UI: criar pessoa → atribuir papel (aluno /
responsável / professor). O passo dois é oferecido logo após o um.
**7.4** Foto de perfil: recorte quadrado no cliente, `PUT` como `multipart` no campo `file`,
remoção. Todo usuário troca **a própria** foto — inclusive o responsável, que não pode editar
cadastro de pessoa.
**7.5** Responsável: preferências de notificação (`receiveEmail`, `receivePush`) — e só isso;
nome e contato mudam pela pessoa, e a tela diz isso em vez de duplicar campo.
**7.6** Professor: matrícula funcional, formação, ativo.
**7.7** Conta de acesso: criar (pessoa + e-mail + senha ≥ 8), trocar e-mail/senha, ativar e
desativar. Medidor de força de senha; a lista mostra perfis e último acesso.

### Fase 8 — Vínculos e acessos ✅

`GET|POST /guardian-links` · `PATCH|DELETE /guardian-links/:linkId` ·
`GET|POST /teacher-links` · `DELETE /teacher-links/:linkId` ·
`GET|POST /class-accesses` · `DELETE /class-accesses/:accessId`

**8.1** Vínculo responsável↔aluno: parentesco, `canConsent` e `financial`. A UI **explica** que
`canConsent` nasce `false` — assinar LGPD pela criança é decisão explícita, não consequência de
ser responsável.
**8.2** Vínculo professor↔turma com a função (`TITULAR`/`AUXILIAR`/`VOLANTE`).
**8.3** Acesso a turma: motivo + justificativa. A tela deixa claro que é **decisão
administrativa auditada** — encerrar não apaga, e a trilha responde "quem viu o quê, por quê e
a mando de quem".
**8.4** As três telas têm filtro `active=true|false` e mostram o histórico encerrado em tom
secundário. Trocar responsável ou aluno não é editar: é encerrar e criar outro.

### Fase 9 — Consentimento (LGPD) ✅

`GET|POST /students/:studentId/consents` · `DELETE /students/:studentId/consents/:consentId` ·
`GET /classes/:classId/consents`

**9.1** Painel do aluno: os três tipos com o estado vigente, origem e data de início; histórico
completo abaixo, cada linha um fato datado.
**9.2** Registrar consentimento: tipo, concedido/negado, origem, responsável signatário. Origem
`SOLICITACAO_VERBAL` **exige** o documento comprobatório — o formulário revela o campo e o
torna obrigatório quando a origem é escolhida.
**9.3** Revogar com `AlertDialog` explicando a consequência: a revogação encerra a vigência e
entra no histórico; ela não apaga o que já foi publicado.
**9.4** Painel da turma: uma linha por criança, três colunas de estado, contadores no topo e
filtro "sem consentimento" — é a tela que a coordenação usa antes de autorizar um evento.
**9.5** Selo de consentimento no perfil do aluno e ao lado do seletor de aluno no composer,
para o professor ver **antes** de publicar imagem.

### Fase 10 — Relatórios e modelos ✅

`GET|POST /reports` · `GET|PATCH|DELETE /reports/:reportId` ·
`POST /reports/:reportId/publication` ·
`GET|POST /report-templates` · `GET|PATCH|DELETE /report-templates/:templateId`

**10.1** Lista de relatórios com filtro por aluno, turma e status.
**10.2** Editor: as **sete dimensões** com `LevelPicker` de quatro níveis + observação por
dimensão, mais a síntese. Salvamento automático em rascunho.
**10.3** Partir de um modelo (`templateId`) preenche níveis e observações de saída.
**10.4** Publicar com confirmação — publicado, a família passa a ver.
**10.5** CRUD de modelos, com aviso de dimensão repetida (a regra do back) já no cliente.
**10.6** Visão do responsável: leitura, sem edição, com os níveis explicados em linguagem
simples ("Em desenvolvimento" com uma frase do que significa).
**10.7** Impressão: folha de estilo `@media print` para o relatório sair em PDF pelo navegador,
sem dependência nova.

### Fase 11 — Administração e perfis ✅

`GET|POST /roles` · `GET|PATCH /roles/:roleId` ·
`GET|POST /role-grants` · `DELETE /role-grants/:grantId` ·
`GET|POST /school-years` · `GET|PATCH|DELETE /school-years/:schoolYearId`

**11.1** Anos letivos com validação de intervalo (fim > início) e contagem de turmas.
**11.2** Lista de perfis, marcando os **de sistema** como não editáveis — perfil de sistema
nasce de migration, não da API.
**11.3** Editor de permissões: matriz recurso × ação, com seletor de abrangência
(`PROPRIA`/`TURMA`/`ESCOLA`) por linha. A gravação **substitui** o conjunto inteiro — a UI diz
isso, porque sem substituição não haveria como remover permissão.
**11.4** Concessões de perfil: conceder a um usuário, revogar (encerra vigência), filtro `active`.
**11.5** **Verificação:** criar um perfil "Secretaria" pela UI, conceder a um usuário, entrar
com ele e confirmar que o menu da §4.4 se monta sozinho a partir das capabilities.

### Fase 12 — Acessibilidade e polimento ✅

**12.1** Auditoria `vitest-axe` + teclado em todas as telas principais; zero violação.
**12.2** Skeletons via `loading.tsx` em todo segmento; `EmptyState` com texto específico.
**12.3** Revisão de microcopy inteira contra o princípio 5 da §4.1.
**12.4** Responsividade conferida em 360 / 768 / 1280 px.
**12.5** Performance: orçamento de **< 250 kB gzip** de JS no feed; auditoria do que virou
Client Component sem precisar; `<img loading="lazy">` com dimensões declaradas.
**Revisado em 02/09/2026:** o piso do framework é 207 kB — ver o registro da fase.
**12.6** `error.tsx` por segmento, `not-found.tsx` e `403/page.tsx` com texto próprio.
**12.7** Metadata (`generateMetadata`) com título por rota, e `robots: noindex` — sistema atrás
de login não vai para buscador.
**12.8** Estado offline: banner quando `navigator.onLine` cai, e mutação bloqueada com aviso.

### Fase 13 — Build, deploy e docs ⬜

**13.1** `npm run build` + `npm start` conferidos contra a API real.
**13.2** `Dockerfile` multi-stage usando `output: 'standalone'`, e serviço no `compose.yaml` do
back — front, API, Postgres e Mongo subindo com um comando.
**13.3** `README.md`: como subir os dois projetos, variáveis, perfis do seed.
**13.4** `CLAUDE.md` do front — as convenções da §2 e §5 escritas como regra, no espírito do
CLAUDE.md do back.
**13.5** Passada final na matriz da §9: nenhuma linha sem tela.

---

## 9. Matriz de cobertura

As 93 rotas da API e onde cada uma é consumida. **É o critério de conclusão do plano.**

### sessions (3)

| Método | Rota                | Fase | Tela                          |
| ------ | ------------------- | ---- | ----------------------------- |
| POST   | `/sessions`         | 2    | Login (via `/api/auth/login`) |
| GET    | `/sessions/current` | 2    | `(app)/layout.tsx`            |
| DELETE | `/sessions/current` | 2    | Menu do usuário               |

### posts (15)

| Método | Rota                                 | Fase | Tela                   |
| ------ | ------------------------------------ | ---- | ---------------------- |
| GET    | `/posts`                             | 4    | Feed                   |
| POST   | `/posts`                             | 4    | Composer               |
| GET    | `/posts/:postId`                     | 4    | Detalhe                |
| PATCH  | `/posts/:postId`                     | 4    | Composer (rascunho)    |
| DELETE | `/posts/:postId`                     | 4    | Detalhe · menu         |
| POST   | `/posts/:postId/publication`         | 4    | Composer · confirmação |
| GET    | `/posts/:postId/comments`            | 4    | Detalhe · comentários  |
| POST   | `/posts/:postId/comments`            | 4    | Detalhe · comentários  |
| DELETE | `/posts/:postId/comments/:commentId` | 4    | Comentário · menu      |
| GET    | `/posts/:postId/media`               | 4    | Detalhe · galeria      |
| POST   | `/posts/:postId/media`               | 4    | Composer · dropzone    |
| GET    | `/posts/:postId/media/:mediaId`      | 4    | `<img>` via proxy      |
| DELETE | `/posts/:postId/media/:mediaId`      | 4    | Composer · mídia       |
| GET    | `/posts/:postId/reactions`           | 4    | Cartão e detalhe       |
| PUT    | `/posts/:postId/reactions`           | 4    | Barra de reação        |
| DELETE | `/posts/:postId/reactions`           | 4    | Barra de reação        |

### reaction-types (1)

| Método | Rota              | Fase | Tela            |
| ------ | ----------------- | ---- | --------------- |
| GET    | `/reaction-types` | 4    | Barra de reação |

### students (12)

| Método | Rota                                       | Fase | Tela                    |
| ------ | ------------------------------------------ | ---- | ----------------------- |
| GET    | `/students`                                | 6    | Lista de alunos         |
| POST   | `/students`                                | 6/7  | Cadastro etapa 2        |
| GET    | `/students/:studentId`                     | 6    | Visão geral do aluno    |
| PATCH  | `/students/:studentId`                     | 6    | Edição do aluno         |
| DELETE | `/students/:studentId`                     | 6    | Aluno · menu            |
| GET    | `/students/:studentId/journal`             | 5    | Agenda                  |
| POST   | `/students/:studentId/journal`             | 5    | Agenda · composição     |
| PATCH  | `/students/:studentId/journal/:entryId`    | 5    | Agenda · edição         |
| DELETE | `/students/:studentId/journal/:entryId`    | 5    | Agenda · remoção        |
| GET    | `/students/:studentId/consents`            | 9    | Consentimentos do aluno |
| POST   | `/students/:studentId/consents`            | 9    | Registrar consentimento |
| DELETE | `/students/:studentId/consents/:consentId` | 9    | Revogar consentimento   |

### classes (6)

| Método | Rota                         | Fase | Tela                    |
| ------ | ---------------------------- | ---- | ----------------------- |
| GET    | `/classes`                   | 6    | Lista de turmas         |
| POST   | `/classes`                   | 6    | Nova turma              |
| GET    | `/classes/:classId`          | 6    | Detalhe da turma        |
| PATCH  | `/classes/:classId`          | 6    | Edição da turma         |
| DELETE | `/classes/:classId`          | 6    | Turma · menu            |
| GET    | `/classes/:classId/consents` | 9    | Painel de consentimento |

### people (7)

| Método | Rota                      | Fase | Tela                   |
| ------ | ------------------------- | ---- | ---------------------- |
| GET    | `/people`                 | 7    | Busca de pessoas       |
| POST   | `/people`                 | 7    | Cadastro etapa 1       |
| GET    | `/people/:personId`       | 7    | Ficha da pessoa        |
| PATCH  | `/people/:personId`       | 7    | Edição da pessoa       |
| GET    | `/people/:personId/photo` | 7    | `Avatar` via proxy     |
| PUT    | `/people/:personId/photo` | 7    | Foto · recorte e envio |
| DELETE | `/people/:personId/photo` | 7    | Foto · remover         |

### guardians (4) · teachers (4) · users (5)

| Método | Rota                     | Fase | Tela                        |
| ------ | ------------------------ | ---- | --------------------------- |
| GET    | `/guardians`             | 7    | Lista de responsáveis       |
| POST   | `/guardians`             | 7    | Cadastro etapa 2            |
| GET    | `/guardians/:guardianId` | 7    | Ficha do responsável        |
| PATCH  | `/guardians/:guardianId` | 7    | Preferências de notificação |
| GET    | `/teachers`              | 7    | Lista de professores        |
| POST   | `/teachers`              | 7    | Cadastro etapa 2            |
| GET    | `/teachers/:teacherId`   | 7    | Ficha do professor          |
| PATCH  | `/teachers/:teacherId`   | 7    | Edição do professor         |
| GET    | `/users`                 | 7    | Contas de acesso            |
| POST   | `/users`                 | 7    | Nova conta                  |
| GET    | `/users/:userId`         | 7    | Detalhe da conta            |
| PATCH  | `/users/:userId`         | 7    | E-mail, senha, ativo        |
| DELETE | `/users/:userId`         | 7    | Conta · desativar           |

### enrollments (3) · guardian-links (4) · teacher-links (3) · class-accesses (3)

| Método | Rota                         | Fase | Tela                       |
| ------ | ---------------------------- | ---- | -------------------------- |
| GET    | `/enrollments`               | 6    | Matrículas                 |
| POST   | `/enrollments`               | 6    | Matricular aluno           |
| DELETE | `/enrollments/:enrollmentId` | 6    | Encerrar matrícula         |
| GET    | `/guardian-links`            | 8    | Vínculos responsável↔aluno |
| POST   | `/guardian-links`            | 8    | Novo vínculo               |
| PATCH  | `/guardian-links/:linkId`    | 8    | Parentesco e permissões    |
| DELETE | `/guardian-links/:linkId`    | 8    | Encerrar vínculo           |
| GET    | `/teacher-links`             | 8    | Vínculos professor↔turma   |
| POST   | `/teacher-links`             | 8    | Novo vínculo               |
| DELETE | `/teacher-links/:linkId`     | 8    | Encerrar vínculo           |
| GET    | `/class-accesses`            | 8    | Acessos a turma            |
| POST   | `/class-accesses`            | 8    | Conceder acesso            |
| DELETE | `/class-accesses/:accessId`  | 8    | Encerrar acesso            |

### reports (6) · report-templates (5)

| Método | Rota                             | Fase | Tela                |
| ------ | -------------------------------- | ---- | ------------------- |
| GET    | `/reports`                       | 10   | Lista de relatórios |
| POST   | `/reports`                       | 10   | Novo relatório      |
| GET    | `/reports/:reportId`             | 10   | Editor / leitura    |
| PATCH  | `/reports/:reportId`             | 10   | Editor              |
| DELETE | `/reports/:reportId`             | 10   | Relatório · menu    |
| POST   | `/reports/:reportId/publication` | 10   | Publicar            |
| GET    | `/report-templates`              | 10   | Lista de modelos    |
| POST   | `/report-templates`              | 10   | Novo modelo         |
| GET    | `/report-templates/:templateId`  | 10   | Detalhe do modelo   |
| PATCH  | `/report-templates/:templateId`  | 10   | Edição do modelo    |
| DELETE | `/report-templates/:templateId`  | 10   | Modelo · menu       |

### roles (4) · role-grants (3) · school-years (5)

| Método | Rota                          | Fase | Tela                 |
| ------ | ----------------------------- | ---- | -------------------- |
| GET    | `/roles`                      | 11   | Perfis               |
| POST   | `/roles`                      | 11   | Novo perfil          |
| GET    | `/roles/:roleId`              | 11   | Editor de permissões |
| PATCH  | `/roles/:roleId`              | 11   | Editor de permissões |
| GET    | `/role-grants`                | 11   | Concessões           |
| POST   | `/role-grants`                | 11   | Conceder perfil      |
| DELETE | `/role-grants/:grantId`       | 11   | Revogar concessão    |
| GET    | `/school-years`               | 11   | Anos letivos         |
| POST   | `/school-years`               | 11   | Novo ano letivo      |
| GET    | `/school-years/:schoolYearId` | 11   | Detalhe do ano       |
| PATCH  | `/school-years/:schoolYearId` | 11   | Edição do ano        |
| DELETE | `/school-years/:schoolYearId` | 11   | Ano · excluir        |

**Total: 93 rotas · 93 cobertas.**

---

## 10. Riscos e pontos de atenção

| Risco                                                                                                                                     | Mitigação                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O proxy catch-all vira encaminhador aberto para a rede interna                                                                            | Allowlist de prefixos de caminho e de métodos no Route Handler; nada de host vindo do cliente. Item **1.2**, e o `lint:security` do back é a referência de rigor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Set-Cookie` não atravessa o BFF se o back passar a definir `SESSION_COOKIE_DOMAIN`                                                       | Em dev o domínio fica vazio e funciona. Em produção, ou o cookie fica sem `Domain`, ou o Next reescreve o header. Verificado no item **2.1**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `PUBLIC_URL` do back aponta para `:3000/v1`, mas a API escuta em `:3003`                                                                  | O front usa `API_URL` explícito. Se alguma resposta trouxer URL montada a partir de `PUBLIC_URL`, corrigir o `.env` do back — `TODO(env)`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `next/image` levaria 401 em mídia autenticada                                                                                             | `<img>` simples para mídia; `next/image` só para asset estático (§3.6).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Sem CSRF token no back — e o BFF torna o cookie **first-party**, o que amplia a superfície                                                | Registrar como limitação no texto do TCC. Mitigação prática: o proxy recusa requisição sem header `Origin`/`Sec-Fetch-Site` de mesma origem em métodos de escrita.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Divergência silenciosa entre schema Zod do front e do back                                                                                | Handlers MSW copiados dos DTOs reais; teste de contrato quebra quando divergem.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Escopo `TURMA` mal aplicado deixa a família ver turma alheia                                                                              | Quem filtra é o back. O front **nunca** monta filtro de segurança — só de conveniência. Verificação por perfil ao fim das fases 4, 5 e 9.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Cache do Next servindo dado de um usuário para outro                                                                                      | `cache: 'no-store'` por padrão no `serverApi`, e nenhuma rota autenticada marcada como estática. É o risco mais grave da stack — vale um teste dedicado.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Client Component demais engorda o bundle                                                                                                  | Auditoria na Fase 12; `'use client'` sempre o mais fundo possível na árvore (§2, regra 3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Fase 11 (matriz de permissões) é a tela mais complexa do sistema                                                                          | Vem por último, quando o design system já está maduro; começa como tabela simples e só depois vira matriz.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `proxyClientMaxBodySize` **trunca o corpo em silêncio** ao estourar (não devolve erro), e o padrão do Next é 10 MB — igual ao teto da API | Configurado em `12mb`, dando folga para o envelope multipart. Um upload de 10 MB não pode chegar cortado à API e virar "imagem inválida".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| CSP ainda não existe                                                                                                                      | Sem nonce só sairia uma política com `unsafe-inline`, que o Next exige para hidratar. Fica como `TODO(csp)` no `next.config.ts`, para a Fase 12 fazer com nonce via `proxy.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Consentimento revogado × mídia já publicada                                                                                               | A UI **não** promete apagar o passado: o texto do diálogo diz que a revogação vale daqui pra frente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Sujeira de teste no banco de dev, deixada pela verificação das fases                                                                      | `TODO(seed)`: sobraram da Fase 6 a pessoa `Laura Teste` e a matrícula encerrada do Théo na Maternal II B; da Fase 7, a pessoa `Marina da Silva`, com papel de responsável e conta `marina.silva@zelo.test`; da Fase 8, três vigências encerradas — vínculo Marina↔Helena, vínculo Ana↔Maternal II B e acesso da Marina à Maternal II B; da Fase 9, um consentimento de uso externo da imagem da Helena, criado e revogado no mesmo minuto; da Fase 10, um relatório publicado da Helena para agosto de 2026 — publicado não se remove, que é justamente a regra que a verificação confirmou; da Fase 11, o perfil `SECRETARIA` com duas permissões e a concessão encerrada dele para o Fábio, porque a API não tem `DELETE /roles`. O estado **vigente** bate com o seed; o que sobra é histórico, que a API não apaga de propósito. Recriar o banco e rodar `npm run db:seed` antes de gerar print para o TCC. |

---

## 11. Ordem de execução

Fases 0 → 3 são pré-requisito de tudo. Depois delas, 4 e 5 são as que provam o produto (é o
que a família e o professor usam todo dia). 6 → 8 abrem o cadastro. 9 → 11 fecham o
diferencial do TCC (LGPD, desenvolvimento infantil, autorização granular). 12 e 13 acabam.

Cada fase termina com: build limpo, lint limpo, tela exercitada contra a API real, linha da
tabela de "Estado atual" atualizada e commit em Conventional Commits. A suíte de testes vem
depois da 12, num bloco só (§7).

---

## 12. Registro de execução

O que cada fase realmente entregou, e onde a realidade divergiu do plano. Serve de matéria
para o texto do TCC — decisão sem rastro é decisão perdida.

### Fase 0 — Fundação e tooling ✅ (31/08/2026)

**Entregue.** Scaffold `create-next-app` (App Router, `src/`, Tailwind 4, alias `@/*`);
TypeScript estrito; ESLint 9 flat com `eslint-config-next` + `jsx-a11y` + Prettier na config do
back; Husky com `pre-commit` (lint-staged), `commit-msg` (commitlint) e `pre-push` (typecheck);
tokens de tema em `globals.css`; Inter por `next/font`; `env.server.ts` / `env.public.ts`;
`next.config.ts` com `standalone` e headers de segurança; a árvore de pastas da §2; o helper
`cn`.

**Verificação.** `npm run typecheck`, `lint:eslint:check`, `lint:prettier:check` e
`npm run build` limpos. `npm start` sobe e responde `200` com `lang="pt-BR"`, os cinco headers
de segurança presentes, `Cache-Control: private, no-store` (a página é dinâmica porque o layout
lê o cookie do tema), sem `X-Powered-By`, e o CSS servido carrega `--brand: #2f6f62` no claro e
`#5fae9c` no escuro, com os blocos `prefers-color-scheme` e `prefers-reduced-motion`.

**Divergências encontradas — todas por causa do Next 16, não do plano:**

1. **`middleware.ts` chama-se `proxy.ts`.** Renomeado na 16; a função é a mesma. Corrigido na
   §2, §3.5 e no passo 2.3.
2. **`forbidden()` e `forbidden.tsx` são canary.** Exigem `experimental.authInterrupts`. O
   plano passou a usar uma rota `/403` comum — API estável vale mais que açúcar sintático.
3. **`tsc --noEmit` sozinho não typecheca.** `LayoutProps<'/'>` e afins são tipos **gerados**;
   sem `next typegen` antes, o `tsc` acusa `Cannot find name 'LayoutProps'`. O script de
   typecheck virou `next typegen && tsc --noEmit`, que é o que a própria doc recomenda.
4. **`noPropertyAccessFromIndexSignature` foi descartada.** Ela obriga
   `process.env['NEXT_PUBLIC_X']`, e o inlining do Next só acontece no acesso **literal com
   ponto**. Entre a flag estilística e a exigência do bundler, saiu a flag.
5. **Não há limite de corpo a configurar em Route Handler** (isso era Pages Router). O que
   existe é `experimental.proxyClientMaxBodySize`, com padrão de 10 MB e truncamento
   silencioso — daí os `12mb` de folga.
6. **`eslint-config-next` já registra o plugin `jsx-a11y`.** Espalhar
   `jsxA11y.flatConfigs.recommended` dá `Cannot redefine plugin`; o jeito é reaproveitar só o
   `.rules` dele.

**Decisões registradas.**

- A regra 1 da §2 ("nenhum `fetch` fora de `shared/api/`") virou lint: `no-restricted-globals`
  sobre `fetch`, com `src/shared/api/**` como única exceção. Convenção que o compilador não
  cobra é convenção que apodrece.
- O âmbar `--accent` **não passa** em 4.5:1 sobre branco (fica em 2.16:1). Ele é cor de fundo
  de selo, com `--on-accent` por cima — a régua está escrita no próprio `globals.css`, onde
  quem for usar vai ler.
- O tema sai de cookie lido no `RootLayout`, e não de `localStorage`. O custo é a raiz virar
  dinâmica; o ganho é não piscar no tema errado na primeira pintura.

### Fase 1 — BFF, camada de API e contratos ✅ (31/08/2026)

**Entregue.** `shared/api/` com `types.ts` (`Paginated<T>`, `Collection<T>`, `ApiErrorBody`,
`ValidationIssue`), `errors.ts` (`ApiError` + `fieldErrorsFrom` + `networkError`),
`query-string.ts` (omite `undefined`/`null`, repete a chave em array, `Date` → ISO),
`allowed-paths.ts` (allowlist de prefixos e sanitização de segmento), `server.ts`
(`server-only`, encaminha o cookie lido por `cookies()`, `cache: 'no-store'`), `client.ts`
(`client-only`, same-origin, aceita `FormData`), `proxy.ts` (o encaminhamento de verdade) e
`query-keys.ts` (fábrica hierárquica dos 18 recursos). Mais
`app/api/v1/[...path]/route.ts`, `app/providers.tsx` com o `QueryClient`,
`shared/api/hydrate.tsx` com o `HydrationBoundary`, e `config/features.ts` com as 79
capabilities.

**Verificação.** Contra a API real em `:3003`, com o seed `demo.sql` (`ana@zelo.test`):
`npm run lint` e `npm run build` limpos. Pelo proxy: prefixo fora da allowlist → `404`;
`/api/v1/posts/../../../etc/passwd` → `404`; `PROPFIND` → `400`; sem cookie → o `401` da API
atravessa; `POST /api/v1/sessions` → `201` e o `Set-Cookie` grava `ZELO_APP_DEV` no domínio do
Next; `GET /api/v1/sessions/current` devolve `permissions` no formato de três segmentos;
`GET /api/v1/posts?page=1&limit=2` devolve o envelope paginado com `totalPages` do banco;
`POST /api/v1/posts` inválido devolve `cause` com as `issues` do Zod (`path: ['audience']`),
que é o que o `fieldErrorsFrom` consome. Pelo `serverApi`, num Route Handler descartável: com
sessão, `200` com os dados; sem sessão, `307` para `/login`. O caminho de bytes foi provado
subindo um PNG de 70 bytes por `multipart` (`PUT /people/:id/photo` → `200`), lendo de volta
(`200`, `image/png`, `content-length: 70`, `Cache-Control: private, max-age=300`, bytes
idênticos) e removendo em seguida (`204`, depois `404`) — o seed ficou como estava.

**Divergências encontradas.**

1. **O proxy não podia morar inteiro no `route.ts`.** A regra 1 da §2 virou
   `no-restricted-globals` sobre `fetch` na Fase 0, com `src/shared/api/**` como única
   exceção — e o Route Handler bateu nela. O encaminhamento foi para `shared/api/proxy.ts`
   (`server-only`) e o `route.ts` ficou com os cinco exports e a leitura do `params`, que é o
   que a regra 2 da §2 já queria.
2. **A allowlist de métodos, na prática, é a lista de exports.** O Next implementa `HEAD` e
   `OPTIONS` sozinho: `HEAD` cai no handler do `GET` (leitura, inofensivo) e um método
   desconhecido como `PROPFIND` morre em `400` antes de chegar ao arquivo.
3. **`duplex: 'half'` não existe no `RequestInit` do TypeScript**, mas o undici exige quando o
   corpo é `ReadableStream`. Daí o `as RequestInit` no `fetch` do proxy — sem ele, upload
   `multipart` não sai.
4. **`redirect()` funciona também dentro de Route Handler**: o `401` do `server.ts` virou `307`
   com `Location: /login`, e não uma exceção vazando.

**Decisões registradas.**

- **Não existe `shared/api/index.ts`.** `server.ts` importa `server-only` e `client.ts`
  importa `client-only`; um barril que reexportasse os dois quebraria os dois lados. Cada
  import é pelo arquivo.
- **O `?next=` do 401 de servidor ficou como `TODO(fase-2)`.** O pathname atual não é legível
  de dentro do `serverApi`; quem vai plantá-lo num header é o `proxy.ts` do passo 2.3.
- **O 401 do cliente navega com `window.location.assign`**, com `eslint-disable` da regra do
  Next. É navegação dura de propósito: é ela que joga fora o cache do TanStack Query junto com
  o documento. `router.push` deixaria sessão morta em memória.
- **A allowlist é de prefixo de recurso** — os 18 do back — mais recusa de segmento vazio,
  `.`, `..` ou com barra invertida, e `encodeURIComponent` em cada segmento.
- **`sessions` ficou na allowlist.** É o que torna `GET /sessions/current` alcançável do
  cliente. `POST /sessions` também passa por ali, mas faz exatamente o que
  `/api/auth/login` fará na Fase 2 — mesmo repasse de `Set-Cookie`, mesma origem. Não é
  brecha; a rota de auth existe para dar nome e validação ao fluxo, não para ser o único
  caminho fisicamente possível.
- **`Cache-Control` da resposta do proxy:** o do upstream passa, a menos que contenha
  `public` — nesse caso vira `private, no-store`. É a §3.6 escrita em código, e não em
  comentário.
- **Falha de rede vira `ApiError(502, 'ServiceError')`** nos dois lados e no proxy, para que a
  UI tenha um caminho de erro só, com o mesmo envelope da API.

### Fase 2 — Autenticação e autorização ✅ (31/08/2026)

**Entregue.** `modules/sessions/` com `types.ts`, `schemas/create-session.ts` (espelho
`strictObject` do back) e `api/find-current-session.ts`. `shared/auth/` com `session.ts`,
`capabilities.ts` (`scopesOf`, `hasCapability`, `widestScope`, `isInClass`),
`current-session.ts` (`cache()` sobre `GET /sessions/current`), `session-context.tsx`
(`SessionProvider`, `useSession`, `useCan`, `useScopesOf`, `useWidestScope`, `<Can>`) e
`require-capability.tsx`. `app/api/auth/login/route.ts` e `logout/route.ts` com o repasse do
`Set-Cookie`. `src/proxy.ts`. Tela `(auth)/login` com React Hook Form + Zod. `(app)/layout.tsx`
injetando a sessão, `(app)/page.tsx` provisória e `app/403/page.tsx`. Mais
`shared/i18n/pt-BR.ts`, estreando com os textos de autenticação.

**Verificação.** `npm run lint` e `npm run build` limpos. Contra a API em `:3003`: sem cookie,
`/` devolve `307 → /login?next=%2F` e `/students/abc?tab=journal` devolve
`307 → /login?next=%2Fstudents%2Fabc%3Ftab%3Djournal`; `/login` responde `200`. Senha errada
devolve `401` **sem** `Set-Cookie`; corpo inválido devolve `400` com as `issues` nos dois
campos. Login dos perfis do seed (senha `zelo123`), com a sessão lida no servidor:

| Usuário            | Perfil        | Turmas no escopo | Concessões |
| ------------------ | ------------- | ---------------- | ---------- |
| `ana@zelo.test`    | PROFESSOR     | 1                | 36         |
| `bruno@zelo.test`  | RESPONSAVEL   | 1                | 19         |
| `diana@zelo.test`  | COORDENACAO   | 1                | 74         |
| `isabel@zelo.test` | ADMINISTRADOR | 0                | 79         |
| `fabio@zelo.test`  | (sem perfil)  | 0                | 0          |

Numa rota descartável guardada por `RequireCapability feature={Feature.RoleView}`: Diana e
Isabel entram (`200`), Ana, Bruno e Fábio caem em `/403`. Logout devolve `204` repassando
`ZELO_APP_DEV=invalid; Max-Age=-1`, e a requisição seguinte volta a ser barrada pelo proxy.
Com cookie **inválido** o proxy deixa passar (ele só olha presença) e é o `serverApi` que pega
o `401` e monta `307 → /login?next=%2Fguard-check` — que é a prova de que o header de pathname
plantado pelo proxy chega ao servidor.

**Divergências encontradas.**

1. **O seed não tinha persona ADMINISTRADOR — e passou a ter.** `demo.sql` concedia
   `PROFESSOR`, `RESPONSAVEL` e `COORDENACAO`, e deixava Fábio **sem perfil nenhum**, de
   propósito, para exercitar o 403. O perfil `ADMINISTRADOR` existia (migration 007) e tinha
   um único portador: o usuário de bootstrap da migration 004 — login `admin`, senha `admin`,
   sem formato de e-mail. Conta de sistema não é persona de demonstração, então o seed ganhou
   **Isabel Prado** (`isabel@zelo.test`, senha `zelo123`, CPF `10888888872`), com
   `ADMINISTRADOR`. As 79 concessões que ela recebe são o catálogo inteiro — o que também
   confere, de lado, que o espelho em `config/features.ts` não perdeu nem inventou capability.
   Foi a única alteração feita em `../zelo` até aqui.
2. **O menu da §4.4 saiu da verificação da Fase 2.** O `AppShell` é o passo 3.1: não havia o
   que conferir. A checagem de menu por perfil foi para o fim da Fase 3.
3. **`app/page.tsx` teve de sair.** O route group `(app)` não acrescenta segmento, então
   `app/page.tsx` e `app/(app)/page.tsx` disputam a mesma rota `/`. A página de fundação da
   Fase 0 foi substituída pela de dentro do grupo.
4. **Trocar a árvore de rotas exige apagar o `.next`.** Depois de remover `app/page.tsx`, o
   `next typegen` continuou emitindo um `validator.ts` que importava o arquivo morto
   (`TS2307`). `rm -rf .next` resolve; o typegen não invalida o que já gerou.

**Decisões registradas.**

- **O guard do cliente esconde, não redireciona.** `<RequireCapability>` (servidor) manda para
  `/403`; no cliente o que existe é `<Can>`, que troca o filho por um fallback. A §3.5 diz que
  o guard do front existe para **não oferecer** caminho que termina em 403 — redirecionar
  depois de já ter desenhado o botão seria descobrir tarde demais.
- **O `?next=` do 401 de servidor saiu do `TODO` da Fase 1.** O `proxy.ts` planta
  `x-zelo-pathname` no header da requisição (`NextResponse.next({ request: { headers } })`) e
  o `server.ts` o lê com `headers()`. Sem o header — Route Handler, que o matcher exclui — o
  destino é `/login` puro.
- **O proxy não redireciona quem já tem cookie para fora de `/login`.** Seria o atalho óbvio,
  e é uma armadilha: cookie expirado passa pelo proxy, o layout leva 401 e manda para
  `/login`, que o proxy devolveria para `/` — laço infinito. Quem decide se a sessão vale é o
  servidor, uma vez só.
- **`?next=` é sanitizado antes de navegar:** só caminho começando por `/` e que não comece
  por `//`. Sem isso o parâmetro vira redirecionamento aberto para outro domínio.
- **O login não passa pelo `clientApi`.** `authApi` fala com `/api/auth/*` e desliga o
  redirecionamento automático de 401 — na tela de login, `401` é "senha errada", não "sessão
  perdida", e mandar para `/login` quem já está em `/login` apagaria a mensagem de erro.
- **O logout limpa o `QueryClient` inteiro** (`queryClient.clear()`) antes de navegar, e o
  Route Handler apaga o cookie por conta própria quando a API responde sem `Set-Cookie` (o
  caso de sessão já expirada).
- **`(app)/page.tsx` é provisória.** Hoje mostra perfis, turmas no escopo e número de
  concessões — é a superfície que tornou a Fase 2 verificável. A Fase 3 a substitui pelo
  `AppShell` com o redirecionamento por perfil da §4.5.

### Fase 3 — Design system e shell ✅ (31/08/2026)

**Entregue.** `AppShell` (cabeçalho com identidade e menu do usuário, navegação lateral no
desktop, barra inferior no mobile com `Sheet` para o menu completo, `skip-to-content` e
`main#conteudo`). `config/navigation.ts` declarando a capability de cada item, e
`use-visible-navigation.ts` filtrando com `hasCapability`. Trinta e um componentes em
`shared/components/`: `Button` · `IconButton` · `Input` · `Textarea` · `Field` · `Select` ·
`Combobox` · `Checkbox` · `Switch` · `DatePicker` · `FileDropzone` · `Card` · `Badge` ·
`Avatar` · `Table` · `DataTable` · `Pagination` · `Tabs` · `Dialog` · `AlertDialog` · `Sheet` ·
`DropdownMenu` · `Toast` · `Skeleton` · `EmptyState` · `ErrorState` · `PageHeader` ·
`Breadcrumbs` · `Gallery` · `ConsentBadge` · `LevelPicker`. Mais os hooks `useDebounce` e
`useUrlPagination`, a rota `/dev/ui` com o catálogo, `error.tsx`, `global-error.tsx`,
`not-found.tsx`, `(app)/loading.tsx`, o `ToastProvider` no `providers.tsx` e os 15 enums da
§3.8 traduzidos em `shared/i18n/pt-BR.ts`.

**Verificação.** `npm run lint` e `npm run build` limpos. O menu por perfil — o passo **2.8**,
que tinha ficado para cá — sai do servidor já filtrado:

| Perfil        | Menu renderizado                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RESPONSAVEL   | Feed · Alunos · Turmas · Relatórios · Minha conta                                                                                                                            |
| PROFESSOR     | Feed · Nova postagem · Alunos · Turmas · Relatórios · Modelos · Responsáveis · Matrículas · Responsável e aluno · Minha conta                                                |
| COORDENACAO   | tudo do professor + Pessoas · Professores · Contas de acesso · Professor e turma · Acessos a turma · Anos letivos · Perfis e permissões · Concessões de perfil · Minha conta |
| ADMINISTRADOR | idêntico ao da coordenação                                                                                                                                                   |
| (sem perfil)  | Minha conta                                                                                                                                                                  |

A barra inferior do responsável traz Feed · Alunos · Abrir menu. `/dev/ui` responde `200` em
desenvolvimento e `307 → /` no servidor de produção (`node .next/standalone/server.js`), que
também confirmou `NODE_ENV=production` chegando ao `serverEnv`. Rota inexistente devolve `404`
com o `not-found.tsx`. `Cookie: zelo-theme=dark` sai renderizado como `data-theme="dark"` já no
HTML do servidor.

**Divergências encontradas.**

1. **`notFound()` sob layout assíncrono devolve `200`.** O corpo era o certo — a página de não
   encontrado —, mas o status já estava comprometido: o shell do `(app)/layout.tsx` começa a
   streamar antes de a página lançar. O corte de `/dev/*` em produção subiu para o `proxy.ts`,
   que roda **antes** de qualquer render e devolve um `307` de verdade. O `notFound()` ficou na
   página como segunda linha de defesa.
2. **`next start` não serve `output: 'standalone'`.** O próprio Next avisa e manda usar
   `node .next/standalone/server.js`, depois de copiar `.next/static` e `public` para dentro da
   pasta. Anotado para o passo 13.2 — e é por isso que a verificação de produção desta fase
   rodou pelo standalone.
3. **Radix não tem Combobox.** O pacote unificado `radix-ui` (1.6.7) traz `Popover`, e o
   combobox é composição própria: `input` com `role="combobox"`, listbox com `role="option"`,
   seta e Enter, busca por `useDebounce`. Ficou sem `cmdk` — uma dependência a menos para um
   componente que precisa falar o vocabulário do projeto.
4. **`ownScopeLabel` nasceu e morreu no mesmo dia.** "Meus filhos", da §4.4, não sai das
   capabilities: o responsável enxerga o aluno por `VIEW:STUDENT:TURMA` — mesma capability e
   mesma abrangência do professor. O que muda é o conjunto de turmas do ator, não a permissão.
   Ou o rótulo viria do nome do perfil, que a §4.4 proíbe, ou fica neutro. Ficou "Alunos".
5. **A tabela da §4.4 é aproximação, e a capability é a régua.** O professor vê "Responsáveis"
   e "Responsável e aluno" porque tem `VIEW:GUARDIAN:TURMA` e `VIEW:GUARDIAN_LINK`; a
   coordenação vê "Perfis e permissões" porque tem `VIEW:ROLE` (só leitura — `CREATE` e
   `UPDATE` continuam fora). Coordenação e administrador têm o **mesmo menu**: o que os separa
   são ações de escrita, que não são item de menu. Isso é o mecanismo funcionando, não falha.

**Decisões registradas.**

- **`DatePicker` é `<input type="date">` estilizado.** Calendário próprio custaria dependência
  ou muito código; o nativo já traz teclado, locale e leitor de tela. `date-fns` continua para
  formatação de exibição.
- **O menu aponta para rotas que ainda não existem** (Fases 4 a 11). É o mapa da §4.4 completo
  desde já; o `not-found.tsx` cobre o intervalo. Preferi isso a esconder item por
  disponibilidade e ter de lembrar de reativar em cada fase.
- **`(app)/page.tsx` deixou de ser painel de sessão** e virou uma home de atalhos, derivada do
  mesmo filtro do menu. O redirecionamento por perfil da §4.5 entra na Fase 4, quando `/feed`
  existir: redirecionar hoje seria mandar todo mundo para um 404.
- **O `ThemeToggle` recebe o tema atual como prop do servidor.** Ler `dataset.theme` num efeito
  causaria `setState` em cascata e um quadro no tema errado. Escrever é no cliente e direto —
  `document.cookie` mais `dataset.theme` —, sem round-trip e sem Server Action.
- **Não existe barril em `shared/components/`.** Import por arquivo, como em `shared/api/`:
  um índice arrastaria todo componente cliente para o grafo de qualquer página de servidor.
- **`Field` não está na lista da §4.3**, mas rótulo, dica, erro e `aria-describedby` precisam
  morar em algum lugar que não seja copiado em cada formulário.
- **`<img>` no `Gallery` e no `Avatar`**, com `eslint-disable` da regra do Next: é a §3.6 — o
  otimizador buscaria a imagem sem o cookie do usuário e levaria 401.

### Fase 4 — Feed e postagens ✅ (31/08/2026)

**Entregue.** `modules/posts/` completo: `types.ts` espelhando `PostOutput`, `CommentOutput`,
`MediaOutput` e `ReactionSummaryOutput`; schemas Zod com os quatro `refine` cruzados de
audiência; um arquivo por endpoint em `api/` (5 de servidor, 9 de cliente); e os componentes
`PostCard`, `PostMetaRow`, `FeedFilters`, `ReactionBar`, `CommentSection`,
`RemoveCommentDialog`, `MediaManager`, `AudiencePicker`, `PostComposer` e `PostActions`. As
rotas `/feed`, `/feed/nova` e `/feed/[postId]`, com `loading.tsx` em cada uma. Mais os clientes
mínimos de `classes` e `students` que o composer precisa (as telas deles são das Fases 6 e 7).

**Verificação.** `npm run lint` e `npm run build` limpos. Contra a API real, o ciclo do passo
4.7 inteiro:

| Passo                                             | Resultado                                                   |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Criar rascunho (`POST /posts`)                    | `201`, `publishedAt: null`                                  |
| Rascunho no feed                                  | aparece só em `?status=RASCUNHO`, e só para quem publica    |
| Anexar imagem (`multipart`)                       | `201`                                                       |
| Publicar (`POST /posts/:id/publication`)          | `publishedAt` preenchido, 1 mídia                           |
| A família passa a ver                             | a postagem entra no feed do responsável                     |
| Reação `PUT` JOINHA → CORACAO                     | `total` continua 1, `mine` troca — upsert, não recurso novo |
| Reação `DELETE`                                   | `204`                                                       |
| Autor removendo o próprio comentário sem motivo   | `204`                                                       |
| Escola removendo comentário alheio **sem** motivo | `422` — "A remoção pela escola exige o motivo"              |
| Escola removendo **com** motivo                   | `204`, motivo preservado na lápide                          |

O isolamento entre famílias é o que sustenta o capítulo de resultados: **Bruno vê 4 postagens,
Gabriel vê 2**. As duas que faltam a Gabriel são as endereçadas ao Théo — os dois são pais de
crianças da **mesma** turma, e a postagem por aluno não vaza para o outro responsável. A
página de detalhe renderiza título, corpo, galeria, barra de reação e as duas lápides
(`Removido pelo autor` e `Removido pela escola`, esta com o motivo). A postagem de teste foi
removida ao fim: o feed voltou exatamente ao estado do seed.

**Divergências encontradas.**

1. **`GET /classes` estava quebrado na API.** `classes.routes.ts` tinha o
   `findListClassConsentsValidator` sobrando na rota de **listagem**, exigindo um `classId` que
   aquela rota não tem — toda chamada devolvia `400`. Uma linha a menos resolveu. Sem isso nem
   o filtro de turma do feed nem o seletor do composer sairiam do lugar. Segunda alteração
   feita em `../zelo`.
2. **`redirect()` sob layout assíncrono vira `<meta http-equiv="refresh">`.** É o mesmo
   mecanismo do `notFound()` da Fase 3: o shell do `(app)/layout.tsx` já começou a streamar, o
   status não muda mais, e o Next degrada para um refresh de 1 segundo embutido no HTML. O
   redirecionamento por perfil da §4.5 foi **revertido**: `/` segue como a home de atalhos.
   Para virar um `307` de verdade teria de sair de `next.config.ts` (`redirects()`), e aí quem
   não tem `VIEW:POST` cairia em `/403` em vez de numa tela acolhedora — troca ruim.
3. **`PostOutput` não tem `status`.** Rascunho é `publishedAt === null`, e daí o helper
   `isDraft`. O `status` só existe como filtro de query.
4. **`GET /posts` não traz contagem de reação nem de comentário.** Para o cartão do feed
   mostrar a barra de reação, cada cartão busca o próprio resumo — **N requisições por página**.
   No detalhe isso não acontece: o servidor já traz resumo e catálogo e os passa como
   `initialData`, e a barra sai renderizada no HTML. É o candidato mais claro a melhoria na
   API: `reactionCount`, `commentCount` e `myReaction` no item da lista resolveriam de uma vez.
   Anotado como `TODO(api)`.

**Decisões registradas.**

- **O composer salva a cada passo.** `POST /posts` no primeiro, `PATCH` nos seguintes. A aba de
  mídia só existe depois que o rascunho tem id — não há onde pendurar imagem antes disso.
  Publicar é ação separada, com `AlertDialog`, como manda o princípio 6 da §4.1.
- **O diálogo de remoção de comentário pede motivo só para quem não é o autor**, espelhando a
  regra que o back cobra com 422. Comentário removido nunca some: vira lápide com quem removeu
  e, quando é a escola, o motivo.
- **Reação é a única mutação otimista.** O custo do erro é zero e o rollback é local; o resto
  espera a resposta, como a §5 estabeleceu.
- **Filtro e paginação vivem em `searchParams`.** O feed é Server Component e re-renderiza pela
  URL; só o `FeedFilters` é cliente, e ele só empurra a URL.
- **O filtro de aluno não filtra nada no cliente.** `GET /students` já devolve só quem o ator
  alcança — para o responsável, os próprios filhos, pelo vínculo, dentro do SQL. Verificado:
  Bruno recebe `['Théo']`, Gabriel recebe `['Helena']`, Ana (professora da turma) recebe os
  dois. Filtrar no front seria pior que inútil: significaria que a API mandou as outras
  crianças antes.
- **O responsável não tem o caminho do CPF, e a UI não o oferece.** `VIEW:GUARDIAN` e
  `VIEW:GUARDIAN_LINK` são de professor, coordenação e administrador; Bruno chamando
  `/guardians` ou `/guardian-links` leva `403` (conferido). O seletor de aluno é o único
  caminho, e ele é alimentado pela abrangência do próprio ator.
- **O filtro de aluno só aparece quando há o que escolher.** A lista vem semeada do servidor
  (`findListStudents` no `page.tsx`), então a decisão de mostrar ou esconder é tomada com dado
  real, no HTML — sem o piscar de renderizar o filtro e escondê-lo depois da hidratação. Com um
  aluno alcançado, o controle não existe; com dois ou mais, ele aparece.

### Fase 5 — Agenda do aluno ✅ (31/08/2026)

**Entregue.** `modules/students/` ganhou o lado da agenda: os tipos de `JournalEntryOutput`, os
schemas de criação, edição e remoção, os quatro endpoints (`find-list-journal-entries` de
servidor; criar, editar e remover de cliente) e os componentes `JournalTimeline`,
`JournalEntryCard`, `JournalComposer`, `JournalDatePicker`, `EditEntryDialog` e
`RemoveEntryDialog`. A rota `/students/[studentId]/journal`, com `loading.tsx`, filtro de dia
em `?date=` e navegação de dia anterior / próximo dia.

Junto, e fora do escopo da fase: o **débito da Fase 4 foi liquidado**. Com `commentCount`,
`reactionCount` e `myReaction` chegando em `GET /posts`, o cartão do feed deixou de buscar o
próprio resumo. O `PostReactions` do cartão não faz **nenhuma** requisição para renderizar —
emoji, contagem e a reação do próprio ator saem do item da lista, e o catálogo vem semeado uma
vez por página. O `ReactionBar` completo, com as contagens por tipo, continua só no detalhe.

**Verificação.** `npm run lint` e `npm run build` limpos. O ciclo do passo 5.4 contra a API
real: a professora escreve, o responsável responde com `repliesToId`, e **os dois veem o mesmo
fio** — a resposta indentada sob a entrada original. Editar devolve `editedAt` preenchido e a
tela mostra "editado". O dia sem registro mostra "Nada registrado neste dia". As lápides
aparecem nas duas formas, e a da escola carrega o motivo.

O isolamento se mantém: **Gabriel leva `404` na agenda do Théo** — os dois são responsáveis de
crianças da mesma turma, e o vínculo é por criança, não por turma.

**Divergências encontradas.**

1. **O responsável não pode remover o próprio registro da agenda — e a UI oferecia o botão.**
   `RESPONSAVEL` tem `CREATE:JOURNAL:TURMA` e `VIEW:JOURNAL:TURMA`, e nada de `DELETE`. O
   guard estava escrito como `isAuthor || canDelete`, que é a intuição errada: ser autor não é
   permissão. Bruno clicava e levava `403` — exatamente o que a §3.5 diz que o guard existe
   para evitar. Corrigido: quem decide é a **abrangência**.

   ```
   PROPRIA  → só as próprias entradas
   TURMA    → qualquer entrada que o ator alcança
   ESCOLA   → idem
   nenhuma  → o botão não existe
   ```

   Conferido depois do ajuste, na mesma entrada: Ana (autora, `UPDATE`/`DELETE:JOURNAL:PROPRIA`)
   recebe editar, remover e responder; Bruno recebe só responder. Diana, com
   `DELETE:JOURNAL:TURMA`, remove entrada alheia — foi ela quem limpou a resposta do Bruno ao
   fim do teste.

**Decisões registradas.**

- **A árvore de respostas tem um nível só.** `repliesToId` aponta para a entrada raiz, e uma
  resposta não ganha botão de responder. Encadear resposta de resposta viraria fórum; o modelo
  aqui é escola escreve, família responde.
- **Resposta órfã não some.** Se o pai da resposta não estiver na página atual (paginação ou
  filtro de dia), a entrada é promovida a raiz em vez de desaparecer. Sumir com o texto de
  alguém por acidente de paginação seria pior que mostrá-lo fora do lugar.
- **O motivo da remoção é opcional aqui**, ao contrário do comentário da §4.5 — é o que o back
  cobra (`reason` opcional no `deleteJournalEntrySchema`), e o front não inventa regra que a
  API não tem.
- **A data vive em `?date=`**, com as setas de dia empurrando a URL. Mesma régua do feed: a
  tela sobrevive ao refresh e ao link compartilhado.

### Fase 6 — Turmas, alunos e matrículas ✅ (01/09/2026)

**Entregue.** Três módulos novos e três de leitura. `modules/classes/` ganhou tipos, schemas de
criação e edição, os cinco endpoints e os componentes `ClassTable`, `ClassFilters`,
`ClassFormDialog`, `ClassActions`, `ClassTabs`, `ClassPicker` e `ClassConsentTable`.
`modules/students/` ganhou o lado do cadastro: schemas de lista e formulário, `POST`/`PATCH`/
`DELETE`, e `StudentTable`, `StudentFilters`, `StudentFormDialog`, `StudentActions`,
`StudentPicker`. `modules/enrollments/` nasceu inteiro. Em leitura, `school-years`, `people`,
`teacher-links` e `guardian-links` receberam só o `GET` que as telas desta fase pedem.

Rotas: `/classes`, `/classes/[classId]` (+ `/teachers`, `/posts`, `/consents`), `/students`,
`/students/[studentId]` e `/enrollments`, cada uma com `loading.tsx`.

Compartilhado: `shared/utils/date.ts` (`formatDate`, `todayIso`, `formatAge`),
`shared/api/search-params.ts` (`parseSearchParams`), `shared/api/not-found.ts` (`orNotFound`),
`shared/hooks/use-url-filters.ts` e `shared/hooks/use-api-action.ts`. As quatro primeiras
nasceram de código que já estava duplicado na Fase 4 e na 5 — `formatDate` morava dentro de
`post-meta.tsx`, e o mapeamento de `searchParams`, o `try/catch` de 404 e o `update(key,
value)` dos filtros estavam copiados por tela.

**Verificação.** `npm run lint` e `npm run build` limpos. Tudo exercitado contra a API real em
`:3003`, pelo BFF, com cinco personas do seed. Turma criada, renomeada, com turno trocado e
excluída (`204`); alunos filtrados por busca, turma e situação; matrícula criada, encerrada e
relistada como encerrada; aluno criado a partir de pessoa sem papel, desativado e excluído.
As três recusas do back chegaram com a mensagem que a tela mostra no toast:

```
DELETE /classes/:id   com matrícula → 409 "Turma já utilizada não pode ser removida"
POST   /enrollments   duplicada     → 409 "Este aluno já tem matrícula vigente nesta turma"
DELETE /students/:id  com histórico → 409 "Aluno com histórico não pode ser removido; …"
DELETE /enrollments/:id já encerrada→ 409 "Matrícula já encerrada"
```

O recorte de escopo se mantém: Bruno vê **um** aluno em `/students` (o Théo), e tanto ele
quanto Ana levam `404` — não `403` — na Turma B. A navegação por capability confere: `Nova
turma`, `Novo aluno` e `Matricular aluno` aparecem para Isabel e Diana, e não para Ana nem
Bruno; a aba **Professores** some para quem não tem `VIEW:TEACHER_LINK`.

**Divergências encontradas.**

1. **O guard de capability nunca funcionou — e o defeito vinha da Fase 3.** `RequireCapability`
   era um componente que embrulhava o JSX, mas toda página busca os dados **antes** de
   retornar JSX. Resultado: quem não tinha a capability disparava a requisição mesmo assim,
   levava `403` da API, e o `ApiError` subia para o boundary de erro **depois** de o shell já
   ter sido transmitido — a tela ficava em branco, sem erro e sem `/403`. Reproduzido com
   Bruno em `/enrollments` e com Fábio em `/feed`: 200 com o miolo vazio.

   Corrigido em dois lugares, na mesma régua do `401` da §3.2:

   ```
   requireCapability(feature)  função, chamada ANTES do fetch → redirect('/403')
   serverApi                   403 de qualquer fetch          → redirect('/403')
   ```

   O componente `RequireCapability` foi removido: com duas formas de fazer a mesma coisa, a
   errada volta. As doze páginas das Fases 3 a 6 passaram para a função. Depois do ajuste,
   nenhuma requisição condenada chega à API — o log do back fica em zero `ForbiddenError`
   durante a bateria — e a tela entrega o `/403`.

2. **`z.infer` é `type`, `interface` não é.** Os parâmetros de lista escritos como `interface`
   não são atribuíveis a `QueryParams` (falta a index signature implícita, que só o `type`
   ganha). Os quatro módulos de leitura novos quebraram no `tsc` por isso; viraram `type`.

**Decisões registradas.**

- **As abas do detalhe da turma são segmentos aninhados, não slots paralelos** (`@pasta`),
  como o §8 supunha. Slot paralelo renderiza **todos** os slots do nível a cada requisição —
  a própria doc do Next diz que o `page.js` de cada slot executa seus fetches mesmo quando o
  layout não o mostra. Seriam quatro buscas para exibir uma. Com segmento aninhado, o
  `layout.tsx` guarda cabeçalho e barra de abas, cada aba busca só o que é seu, e o
  `loading.tsx` do `[classId]` serve as quatro.
- **Leitura de recurso vizinho é permitida; escrita não.** Os passos 6.2 e 6.4 pedem
  professores, consentimentos e responsáveis, que a matriz da §9 marca como Fase 8 e 9. As
  telas consomem o `GET` desses recursos agora — o painel de consentimento por turma é
  `GET`-only por natureza — e as Fases 8 e 9 entram com as telas de escrita. Mesmo caminho
  para `GET /school-years`, sem o qual `POST /classes` não teria `schoolYearId`.
- **`POST /students` é a etapa 2, e assume a etapa 1.** O diálogo de novo aluno escolhe uma
  pessoa em `GET /people?role=none` — o filtro que o back criou exatamente para achar quem
  ficou sem papel. Cadastrar a pessoa é `POST /people`, da Fase 7.
- **Os atalhos de consentimento e relatório do passo 6.4 ficaram de fora.** As rotas
  `/students/[studentId]/consents` e `/reports` só nascem nas Fases 9 e 10; link para rota
  inexistente é `404` na cara do usuário. O da agenda, que existe, está lá.
- **O vocabulário da destruição segue o do back.** Turma e aluno se **excluem** (remoção
  física, que a API recusa com `409` quando há histórico); aluno se **desativa**
  (`PATCH { active: false }`); matrícula se **encerra**. A tela nunca diz "excluir matrícula".
- **A idade aparece ao lado do nascimento** ("3 anos e 5 meses"). Em educação infantil a
  diferença entre 2 e 3 anos é a diferença entre duas turmas, e a data crua obriga o
  professor a fazer a conta de cabeça.

### Fase 7 — Pessoas, papéis e usuários ✅ (01/09/2026)

**Entregue.** `modules/people/` completo — tipos, schemas de busca e de formulário, os sete
endpoints (incluindo os três da foto) e os componentes `PersonTable`, `PersonFilters`,
`PersonFields`, `EditPersonDialog`, `NewPersonDialog`, `AssignRoleStep`, `PersonRolesCard`,
`PersonRoleBadges`, `PhotoManager` e `SquareCropper`. `modules/guardians/`,
`modules/teachers/` e `modules/users/` nasceram inteiros, cada um com lista, filtros, ficha e
escrita. Em leitura entrou `GET /roles`, só para preencher o filtro de perfil da lista de
contas.

Rotas: `/people`, `/people/[personId]`, `/guardians`, `/guardians/[guardianId]`, `/teachers`,
`/teachers/[teacherId]`, `/users`, `/users/[userId]` e `/account`, cada uma com `loading.tsx`.

Compartilhado: `shared/utils/cpf.ts` — `normalizeCpf`, `isValidCpf`, `formatCpf` e `maskCpf`,
o mesmo algoritmo do back, porque o dígito verificador é o que impede a pessoa duplicada
(§7.2) — e `shared/utils/phone.ts`.

**Verificação.** `npm run lint` e `npm run build` limpos. Tudo exercitado contra a API real em
`:3003`, pelo BFF, com cinco personas. Busca por CPF funciona com e sem máscara. O ciclo em
duas etapas rodou inteiro: `POST /people` com nome `"  marina  DA silva "` voltou
`Marina da Silva` — quem normaliza é o back — e `POST /guardians` logo em seguida deu o papel.
Apagar o telefone pelo `PATCH { phone: null }` gravou `null`, que é o passo 7.2. Conta criada,
e-mail e senha trocados (o login novo respondeu `201`, provando que a senha pegou), conta
desativada (login passou a `401`) e reativada por `PATCH { active: true }`.

As recusas do back chegaram com a mensagem que a tela mostra:

```
POST /guardians  pessoa sem CPF        → 422 "CPF é obrigatório para o papel de responsável"
POST /guardians  pessoa já é           → 409 "Esta pessoa já é responsável"
PATCH /people    CPF de outra pessoa   → 409 "Já existe uma pessoa com este CPF"
POST /users      pessoa já tem login   → 409 "Esta pessoa já tem login"
DELETE /users    a própria conta       → 422 "Não é possível desativar o próprio usuário"
```

A matriz de acesso por perfil, conferida rota a rota:

```
            /people  /guardians  /teachers  /users  /account
ADMIN            ok          ok         ok      ok        ok
COORDENACAO      ok          ok         ok      ok        ok
PROFESSOR       403          ok        403     403        ok
RESPONSAVEL     403         403        403     403        ok
sem perfil      403         403        403     403        ok
```

Zero `ForbiddenError` no log do back durante a bateria: o guard da Fase 6 barra antes do
fetch.

**Divergências encontradas.**

1. **`GET /sessions/current` não devolvia a pessoa por trás do login — e isso bloqueava o
   passo 7.4.** "Todo usuário troca a própria foto" exige saber o próprio `personId`, e nem
   responsável nem professor conseguiam descobri-lo: `GET /users/:id` e `GET /people/:id`
   respondem `403` para os dois. Os dois **têm** `UPDATE:PHOTO`; o que faltava era o
   endereço.

   Corrigido no back (`../zelo`, commit `feat: sessão devolve a pessoa por trás do login`): a
   query de autenticação já dava `INNER JOIN pessoa`, então passou a projetar `pessoa_id`, e o
   campo subiu até o `IdentityOutput` — vale para o corpo do login e para a sessão corrente.
   Conferido depois: Bruno (responsável) e Ana (professora) sobem a própria foto e a releem,
   pelo BFF, com `200`.

**Decisões registradas.**

- **O recorte é feito no cliente e vai como JPEG.** `SquareCropper` desenha a área escolhida
  num `canvas` de 512×512 e envia o resultado — não o original. Poupa banda, garante o
  quadrado que o `Avatar` espera, e evita que a API receba um arquivo de 10 MB para virar
  miniatura. O enquadramento é por arrastar e por zoom; o recorte é sempre quadrado.
- **A ficha do papel não duplica campo da pessoa.** Responsável guarda `receiveEmail` e
  `receivePush`, e mais nada; professor guarda matrícula funcional, formação e ativo. Nome,
  CPF e contato aparecem em leitura, com o link para editar na ficha da pessoa — é o que o
  passo 7.5 pede, e o que o back impõe (`updateGuardianSchema` só aceita as duas
  preferências).
- **O botão de papel adulto nasce desabilitado quando falta CPF**, com o motivo escrito no
  próprio botão. O `422` do back continua sendo a autoridade; o guard existe para o operador
  não descobrir a regra levando erro.
- **A força da senha é medida por variedade e comprimento**, não por dicionário: quatro
  classes de caractere mais dois degraus de comprimento (12 e 16). É indicação, não gate — o
  que barra é o mínimo de 8 do schema, igual ao do back.
- **`/people/[personId]` não deep-linka para a ficha do papel.** Nem `GET /guardians` nem
  `GET /teachers` nem `GET /students` filtram por `personId`, então não há como resolver o id
  do papel a partir da pessoa. O link vai para a lista do papel já filtrada pelo nome — que
  chega no mesmo lugar sem inventar rota.

### Fase 8 — Vínculos e acessos ✅ (02/09/2026)

**Entregue.** `modules/guardian-links/` e `modules/teacher-links/` saíram do estado de leitura
que a Fase 6 lhes deu e ganharam schemas, escrita e tela; `modules/class-accesses/` nasceu
inteiro. Cada um com lista, filtros, diálogo de criação e encerramento:
`GuardianLinkTable` · `GuardianLinkFilters` · `GuardianLinkDialog` · `GuardianLinkActions`,
`TeacherLinkTable` · `TeacherLinkFilters` · `TeacherLinkDialog` · `EndTeacherLinkButton`,
`ClassAccessTable` · `ClassAccessFilters` · `ClassAccessDialog` · `EndClassAccessButton`.

Rotas: `/guardian-links`, `/teacher-links` e `/class-accesses`, com `loading.tsx`. A aba
**Professores** do detalhe da turma, que a Fase 6 deixou só de leitura, ganhou o botão de
vincular já com a turma travada.

Compartilhado: `GuardianPicker`, `TeacherPicker` e `UserPicker` — os três combobox que
faltavam para fechar o conjunto de seletores — e um `rowClassName` opcional no `DataTable`,
que é o que dá o tom secundário à linha encerrada do passo 8.4.

**Verificação.** `npm run lint` e `npm run build` limpos. Tudo exercitado contra a API real em
`:3003`, pelo BFF.

O passo 8.1 confirmado no corpo da resposta: `POST /guardian-links` **sem** `canConsent`
devolve `canConsent: false`. O `PATCH` concede depois, que é a decisão explícita que a tela
descreve.

O 8.4 confirmado nos três: encerrar move a linha de "vigentes" para "encerrados" sem apagá-la
— 5 vigentes + 1 encerrado = 6 no total, e a linha encerrada sai com `text-text-muted` e a
data de fim. As recusas:

```
POST   /guardian-links  par já vinculado → 409 "Já existe vínculo vigente entre este responsável e este aluno"
DELETE /guardian-links  já encerrado     → 409 "Vínculo já encerrado"
```

**O vínculo tem efeito verificado, não só linha em tabela.** Depois de vincular Ana à Maternal
II B, a sessão dela passou de 1 para 2 turmas e ela publicou lá — antes do vínculo, não
publicava. E a concessão de acesso levou 1 turma para a sessão da conta que a recebeu, ainda
que essa conta não tenha perfil nenhum: **escopo sem capability não vê nada**, que é o mesmo
controle negativo do Elias no seed.

O `grantedBy` sai do ator: a concessão feita com a sessão da Isabel voltou
`grantedByName: "Isabel Prado"`, sem o campo ter ido no corpo.

A matriz de acesso por perfil:

```
             /guardian-links  /teacher-links  /class-accesses
ADMIN           ok + escrita    ok + escrita     ok + escrita
COORDENACAO     ok + escrita    ok + escrita     ok + escrita
PROFESSOR       ok (leitura)             403              403
RESPONSAVEL              403             403              403
sem perfil               403             403              403
```

Zero `ForbiddenError` no log do back durante a bateria. Ana lê os vínculos de responsável da
turma dela — tem `VIEW:GUARDIAN_LINK:TURMA` e nada de `CREATE` — e a tela não lhe oferece o
botão.

**Decisões registradas.**

- **Nenhuma das três telas edita a ponta do vínculo.** Parentesco, `canConsent` e `financial`
  se editam; responsável e criança, não. O back já recusa (`updateGuardianLinkSchema` não
  aceita os ids), e a tela diz o porquê no lugar de escondê-lo: trocar a ponta é outro
  vínculo, e o histórico continua contando a verdade. Professor e acesso não têm `PATCH`
  nenhum — só nascem e encerram.
- **A linha encerrada fica, em tom secundário.** Esconder o histórico atrás de um filtro
  padrão faria a tela mentir sobre o passado; é justamente o histórico que responde por que
  aquela família viu aquelas postagens. O filtro de vigência começa em "vigentes e
  encerrados".
- **O aviso do `canConsent` mora no formulário, não na documentação.** O passo 8.1 pede que a
  UI _explique_ — então o bloco das duas permissões carrega a frase de que assinar LGPD pela
  criança não é consequência de ser responsável por ela, ao lado das caixas.
- **A tela de acesso a turma abre com o aviso de auditoria**, antes dos campos, e o diálogo de
  encerramento repete que a concessão continua na trilha. É a diferença entre "desfazer" e
  "encerrar", e o passo 8.3 depende de o operador entender isso antes de conceder.
- **O botão de vincular professor aparece também na aba da turma**, com a turma travada. É de
  lá que a coordenação percebe a falta — a aba vazia diz "sem vínculo, ninguém publica nesta
  turma" — e obrigar a ida à tela de vínculos só para escolher a turma que já estava na tela
  seria atrito à toa.

### Fase 9 — Consentimento (LGPD) ✅ (02/09/2026)

**Entregue.** O consentimento é recurso do aluno — mora em `modules/students/`, como a agenda
da Fase 5, e não em pasta própria: a URL do back é `/students/:studentId/consents`, e inventar
um `modules/consents/` só duplicaria o dono. Vieram `schemas/consents.ts`,
`api/find-list-consents.ts` (+ `.client`), `api/create-consent.client.ts`,
`api/revoke-consent.client.ts` e cinco componentes: `ConsentSummary`, `ConsentHistoryTable`,
`ConsentFilters`, `ConsentDialog`, `RevokeConsentButton` e `NewConsentButton`.

Rota nova: `/students/[studentId]/consents`, com `loading.tsx` — o estado vigente dos três
tipos em cartões no topo (9.1), o histórico datado e filtrável abaixo. O painel da turma da
Fase 6, que era só uma tabela, ganhou `ClassConsentCounters` e `ClassConsentFilters` (9.4).

Os enums `CONSENT_TYPES`/`CONSENT_ORIGINS` saíram de `modules/classes/types.ts`, onde a Fase 6
os pousou por conveniência, e foram para `modules/students/types.ts` junto do `ConsentOutput`.
`classes` agora os importa. O `consent-badge` compartilhado ganhou `consentStateOf` e
`ConsentStateBadge` — a mesma regra "sem registro vigente = não" servindo os três lugares que
a leem.

**Verificação.** `npm run lint` e `npm run build` limpos. Tudo exercitado contra a API real em
`:3003`, pelo BFF, com as cinco personas do seed.

O 9.2 confirmado nos dois lados. O `refine` do cliente reproduz o do back, inclusive o
`path: ['documentKey']` que faz o erro cair no campo certo:

```
verbal sem documento   → documentKey: Consentimento verbal exige o documento que o comprova
documento só com espaço→ documentKey: string precisa de >= 1 caractere
campo desconhecido     → Unrecognized key (strictObject, como no back)
```

E as três recusas do back, pelo BFF, com a sessão da Isabel:

```
POST   origin=SOLICITACAO_VERBAL sem documentKey → 400 cause[].path=["documentKey"]
POST   origin=PORTAL_RESPONSAVEL como admin      → 403 "A origem PORTAL_RESPONSAVEL é do próprio responsável"
POST   guardianId sem vínculo com a criança      → 422 "O responsável indicado não tem vínculo vigente"
DELETE consentimento já encerrado                → 409 "Consentimento já encerrado"
```

O ciclo completo do 9.3 rodou na Helena: `POST` verbal com documento → 201 vigente; `DELETE` →
204; a linha some do resumo ("sem registro vigente") e permanece no histórico com a vigência
fechada e o tom secundário. **Substituir também foi verificado no back**: `create` encerra a
vigência anterior do mesmo tipo dentro da transação, então o botão "Substituir" do cartão diz
a verdade.

O 9.4 na Maternal I A, com os contadores conferindo com as linhas:

```
Uso interno da imagem      2 autorizam · 0 negam · 1 sem registro
Uso externo da imagem      0 autorizam · 0 negam · 3 sem registro
Tratamento biométrico      0 autorizam · 0 negam · 3 sem registro

?missing=IMAGEM_INTERNA → 1 resultado (Helena)
?missing=IMAGEM_EXTERNA → 3 resultados
?missing=lixo           → cai para "todas", sem erro
```

A matriz de acesso, com as capabilities que o seed dá a cada perfil:

```
                VIEW  CREATE  REVOKE   painel do aluno         painel da turma
ADMIN            ok     ok      ok     lê e escreve            lê
COORDENACAO      ok     ok      ok     lê e escreve (turma)    lê (turma)
PROFESSOR        ok     —       —      lê, sem botão nenhum    lê
RESPONSAVEL      ok     ok      ok     lê e escreve (filho)    lê
sem perfil       —      —       —      → /403                  → /403
```

Zero resposta 5xx e nenhuma exceção no log do Next na bateria inteira.

**Bug encontrado e corrigido.** Fora do escopo, a API devolve **404**, e as buscas de
consentimento não estavam protegidas: a Diana abrindo o painel de uma criança de outra turma
recebia a shell já transmitida e o conteúdo em branco — a mesma falha de streaming que a Fase
6 achou no `RequireCapability`, só que pelo caminho do 404. As três buscas passaram a usar
`orNotFound`, e o painel da turma junto (o defeito vinha da Fase 6). No **perfil** do aluno o
tratamento é outro: o cartão de consentimento é acessório, então ele usa o `orNull` novo — o
404 apaga o cartão em vez de derrubar a página inteira, porque quem tem `VIEW:STUDENT:ESCOLA`
e `VIEW:CONSENT:TURMA` legitimamente vê a criança sem ver o consentimento dela. O botão
**Consentimentos** do cabeçalho passou a depender de `consents !== null` em vez da capability
sozinha: o mesmo 404 que apaga o cartão apaga o link, senão sobraria um botão levando a lugar
nenhum.

A correção foi medida contra si mesma — a versão sem `orNotFound` rebuildada e servida — porque
o sintoma é invisível no HTML dos dois lados: o conteúdo chega no payload RSC, e a string
`Página não encontrada` está em **toda** página, já que o Next serializa a fronteira de
not-found junto do layout. O que separa os dois casos é o digest:

```
sem orNotFound   payload sem NEXT_HTTP_ERROR_FALLBACK
                 log do Next: NotFoundError statusCode 404 digest 980533537  ← exceção escapou
com orNotFound   payload com NEXT_HTTP_ERROR_FALLBACK;404
                 log do Next: limpo
```

**Decisões registradas.**

- **O campo do responsável signatário só aparece para quem enxerga vínculos.** O responsável
  não tem `VIEW:GUARDIAN_LINK` — o back preenche o `guardianId` com o vínculo dele e recusa
  assinar em nome de outro. Mostrar um seletor vazio seria mentir sobre o que ele pode fazer.
  Para a escola, o seletor lista **só quem tem vínculo vigente com `canConsent`** — que é a
  regra do 8.1 aparecendo do outro lado.
- **As quatro origens ficam todas na lista.** `PORTAL_RESPONSAVEL` é do próprio responsável, e
  o back recusa a escola usando-a; a tela explica isso no `hint` da origem escolhida em vez de
  esconder a opção. Esconder faria a coordenação achar que a origem não existe.
- **O contador lê a lista inteira, não a página.** `GET /classes/:classId/consents` não tem
  agregação nem filtro de "sem consentimento" — os dois são do cliente. A busca pede
  `limit: 100`, o teto do back, e um `TODO` marca o dia em que uma turma passar disso. Contar
  só a página visível daria um número errado à pergunta que a tela existe para responder.
- **O selo do 9.5 mostra os dois tipos de imagem, não os três.** O composer publica imagem; a
  biometria não muda essa decisão. O selo se cala por completo para quem não tem
  `VIEW:CONSENT` — o Fábio não vê nem que existe.
- **Revogar não desaparece com a linha.** O cartão volta a "sem registro vigente" e o
  histórico ganha a vigência fechada. É o mesmo princípio da Fase 8, e aqui ele é o produto:
  a pergunta "podíamos publicar aquela foto em março?" só tem resposta se março continuar no
  banco.

**Não verificado por HTTP.** O comportamento interativo do `ConsentDialog` — o campo do
documento que aparece ao escolher `SOLICITACAO_VERBAL` — e o selo do composer, que busca no
cliente. O schema e os endpoints por trás dos dois foram exercitados; o clique, não, porque
aqui só existe HTTP.

### Fase 10 — Relatórios e modelos ✅ (02/09/2026)

**Entregue.** Dois módulos novos: `modules/reports/` e `modules/report-templates/`. O relatório
é do aluno, mas tem recurso próprio no back (`/reports`), então ganhou pasta própria — ao
contrário do consentimento da Fase 9, que pendura na URL do aluno.

Rotas: `/reports` e `/reports/[reportId]`, `/report-templates` e
`/report-templates/[templateId]`, todas com `loading.tsx`. As duas entradas de navegação já
existiam desde a Fase 3, apontando para o vazio; agora chegam a algum lugar.

`ReportEditor` é o coração do 10.2: as sete dimensões com o `LevelPicker` que a Fase 3 deixou
pronto, observação por dimensão, síntese, e **salvamento automático**. O autosave espera 1,2 s
depois da última tecla, monta o `PATCH` só com o que mudou — inclusive só as dimensões
alteradas, porque o back substitui item a item — e não dispara quando nada mudou. Não há botão
de salvar: a linha no topo diz "Salvando…", "Rascunho salvo" ou o erro.

`ReportReading` é a leitura do 10.6, e serve dois públicos com o mesmo componente: o
responsável, que nunca vê editor, e a impressão do 10.7. Cada nível vem com uma frase em
linguagem simples — `reportLevelHint` no i18n —, e a mais importante é a do `NAO_OBSERVADO`:
"não houve situação no período para observar isso. **Não é atraso**". Sem ela o nível mais
comum do berçário lê como diagnóstico.

**Verificação.** `npm run lint` e `npm run build` limpos. Tudo contra a API real em `:3003`,
pelo BFF.

O 10.3 confirmado no corpo da resposta: `POST /reports` com `templateId` volta com a síntese e
as observações do modelo já preenchidas, dimensão a dimensão. Os níveis vieram
`NAO_OBSERVADO` porque o modelo do seed grava `level: null` — o modelo sugere texto, não
nível, e o front não finge o contrário.

O 10.2 e as recusas do `PATCH`:

```
PATCH items com uma dimensão só  → 200, substitui só aquela linha
PATCH synthesis: null            → 200, apaga a síntese
PATCH dimensão repetida          → 400 cause[].path=["items"]
PATCH corpo vazio                → 400 "Corpo vazio: nada a alterar"
PATCH periodEnd < periodStart    → 400 cause[].path=["periodEnd"]
```

O `buildPatch` do autosave nunca manda corpo vazio — devolve `null` e o efeito não dispara —,
então a terceira recusa é rede de segurança, não caminho normal.

O 10.4 e as travas do publicado:

```
POST   /publication sem conteúdo → 422 "precisa de síntese ou de ao menos uma dimensão observada"
POST   /publication com conteúdo → 200 status PUBLICADO
PATCH  publicado                 → 409 "não é alterado — a família já recebeu esta versão"
DELETE publicado                 → 409 "não é removido — a família já recebeu esta versão"
POST   /publication de novo      → 409 "Relatório já publicado"
```

O botão **Publicar** nasce desabilitado quando falta conteúdo, com a frase que diz o que falta
— o 422 acima é a mesma regra, um passo depois.

O 10.5 inteiro, criando e apagando um modelo de teste:

```
POST   modelo vazio                        → 201 itemCount 0
PATCH  com duas dimensões                  → 200 itemCount 2
PATCH  dimensão repetida                   → 400 cause[].path=["items"]
PATCH  item sem nível e sem observação     → 400 cause[].path=["items", 0]
PATCH  nome com 2 caracteres               → 400 cause[].path=["name"]
DELETE                                     → 204, e o GET seguinte 404
```

A matriz de acesso:

```
                 /reports  rascunho   publicado   /report-templates  modelo de outro autor
ADMIN              lista    editor     leitura        lista + criar    editar e remover
COORDENACAO        lista    editor     leitura        lista + criar    editar e remover
PROFESSOR          lista    editor     leitura        lista + criar    só leitura
RESPONSAVEL        lista      404      leitura              403              403
sem perfil          403       403        403               403              403
```

**O 10.6 é regra do back antes de ser tela.** O responsável recebe 404 no rascunho e vê 1 de 3
relatórios na lista — o front não filtra nada, só não oferece editor nem ação. E o escopo
`PROPRIA` do professor foi medido com controle negativo: no modelo que a Ana escreveu ela tem
os dois botões; no modelo criado pela Isabel, nenhum, enquanto Isabel e Diana (escopo
`ESCOLA`) continuam com os dois.

Zero 5xx e nenhuma exceção no log do Next na bateria inteira.

**Decisões registradas.**

- **O editor não tem botão de salvar.** O passo 10.2 pede salvamento automático, e um botão ao
  lado convidaria a duvidar dele. O preço é o indicador de estado, que ficou fixo no topo da
  tela — sem ele o autosave é fé.
- **O `PATCH` leva só o que mudou.** Mandar as sete dimensões a cada tecla funcionaria, mas
  reescreveria linhas que ninguém tocou e apagaria a distinção entre "não mexi" e "mexi para o
  mesmo valor" no `updatedAt`. O diff é contra a última resposta do servidor, não contra o
  estado inicial.
- **A dimensão repetida se previne, e ainda assim se valida.** O passo 10.5 pede o aviso no
  cliente. Como o formulário do modelo lista uma dimensão por vez e o seletor de adicionar só
  oferece as que faltam, a repetição não tem como nascer pela UI — mas o schema mantém o
  `refine`, e o erro sai nomeando a dimensão, porque o back devolve `path: ["items", 0]` e um
  índice não diz nada a quem preenche.
- **O modelo não força as sete dimensões; o relatório sim.** O modelo do seed cobre cinco, e é
  isso que ele é: um ponto de partida parcial. Já o relatório nasce com as sete em
  `NAO_OBSERVADO`, porque a ausência de uma dimensão no relatório final seria lida como
  esquecimento.
- **Imprimir um rascunho imprime a leitura, não o formulário.** O rascunho renderiza o editor
  na tela e um `ReportReading` escondido que só aparece em `@media print`. Sai o que a família
  leria, ainda que a coordenação esteja lendo antes dela.
- **A folha de impressão mira `data-print`, não classe utilitária.** `header`, `aside` e `nav`
  somem; `[data-print="sheet"]` perde borda e largura máxima; as cores vão a preto no branco
  pelas variáveis do tema. É o `@media print` do 10.7 sem dependência nova, como o plano pede.

### Fase 11 — Administração e perfis ✅ (02/09/2026)

**Entregue.** `modules/role-grants/` nasceu inteiro; `modules/roles/` e `modules/school-years/`
saíram do estado de leitura em que as Fases 6 e 7 os deixaram. Rotas `/school-years`, `/roles`,
`/roles/[roleId]` e `/role-grants`, com `loading.tsx`. As três entradas do grupo
**Administração** já estavam na navegação desde a Fase 3, apontando para o vazio.

`PermissionMatrix` é o 11.3: 24 recursos por 6 ações, 103 seletores de abrangência, montada em
tempo de render a partir do próprio `enum Feature` — não há lista de recursos escrita à mão que
possa divergir do catálogo. O i18n ganhou `permissionResource`, `permissionAction` e
`scopeHint` para a matriz falar português.

**Verificação.** `npm run lint` e `npm run build` limpos. Tudo contra a API real em `:3003`,
pelo BFF, e as 28 rotas do app sem regressão.

O 11.1:

```
POST   endDate igual a startDate     → 400 cause[].path=["endDate"]
POST   ano que já existe             → 409 "O ano letivo 2026 já existe nesta escola"
POST   2027 válido                   → 201, classCount 0
PATCH  só endDate, anterior ao início→ 422 (é o use-case que julga, lendo o valor do banco)
DELETE ano com 2 turmas              → 409 "Ano letivo com turmas não pode ser removido"
DELETE ano sem turmas                → 204
```

O 11.2 na tela do perfil Professor: aviso de perfil de sistema, os 103 seletores renderizados
**desabilitados**, nome e descrição travados e nenhum botão de salvar. E o back cobre a mesma
regra: `PATCH` em perfil de sistema → 403 "Perfil de sistema não é editável pela API".

O 11.3 medido pela substituição, que é o ponto: um perfil com 8 permissões recebeu um `PATCH`
com 2 e **ficou com 2**, não com 10. As duas recusas de catálogo:

```
POST code "nao vale"                → 400 regex ^[A-Z][A-Z0-9_]*$
POST permissão "VIEW:NAO_EXISTE"    → 400, e o erro lista o catálogo inteiro de capabilities
POST code duplicado                 → 409 "Já existe um perfil com o código SECRETARIA"
```

O `code` minúsculo não é erro: `secretaria` virou `SECRETARIA` pelo `toUpperCase()` do schema —
e o schema do cliente faz o mesmo, então os dois concordam antes da rede.

O 11.4:

```
POST   conceder                      → 201, grantedByName sai do ator ("Isabel Prado")
POST   conceder o mesmo par de novo  → 409 "já tem este perfil com concessão vigente"
DELETE a própria concessão           → 422 "Não é possível revogar o próprio perfil"
DELETE concessão de outro            → 204
DELETE a mesma de novo               → 409 "Concessão já encerrada"
```

**O 11.5 é o teste que fecha a fase, e passou.** O Fábio, conta sem perfil nenhum, tinha menu
com uma entrada só. Criado o perfil `SECRETARIA` com oito permissões e concedido a ele, o menu
passou a:

```
antes    /account
depois   /students · /classes · /people · /enrollments · /school-years · /account
```

Nada de feed, relatório ou administração — ele não tem essas capabilities. E o menu não mente
sobre o que abre: as seis páginas responderam 200 e as outras seis testadas redirecionaram
para `/403`. Os botões de escrita apareceram só onde há `CREATE` — "Nova pessoa" e "Matricular
aluno" sim, "Novo ano letivo" não, porque ali ele só tem `VIEW`. Revogada a concessão, o menu
voltou a ter só `/account` e a sessão dele a zero permissão.

A alteração do perfil também alcança quem já o tem: depois do `PATCH` que trocou as 8
permissões por 2, a sessão do Fábio passou a devolver exatamente essas 2.

A matriz de acesso:

```
             /school-years        /roles              perfil          /role-grants
ADMIN        ler + escrever       ler + criar         editar          conceder e encerrar
COORDENACAO  ler + escrever       só ler              só ler          conceder e encerrar
PROFESSOR             403            403                403                   403
RESPONSAVEL           403            403                403                   403
sem perfil            403            403                403                   403
```

A Coordenação lê perfis e não os edita — tem `VIEW:ROLE` e nada de `CREATE` ou `UPDATE` —, mas
concede e encerra concessões. É a separação que o seed desenhou: quem distribui poder não é
quem define o que o poder faz.

**Decisões registradas.**

- **A abrangência é por célula, não por linha.** O passo 11.3 pede "seletor de abrangência por
  linha", e uma leitura literal custaria dados: a Ana tem `DELETE:REPORT:PROPRIA` ao lado de
  `UPDATE:REPORT:TURMA`, e um seletor por linha achataria os dois ao salvar. Cada célula tem o
  seu, e a última coluna — "a linha toda" — aplica uma abrangência a todas as ações do recurso
  de uma vez. A conveniência da linha existe; a perda de informação, não.
- **A matriz usa `<select>` nativo.** São 103 seletores numa tela só; 103 `Select` do Radix
  seriam 103 portais. O nativo é acessível, navegável por teclado, decente no celular e já
  recebe os 44 px de alvo de toque do `globals.css`. É a única tela do projeto que se afasta do
  componente do design system, e é por peso.
- **O catálogo se deriva do `enum Feature`.** Recursos e ações saem de `Object.values(Feature)`
  na hora de renderizar. Uma lista escrita à mão seria uma segunda fonte da verdade, e a
  primeira vez que o back ganhasse um recurso a tela mentiria calada.
- **A substituição está escrita na tela, não só no registro.** "Salvar substitui o conjunto
  inteiro. É assim que se remove uma permissão: deixando-a em '—' antes de salvar." Sem essa
  frase o `PATCH` que apaga permissões parece bug.
- **O botão de encerrar a própria concessão fica visível e desabilitado**, com o diálogo
  explicando que a API recusa porque quem se tira o próprio perfil pode ficar sem como
  devolvê-lo. Esconder faria o administrador procurar o botão; desabilitar com o porquê
  responde antes da pergunta.
- **O perfil de sistema não vira formulário escondido.** A tela dele é a mesma, inteira e
  desabilitada, com o aviso no topo e o caminho de saída: criar um perfil da escola com as
  permissões que quiser. Ver o que o Professor pode é metade do trabalho de desenhar o perfil
  seguinte.

### Fase 12 — Acessibilidade e polimento ✅ (02/09/2026)

**12.1 — auditoria de acessibilidade.** `axe-core` (já presente como dependência do
`eslint-plugin-jsx-a11y`) rodado dentro do `jsdom` contra o HTML **real** servido em `:3000`,
com as regras `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` e `best-practice`:

```
22 telas auditadas — 0 violações
```

A regra `color-contrast` foi desligada no axe porque o `jsdom` não resolve variáveis CSS de
folha externa: o contraste foi conferido à parte, calculando a razão WCAG token a token nos
dois temas. **Duas falhas reais apareceram e foram corrigidas:**

```
badge de sucesso, tema claro    4.35:1  →  --success #2e7d5b para #2b7455   →  4.90:1
borda de controle, ambos temas  1.29:1  →  --border-strong novo             →  3.70:1 / 3.30:1
```

A borda é o achado que importa. `--border` servia a cartão e a campo de formulário ao mesmo
tempo; num cartão a borda é decorativa e 1.29:1 não viola nada, mas num `input` ela é o que
delimita o controle, e aí vale o 1.4.11 (contraste de elemento não textual, mínimo 3:1). Em vez
de escurecer a borda de tudo, entrou `--border-strong`, usado por `Input`, `Textarea`, `Select`,
`Combobox`, `Checkbox` e `LevelPicker`.

**Não coberto pelo axe:** diálogos, menus e a gaveta do mobile só existem depois de interação, e
a auditoria lê HTML servido. A navegação por teclado foi conferida por estrutura — link "ir para
o conteúdo", `aria-label` em todo botão só de ícone, `role="alert"` nos erros de formulário,
`aria-live` no indicador de salvamento — mas não exercitada tecla a tecla, porque aqui só existe
HTTP.

**12.2 — skeletons e vazios.** Sete `loading.tsx` faltavam (abas da turma, nova postagem, e os
detalhes de responsável, professor e conta) e foram criados. Todos os 20 `DataTable` têm
`emptyTitle` e `emptyDescription` próprios; o único sem descrição é o catálogo de UI de
desenvolvimento.

**12.3 — microcopy.** O texto do 404 passou a dizer o que fazer e a admitir o caso que a Fase 9
revelou: "O endereço não existe, o conteúdo foi removido, **ou ele está fora do que o seu perfil
alcança**. Volte ao início e navegue pelo menu." Era o texto que mais mentia — fora de escopo a
API responde 404, e o usuário lia "não existe" sobre uma criança que existe.

**12.4 — responsividade.** Auditada por estrutura: nenhuma largura fixa acima de 360 px em todo
o `src`, toda tabela dentro do `TableWrapper` com `overflow-x-auto` (inclusive a matriz de
permissões, de 8 colunas), e todo grid de mais de uma coluna atrás de `sm:` ou `md:`. A
confirmação visual nos três tamanhos precisa de navegador, que aqui não existe.

**12.5 — performance. O orçamento do plano não é alcançável, e o número diz por quê.** Medido
com o próprio servidor comprimindo (`content-encoding: gzip`), somando todo `<script src>` da
resposta:

```
/403    (título, parágrafo e link)   207,0 kB gzip   ← piso do framework
/feed                                258,3 kB gzip   ← app custa 51 kB
/roles/[roleId]  (matriz)            327,0 kB gzip
/students                            345,4 kB gzip
```

React 19.2.8 mais o runtime de cliente do App Router do Next 16.3.3 custam **207 kB gzip antes
da primeira linha de código do projeto**. O orçamento de 250 kB deixaria 43 kB para uma
aplicação inteira. O que o feed acrescenta são primitivos do Radix efetivamente usados —
`Select` nos três filtros, `Popover` na busca de aluno, `Dialog` na gaveta do mobile,
`DropdownMenu` no menu da conta, `Toast` — mais o TanStack Query. Nada disso é supérfluo.

O que **foi** cortado: o `Avatar`, componente mais renderizado do sistema, deixou de ser Client
Component. Ele usava o primitivo do Radix só para o estado de carregamento da imagem. Ganho
medido: 1 kB gzip e uma fronteira de cliente a menos em toda tela que mostra gente.

> **Correção de 02/09/2026.** A primeira versão desta troca usava `<img alt="">` por cima das
> iniciais, na suposição de que o navegador colapsaria a imagem que falha. **Era falso**, e
> quebrou todo avatar do sistema — ninguém no seed tem foto, a API responde 404 em
> `/people/:id/photo`, e cada avatar virou ícone de imagem quebrada. Ver o registro de correção
> abaixo.

Também testado e **revertido**: `optimizePackageImports` para `radix-ui` e `lucide-react` não
mudou um byte — os hashes de conteúdo dos chunks saíram idênticos, porque o Turbopack já faz
esse tree-shaking. Config morta não fica.

O achado colateral: `zod` custa **82 kB gzip** e entra em toda tela com formulário — é o que faz
`/students` pesar mais que o feed. Fica registrado para a Fase 13 decidir.

As imagens: as do feed, da galeria, do gerenciador de mídia e da foto de perfil saem com
`loading="lazy"` e `width`/`height` declarados. O `<img>` do lightbox ganhou dimensões mas
**não** ganhou `lazy`: é o conteúdo que o usuário acabou de pedir para ver.

**12.6 — erros por segmento.** `error.tsx` novo em `(app)`, no feed e no relatório, cada um
dizendo o que continua de pé: "o resto do sistema continua funcionando", "as postagens continuam
no servidor", "o que já estava salvo continua salvo — o relatório se grava a cada alteração".
`not-found.tsx` e `403/page.tsx` já tinham texto próprio.

**12.7 — metadata por rota.** Doze rotas de detalhe trocaram `metadata` estático por
`generateMetadata`, e o título passou a nomear a coisa:

```
antes   Aluno · Zelo          Relatório · Zelo        Alunos da turma · Zelo
depois  Théo Carvalho · Zelo  Relatório de Helena Nunes · Zelo  Alunos · Maternal I A · Zelo
```

Cada uma usa `cache()` do React para que `generateMetadata` e a página compartilhem uma busca só
— o `serverApi` usa `cache: 'no-store'`, então a memoização de `fetch` do Next não é garantia, e
sem isso todo detalhe faria duas chamadas à API. O `/feed/[postId]`, que já tinha
`generateMetadata` desde a Fase 4, era exatamente esse caso e foi corrigido junto. O
`robots: noindex` já estava no layout raiz desde a Fase 3.

**12.8 — offline.** Faixa no topo da shell quando `navigator.onLine` cai, por
`useSyncExternalStore` nos eventos `online`/`offline` — com `getServerSnapshot` devolvendo
`true`, senão a faixa piscaria na hidratação.

A trava da mutação **não** ficou no `useApiAction`: metade das telas escreve por caminho próprio
(o autosave do relatório, as reações otimistas, o compositor). Ela ficou no `clientApi`, por onde
toda escrita passa — `POST`, `PUT`, `PATCH` e `DELETE` offline lançam `ApiError` 503 antes de
tocar a rede, e cada componente já tinha o `catch` que vira aviso. Uma regra, um lugar, todas as
telas.

**Verificação.** `npm run lint` e `npm run build` limpos; 28 rotas sem regressão; zero exceção no
log do Next; 22 telas com zero violação no axe.

**Decisões registradas.**

- **O orçamento de 250 kB fica registrado como não cumprido, com o número no lugar da desculpa.**
  Falsear seria fácil — `next/dynamic` tira o chunk da lista de `<script src>` e o navegador o
  baixa meio segundo depois. Isso passaria na régua sem melhorar nada para a família no ponto de
  ônibus. O que dá para dizer com honestidade é: o app custa 51 kB, e o piso é do framework.
- **`jsdom` entrou como devDependency antes da suíte.** A §7 adiou a suíte para depois desta
  fase, mas o 12.1 pede auditoria com axe, e auditoria sem ferramenta é opinião. O `jsdom` é a
  mesma dependência que o ambiente do Vitest vai usar — foi antecipar, não desviar.
- **`--border-strong` em vez de escurecer `--border`.** Cartão e campo têm exigências diferentes
  de contraste porque cumprem papéis diferentes. Um token só para os dois obrigaria a escolher
  entre violar o 1.4.11 nos campos e engrossar a borda de todo cartão do sistema.

### Correção — avatar quebrado e recorte de foto em branco (02/09/2026)

Dois defeitos achados **usando o sistema no navegador**, que é justamente o que nenhuma régua
deste projeto alcança: aqui só existe HTTP.

**1. Avatar virava ícone de imagem quebrada — regressão da Fase 12.** A troca do `Avatar` por
Server Component apostou que `alt=""` faria o navegador colapsar uma imagem que falha. Não faz:
`alt=""` tira a imagem da árvore de acessibilidade, não suprime o ícone de quebra. E como
`width`/`height` estavam declarados, a caixa ainda era reservada — o ícone aparecia em tamanho
cheio. Medido depois do relato:

```
GET /api/v1/people/:id/photo   →  404 para as 6 primeiras pessoas do seed
```

Ninguém no seed tem foto, então **todo** avatar do sistema estava quebrado.

A correção mantém o `Avatar` como Server Component e troca o `<img>` por um `<span>` com
`background-image` sobreposto às iniciais: fundo que falha não pinta nada, e as iniciais
continuam à vista. Sem JavaScript, sem ícone de quebra, sem requisição a mais. O preço é o
`loading="lazy"`, que não existe para background — aceitável em imagem de 32 a 64 px. Conferido
em 9 telas: 53 avatares, zero imagem quebrada.

O `PhotoManager` passou a usar o mesmo `Avatar` em vez do `<img>` próprio, então a tela de foto
de perfil também mostra as iniciais de quem ainda não enviou nada — era o que o relato pedia.

**2. O recorte de foto abria em branco — defeito desde a Fase 7.** O `SquareCropper` criava a
`objectURL` no inicializador do `useState` e a revogava na limpeza de um efeito separado. Sob
`reactStrictMode` — ligado no `next.config.ts` desde a Fase 0 —, o React monta, desmonta e
remonta em desenvolvimento. Reproduzido fora do navegador, com React e StrictMode de verdade:

```
ANTIGO   criou blob:1 · criou blob:2 · renderiza com blob:1 · REVOGOU blob:1
         → o src aponta para uma URL revogada: a imagem quebra (e blob:2 vazou)
NOVO     criou blob:1 · revogou blob:1 · criou blob:2 · renderiza com blob:2
         → o src aponta para uma URL viva: a imagem carrega
```

A correção é criar e revogar **no mesmo efeito**, que é o que torna a remontagem inofensiva. O
inicializador do `useState` tinha entrado na Fase 7 para calar o `react-hooks/set-state-in-effect`
— a regra estava certa sobre o sintoma e errada sobre a cura; agora o `setState` no efeito volta,
com `eslint-disable-next-line` e o porquê no comentário.

**O que isso ensina para a suíte que vem a seguir.** Os dois defeitos são invisíveis para
qualquer verificação por HTTP: um depende de como o navegador desenha imagem que falha, o outro
do ciclo de vida de efeito do React. O segundo, porém, foi reproduzido com `react-dom/client` em
`jsdom` — exatamente a camada "Componente" da §7. É argumento para ela não ficar só nos
formulários.
