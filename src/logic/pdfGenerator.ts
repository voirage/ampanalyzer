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

export async function generatePDFReport(results: CalculationResults, params: UserParams): Promise<void> {
    const JsPDF = await getJsPDF();
    const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W = 210;
    const margin = 14;
    const contentW = W - margin * 2;
    let y = 0;

    const C = {
        bg: [10, 10, 12] as [number, number, number],
        card: [20, 22, 28] as [number, number, number],
        cyan: [0, 242, 255] as [number, number, number],
        blue: [0, 114, 255] as [number, number, number],
        green: [0, 255, 128] as [number, number, number],
        orange: [255, 157, 0] as [number, number, number],
        red: [255, 75, 43] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        muted: [160, 160, 168] as [number, number, number],
        border: [50, 55, 65] as [number, number, number],
    };

    const setFont = (size: number, style: 'normal' | 'bold' = 'normal', color = C.white) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
    };

    const rect = (x: number, yy: number, w: number, h: number, color: [number, number, number], radius = 2) => {
        doc.setFillColor(...color);
        doc.roundedRect(x, yy, w, h, radius, radius, 'F');
    };

    const line = (x1: number, y1: number, x2: number, y2: number, color = C.border, lw = 0.3) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(lw);
        doc.line(x1, y1, x2, y2);
    };

    const newPage = () => {
        doc.addPage();
        rect(0, 0, W, 297, C.bg, 0);
        y = margin;
    };

    const checkPageBreak = (needed: number) => {
        if (y + needed > 275) newPage();
    };

    const sectionTitle = (title: string) => {
        checkPageBreak(14);
        rect(margin, y, contentW, 9, C.card, 2);
        line(margin, y, margin, y + 9, C.cyan, 1.5);
        setFont(9, 'bold', C.cyan);
        doc.text(`  ${title}`, margin + 2, y + 6);
        y += 13;
    };

    const tableRow = (cols: string[], colWidths: number[], startX: number, yy: number, isHeader = false, isAlt = false) => {
        const h = 7;
        const totalW = colWidths.reduce((a, b) => a + b, 0);
        if (isHeader) rect(startX, yy, totalW, h, [30, 32, 40], 2);
        else if (isAlt) rect(startX, yy, totalW, h, [18, 20, 26], 0);
        let x = startX + 2;
        cols.forEach((col, i) => {
            setFont(6.5, isHeader ? 'bold' : 'normal', isHeader ? C.cyan : C.white);
            doc.text(col, x, yy + 5, { maxWidth: colWidths[i] - 3 });
            x += colWidths[i];
        });
    };

    // ── PAGE 1 — COUVERTURE ──────────────────────────────────
    rect(0, 0, W, 297, C.bg, 0);
    rect(0, 0, W, 55, C.card, 0);

    setFont(24, 'bold', C.cyan);
    doc.text('AmpAnalyzer', W / 2, 20, { align: 'center' });
    setFont(9, 'normal', C.muted);
    doc.text('Rapport de Conception — Amplificateur Audio', W / 2, 29, { align: 'center' });

    const archColor = params.ampClass === 'Class D' ? C.blue : C.cyan;
    rect(W / 2 - 20, 33, 40, 9, archColor, 4);
    setFont(7.5, 'bold', C.bg);
    doc.text(params.ampClass === 'Class D' ? 'CLASSE D' : 'CLASSE AB', W / 2, 39, { align: 'center' });

    setFont(7, 'normal', C.muted);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, W / 2, 50, { align: 'center' });

    y = 65;

    // Paramètres
    sectionTitle('Paramètres de Conception');
    const paramRows = [
        ['Architecture', params.ampClass],
        ['Puissance cible', `${params.targetPower} W`],
        ['Impédance', `${params.loadImpedance} Ω`],
        ['Alimentation', `${params.supplyType === 'Symmetrical' ? '±' : ''}${params.supplyVoltage} V`],
        ['Type alim.', params.supplyType === 'Symmetrical' ? 'Symétrique' : 'Simple'],
        ['Température', `${params.ambientTemp} °C`],
    ];
    const halfW = contentW / 2 - 2;
    paramRows.forEach((row, i) => {
        const col = i % 2;
        const rowY = y + Math.floor(i / 2) * 12;
        const x = margin + col * (halfW + 4);
        rect(x, rowY, halfW, 10, C.card, 2);
        setFont(6, 'normal', C.muted);
        doc.text(row[0], x + 3, rowY + 4);
        setFont(8, 'bold', C.white);
        doc.text(row[1], x + 3, rowY + 8.5);
    });
    y += Math.ceil(paramRows.length / 2) * 12 + 8;

    // Résultats calculés
    sectionTitle('Résultats Calculés');
    const vOutRms = (results.vPeak / Math.sqrt(2)).toFixed(1);
    const iRms = (results.iPeak / Math.sqrt(2)).toFixed(2);
    const metrics = [
        { label: 'TENSION SORTIE', value: vOutRms, unit: 'Vrms', color: C.cyan, sub: `Crête: ${results.vPeak} V` },
        { label: 'COURANT SORTIE', value: iRms, unit: 'Arms', color: C.blue, sub: `Crête: ${results.iPeak} A` },
        { label: 'PUISSANCE RÉELLE', value: String(results.realPower), unit: 'W', color: C.green, sub: 'Limite alimentation' },
        { label: 'RENDEMENT', value: String(results.efficiency), unit: '%', color: C.orange, sub: params.ampClass },
        { label: 'DISSIPATION', value: String(results.pdTotal), unit: 'W', color: C.red, sub: `${results.pdPerDevice} W / transistor` },
        { label: 'COURANT REPOS', value: String(results.iQuiescent), unit: 'mA', color: C.muted, sub: 'Quiescent' },
    ];
    const mW = contentW / 3 - 2;
    const mH = 22;
    metrics.forEach((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bx = margin + col * (mW + 3);
        const by = y + row * (mH + 3);
        rect(bx, by, mW, mH, C.card, 3);
        doc.setDrawColor(...m.color);
        doc.setLineWidth(0.4);
        doc.roundedRect(bx, by, mW, mH, 3, 3, 'S');
        setFont(6, 'normal', C.muted);
        doc.text(m.label, bx + 3, by + 5);
        setFont(12, 'bold', m.color);
        doc.text(m.value, bx + 3, by + 13);
        setFont(6.5, 'normal', C.muted);
        doc.text(m.unit, bx + 3 + doc.getTextWidth(m.value) + 1, by + 13);
        setFont(6, 'normal', C.muted);
        doc.text(m.sub, bx + 3, by + 18);
    });
    y += Math.ceil(metrics.length / 3) * (mH + 3) + 6;

    // Verdict
    sectionTitle('Verdict Système');
    const verdictColor = results.recommendation.verdict === 'Functional' ? C.green
        : results.recommendation.verdict === 'Risk' ? C.orange : C.red;
    const verdictLabel = results.recommendation.verdict === 'Functional' ? '✓ FONCTIONNEL'
        : results.recommendation.verdict === 'Risk' ? '⚠ RISQUE' : '✗ ÉCHEC';

    rect(margin, y, contentW, 18, C.card, 3);
    doc.setDrawColor(...verdictColor);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentW, 18, 3, 3, 'S');
    rect(margin, y, 48, 18, verdictColor, 3);
    setFont(8, 'bold', C.bg);
    doc.text(verdictLabel, margin + 24, y + 11, { align: 'center' });
    setFont(7, 'normal', C.muted);
    doc.text(`Rth requise ≤ ${results.rthRequired.toFixed(2)} °C/W`, margin + 54, y + 7);
    doc.text(`Surface dissipateur ≥ ${results.heatsinkArea.toFixed(0)} cm²`, margin + 54, y + 13);
    doc.text(`Tj max : ${results.tjMax} °C`, margin + 130, y + 7);
    y += 22;

    if (results.recommendation.warnings.length > 0) {
        checkPageBreak(10 + results.recommendation.warnings.length * 7);
        rect(margin, y, contentW, 6 + results.recommendation.warnings.length * 7, [40, 25, 10], 2);
        setFont(7, 'bold', C.orange);
        doc.text('Avertissements :', margin + 3, y + 5);
        y += 7;
        results.recommendation.warnings.forEach(w => {
            setFont(6.5, 'normal', C.muted);
            doc.text(`⚠  ${w}`, margin + 4, y + 4, { maxWidth: contentW - 6 });
            y += 7;
        });
        y += 3;
        results.recommendation.suggestions.forEach(s => {
            checkPageBreak(7);
            setFont(6.5, 'normal', C.cyan);
            doc.text(`→  ${s}`, margin + 4, y + 4, { maxWidth: contentW - 6 });
            y += 7;
        });
        y += 4;
    }

    // ── PAGE 2 — BOM ─────────────────────────────────────────
    newPage();
    setFont(16, 'bold', C.cyan);
    doc.text('Liste des Composants (BOM)', margin, y + 8);
    setFont(8, 'normal', C.muted);
    doc.text('Détail par étage — Bill of Materials', margin, y + 14);
    line(margin, y + 16, W - margin, y + 16, C.border, 0.4);
    y += 22;

    results.stages.forEach((stage) => {
        checkPageBreak(18 + stage.components.length * 8);
        rect(margin, y, contentW, 8, [25, 30, 40], 2);
        line(margin, y, margin + 3, y + 8, C.cyan, 2);
        setFont(8, 'bold', C.cyan);
        doc.text(stage.stageName, margin + 5, y + 5.5);
        y += 10;
        const cols = ['Composant', 'Valeur', 'Note'];
        const colW = [65, 40, contentW - 105];
        tableRow(cols, colW, margin, y, true);
        y += 7;
        stage.components.forEach((c, ci) => {
            checkPageBreak(8);
            tableRow([c.label, c.value, c.note || '—'], colW, margin, y, false, ci % 2 === 0);
            y += 7;
        });
        line(margin, y + 2, W - margin, y + 2, C.border, 0.3);
        y += 7;
    });

    // ── PAGE 3 — COMPARATIF & FORMULES ───────────────────────
    newPage();
    setFont(16, 'bold', C.cyan);
    doc.text('Comparatif & Formules', margin, y + 8);
    line(margin, y + 11, W - margin, y + 11, C.border, 0.4);
    y += 18;

    sectionTitle('Comparatif Classe AB vs Classe D');
    const cmpCols = ['Classe', 'Rendement', 'Dissipation', 'Complexité', 'THD', 'Verdict'];
    const cmpW = [32, 28, 28, 28, 22, 28];
    tableRow(cmpCols, cmpW, margin, y, true);
    y += 7;
    const abEff = params.ampClass === 'Class AB' ? results.efficiency : Math.min(78.5, results.efficiency * 0.85);
    const dEff = params.ampClass === 'Class D' ? results.efficiency : 92;
    const abPd = params.ampClass === 'Class AB' ? results.pdTotal : results.pdTotal * 2.5;
    const dPd = params.ampClass === 'Class D' ? results.pdTotal : results.pdTotal * 0.4;
    [
        ['Class AB', `${abEff.toFixed(0)}%`, `${abPd.toFixed(0)} W`, 'Basse', '< 0.1%', 'Viable'],
        ['Class D', `${dEff.toFixed(0)}%`, `${dPd.toFixed(0)} W`, 'Haute', '< 0.5%', 'Viable'],
    ].forEach((row, ri) => {
        tableRow(row, cmpW, margin, y, false, ri % 2 === 0);
        y += 7;
    });
    y += 8;

    sectionTitle('Bloc Diagramme du Signal');
    rect(margin, y, contentW, 24, C.card, 3);
    const blocks = results.blockDiagram;
    const bW = (contentW - 8) / blocks.length;
    blocks.forEach((b, i) => {
        const bx = margin + 4 + i * bW;
        const isMain = i === Math.floor(blocks.length / 2);
        rect(bx, y + 5, bW - 3, 14, isMain ? C.blue : [30, 35, 45], 2);
        setFont(6, 'bold', isMain ? C.white : C.muted);
        doc.text(b, bx + (bW - 3) / 2, y + 13, { align: 'center' });
        if (i < blocks.length - 1) {
            setFont(8, 'bold', C.cyan);
            doc.text('→', bx + bW - 2, y + 13, { align: 'center' });
        }
    });
    y += 30;

    sectionTitle('Formules de Calcul');
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
        ['Filtre LC', 'L = Vbus / (8 × fs × ΔI)', 'voir BOM'],
        ['Fréquence coupure', 'fc = 1 / (2π√(LC)) = 22 kHz', 'fc = 22 kHz'],
    ];
    formulas.forEach((f, fi) => {
        checkPageBreak(10);
        rect(margin, y, contentW, 9, fi % 2 === 0 ? C.card : [18, 20, 26], 0);
        setFont(6.5, 'bold', C.muted);
        doc.text(f[0], margin + 3, y + 6);
        setFont(6.5, 'normal', C.cyan);
        doc.text(f[1], margin + 65, y + 6);
        setFont(6.5, 'bold', C.white);
        doc.text(f[2], W - margin - 3, y + 6, { align: 'right' });
        y += 9;
    });

    // Pied de page sur toutes les pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        rect(0, 285, W, 12, C.card, 0);
        line(0, 285, W, 285, C.border, 0.3);
        setFont(6, 'normal', C.muted);
        doc.text('AmpAnalyzer — Rapport de Conception', margin, 291);
        doc.text(`Page ${p} / ${totalPages}`, W - margin, 291, { align: 'right' });
        doc.text(`${params.ampClass} | ${params.targetPower}W / ${params.loadImpedance}Ω`, W / 2, 291, { align: 'center' });
    }

    const filename = `AmpAnalyzer_${params.ampClass.replace(' ', '')}_${params.targetPower}W_${params.loadImpedance}ohm.pdf`;
    doc.save(filename);
}