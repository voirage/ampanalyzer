import type { CalculationResults, UserParams } from './amplifierCalculator';
import { buildClassABSchematic, buildClassDSchematic, svgToDataURL } from './schematicSVG';

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
    const margin = 15;
    const cW = W - margin * 2;
    let y = 0;

    const C = {
        white: [255, 255, 255] as [number, number, number],
        black: [15, 20, 40] as [number, number, number],
        blue: [0, 90, 200] as [number, number, number],
        lBlue: [220, 235, 255] as [number, number, number],
        cyan: [0, 150, 180] as [number, number, number],
        green: [0, 140, 80] as [number, number, number],
        orange: [200, 120, 0] as [number, number, number],
        red: [200, 50, 30] as [number, number, number],
        gray: [100, 100, 110] as [number, number, number],
        lGray: [245, 246, 250] as [number, number, number],
        mGray: [220, 222, 230] as [number, number, number],
        hdrBg: [30, 60, 130] as [number, number, number],
        rowAlt: [240, 244, 255] as [number, number, number],
    };

    const sf = (sz: number, st: 'normal' | 'bold' = 'normal', c = C.black) => {
        doc.setFontSize(sz); doc.setFont('helvetica', st); doc.setTextColor(...c);
    };
    const fr = (x: number, y: number, w: number, h: number, c: [number, number, number], r = 0) => {
        doc.setFillColor(...c);
        r > 0 ? doc.roundedRect(x, y, w, h, r, r, 'F') : doc.rect(x, y, w, h, 'F');
    };
    const sr = (x: number, y: number, w: number, h: number, c: [number, number, number], lw = 0.3, r = 0) => {
        doc.setDrawColor(...c); doc.setLineWidth(lw);
        r > 0 ? doc.roundedRect(x, y, w, h, r, r, 'S') : doc.rect(x, y, w, h, 'S');
    };
    const hl = (x1: number, y: number, x2: number, c = C.mGray, lw = 0.3) => {
        doc.setDrawColor(...c); doc.setLineWidth(lw); doc.line(x1, y, x2, y);
    };
    const np = () => { doc.addPage(); fr(0, 0, W, 297, C.white); y = margin; };
    const cb = (n: number) => { if (y + n > 272) np(); };
    const st = (title: string) => {
        cb(12); fr(margin, y, cW, 8, C.hdrBg, 2);
        sf(8.5, 'bold', C.white); doc.text(title, margin + 4, y + 5.5); y += 11;
    };

    // ════════════════════════════════════════════════════════
    // PAGE 1 — COUVERTURE
    // ════════════════════════════════════════════════════════
    fr(0, 0, W, 297, C.white);
    fr(0, 0, W, 42, C.hdrBg);
    sf(24, 'bold', C.white);
    doc.text('AmpAnalyzer', W / 2, 18, { align: 'center' });
    sf(9, 'normal', C.lBlue);
    doc.text('Rapport de Conception — Amplificateur Audio', W / 2, 28, { align: 'center' });
    const aColor: [number, number, number] = params.ampClass === 'Class D' ? [0, 180, 220] : [0, 210, 160];
    fr(W / 2 - 22, 31, 44, 8, aColor, 3);
    sf(7, 'bold', C.black);
    doc.text(params.ampClass === 'Class D' ? 'CLASSE D' : 'CLASSE AB', W / 2, 37, { align: 'center' });
    sf(7.5, 'normal', C.gray);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, W / 2, 48, { align: 'center' });
    hl(margin, 51, W - margin, C.mGray, 0.5);
    y = 56;

    st('⚙  Paramètres de Conception');
    const pp = [
        ['Architecture', params.ampClass],
        ['Puissance cible', `${params.targetPower} W`],
        ['Impédance', `${params.loadImpedance} Ω`],
        ['Alimentation', `${params.supplyType === 'Symmetrical' ? '±' : ''}${params.supplyVoltage} V`],
        ['Type alim.', params.supplyType === 'Symmetrical' ? 'Symétrique' : 'Simple'],
        ['Température', `${params.ambientTemp} °C`],
    ];
    const hw = (cW - 4) / 2;
    pp.forEach((r, i) => {
        const col = i % 2; const ry = y + Math.floor(i / 2) * 11;
        const x = margin + col * (hw + 4);
        fr(x, ry, hw, 9, col === 0 ? C.lGray : C.rowAlt, 2); sr(x, ry, hw, 9, C.mGray, 0.2, 2);
        sf(6, 'normal', C.gray); doc.text(r[0], x + 3, ry + 4);
        sf(8, 'bold', C.black); doc.text(r[1], x + 3, ry + 8.5);
    });
    y += Math.ceil(pp.length / 2) * 11 + 6;

    st('📊  Résultats Calculés');
    const vr = (results.vPeak / Math.sqrt(2)).toFixed(1);
    const ir = (results.iPeak / Math.sqrt(2)).toFixed(2);
    const ms = [
        { l: 'TENSION SORTIE', v: vr, u: 'Vrms', c: C.cyan, s: `Crête: ${results.vPeak} V` },
        { l: 'COURANT SORTIE', v: ir, u: 'Arms', c: C.blue, s: `Crête: ${results.iPeak} A` },
        { l: 'PUISSANCE RÉELLE', v: String(results.realPower), u: 'W', c: C.green, s: 'Limite alimentation' },
        { l: 'RENDEMENT', v: String(results.efficiency), u: '%', c: C.orange, s: params.ampClass },
        { l: 'DISSIPATION', v: String(results.pdTotal), u: 'W', c: C.red, s: `${results.pdPerDevice} W/transistor` },
        { l: 'COURANT REPOS', v: String(results.iQuiescent), u: 'mA', c: C.gray, s: 'Quiescent' },
    ];
    const mW2 = (cW - 4) / 3; const mH = 20;
    ms.forEach((m, i) => {
        const col = i % 3; const row = Math.floor(i / 3);
        const bx = margin + col * (mW2 + 2); const by = y + row * (mH + 3);
        fr(bx, by, mW2, mH, C.lGray, 3); doc.setDrawColor(...m.c); doc.setLineWidth(0.5); doc.roundedRect(bx, by, mW2, mH, 3, 3, 'S');
        sf(6, 'bold', C.gray); doc.text(m.l, bx + 3, by + 5);
        sf(12, 'bold', m.c); doc.text(m.v, bx + 3, by + 13);
        sf(7, 'normal', C.gray); doc.text(m.u, bx + 3 + doc.getTextWidth(m.v) + 1, by + 13);
        sf(6, 'normal', C.gray); doc.text(m.s, bx + 3, by + 18);
    });
    y += Math.ceil(ms.length / 3) * (mH + 3) + 6;

    st('🛡  Verdict Système');
    const ok = results.recommendation.verdict === 'Functional';
    const rk = results.recommendation.verdict === 'Risk';
    const vc: [number, number, number] = ok ? C.green : rk ? C.orange : C.red;
    const vl = ok ? 'FONCTIONNEL' : rk ? 'RISQUE' : 'ÉCHEC';
    const vb: [number, number, number] = ok ? [220, 255, 235] : rk ? [255, 245, 220] : [255, 230, 225];
    fr(margin, y, cW, 16, vb, 3); doc.setDrawColor(...vc); doc.setLineWidth(0.8); doc.roundedRect(margin, y, cW, 16, 3, 3, 'S');
    fr(margin, y, 42, 16, vc, 3); sf(8, 'bold', C.white); doc.text(vl, margin + 21, y + 10, { align: 'center' });
    sf(7, 'normal', C.black);
    doc.text(`Rth ≤ ${results.rthRequired.toFixed(2)} °C/W`, margin + 48, y + 7);
    doc.text(`Surface dissip. ≥ ${results.heatsinkArea.toFixed(0)} cm²`, margin + 48, y + 13);
    doc.text(`Tj max: ${results.tjMax}°C`, margin + 135, y + 7);
    y += 20;

    if (results.recommendation.warnings.length > 0) {
        cb(8 + results.recommendation.warnings.length * 7);
        fr(margin, y, cW, 6 + results.recommendation.warnings.length * 7, [255, 248, 230], 2);
        sr(margin, y, cW, 6 + results.recommendation.warnings.length * 7, C.orange, 0.4, 2);
        sf(7, 'bold', C.orange); doc.text('Avertissements :', margin + 3, y + 5); y += 7;
        results.recommendation.warnings.forEach(w => {
            sf(6.5, 'normal', C.black); doc.text(`⚠  ${w}`, margin + 4, y + 4, { maxWidth: cW - 6 }); y += 7;
        });
        results.recommendation.suggestions.forEach(s => {
            cb(7); sf(6.5, 'normal', C.blue); doc.text(`→  ${s}`, margin + 4, y + 4, { maxWidth: cW - 6 }); y += 7;
        });
        y += 3;
    }

    // ════════════════════════════════════════════════════════
    // PAGE 2 — SCHÉMA ÉLECTRONIQUE RÉEL
    // ════════════════════════════════════════════════════════
    np();
    fr(0, 0, W, 18, C.hdrBg);
    sf(13, 'bold', C.white); doc.text('Schéma Électronique', margin, 12);
    sf(7, 'normal', C.lBlue);
    doc.text(`${params.ampClass} — Symboles normalisés IEC`, margin, 16);
    y = 22;

    // Génération du SVG selon la classe
    let lUH = 0, cUF = 0;
    if (params.ampClass === 'Class D') {
        const fs = 400000; const deltaI = results.iPeak * 0.2;
        lUH = parseFloat((params.supplyVoltage / (8 * fs * Math.max(deltaI, 0.01)) * 1e6).toFixed(2));
        cUF = parseFloat((1 / (Math.pow(2 * Math.PI * 22000, 2) * (params.supplyVoltage / (8 * fs * Math.max(deltaI, 0.01)))) * 1e6).toFixed(2));
    }

    const svgStr = params.ampClass === 'Class AB'
        ? buildClassABSchematic(results.vcc, params.loadImpedance)
        : buildClassDSchematic(results.vcc, params.loadImpedance, lUH, cUF);

    try {
        const imgData = await svgToDataURL(svgStr, 700, 360);
        const imgW = cW;
        const imgH = imgW * (360 / 700);
        cb(imgH + 10);
        doc.addImage(imgData, 'PNG', margin, y, imgW, imgH);
        y += imgH + 5;

        // Note sous le schéma
        fr(margin, y, cW, 10, C.lGray, 2);
        sf(6.5, 'normal', C.gray);
        doc.text('★  Cliquer sur les composants dans l\'application web pour voir leurs valeurs détaillées.', margin + 3, y + 6);
        y += 14;
    } catch (e) {
        sf(8, 'normal', C.red);
        doc.text('Erreur génération schéma — relancez depuis l\'application web.', margin, y + 8);
        y += 14;
    }

    // Tableau récap composants clés
    st('🔧  Composants Clés du Schéma');
    const keyComps = params.ampClass === 'Class AB' ? [
        ['C1', 'Condensateur couplage', '1 µF', 'Coupure fc = 20 Hz'],
        ['Rin', 'Résistance entrée', '22 kΩ', 'Adaptation impédance'],
        ['IC1', 'Amplificateur intégré', 'LM3886/TDA7294', `±${results.vcc} V, ${results.iPeak.toFixed(1)} A crête`],
        ['Rfb1', 'Résistance feedback', '1 kΩ', 'Fixe le gain avec Rfb2'],
        ['Rfb2', 'Résistance feedback', '22 kΩ', `Gain = ${(1 + 22000 / 1000).toFixed(0)}× ≈ 27 dB`],
        ['Rs', 'Résistance sortie', '0.22 Ω', 'Stabilité HF'],
        ['Zobel', 'Réseau Zobel', '10 Ω + 100 nF', 'Charge inductive speaker'],
    ] : [
        ['Rin', 'Filtre entrée R', '10 kΩ', 'Filtre RC entrée'],
        ['Cin', 'Filtre entrée C', '100 nF', 'Coupure HF entrée'],
        ['IC1', 'Contrôleur PWM', 'IRS2092S', `${400} kHz, dead-time 100 ns`],
        ['Q1-Q4', 'MOSFETs pont en H', 'IRFZ44N×4', `Vds>${(results.vcc * 1.5).toFixed(0)}V, Id>${(results.iPeak * 1.5).toFixed(1)}A`],
        ['L', 'Inductance filtre', `${lUH} µH`, 'Filtre LC passe-bas 22 kHz'],
        ['C', 'Condensateur filtre', `${cUF} µF`, 'Film polypropylène'],
        ['Cbulk', 'Condensateur bus', `${Math.ceil(results.iPeak * 100)} µF`, `/${Math.ceil(results.vcc * 1.3)}V, basse ESR`],
    ];

    const colW = [18, 42, 38, cW - 98];
    fr(margin, y, cW, 8, C.hdrBg, 2);
    sf(6.5, 'bold', C.white);
    ['Réf.', 'Désignation', 'Valeur', 'Note'].forEach((h, i) => {
        const x = margin + 2 + [0, 18, 60, 98][i];
        doc.text(h, x, y + 5.5);
    });
    y += 8;
    keyComps.forEach((r, ri) => {
        cb(8);
        fr(margin, y, cW, 8, ri % 2 === 0 ? C.lGray : C.white);
        hl(margin, y + 8, W - margin, C.mGray, 0.2);
        sf(6.5, ri === 2 || ri === 3 ? 'bold' : 'normal', ri === 2 ? C.blue : C.black);
        const xs = [margin + 2, margin + 20, margin + 62, margin + 100];
        r.forEach((cell, ci) => {
            sf(6.5, ci === 0 || ci === 2 ? 'bold' : 'normal', ci === 2 ? C.blue : C.black);
            doc.text(cell, xs[ci], y + 5.5, { maxWidth: colW[ci] - 2 });
        });
        y += 8;
    });
    sr(margin, y - keyComps.length * 8, cW, keyComps.length * 8, C.mGray, 0.3);
    y += 6;

    // ════════════════════════════════════════════════════════
    // PAGE 3 — BOM COMPLÈTE
    // ════════════════════════════════════════════════════════
    np();
    fr(0, 0, W, 18, C.hdrBg);
    sf(13, 'bold', C.white); doc.text('Liste des Composants (BOM)', margin, 12);
    sf(7, 'normal', C.lBlue); doc.text('Détail complet par étage', margin, 16);
    y = 22;

    results.stages.forEach(stage => {
        cb(18 + stage.components.length * 8);
        fr(margin, y, cW, 8, C.hdrBg, 2);
        sf(8, 'bold', C.white); doc.text(stage.stageName, margin + 4, y + 5.5); y += 10;
        const cw2 = [66, 42, cW - 108];
        fr(margin, y, cW, 7, C.lBlue);
        let hx2 = margin + 2;
        ['Composant', 'Valeur', 'Note'].forEach((h, i) => {
            sf(6.5, 'bold', C.blue); doc.text(h, hx2, y + 5); hx2 += cw2[i];
        });
        y += 7;
        stage.components.forEach((c, ci) => {
            cb(8);
            if (ci % 2 === 0) fr(margin, y, cW, 7, C.lGray);
            hl(margin, y + 7, W - margin, C.mGray, 0.2);
            let cx2 = margin + 2;
            sf(6.5, 'bold', C.black); doc.text(c.label, cx2, y + 5, { maxWidth: cw2[0] - 3 }); cx2 += cw2[0];
            sf(6.5, 'bold', C.blue); doc.text(c.value, cx2, y + 5, { maxWidth: cw2[1] - 3 }); cx2 += cw2[1];
            sf(6, 'normal', C.gray); doc.text(c.note || '—', cx2, y + 5, { maxWidth: cw2[2] - 3 });
            y += 7;
        });
        sr(margin, y - stage.components.length * 7, cW, stage.components.length * 7, C.mGray, 0.3);
        y += 5;
    });

    // ════════════════════════════════════════════════════════
    // PAGE 4 — COMPARATIF & FORMULES
    // ════════════════════════════════════════════════════════
    np();
    fr(0, 0, W, 18, C.hdrBg);
    sf(13, 'bold', C.white); doc.text('Comparatif & Formules', margin, 12);
    y = 22;

    st('⚡  Comparatif Classe AB vs Classe D');
    const abE = params.ampClass === 'Class AB' ? results.efficiency : Math.min(78.5, results.efficiency * 0.85);
    const dE = params.ampClass === 'Class D' ? results.efficiency : 92;
    const abP = params.ampClass === 'Class AB' ? results.pdTotal : results.pdTotal * 2.5;
    const dP = params.ampClass === 'Class D' ? results.pdTotal : results.pdTotal * 0.4;
    const rec = dE > abE ? 'Class D' : 'Class AB';

    const ch = ['Classe', 'Rendement', 'Dissipation', 'Complexité', 'THD', 'Verdict'];
    const cw3 = [32, 28, 28, 28, 22, 42];
    fr(margin, y, cW, 8, C.hdrBg, 2);
    let hx3 = margin + 2;
    ch.forEach((h, i) => { sf(6.5, 'bold', C.white); doc.text(h, hx3, y + 5.5); hx3 += cw3[i]; }); y += 8;
    [
        { cls: 'Class AB', e: abE, p: abP, cx: 'Basse', t: '< 0.1%' },
        { cls: 'Class D', e: dE, p: dP, cx: 'Haute', t: '< 0.5%' },
    ].forEach((r, ri) => {
        const isR = r.cls === rec;
        fr(margin, y, cW, 9, ri % 2 === 0 ? C.lGray : C.rowAlt);
        if (isR) { doc.setDrawColor(...C.green); doc.setLineWidth(0.5); doc.roundedRect(margin, y, cW, 9, 0, 0, 'S'); }
        let cx3 = margin + 2;
        [[r.cls], [`${r.e.toFixed(0)}%`], [`${r.p.toFixed(0)} W`], [r.cx], [r.t], [isR ? '✓ Recommandé' : 'Viable']].forEach((cell, i) => {
            const color: [number, number, number] = i === 5 && isR ? C.green : i === 1 ? C.blue : C.black;
            sf(i === 0 || i === 5 && isR ? 7 : 6.5, i === 0 || (i === 5 && isR) ? 'bold' : 'normal', color);
            doc.text(cell[0], cx3, y + 6, { maxWidth: cw3[i] - 2 }); cx3 += cw3[i];
        }); y += 9;
    });
    sr(margin, y - 18, cW, 18, C.mGray, 0.3); y += 8;

    st('∫  Formules de Calcul');
    const fms = params.ampClass === 'Class AB' ? [
        ['Puissance de sortie', 'P = Vswing² / (2 × RL)', `${results.realPower} W`],
        ['Tension crête', 'Vpk = √(2 × P × RL)', `${results.vPeak} V`],
        ['Rendement théorique', 'η = π/4 ≈ 78.5%', `${results.efficiency.toFixed(1)}%`],
        ['Dissipation max', 'Pd = Vcc² / (π² × RL)', `${results.pdTotal.toFixed(2)} W`],
        ['Résistance thermique', 'Rth = (Tj − Ta) / Pd', `${results.rthRequired.toFixed(2)} °C/W`],
    ] : [
        ['Puissance de sortie', 'P = (Vbus/√2)² / RL', `${results.realPower} W`],
        ['Tension crête', 'Vpk = Vbus', `${results.vPeak} V`],
        ['Rendement typique', 'η ≈ 92% (pont complet)', `${results.efficiency}%`],
        ['Inductance filtre', 'L = Vbus/(8 × fs × ΔI)', `${lUH} µH`],
        ['Fréquence coupure', 'fc = 1/(2π√(LC))', 'fc = 22 kHz'],
    ];
    fms.forEach((f, fi) => {
        cb(9); fr(margin, y, cW, 8, fi % 2 === 0 ? C.lGray : C.white);
        hl(margin, y + 8, W - margin, C.mGray, 0.2);
        sf(6.5, 'bold', C.black); doc.text(f[0], margin + 3, y + 5.5);
        sf(6.5, 'normal', C.blue); doc.text(f[1], margin + 65, y + 5.5);
        sf(6.5, 'bold', C.black); doc.text(f[2], W - margin - 3, y + 5.5, { align: 'right' });
        y += 8;
    });
    sr(margin, y - fms.length * 8, cW, fms.length * 8, C.mGray, 0.3);

    // Pied de page
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
        doc.setPage(p);
        hl(margin, 283, W - margin, C.mGray, 0.4);
        fr(0, 284, W, 13, C.lGray);
        sf(6.5, 'normal', C.gray);
        doc.text('AmpAnalyzer — Rapport de Conception', margin, 291);
        doc.text(`${params.ampClass} | ${params.targetPower}W / ${params.loadImpedance}Ω`, W / 2, 291, { align: 'center' });
        sf(6.5, 'bold', C.blue);
        doc.text(`Page ${p} / ${total}`, W - margin, 291, { align: 'right' });
    }

    const fn = `AmpAnalyzer_${params.ampClass.replace(' ', '')}_${params.targetPower}W_${params.loadImpedance}ohm_Schema.pdf`;
    doc.save(fn);
}