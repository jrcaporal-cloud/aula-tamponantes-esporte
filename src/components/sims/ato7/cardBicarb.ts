import { C } from '../kit/palette';
import type { PrescriptionCard } from './prescription';

/**
 * Slide 100 — O Cartão do Bicarbonato. O que ISSN 2021, AIS 2025 e COI 2018 escrevem, linha a linha.
 * Fontes: dossiê 01 (seção 4, farmacocinética e prática), dossiê 06 (Partes 1–3 e tabela 3.1).
 */
export const BICARB_CARD: PrescriptionCard = {
    compound: 'Bicarbonato de sódio',
    color: C.base,
    tagline: 'agudo · horas antes',
    fields: [
        {
            tab: 'Quem', field: 'Para quem', value: 'esforço intenso de 30 s a ~12 min',
            title: 'Esforço intenso de 30 s a ~12 min',
            text: 'Efeito estabelecido sobretudo entre 30 s e 12 min, em esforço único ou repetido; acima de 10 min também aparece (ES 0,22). O prêmio é pequeno: o COI fala em ~2% em esforços de ~1 min.',
            points: [
                'Não serve: força máxima, esforço isolado de 10–30 s, sprints repetidos curtos.',
                'Lutas: o lactato sobe, o desempenho agrupado não (Miranda 2022).',
            ],
            seal: 'meta-análises + consenso', sealColor: C.base,
            source: 'Grgic 2021 (ISSN); de Oliveira 2022; Christensen 2017; Grgic 2020; McNaughton 1992; Miranda 2022; Maughan 2018 (COI).',
            visual: {
                kind: 'stats',
                items: [
                    { value: '0,17', label: 'ES geral · 189 artigos', color: C.base },
                    { value: '0,40', label: 'provas de 45 s a 8 min', color: C.ok },
                    { value: '−0,03', label: 'força máxima (SMD)', color: C.risk },
                ],
            },
        },
        {
            tab: 'Dose', field: 'Dose', value: '0,2–0,3 g/kg (0,3 = ótima)',
            title: '0,2 g/kg é o mínimo; 0,3 g/kg, o ótimo',
            text: 'Os três consensos ficam entre 0,2 e 0,4 g/kg; com 0,4–0,5 g/kg não há ganho a mais, só mais sintomas. No pico individual, 0,2 g/kg rendeu como 0,3 (Gough 2018).',
            points: [
                '70 kg × 0,3 g/kg = 21 g de pó = 5,75 g de sódio (~3× o teto diário da OMS).',
                'No exemplo do AIS, esses 21 g são 25 cápsulas de 840 mg.',
            ],
            seal: 'consenso · sódio = cálculo', sealColor: C.base,
            source: 'Grgic 2021 (ISSN); AIS 2025; Maughan 2018 (COI); Gough 2018; Antonio 2026; OMS (< 2 g de Na/dia).',
            visual: {
                kind: 'range', unit: 'g de bicarbonato por kg de massa corporal', min: 0, max: 0.5, ticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5], decimals: 1,
                rows: [
                    { label: 'ISSN 2021', from: 0.2, to: 0.3, mark: 0.3, color: C.base, note: 'ótima 0,3' },
                    { label: 'AIS 2025', from: 0.2, to: 0.4, color: C.base },
                    { label: 'COI 2018', from: 0.2, to: 0.4, color: C.base },
                    { label: 'só soma GI', from: 0.4, to: 0.5, color: C.risk, note: 'ISSN' },
                ],
            },
        },
        {
            tab: 'Horário', field: 'Horário', value: '60–180 min antes, no relógio do atleta',
            title: 'Horas antes, com refeição — no relógio do atleta',
            text: 'AIS: 120–150 min antes, com refeição pequena rica em carboidrato (~1,5 g/kg). O pico no sangue cai entre 75 e 180 min conforme a pessoa: só 1 de 23 remadores de elite estava no pico aos 60 min.',
            points: [
                'Achar o pico no treino: o AIS mede o HCO₃⁻ a cada 30 min, em repouso.',
                'O efeito é de horas, não de semanas: é dose aguda, do dia da prova.',
            ],
            seal: 'consenso + ECR', sealColor: C.base,
            source: 'Grgic 2021 (ISSN); AIS 2025; Maughan 2018 (COI); Jones 2016 (n = 16); Boegman 2020 (n = 23).',
            visual: {
                kind: 'range', unit: 'minutos entre a dose e a largada', min: 0, max: 240, ticks: [0, 60, 120, 180, 240], decimals: 0,
                rows: [
                    { label: 'ISSN 2021', from: 60, to: 180, color: C.base },
                    { label: 'AIS 2025', from: 120, to: 150, color: C.base, note: 'com refeição' },
                    { label: 'COI 2018', from: 60, to: 150, color: C.base },
                    { label: 'pico no sangue', from: 75, to: 180, color: C.lactate, note: 'por pessoa' },
                ],
            },
        },
        {
            tab: 'Forma', field: 'Forma', value: 'cápsulas, refeição pequena, fracionar',
            title: 'Cápsula, refeição pequena e dose fracionada',
            text: 'O intestino é o preço, e pode apagar o ganho. Têm dado a favor: refeição rica em carboidrato, 120–180 min de antecedência, cápsula entérica e fracionar (o AIS divide em 3 tomadas em 30 min).',
            points: [
                'Entérica: gravidade 2,8 × 7,0 da cápsula de gelatina, 4 km mantido (Hilton 2020).',
                'Refeição pequena, nunca grande: o rótulo veta tomar "muito cheio" (Han 2022).',
            ],
            seal: 'ECRs pequenos + consenso', sealColor: C.lactate,
            source: 'Miller 2025 (11 ECRs de corrida); Carr 2011; Siegler 2012; Hilton 2020; AIS 2025; Grgic 2021 (ISSN); rótulo FDA; Han 2022.',
            visual: {
                kind: 'stats',
                items: [
                    { value: '29,5%', label: 'sintomas GI com bicarbonato', color: C.risk },
                    { value: '2,6%', label: 'sintomas GI com placebo', color: C.co2 },
                    { value: '~90 min', label: 'pico típico do GI após a dose', color: C.lactate },
                ],
            },
        },
        {
            tab: 'Repetir', field: 'Mais de uma prova', value: 'carga de 3–7 dias ou reforço testado',
            title: 'Carga de vários dias ou reforço, testados antes',
            text: 'Carga seriada: 0,4–0,5 g/kg/dia por 3–7 dias, em 0,1–0,2 g/kg nas refeições (ISSN). Para várias provas no mesmo dia, o AIS sugere reforço de ~100 mg/kg — sem eficácia publicada.',
            points: [
                'Reforço só depois de testado no treino.',
                'Urina alcalina pode atrasar por horas a amostra válida do controle de doping (AIS).',
            ],
            seal: 'consenso · reforço sem eficácia publicada', sealColor: C.stone,
            source: 'Grgic 2021 (ISSN); AIS 2025; Maughan 2018 (COI).',
            visual: {
                kind: 'range', unit: 'dias de carga antes da prova', min: 0, max: 7, ticks: [0, 1, 2, 3, 4, 5, 6, 7], decimals: 0,
                rows: [
                    { label: 'ISSN 2021', from: 3, to: 7, color: C.base, note: '0,4–0,5 g/kg/d' },
                    { label: 'AIS 2025', from: 1, to: 5, color: C.base, note: '0,5 g/kg/d' },
                    { label: 'COI 2018', from: 2, to: 4, color: C.base, note: '3–4 doses/d' },
                ],
            },
        },
        {
            tab: 'Cuidados', field: 'Antes da dose', value: 'paciente, regra e produto',
            title: 'Antes da dose: o paciente, a regra e o pote',
            text: 'Pela boca é permitido; na veia, acima de 100 mL em 12 h, é método proibido (M2.2). No Brasil, não é suplemento em cápsula — só fonte de sódio em bebida de eletrólitos: prescrever é zona cinzenta.',
            points: [
                'Na dúvida regulatória, o CRN (CFN 656: justificativa no prontuário).',
                'Certificação por lote reduz o risco de contaminação, mas não o elimina.',
            ],
            seal: 'bula + regra + consenso', sealColor: C.risk,
            source: 'Bula Baxter; BiCARB 2020; Han 2022; Diaconu 2022; WADA 2026; IN 28; CFN 656; Maughan 2018 (COI); AIS 2025.',
            visual: {
                kind: 'flags',
                items: [
                    { label: 'diurético', signal: 'vermelho' },
                    { label: 'doença renal', signal: 'vermelho' },
                    { label: 'insuficiência cardíaca / edema', signal: 'vermelho' },
                    { label: 'gestação', signal: 'vermelho' },
                    { label: 'transtorno alimentar', signal: 'vermelho' },
                    { label: 'hipertensão (sódio)', signal: 'amarelo' },
                    { label: 'acima de 60 anos', signal: 'amarelo' },
                    { label: 'pesagem colada na prova', signal: 'amarelo' },
                ],
            },
        },
    ],
};
