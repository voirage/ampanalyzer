import type { CalculationResults, UserParams } from './amplifierCalculator';

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
    const contentW = W - margin * 2;
    let y = 0;

    // ── Couleurs impression ──────────────────────────────────
    const C = {
        white: [255, 255, 255] as [number, number, number],
        black: [15, 20, 40] as [number, number, number],
        blue: [0, 90, 200] as [number, number, number],
        lightBlue: [220, 235, 255] as [number, number, number],
        cyan: [0, 150, 180] as [number, number, number],
        green: [0, 140, 80] as [number, number, number],
        orange: [200, 120, 0] as [number, number, number],
        red: [200, 50, 30] as [number, number, number],
        gray: [100, 100, 110] as [number, number, number],
        lightGray: [245, 246, 250] as [number, number, number],
        midGray: [220, 222, 230] as [number, number, number],
        headerBg: [30, 60, 130] as [number, number, number],
        rowAlt: [240, 244, 255] as [number, number, number],
    };

    // ── Helpers ──────────────────────────────────────────────
    const setFont = (
        size: number,
        style: 'normal' | 'bold' = 'normal',
        color: [number, number, number] = C.black
    ) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
    };

    const fillRect = (
        x: number, yy: number, w: number, h: number,
        color: [number, number, number], radius = 0
    ) => {
        doc.setFillColor(...color);
        if (radius > 0) doc.roundedRect(x, yy, w, h, radius, radius, 'F');
        else doc.rect(x, yy, w, h, 'F');
    };

    const strokeRect = (
        x: number, yy: number, w: number, h: number,
        color: [number, number, number], lw = 0.3, radius = 0
    ) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(lw);
        if (radius > 0) doc.roundedRect(x, yy, w, h, radius, radius, 'S');
        else doc.rect(x, yy, w, h, 'S');
    };

    const hLine = (
        x1: number, yy: number, x2: number,
        color: [number, number, number] = C.midGray, lw = 0.3
    ) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(lw);
        doc.line(x1, yy, x2, yy);
    };

    const newPage = () => {
        doc.addPage();
        y = margin;
    };

    const checkBreak = (needed: number) => {
        if (y + needed > 272) newPage();
    };

    const sectionTitle = (title: string) => {
        checkBreak(12);
        fillRect(margin, y, contentW, 8, C.headerBg, 2);
        setFont(8.5, 'bold', C.white);
        doc.text(title, margin + 4, y + 5.5);
        y += 11;
    };

    // ════════════════════════════════════════════════════════
    // PAGE 1 — COUVERTURE
    // ════════════════════════════════════════════════════════
    // Fond blanc
    fillRect(0, 0, W, 297, C.white);

    // Bande titre bleue
    fillRect(0, 0, W, 42, C.headerBg);

    setFont(26, 'bold', C.white);
    doc.text('AmpAnalyzer', W / 2, 18, { align: 'center' });

    setFont(9, 'normal', C.lightBlue);
    doc.text('Rapport de Conception — Amplificateur Audio', W / 2, 27, { align: 'center' });

    // Badge architecture
    const archLabel = params.ampClass === 'Class D' ? 'CLASSE D' : 'CLASSE AB';
    const archColor: [number, number, number] = params.ampClass === 'Class D'
        ? [0, 180, 220] : [0, 210, 160];
    fillRect(W / 2 - 22, 31, 44, 8, archColor, 3);
    setFont(7, 'bold', C.black);
    doc.text(archLabel, W / 2, 36.5, { align: 'center' });

    // Date sous la bande
    setFont(7.5, 'normal', C.gray);
    doc.text(
        `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        W / 2, 48, { align: 'center' }
    );

    hLine(margin, 51, W - margin, C.midGray, 0.5);
    y = 56;

    // ── Paramètres ───────────────────────────────────────────
    sectionTitle('⚙  Paramètres de Conception');

    const paramPairs = [
        ['Architecture', params.ampClass],
        ['Puissance cible', `${params.targetPower} W`],
        ['Impédance', `${params.loadImpedance} Ω`],
        ['Alimentation', `${params.supplyType === 'Symmetrical' ? '±' : ''}${params.supplyVoltage} V`],
        ['Type alim.', params.supplyType === 'Symmetrical' ? 'Symétrique' : 'Simple'],
        ['Température', `${params.ambientTemp} °C`],
    ];

    const halfW = (contentW - 4) / 2;
    paramPairs.forEach((row, i) => {
        const col = i % 2;
        const rowY = y + Math.floor(i / 2) * 11;
        const x = margin + col * (halfW + 4);
        fillRect(x, rowY, halfW, 9, col === 0 ? C.lightGray : C.rowAlt, 2);
        strokeRect(x, rowY, halfW, 9, C.midGray, 0.2, 2);
        setFont(6.5, 'normal', C.gray);
        doc.text(row[0], x + 3, rowY + 4);
        setFont(8, 'bold', C.black);
        doc.text(row[1], x + 3, rowY + 8);
    });
    y += Math.ceil(paramPairs.length / 2) * 11 + 6;

    // ── Résultats ─────────────────────────────────────────────
    sectionTitle('📊  Résultats Calculés');

    const vOutRms = (results.vPeak / Math.sqrt(2)).toFixed(1);
    const iRms = (results.iPeak / Math.sqrt(2)).toFixed(2);

    const metrics = [
        { label: 'TENSION SORTIE', value: vOutRms, unit: 'Vrms', color: C.cyan, sub: `Crête: ${results.vPeak} V` },
        { label: 'COURANT SORTIE', value: iRms, unit: 'Arms', color: C.blue, sub: `Crête: ${results.iPeak} A` },
        { label: 'PUISSANCE RÉELLE', value: String(results.realPower), unit: 'W', color: C.green, sub: 'Limite alimentation' },
        { label: 'RENDEMENT', value: String(results.efficiency), unit: '%', color: C.orange, sub: params.ampClass },
        { label: 'DISSIPATION', value: String(results.pdTotal), unit: 'W', color: C.red, sub: `${results.pdPerDevice} W / transistor` },
        { label: 'COURANT REPOS', value: String(results.iQuiescent), unit: 'mA', color: C.gray, sub: 'Quiescent' },
    ];

    const mW = (contentW - 4) / 3;
    const mH = 20;
    metrics.forEach((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bx = margin + col * (mW + 2);
        const by = y + row * (mH + 3);

        fillRect(bx, by, mW, mH, C.lightGray, 3);
        strokeRect(bx, by, mW, mH, m.color, 0.6, 3);

        setFont(6, 'bold', C.gray);
        doc.text(m.label, bx + 3, by + 5);

        setFont(13, 'bold', m.color);
        doc.text(m.value, bx + 3, by + 13);

        setFont(7, 'normal', C.gray);
        doc.text(m.unit, bx + 3 + doc.getTextWidth(m.value) + 1, by + 13);

        setFont(6, 'normal', C.gray);
        doc.text(m.sub, bx + 3, by + 18);
    });
    y += Math.ceil(metrics.length / 3) * (mH + 3) + 6;

    // ── Verdict ───────────────────────────────────────────────
    sectionTitle('🛡  Verdict Système');

    const isOk = results.recommendation.verdict === 'Functional';
    const isRisk = results.recommendation.verdict === 'Risk';
    const vColor: [number, number, number] = isOk ? C.green : isRisk ? C.orange : C.red;
    const vLabel = isOk ? 'FONCTIONNEL' : isRisk ? 'RISQUE' : 'ÉCHEC';
    const vBg: [number, number, number] = isOk ? [220, 255, 235] : isRisk ? [255, 245, 220] : [255, 230, 225];

    fillRect(margin, y, contentW, 16, vBg, 3);
    strokeRect(margin, y, contentW, 16, vColor, 0.8, 3);

    fillRect(margin, y, 42, 16, vColor, 3);
    setFont(8, 'bold', C.white);
    doc.text(vLabel, margin + 21, y + 10, { align: 'center' });

    setFont(7, 'normal', C.black);
    doc.text(`Rth requise ≤ ${results.rthRequired.toFixed(2)} °C/W`, margin + 48, y + 7);
    doc.text(`Surface dissipateur ≥ ${results.heatsinkArea.toFixed(0)} cm²`, margin + 48, y + 13);
    doc.text(`Tj max : ${results.tjMax} °C`, margin + 135, y + 7);
    y += 20;

    if (results.recommendation.warnings.length > 0) {
        checkBreak(8 + results.recommendation.warnings.length * 7);
        fillRect(margin, y, contentW, 6 + results.recommendation.warnings.length * 7, [255, 248, 230], 2);
        strokeRect(margin, y, contentW, 6 + results.recommendation.warnings.length * 7, C.orange, 0.4, 2);
        setFont(7, 'bold', C.orange);
        doc.text('Avertissements :', margin + 3, y + 5);
        y += 7;
        results.recommendation.warnings.forEach(w => {
            setFont(6.5, 'normal', C.black);
            doc.text(`⚠  ${w}`, margin + 4, y + 4, { maxWidth: contentW - 6 });
            y += 7;
        });
        y += 2;
        results.recommendation.suggestions.forEach(s => {
            checkBreak(7);
            setFont(6.5, 'normal', C.blue);
            doc.text(`→  ${s}`, margin + 4, y + 4, { maxWidth: contentW - 6 });
            y += 7;
        });
        y += 3;
    }

    // ════════════════════════════════════════════════════════
    // PAGE 2 — BOM
    // ════════════════════════════════════════════════════════
    newPage();
    fillRect(0, 0, W, 297, C.white);

    fillRect(0, 0, W, 18, C.headerBg);
    setFont(14, 'bold', C.white);
    doc.text('Liste des Composants (BOM)', margin, 12);
    setFont(7, 'normal', C.lightBlue);
    doc.text('Détail par étage — Bill of Materials', margin, 16);
    y = 24;

    results.stages.forEach((stage) => {
        checkBreak(20 + stage.components.length * 8);

        // Titre étage
        fillRect(margin, y, contentW, 8, C.headerBg, 2);
        setFont(8, 'bold', C.white);
        doc.text(stage.stageName, margin + 4, y + 5.5);
        y += 10;

        // En-tête colonnes
        const colW = [68, 42, contentW - 110];
        const colHeaders = ['Composant', 'Valeur', 'Note'];
        fillRect(margin, y, contentW, 7, C.lightBlue, 0);
        let hx = margin + 2;
        colHeaders.forEach((h, i) => {
            setFont(6.5, 'bold', C.blue);
            doc.text(h, hx, y + 5);
            hx += colW[i];
        });
        y += 7;

        stage.components.forEach((c, ci) => {
            checkBreak(8);
            if (ci % 2 === 0) fillRect(margin, y, contentW, 7, C.lightGray, 0);
            hLine(margin, y + 7, W - margin, C.midGray, 0.2);

            let cx = margin + 2;
            setFont(6.5, 'bold', C.black);
            doc.text(c.label, cx, y + 5, { maxWidth: colW[0] - 3 });
            cx += colW[0];

            setFont(6.5, 'bold', C.blue);
            doc.text(c.value, cx, y + 5, { maxWidth: colW[1] - 3 });
            cx += colW[1];

            setFont(6, 'normal', C.gray);
            doc.text(c.note || '—', cx, y + 5, { maxWidth: colW[2] - 3 });

            y += 7;
        });

        strokeRect(margin, y - stage.components.length * 7 - 7, contentW, stage.components.length * 7 + 7, C.midGray, 0.3);
        y += 5;
    });

    // ════════════════════════════════════════════════════════
    // PAGE 3 — COMPARATIF & FORMULES
    // ════════════════════════════════════════════════════════
    newPage();
    fillRect(0, 0, W, 297, C.white);

    fillRect(0, 0, W, 18, C.headerBg);
    setFont(14, 'bold', C.white);
    doc.text('Comparatif & Formules', margin, 12);
    y = 24;

    // Tableau comparatif
    sectionTitle('⚡  Comparatif Classe AB vs Classe D');

    const abEff = params.ampClass === 'Class AB' ? results.efficiency : Math.min(78.5, results.efficiency * 0.85);
    const dEff = params.ampClass === 'Class D' ? results.efficiency : 92;
    const abPd = params.ampClass === 'Class AB' ? results.pdTotal : results.pdTotal * 2.5;
    const dPd = params.ampClass === 'Class D' ? results.pdTotal : results.pdTotal * 0.4;
    const recommended = dEff > abEff ? 'Class D' : 'Class AB';

    const cmpHeaders = ['Classe', 'Rendement', 'Dissipation', 'Complexité', 'THD', 'Verdict'];
    const cmpW = [32, 28, 28, 28, 22, 42];

    // En-tête
    fillRect(margin, y, contentW, 8, C.headerBg, 2);
    let hx = margin + 2;
    cmpHeaders.forEach((h, i) => {
        setFont(6.5, 'bold', C.white);
        doc.text(h, hx, y + 5.5);
        hx += cmpW[i];
    });
    y += 8;

    [
        { cls: 'Class AB', eff: abEff, pd: abPd, cmplx: 'Basse', thd: '< 0.1%' },
        { cls: 'Class D', eff: dEff, pd: dPd, cmplx: 'Haute', thd: '< 0.5%' },
    ].forEach((row, ri) => {
        const isRec = row.cls === recommended;
        fillRect(margin, y, contentW, 9, ri % 2 === 0 ? C.lightGray : C.rowAlt, 0);
        if (isRec) strokeRect(margin, y, contentW, 9, C.green, 0.5);

        let cx = margin + 2;
        const cells = [
            row.cls,
            `${row.eff.toFixed(0)}%`,
            `${row.pd.toFixed(0)} W`,
            row.cmplx,
            row.thd,
            isRec ? '✓ Recommandé' : 'Viable',
        ];
        cells.forEach((cell, i) => {
            const color: [number, number, number] = i === 5 && isRec ? C.green : i === 1 ? C.blue : C.black;
            setFont(i === 0 ? 7 : 6.5, i === 0 || (i === 5 && isRec) ? 'bold' : 'normal', color);
            doc.text(cell, cx, y + 6, { maxWidth: cmpW[i] - 2 });
            cx += cmpW[i];
        });
        y += 9;
    });
    strokeRect(margin, y - 18, contentW, 18, C.midGray, 0.3);
    y += 8;

    // Bloc diagramme
    sectionTitle('→  Bloc Diagramme du Signal');

    fillRect(margin, y, contentW, 22, C.lightGray, 3);
    strokeRect(margin, y, contentW, 22, C.midGray, 0.3, 3);

    const blocks = results.blockDiagram;
    const bW = (contentW - 6) / blocks.length;
    blocks.forEach((b, i) => {
        const bx = margin + 3 + i * bW;
        const isMain = i === Math.floor(blocks.length / 2);
        fillRect(bx, y + 4, bW - 3, 14, isMain ? C.blue : C.white, 2);
        strokeRect(bx, y + 4, bW - 3, 14, isMain ? C.blue : C.midGray, isMain ? 0.8 : 0.3, 2);
        setFont(6, 'bold', isMain ? C.white : C.black);
        doc.text(b, bx + (bW - 3) / 2, y + 12, { align: 'center' });
        if (i < blocks.length - 1) {
            setFont(8, 'bold', C.blue);
            doc.text('→', bx + bW - 1.5, y + 12, { align: 'center' });
        }
    });
    y += 28;

    // Formules
    sectionTitle('∫  Formules de Calcul Utilisées');

    const formulas = params.ampClass === 'Class AB' ? [
        ['Puissance de sortie', 'P = Vswing² / (2 × RL)', `${results.realPower} W`],
        ['Tension crête', 'Vpk = √(2 × P × RL)', `${results.vPeak} V`],
        ['Rendement théorique', 'η = π/4 ≈ 78.5%', `${results.efficiency.toFixed(1)}%`],
        ['Dissipation max', 'Pd = Vcc² / (π² × RL)', `${results.pdTotal.toFixed(2)} W`],
        ['Résistance thermique', 'Rth = (Tj - Ta) / Pd', `${results.rthRequired.toFixed(2)} °C/W`],
    ] : [
        ['Puissance de sortie', 'P = (Vbus/√2)² / RL', `${results.realPower} W`],
        ['Tension crête', 'Vpk = Vbus', `${results.vPeak} V`],
        ['Rendement typique', 'η ≈ 92% (pont complet)', `${results.efficiency}%`],
        ['Inductance filtre', 'L = Vbus / (8 × fs × ΔI)', 'voir BOM'],
        ['Fréquence coupure LC', 'fc = 1 / (2π√(LC))', 'fc = 22 kHz'],
    ];

    formulas.forEach((f, fi) => {
        checkBreak(9);
        fillRect(margin, y, contentW, 8, fi % 2 === 0 ? C.lightGray : C.white, 0);
        hLine(margin, y + 8, W - margin, C.midGray, 0.2);

        setFont(6.5, 'bold', C.black);
        doc.text(f[0], margin + 3, y + 5.5);

        setFont(6.5, 'normal', C.blue);
        doc.text(f[1], margin + 68, y + 5.5);

        setFont(6.5, 'bold', C.black);
        doc.text(f[2], W - margin - 3, y + 5.5, { align: 'right' });

        y += 8;
    });
    strokeRect(margin, y - formulas.length * 8, contentW, formulas.length * 8, C.midGray, 0.3);

    // ── Pied de page sur toutes les pages ────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        hLine(margin, 283, W - margin, C.midGray, 0.4);
        fillRect(0, 284, W, 13, C.lightGray);
        setFont(6.5, 'normal', C.gray);
        doc.text('AmpAnalyzer — Rapport de Conception', margin, 291);
        doc.text(`${params.ampClass} | ${params.targetPower}W / ${params.loadImpedance}Ω`, W / 2, 291, { align: 'center' });
        setFont(6.5, 'bold', C.blue);
        doc.text(`Page ${p} / ${totalPages}`, W - margin, 291, { align: 'right' });
    }

    // ── Sauvegarde ───────────────────────────────────────────
    const filename = `AmpAnalyzer_${params.ampClass.replace(' ', '')}_${params.targetPower}W_${params.loadImpedance}ohm.pdf`;
    doc.save(filename);
}