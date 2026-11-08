# Roteiro — "Ácido, Base e Performance" (56 slides, 7 atos, ~2h45 com discussão)

Fio narrativo: **o Inquérito do H⁺**. A fadiga é o "crime"; o ácido lático é o suspeito de sempre (e injustiçado);
a perícia (fisiologia) reconstitui a cena; bicarbonato e beta-alanina são as testemunhas de defesa da performance;
outras substâncias são testemunhas fracas; a metodologia é o contra-interrogatório; a prática é o veredito.
Quatro personagens FICTÍCIOS atravessam a aula (sempre rotulados "caso fictício"; dossiê 06, Parte 5):
**Júlia** (24 a, 800 m, 54 kg), **Rafael** (28 a, jiu-jítsu leve, 76 kg, até 5 lutas de 6–10 min, pesagem IBJJF
imediatamente antes da 1ª luta), **Carlos** (58 a, remo master 2.000 m, 82 kg, hipertenso com hidroclorotiazida + losartana),
**Bianca** (18 a, natação 200 m, 60 kg, ovolactovegetariana).

Fontes: IDs entre colchetes são os blocos dos dossiês em `docs/dossie/` (01 bicarbonato, 02 beta-alanina, 03 fisiologia,
04 outros/combinações, 05 metodologia, 06 prática/segurança). **Só use números que estão nos dossiês como confirmados.**
Ids dos slides: número inteiro único; a ordem abaixo é a ordem da aula. `min` = tempo-alvo com discussão.

## Ato I · O Inquérito (abertura)
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 0 | Ácido, Base e Performance (capa) | — (pronta) | — | 1 |
| 10 | Os Últimos 200 Metros | `LastLapSim` | Júlia na reta final do 800 m: a velocidade cai, "as pernas queimam". Passos: a prova → a queda de ritmo → pergunta "o que queima?". Medidor de pH muscular ilustrativo 7,08→6,60 [SAHLIN1976 em 03]. Sem prometer efeito. | 3 |
| 11 | Culpado ou Inocente? | `VerdictVoteSim` | 6 acusações para a turma votar, reveladas uma a uma com veredito + fonte: (1) ácido lático causa a queimação → depende/cúmplice; (2) lactato causa dor tardia → inocente [SCHWANE1983]; (3) o H⁺ é a única causa da fadiga → inocente [CADY1989, WESTERBLAD1997]; (4) bicarbonato melhora qualquer prova → falso [GRGIC2020, MCNAUGHTON1992DUR]; (5) beta-alanina funciona na primeira semana → falso [HARRIS2006, HILL2007]; (6) bicarbonato é doping → oral não; na veia, pelo volume, sim [WADA M2.2 em 06]. O resultado volta no slide 97. | 4 |
| 12 | Quatro Atletas, um Problema | `CastSim` | Os 4 personagens (cartões com esporte, duração do esforço, dilema). Rótulo "casos fictícios". | 3 |
| 13 | O Mapa do Inquérito | `InquiryMapSim` | Os 7 capítulos como peças de um quadro de investigação (perícia → testemunhas → contra-interrogatório → veredito); o tamanho do prêmio: "efeito médio pequeno, ~2%" [DEOLIVEIRA2022, IOC2018] — a pergunta da aula é para QUEM e QUANDO. | 2 |

## Ato II · A Perícia (fisiologia ácido-base)
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 20 | Uma Escala de Nanomols | `PhScaleSim` | pH é log: [H⁺] em nmol/L; régua com sangue 7,42, músculo em repouso 7,08, exaustão 6,60, sangue após 2.000 m 7,07 [SAHLIN1976, NIELSEN2002]; slider mostra quantas vezes mais H⁺. | 3 |
| 21 | Henderson–Hasselbalch sem Medo | `HendersonSim` | Sliders HCO₃⁻ e PCO₂ → pH (pKa 6,1; 0,03×PCO₂). Cenários: repouso 24/40; fim do 2.000 m (pH 7,07; HCO₃⁻ ~11 = cálculo, rotular); com bicarbonato (+5,2 mmol/L [DEOLIVEIRA2022]). Passo 2: um tampão trabalha melhor perto do pKa — curvas de titulação de bicarbonato (6,1), carnosina (6,83 [SALE2010]) e fosfato. | 4 |
| 22 | O Julgamento do Ácido Lático | `LacticTimelineSim` | Linha do tempo: 1907 Fletcher & Hopkins; Nobel 1922 (Hill e Meyerhof); 1931 Dennig; 1983 Schwane (dor tardia); 1986 Brooks (≥75% oxidado); 2004 Robergs; 2005 as quatro brigas na mesma revista; 2010 Marcinek (inclinação 0,98). | 4 |
| 23 | O Homem que se Acidificou de Propósito | `DennigSim` | História de Dennig (n=1, Harvard Fatigue Laboratory): cloreto de amônio → 15 min na esteira; 10 g de bicarbonato → cãibras tetânicas. O ganho da alcalose foi só deduzido. Use os detalhes confirmados em 03 (DENNIG1931). | 3 |
| 24 | De Onde Vem o H⁺? | `ProtonSourcesSim` | Três leituras (Robergs: hidrólise de ATP; clássica: ácido lático; Stewart: diferença de íons fortes 62% × PCO₂ 12% [LINDINGER1995]) e o ponto de acordo: H⁺ e lactato sobem ~1:1 [MARCINEK2010] — o lactato é o termômetro, não o fogo. | 4 |
| 25 | Lactato: Combustível, não Lixo | `LactateShuttleSim` | Lanzadeira: fibra glicolítica → lactato → fibra oxidativa/coração; ≥75% oxidado no exercício estável [BROOKS1986a]; meia-vida curta no músculo (dado de 03). | 3 |
| 26 | As Quatro Linhas de Defesa | `DefenseLinesSim` + 3D `fibra-acida` | Tampões intracelulares (proteínas/histidina, fosfato, carnosina ~7% [MANNION1992], PCr/CK), exportação (MCT1/MCT4, NHE1, NBC), tampão extracelular (bicarbonato, Hb) e ventilação (CO₂). Não citar % por tampão nem por transportador (não confirmado). Tecla 3 abre o modelo da fibra. | 4 |
| 27 | O H⁺ é Mesmo o Vilão? | `FatigueCourtSim` | Tribunal com provas de acusação e defesa: temperatura (−28% a 12 °C × −10% a 32 °C [WESTERBLAD1997]); potência em fibra humana a pH 6,2 (−34% tipo I, −18% IIa [KNUTH2006]); McArdle fadiga sem acidificar [CADY1989]; acidose "protetora" em rato que não se repetiu [PEDERSEN2004, KRISTENSEN2005]; sinergia com Pi; sensação de fadiga só com pH+ATP+lactato juntos [POLLAK2014]. Veredito: cúmplice, não chefe. | 5 |
| 28 | A Dor que Vem Descendo o Morro | `DomsSim` | Schwane 1983: plano a 78% × descida a 57%; só a descida deu dor, CK +351% em 24 h; lactato some em minutos. | 2 |
| 29 | Então por que Tamponar Funciona? | `WhyItWorksSim` + 3D `fibra-acida` | Alcalose extracelular → gradiente maior → mais saída de H⁺/lactato: efluxo da perna 10,0 × 4,2 mmol/min [HOLLIDGE2000]; glicólise mais rápida; menos K⁺ fora; acidose adiada; o bicarbonato não muda o pH do músculo em repouso. Soma de mecanismos, peso relativo incerto. | 4 |
| 30 | O Treino, o Primeiro Tampão | `TrainingBufferSim` | βm +37% em 8 semanas de sprint (44,7→61,0 [SHARP1986]); +25% × +2% intervalado × contínuo [EDGE2006]; +16% com 6 sessões de HIIT [WESTON1997]; treino intenso demais −11% [BISHOP2008]; perde-se em ~6 semanas [MCGINLEY2016]; pH sanguíneo mínimo 7,065 velocistas × 7,175 fundistas [MEDBO1985]. | 3 |

## Ato III · A Primeira Testemunha: Bicarbonato
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 40 | 1977: Três Frascos | `ThreeVialsSim` | Jones 1977: 5 homens, CaCO₃ (placebo), NH₄Cl ou NaHCO₃ 0,3 g/kg; a 95% da potência máxima: 160 s ácido, 270 s controle, 438 s alcalino [JONES1977]. Nasce a dose de 0,3 g/kg — de um estudo com 5 pessoas e um teste até a exaustão (gancho para o Ato VI). | 3 |
| 41 | Da Pista à Biópsia | `PioneersSim` | 1983: 800 m 2,9 s mais rápido, 6 corredores [WILKES1983]; 1984: Costill biopsia — 5º tiro +42% (113,5→160,8 s), pH muscular 6,73→6,81 [COSTILL1984]; no mesmo ano, tiro único nulo [KATZ1984]: mesma substância, dois desenhos, dois resultados. | 4 |
| 42 | Do Copo ao Músculo | `BicarbJourneySim` + 3D `jornada-bicarbonato` | No estômago, HCl + HCO₃⁻ → CO₂ (estufamento); absorção; HCO₃⁻ sanguíneo +5,2 mmol/L em média [DEOLIVEIRA2022]; pH sobe; gradiente; saída de H⁺ da fibra. | 4 |
| 43 | O que Dizem 189 Estudos | `BicarbForestSim` | Forest plot de estimativas agrupadas: geral ES 0,17 [DEOLIVEIRA2022]; provas de 45 s–8 min 0,40 (0,27–0,54) [CHRISTENSEN2017]; contrarrelógio de ciclismo 0,42, I² 0% [LOPESSILVA2023TT]; força −0,03 e resistência muscular 0,37 [GRGIC2020]; +1,7% potência com alcalose × −1,6% com acidose [CARR2011MA]; combate sem efeito agrupado [MIRANDA2022]. Certeza baixa a moderada [GRGIC2021UMB]. | 5 |
| 44 | A Janela de Duração | `DurationWindowSim` | Eixo de duração do esforço: 10 e 30 s nulos, 120 e 240 s positivos [MCNAUGHTON1992DUR]; alvo ~30 s–12 min [ISSN2021]; sprints repetidos curtos e provas longas: nulos. Os 4 personagens posicionados no eixo. | 3 |
| 45 | Dose: Mais não é Melhor | `BicarbDoseSim` | 0,2 g/kg mínimo, 0,3 ótimo, 0,4–0,5 só somam GI [ISSN2021; MCNAUGHTON1992DOSE]; no pico individual 0,2 rende como 0,3 [GOUGH2018]. | 3 |
| 46 | Cada Atleta tem seu Relógio | `TimeToPeakSim` + 3D `jornada-bicarbonato` | Curvas individuais: pico de 75 a 180 min com 0,3 g/kg [JONES2016]; reprodutível em [GOUGH2017REP] × Tmax 127–169 min na mesma pessoa [05]; remo de elite: 369,0→367,0 s no pico individual, 23 remadores (Canadá e Austrália), sem braço placebo, só 1 de 23 no pico aos 60 min, d = 0,15 [BOEGMAN2020]. Interação: horário fixo × individualizado. | 4 |
| 47 | O Preço no Intestino | `GutSim` | GI 29,5% × 2,6% e abandono 8,7% × 1,6% [MILLER2025RUN]; diarreia em 10 de 11 [KAHLE2013]; o GI pode zerar o efeito [SAUNDERS2014]; estratégias com força de evidência: refeição rica em carboidrato, 120–180 min, cápsula, fracionar, carga de vários dias [CARR2011GI, SIEGLER2012, ISSN2021]; cápsula entérica [HILTON2020GI]; hidrogel (dados financiados pelo fabricante); loção tópica nula no estudo independente [MCKAY2020]. | 4 |
| 48 | Quanto Sódio é Isso? | `SodiumCalcSim` | Calculadora: massa corporal × dose (g/kg) → g de NaHCO₃ (27,4% de Na), g de Na, × teto da OMS (2 g/dia), cápsulas de 840 mg, teto do rótulo do antiácido ~16,8 g/24 h [BULA-ARMHAMMER]; presets dos 4 personagens (Júlia 54, Rafael 76, Carlos 82, Bianca 60 kg). | 3 |
| 49 | Nos Tatames | `MatSim` | Judô na USP [ARTIOLI2007]; boxe, taekwondo, caratê com ensaios positivos pequenos; meta-análise de combate sem efeito agrupado [MIRANDA2022]; único ensaio agudo de jiu-jítsu nulo (preensão) [RAGONE2020]; o dilema de Rafael: pesagem IBJJF imediatamente antes da 1ª luta, sem janela de 2–3 h; sódio e água pesam na balança. | 4 |

## Ato IV · A Segunda Testemunha: Beta-alanina
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 60 | Uma Molécula que Veio da Carne | `CarnosineOriginSim` | 1900: descoberta na carne (Gulewitsch); baleias, galgos, cavalos e peito de frango ricos em dipeptídeos de histidina; humano "pobre"; vasto lateral ~20 mmol/kg ms (♂21,3 × ♀17,5) [MANNION1992]; vegetarianos −26% [EVERAERT2011]. | 3 |
| 61 | β-alanina + Histidina = Carnosina | `CarnosineChemSim` + 3D `carnosina` | CARNS1; β-alanina é o limitante; imidazol pKa 6,83 [SALE2010]; ~7% do tampão muscular humano [MANNION1992]; carnosinase sérica: meia-vida 1,2 min (carnosina) × 34,9 min (balenina) [DEJAGER2023]; carnosina oral = fonte cara de β-alanina (+65,8% × +64,2% [HARRIS2006]). | 4 |
| 62 | Encher o Tanque Leva Semanas | `CarnosineLoadingSim` + 3D `carnosina` | Simulador de carga: g/dia × semanas → carnosina; +42%/+64% em 4 sem com 3,2/6,4 g/d [HARRIS2006]; +58,8% (4 sem) → +80,1% (10 sem) [HILL2007]; ED50 377 g e 99,3% respondem [REZENDE2020]; só ~3% vira carnosina; com refeição +64% × +41% [STEGEN2013]; washout ~2%/semana, 6–15 sem [STELLINGWERFF2012, BAGUET2009]; no Brasil 2 g/d → ~90 dias para 179 g × 28 dias a 6,4 g/d [06]. | 5 |
| 63 | O Homem da Creatina | `HarrisStorySim` | Roger Harris (creatina e β-alanina) [AIS-GRUPO-A]; creatina satura em ~5 dias × carnosina em semanas; patente de 1997 da NAI, estudos de Chichester em 2006 com conflito de interesse declarado [06]. | 3 |
| 64 | O Formigamento | `ParesthesiaSim` + 3D `carnosina` | MrgprD identificado em 2004 [SHINOHARA2004]; Liu 2012 (J Neurosci): coceira depende de MrgprD, sem histamina [LIU2012]; OR 8,9 [DOLAN2019]; pico plasmático 248 × 82 µM pura × liberação lenta [DECOMBAZ2012]; >800 mg por dose; fracionar. | 3 |
| 65 | O que Dizem 40 Ensaios | `BetaAlanineForestSim` | ES 0,18 (0,08–0,28), 40 estudos, 1.461 participantes; capacidade 0,50 × desempenho 0,11 [SAUNDERS2017BJSM]; +2,85% mediana com 179 g, <60 s sem efeito [HOBSON2012]; sprints repetidos −0,02 [LIANG2026]; contrarrelógio de 1 h nulo com carnosina +143–161% [CHUNG2014]; força/composição nulos (ΔMLG +0,05 kg [ASHTARYLARKY2022]). | 5 |
| 66 | Os "Quases" da Elite | `EliteNearMissSim` | 400 m: carnosina +47%, tempo igual [DERAVE2007]; remadores belgas 4,3 s mais rápidos com P=0,07 [BAGUET2010ROW]; o "spin" de Kern & Robinson 2011 [KERN2011]. Significância × relevância. | 4 |

## Ato V · Testemunhas Fracas e Alianças
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 70 | Citrato: a Mesma Alcalose, Outro Relógio | `CitrateSim` | HCO₃⁻ de pico 34,2 × 33,6 mmol/L [URWIN2023]; pico 180–212 min × 120–180 [URWIN2016, URWIN2023]; ICC 0,07 do tempo até o pico [MCMANUS2026]; meta-análise 0,0% (±1,3%) [CARR2011]; menor que bicarbonato [DEOLIVEIRA2022]; mais sódio por dose. | 3 |
| 71 | O Banco das Testemunhas Fracas | `EvidenceMapSim` | Mapa força da evidência × efeito: lactato (nulo, GI), fosfato (+9,8% n=6 × 32,8=32,8 min n=20 [FOLLAND2008, BROWN2019]), creatina (não tampão), histidina, carnosina oral, anserina/balenina, água alcalina (o pH sanguíneo "6,23" impossível [HEIL2010]), dieta alcalina, KHCO₃, e o CaCO₃ — que é o placebo dos ensaios. | 4 |
| 72 | A Dieta que "Acidificava" | `LowCarbSim` | Greenhaff 1988: pouco carboidrato → acidose e 179 × 210 s; Ball 1996: corrigir o pH com bicarbonato não devolveu o desempenho — era o glicogênio [BALL1996]. Confusão de variáveis como lição. | 3 |
| 73 | Alianças | `ComboSim` | β-alanina + bicarbonato: SMD 0,32 × 0,17–0,18 isolados [CURRANBOWEN2024]; judô/jiu-jítsu +7/+8/+14% [TOBIAS2013]; maior estudo (71 ciclistas) nulo [04]; cafeína + bicarbonato +2,4/+2,6/+2,7% [KILDING2012]; nitrato + bicarbonato nulo [CALLAHAN2017]; "stack" completo não somou [MOESGAARD2024]; o resto é extrapolação [BURKE2017]. | 4 |
| 74 | Treinar Alcalino? | `AlkalineTrainingSim` | Tempo até a fadiga +164% × +123% em mulheres ativas [EDGE2006B]; mais mitocôndria em rato, PGC-1α em humano [04]; remadores de elite: nada [DRILLER2013]; HIIT em vegetarianos +30% de carnosina [PAINELLI2018]. | 3 |

## Ato VI · O Contra-interrogatório (metodologia)
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 80 | (citação) Como um estudo engana sem mentir | QuoteSlide | "Nenhum desses estudos mentiu. Mas quase todos podem enganar quem lê só o resumo." | 1 |
| 81 | O Teste Decide o Tamanho do Efeito | `TestNoiseSim` | CV 26,6% (tempo até exaustão) × 3,35% (contrarrelógio) [JEUKENDRUP1996]; 15,1% × 2,0% nos mesmos corredores [LAURSEN2007]; mesma hipóxia: −45% × +5,7%, sensibilidade 6,3 × 4,5 [AMANN2008]; o +13% de Hill e o +62% de 1977 são de capacidade. | 4 |
| 82 | Onze Atletas e um Sussurro | `PowerSim` | ~11 pessoas por estudo (189 artigos, 2.019 pessoas); SWC = 0,3 × CV [HOPKINS2004_SWC]; ciclista de elite varia 1,3%, SWC ~0,6% [PATON2006]; crossover 16–65 atletas [HOPKINS1999]. Simulação: efeito real de 1%, CV 2%, n = 11 → poder ~20% (cálculo ilustrativo, rotular) e a "maldição do vencedor". | 5 |
| 83 | Cruzado ou Paralelo? | `DesignSim` | Bicarbonato permite cruzado (familiarização: o 2º teste já melhora 1,2%); β-alanina exige paralelo: washout de até 15 semanas [BAGUET2009]. | 3 |
| 84 | O Placebo que Denuncia | `BlindingSim` | Cápsula × solução: 92% × 33% "não sei" logo após, 50% × 17% ao fim [GURTON2022]; parestesia OR 8,9; água com gás +9,5% [HIGGINS2016]; placebo = 25% do efeito [MARTICORENA2021]; 627 velocistas e a cápsula vazia [HURST2017: só nocebo e melhora em quem pretendia usar]; dextrose "ergogênica" (Zagatto 2024). | 5 |
| 85 | Respondedor ou Ruído? | `ResponderSim` | Comparar DP das mudanças com o do controle [ATKINSON2015]; 4 tentativas no mesmo atleta, 5 de 15 nunca melhoram [FROIO2015]; Tmax não se reproduz bem. Simulação: efeito idêntico em todos + ruído → "respondedores" falsos. | 4 |
| 86 | A Meta-análise por Dentro | `MetaInsideSim` | IC × intervalo de predição (72,4% das meta-análises "significativas" têm intervalo de predição que inclui o nulo [INTHOUT2016]); I²; funil e Egger; GRADE; a saga da MBI e o falso-positivo de até 45% [LOHSE2020]; Carr 2011 usa MBI. | 5 |
| 87 | Quem é Estudado? | `WhoIsStudiedSim` | 1.826 estudos: 23% mulheres; ~70% Tier 0–2; Tier 4–5 = 10% [SMITH2022]; bicarbonato: 4% com mulheres (auditoria AIS) [06]. | 3 |
| 88 | Leitor Crítico | `CriticalReaderSim` | Resumo fictício de um estudo com bandeiras vermelhas clicáveis (tempo até exaustão, n = 9, MBI, placebo sem sódio em solução, exclusão por GI, financiamento do fabricante, conclusão além dos dados). | 5 |

## Ato VII · O Veredito (prática)
| id | título | sim | conteúdo | min |
|---|---|---|---|---|
| 90 | As Regras do Jogo | `RulesSim` | Fora da Lista Proibida 2026; bicarbonato na veia viola o M2.2 pelo volume (>100 mL/12 h; 21 g a 8,4% = 250 mL); o "milkshake" dos cavalos (TCO₂ 36–37 mmol/L, caso O'Neill, HISA 2024) e a meta-análise equina de efeito zero [DENHAM2020]; o risco real é a contaminação (14,8% e 38%) [GEYER2004, DUIVEN2021]. | 4 |
| 91 | E no Brasil? | `BrazilRegSim` | IN 28: β-alanina máx. 2 g/d, ≤300 mg a cada 2 h, não autorizada <19 a, gestantes e lactantes; bicarbonato/citrato só como fonte de sódio em suplemento líquido de eletrólitos; bicarbonato em pó = antiácido; CFN 656: zona cinzenta, sem parecer encontrado [06]. | 4 |
| 92 | Quando o Tampão Vira Problema | `SafetySim` | Semáforo por perfil: 20 g/d por 1 semana → pH 7,61, K⁺ 2,6, lesão renal [DIACONU2022]; ruptura gástrica, 36 casos, mortalidade 41,6% [HAN2022]; 192 intoxicações (11,5% para burlar urina) [ALABRI2014]; idosos com doença renal: mais eventos adversos [BICARB2020]; tiazida + bicarbonato = hipocalemia; PAD +3,3 [KAHLE2013]; β-alanina segura até 24 sem, taurina inalterada [DOLAN2019]. | 4 |
| 93 | O Dia de Prova | `CompetitionDaySim` | Linha do tempo de cada personagem: Júlia (eliminatória e final em dias seguidos), Rafael (pesagem na hora, até 5 lutas), Carlos (tiazida exige AUT), Bianca (eliminatória de manhã, final à tarde; 18 anos). | 4 |
| 94 | Quatro Casos, Quatro Vereditos | `CaseVerdictSim` | Para cada personagem: o que a evidência diz, armadilhas e decisão (dossiê 06, Parte 5). Rótulo "fictícios". | 6 |
| 95 | Testar no Treino Antes da Prova | `ProtocolFlowSim` | Fluxo de decisão (consenso AIS/ISSN/COI): a prova está na janela? → contraindicações? → regras (WADA/Anvisa) → teste no treino (GI, horário, sódio) → registrar → decidir. Sem receita: é um fluxo de raciocínio. | 4 |
| 96 | O que Levar para Segunda-feira | `TakeawaysSim` | 5 mensagens finais. | 3 |
| 97 | O Veredito das Acusações | `VerdictRecapSim` | Volta às 6 acusações do slide 11, agora com o veredito justificado em uma linha cada. | 3 |
| 99 | (citação final) | QuoteSlide | "O tampão não vence a prova. Ele só adia o momento em que o atleta descobre o próprio limite." (ou frase melhor, sem prometer efeito) | 1 |

Modelos 3D (tecla 3): `fibra-acida` (slides 26, 29), `jornada-bicarbonato` (42, 46), `carnosina` (61, 62, 64).
