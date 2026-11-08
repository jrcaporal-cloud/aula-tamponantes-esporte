# Padrão dos dossiês de pesquisa — aula "Substratos tamponantes no exercício"

Público: pós-graduação (medicina do esporte / nutrição esportiva). Professor: Rinaldo Caporal, nutricionista.
A aula promete arcabouço científico forte: ensaios clínicos, meta-análises, metodologia dissecada, com storytelling.
Tudo em português do Brasil. O dossiê é a FONTE ÚNICA dos números da aula: o que não estiver aqui, conferido, não entra.

## Regra de ouro: nada sem conferência
- Confira CADA referência na fonte primária: Europe PMC (https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=...&format=json&resultType=core traz o abstract), PubMed, DOI, PMC ou página da revista. Use curl/WebFetch/WebSearch.
- Todo número (n, dose, %, SMD, IC95%, p, I²) precisa ter sido LIDO no abstract ou no texto completo. Se veio de memória, de revisão secundária ou de blog e você não achou na fonte, marque `[NÃO CONFIRMADO]` ou deixe de fora.
- Se uma referência que você "lembra" não existe ou tem autor/ano/revista diferentes, registre isso na seção "Não citar".
- Prefira: meta-análises, revisões sistemáticas, position stands (ISSN, IOC, AIS), ECRs duplo-cegos cruzados, estudos com atletas treinados. Inclua também resultados NULOS e negativos (são ótimos para a aula).

## Formato de cada estudo (um bloco por referência)
```
### [ID curto, ex.: CARR2011]
- Citação: Autores (até 3 + et al.). Título. Revista Ano;Vol(N):páginas. DOI · PMID
- Desenho: (meta-análise / RS / ECR cruzado duplo-cego / paralelo / observacional / mecanístico)
- Amostra: n, sexo, nível (use o Tier de McKay 2022: 0 sedentário … 5 classe mundial, se der para inferir), esporte
- Intervenção: substância, dose (g/kg ou g/dia), forma (pó, cápsula, entérica), momento, duração; comparador/placebo exato
- Teste de desempenho: tipo (contrarrelógio, tempo até exaustão, sprints repetidos, Wingate, luta simulada, repetições…), duração aproximada
- Resultado principal COM NÚMEROS: (média, %, SMD/g de Hedges com IC95%, p; para meta-análise: k estudos, n total, efeito agrupado, I², moderadores)
- Efeitos colaterais / desconforto GI / cegamento: o que relataram
- Limitações metodológicas: (amostra, teste pouco confiável, placebo, cegamento quebrado, viés de publicação, financiamento)
- Ponto de ensino: 1–2 frases do que esse estudo ensina na aula
- Verificação: `confirmado no abstract` / `confirmado no texto completo` / `parcial: …`
```

## Seções obrigatórias no fim de cada dossiê
1. **Síntese em 10 linhas** — o que a evidência diz, com o grau de certeza.
2. **Números-âncora para slides** — lista curta (≤15) dos números mais didáticos, cada um com o ID da fonte.
3. **Histórias verificáveis (storytelling)** — episódios reais, datados e com fonte, que prendem a turma (história da ciência, caso de equipe, virada de paradigma, achado inesperado). Nada de anedota sem fonte.
4. **Ideias de visualização** — conceitos difíceis que pediriam animação 2D ou modelo 3D interativo, e o que o espectador deveria "ver" acontecer.
5. **Armadilhas** — erros comuns que professores e blogs repetem sobre o tema (e a correção, com fonte).
6. **Não citar** — referências ou números que você checou e NÃO confirmou (ou que estão errados), com o motivo.

## Entrega
- Escreva o arquivo Markdown no caminho indicado no seu briefing (use Bash com heredoc; crie a pasta se faltar).
- Tamanho: denso, sem enrolação. Entre 20 e 40 referências bem conferidas valem mais que 80 por cima.
- Sua resposta final (para o orquestrador) deve ter no máximo 25 linhas: caminho do arquivo, nº de referências confirmadas, as 5 descobertas mais importantes para a aula e o que ficou sem confirmação.
