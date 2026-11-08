# Dossiê 01 — Bicarbonato de sódio (NaHCO₃)

Aula: "Substratos tamponantes no exercício" (pós-graduação). Conferência feita em 04/11/2026 na API do Europe PMC (abstract) e, quando havia PMC aberto, no texto completo. Nada abaixo vem de memória sem marca.
Legenda de nível (McKay 2022, inferido do texto do estudo): T1 = recreacionalmente ativo; T2 = treinado; T3 = altamente treinado/nacional; T4 = elite/internacional; T5 = classe mundial.
Siglas: SB = bicarbonato de sódio; PLA = placebo; TT = contrarrelógio; TTE = tempo até exaustão; CCT110 = teste de capacidade no ciclismo a 110% da potência máxima; GI = gastrintestinal; DMP = diferença média padronizada (SMD).

---

## 0. A química e a conta do sódio (para o slide de abertura)

- Massa molar: Na 22,990 + H 1,008 + C 12,011 + O₃ 47,997 = **84,006 g/mol**. Fração de sódio = 22,990/84,006 = **27,37 %** (Kahle 2013 escreve "27% sodium" no abstract — KAHLE2013).
- 0,3 g/kg = 3,57 mmol/kg (Carr 2011 arredonda para "3,5 mmol/kg ≈ 0,3 g/kg" — CARR2011MA).
- No estômago: NaHCO₃ + HCl → NaCl + H₂O + **CO₂**. O acúmulo de CO₂ no trato GI é o mecanismo citado para distensão, náusea, vômito e dor (ISSN2021; ANTONIO2026). A parte não neutralizada segue ao intestino como carga de soluto; a ISSN lembra que cápsula entérica protege o estômago, mas "provavelmente não" previne **diarreia osmótica** (ISSN2021, texto completo).

| Atleta | NaHCO₃ a 0,3 g/kg | Sódio | × teto OMS (< 2 g Na/dia) | Equivale a sal (NaCl) | CO₂ teórico máximo* |
|---|---|---|---|---|---|
| 60 kg | 18,0 g | **4,9 g** | 2,5× | ~12,5 g | ~5,5 L |
| 75 kg | 22,5 g | **6,2 g** | 3,1× | ~15,7 g | ~6,8 L |
| 90 kg | 27,0 g | **7,4 g** | 3,7× | ~18,8 g | ~8,2 L |

Cálculo próprio (verificado em Python). Teto OMS conferido na página da OMS (fact sheet "Sodium reduction": "less than 2000 mg/day of sodium (equivalent to less than 5 g/day salt)"). *CO₂ a 37 °C e 1 atm se TODO o bicarbonato reagisse com HCl — é teto teórico didático, não volume medido (o estômago não tem ácido para reagir tudo de uma vez). A revisão ANTONIO2026 dá o mesmo exemplo: 70 kg → 21 g SB → ~5,75 g de sódio, "mais que o dobro" dos 2,4 g/dia do NHS. Kahle 2013 compara com o UL de 2.300 mg/dia das DRIs.

---

## 1. Meta-análises, revisões guarda-chuva e posicionamentos

### MATSON1993
- Citação: Matson LG, Tran ZV. Effects of sodium bicarbonate ingestion on anaerobic performance: a meta-analytic review. Int J Sport Nutr 1993;3(1):2-28. DOI 10.1123/ijsn.3.1.2 · PMID 8388767
- Desenho: meta-análise (a primeira do tema).
- Amostra: 29 investigações.
- Intervenção: NaHCO₃ em doses variadas × placebo/controle.
- Teste: provas "anaeróbias" diversas, incluindo TTE.
- Resultado: alcalose extracelular clara; dose só moderadamente relacionada ao aumento de pH e HCO₃⁻. Efeitos de **−0,12 a 2,87**; nos estudos de TTE, **+27 ± 20 %** de duração. Efeito fracamente relacionado ao grau de alcalose; os 19 estudos positivos tiveram maior aumento de pH, dose um pouco maior e maior queda de pH no exercício que os 16 nulos.
- GI/cegamento: não relatado no abstract.
- Limitações: era pré-PRISMA; TTE infla % (teste pouco confiável); sem IC agrupado no abstract.
- Ponto de ensino: desde 1993 a heterogeneidade é a regra — "funciona em média, com dispersão enorme".
- Verificação: confirmado no abstract.

### CARR2011MA
- Citação: Carr AJ, Hopkins WG, Gore CJ. Effects of acute alkalosis and acidosis on performance: a meta-analysis. Sports Med 2011;41(10):801-814. DOI 10.2165/11591440-000000000-00000 · PMID 21923200
- Desenho: meta-análise de modelo misto (SB, citrato, cloreto de amônio), efeitos em % de potência média.
- Amostra: 59 estudos/188 observações; para SB, 38 estudos e 137 estimativas após excluir EP > 2,7 % (redução de viés de publicação).
- Intervenção: dose típica 3,5 mmol/kg (~0,3 g/kg).
- Teste: provas de alta intensidade; modelo para 1 sprint de 1 min.
- Resultado: SB **+1,7 % (LC90 ± 2,0 %)** na potência média em sprint único de 1 min, cego, atletas homens ("possivelmente moderado"). Moderadores: +0,5 % (±0,6) por +1 mmol/kg de dose; +0,6 % (±0,4) com 5 sprints a mais; −0,6 % (±0,9) a cada 10× na duração (ex.: 1→10 min); **−1,1 % (±1,1) em não atletas; −0,7 % (±1,4) em mulheres**. Variação não explicada entre cenários ±1,2 %. Citrato 0,0 % (±1,3); NH₄Cl (acidose) **−1,6 % (±1,9)** — efeito "igual e oposto". Recomendação dos autores: 0,3–0,5 g/kg.
- GI: os autores pedem quantificação futura de sintomas GI.
- Limitações: inferência "magnitude-based"; poucos estudos em mulheres; dose extrapolada.
- Ponto de ensino: o espelho alcalose (+1,7 %) × acidose (−1,6 %) é o melhor argumento de que o pH sanguíneo importa.
- Verificação: confirmado no abstract.

### PEART2012
- Citação: Peart DJ, Siegler JC, Vince RV. Practical recommendations for coaches and athletes: a meta-analysis of sodium bicarbonate use for athletic performance. J Strength Cond Res 2012;26(7):1975-1983. DOI 10.1519/JSC.0b013e3182576f3d · PMID 22505127
- Desenho: meta-análise.
- Amostra/Intervenção/Teste: [NÃO CONFIRMADO — abstract sem números; texto completo pago].
- Resultado: efeito geral "moderado", **significativamente menor em participantes especificamente treinados do que em recreacionalmente treinados**.
- Limitações: não entrou na revisão guarda-chuva de Grgic 2021 (GRGIC2021UMB).
- Ponto de ensino: quanto mais treinado, menor a margem — aviso para o atleta de elite.
- Verificação: parcial — só a conclusão qualitativa; nenhum ES deste estudo deve ir a slide.

### CHRISTENSEN2017
- Citação: Christensen PM, Shirai Y, Ritz C, Nordsborg NB. Caffeine and bicarbonate for speed. A meta-analysis of legal supplements potential for improving intense endurance exercise performance. Front Physiol 2017;8:240. DOI 10.3389/fphys.2017.00240 · PMID 28536531
- Desenho: meta-análise só de testes de desempenho de "final fechado" (TT, trabalho em tempo fixo) de ~45 s a 8 min, placebo-controlados.
- Amostra: 25 estudos de SB (n = 235, segundo a tabela de GRGIC2021UMB).
- Resultado: SB **ES 0,40 (IC95 0,27–0,54), p < 0,001**; cafeína 0,41 (0,15–0,68); nitrato 0,19 (−0,03–0,40); beta-alanina 0,17 (−0,12–0,46).
- Limitações: Cohen's d em desenho cruzado; I² não informado.
- Ponto de ensino: quando o teste é corrida contra o relógio de 45 s–8 min (o que a medalha mede), SB e cafeína empatam.
- Verificação: confirmado no abstract (n = 235 confirmado no texto completo de GRGIC2021UMB).

### LOPESSILVA2019RSA
- Citação: Lopes-Silva JP, Choo HC, Franchini E, Abbiss CR. Isolated ingestion of caffeine and sodium bicarbonate on repeated sprint performance: a systematic review and meta-analysis. J Sci Med Sport 2019;22(8):962-972. DOI 10.1016/j.jsams.2019.03.007 · PMID 31036532
- Desenho: RS + meta-análise.
- Amostra: 6 estudos de SB (n = 77, tabela de GRGIC2021UMB).
- Teste: sprints repetidos (RSA).
- Resultado: SB não melhorou trabalho total (g 0,43; IC95 −0,11 a 0,97; p = 0,12), melhor sprint (0,02; −0,30 a 0,34) nem último sprint (0,20; −0,13 a 0,52). I² 0 %, 0 % e 69 %.
- Ponto de ensino: sprints curtos repetidos com pausa — evidência NULA. Bom contraponto ao marketing para esportes coletivos.
- Verificação: confirmado no abstract (n e I² no texto completo de GRGIC2021UMB).

### LOPESSILVA2019WING
- Citação: Lopes-Silva JP, Reale R, Franchini E. Acute and chronic effect of sodium bicarbonate ingestion on Wingate test performance: a systematic review and meta-analysis. J Sports Sci 2019;37(7):762-771. DOI 10.1080/02640414.2018.1524739 · PMID 30319077
- Desenho: RS + meta-análise (6 agudos, 3 crônicos).
- Resultado: agudo — pico g 0,02 (−0,19 a 0,23), média 0,15 (−0,06 a 0,36): nulo. Crônico — pico **1,21 (0,83–1,42)**, média **1,26 (0,96–1,56)**. I² crônico 27 % (pico) e **88 % (média)**.
- Limitações: crônico = só 3 estudos, com desenhos entre grupos; ES "grande" com I² 88 % — interpretar com muita cautela.
- Ponto de ensino: Wingate isolado de 30 s não responde ao SB agudo.
- Verificação: confirmado no abstract (I² no texto completo de GRGIC2021UMB).

### GRGIC2020
- Citação: Grgic J, Rodriguez RF, Garofolini A, et al. Effects of sodium bicarbonate supplementation on muscular strength and endurance: a systematic review and meta-analysis. Sports Med 2020;50(7):1361-1375. DOI 10.1007/s40279-020-01275-y · PMID 32096113
- Desenho: RS + meta-análise de efeitos aleatórios.
- Amostra: 13 estudos de resistência muscular (12 na meta-análise; n = 113) e 11 de força (n = 110).
- Teste: repetições até a falha, trabalho isocinético, tempo isométrico; força = pico de força/torque/1RM.
- Resultado: resistência muscular **DMP 0,37 (IC95 0,15–0,59), p = 0,001**; grupos pequenos 0,31 (0,04–0,59), grandes 0,40 (0,13–0,66). Força **−0,03 (−0,18 a 0,12), p = 0,725** (repouso 0,02; fadigado −0,16). Sem tendência por momento de ingestão nem por aumento de HCO₃⁻. I² 70 % (resistência), 45 % (força).
- Ponto de ensino: SB não deixa ninguém mais forte; ajuda a repetir mais quando a acidose limita.
- Verificação: confirmado no abstract (I² e n no texto completo de GRGIC2021UMB).

### GRGIC2021UMB
- Citação: Grgic J, Grgic I, Del Coso J, Schoenfeld BJ, Pedisic Z. Effects of sodium bicarbonate supplementation on exercise performance: an umbrella review. J Int Soc Sports Nutr 2021;18(1):71. DOI 10.1186/s12970-021-00469-7 · PMID 34794476
- Desenho: revisão guarda-chuva (AMSTAR 2 + GRADE).
- Amostra: 8 meta-análises (média AMSTAR 70 %); 77–100 % dos participantes eram homens.
- Resultado: evidência **moderada** para pico/média de potência no Wingate e Yo-Yo; **baixa** para provas de ~45 s–8 min, resistência muscular e remo 2.000 m. ES de 0,09 a 1,26; provas 45 s–8 min, resistência muscular e Yo-Yo convergem em 0,36–0,40. Nulos: potência média geral, força, sprints repetidos. Tabela: Yo-Yo (Grgic, 5 estudos, n = 46) 0,36 (0,10–0,63), I² 14 %; remo (Turnes, 5 estudos, n = 52) **+1,4 % (LC90 0,1–2,6 %)**.
- Ponto de ensino: o grau de certeza é baixo-moderado — nenhuma conclusão "alta".
- Verificação: confirmado no texto completo (PMC8600864).

### ISSN2021
- Citação: Grgic J, Pedisic Z, Saunders B, et al. International Society of Sports Nutrition position stand: sodium bicarbonate and exercise performance. J Int Soc Sports Nutr 2021;18(1):61. DOI 10.1186/s12970-021-00458-w · PMID 34503527
- Desenho: posicionamento.
- Conclusões-chave: 0,2–0,5 g/kg melhora resistência muscular, esportes de combate (boxe, judô, caratê, taekwondo, luta olímpica) e ciclismo, corrida, natação e remo de alta intensidade; efeito sobretudo em tarefas de **30 s a 12 min**; homens e mulheres; **0,2 g/kg = dose mínima, 0,3 g/kg = ótima**, 0,4–0,5 g/kg sem ganho extra e com mais efeitos adversos; janela **60–180 min**; protocolos de vários dias (3–7 dias, 0,4–0,5 g/kg/dia fracionado em 0,1–0,2 g/kg nas refeições); uso crônico no treino pode ampliar adaptações; efeitos colaterais mais comuns: distensão, náusea, vômito, dor abdominal; estratégias: dose menor, ~180 min antes, com refeição rica em carboidrato, cápsula entérica; parte do efeito parece placebo.
- Texto completo: história — Dennig e colegas (Harvard Fatigue Laboratory) em estudo de **um único participante, 10 g de SB**; marco moderno = Jones et al. 1977 (JONES1977).
- Limitações: a tabela de estudos tem erro de unidade em Tobias 2013 ("6,4 g/kg" de beta-alanina — o correto é g/dia; ver TOBIAS2013) e data "Felippe 2013" para o estudo publicado em 2016 (FELIPPE2016).
- Ponto de ensino: é o "documento de bolso" para a prática.
- Verificação: confirmado no abstract e texto completo (PMC8427947).

### IOC2018
- Citação: Maughan RJ, Burke LM, Dvorak J, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med 2018;52(7):439-455. DOI 10.1136/bjsports-2018-099027 · PMID 29540367
- Desenho: consenso.
- Conteúdo (tabela 3, texto completo): dose aguda única **0,2–0,4 g/kg, 60–150 min antes**; alternativas: doses fracionadas em 30–180 min ou carga seriada (3–4 doses/dia por 2–4 dias); **~2 % em esforços de ~60 s**, eficácia reduzida acima de 10 min; para reduzir GI: junto com pequena refeição rica em carboidrato (~1,5 g/kg), citrato de sódio como alternativa, dose fracionada. SB está entre os poucos com "boa evidência" (cafeína, creatina, nitrato, SB e "possivelmente" beta-alanina).
- Ponto de ensino: o COI coloca o SB no "grupo de elite" dos suplementos, mas com a ressalva do GI.
- Verificação: confirmado no texto completo (PMC5867441).

### DEOLIVEIRA2022
- Citação: de Oliveira LF, Dolan E, Swinton PA, et al. Extracellular buffering supplements to improve exercise capacity and performance: a comprehensive systematic review and meta-analysis. Sports Med 2022;52(3):505-526. DOI 10.1007/s40279-021-01575-x · PMID 34687438
- Desenho: RS + meta-análise bayesiana hierárquica (a maior do tema).
- Amostra: 189 artigos, 2.019 participantes (158 com SB).
- Resultado: HCO₃⁻ sanguíneo **+5,2 mmol/L (ICr95 4,7–5,7)**; efeito geral **ES0,5 = 0,17 (0,12–0,21)**; 0,5–10 min: 0,18 (0,13–0,24); > 10 min: 0,22 (0,10–0,33). Aumentos médios (4–6 mmol/L) ou grandes (> 6) de HCO₃⁻ > pequenos (≤ 4): β = 0,16 (0,02–0,32) e 0,13 (−0,03 a 0,29). SB > citrato: β = 0,10 (−0,02 a 0,22). Moderadores: tipo e duração do exercício, nível de treino, exercício prévio.
- Ponto de ensino: efeito médio PEQUENO (0,17) — a média de 189 estudos é bem menor que o de um ensaio bonito isolado.
- Verificação: confirmado no abstract.

### SAUNDERS2022F
- Citação: Saunders B, Oliveira LF, Dolan E, et al. Sodium bicarbonate supplementation and the female athlete: a brief commentary with small scale systematic review and meta-analysis. Eur J Sport Sci 2022;22(5):745-754. DOI 10.1080/17461391.2021.1880649 · PMID 33487131
- Desenho: RS + meta-análise bayesiana em mulheres.
- Amostra: 149 artigos de SB; só 30 (20 %) com mulheres e **11 (7,4 %)** com análise exclusiva de mulheres.
- Resultado: HCO₃⁻ +7,4 mmol/L (ICr95 4,2–10,4); efeito no exercício **0,37 (ICr95 −0,06 a 0,92)**. Autores: não há base para dose específica por sexo; 0,2–0,3 g/kg 60–180 min antes serve à atleta.
- Limitações: poucos dados; ICr cruza zero.
- Ponto de ensino: a lacuna é de dados, não de efeito.
- Verificação: confirmado no abstract.

### GRGIC2022SWIM
- Citação: Grgic J, Mikulic P. Ergogenic effects of sodium bicarbonate supplementation on middle-, but not short-distance swimming tests: a meta-analysis. J Diet Suppl 2022;19(6):791-802. DOI 10.1080/19390211.2021.1942381 · PMID 34151681
- Desenho: meta-análise (9 estudos).
- Resultado: geral DMP −0,10 (p = 0,208; tempo, negativo = mais rápido); 91,4/100 m 0,11 (p = 0,261); **200 e 400 m −0,22 (p < 0,001; −1,3 %)**.
- Ponto de ensino: na piscina, 50–100 m não responde; 200–400 m sim (~1,3 %).
- Verificação: confirmado no abstract.

### HUANG2025SWIM
- Citação: Huang D, Wang X, Takagi H, et al. Effects of sodium bicarbonate on 200 m time trial performance and physiological responses in swimmers: a systematic review and meta-analysis of randomized controlled trials. Res Sports Med 2025;33(3):291-307. DOI 10.1080/15438627.2025.2456630 · PMID 39841595
- Resultado: HCO₃⁻ DMP 1,09; lactato 0,76; pH 1,02; **tempo nos 200 m DMP 0,26 (IC95 −0,58 a 1,10): sem efeito**.
- Ponto de ensino: duas meta-análises, mesmos 200 m, conclusões opostas — ótimo para discutir sensibilidade à seleção de estudos.
- Verificação: confirmado no abstract.

### GRGIC2022WING
- Citação: Grgic J. Effects of sodium bicarbonate ingestion on measures of Wingate test performance: a meta-analysis. J Am Nutr Assoc 2022;41(1):1-10. DOI 10.1080/07315724.2020.1850370 · PMID 33314967
- Resultado (10 estudos): potência média Wingate 1 **0,02 (−0,07 a 0,11)**; Wingate 2 0,09 (0,03–0,16); Wingate 3 0,21 (−0,16 a 0,58) [0,40 (0,01–0,80) com pausas curtas]; Wingate 4 **0,62 (0,15–1,08)**. Pico: só Wingate 3 (0,09; 0,00–0,17).
- Ponto de ensino: o efeito "aparece" à medida que a acidose se acumula — 1º Wingate nulo, 4º claro.
- Verificação: confirmado no abstract.

### MIRANDA2022COMBAT
- Citação: Miranda WAS, Barreto LBM, Miarka B, et al. Can sodium bicarbonate supplementation improve combat sports performance? A systematic review and meta-analysis. Curr Nutr Rep 2022;11(2):273-282. DOI 10.1007/s13668-022-00396-2 · PMID 35394616
- Desenho: RS + meta-análise (8 artigos, busca até out/2020; PEDro 8–9).
- Resultado: lactato aumentou (p = 0,006); **PSE, potência e testes específicos (SJFT, arremesso de boneco) sem diferença significativa**.
- Limitações: busca incluiu Google Scholar; poucos estudos; o abstract interpreta o lactato como "efeito ergogênico" sem desempenho.
- Ponto de ensino: em luta, a meta-análise disponível NÃO mostra ganho de desempenho agrupado — contraste com o posicionamento da ISSN.
- Verificação: confirmado no abstract.

### LOPESSILVA2023TT
- Citação: Lopes-Silva JP, Correia-Oliveira CR. Acute effects of sodium bicarbonate ingestion on cycling time-trial performance: a systematic review and meta-analysis of randomized controlled trials. Eur J Sport Sci 2023;23(6):943-954. DOI 10.1080/17461391.2022.2071171 · PMID 35633035
- Amostra: 18 estudos (potência média n = 182; tempo n = 201).
- Resultado: potência média **DMP 0,42 (0,21–0,63), I² 0 %**; tempo 0,22 (0,02–0,43), I² 0 %. Com tempo até o pico individual: potência 0,39 (0,03–0,75), I² 15 %; tempo 0,34 (0,07–0,61), I² 0 %. Destaque dos autores: protocolo padronizado NÃO melhorou o TT; o individualizado sim.
- Ponto de ensino: ciclismo de TT é o cenário com menor heterogeneidade.
- Verificação: confirmado no abstract.

### MILLER2025RUN
- Citação: Miller LE, Bhattacharyya R, Katz SJ, et al. Negligible benefit of oral single-dose sodium bicarbonate on continuous running performance: systematic review with meta-analysis of randomized, double-blind, placebo-controlled trials. J Int Soc Sports Nutr 2025;22(1):2538606. DOI 10.1080/15502783.2025.2538606 · PMID 41416636
- Amostra: 11 ECRs cruzados, 126 participantes (84 % homens); dose típica 0,3 g/kg; testes de 1–30 min (mediana 4 min).
- Resultado: **sintomas GI 29,5 % × 2,6 % (OR 5,9; p = 0,003)**; abandono por GI **8,7 % × 1,6 % (OR 2,9; p = 0,049)**. Após ajuste por abandono (intenção de tratar) e viés de publicação: **DMP 0,18 (IC95 −0,01 a 0,36; p = 0,06; I² 0 %)**. Meta-regressão: sexo masculino (p = 0,03) e maior massa corporal (p = 0,04) associados a mais benefício; só homens: 0,40 (0,18–0,63).
- Ponto de ensino: o primeiro trabalho a "cobrar" no efeito quem desistiu por GI — e o benefício encolhe.
- Verificação: confirmado no abstract.

### GE2026TEAM
- Citação: Ge X, Sun H, Wu C, Liu S. Effects of acute or short-term oral sodium bicarbonate supplementation on high-intensity intermittent exercise performance and physiological responses in team-sport athletes: a systematic review and meta-analysis. Front Nutr 2026;13:1936178. DOI 10.3389/fnut.2026.1936178 · PMID 42781544
- Amostra: 20 estudos, 241 atletas, 53 tamanhos de efeito (meta-análise de 3 níveis).
- Resultado: **g 0,23 (IC95 0,07–0,39); intervalo de predição −0,22 a 0,68; I² 37 %**. Sem efeito claro em sprints repetidos, potência média, resistência intermitente; nenhum moderador (sexo, dose, frequência, forma, fase, razão esforço/pausa). Lactato pós +1,73 mmol/L; HCO₃⁻ +2,73; pH +0,050. GRADE baixa.
- Ponto de ensino: o intervalo de predição cruza zero — o próximo time pode não ganhar nada.
- Verificação: confirmado no abstract.

### MARTICORENA2021
- Citação: Marticorena FM, Carvalho A, Oliveira LF, et al. Nonplacebo controls to determine the magnitude of ergogenic interventions: a systematic review and meta-analysis. Med Sci Sports Exerc 2021;53(8):1766-1777. DOI 10.1249/MSS.0000000000002635 · PMID 33587551
- Amostra: 34 estudos (cafeína e tamponantes) com braço placebo E braço controle sem nada.
- Resultado: placebo × controle **ES0,5 = 0,09 (ICr95 0,01–0,17)**; ativo × controle 0,37 (0,20–0,56). Placebo = **25 % (ICr75 16–35 %)** do efeito total nos tamponantes (59 % na cafeína).
- Ponto de ensino: ~1/4 do "efeito bicarbonato" no mundo real é expectativa.
- Verificação: confirmado no abstract.

### WINTER2026GI
- Citação: Winter IP, Sarac P, Wilson PB. Gastrointestinal symptoms associated with sodium bicarbonate supplementation protocols: a systematic review. Eur J Sport Sci 2026;26(8):e70225. DOI 10.1002/ejsc.70225 · PMID 42499192
- Amostra: 101 investigações (≥ 5 g/24 h).
- Resultado: doses agudas comuns (0,2–0,4 g/kg) causam GI leve a grave, provavelmente dose-dependente em dose única; estratégias: fracionar ao longo de horas, cápsula entérica, minitabletes em hidrogel de carboidrato — **sem comparação direta entre elas** (não dá para ranquear). **26 de 101 estudos não testaram estatisticamente o GI.**
- Ponto de ensino: o GI é o desfecho mais mal medido da literatura do SB.
- Verificação: confirmado no abstract.

### ANTONIO2026
- Citação: Antonio B, Shannon ES, Candow DG, et al. Common questions and misconceptions of sodium bicarbonate as an ergogenic aid: what does the science really show? J Int Soc Sports Nutr 2026;23(1):2724103. DOI 10.1080/15502783.2026.2724103 · PMID 42696273
- Desenho: revisão narrativa em 15 perguntas, com especialistas convidados.
- Pontos lidos no texto completo: conta do sódio (70 kg → ~5,75 g Na); PA diastólica +3–4 mmHg (cita KAHLE2013); recomendação de monitorar PA, massa corporal (esportes de categoria de peso), GI e consumo de sódio/potássio, e evitar eletrólitos extras; hidrogel entrega minitabletes pelo piloro; ~25 % placebo (cita MARTICORENA2021); "relatos anedóticos" de uso em etapas de Grand Tour e ultra (sem dado controlado).
- Conflito: coautor S. A. Sparks com afiliação **Maurten AB** (fabricante do Bicarb System).
- Ponto de ensino: a revisão mais nova é útil, mas tem autor da indústria — ler com isso em mente.
- Verificação: confirmado no texto completo (PMC13552336).

---

## 2. Ensaios clássicos e marcantes

### DENNIG1931
- Citação: Dennig H, Talbott JH, Edwards HT, Dill DB. Effect of acidosis and alkalosis upon capacity for work. J Clin Invest 1931;9(4):601-613. DOI 10.1172/JCI100324 · PMID 16693953
- Desenho/Amostra/Intervenção: segundo ISSN2021 e ANTONIO2026 (texto completo): Harvard Fatigue Laboratory, **um único participante**, 10 g de SB, alcalose × acidose (NH₄Cl), corrida em esteira.
- Verificação: parcial — referência existe (Europe PMC, sem abstract; PDF bloqueado); detalhes lidos só nas revisões. Usar como história, sem números do original.

### JONES1977
- Citação: Jones NL, Sutton JR, Taylor R, Toews CJ. Effect of pH on cardiorespiratory and metabolic responses to exercise. J Appl Physiol 1977;43(6):959-964. DOI 10.1152/jappl.1977.43.6.959 · PMID 24031
- Amostra: 5 homens.
- Intervenção: cápsulas por 3 h de CaCO₃ (controle), NH₄Cl (acidose) ou NaHCO₃ (alcalose), 0,3 g/kg.
- Teste: 33, 66 e 95 % da potência máxima; a 95 %, até a exaustão.
- Resultado: pH pré 7,38 / 7,21 / 7,43. Tempo a 95 %: **controle 270 ± 13 s; acidose 160 ± 22 s; alcalose 438 ± 120 s**.
- Limitações: n = 5; TTE; sem cegamento descrito no abstract.
- Ponto de ensino: o experimento de três braços que fundou a era moderna (e a dose de 0,3 g/kg).
- Verificação: confirmado no abstract.

### WILKES1983
- Citação: Wilkes D, Gledhill N, Smyth R. Effect of acute induced metabolic alkalosis on 800-m racing time. Med Sci Sports Exerc 1983;15(4):277-280. DOI 10.1249/00005768-198315040-00004 · PMID 6312244
- Amostra: 6 corredores de meio-fundo treinados (T2–T3).
- Intervenção: NaHCO₃ × placebo (CaCO₃) × controle. Dose 0,3 g/kg, 120 min antes (tabela da ISSN2021; não está no abstract).
- Teste: prova de 800 m.
- Resultado: **2,9 s mais rápido** na alcalose; lactato e H⁺ extracelular pós-prova maiores.
- Limitações: n = 6; tempos absolutos não estão no abstract.
- Ponto de ensino: 2,9 s em 800 m é distância de pódio — o estudo que levou o SB à pista.
- Verificação: confirmado no abstract (dose/momento via ISSN2021).

### COSTILL1984
- Citação: Costill DL, Verstappen F, Kuipers H, Janssen E, Fink W. Acid-base balance during repeated bouts of exercise: influence of HCO3. Int J Sports Med 1984;5(5):228-231. DOI 10.1055/s-2008-1025910 · PMID 6094373
- Amostra: 10 homens e 1 mulher.
- Intervenção: 0,2 g/kg NaHCO₃ × NaCl, 1 h antes.
- Teste: 5 tiros de 1 min a 100 % VO₂máx; o 5º até a exaustão.
- Resultado: pH repouso 7,34→7,41; HCO₃⁻ 27,5→31,0 mM. 5º tiro: **113,5 ± 12,4 s (NaCl) × 160,8 ± 19,1 s (NaHCO₃), +42 %, p < 0,01**. pH do vasto lateral (biópsia, n = 4) antes do 5º tiro: **6,81 (SB) × 6,73 (NaCl)**.
- Ponto de ensino: primeira imagem de que o músculo fica "menos ácido" — e o efeito aparece no esforço REPETIDO.
- Verificação: confirmado no abstract.

### KATZ1984
- Citação: Katz A, Costill DL, King DS, Hargreaves M, Fink WJ. Maximal exercise tolerance after induced alkalosis. Int J Sports Med 1984;5(2):107-110. DOI 10.1055/s-2008-1025890 · PMID 6325355
- Amostra: 8 homens saudáveis. Intervenção: 0,2 g/kg × NaCl, 1 h antes. Teste: pedalar até a exaustão a 125 % VO₂máx (~100 s).
- Resultado: **100,6 ± 6,1 s × 98,6 ± 5,7 s — sem diferença**, apesar de HCO₃⁻ 28,2 × 24,4 mmol/L.
- Ponto de ensino: mesmo grupo, mesmo ano: tiro único de ~100 s com 0,2 g/kg = nulo; tiros repetidos = +42 %.
- Verificação: confirmado no abstract.

### MCNAUGHTON1992DOSE
- Citação: McNaughton LR. Bicarbonate ingestion: effects of dosage on 60 s cycle ergometry. J Sports Sci 1992;10(5):415-423. DOI 10.1080/02640419208729940 · PMID 1331493
- Amostra: 9 homens atletas. Intervenção: controle, placebo (CaCO₃ 500 mg/kg) e 100, 200, 300, 400, 500 mg/kg.
- Teste: 1 min no cicloergômetro.
- Resultado: mais trabalho com 200 (p < 0,05) e 300–500 mg/kg (p < 0,005); máximo em **300 mg/kg (41,9 kJ)**; potência pico só difere a partir de 300 mg/kg (**1.295 ± 72,8 W**) e não sobe mais com doses maiores; 100 mg/kg não alcaliniza.
- Ponto de ensino: a curva dose-resposta que cravou 0,3 g/kg como platô.
- Verificação: confirmado no abstract (truncado em 250 palavras).

### MCNAUGHTON1992DUR
- Citação: McNaughton LR. Sodium bicarbonate ingestion and its effects on anaerobic exercise of various durations. J Sports Sci 1992;10(5):425-435. DOI 10.1080/02640419208729941 · PMID 1331494
- Intervenção: 0,3 g/kg. Teste: 10, 30, 120 e 240 s.
- Resultado: **sem benefício em 10 e 30 s** (apesar de HCO₃⁻ elevado); **melhora em 120 e 240 s** (p < 0,05).
- Ponto de ensino: a "regra dos 30 s" nasce aqui.
- Verificação: confirmado no abstract.

### BIRD1995
- Citação: Bird SR, Wiles J, Robbins J. The effect of sodium bicarbonate ingestion on 1500-m racing time. J Sports Sci 1995;13(5):399-403. DOI 10.1080/02640419508732255 · PMID 8558626
- Amostra: 12 corredores de clube a nível nacional (10 completaram).
- Intervenção: 300 mg/kg × placebo (NaCl 100 + CaCO₃ 200 mg/kg) × nada; cada condição 2×.
- Resultado: **253,9 s (SB) × 256,8 (PLA) × 258,0 (controle)**, p < 0,05.
- GI: pelo texto da ISSN2021, os 2 que não melhoraram tiveram dor de estômago e diarreia.
- Ponto de ensino: ~3 s em 1.500 m; e o GI como explicação do "não respondedor".
- Verificação: confirmado no abstract (GI via texto completo de ISSN2021).

### MCNAUGHTON1999H
- Citação: McNaughton L, Dalton B, Palmer G. Sodium bicarbonate can be used as an ergogenic aid in high-intensity, competitive cycle ergometry of 1 h duration. Eur J Appl Physiol 1999;80(1):64-69. DOI 10.1007/s004210050559 · PMID 10367725
- Amostra: 10 ciclistas bem treinados (VO₂máx 67,3 mL/kg/min; T3).
- Intervenção: 300 mg/kg × placebo × controle, duplo-cego.
- Teste: máximo trabalho em 60 min, em duplas competindo.
- Resultado: **950,9 ± 81,1 kJ (SB) × 835,5 (C) × 839,0 (PLA)**, p < 0,01 (~+13 %).
- Limitações: formato competitivo em dupla dificulta controle; resultado nunca replicado nesse tamanho (ver NORTHGRAVES2014, STEPHENS2002).
- Ponto de ensino: o estudo que abriu a discussão sobre provas longas.
- Verificação: confirmado no abstract.

### STEPHENS2002
- Citação: Stephens TJ, McKenna MJ, Canny BJ, Snow RJ, McConell GK. Effect of sodium bicarbonate on muscle metabolism during intense endurance cycling. Med Sci Sports Exerc 2002;34(4):614-621. DOI 10.1097/00005768-200204000-00009 · PMID 11932569
- Amostra: 7 homens treinados em endurance. Intervenção: 0,3 g/kg × CaCO₃, 2 h antes.
- Teste: 30 min a 77 % VO₂pico + 469 kJ o mais rápido possível (~30 min).
- Resultado: pequena alcalose muscular; glicogênio, lactato muscular, PCr e ATP sem diferença; **desempenho igual**.
- Ponto de ensino: em ~60 min contínuos, o SB mexe no sangue e não no tempo.
- Verificação: confirmado no abstract.

### LINDH2008
- Citação: Lindh AM, Peyrebrune MC, Ingham SA, Bailey DM, Folland JP. Sodium bicarbonate improves swimming performance. Int J Sports Med 2008;29(6):519-523. DOI 10.1055/s-2007-989228 · PMID 18004687
- Amostra: 9 nadadores homens de elite (T4).
- Intervenção: 300 mg/kg em cápsulas × CaCO₃ 200 mg/kg × controle, 90–60 min antes.
- Teste: 200 m livre.
- Resultado: **1:52,2 ± 4,7 (SB) × 1:53,7 (C) × 1:54,0 (PLA)**, p < 0,05.
- Ponto de ensino: ~1,5–1,8 s em 200 m numa elite.
- Verificação: confirmado no abstract.

### HOBSON2014
- Citação: Hobson RM, Harris RC, Martin D, et al. Effect of sodium bicarbonate supplementation on 2000-m rowing performance. Int J Sports Physiol Perform 2014;9(1):139-144. DOI 10.1123/ijspp.2013-0086 · PMID 23579002
- Amostra: 20 remadores homens (melhor marca 409 ± 16 s; T2–T3).
- Intervenção: 0,3 g/kg × maltodextrina, duplo-cego cruzado.
- Resultado: **412,0 ± 15,1 s (PLA) × 410,7 ± 14,9 s (SB); teste t p = 0,095** (inferência por magnitude: "provavelmente benéfico"); 3º e 4º 500 m mais rápidos (p = 0,035 e 0,004).
- Ponto de ensino: o ganho mora na segunda metade da prova; e o "positivo" depende do método estatístico.
- Verificação: confirmado no abstract.

### CARR2011ROW e CARR2012ROW
- Citação 1: Carr AJ, Gore CJ, Dawson B. Induced alkalosis and caffeine supplementation: effects on 2,000-m rowing performance. Int J Sport Nutr Exerc Metab 2011;21(5):357-364. DOI 10.1123/ijsnem.21.5.357 · PMID 21799214
- Citação 2: Carr AJ, Slater GJ, Gore CJ, Dawson B, Burke LM. Reliability and effect of sodium bicarbonate: buffering and 2000-m rowing performance. Int J Sports Physiol Perform 2012;7(2):152-160. DOI 10.1123/ijspp.7.2.152 · PMID 22634964
- Amostra: 8 e 7 remadores bem treinados (T3).
- Intervenção: (1) 0,3 g/kg, 6 mg/kg cafeína, ambos, placebo; (2) 0,3 g/kg agudo × 0,5 g/kg/dia por 3 dias × CaCO₃.
- Resultado: (1) cafeína 354 ± 67 × 346 ± 61 W (~2 %); **SB e SB + cafeína com efeito "incerto"**; GI pode ter impedido ganho na combinação. (2) **277 ± 60 W (PLA), 280 ± 65 (agudo), 282 ± 65 (crônico) — diferenças triviais**; erro típico 2,1 % (agudo), 3,6 % (crônico), 1,6 % (PLA).
- Ponto de ensino: em remadores bem treinados, o erro típico do teste (~2 %) é do tamanho do efeito esperado.
- Verificação: confirmado nos abstracts.

### KRUSTRUP2015
- Citação: Krustrup P, Ermidis G, Mohr M. Sodium bicarbonate intake improves high-intensity intermittent exercise performance in trained young men. J Int Soc Sports Nutr 2015;12:25. DOI 10.1186/s12970-015-0087-6 · PMID 26097440
- Amostra: 13 homens treinados (VO₂máx 61,3). Intervenção: **0,4 g/kg** × controle (sem placebo).
- Teste: Yo-Yo IR2.
- Resultado: **735 ± 61 × 646 ± 46 m (+14 %, p = 0,04)**; pH 7,44 × 7,32 e HCO₃⁻ 33,7 × 27,3 pré-teste.
- Limitações: **sem placebo** (controle aberto) — superestima (ver MARTICORENA2021).
- Ponto de ensino: dado muito citado por times, mas sem placebo.
- Verificação: confirmado no abstract.

### CAMERON2010
- Citação: Cameron SL, McLay-Cooke RT, Brown RC, Gray AR, Fairbairn KA. Increased blood pH but not performance with sodium bicarbonate supplementation in elite rugby union players. Int J Sport Nutr Exerc Metab 2010;20(4):307-321. DOI 10.1123/ijsnem.20.4.307 · PMID 20739719
- Amostra: 25 jogadores de rúgbi de elite (T4). Intervenção: 0,3 g/kg × placebo, 65 min antes, duplo-cego.
- Teste: aquecimento, treino específico e teste de sprints repetidos de rúgbi.
- Resultado: HCO₃⁻ e pH maiores; **desempenho igual**. Incidência maior de arroto, dor de estômago, diarreia, distensão e náusea; gravidade pior em cólica, urgência, diarreia, vômito, distensão e flatulência.
- Ponto de ensino: nulo de elite com n bom — e o GI como suspeito.
- Verificação: confirmado no abstract.

### SAUNDERS2014
- Citação: Saunders B, Sale C, Harris RC, Sunderland C. Sodium bicarbonate and high-intensity-cycling capacity: variability in responses. Int J Sports Physiol Perform 2014;9(4):627-632. DOI 10.1123/ijspp.2013-0295 · PMID 24155093
- Amostra: 21 homens. Intervenção: 0,3 g/kg × maltodextrina. Teste: CCT110.
- Resultado: trabalho total **46,8 ± 9,1 × 45,6 ± 8,4 kJ, p = 0,16, d = 0,14**; **excluindo os 4 com desconforto GI, p = 0,01**.
- Ponto de ensino: o GI pode apagar o efeito no grupo inteiro.
- Verificação: confirmado no abstract.

### FROIO2015
- Citação: Froio de Araujo Dias G, da Eira Silva V, de Salles Painelli V, et al. (In)consistencies in responses to sodium bicarbonate supplementation: a randomised, repeated measures, counterbalanced and double-blind study. PLoS One 2015;10(11):e0143086. DOI 10.1371/journal.pone.0143086 · PMID 26574755
- Amostra: 15 homens ativos (T1). Intervenção: 0,3 g/kg em **4 sessões** × PLA em 2. Teste: CCT110.
- Resultado: alcalose igual nas 4 sessões; trabalho total **+3,6 %, +0,3 %, +2,1 %, +6,7 % (todos p > 0,05)**; 10 melhoraram além da variação do teste em pelo menos 1 sessão; **5 nunca melhoraram**.
- Ponto de ensino: "respondedor" num único teste é loteria; o mecanismo estava lá nas 4 vezes.
- Verificação: confirmado no abstract.

### CORREIA2017
- Citação: Correia-Oliveira CR, Lopes-Silva JP, Bertuzzi R, et al. Acidosis, but not alkalosis, affects anaerobic metabolism and performance in a 4-km time trial. Med Sci Sports Exerc 2017;49(9):1899-1910. DOI 10.1249/MSS.0000000000001295 · PMID 28398947
- Amostra: 11 ciclistas recreacionalmente treinados (VO₂pico 54,1). Intervenção: NH₄Cl 0,15 g/kg × NaHCO₃ 0,3 g/kg × CaCO₃, 100 min antes.
- Resultado: SB: pH +0,06, HCO₃⁻ +4,4 mmol/L; acidose: −0,05 e −4,8. **Acidose piorou potência e trabalho anaeróbio; alcalose = placebo em tudo.** GI mínimo.
- Ponto de ensino: a assimetria — tirar tampão prejudica mais do que acrescentar ajuda.
- Verificação: confirmado no abstract.

### VAROVIC2023
- Citação: Varovic D, Grgic J, Schoenfeld BJ, Vuk S. Ergogenic effects of sodium bicarbonate on resistance exercise: a randomized, double-blind, placebo-controlled study. J Strength Cond Res 2023;37(8):1600-1608. DOI 10.1519/JSC.0000000000004443 · PMID 36752756
- Amostra: 19 homens treinados em força. Intervenção: 0,3 g/kg × NaCl 0,21 g/kg, 180–60 min antes.
- Teste: 3 séries a 70 % 1RM até a falha (supino e rosca).
- Resultado: supino — repetições na 3ª série g 0,30 (p = 0,046); total g 0,23 (p = 0,04); potência pico 2ª série 0,19; velocidade média 3ª série 0,30. **Rosca bíceps: nada.**
- Ponto de ensino: efeito só nas séries finais e no exercício de grande massa.
- Verificação: confirmado no abstract.

### FREIS2017
- Citação: Freis T, Hecksteden A, Such U, Meyer T. Effect of sodium bicarbonate on prolonged running performance: a randomized, double-blind, cross-over study. PLoS One 2017;12(8):e0182158. DOI 10.1371/journal.pone.0182158 · PMID 28797049
- Amostra: 18 corredores treinados (VO₂pico 61,2). Intervenção: 0,3 g/kg × 4 g NaCl em 700 mL.
- Teste: 30 min a 95 % do limiar + 110 % até a exaustão; e teste incremental.
- Resultado: **TTE 39,6 ± 5,6 × 39,3 ± 5,6 min (p = 0,78)**; Vmáx incremental 17,4 × 17,1 km/h (p = 0,009). **GI em 15 dos 18.**
- Ponto de ensino: em ~40 min, nada; e 83 % com GI.
- Verificação: confirmado no abstract.

### NORTHGRAVES2014
- Citação: Northgraves MJ, Peart DJ, Jordan CA, Vince RV. Effect of lactate supplementation and sodium bicarbonate on 40-km cycling time trial performance. J Strength Cond Res 2014;28(1):273-280. DOI 10.1519/JSC.0b013e3182986a4c · PMID 23660571
- Amostra: 7 homens recreacionalmente ativos. Intervenção: 300 mg/kg × NaCl 45 mg/kg (e lactato × farinha), 60 min antes. Teste: TT 40 km.
- Resultado: **sem diferença** entre as 4 condições.
- Verificação: confirmado no abstract.

### SHANNON2024
- Citação: Shannon ES, Regnier A, Dobson B, et al. The effect of sodium bicarbonate mini-tablets ingested in a carbohydrate hydrogel system on 40 km cycling time trial performance and metabolism in trained male cyclists. Eur J Appl Physiol 2024;124(12):3671-3682. DOI 10.1007/s00421-024-05567-3 · PMID 39068627
- Amostra: 14 ciclistas homens treinados. Intervenção: 0,3 g/kg em minitabletes + hidrogel (Maurten) no pico individual × placebo, duplo-cego.
- Resultado: **−54,1 ± 18,2 s (p = 0,002; g = 0,22)**; HCO₃⁻ +5,6 mmol/L; GI total sem diferença.
- Conflito: produto doado pela Maurten; coautor S. A. Sparks hoje empregado da Maurten (empresa sem papel no desenho/análise, segundo os autores).
- Ponto de ensino: o primeiro positivo robusto em 40 km — mas é um estudo, com elo industrial.
- Verificação: confirmado no abstract e conflito no texto completo (PMC11568979).

### DALLE2021
- Citação: Dalle S, Koppo K, Hespel P. Sodium bicarbonate improves sprint performance in endurance cycling. J Sci Med Sport 2021;24(3):301-306. DOI 10.1016/j.jsams.2020.09.011 · PMID 34756350
- Amostra: 11 ciclistas treinados (VO₂máx 63,7). Intervenção: 150 mg/kg antes + 150 mg/kg durante uma prova simulada de 3 h × NaCl.
- Teste: sprint de 90 s no fim.
- Resultado: **541 ± 59 × 524 ± 57 W (~3 %, p = 0,047, d = 0,28)**; HCO₃⁻ 31,5 × 24,4 e pH 7,50 × 7,41 antes do sprint.
- Ponto de ensino: em prova longa, o alvo não é a prova toda — é o sprint final.
- Verificação: confirmado no abstract.

---

## 3. Esportes de combate

### ARTIOLI2007
- Citação: Artioli GG, Gualano B, Coelho DF, et al. Does sodium-bicarbonate ingestion improve simulated judo performance? Int J Sport Nutr Exerc Metab 2007;17(2):206-217. DOI 10.1123/ijsnem.17.2.206 · PMID 17507744
- Amostra: judocas; protocolo 1 n = 9; protocolo 2 n = 14 (23 no total, tabela ISSN2021). Grupo brasileiro (USP).
- Intervenção: 0,3 g/kg × placebo, 2 h antes; duplo-cego, contrabalanceado, cruzado.
- Teste: 3 × SJFT; 4 × Wingate de membros superiores.
- Resultado: melhora no SJFT 2 e 3 (p < 0,05); potência média nos Wingates 3 e 4 e pico no 4º; lactato maior no protocolo 1; PSE igual.
- Limitações: n pequeno; magnitudes não estão no abstract.
- Ponto de ensino: efeito nas lutas 2 e 3, não na 1ª — padrão "efeito cumulativo".
- Verificação: confirmado no abstract.

### FELIPPE2016
- Citação: Felippe LC, Lopes-Silva JP, Bertuzzi R, McGinley C, Lima-Silva AE. Separate and combined effects of caffeine and sodium-bicarbonate intake on judo performance. Int J Sports Physiol Perform 2016;11(2):221-226. DOI 10.1123/ijspp.2015-0020 · PMID 26182440
- Amostra: 10 judocas. Intervenção: SB, cafeína, SB + cafeína, placebo (celulose).
- Teste: 3 × SJFT (5 min de pausa).
- Resultado: SJFT 3: SB 23,7 ± 1,6 e SB + cafeína 24,4 ± 1,0 × PLA 22,0 ± 1,6 arremessos; total dos 3: só a combinação > PLA (**72,7 ± 3,1 × 68,8 ± 4,4**, p = 0,003).
- Ponto de ensino: de novo, efeito na última luta.
- Verificação: confirmado no abstract.

### SIEGLER2010
- Citação: Siegler JC, Hirscher K. Sodium bicarbonate ingestion and boxing performance. J Strength Cond Res 2010;24(1):103-108. DOI 10.1519/JSC.0b013e3181a392b2 · PMID 19625976
- Amostra: 10 boxeadores amadores, pareados por peso e nível.
- Intervenção: 0,3 g/kg × NaCl 0,045 g/kg em suco diluído.
- Teste: sparring de 4 × 3 min.
- Resultado: **mais golpes acertados com SB (p < 0,001)**; FC e PSE iguais; HCO₃⁻ maior antes, igual depois.
- Limitações: desfecho subjetivo de contagem; números absolutos não estão no abstract; cegamento por sabor duvidoso em solução (ver GURTON2022BLIND).
- Ponto de ensino: o desfecho é técnico (eficácia do golpe), não fisiológico.
- Verificação: confirmado no abstract.

### GOUGH2019BOX
- Citação: Gough LA, Rimmer S, Sparks SA, McNaughton LR, Higgins MF. Post-exercise supplementation of sodium bicarbonate improves acid base balance recovery and subsequent high-intensity boxing specific performance. Front Nutr 2019;6:155. DOI 10.3389/fnut.2019.00155 · PMID 31632978
- Amostra: 7 boxeadores profissionais de elite (T4).
- Intervenção: 0,3 g/kg × NaCl 0,1 g/kg, tomado 10 min DEPOIS do 1º esforço exaustivo; recuperação de 75 min.
- Resultado: mudança do TLIM1 ao TLIM2 **+164 ± 90 × +73 ± 78 s (p = 0,02; g = 1,0)**; pH +0,11 e HCO₃⁻ +8,8 mmol/L antes do 2º esforço.
- Ponto de ensino: SB como "recuperador" entre lutas do mesmo dia.
- Verificação: confirmado no abstract.

### LOPESSILVA2018TKD
- Citação: Lopes-Silva JP, Da Silva Santos JF, Artioli GG, et al. Sodium bicarbonate ingestion increases glycolytic contribution and improves performance during simulated taekwondo combat. Eur J Sport Sci 2018;18(3):431-440. DOI 10.1080/17461391.2018.1424942 · PMID 29355092
- Amostra: 9 atletas de taekwondo (faixa-preta, tabela ISSN2021). Intervenção: 300 mg/kg × CaCO₃, 90 min antes.
- Teste: 3 rounds de 2 min.
- Resultado: tempo total de ataque **+13 % (p = 0,05; d = 1,15)**; contribuição glicolítica no 1º round +31 %; lactato +14 % (d = 3,70).
- Limitações: p = 0,05 limítrofe; d gigantes (3,5–3,7) sugerem cálculo intraindivíduo — não usar como "tamanho de efeito".
- Verificação: confirmado no abstract.

### REZAEI2019
- Citação: Rezaei S, Akbari K, Gahreman DE, et al. Caffeine and sodium bicarbonate supplementation alone or together improve karate performance. J Int Soc Sports Nutr 2019;16(1):44. DOI 10.1186/s12970-019-0313-8 · PMID 31623659
- Amostra: 8 caratecas. Intervenção: SB 0,3 g/kg/dia por 3 dias + 120/90/60 min antes; cafeína 6 mg/kg.
- Teste: teste aeróbio específico de caratê (TTE).
- Resultado: TTE maior com cafeína, SB e combinação vs PLA e controle; sem diferença entre os três.
- Limitações: n = 8; números absolutos não estão no abstract.
- Verificação: confirmado no abstract.

### DURKALEC2018
- Citação: Durkalec-Michalski K, Zawieja EE, Podgórski T, et al. The effect of a new sodium bicarbonate loading regimen on anaerobic capacity and wrestling performance. Nutrients 2018;10(6):697. DOI 10.3390/nu10060697 · PMID 29848993
- Amostra: **58 lutadores** (o maior n do tema em combate). Intervenção: dose progressiva até 100 mg/kg/dia por 10 dias × placebo (paralelo).
- Teste: Wingate + arremesso de boneco + Wingate.
- Resultado: **sem GI**; Wingate e arremessos sem melhora; só tempo até o pico de potência no 2º Wingate caiu (3,44 → 2,35 s; p = 0,0142).
- Ponto de ensino: dose baixa elimina o GI e (quase) todo o efeito.
- Verificação: confirmado no abstract.

### DURKALEC2020
- Citação: Durkalec-Michalski K, Zawieja EE, Zawieja BE, et al. The gender dependent influence of sodium bicarbonate supplementation on anaerobic power and specific performance in female and male wrestlers. Sci Rep 2020;10(1):1878. DOI 10.1038/s41598-020-57590-x · PMID 32024852
- Amostra: 51 lutadores (18 mulheres). Intervenção: até 100 mg/kg por 10 dias × placebo.
- Resultado: arremessos nos homens 19,3 ± 2,6 → 21,7 ± 2,9; PP, queda de potência e média sem diferença; interação com sexo significativa.
- Ponto de ensino: resposta pode diferir por sexo — hipótese, não regra.
- Verificação: confirmado no abstract.

### TOBIAS2013 (judô e jiu-jítsu)
- Citação: Tobias G, Benatti FB, de Salles Painelli V, et al. Additive effects of beta-alanine and sodium bicarbonate on upper-body intermittent performance. Amino Acids 2013;45(2):309-317. DOI 10.1007/s00726-013-1495-z · PMID 23595205
- Amostra: **37 atletas de judô e jiu-jítsu**, 4 grupos (PL+PL, BA+PL, PL+SB, BA+SB).
- Intervenção: beta-alanina 6,4 g/dia por 4 semanas; **SB 500 mg/kg/dia por 7 dias na 4ª semana**; placebos dextrose e CaCO₃.
- Teste: 4 × Wingate de membros superiores (30 s; 3 min de pausa).
- Resultado: trabalho total **BA +7 %, SB +8 %, BA + SB +14 %** (aditivo, p < 0,05); SB melhorou a média no 4º tiro; só BA + SB reduziu PSE (p = 0,05).
- Ponto de ensino: é este o desenho "4 semanas × 1 semana" (beta-alanina crônica × SB na semana final). Ponte direta para o dossiê da beta-alanina.
- Verificação: confirmado no abstract.

### RAGONE2020 (jiu-jítsu, nulo)
- Citação: Ragone L, Vieira JG, Laterza MC, et al. Acute effect of sodium bicarbonate supplementation on symptoms of gastrointestinal discomfort, acid-base balance, and performance of jiu-jitsu athletes. J Hum Kinet 2020;75:85-93. DOI 10.2478/hukin-2020-0039 · PMID 33312297
- Amostra: 10 homens do jiu-jítsu. Intervenção: 0,3 g/kg × placebo 0,045 g/kg.
- Teste: preensão isométrica máxima e intermitente.
- Resultado: alcalose sim; **desempenho nulo**; sem desconforto GI significativo.
- Limitações: teste de preensão é pouco específico; n = 10.
- Ponto de ensino: único ECR agudo de jiu-jítsu achado — e é nulo.
- Verificação: confirmado no abstract.

### DANKOVIC2022 (judô, recuperação, nulo)
- Citação: Danković G, Stanković N, Milošević N, et al. Effects of sodium bicarbonate ingestion on recovery in high-level judokas. Int J Environ Res Public Health 2022;19(20):13389. DOI 10.3390/ijerph192013389 · PMID 36293971
- Amostra: 10 judocas faixa-preta. Intervenção: 0,3 g/kg × PLA, 120 min antes do SJFT.
- Resultado: recuperação (PSE, preensão, salto, lactato) **sem diferença**.
- Verificação: confirmado no abstract.

---

## 4. Farmacocinética e prática

### JONES2016
- Citação: Jones RL, Stellingwerff T, Artioli GG, Saunders B, Cooper S, Sale C. Dose-response of sodium bicarbonate ingestion highlights individuality in time course of blood analyte responses. Int J Sport Nutr Exerc Metab 2016;26(5):445-453. DOI 10.1123/ijsnem.2015-0286 · PMID 27098290
- Amostra: 16 homens saudáveis (78,6 ± 15,1 kg). Intervenção: 0,1, 0,2, 0,3 g/kg, sem cegamento; sangue capilar por 3 h.
- Resultado: aumento de HCO₃⁻ **+2,0–5 / +5,1–8,1 / +6,0–12,3 mmol/L** (0,1/0,2/0,3 g/kg); tempo até o pico **30–150 / 40–165 / 75–180 min**. Normalizar por massa não reduziu a variabilidade.
- Ponto de ensino: a figura-mãe do "pico individual" — com 0,3 g/kg, pico entre 75 e 180 min.
- Verificação: confirmado no abstract.

### GOUGH2017REP
- Citação: Gough LA, Deb SK, Sparks AS, McNaughton LR. The reproducibility of blood acid base responses in male collegiate athletes following individualised doses of sodium bicarbonate: a randomised controlled crossover study. Sports Med 2017;47(10):2117-2127. DOI 10.1007/s40279-017-0699-x · PMID 28229390
- Amostra: 15 homens (rúgbi, futebol, velocidade). Intervenção: 0,2 g/kg 2×, 0,3 g/kg 2×, controle 2×.
- Resultado: CCI do tempo até o pico — **HCO₃⁻: 0,77 (0,2) e 0,94 (0,3)**; pH: 0,62 e 0,71. Mudança absoluta HCO₃⁻: 0,89 e 0,76.
- Ponto de ensino: o pico do HCO₃⁻ é reprodutível na mesma pessoa — dá para "mapear" o atleta.
- Verificação: confirmado no abstract.

### GOUGH2017TT
- Citação: Gough LA, Deb SK, Sparks A, McNaughton LR. The reproducibility of 4-km time trial (TT) performance following individualised sodium bicarbonate supplementation: a randomised controlled trial in trained cyclists. Sports Med Open 2017;3(1):34. DOI 10.1186/s40798-017-0101-4 · PMID 28936625
- Amostra: 11 ciclistas homens treinados.
- Resultado: reprodutibilidade da mudança de HCO₃⁻ r = 0,68 (0,2) e 0,78 (0,3); do desempenho **r = 0,97–0,99**; sem efeito de dose.
- Verificação: confirmado no abstract.

### GOUGH2018
- Citação: Gough LA, Deb SK, Sparks SA, McNaughton LR. Sodium bicarbonate improves 4 km time trial cycling performance when individualised to time to peak blood bicarbonate in trained male cyclists. J Sports Sci 2018;36(15):1705-1712. DOI 10.1080/02640414.2017.1410875 · PMID 29183257
- Amostra: 11 ciclistas homens treinados (PPO 382 W). Intervenção: 0,2 × 0,3 g/kg × NaCl 0,07 g/kg no pico individual, duplo-cego.
- Resultado: **0,2 g/kg −8,3 ± 3,5 s (d = 0,64); 0,3 g/kg −8,6 ± 5,4 s (d = 0,66)**; diferença entre doses 0,2 s (p = 0,87).
- Ponto de ensino: no pico individual, 0,2 g/kg rende igual a 0,3 g/kg — menos sódio, menos GI.
- Verificação: confirmado no abstract.

### BOEGMAN2020
- Citação: Boegman S, Stellingwerff T, Shaw G, et al. The impact of individualizing sodium bicarbonate supplementation strategies on world-class rowing performance. Front Nutr 2020;7:138. DOI 10.3389/fnut.2020.00138 · PMID 33015117
- Desenho: cruzado com engano simples-cego; **sem braço placebo** (os dois dias tinham SB; muda só o momento).
- Amostra: **23 remadores homens** de dois centros — Canadian Sport Institute Pacific (Canadá) e New South Wales Institute of Sport (Austrália); melhores marcas 5:39–6:14; **13 de seleções olímpicas/mundiais e 1 recordista mundial no ergômetro** (T4–T5).
- Intervenção: 0,3 g/kg em cápsulas com lanche padronizado (1,5 g/kg de carboidrato) e 10 mL/kg de líquido; TT aos 60 min (consenso) × no pico individual.
- Resultado: HCO₃⁻ +2,9 mmol/L (IC95 2,0–3,8) no pico vs 60 min antes do aquecimento, mas **igual após o aquecimento** (~+5,5 × ~+6 mmol/L). Tempo **367,0 ± 10,5 × 369,0 ± 10,3 s (p = 0,007; d = 0,15)** — ~2 s. Tempo com HCO₃⁻ > +5 mmol/L: ~100 ± 20 min (40–160 min). Ganho de massa ~0,4 kg (< 0,5 %); ~0,6 kg nos 4 peso-leve (72,5 kg).
- Ponto de ensino: ~2 s numa elite mundial — e o próprio artigo admite que o ganho não se explica por mais alcalinidade antes da largada. O aumento de peso importa para esportes de categoria (lutas).
- Verificação: confirmado no texto completo (PMC7509055).

### JONES2021 (aquecimento)
- Citação: Jones RL, Stellingwerff T, Swinton P, et al. Warm-up intensity does not affect the ergogenic effect of sodium bicarbonate in adult men. Int J Sport Nutr Exerc Metab 2021;31(6):482-489. DOI 10.1123/ijsnem.2021-0076 · PMID 34480008
- Desenho: ECR cruzado duplo-cego, 2 × 2 (aquecimento intenso × leve; SB × maltodextrina).
- Amostra: 12 homens (79,2 kg; Wmáx 318 W; T1–T2).
- Intervenção: 0,3 g/kg, 3 h antes do aquecimento.
- Teste: CCT110, 30 min após o aquecimento.
- Resultado: SB +6,4 mmol/L (IC95 5,7–7,1); aquecimento intenso derrubou mais o HCO₃⁻ (−3,8; −5,8 a −1,8), mas houve rebote nos 30 min (~+5,3 mmol/L com SB); trabalho total **+8,5 kJ (3,6–13,4), ~19 %**, sem efeito do tipo de aquecimento.
- Ponto de ensino: o aquecimento de elite "gasta" tampão, mas ele volta antes da largada.
- Verificação: confirmado no abstract.

### LASSEN2021
- Citação: Lassen TAH, Lindstrøm L, Lønbro S, Madsen K. Increased performance in elite runners following individualized timing of sodium bicarbonate supplementation. Int J Sport Nutr Exerc Metab 2021;31(6):453-459. DOI 10.1123/ijsnem.2020-0352 · PMID 34470913
- Amostra: 21 orientistas dinamarqueses de elite (homens e mulheres; T4). Intervenção: 0,3 g/kg no pico individual × PLA.
- Resultado: picos individuais de **60 a 180 min**; TT 3,5 km **775,5 ± 16,2 × 781,4 ± 16,1 s (−6 s; p < 0,05)**, ganho na 2ª metade.
- Ponto de ensino: prova de 12–15 min ainda responde.
- Verificação: confirmado no abstract.

### HEIBEL2018
- Citação: Heibel AB, Perim PHL, Oliveira LF, McNaughton LR, Saunders B. Time to optimize supplementation: modifying factors influencing the individual responses to extracellular buffering agents. Front Nutr 2018;5:35. DOI 10.3389/fnut.2018.00035 · PMID 29868599
- Desenho: revisão narrativa (não é ensaio).
- Conteúdo: fatores modificadores — mudança absoluta de HCO₃⁻, momento, tarefa, atividade de MCT, nível de treino, efeitos colaterais.
- Verificação: confirmado no abstract (sem números próprios).

### CARR2011GI
- Citação: Carr AJ, Slater GJ, Gore CJ, Dawson B, Burke LM. Effect of sodium bicarbonate on [HCO3-], pH, and gastrointestinal symptoms. Int J Sport Nutr Exerc Metab 2011;21(3):189-194. DOI 10.1123/ijsnem.21.3.189 · PMID 21719899
- Amostra: 13 fisicamente ativos; 8 protocolos de ingestão + placebo.
- Resultado: com comida, **maior HCO₃⁻ (30,9) e pH (7,49) e menor incidência de GI**; pico de GI **90 min após 0,3 g/kg em solução**. Recomendação: com refeição rica em carboidrato, **120–150 min antes**.
- Limitações: o abstract grafa HCO₃⁻ em "mmol/kg" (provável erro de unidade; o usual é mmol/L).
- Verificação: confirmado no abstract.

### SIEGLER2012
- Citação: Siegler JC, Marshall PW, Bray J, Towlson C. Sodium bicarbonate supplementation and ingestion timing: does it matter? J Strength Cond Res 2012;26(7):1953-1958. DOI 10.1519/JSC.0b013e3182392960 · PMID 21964428
- Amostra: 8 homens. Intervenção: 0,3 g/kg a 60, 120 ou 180 min. Teste: 10 × 10 s em esteira não motorizada.
- Resultado: HCO₃⁻ pré 30,2 / 30,9 / 31,2 mmol/L (p > 0,74); desempenho igual; **GI aumentado em todos os tempos, exceto 180 min**.
- Verificação: confirmado no abstract.

### MCNAUGHTON1999C (carga crônica)
- Citação: McNaughton L, Backx K, Palmer G, Strange N. Effects of chronic bicarbonate ingestion on the performance of high-intensity work. Eur J Appl Physiol 1999;80(4):333-336. DOI 10.1007/s004210050600 · PMID 10483803
- Amostra: 8. Intervenção: 0,5 g/kg/dia por 5 dias.
- Resultado: trabalho em 60 s **21,1 (controle e pré) × 24,1 (pós)** — o abstract grafa "MJ", obviamente kJ; HCO₃⁻ 22,8 → 28,4 mmol/L após 24 h.
- Limitações: sem placebo concomitante (controle 1 mês depois), não cego.
- Verificação: confirmado no abstract.

### MUELLER2013
- Citação: Mueller SM, Gehrig SM, Frese S, et al. Multiday acute sodium bicarbonate intake improves endurance capacity and reduces acidosis in men. J Int Soc Sports Nutr 2013;10(1):16. DOI 10.1186/1550-2783-10-16 · PMID 23531361
- Amostra: 8 ciclistas/triatletas treinados. Intervenção: 0,3 g/kg/dia × NaCl 0,045 g/kg, 5 dias seguidos.
- Teste: TTE na potência crítica, todo dia.
- Resultado: **826,5 ± 180,1 × 669,0 ± 167,2 s (+23,5 %, p = 0,001)**; sem efeito acumulativo nos dias; volume plasmático expandido.
- Ponto de ensino: dose diária em torneios de vários dias.
- Verificação: confirmado no abstract.

### EDGE2006 (adaptação ao treino)
- Citação: Edge J, Bishop D, Goodman C. Effects of chronic NaHCO3 ingestion during interval training on changes to muscle buffer capacity, metabolism, and short-term endurance performance. J Appl Physiol 2006;101(3):918-925. DOI 10.1152/japplphysiol.01534.2005 · PMID 16627675
- Amostra: **16 mulheres** recreacionalmente ativas (8/8). Intervenção: SB (0,4 g/kg pela tabela ISSN2021) × placebo antes de cada sessão; 8 semanas, 3×/semana, intervalos de 2 min a 140–170 % do limiar.
- Resultado: tampão muscular +19 × +9 % e VO₂pico +22 × +17 % (sem diferença entre grupos); **limiar de lactato +26 × +15 % (p = 0,05); tempo até a fadiga +164 × +123 % (p = 0,05)**.
- Ponto de ensino: base da ideia "treinar alcalino para treinar mais".
- Verificação: confirmado no abstract (dose via ISSN2021).

### HILTON2019 / HILTON2020GI / HILTON2020TT (cápsulas)
- Citação 1: Hilton NP, Leach NK, Sparks SA, et al. A novel ingestion strategy for sodium bicarbonate supplementation in a delayed-release form: a randomised crossover study in trained males. Sports Med Open 2019;5(1):4. DOI 10.1186/s40798-019-0177-0 · PMID 30680463
- Citação 2: Hilton NP, Leach NK, Craig MM, Sparks SA, McNaughton LR. Enteric-coated sodium bicarbonate attenuates gastrointestinal side-effects. Int J Sport Nutr Exerc Metab 2020;30(1):62-68. DOI 10.1123/ijsnem.2019-0151 · PMID 31751936
- Citação 3: Hilton NP, Leach NK, Hilton MM, Sparks SA, McNaughton LR. Enteric-coated sodium bicarbonate supplementation improves high-intensity cycling performance in trained cyclists. Eur J Appl Physiol 2020;120(7):1563-1573. DOI 10.1007/s00421-020-04387-5 · PMID 32388584
- Amostra: 12, 14 e 11 homens treinados. Intervenção: 300 mg/kg em solução × liberação retardada (2019); gelatina × retardada × entérica × PLA (2020a); entérica × gelatina × PLA no pico individual (2020b).
- Resultado: (2019) liberação retardada **−45,1 % na incidência e −47,5 % na gravidade de GI**; pico mais tardio. (2020a) gravidade **GEL 7,0 ± 2,6 > DEL 4,6 ± 2,8 > ENT 2,8 ± 1,9 UA**, mas HCO₃⁻ menor com entérica. (2020b) TT 4 km **entérica −8,5 ± 9,6 s; gelatina −9,6 ± 7,2 s**; GI em 3 (entérica) × 7 (gelatina) de 11.
- Ponto de ensino: a cápsula entérica troca um pouco de alcalose por muito menos GI, sem perder desempenho.
- Verificação: confirmado nos abstracts.

### MARTIN2023 (mulheres)
- Citação: Martin RAXJ, Hilton NP, Sparks SA, Saunders B, McNaughton LR. The effects of enteric-coated sodium bicarbonate supplementation on 2 km rowing performance in female CrossFit athletes. Eur J Appl Physiol 2023;123(6):1191-1198. DOI 10.1007/s00421-023-05140-4 · PMID 36705750
- Amostra: 11 mulheres de CrossFit (64,5 kg). Intervenção: 0,3 g/kg entérica no pico individual × PLA.
- Resultado: **514,3 ± 44,6 × 529,9 ± 45,4 s (−2,24 %)**; pico em 102,3 ± 22,1 min (75–150); HCO₃⁻ +5,5 ± 1,5 (3,8–7,9); correlação ΔHCO₃⁻ × ganho r = 0,68.
- Verificação: confirmado no abstract.

### GOUGH2024SMO / GOUGH2024SM (hidrogel Maurten)
- Citação 1: Gough LA, Sparks SA. The effects of a carbohydrate hydrogel system for the delivery of bicarbonate mini-tablets on acid-base buffering and gastrointestinal symptoms in resting well-trained male cyclists. Sports Med Open 2024;10(1):17. DOI 10.1186/s40798-024-00684-x · PMID 38356036
- Citação 2: Gough LA, Sparks SA. The effects of a novel sodium bicarbonate ingestion system on repeated 4 km cycling time trial performance in well-trained male cyclists. Sports Med 2024;54(12):3199-3210. DOI 10.1007/s40279-024-02083-4 · PMID 39122982
- Amostra: 12 e 10 ciclistas homens bem treinados (VO₂máx 67; T3).
- Resultado: (1) em repouso, pico de HCO₃⁻ +0,95 mmol/L maior e **117 ± 37 × 156 ± 36 min** vs cápsula vegetal; GI agregado −79 UA (g = 1,11). (2) 2 × 4 km: TT1 −5,1 s vs controle e **−3,5 s vs PLA**; TT2 −4,4 s vs controle e −4,1 s vs PLA; GI baixo.
- Conflito: (1) ambos receberam financiamento da Maurten (via universidade); (2) "apoio financeiro parcial e produto fornecidos pela Maurten AB"; Sparks hoje empregado da Maurten.
- Ponto de ensino: dado promissor, mas financiado pelo fabricante — falta replicação independente.
- Verificação: confirmado nos abstracts e conflitos no texto completo (PMC10866843, PMC11608388).

### MCKAY2020 / GURTON2023LOT / GURTON2024LOT / GIBSON2023 (bicarbonato tópico)
- Citação 1: McKay AKA, Peeling P, Binnie MJ, et al. Topical sodium bicarbonate: no improvement in blood buffering capacity or exercise performance. Int J Sports Physiol Perform 2020;15(7):1005-1011. DOI 10.1123/ijspp.2019-0345 · PMID 32575069
- Citação 2: Gurton WH, Greally J, Chudzikiewicz K, et al. Beneficial effects of oral and topical sodium bicarbonate during a battery of team sport-specific exercise tests in recreationally trained male athletes. J Int Soc Sports Nutr 2023;20(1):2216678. DOI 10.1080/15502783.2023.2216678 · PMID 37227399
- Citação 3: Gurton WH, Gough LA, Siegler JC, Lynn A, Ranchordas MK. Oral but not topical sodium bicarbonate improves repeated sprint performance during simulated soccer match play exercise in collegiate athletes. Int J Sport Nutr Exerc Metab 2024;34(6):362-371. DOI 10.1123/ijsnem.2024-0059 · PMID 39222921
- Citação 4: Gibson BM, Needham KW, Kaiser BW, et al. Transcutaneous delivery of sodium bicarbonate increases intramuscular pH. Front Physiol 2023;14:1142567. DOI 10.3389/fphys.2023.1142567 · PMID 36960159
- Amostra: McKay — 10 ativos + 10 ciclistas/triatletas; Gurton 2023 — 14; Gurton 2024 — 10 futebolistas universitários; Gibson — 9 (3 mulheres), sem exercício.
- Intervenção: PR Lotion (Amp Human / Momentous), 0,9036 g/kg de loção × SB oral 0,3 g/kg × placebo.
- Resultado: McKay — **loção não elevou pH nem HCO₃⁻ e não melhorou desempenho**. Gurton 2023 — oral: Yo-Yo IR2 +21 % (+94 m; d = 0,64), sprints −1,9 %; loção: Yo-Yo +7 % (p = 0,084, n.s.), sprints −2,0 % (p = 0,036) **sem mudar o sangue**. Gurton 2024 — oral: sprints 3,7 % e 4,9 % mais rápidos; loção: sem ganho. Gibson — pH do dialisado intramuscular +0,13 em repouso.
- Conflito: Gibson 2023 financiado em parte pela Momentous; um autor tem participação acionária na empresa.
- Ponto de ensino: o tópico não altera o sangue; o único positivo mecanístico é financiado pelo fabricante; os testes de desempenho são majoritariamente nulos.
- Verificação: confirmado nos abstracts; conflito de Gibson no texto completo (PMC10027695). Preprint nulo de Harnish et al. 2025 (loções transdérmicas, ~50 km no Zwift) achado mas NÃO revisado por pares — ver "Não citar".

### GURTON2020DOSE
- Citação: Gurton WH, Gough LA, Sparks SA, Faghy MA, Reed KE. Sodium bicarbonate ingestion improves time-to-exhaustion cycling performance and alters estimated energy system contribution: a dose-response investigation. Front Nutr 2020;7:154. DOI 10.3389/fnut.2020.00154 · PMID 33015125
- Amostra: 12 homens saudáveis (67,5 kg). Intervenção: 0,2 × 0,3 g/kg × NaCl 0,07 g/kg, 60 min antes.
- Resultado: TTE a 105 % PAM **+20,2 s (0,2; p = 0,045) e +31,9 s (0,3; p = 0,004)**; náusea pós-exercício pior com 0,3 g/kg; 0,2 g/kg igual ao PLA em GI.
- Verificação: confirmado no abstract.

### SIEGLER2022HYPER
- Citação: Siegler JC, Carr AJ, Jardine WT, et al. The hyperhydration potential of sodium bicarbonate and sodium citrate. Int J Sport Nutr Exerc Metab 2022;32(2):74-81. DOI 10.1123/ijsnem.2021-0179 · PMID 34875625
- Amostra: 19 (13 H, 6 M). Intervenção: 25 mL/kg de água ± 7,5 g/L de sódio como SB ou citrato.
- Resultado: volume plasmático **+8,1 ± 1,3 % (SB)** × +5,9 % (citrato) × −1,1 % (água); urina −370 mL com SB; massa corporal sem mudança.
- Ponto de ensino: o sódio do SB retém água — útil no calor, ruim para quem precisa bater peso.
- Verificação: confirmado no abstract.

---

## 5. Desconforto gastrintestinal, expectativa e cegamento

### KAHLE2013
- Citação: Kahle LE, Kelly PV, Eliot KA, Weiss EP. Acute sodium bicarbonate loading has negligible effects on resting and exercise blood pressure but causes gastrointestinal distress. Nutr Res 2013;33(6):479-486. DOI 10.1016/j.nutres.2013.04.009 · PMID 23746564
- Amostra: 11 homens e mulheres treinados em endurance. Intervenção: 300 mg/kg × placebo, duplo-cego.
- Resultado: PAS sem efeito; **PAD +3,3 ± 1,1 mmHg; FC +10,1 ± 2,4 bpm**; GI global **5,1 ± 0,5 × 0,5 ± 0,2 (escala 0–10)**; **diarreia em 10/11 (91 %)**, distensão e sede 64 %, náusea 45 %.
- Ponto de ensino: o número mais chocante da literatura: 91 % de diarreia.
- Verificação: confirmado no abstract.

### DURKALEC2023 e DURKALEC2025
- Citação 1: Durkalec-Michalski K, Nowaczyk PM, Kamińska J, et al. The interplay between bicarbonate kinetics and gastrointestinal upset on ergogenic potential after sodium bicarbonate intake: a randomized double-blind placebo-controlled trial. Sci Rep 2023;13(1):7081. DOI 10.1038/s41598-023-34343-0 · PMID 37127791
- Citação 2: Durkalec-Michalski K, Nowaczyk PM, Saunders B, et al. Sex-dependent responses to acute sodium bicarbonate different dose treatment: a randomized double-blind crossover study. J Sci Med Sport 2025;28(2):154-165. DOI 10.1016/j.jsams.2024.08.209 · PMID 39306577
- Amostra: 19 atletas de CrossFit; 30 atletas (mulheres e homens).
- Intervenção: 0,4 g/kg + 15 g de carboidrato, 90 min antes; 0,15/0,25/0,35 g/kg de massa livre de gordura, 120 min antes.
- Resultado: (2023) pico de HCO₃⁻ > +6 mmol/L em 84 %, mas só 52,6 % na largada; desempenho em 6 × 15 s Wingate não melhorou; **GI total correlacionou-se inversamente com potência pico (r = −0,495), média (r = −0,674) e mínima (r = −0,585)**. (2025) interação sexo × tratamento; 0,35 g/kg MLG com mais GI; "impacto prejudicial do GI no desempenho".
- Ponto de ensino: mais GI → menos potência (correlação, não prova causal).
- Verificação: confirmado nos abstracts.

### GURTON2022BLIND
- Citação: Gurton WH, Matta GG, Gough LA, et al. Efficacy of sodium bicarbonate ingestion strategies for protecting blinding. Eur J Appl Physiol 2022;122(12):2555-2563. DOI 10.1007/s00421-022-05031-0 · PMID 36053364
- Amostra: 16 (estudo 1) e 12 (estudo 2).
- Resultado: em solução, o melhor sabor (suco de laranja gelado) deixou só 44 % "na dúvida"; no estudo 2, **cápsula × solução: 92 × 33 % "na dúvida" logo após ingerir; 67 × 17 % antes do teste; 50 × 17 % após**.
- Ponto de ensino: em solução, a maioria descobre o que tomou — o duplo-cego vira simples-cego.
- Verificação: confirmado no abstract.

### GURTON2023EXP
- Citação: Gurton WH, Matta GG, Gough LA, et al. Sodium bicarbonate and time-to-exhaustion cycling performance: a retrospective analysis exploring the mediating role of expectation. Sports Med Open 2023;9(1):65. DOI 10.1186/s40798-023-00612-5 · PMID 37523028
- Amostra: 12 ciclistas recreacionais. Intervenção: 0,3 g/kg em solução e em cápsula, cada um com seu placebo.
- Resultado: TTE +27,0 ± 21,9 s (solução) e +23,0 ± 28,1 s (cápsula); expectativa maior com solução (mediana 3,5 × 2,5; p = 0,033); mediação por expectativa e queda de HCO₃⁻ só em solução.
- Verificação: confirmado no abstract.

### HIGGINS2016SHAM
- Citação: Higgins MF, Shabir A. Expectancy of ergogenicity from sodium bicarbonate ingestion increases high-intensity cycling capacity. Appl Physiol Nutr Metab 2016;41(4):405-410. DOI 10.1139/apnm-2015-0523 · PMID 26863442
- Amostra: 8 homens ativos. Intervenção: placebo (NaCl + água) × "placebo falso" (NaCl + **água gaseificada** para imitar a plenitude gástrica do SB) com roteiro que induzia expectativa.
- Resultado: TLIM **461 ± 148 × 421 ± 150 s (+9,5 %; p = 0,048; d = 0,3)**; PSE 1,4 unidade menor; nada mudou no lactato.
- Ponto de ensino: imitar o desconforto do SB, sem SB, melhorou o desempenho — o GI "avisa" o atleta que ele tomou.
- Verificação: confirmado no abstract.

### MCCLUNG2007
- Citação: McClung M, Collins D. "Because I know it will!": placebo effects of an ergogenic aid on athletic performance. J Sport Exerc Psychol 2007;29(3):382-394. DOI 10.1123/jsep.29.3.382 · PMID 17876973
- Desenho: dupla dissociação (o que se diz × o que se dá); TTs de 1.000 m.
- Resultado: acreditar ter tomado SB → tempos "quase tão rápidos" quanto tomar de fato; tomar SB sem saber → sem melhora significativa.
- Limitações: números não estão no abstract.
- Verificação: confirmado no abstract.

### ZAGATTO2024
- Citação: Zagatto AM, Lopes VHF, Dutra YM, et al. Sodium bicarbonate induces alkalosis, but improves high-intensity cycling performance only when participants expect a beneficial effect: a placebo and nocebo study. Eur J Appl Physiol 2024;124(5):1367-1380. DOI 10.1007/s00421-023-05368-0 · PMID 38032386
- Amostra: 15 ciclistas recreacionais. Intervenção: SB ou dextrose com informação "ergogênico", "inerte" ou "prejudicial". Teste: TTE a 115 % da potência pico.
- Resultado: sem diferença estatística no TTE; tamanhos de efeito vs controle **SB/ergogênico 0,46 (0,15–0,74) e dextrose/ergogênico 0,45 (0,04–0,88)** — o mesmo efeito com ou sem SB, desde que o atleta espere ganho.
- Ponto de ensino: o efeito acompanhou a crença, não a substância.
- Verificação: confirmado no abstract.

---

## 6. O que o bicarbonato NÃO faz (síntese com fonte)
- **Esforço único < 30 s:** nulo em 10 e 30 s (MCNAUGHTON1992DUR); Wingate isolado nulo (LOPESSILVA2019WING; GRGIC2022WING, 1º Wingate DMP 0,02).
- **Força máxima:** DMP −0,03 (GRGIC2020).
- **Sprints repetidos curtos:** nulo (LOPESSILVA2019RSA); em esportes coletivos, sem efeito claro em RSA (GE2026TEAM); rúgbi de elite nulo (CAMERON2010).
- **Provas contínuas longas:** ~30 min de ciclismo (STEPHENS2002), TT 40 km (NORTHGRAVES2014), ~40 min de corrida (FREIS2017) nulos; corrida contínua com ajuste por abandono DMP 0,18, n.s. (MILLER2025RUN). Exceções: McNaughton 1999 (1 h) e Shannon 2024 (40 km com hidrogel, elo industrial). Em prova longa, o uso testado com ganho é o sprint final (DALLE2021).
- **Natação curta (50–100 m):** nula (GRGIC2022SWIM).
- **Lutas — desempenho agrupado:** nulo na meta-análise (MIRANDA2022COMBAT); jiu-jítsu agudo nulo (RAGONE2020); judô, recuperação nula (DANKOVIC2022).
- **Bicarbonato tópico:** não muda o sangue (MCKAY2020; GURTON2023LOT; GURTON2024LOT).
- **Garantir resposta individual:** 5 de 15 nunca melhoraram em 4 tentativas (FROIO2015).

---

## Síntese em 10 linhas
1. O SB eleva o HCO₃⁻ sanguíneo em média +5,2 mmol/L e gera um efeito médio PEQUENO no exercício (ES 0,17; 189 estudos) — DEOLIVEIRA2022. Certeza da evidência: baixa a moderada (GRGIC2021UMB).
2. O alvo é esforço de alta intensidade de ~30 s a ~12 min, sobretudo quando há repetição/acúmulo de acidose (ISSN2021; COSTILL1984; GRGIC2022WING).
3. Em provas fechadas de 45 s–8 min, ES ~0,40 (CHRISTENSEN2017); em TT de ciclismo, DMP 0,42 com I² 0 % (LOPESSILVA2023TT); ~+1,7 % de potência (CARR2011MA); ~2 % pelo COI (IOC2018).
4. Não melhora força máxima, sprint isolado < 30 s nem sprints repetidos curtos; provas contínuas longas: em geral nulo.
5. Dose: 0,2 g/kg é o mínimo e 0,3 g/kg o ótimo; 0,4–0,5 g/kg só acrescentam GI (ISSN2021; MCNAUGHTON1992DOSE). No pico individual, 0,2 rende como 0,3 (GOUGH2018).
6. O pico de HCO₃⁻ varia de 30 a 180 min entre pessoas e é reprodutível na mesma pessoa (JONES2016; GOUGH2017REP) — mapear o atleta faz sentido; o ganho extra em elite é de ~2 s em 2.000 m (BOEGMAN2020).
7. GI é a regra, não a exceção: 29,5 % em ECRs de corrida (MILLER2025RUN), 91 % de diarreia num ECR (KAHLE2013); o GI pode zerar o efeito (SAUNDERS2014).
8. Refeição rica em carboidrato, 120–180 min, cápsula entérica, fracionar ou carga de vários dias reduzem o GI (CARR2011GI; SIEGLER2012; HILTON2020GI; ISSN2021); o hidrogel tem dados bons, mas financiados pelo fabricante.
9. ~25 % do efeito é placebo (MARTICORENA2021); a solução quebra o cegamento (GURTON2022BLIND) e a expectativa sozinha reproduz o efeito (HIGGINS2016SHAM; ZAGATTO2024).
10. Em lutas há ensaios positivos em judô, boxe, taekwondo e caratê, mas pequenos e sem efeito agrupado claro; o sódio (~5–7 g por dose) e a retenção de água pesam para quem bate peso.

## Números-âncora para slides
1. 27,4 % do NaHCO₃ é sódio; 0,3 g/kg num atleta de 75 kg = 22,5 g de pó = **6,2 g de sódio** (3× o teto diário da OMS) — cálculo próprio; KAHLE2013.
2. Alcalose +1,7 % × acidose −1,6 % de potência — CARR2011MA.
3. Efeito médio de 189 estudos: ES 0,17; HCO₃⁻ +5,2 mmol/L — DEOLIVEIRA2022.
4. Provas de 45 s–8 min: ES 0,40 (0,27–0,54) — CHRISTENSEN2017.
5. Força: DMP −0,03; resistência muscular: 0,37 — GRGIC2020.
6. 10 e 30 s: nulo; 120 e 240 s: positivo — MCNAUGHTON1992DUR.
7. Tempo até o pico com 0,3 g/kg: 75–180 min — JONES2016.
8. 800 m: 2,9 s mais rápido — WILKES1983.
9. 5º tiro: 113,5 → 160,8 s (+42 %); pH muscular 6,73 → 6,81 — COSTILL1984.
10. Remo de elite mundial: 369,0 → 367,0 s com o pico individual — BOEGMAN2020.
11. GI 29,5 % × 2,6 %; abandono 8,7 % × 1,6 % — MILLER2025RUN.
12. Diarreia em 10 de 11 — KAHLE2013.
13. Placebo = 25 % do efeito dos tamponantes — MARTICORENA2021.
14. Cápsula × solução: 92 × 33 % "na dúvida" sobre o que tomaram — GURTON2022BLIND.
15. Judô/jiu-jítsu: beta-alanina +7 %, SB +8 %, os dois +14 % de trabalho — TOBIAS2013.

## Histórias verificáveis (storytelling)
1. **1931, Harvard Fatigue Laboratory:** Dennig, Dill e colegas testam alcalose e acidose num único voluntário com 10 g de SB (DENNIG1931; detalhes via ISSN2021 e ANTONIO2026).
2. **1977, os três frascos:** Jones et al. dão a 5 homens giz (CaCO₃), cloreto de amônio ou bicarbonato. A 95 % da potência máxima: 160 s ácido, 270 s controle, 438 s alcalino (JONES1977). Nasce a dose de 0,3 g/kg.
3. **1983, os 800 m:** seis corredores, 2,9 s mais rápidos (WILKES1983) — o suplemento sai do laboratório e vai à pista.
4. **1984, a agulha no músculo:** Costill biopsia o vasto lateral e mostra o músculo "menos ácido" (6,81 × 6,73), com +42 % no último tiro (COSTILL1984). No mesmo ano, o mesmo grupo publica um tiro único nulo (KATZ1984) — a mesma substância, dois desenhos, dois resultados.
5. **2007, o placebo que corre:** quem acreditou ter tomado bicarbonato correu os 1.000 m quase tão rápido quanto quem tomou; quem tomou sem saber não melhorou (MCCLUNG2007).
6. **2016, água com gás:** Higgins e Shabir imitam o estufamento do bicarbonato com água gaseificada e roteiro de expectativa — +9,5 % no tempo até a exaustão sem nenhum tampão (HIGGINS2016SHAM).
7. **2015, quatro tentativas:** o mesmo atleta recebe bicarbonato 4 vezes; a alcalose aparece em todas, o desempenho só às vezes; 5 de 15 nunca melhoram (FROIO2015).
8. **2020, a elite do remo:** 23 remadores do Canadá e da Austrália, 13 de seleções olímpicas/mundiais e um recordista mundial no ergômetro — o "pico individual" vale ~2 s (BOEGMAN2020).
9. **2020–2024, a loção:** a promessa do bicarbonato sem dor de barriga pela pele; o instituto australiano (McKay) não acha nada no sangue nem no desempenho; o único positivo mecanístico é financiado pela empresa (MCKAY2020; GIBSON2023).

## Ideias de visualização
1. **Curva de HCO₃⁻ × tempo com nuvem individual (2D animada):** 16 linhas finas (faixas de JONES2016: picos de 75 a 180 min com 0,3 g/kg) sobre a média; uma faixa horizontal em "+5 mmol/L" como limiar de "tamponamento disponível" (BOEGMAN2020: ~100 min acima de +5, de 40 a 160 min). O espectador arrasta o "horário da largada" e vê quantos atletas estão dentro da janela; depois liga o "aquecimento" e vê a queda e o rebote (JONES2021: queda −3,8 mmol/L com aquecimento intenso e rebote).
2. **Trato GI em corte (3D/2D):** o pó entra no estômago, encontra HCl, bolhas de CO₂ inflam a parede (distensão, arroto); a cápsula entérica passa intacta e se abre no intestino; no intestino, o excesso de soluto puxa água (diarreia osmótica); o hidrogel "escorrega" pelo piloro. Mostrar o teto teórico de ~6,8 L de CO₂ para 22,5 g, com aviso de que é teto, não medida.
3. **Gradiente de pH na membrana do músculo:** dentro da fibra o H⁺ sobe; fora, o bicarbonato "puxa" via MCT1/MCT4 (lactato + H⁺) — animar o efluxo maior com sangue alcalino (IOC2018; ANTONIO2026, mecanismo).
4. **Forest plot interativo:** linhas para CHRISTENSEN2017 (0,40), GRGIC2020 resistência (0,37) e força (−0,03), LOPESSILVA2019RSA (0,43; 0,02; 0,20), LOPESSILVA2023TT (0,42), GRGIC2022SWIM (200–400 m), HUANG2025SWIM (0,26; −0,58 a 1,10), MILLER2025RUN (0,18), GE2026TEAM (0,23, com intervalo de predição), DEOLIVEIRA2022 (0,17). Filtros: duração, modalidade, sexo; um botão "descontar placebo (25 %)" encolhe as barras.
5. **Wingate 1 → 4:** barras que crescem de 0,02 a 0,62 (GRGIC2022WING) — o efeito só aparece quando a acidose se acumula.
6. **Calculadora de sódio:** o aluno digita o peso e a dose; aparecem os gramas de pó, de sódio, as colheres de sal equivalentes e a fração do teto da OMS.

## Armadilhas
1. **"0,3 g/kg é a dose de todo mundo, 60 min antes."** O pico vai de 75 a 180 min (JONES2016) e a ISSN fala em 60–180 min; no pico individual, 0,2 g/kg rende como 0,3 (GOUGH2018).
2. **"Quanto mais, melhor (0,5 g/kg)."** Platô em 0,3 g/kg (MCNAUGHTON1992DOSE); doses maiores = mais GI (ISSN2021).
3. **"Serve para qualquer esforço intenso, inclusive força e tiros curtos."** Força nula (GRGIC2020); < 30 s nulo (MCNAUGHTON1992DUR); RSA nulo (LOPESSILVA2019RSA).
4. **"Tampona o músculo."** O SB é tampão extracelular; atua pelo gradiente que favorece o efluxo de H⁺/lactato (IOC2018). O intracelular é a carnosina (beta-alanina).
5. **"Funciona igual em qualquer nível de treino."** As meta-análises discordam: Peart 2012 achou efeito MENOR em atletas especificamente treinados (PEART2012, só qualitativo); Carr 2011 achou efeito MENOR em NÃO atletas (−1,1 %, CARR2011MA). Apresentar a divergência; em elite, o ganho absoluto é de segundos (BOEGMAN2020; LASSEN2021) e o erro típico do teste é do mesmo tamanho (CARR2012ROW).
6. **"GI é raro e leve."** A ISSN diz "geralmente baixo", mas ECRs mostram 29,5 % (MILLER2025RUN), 15/18 (FREIS2017), 10/11 com diarreia (KAHLE2013); 26 de 101 estudos nem testam GI (WINTER2026GI).
7. **"Duplo-cego garante."** Em solução, a maioria adivinha (GURTON2022BLIND); ~25 % do efeito é placebo (MARTICORENA2021).
8. **"Testou uma vez, é não respondedor."** A resposta varia na mesma pessoa (FROIO2015).
9. **Erros de unidade em fontes primárias e secundárias:** "MJ" em McNaughton 1999 (é kJ); "mmol/kg" em Carr 2011 (é mmol/L); "6,4 g/kg" de beta-alanina na tabela da ISSN (é g/dia).
10. **"A loção/gel resolve."** Loção: não muda o sangue (MCKAY2020). Hidrogel: dados de grupos com financiamento ou vínculo com o fabricante (GOUGH2024SM; SHANNON2024; ANTONIO2026).
11. **"Ajuda em lutas de forma comprovada."** A ISSN lista combate entre os beneficiados, mas a meta-análise de combate não acha efeito agrupado em desempenho (MIRANDA2022COMBAT); jiu-jítsu agudo nulo (RAGONE2020). E 5–7 g de sódio + retenção de água (SIEGLER2022HYPER; ~0,4–0,6 kg em BOEGMAN2020) complicam a pesagem.
12. **Pressão arterial:** dose única não muda a PAS, mas eleva PAD em ~3 mmHg e FC em ~10 bpm (KAHLE2013); uso crônico em hipertensos/doença renal não foi estudado nesse contexto — cautela clínica.

## Não citar
- **"Durkalec-Michalski — 4 semanas × 1 semana (judô)":** não achei estudo de Durkalec-Michalski com esse desenho. O desenho "4 semanas (beta-alanina) × 1 semana (SB)" em judô/jiu-jítsu é TOBIAS2013 (grupo de Artioli). Durkalec-Michalski usa 10 dias de dose progressiva (DURKALEC2018/2020).
- **Peart 2012 — qualquer número (ES, IC, k):** abstract sem números; texto pago. Só a conclusão qualitativa.
- **Boegman 2020 como "remadores canadenses":** eram 23 homens do Canadá E da Austrália; e o estudo não tem braço placebo.
- **Dennig 1931 — números do original:** referência existe, mas não li o PDF; "1 participante, 10 g" vem de revisões.
- **Harnish, Holman, Bruneau 2025, "An Inconvenient Truth: transdermal buffering lotions fail…" (Preprints.org, DOI 10.20944/preprints202508.1009.v1):** preprint, sem revisão por pares.
- **Lopes-Silva 2018 taekwondo — d = 3,48/3,70:** tamanhos de efeito implausíveis para comparar com outros estudos.
- **McNaughton 1999 crônico — "21,1 MJ":** erro de unidade no abstract; citar como kJ.
- **"Atleta famoso X usa o Bicarb System" / Grand Tour:** só "relatos anedóticos" em ANTONIO2026; nenhum nome ou dado verificável.
- **Felippe et al. "2013" (como na tabela da ISSN):** o artigo é IJSPP 2016;11(2):221-226.
