# Brief comum de construção — aula "Ácido, Base e Performance"

Projeto: `/Users/mac/projetos claude/aula-tamponantes-esporte` (React 19 + TS estrito + Vite 7 + Tailwind v4 + framer-motion + R3F/drei).
Leia antes de começar: `docs/ROTEIRO.md` (seu ato), os dossiês em `docs/dossie/` que o seu ato cita (são a FONTE ÚNICA dos números)
e o kit `src/components/sims/kit/` (palette.ts, ui.tsx, format.ts, useTween.ts).
Referência de qualidade (só LEITURA, outro projeto): `/Users/mac/projetos claude/aula-fisiologia-doping/src/components/sims/`
(`CardioSim.tsx` e `cardio/`, `PeptideVoteSim.tsx`, `PeptideEvidenceSim.tsx`, `EssendonSim.tsx`, `ConsultorioSim.tsx`).
Público: pós-graduação em medicina do esporte/nutrição. Professor: Rinaldo Caporal, nutricionista. Tudo em português do Brasil.

## Regras de conteúdo
- Só números que o dossiê marca como confirmados. Nada de `[NÃO CONFIRMADO]` nem itens da seção "Não citar". Cálculo próprio vai rotulado ("cálculo", "ilustrativo").
- Simulação didática com números inventados para a forma da curva = chip "valores ilustrativos". Personagens = chip "caso fictício".
- Storytelling: cada slide conta UMA ideia com começo, virada e consequência. Passos (passador) revelam a história; texto curto e direto, frases de quem fala com médicos. Nada de clichê de marketing nem promessa de efeito.
- Sem protocolo de doping. Doses de suplemento legal podem aparecer como dado de estudo/consenso, sempre com a fonte.

## Regras técnicas dos simuladores
- Um arquivo por slide em `src/components/sims/<Nome>.tsx` (export default, SEM props). Peças auxiliares em `src/components/sims/<pasta-do-seu-ato>/` (ex.: `ato3/`). Arquivos de até ~250 linhas; dados/texto em `content.ts` separado.
- Passos pelo passador: `const { step, setStep } = useSlideSteps(N)` (`src/store/useSlideSteps.ts`). Use `StepTabs` do kit quando houver abas. O passador SEMPRE avança a história; mouse (hover/clique/slider) é extra.
- Caixa do simulador: largura útil **1136 px de projeto**, altura **≤ 516 px** (o título do slide ocupa o resto do palco 1280×720). Nada pode rolar nem estourar.
- Texto ≥ 14 px efetivos. Dentro de SVG com viewBox, fonte ≥ 16 e proporção do viewBox igual à da caixa (viewBox encolhe o texto junto). Use `SvgText` do kit.
- Cores: SEMPRE do `kit/palette.ts` (ciano = base/tampão, laranja = ácido/H⁺, âmbar = lactato, violeta = carnosina/β-alanina, lima = sódio, ardósia = CO₂, rosa = risco). Fundo dos painéis: `Panel`/`PANEL_BG`.
- framer-motion: NÃO anime atributo geométrico de SVG (r, cx, d, x, y, width) com keyframes do framer (gera "Expected length, undefined"); use `<animate>` do SVG, transform/opacity, ou escrita imperativa por rAF. Sem `AnimatePresence mode="wait"` em texto de passo (use `key={step}` com fade). Respeite `useReducedMotion()`.
- Lint `react-hooks/refs`: não ler `.current` no render nem passar ref para função durante o render. `react-hooks/static-components`: não crie componente dentro de render.
- Imutabilidade, nomes claros, comentários na densidade do código vizinho (curtos, em português).
- NÃO edite arquivos fora do seu escopo (kit, deck, presentation, data, outros atos). Se faltar algo no kit, crie a peça na sua pasta.

## Entregáveis do seu ato
1. Os simuladores (`.tsx`) do seu ato, cada um com o nome exato do roteiro.
2. `docs/fragmentos/ato-<N>.json`: array, na ordem do roteiro, com os slides do ato no formato
   `{"id": <id>, "sectionName": "Ato <romano> · <nome do ato>", "number": "", "layout": "prose", "title": "...", "subtitle": "...", "content": "[[COMP:Nome]]<h4>Fontes</h4><ul><li>Citação completa — o que o slide usa dela.</li>…</ul>", "cards": []}`.
   Citação no estilo: `Autor AB et al. Título. Revista Ano;Vol(N):páginas.` Títulos dos slides em Title Case português como no roteiro; subtítulo = a pergunta ou a tese do slide (1 linha).
   Slide de citação (sem simulador): `"title": ""` e `"content": "<p class=\"quote-text reveal\">… <span class=\"hl-base\">…</span></p>"` (classes `hl-base`, `hl-acid`, `hl-carno`).
3. `docs/fragmentos/ato-<N>.notas.json`: objeto `{ "<id>": { "minutos": n, "mensagem": "...", "pergunta": "...", "transicao": "..." } }` — `mensagem` é o que o professor precisa dizer (2–3 frases), `pergunta` um gancho para a turma, `transicao` a frase que leva ao próximo slide. `minutos` = o do roteiro.

## Verificação obrigatória (antes de responder)
1. Suba seu próprio servidor em segundo plano, na SUA porta: `node node_modules/vite/bin/vite.js --port <PORTA> --strictPort` (no diretório do projeto). Derrube-o no fim.
2. Para cada simulador: `node scripts/qa/sim-check.mjs <Nome> <PORTA> <pasta-de-capturas> 1280x720` e de novo com `1920x1080`. Zero erros de console, zero estouro, zero texto < 14 px.
3. ABRA (ferramenta Read) as capturas de pelo menos um passo de cada simulador e olhe de verdade: hierarquia, legibilidade, nada sobreposto, cara de aula de pós (não de dashboard genérico). Renderizar não é olhar.
4. `npx tsc -b` e `npx eslint <seus arquivos>` limpos nos SEUS arquivos (erros de arquivos de outros atos em construção não são seus: ignore-os).
5. Resposta final em ≤ 20 linhas: arquivos criados, o que cada sim faz em 1 linha, resultado das checagens, pendências.

Observação: a bancada `?sim=Nome` agora renderiza o simulador dentro do slide real (com título e subtítulo de tamanho real), então o que passa na bancada cabe na aula.
