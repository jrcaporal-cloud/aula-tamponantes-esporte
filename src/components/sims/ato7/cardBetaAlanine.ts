import { C } from '../kit/palette';
import type { PrescriptionCard } from './prescription';

/**
 * Slide 101 — O Cartão da Beta-alanina. O que ISSN 2015, AIS 2025 e COI 2018 escrevem, linha a linha,
 * e a regra brasileira. Fontes: dossiê 02 (seções 2, 3 e 7), dossiê 04 (seção G) e dossiê 06 (Partes 1–3).
 */
export const BETA_ALANINE_CARD: PrescriptionCard = {
    compound: 'Beta-alanina',
    color: C.carno,
    tagline: 'crônica · semanas antes',
    fields: [
        {
            tab: 'Quem', field: 'Para quem', value: 'esforço de 0,5–10 min, sobretudo 1–4 min',
            title: 'Esforço de 0,5 a 10 min, sobretudo 1 a 4 min',
            text: 'Em 40 estudos, ES 0,18 — grande em teste até a exaustão, incerto em prova fechada. O ganho aparece de 60 a 240 s; abaixo de 60 s, nada. A ISSN aponta contrarrelógios de 1–4 min.',
            points: [
                'Não serve: sprint isolado, sprints repetidos (SMD −0,02), força, composição corporal.',
                'Não é pré-treino: o AIS não acha evidência de efeito agudo.',
            ],
            seal: 'meta-análises', sealColor: C.carno,
            source: 'Saunders 2017 (BJSM, 1.461 participantes); Hobson 2012; Trexler 2015 (ISSN); Liang 2026; AIS 2025.',
            visual: {
                kind: 'stats',
                items: [
                    { value: '0,18', label: 'ES geral · 40 estudos', color: C.carno },
                    { value: '0,50', label: 'capacidade (até a exaustão)', color: C.ok },
                    { value: '0,11', label: 'desempenho (prova fechada)', color: C.stone },
                ],
            },
        },
        {
            tab: 'Dose', field: 'Dose', value: '3,2–6,4 g/d, doses ≤ 1,6 g, com refeição',
            title: '3,2 a 6,4 g/dia, fracionados, com a refeição',
            text: 'ISSN: 4–6 g/d. AIS: 1,6 g nas 3 refeições e no maior lanche = 6,4 g/d. COI: ~65 mg/kg/d, em 0,8–1,6 g a cada 3–4 h. Com 3,2 g/d funciona, só é mais lento.',
            points: [
                'Acima de 800 mg por dose, sem liberação lenta, costuma formigar (Décombaz 2012).',
                'Com a refeição, a carga no sóleo foi maior: +64% × +41% (Stegen 2013).',
            ],
            seal: 'consenso · COI em 70 kg = cálculo', sealColor: C.carno,
            source: 'Trexler 2015 (ISSN); AIS 2025; Maughan 2018 (COI); Harris 2006; Décombaz 2012; Stegen 2013; IN 28.',
            visual: {
                kind: 'range', unit: 'gramas de beta-alanina por dia', min: 0, max: 7, ticks: [0, 1, 2, 3, 4, 5, 6, 7], decimals: 0,
                rows: [
                    { label: 'estudos de carga', from: 3.2, to: 6.4, color: C.carno },
                    { label: 'ISSN 2015', from: 4, to: 6, color: C.carno },
                    { label: 'AIS 2025', from: 6.4, to: 6.4, color: C.carno, note: '4 × 1,6 g' },
                    { label: 'COI · 70 kg', from: 4.55, to: 4.55, color: C.carno, note: '~65 mg/kg' },
                    { label: 'rótulo no Brasil', from: 0, to: 2, color: C.risk, note: 'IN 28' },
                ],
            },
        },
        {
            tab: 'Tempo', field: 'Quanto tempo', value: '≥ 4 semanas; manda a dose acumulada',
            title: 'Semanas, não dias: manda a dose acumulada',
            text: 'Mínimo de 4 semanas (AIS); o COI propõe 10–12. A mediana dos estudos, 179 g acumulados (+2,85%), leva 28 dias a 6,4 g/d e ~90 dias a 2 g/d. Metade do teto de carnosina só com 377 g.',
            points: [
                'Começa com a temporada, não na semana da prova-alvo.',
                'Em carnosina, 99,3% respondem (Rezende 2020).',
            ],
            seal: 'consenso + MA · dias = cálculo', sealColor: C.carno,
            source: 'AIS 2025; Trexler 2015 (ISSN); Maughan 2018 (COI); Hobson 2012; Rezende 2020.',
            visual: {
                kind: 'range', unit: 'semanas de uso', min: 0, max: 24, ticks: [0, 4, 8, 12, 16, 20, 24], decimals: 0,
                rows: [
                    { label: 'ISSN 2015', from: 2, to: 4, color: C.carno, note: 'mínimo' },
                    { label: 'AIS 2025', from: 4, to: 24, mark: 18, color: C.carno, note: 'média 18' },
                    { label: 'COI 2018', from: 10, to: 12, color: C.carno },
                    { label: '179 g a 6,4 g/d', from: 4, to: 4, color: C.ok, note: '28 dias' },
                    { label: '179 g a 2 g/d', from: 12.9, to: 12.9, color: C.risk, note: '~90 dias' },
                ],
            },
        },
        {
            tab: 'Manter', field: 'Manter e parar', value: '~1,2 g/d mantém; some em 6–15 sem',
            title: 'Dose menor segura o tanque; parar esvazia devagar',
            text: 'O AIS sugere ~1,2 g/d de manutenção para segurar +30–50% de carnosina. Ao parar, ela cai ~2% por semana e volta à linha de base em 6 a 15 semanas — mais tarde em quem subiu mais.',
            points: [
                'O tempo médio até a carnosina máxima, no AIS, é de 18 semanas (4 a 24).',
                'A ficha do AIS também escreve 1,6 g/d; ficamos com 1,2, que bate com o texto.',
            ],
            seal: 'consenso + ECR', sealColor: C.carno,
            source: 'AIS 2025; Baguet 2009 (n = 15); Stellingwerff 2012 (n = 31).',
            visual: {
                kind: 'stats',
                items: [
                    { value: '~1,2 g/d', label: 'manutenção (AIS)', color: C.carno },
                    { value: '~2%', label: 'perda por semana ao parar', color: C.stone },
                    { value: '6–15 sem', label: 'até voltar à linha de base', color: C.stone },
                ],
            },
        },
        {
            tab: 'Brasil', field: 'Regra e cuidados', value: 'rótulo ≤ 2 g/d, ≥ 19 anos; formigamento',
            title: 'No rótulo brasileiro, 2 g/dia e só a partir de 19 anos',
            text: 'IN 28: até 2 g/d, em doses de até 300 mg a cada 2 h; não autorizada até 18 anos, em gestantes e lactantes. Prescrever acima é zona cinzenta (CFN 656, sem parecer localizado): justificar no prontuário.',
            points: [
                'Formigamento é o único efeito consistente (OR 8,9); taurina muscular não cai.',
                'Sem sódio: no hipertenso é a opção que sobra. Histidina cai ~31% com 6 g/d.',
            ],
            seal: 'regra + meta-análise', sealColor: C.risk,
            source: 'Anvisa IN 28 (IN 102/2021); CFN 656; Dolan 2019 (101 estudos); Saunders 2020; del Favero 2012; Blancquaert 2017.',
            visual: {
                kind: 'flags',
                items: [
                    { label: 'adulto saudável', signal: 'verde' },
                    { label: 'hipertensão (sem sódio)', signal: 'verde' },
                    { label: '60–80 anos (3,2 g/d, 12 sem)', signal: 'verde' },
                    { label: 'doença renal (sem dados)', signal: 'amarelo' },
                    { label: 'abaixo de 19 anos (IN 28)', signal: 'vermelho' },
                    { label: 'gestação e lactação (IN 28)', signal: 'vermelho' },
                ],
            },
        },
        {
            tab: 'Combinar', field: 'Junto do bicarbonato', value: 'β-alanina de base + bicarbonato no fim',
            title: 'Juntos somam um pouco: base de semanas + dose no fim',
            text: 'Com os quatro braços, a combinação deu SMD 0,32 contra 0,17–0,18 dos isolados. Em judocas e lutadores de jiu-jítsu: 6,4 g/d por 4 semanas e bicarbonato só na última (+7%, +8%, +14%).',
            points: [
                'O maior estudo (71 ciclistas) foi nulo no contrarrelógio (da Silva 2019).',
                'Somar cafeína ou creatina não deu ganho extra (Moesgaard 2024; Bai 2026).',
            ],
            seal: 'meta-análise pequena (10 estudos)', sealColor: C.stone,
            source: 'Curran-Bowen 2024 (243 pessoas); Tobias 2013 (n = 37); da Silva 2019; Trexler 2015 (ISSN); Moesgaard 2024; Bai 2026.',
            visual: {
                kind: 'stats',
                items: [
                    { value: '0,17', label: 'bicarbonato sozinho', color: C.base },
                    { value: '0,18', label: 'β-alanina sozinha', color: C.carno },
                    { value: '0,32', label: 'os dois juntos (SMD)', color: C.ok },
                ],
            },
        },
    ],
};
