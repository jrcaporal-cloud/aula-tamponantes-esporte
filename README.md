# Ácido, Base e Performance

Aula interativa sobre substratos tamponantes no exercício (bicarbonato, beta-alanina e companhia), para pós-graduação.
React 19 + TypeScript + Vite + Tailwind v4 + framer-motion + React Three Fiber. Mesmo motor da aula "Fisiologia do Doping no Esporte".

56 slides em 7 atos, com um fio narrativo de inquérito: a fadiga é o crime, o ácido lático é o suspeito de sempre,
a fisiologia é a perícia, bicarbonato e beta-alanina são as testemunhas, a metodologia é o contra-interrogatório e a prática é o veredito.
Quatro personagens fictícios (Júlia, 800 m; Rafael, jiu-jítsu; Carlos, remo master hipertenso; Bianca, natação vegetariana) atravessam a aula.

## Como usar na sala

| Tecla | O que faz |
|---|---|
| `→` `Espaço` `PageDown` | avança um passo; ao fim dos passos, vai ao próximo slide |
| `←` `PageUp` | volta |
| `G` | visão geral de todos os slides |
| `P` | janela do apresentador (notas, ritmo, cronômetro), sincronizada com a aula |
| `D` | abre/fecha as fontes do slide |
| `F` | tela cheia |
| `3` | modelo 3D: fibra muscular sob carga ácida (slides 26 e 29), jornada do bicarbonato (42 e 46), beta-alanina → carnosina (61, 62 e 64). Dentro do modelo: ←/→ trocam a etapa, clique fixa uma estrutura, Esc solta/fecha |

O endereço acompanha o ponto da aula (`#/27/3` = slide 27, terceiro passo).

### Versões por tempo

A aula completa leva cerca de 3h20 com discussão. Parâmetros na URL escondem os slides de aprofundamento (nada é apagado):

- `?tempo=120` — cerca de 2h
- `?tempo=90` — cerca de 1h30
- `?tempo=60` — cerca de 1h

As listas estão em `src/data/modes.ts`.

### Sem internet

Depois da primeira visita (com internet), a aula abre e roda offline (service worker em `public/sw.js`).

## De onde vêm os números

Toda afirmação numérica vem dos dossiês de pesquisa em `docs/dossie/` (01 bicarbonato, 02 beta-alanina, 03 fisiologia,
04 outros e combinações, 05 metodologia, 06 prática, segurança e regulação). Cada referência foi conferida na fonte primária
(Europe PMC/PubMed/texto oficial); cada dossiê termina com uma seção "Não citar" com o que foi checado e não confirmado.
Simulações didáticas levam o selo "valores ilustrativos"; contas próprias, "cálculo"; personagens, "caso fictício".

## Para editar

- Roteiro: `docs/ROTEIRO.md`. Regras de construção: `docs/BRIEF-CONSTRUCAO.md`.
- Texto e fontes de cada ato: `docs/fragmentos/ato-N.json`; notas do apresentador: `docs/fragmentos/ato-N.notas.json`.
  Depois de editar, rode `python3 scripts/montar-aula.py` (gera `src/data/parsedPresentation.json` e `src/data/notas.json`).
- Simuladores: `src/components/sims/Nome.tsx` (export default, sem props; `useSlideSteps(n)` para os passos). Entram pelo token `[[COMP:Nome]]`. Bancada isolada: `?sim=Nome`.
- Modelos 3D: `src/components/three/models/nome.tsx` (registro automático pelo nome do arquivo; ligação com o slide em `src/components/deck/models3d.ts`). Bancada: `?model=nome`.
- Checagem de um simulador ou slide: `node scripts/qa/sim-check.mjs <Nome|#/n> <porta> [pasta] [1280x720]`.

```bash
npm install
npm run dev      # ou o launch "aula-tamponantes" (porta 5330)
npm run build    # tsc + vite build
npm run lint
npm test         # estrutura da aula: atos, notas, versões por tempo, fontes, modelos 3D
```
