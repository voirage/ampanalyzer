import type { CalculationResults, UserParams } from './amplifierCalculator';
import { buildClassABSchematic, buildClassDSchematic, svgToDataURL } from './schematicSVG';

// Remplace tous les caracteres speciaux non supportes par Helvetica
function safe(text: string): string {
    return text
        .replace(/Ω/g, 'Ohm').replace(/µ/g, 'u').replace(/°/g, 'deg ')
        .replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/²/g, '2')
        .replace(/π/g, 'pi').replace(/×/g, 'x').replace(/±/g, '+/-')
        .replace(/→/g, '->').replace(/–/g, '-').replace(/…/g, '...');
}

async function getJsPDF(): Promise<any> {
    if ((window as any).jspdf?.jsPDF) return (window as any).jspdf.jsPDF;
    await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('jsPDF load failed'));
        document.head.appendChild(script);
    });
    return (window as any).jspdf.jsPDF;
}

export async function generatePDFReport(
    results: CalculationResults,
    params: UserParams
): Promise<void> {
    const JsPDF = await getJsPDF();
    const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W = 210;
    const M = 14;
    const cW = W - M * 2;
    let y = 0;

    // Palette impression
    const C = {
        white: [255, 255, 255] as [number, number, number],
        black: [15, 20, 40] as [number, number, number],
        blue: [0, 80, 190] as [number, number, number],
        lBlue: [215, 230, 255] as [number, number, number],
        cyan: [0, 140, 175] as [number, number, number],
        green: [0, 130, 75] as [number, number, number],
        orange: [195, 115, 0] as [number, number, number],
        red: [195, 45, 25] as [number, number, number],
        gray: [95, 95, 108] as [number, number, number],
        lGray: [244, 245, 250] as [number, number, number],
        mGray: [215, 218, 228] as [number, number, number],
        hdr: [28, 58, 125] as [number, number, number],
        alt: [237, 242, 255] as [number, number, number],
    };

    // Helpers
    const sf = (sz: number, st: 'normal' | 'bold' = 'normal', c = C.black) => {
        doc.setFontSize(sz); doc.setFont('helvetica', st); doc.setTextColor(...c);
    };
    const fr = (x: number, yy: number, w: number, h: number, c: [number, number, number], r = 0) => {
        doc.setFillColor(...c);
        r > 0 ? doc.roundedRect(x, yy, w, h, r, r, 'F') : doc.rect(x, yy, w, h, 'F');
    };
    const sr = (x: number, yy: number, w: number, h: number, c: [number, number, number], lw = 0.3, r = 0) => {
        doc.setDrawColor(...c); doc.setLineWidth(lw);
        r > 0 ? doc.roundedRect(x, yy, w, h, r, r, 'S') : doc.rect(x, yy, w, h, 'S');
    };
    const hl = (x1: number, yy: number, x2: number, c = C.mGray, lw = 0.35) => {
        doc.setDrawColor(...c); doc.setLineWidth(lw); doc.line(x1, yy, x2, yy);
    };
    const np = () => { doc.addPage(); fr(0, 0, W, 297, C.white); y = M; };
    const cb = (n: number) => { if (y + n > 272) np(); };
    const st = (title: string) => {
        cb(13); fr(M, y, cW, 9, C.hdr, 2);
        sf(9.5, 'bold', C.white); doc.text(safe(title), M + 4, y + 6.5); y += 13;
    };

    // ════════════════════════════════════════════════════════
    // PAGE 1 — COUVERTURE
    // ════════════════════════════════════════════════════════
    fr(0, 0, W, 297, C.white);
    fr(0, 0, W, 44, C.hdr);

    sf(26, 'bold', C.white);
    doc.text('AmpAnalyzer', W / 2, 20, { align: 'center' });
    sf(10, 'normal', C.lBlue);
    doc.text('Rapport de Conception — Amplificateur Audio', W / 2, 30, { align: 'center' });

    const aC: [number, number, number] = params.ampClass === 'Class D' ? [0, 175, 215] : [0, 205, 158];
    fr(W / 2 - 24, 33, 48, 9, aC, 4);
    sf(8, 'bold', C.black);
    doc.text(params.ampClass === 'Class D' ? 'CLASSE D' : 'CLASSE AB', W / 2, 39.5, { align: 'center' });

    sf(8, 'normal', C.gray);
    doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, W / 2, 50, { align: 'center' });
    hl(M, 53, W - M, C.mGray, 0.5);
    y = 57;

    // Parametres
    st('Parametres de Conception');
    const pp = [
        ['Architecture', params.ampClass],
        ['Puissance cible', `${params.targetPower} W`],
        ['Impedance', `${params.loadImpedance} Ohm`],
        ['Alimentation', `${params.supplyType === 'Symmetrical' ? '+/-' : ''}${params.supplyVoltage} V`],
        ['Type alim.', params.supplyType === 'Symmetrical' ? 'Symetrique' : 'Simple'],
        ['Temperature', `${params.ambientTemp} deg C`],
    ];
    const hw = (cW - 4) / 2;
    pp.forEach((r, i) => {
        const col = i % 2; const ry = y + Math.floor(i / 2) * 12;
        const x = M + col * (hw + 4);
        fr(x, ry, hw, 10, col === 0 ? C.lGray : C.alt, 2); sr(x, ry, hw, 10, C.mGray, 0.25, 2);
        sf(7, 'normal', C.gray); doc.text(r[0], x + 3, ry + 4.5);
        sf(9, 'bold', C.black); doc.text(safe(r[1]), x + 3, ry + 9);
    });
    y += Math.ceil(pp.length / 2) * 12 + 7;

    // Resultats
    st('Resultats Calcules');
    const vr = (results.vPeak / Math.sqrt(2)).toFixed(1);
    const ir = (results.iPeak / Math.sqrt(2)).toFixed(2);
    const ms = [
        { l: 'TENSION SORTIE', v: vr, u: 'Vrms', c: C.cyan, s: `Crete: ${results.vPeak} V` },
        { l: 'COURANT SORTIE', v: ir, u: 'Arms', c: C.blue, s: `Crete: ${results.iPeak} A` },
        { l: 'PUISSANCE REELLE', v: String(results.realPower), u: 'W', c: C.green, s: 'Limite alimentation' },
        { l: 'RENDEMENT', v: String(results.efficiency), u: '%', c: C.orange, s: params.ampClass },
        { l: 'DISSIPATION', v: String(results.pdTotal), u: 'W', c: C.red, s: `${results.pdPerDevice} W/transistor` },
        { l: 'COURANT REPOS', v: String(results.iQuiescent), u: 'mA', c: C.gray, s: 'Quiescent' },
    ];
    const mW = (cW - 4) / 3; const mH = 22;
    ms.forEach((m, i) => {
        const col = i % 3; const row = Math.floor(i / 3);
        const bx = M + col * (mW + 2); const by = y + row * (mH + 3);
        fr(bx, by, mW, mH, C.lGray, 3);
        doc.setDrawColor(...m.c); doc.setLineWidth(0.6); doc.roundedRect(bx, by, mW, mH, 3, 3, 'S');
        sf(7, 'bold', C.gray); doc.text(m.l, bx + 3, by + 5.5);
        sf(14, 'bold', m.c); doc.text(m.v, bx + 3, by + 15);
        sf(8, 'normal', C.gray); doc.text(m.u, bx + 3 + doc.getTextWidth(m.v) + 1.5, by + 15);
        sf(7, 'normal', C.gray); doc.text(safe(m.s), bx + 3, by + 20);
    });
    y += Math.ceil(ms.length / 3) * (mH + 3) + 7;

    // Verdict
    st('Verdict Systeme');
    const ok = results.recommendation.verdict === 'Functional';
    const rk = results.recommendation.verdict === 'Risk';
    const vc: [number, number, number] = ok ? C.green : rk ? C.orange : C.red;
    const vl = ok ? 'FONCTIONNEL' : rk ? 'RISQUE' : 'ECHEC';
    const vb: [number, number, number] = ok ? [218, 255, 232] : rk ? [255, 244, 218] : [255, 228, 223];

    fr(M, y, cW, 18, vb, 3); doc.setDrawColor(...vc); doc.setLineWidth(0.9); doc.roundedRect(M, y, cW, 18, 3, 3, 'S');
    fr(M, y, 44, 18, vc, 3);
    sf(9, 'bold', C.white); doc.text(vl, M + 22, y + 11, { align: 'center' });
    sf(8, 'normal', C.black);
    doc.text(`Rth <= ${results.rthRequired.toFixed(2)} deg C/W`, M + 50, y + 7.5);
    doc.text(`Surface dissipateur >= ${results.heatsinkArea.toFixed(0)} cm2`, M + 50, y + 14);
    doc.text(`Tj max: ${results.tjMax} deg C`, M + 138, y + 7.5);
    y += 22;

    if (results.recommendation.warnings.length > 0) {
        cb(10 + results.recommendation.warnings.length * 8);
        fr(M, y, cW, 7 + results.recommendation.warnings.length * 8, [255, 247, 228], 2);
        sr(M, y, cW, 7 + results.recommendation.warnings.length * 8, C.orange, 0.5, 2);
        sf(8, 'bold', C.orange); doc.text('Avertissements :', M + 3, y + 5.5); y += 8;
        results.recommendation.warnings.forEach(w => {
            sf(7.5, 'normal', C.black); doc.text(safe(`!  ${w}`), M + 4, y + 4.5, { maxWidth: cW - 7 }); y += 8;
        });
        results.recommendation.suggestions.forEach(s => {
            cb(8); sf(7.5, 'normal', C.blue); doc.text(safe(`->  ${s}`), M + 4, y + 4.5, { maxWidth: cW - 7 }); y += 8;
        });
        y += 3;
    }

    // ════════════════════════════════════════════════════════
    // PAGE 2 — SCHEMA ELECTRONIQUE
    // ════════════════════════════════════════════════════════
    np();
    fr(0, 0, W, 19, C.hdr);
    sf(14, 'bold', C.white); doc.text('Schema Electronique', M, 13);
    sf(8, 'normal', C.lBlue);
    doc.text(safe(`${params.ampClass} — Symboles normalises IEC — Numeros de broches en rouge`), M, 17.5);
    y = 23;

    let lUH = 0, cUF = 0;
    if (params.ampClass === 'Class D') {
        const fs = 400000; const dI = results.iPeak * 0.2;
        lUH = parseFloat((params.supplyVoltage / (8 * fs * Math.max(dI, 0.01)) * 1e6).toFixed(2));
        cUF = parseFloat((1 / (Math.pow(2 * Math.PI * 22000, 2) * (params.supplyVoltage / (8 * fs * Math.max(dI, 0.01)))) * 1e6).toFixed(2));
    }

    const svgStr = params.ampClass === 'Class AB'
        ? buildClassABSchematic(results.vcc, params.loadImpedance)
        : buildClassDSchematic(results.vcc, params.loadImpedance, lUH, cUF);

    try {
        const imgData = await svgToDataURL(svgStr, 760, 400);
        const imgW = cW;
        const imgH = imgW * (400 / 760);
        cb(imgH + 12);
        doc.addImage(imgData, 'PNG', M, y, imgW, imgH);
        y += imgH + 5;
        fr(M, y, cW, 11, C.lGray, 2);
        sf(7.5, 'normal', C.gray);
        doc.text('Numeros de broches en rouge = numeros du boitier (DIP/TO-220/SOIC)', M + 3, y + 7);
        y += 15;
    } catch (e) {
        sf(9, 'normal', C.red); doc.text('Erreur generation schema.', M, y + 8); y += 14;
    }

    // Composants cles
    st('Composants Cles du Schema');
    const kc = params.ampClass === 'Class AB' ? [
        ['C1', 'Condensateur couplage', '1 uF', 'Coupure fc = 20 Hz'],
        ['Rin', 'Resistance entree', '22 kOhm', 'Adaptation impedance'],
        ['IC1', 'Amplif. integre', 'LM3886/TDA7294', `+/-${results.vcc}V — Pin: 1(+) 9(-) 5(OUT) 6,7(+Vcc) 4(-Vcc)`],
        ['Rfb1', 'Resistance feedback', '1 kOhm', 'Gain avec Rfb2'],
        ['Rfb2', 'Resistance feedback', '22 kOhm', 'Gain = 1+22k/1k = 23x (27 dB)'],
        ['Rs', 'Resistance serie sortie', '0.22 Ohm', 'Stabilite HF'],
        ['Zobel', 'Reseau Zobel', '10 Ohm + 100nF', 'Charge inductive speaker'],
    ] : [
        ['Rin', 'Filtre entree R', '10 kOhm', 'Filtre RC entree'],
        ['Cin', 'Filtre entree C', '100 nF', 'Coupure HF'],
        ['IC1', 'Ctrl PWM', 'IRS2092S', 'Pin: 5(IN) 12(HO) 9(LO) 13(Vcc) 4(GND)'],
        ['Q1-Q4', 'MOSFETs pont H', 'IRFZ44N x4', `Pin: G(1) D(2) S(3) — Vds>${(results.vcc * 1.5).toFixed(0)}V`],
        ['L', 'Inductance filtre', `${lUH} uH`, 'Filtre LC passe-bas 22 kHz'],
        ['C', 'Condensateur filtre', `${cUF} uF`, 'Film polypropylene'],
        ['Cbulk', 'Condensateur bus', `${Math.ceil(results.iPeak * 100)} uF`, `/${Math.ceil(results.vcc * 1.3)}V basse ESR`],
    ];

    const cw = [18, 44, 40, cW - 102];
    fr(M, y, cW, 9, C.hdr, 2);
    sf(8, 'bold', C.white);
    ['Ref.', 'Designation', 'Valeur', 'Note'].forEach((h, i) => {
        doc.text(h, M + 2 + [0, 18, 62, 102][i], y + 6);
    }); y += 9;

    kc.forEach((r, ri) => {
        cb(9); fr(M, y, cW, 8, ri % 2 === 0 ? C.lGray : C.white); hl(M, y + 8, W - M, C.mGray, 0.2);
        let cx = M + 2;
        r.forEach((cell, ci) => {
            sf(ci === 2 ? 8 : 7.5, ci === 0 || ci === 2 ? 'bold' : 'normal', ci === 2 ? C.blue : C.black);
            doc.text(safe(cell), cx, y + 5.5, { maxWidth: cw[ci] - 2 }); cx += cw[ci];
        }); y += 8;
    });
    sr(M, y - kc.length * 8, cW, kc.length * 8, C.mGray, 0.3); y += 7;

    // ════════════════════════════════════════════════════════
    // PAGE 3 — BOM COMPLETE
    // ════════════════════════════════════════════════════════
    np();
    fr(0, 0, W, 19, C.hdr);
    sf(14, 'bold', C.white); doc.text('Liste des Composants (BOM)', M, 13);
    sf(8, 'normal', C.lBlue); doc.text('Detail complet par etage', M, 17.5);
    y = 23;

    results.stages.forEach(stage => {
        cb(20 + stage.components.length * 9);
        fr(M, y, cW, 9, C.hdr, 2); sf(9, 'bold', C.white); doc.text(safe(stage.stageName), M + 4, y + 6.5); y += 11;
        const cw2 = [66, 44, cW - 110];
        fr(M, y, cW, 8, C.lBlue);
        let hx = M + 2;
        ['Composant', 'Valeur', 'Note'].forEach((h, i) => {
            sf(8, 'bold', C.blue); doc.text(h, hx, y + 5.5); hx += cw2[i];
        }); y += 8;
        stage.components.forEach((c, ci) => {
            cb(9); if (ci % 2 === 0) fr(M, y, cW, 8, C.lGray); hl(M, y + 8, W - M, C.mGray, 0.2);
            let cx2 = M + 2;
            sf(8, 'bold', C.black); doc.text(safe(c.label), cx2, y + 5.5, { maxWidth: cw2[0] - 3 }); cx2 += cw2[0];
            sf(8, 'bold', C.blue); doc.text(safe(c.value), cx2, y + 5.5, { maxWidth: cw2[1] - 3 }); cx2 += cw2[1];
            sf(7.5, 'normal', C.gray); doc.text(safe(c.note || '—'), cx2, y + 5.5, { maxWidth: cw2[2] - 3 });
            y += 8;
        });
        sr(M, y - stage.components.length * 8, cW, stage.components.length * 8, C.mGray, 0.3); y += 6;
    });

    // ════════════════════════════════════════════════════════
    // PAGE 4 — COMPARATIF & FORMULES
    // ════════════════════════════════════════════════════════
    np();
    fr(0, 0, W, 19, C.hdr);
    sf(14, 'bold', C.white); doc.text('Comparatif & Formules', M, 13);
    y = 23;

    st('Comparatif Classe AB vs Classe D');
    const abE = params.ampClass === 'Class AB' ? results.efficiency : Math.min(78.5, results.efficiency * 0.85);
    const dE = params.ampClass === 'Class D' ? results.efficiency : 92;
    const abP = params.ampClass === 'Class AB' ? results.pdTotal : results.pdTotal * 2.5;
    const dP = params.ampClass === 'Class D' ? results.pdTotal : results.pdTotal * 0.4;
    const rec = dE > abE ? 'Class D' : 'Class AB';

    const ch = ['Classe', 'Rendement', 'Dissipation', 'Complexite', 'THD', 'Verdict'];
    const cw3 = [34, 28, 28, 28, 22, 42];
    fr(M, y, cW, 9, C.hdr, 2);
    let hx2 = M + 2;
    ch.forEach((h, i) => { sf(8, 'bold', C.white); doc.text(h, hx2, y + 6); hx2 += cw3[i]; }); y += 9;

    [
        { cls: 'Class AB', e: abE, p: abP, cx: 'Basse', t: '< 0.1%' },
        { cls: 'Class D', e: dE, p: dP, cx: 'Haute', t: '< 0.5%' },
    ].forEach((r, ri) => {
        const isR = r.cls === rec;
        fr(M, y, cW, 10, ri % 2 === 0 ? C.lGray : C.alt);
        if (isR) { doc.setDrawColor(...C.green); doc.setLineWidth(0.6); doc.rect(M, y, cW, 10, 'S'); }
        let cx3 = M + 2;
        [[r.cls], [`${r.e.toFixed(0)}%`], [`${r.p.toFixed(0)} W`], [r.cx], [r.t], [isR ? 'ok Recommande' : 'Viable']].forEach((cell, i) => {
            const co: [number, number, number] = i === 5 && isR ? C.green : i === 1 ? C.blue : C.black;
            sf(i === 0 || (i === 5 && isR) ? 8 : 7.5, i === 0 || (i === 5 && isR) ? 'bold' : 'normal', co);
            doc.text(cell[0], cx3, y + 7, { maxWidth: cw3[i] - 2 }); cx3 += cw3[i];
        }); y += 10;
    });
    sr(M, y - 20, cW, 20, C.mGray, 0.3); y += 9;

    st('Formules de Calcul Utilisees');
    const fms = params.ampClass === 'Class AB' ? [
        ['Puissance de sortie', 'P = Vswing2 / (2 x RL)', `${results.realPower} W`],
        ['Tension crete', 'Vpk = sqrt(2 x P x RL)', `${results.vPeak} V`],
        ['Rendement theorique', 'eta = pi/4 = 78.5%', `${results.efficiency.toFixed(1)}%`],
        ['Dissipation max', 'Pd = Vcc2 / (pi2 x RL)', `${results.pdTotal.toFixed(2)} W`],
        ['Resistance thermique', 'Rth = (Tj - Ta) / Pd', `${results.rthRequired.toFixed(2)} deg C/W`],
    ] : [
        ['Puissance de sortie', 'P = (Vbus/sqrt(2))2 / RL', `${results.realPower} W`],
        ['Tension crete', 'Vpk = Vbus', `${results.vPeak} V`],
        ['Rendement typique', 'eta = 92% (pont complet)', `${results.efficiency}%`],
        ['Inductance filtre', 'L = Vbus/(8 x fs x dI)', `${lUH} uH`],
        ['Frequence coupure', 'fc = 1/(2pi x sqrt(LC))', 'fc = 22 kHz'],
    ];

    fms.forEach((f, fi) => {
        cb(10); fr(M, y, cW, 9, fi % 2 === 0 ? C.lGray : C.white); hl(M, y + 9, W - M, C.mGray, 0.2);
        sf(8, 'bold', C.black); doc.text(f[0], M + 3, y + 6);
        sf(8, 'normal', C.blue); doc.text(f[1], M + 68, y + 6);
        sf(8, 'bold', C.black); doc.text(safe(f[2]), W - M - 3, y + 6, { align: 'right' });
        y += 9;
    });
    sr(M, y - fms.length * 9, cW, fms.length * 9, C.mGray, 0.3);

    // Pied de page
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
        doc.setPage(p);
        hl(M, 284, W - M, C.mGray, 0.5);
        fr(0, 285, W, 12, C.lGray);
        sf(7.5, 'normal', C.gray);
        doc.text('AmpAnalyzer — Rapport de Conception', M, 292);
        doc.text(`${params.ampClass} | ${params.targetPower}W / ${params.loadImpedance}Ohm`, W / 2, 292, { align: 'center' });
        sf(7.5, 'bold', C.blue);
        doc.text(`Page ${p} / ${total}`, W - M, 292, { align: 'right' });
    }

    const fn = `AmpAnalyzer_${params.ampClass.replace(' ', '')}_${params.targetPower}W_${params.loadImpedance}Ohm_Schema.pdf`;
    doc.save(fn);
}