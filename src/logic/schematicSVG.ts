// ============================================================
//  Générateur de schémas — Normalisé + Discret BJT + 3D ISO
// ============================================================

// ── Symboles BJT ─────────────────────────────────────────────
function npnBJT(cx: number, cy: number, r: number, ref: string, part: string): string {
  const bx = cx - r + 5;
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f5f7ff" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy - r * 0.62}" x2="${bx}" y2="${cy + r * 0.62}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${bx}" y1="${cy - r * 0.5}" x2="${cx + r * 0.9}" y2="${cy - r * 0.9}" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy + r * 0.5}" x2="${cx + r * 0.9}" y2="${cy + r * 0.9}" stroke="#1a1a2e" stroke-width="2"/>
    <polygon points="${cx + r * 0.52},${cy + r * 0.7} ${cx + r * 0.9},${cy + r * 0.9} ${cx + r * 0.7},${cy + r * 1.12}" fill="#1a1a2e"/>
    <text x="${cx + 1}" y="${cy + 4}" text-anchor="middle" font-size="7.5" fill="#333">${part.substring(0, 8)}</text>
    <text x="${cx}" y="${cy - r - 8}" text-anchor="middle" font-size="10" fill="#0033cc" font-weight="bold">${ref}</text>
    <text x="${cx + r + 5}" y="${cy - r * 0.85}" font-size="8" fill="#cc0000" font-weight="bold">C</text>
    <text x="${cx - r - 18}" y="${cy + 4}" font-size="8" fill="#cc0000" font-weight="bold">B</text>
    <text x="${cx + r + 5}" y="${cy + r * 0.95 + 5}" font-size="8" fill="#cc0000" font-weight="bold">E</text>
  `;
}

function pnpBJT(cx: number, cy: number, r: number, ref: string, part: string): string {
  const bx = cx - r + 5;
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff5f5" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy - r * 0.62}" x2="${bx}" y2="${cy + r * 0.62}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${bx}" y1="${cy - r * 0.5}" x2="${cx + r * 0.9}" y2="${cy - r * 0.9}" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy + r * 0.5}" x2="${cx + r * 0.9}" y2="${cy + r * 0.9}" stroke="#1a1a2e" stroke-width="2"/>
    <polygon points="${bx + 12},${cy - r * 0.42} ${bx},${cy - r * 0.5} ${bx + 7},${cy - r * 0.68}" fill="#1a1a2e"/>
    <text x="${cx + 1}" y="${cy + 4}" text-anchor="middle" font-size="7.5" fill="#333">${part.substring(0, 8)}</text>
    <text x="${cx}" y="${cy - r - 8}" text-anchor="middle" font-size="10" fill="#cc0033" font-weight="bold">${ref}</text>
    <text x="${cx + r + 5}" y="${cy - r * 0.85}" font-size="8" fill="#cc0000" font-weight="bold">C</text>
    <text x="${cx - r - 18}" y="${cy + 4}" font-size="8" fill="#cc0000" font-weight="bold">B</text>
    <text x="${cx + r + 5}" y="${cy + r * 0.95 + 5}" font-size="8" fill="#cc0000" font-weight="bold">E</text>
  `;
}

function resistorSVG(x: number, y: number, w: number, label: string, val: string, vert = false): string {
  if (!vert) {
    const rw = w * 0.55; const rx = x + (w - rw) / 2;
    return `
      <line x1="${x}" y1="${y}" x2="${rx}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
      <rect x="${rx}" y="${y - 5.5}" width="${rw}" height="11" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
      <line x1="${rx + rw}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
      <text x="${x + w / 2}" y="${y - 9}" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">${label}</text>
      <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="8" fill="#333">${val}</text>`;
  } else {
    const rh = w * 0.55; const ry = y + (w - rh) / 2;
    return `
      <line x1="${x}" y1="${y}" x2="${x}" y2="${ry}" stroke="#1a1a2e" stroke-width="1.8"/>
      <rect x="${x - 5.5}" y="${ry}" width="11" height="${rh}" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
      <line x1="${x}" y1="${ry + rh}" x2="${x}" y2="${y + w}" stroke="#1a1a2e" stroke-width="1.8"/>
      <text x="${x + 12}" y="${y + w / 2 + 3}" font-size="9" fill="#0033cc" font-weight="bold">${label}</text>
      <text x="${x + 12}" y="${y + w / 2 + 13}" font-size="8" fill="#333">${val}</text>`;
  }
}

function capSVG(x: number, y: number, label: string, val: string, vert = false): string {
  if (!vert) {
    return `
      <line x1="${x}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
      <line x1="${x + 14}" y1="${y - 8}" x2="${x + 14}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="3"/>
      <line x1="${x + 19}" y1="${y - 8}" x2="${x + 19}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="3"/>
      <line x1="${x + 19}" y1="${y}" x2="${x + 33}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
      <text x="${x + 16}" y="${y - 11}" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">${label}</text>
      <text x="${x + 16}" y="${y + 20}" text-anchor="middle" font-size="8" fill="#333">${val}</text>`;
  } else {
    return `
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 14}" stroke="#1a1a2e" stroke-width="1.8"/>
      <line x1="${x - 8}" y1="${y + 14}" x2="${x + 8}" y2="${y + 14}" stroke="#1a1a2e" stroke-width="3"/>
      <line x1="${x - 8}" y1="${y + 19}" x2="${x + 8}" y2="${y + 19}" stroke="#1a1a2e" stroke-width="3"/>
      <line x1="${x}" y1="${y + 19}" x2="${x}" y2="${y + 33}" stroke="#1a1a2e" stroke-width="1.8"/>
      <text x="${x + 12}" y="${y + 16}" font-size="9" fill="#0033cc" font-weight="bold">${label}</text>
      <text x="${x + 12}" y="${y + 26}" font-size="8" fill="#333">${val}</text>`;
  }
}

function diodeSVG(x1: number, y1: number, x2: number, y2: number, label: string): string {
  const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2; const s = 9;
  const dx = x2 - x1; const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len; const ny = dy / len;
  const px = -ny * s; const py = nx * s;
  return `
    <line x1="${x1}" y1="${y1}" x2="${mx - nx * s}" y2="${my - ny * s}" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="${mx - nx * s + px},${my - ny * s + py} ${mx - nx * s - px},${my - ny * s - py} ${mx + nx * s},${my + ny * s}" fill="#1a1a2e"/>
    <line x1="${mx + nx * s + px * 1.1}" y1="${my + ny * s + py * 1.1}" x2="${mx + nx * s - px * 1.1}" y2="${my + ny * s - py * 1.1}" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="${mx + nx * s}" y1="${my + ny * s}" x2="${x2}" y2="${y2}" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="${mx + 10}" y="${my}" font-size="8" fill="#0033cc" font-weight="bold">${label}</text>`;
}

function gndSym(x: number, y: number): string {
  return `
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x - 12}" y1="${y + 8}" x2="${x + 12}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="${x - 8}" y1="${y + 13}" x2="${x + 8}" y2="${y + 13}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x - 4}" y1="${y + 18}" x2="${x + 4}" y2="${y + 18}" stroke="#1a1a2e" stroke-width="1.2"/>`;
}

function junctionDot(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y}" r="3.5" fill="#1a1a2e"/>`;
}

// ============================================================
//  SCHÉMA DISCRET CLASSE AB — Topologie 3 étages
// ============================================================
export function buildDiscreteClassABSchematic(
  vcc: number, rl: number,
  npnOut: string, pnpOut: string,
  pairs: number, driverNPN: string, driverPNP: string,
  re: number
): string {
  const reStr = `${re.toFixed(2)} Ohm`;
  const reW = `${Math.ceil(re * 4 + 1)} W`;
  const cin = '1 uF'; const rin = '47 kOhm';
  const rfb1 = '1 kOhm'; const rfb2 = '22 kOhm';
  const rc1 = `${Math.round(vcc / 0.05 / 100) * 100} Ohm`;
  const rBs = '2.7 kOhm'; const cBs = '47 uF';
  const cComp = '100 uF'; const cMill = '47 pF';

  return `<svg width="820" height="480" viewBox="0 0 820 480"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="820" height="480" fill="white"/>

    <!-- Titre -->
    <text x="410" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a0a2e">
      Schema Discret Classe AB — ±${vcc}V / ${rl}Ohm — ${pairs} paire${pairs > 1 ? 's' : ''} sortie
    </text>
    <line x1="10" y1="22" x2="810" y2="22" stroke="#bbb" stroke-width="0.8"/>

    <!-- Rails +VCC / -VCC -->
    <line x1="10" y1="40" x2="810" y2="40" stroke="#cc2200" stroke-width="1.5" stroke-dasharray="8,3"/>
    <text x="14" y="37" font-size="9.5" fill="#cc2200" font-weight="bold">+VCC (+${vcc}V)</text>
    <line x1="10" y1="445" x2="810" y2="445" stroke="#0033cc" stroke-width="1.5" stroke-dasharray="8,3"/>
    <text x="14" y="455" font-size="9.5" fill="#0033cc" font-weight="bold">-VCC (-${vcc}V)</text>

    <!-- ══ ENTRÉE & POLARISATION ══ -->
    <text x="14" y="247" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="58" y1="242" x2="80" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- C4 couplage entrée -->
    ${capSVG(80, 242, 'C4', cin)}
    <!-- R9 résistance entrée -->
    ${resistorSVG(113, 242, 30, 'R9', rin)}

    <!-- R7 vers GND -->
    ${junctionDot(143, 242)}
    <line x1="143" y1="242" x2="143" y2="268" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(143, 268, 30, 'R7', '22 kOhm', true)}
    ${gndSym(143, 298)}

    <!-- Fil vers base Q7 (driver PNP entrée) -->
    <line x1="143" y1="242" x2="168" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ Q7 & Q6 — Paire d'entrée PNP (BC556B) ══ -->
    ${pnpBJT(195, 242, 24, 'Q7', driverPNP)}
    <!-- Collecteur Q7 → vers R6 -->
    <line x1="219" y1="220" x2="219" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Émetteur Q7 → base Q6 -->
    <line x1="219" y1="264" x2="260" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- R6 - 18kOhm vers +VCC -->
    <line x1="219" y1="40" x2="219" y2="148" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(219, 148, 27, 'R6', '18 kOhm', true)}

    <!-- Q6 driver NPN -->
    ${npnBJT(287, 242, 24, 'Q6', driverNPN)}

    <!-- R5 1kOhm émetteur Q7 vers GND -->
    <line x1="219" y1="175" x2="219" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(219, 200, 28, 'R5', '1 kOhm', true)}
    ${gndSym(219, 228)}

    <!-- Collecteur Q6 vers R4 (compensateur) -->
    <line x1="311" y1="220" x2="311" y2="185" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(311, 155, 30, 'R4', '560 Ohm', true)}
    ${gndSym(311, 185)}

    <!-- C3 condensateur compensation (100µF) -->
    ${capSVG(325, 200, 'C3', '100uF', true)}

    <!-- ══ BOOTSTRAP C1/R1/R2 ══ -->
    <!-- R1 de +VCC -->
    <line x1="375" y1="40" x2="375" y2="68" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(375, 68, 30, 'R1', rBs, true)}
    <!-- R2 -->
    ${resistorSVG(375, 108, 30, 'R2', rBs, true)}
    <!-- C1 bootstrap cap -->
    ${capSVG(368, 148, 'C1', cBs, true)}
    <!-- Jonction C1/R1/R2 → driver -->
    ${junctionDot(375, 108)}
    <line x1="375" y1="168" x2="375" y2="190" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- R3 (22kOhm) vers base driver -->
    ${resistorSVG(311, 264, 40, 'R3', '22 kOhm')}
    <line x1="351" y1="264" x2="360" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ DIODES DE POLARISATION D2/D3/D4 ══ -->
    <!-- D2 -->
    <line x1="360" y1="264" x2="360" y2="240" stroke="#1a1a2e" stroke-width="1.8"/>
    ${diodeSVG(360, 240, 360, 210, 'D2')}
    <!-- D3 -->
    ${diodeSVG(360, 210, 360, 180, 'D3')}
    <!-- D4 -->
    ${diodeSVG(360, 180, 360, 150, 'D4')}
    <line x1="360" y1="150" x2="360" y2="120" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- D4 → +VCC connection -->
    <line x1="360" y1="120" x2="375" y2="120" stroke="#1a1a2e" stroke-width="1.8"/>
    ${junctionDot(360, 150)}

    <!-- C2 (Miller/compensation cap 47pF) -->
    ${capSVG(370, 190, 'C2', cMill, true)}

    <!-- ══ D1 — DIODE PROTECTION SORTIE ══ -->
    <!-- D1 à droite de la sortie -->
    ${diodeSVG(580, 242, 610, 242, 'D1')}

    <!-- ══ Q4 — DRIVER NPN VERS Q1 (sortie NPN) ══ -->
    ${npnBJT(430, 175, 26, 'Q4', 'BD139')}
    <!-- Base Q4 ← D4 top -->
    <line x1="360" y1="150" x2="404" y2="150" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="404" y1="150" x2="404" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Collecteur Q4 → +VCC -->
    <line x1="456" y1="150" x2="480" y2="150" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="480" y1="150" x2="480" y2="40" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Émetteur Q4 → base Q1 NPN sortie -->
    <line x1="456" y1="198" x2="490" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ Q5 — DRIVER PNP VERS Q2 (sortie PNP) ══ -->
    ${pnpBJT(430, 310, 26, 'Q5', 'BD140')}
    <!-- Base Q5 ← D2 bottom -->
    <line x1="360" y1="264" x2="404" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="404" y1="264" x2="404" y2="310" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Collecteur Q5 → -VCC -->
    <line x1="456" y1="334" x2="480" y2="334" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="480" y1="334" x2="480" y2="445" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Émetteur Q5 → base Q2 PNP sortie -->
    <line x1="456" y1="288" x2="490" y2="288" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ Q1 — TRANSISTOR NPN SORTIE ══ -->
    ${npnBJT(532, 198, pairs > 1 ? 30 : 28, 'Q1', npnOut)}
    <!-- Collecteur Q1 → +VCC -->
    <line x1="${532 + 28}" y1="${198 - 28}" x2="${560 + 28}" y2="100" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${560 + 28}" y1="100" x2="${560 + 28}" y2="40" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ Q2 — TRANSISTOR PNP SORTIE ══ -->
    ${pnpBJT(532, 288, pairs > 1 ? 30 : 28, 'Q2', pnpOut)}
    <!-- Collecteur Q2 → -VCC -->
    <line x1="${532 + 28}" y1="${288 + 28}" x2="${560 + 28}" y2="380" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${560 + 28}" y1="380" x2="${560 + 28}" y2="445" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ RÉSISTANCES ÉMETTEUR RE1 / RE2 ══ -->
    <!-- RE1 (Q1 émetteur → sortie) -->
    <line x1="${532 + 28}" y1="${198 + 28}" x2="${532 + 28}" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(532 + 28, 242, 28, 'RE1', `${reStr}/${reW}`, true)}
    <!-- RE2 (Q2 émetteur → sortie) -->
    <line x1="${532 + 28}" y1="${288 - 28}" x2="${532 + 28}" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${532 + 28}" y1="270" x2="${532 + 28}" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    ${junctionDot(532 + 28, 242)}

    <!-- Nœud de sortie -->
    <line x1="${532 + 28}" y1="242" x2="610" y2="242" stroke="#1a1a2e" stroke-width="2.2"/>
    ${junctionDot(610, 242)}

    <!-- ══ RÉSEAU ZOBEL ══ -->
    <line x1="610" y1="242" x2="610" y2="208" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(610, 180, 28, 'Rz', `${rl} Ohm`, true)}
    <line x1="610" y1="180" x2="610" y2="160" stroke="#1a1a2e" stroke-width="1.8"/>
    ${capSVG(603, 135, 'Cz', '100 nF', true)}
    <line x1="610" y1="135" x2="610" y2="115" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gndSym(610, 115)}

    <!-- ══ HAUT-PARLEUR ══ -->
    <line x1="620" y1="242" x2="660" y2="242" stroke="#1a1a2e" stroke-width="2.2"/>
    <!-- Corps HP -->
    <rect x="660" y="226" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="678,224 678,260 710,276 710,208" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Retour HP -->
    <line x1="693" y1="276" x2="693" y2="330" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gndSym(693, 330)}
    <text x="695" y="290" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="695" y="302" font-size="9" fill="#333">${rl} Ohm</text>

    <!-- ══ FEEDBACK Rfb1 / Rfb2 ══ -->
    <!-- Rfb2 : sortie → base Q6 (via R3) -->
    <line x1="610" y1="242" x2="610" y2="380" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    <line x1="610" y1="380" x2="311" y2="380" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    ${resistorSVG(311, 380, 50, 'Rfb2', rfb2)}
    <line x1="361" y1="380" x2="361" y2="264" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    <!-- Rfb1 : base Q6 → GND -->
    ${resistorSVG(253, 264, 30, 'Rfb1', rfb1)}
    <line x1="253" y1="264" x2="253" y2="300" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gndSym(253, 300)}
    <!-- Feedback label -->
    <text x="460" y="397" font-size="8" fill="#888" font-style="italic">--- Boucle de feedback (retour negatif)</text>

    <!-- ══ LÉGENDE ══ -->
    <rect x="720" y="30" width="90" height="130" rx="3" fill="#f8f9ff" stroke="#bbb" stroke-width="0.8"/>
    <text x="765" y="44" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#1a1a2e">Legende</text>
    <!-- NPN -->
    <circle cx="738" cy="60" r="10" fill="#f5f7ff" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="730" y1="55" x2="730" y2="65" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="730" y1="57" x2="738" y2="52" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="730" y1="63" x2="738" y2="68" stroke="#1a1a2e" stroke-width="1.5"/>
    <polygon points="735,65 738,68 736,71" fill="#1a1a2e"/>
    <text x="752" y="63" font-size="8" fill="#333">NPN BJT</text>
    <!-- PNP -->
    <circle cx="738" cy="90" r="10" fill="#fff5f5" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="730" y1="85" x2="730" y2="95" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="730" y1="87" x2="738" y2="82" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="730" y1="93" x2="738" y2="98" stroke="#1a1a2e" stroke-width="1.5"/>
    <polygon points="733,86 730,87 731,90" fill="#1a1a2e"/>
    <text x="752" y="93" font-size="8" fill="#333">PNP BJT</text>
    <!-- Diode -->
    <line x1="728" y1="115" x2="736" y2="115" stroke="#1a1a2e" stroke-width="1.5"/>
    <polygon points="736,110 736,120 742,115" fill="#1a1a2e"/>
    <line x1="742" y1="110" x2="742" y2="120" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="742" y1="115" x2="750" y2="115" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="752" y="118" font-size="8" fill="#333">Diode</text>
    <!-- Resistor -->
    <line x1="728" y1="140" x2="734" y2="140" stroke="#1a1a2e" stroke-width="1.5"/>
    <rect x="734" y="136" width="14" height="8" rx="1" fill="white" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="748" y1="140" x2="754" y2="140" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="758" y="143" font-size="8" fill="#333">Resistance</text>

    <!-- Note -->
    <text x="10" y="472" font-size="8" fill="#888">
      Topologie 3 etages : Entree PNP → Driver NPN+PNP → Sortie Push-Pull ${pairs} paire${pairs > 1 ? 's' : ''} | Boucle de retroaction negative via Rfb1/Rfb2
    </text>
  </svg>`;
}

// ============================================================
//  SCHÉMA DISCRET CLASSE D — H-Bridge MOSFET
// ============================================================
export function buildDiscreteClassDSchematic(
  vcc: number, rl: number, mosfet: string, lUH: number, cUF: number
): string {
  return `<svg width="820" height="440" viewBox="0 0 820 440"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="820" height="440" fill="white"/>

    <text x="410" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a0a2e">
      Schema Discret Classe D — IRS2092S + ${mosfet} — ${vcc}V / ${rl}Ohm
    </text>
    <line x1="10" y1="22" x2="810" y2="22" stroke="#bbb" stroke-width="0.8"/>

    <!-- Rails -->
    <line x1="10" y1="40" x2="810" y2="40" stroke="#cc2200" stroke-width="1.5" stroke-dasharray="8,3"/>
    <text x="14" y="37" font-size="9.5" fill="#cc2200" font-weight="bold">VBUS +${vcc}V</text>
    <line x1="10" y1="410" x2="810" y2="410" stroke="#333" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="14" y="420" font-size="9.5" fill="#333" font-weight="bold">GND</text>

    <!-- Entree audio -->
    <text x="14" y="233" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="60" y1="228" x2="82" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(82, 228, 30, 'Rin', '10 kOhm')}
    ${junctionDot(112, 228)}
    <line x1="112" y1="228" x2="112" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    ${capSVG(105, 255, 'Cin', '100 nF', true)}
    ${gndSym(112, 288)}
    <line x1="112" y1="228" x2="145" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- IRS2092S CI (rectangle IC) -->
    <rect x="145" y="160" width="100" height="136" rx="5" fill="#eef0ff" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="195" y="182" text-anchor="middle" font-size="10" font-weight="bold" fill="#1a1a2e">IRS2092S</text>
    <text x="195" y="196" text-anchor="middle" font-size="8.5" fill="#555">Ctrl PWM</text>
    <text x="195" y="208" text-anchor="middle" font-size="8" fill="#777">400 kHz</text>
    <!-- Pin labels internes -->
    <text x="150" y="232" font-size="7.5" fill="#333">5(IN+)</text>
    <text x="150" y="252" font-size="7.5" fill="#333">4(GND)</text>
    <text x="150" y="272" font-size="7.5" fill="#333">13(VCC)</text>
    <text x="222" y="188" font-size="7.5" fill="#333">12(HO)</text>
    <text x="222" y="258" font-size="7.5" fill="#333">9(LO)</text>
    <!-- Broches HO / LO -->
    <line x1="245" y1="185" x2="285" y2="185" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="245" y1="255" x2="285" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Alimentation CI -->
    <line x1="195" y1="160" x2="195" y2="40" stroke="#cc2200" stroke-width="1" stroke-dasharray="4,2"/>
    <!-- GND CI -->
    <line x1="195" y1="296" x2="195" y2="330" stroke="#1a1a2e" stroke-width="1.2"/>
    ${gndSym(195, 330)}

    <!-- ══ MOSFETs Q1 et Q2 (haut-côté & bas-côté) ══ -->
    <!-- Symbole MOSFET N-Ch Q1 (haut-côté) -->
    <!-- Drain (D) en haut, Source (S) en bas, Gate (G) à gauche -->
    <!-- Q1 body -->
    <rect x="290" y="115" width="60" height="80" rx="4" fill="#fff8ee" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="320" y="148" text-anchor="middle" font-size="8" font-weight="bold" fill="#1a1a2e">Q1</text>
    <text x="320" y="160" text-anchor="middle" font-size="7.5" fill="#555">${mosfet.substring(0, 8)}</text>
    <text x="320" y="172" text-anchor="middle" font-size="7" fill="#777">N-Ch</text>
    <!-- G broche -->
    <line x1="285" y1="185" x2="290" y2="155" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="278" y="168" font-size="7.5" fill="#cc0000" font-weight="bold">G(1)</text>
    <!-- D broche (+VCC) -->
    <line x1="320" y1="115" x2="320" y2="40" stroke="#cc2200" stroke-width="1.8"/>
    <text x="325" y="82" font-size="7.5" fill="#cc0000" font-weight="bold">D(2)</text>
    <!-- S broche (vers milieu) -->
    <line x1="320" y1="195" x2="320" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="325" y="214" font-size="7.5" fill="#cc0000" font-weight="bold">S(3)</text>
    ${junctionDot(320, 228)}

    <!-- Q2 (bas-côté) -->
    <rect x="290" y="262" width="60" height="80" rx="4" fill="#fff8ee" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="320" y="296" text-anchor="middle" font-size="8" font-weight="bold" fill="#1a1a2e">Q2</text>
    <text x="320" y="308" text-anchor="middle" font-size="7.5" fill="#555">${mosfet.substring(0, 8)}</text>
    <text x="320" y="320" text-anchor="middle" font-size="7" fill="#777">N-Ch</text>
    <!-- G broche Q2 -->
    <line x1="285" y1="255" x2="290" y2="295" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="278" y="280" font-size="7.5" fill="#cc0000" font-weight="bold">G(1)</text>
    <!-- D broche Q2 (vers milieu) -->
    <line x1="320" y1="262" x2="320" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="325" y="248" font-size="7.5" fill="#cc0000" font-weight="bold">D(2)</text>
    <!-- S broche Q2 (GND) -->
    <line x1="320" y1="342" x2="320" y2="410" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="325" y="378" font-size="7.5" fill="#cc0000" font-weight="bold">S(3)</text>

    <!-- Résistances de grille Rg -->
    <line x1="255" y1="185" x2="268" y2="185" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(268, 185, 22, 'Rg1', '22Ohm')}
    <line x1="255" y1="255" x2="268" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(268, 255, 22, 'Rg2', '22Ohm')}

    <!-- Bootstrap Q1 côté haut -->
    <line x1="320" y1="40" x2="370" y2="40" stroke="#cc2200" stroke-width="1"/>
    <line x1="370" y1="40" x2="370" y2="80" stroke="#cc2200" stroke-width="1"/>
    ${capSVG(363, 80, 'Cbt', '100nF', true)}
    ${gndSym(370, 113)}

    <!-- Nœud milieu pont (sortie A) → filtre LC -->
    <line x1="320" y1="228" x2="400" y2="228" stroke="#1a1a2e" stroke-width="2.5"/>
    ${junctionDot(400, 228)}

    <!-- ══ INDUCTANCE L FILTRE SORTIE ══ -->
    <!-- Symbole bobine (arcs) -->
    <line x1="400" y1="228" x2="420" y2="228" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M 420,228 Q 427,214 434,228 Q 441,242 448,228 Q 455,214 462,228 Q 469,242 476,228"
      fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="476" y1="228" x2="500" y2="228" stroke="#1a1a2e" stroke-width="2"/>
    <text x="448" y="209" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="448" y="248" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    ${junctionDot(500, 228)}

    <!-- ══ CONDENSATEUR C FILTRE ══ -->
    <line x1="500" y1="228" x2="500" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    ${capSVG(493, 255, 'C', `${cUF}uF`, true)}
    ${gndSym(500, 288)}

    <!-- Réseau d'amortissement -->
    <line x1="500" y1="228" x2="500" y2="195" stroke="#1a1a2e" stroke-width="1.5"/>
    ${resistorSVG(500, 165, 30, 'Rd', `${rl / 2}Ohm`, true)}
    ${capSVG(493, 135, 'Cd', `${cUF * 2}uF`, true)}
    ${gndSym(500, 135)}

    <!-- Fil sortie filtrée -->
    <line x1="500" y1="228" x2="560" y2="228" stroke="#1a1a2e" stroke-width="2.2"/>

    <!-- Condensateur de bus Cbulk -->
    <line x1="400" y1="228" x2="400" y2="180" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="400" y1="180" x2="400" y2="40" stroke="#cc2200" stroke-width="1.2"/>
    ${capSVG(393, 165, 'Cbulk', `${Math.ceil((vcc / Math.sqrt(2) / rl) * 150)}uF`, true)}

    <!-- TVS protection -->
    ${diodeSVG(400, 380, 400, 350, 'TVS')}
    <line x1="400" y1="350" x2="400" y2="320" stroke="#1a1a2e" stroke-width="1.5"/>
    ${junctionDot(400, 320)}
    <line x1="400" y1="410" x2="400" y2="380" stroke="#1a1a2e" stroke-width="1.5"/>

    <!-- ══ HAUT-PARLEUR ══ -->
    <rect x="560" y="212" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="578,212 578,244 608,258 608,198" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="592" y="272" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="592" y="284" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="592" y1="258" x2="592" y2="410" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Note -->
    <text x="10" y="432" font-size="8" fill="#888">
      Topologie demi-pont (half-bridge) — Pont complet avec 2x le meme circuit | Filtre LC fc=22kHz indispensable
    </text>
  </svg>`;
}

// ============================================================
//  VUE PSEUDO-3D ISOMÉTRIQUE — PCB
// ============================================================
export function buildPseudo3DView(
  vcc: number, rl: number,
  npnOut: string, pnpOut: string,
  ampClass: string, pairs: number
): string {

  // Projection isométrique : convertit (x3d, y3d, z3d) → (sx, sy) SVG
  const iso = (x: number, y: number, z: number): [number, number] => {
    return [
      350 + (x - y) * 0.866,
      220 + (x + y) * 0.5 - z
    ];
  };

  function box(x: number, y: number, z: number, w: number, d: number, h: number,
    colTop: string, colFront: string, colRight: string, label = ''): string {
    // Top face (y constant)
    const [t1x, t1y] = iso(x, y, z + h);
    const [t2x, t2y] = iso(x + w, y, z + h);
    const [t3x, t3y] = iso(x + w, y + d, z + h);
    const [t4x, t4y] = iso(x, y + d, z + h);
    // Front face (y=y constant)
    const [f1x, f1y] = iso(x, y, z);
    const [f2x, f2y] = iso(x + w, y, z);
    const [f3x, f3y] = iso(x + w, y, z + h);
    const [f4x, f4y] = iso(x, y, z + h);
    // Right face (x=x+w constant)
    const [r1x, r1y] = iso(x + w, y, z);
    const [r2x, r2y] = iso(x + w, y + d, z);
    const [r3x, r3y] = iso(x + w, y + d, z + h);
    const [r4x, r4y] = iso(x + w, y, z + h);

    const lx = (t1x + t2x + t3x + t4x) / 4;
    const ly = (t1y + t2y + t3y + t4y) / 4;

    return `
      <polygon points="${t1x},${t1y} ${t2x},${t2y} ${t3x},${t3y} ${t4x},${t4y}" fill="${colTop}" stroke="#333" stroke-width="0.8"/>
      <polygon points="${f1x},${f1y} ${f2x},${f2y} ${f3x},${f3y} ${f4x},${f4y}" fill="${colFront}" stroke="#333" stroke-width="0.8"/>
      <polygon points="${r1x},${r1y} ${r2x},${r2y} ${r3x},${r3y} ${r4x},${r4y}" fill="${colRight}" stroke="#333" stroke-width="0.8"/>
      ${label ? `<text x="${lx}" y="${ly + 3}" text-anchor="middle" font-size="7.5" fill="white" font-weight="bold" font-family="Arial">${label}</text>` : ''}
    `;
  }

  function cylinder3D(x: number, y: number, z: number, r: number, h: number,
    bodyCol: string, topCol: string, label = ''): string {
    const [bx, by] = iso(x, y, z);
    const [tx, ty] = iso(x, y, z + h);
    const ry2d = r * 0.5;
    return `
      <ellipse cx="${bx}" cy="${by}" rx="${r}" ry="${ry2d}" fill="${bodyCol}" stroke="#333" stroke-width="0.8"/>
      <rect x="${bx - r}" y="${ty}" width="${r * 2}" height="${by - ty}" fill="${bodyCol}" stroke="none"/>
      <line x1="${bx - r}" y1="${ty}" x2="${bx - r}" y2="${by}" stroke="#333" stroke-width="0.8"/>
      <line x1="${bx + r}" y1="${ty}" x2="${bx + r}" y2="${by}" stroke="#333" stroke-width="0.8"/>
      <ellipse cx="${tx}" cy="${ty}" rx="${r}" ry="${ry2d}" fill="${topCol}" stroke="#333" stroke-width="0.8"/>
      ${label ? `<text x="${tx + r + 4}" y="${ty + 3}" font-size="7" fill="#00f2ff" font-family="Arial">${label}</text>` : ''}
    `;
  }

  function resistor3D(x: number, y: number, z: number, label = '', val = ''): string {
    const [sx, sy] = iso(x, y, z);
    return `
      <line x1="${sx - 16}" y1="${sy}" x2="${sx - 8}" y2="${sy}" stroke="#aaa" stroke-width="1.2"/>
      <ellipse cx="${sx - 8}" cy="${sy}" rx="4" ry="2" fill="#c87832" stroke="#333" stroke-width="0.8"/>
      <rect x="${sx - 8}" y="${sy - 4}" width="16" height="8" fill="#c87832" stroke="none"/>
      <rect x="${sx - 5}" y="${sy - 4}" width="3" height="8" fill="#c8a000" stroke="none"/>
      <rect x="${sx + 1}" y="${sy - 4}" width="3" height="8" fill="#cc4400" stroke="none"/>
      <ellipse cx="${sx + 8}" cy="${sy}" rx="4" ry="2" fill="#9a5520" stroke="#333" stroke-width="0.8"/>
      <line x1="${sx + 8}" y1="${sy}" x2="${sx + 16}" y2="${sy}" stroke="#aaa" stroke-width="1.2"/>
      ${label ? `<text x="${sx}" y="${sy - 9}" text-anchor="middle" font-size="7" fill="#00f2ff" font-family="Arial">${label}</text>` : ''}
      ${val ? `<text x="${sx}" y="${sy + 15}" text-anchor="middle" font-size="6.5" fill="#aaa" font-family="Arial">${val}</text>` : ''}
    `;
  }

  // PCB BOARD
  const pcbSVG = `
    <!-- PCB principal -->
    ${box(-120, -80, 0, 240, 160, 4, '#1a5c1a', '#0a3a0a', '#0d4a0d')}

    <!-- Zones copper pads (simulation) -->
    ${Array.from({ length: 6 }, (_, i) => Array.from({ length: 4 }, (_, j) => {
    const [px, py] = iso(-90 + i * 40, -60 + j * 40, 4);
    return `<ellipse cx="${px}" cy="${py}" rx="4" ry="2" fill="#c8a000" opacity="0.5"/>`;
  }).join('')).join('')}

    <!-- Traces PCB (copper traces en jaune-orange) -->
    ${(() => {
      const pts = [
        [[-80, -30, 4], [-20, -30, 4]],
        [[-20, -30, 4], [-20, 20, 4]],
        [[-20, 20, 4], [40, 20, 4]],
        [[40, 20, 4], [80, 20, 4]],
      ];
      return pts.map(([[x1, y1, z1], [x2, y2, z2]]) => {
        const [sx1, sy1] = iso(x1, y1, z1);
        const [sx2, sy2] = iso(x2, y2, z2);
        return `<line x1="${sx1}" y1="${sy1}" x2="${sx2}" y2="${sy2}" stroke="#c8a000" stroke-width="2" opacity="0.7"/>`;
      }).join('');
    })()}

    <!-- Transistors TO-220 (Q_NPN) -->
    ${box(-50, -40, 4, 22, 15, 18, '#555', '#333', '#444', npnOut.substring(0, 7))}
    <!-- Tab metal dissipateur Q_NPN -->
    ${box(-50, -40, 22, 22, 15, 3, '#aaa', '#888', '#999')}

    <!-- Transistors TO-220 (Q_PNP) -->
    ${box(-50, 10, 4, 22, 15, 18, '#553333', '#332222', '#443333', pnpOut.substring(0, 7))}
    ${box(-50, 10, 22, 22, 15, 3, '#aaa', '#888', '#999')}

    ${pairs > 1 ? box(-50, -40 + 35, 4, 22, 15, 18, '#555', '#333', '#444', npnOut.substring(0, 7)) : ''}
    ${pairs > 1 ? box(-50, 10 + 35, 4, 22, 15, 18, '#553333', '#332222', '#443333', pnpOut.substring(0, 7)) : ''}

    <!-- Condensateurs électrolytiques -->
    ${cylinder3D(60, -50, 4, 10, 30, '#1a3acc', '#2244dd', 'C_bus')}
    ${cylinder3D(60, 10, 4, 8, 22, '#2a5aaa', '#3366bb', 'Cdecoup')}
    ${cylinder3D(-90, -20, 4, 8, 20, '#1a3acc', '#2244dd', 'C_in')}

    <!-- CI principal (DIP/Multiwatt) -->
    ${box(20, -35, 4, 35, 25, 8, '#222244', '#111133', '#1a1a3a', 'IC1')}
    ${Array.from({ length: 7 }, (_, i) => {
      const [px, py] = iso(20 + i * 5, -35, 4);
      return `<line x1="${px}" y1="${py}" x2="${px - 3}" y2="${py + 5}" stroke="#c8c850" stroke-width="1"/>`;
    }).join('')}
    ${Array.from({ length: 7 }, (_, i) => {
      const [px, py] = iso(20 + i * 5, -10, 4);
      return `<line x1="${px}" y1="${py}" x2="${px + 2}" y2="${py + 5}" stroke="#c8c850" stroke-width="1"/>`;
    }).join('')}

    <!-- Résistances -->
    ${resistor3D(-80, -50, 4, 'Rfb1', '1k')}
    ${resistor3D(-80, 30, 4, 'Rfb2', '22k')}
    ${resistor3D(70, -30, 4, 'Rz', `${rl}Ohm`)}
    ${resistor3D(-30, -65, 4, 'Rin', '47k')}

    <!-- Condensateur couplage (horizontal) -->
    ${(() => {
      const [sx, sy] = iso(-60, -65, 4); return `
      <line x1="${sx - 12}" y1="${sy}" x2="${sx - 5}" y2="${sy}" stroke="#aaa" stroke-width="1.2"/>
      <ellipse cx="${sx - 5}" cy="${sy}" rx="5" ry="2.5" fill="#2a4488" stroke="#333" stroke-width="0.8"/>
      <rect x="${sx - 5}" y="${sy - 5}" width="10" height="10" fill="#2a4488" stroke="none"/>
      <ellipse cx="${sx + 5}" cy="${sy}" rx="5" ry="2.5" fill="#1a3366" stroke="#333" stroke-width="0.8"/>
      <line x1="${sx + 5}" y1="${sy}" x2="${sx + 12}" y2="${sy}" stroke="#aaa" stroke-width="1.2"/>
      <text x="${sx}" y="${sy - 9}" text-anchor="middle" font-size="7" fill="#00f2ff" font-family="Arial">Cin</text>
    `})()}

    <!-- Dissipateur thermique (array de fins) -->
    ${Array.from({ length: 6 }, (_, i) => box(-110 + i * 8, -30, 4, 4, 60, 30 + i * 2, '#ccc', '#aaa', '#bbb')).join('')}
  `;

  return `<svg width="780" height="460" viewBox="0 0 780 460"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">

    <!-- Fond sombre (ambiance PCB) -->
    <rect width="780" height="460" fill="#0d1117"/>

    <!-- Grille de fond -->
    ${Array.from({ length: 15 }, (_, i) => `<line x1="${i * 55}" y1="0" x2="${i * 55}" y2="460" stroke="#1a2030" stroke-width="0.5"/>`).join('')}
    ${Array.from({ length: 9 }, (_, j) => `<line x1="0" y1="${j * 55}" x2="780" y2="${j * 55}" stroke="#1a2030" stroke-width="0.5"/>`).join('')}

    <!-- Titre -->
    <text x="390" y="22" text-anchor="middle" font-size="12" font-weight="bold" fill="#00f2ff">
      Vue 3D PCB — ${ampClass} — +/-${vcc}V / ${rl}Ohm — ${pairs} paire${pairs > 1 ? 's' : ''}
    </text>

    <!-- PCB et composants -->
    ${pcbSVG}

    <!-- Halo lumineux sous le PCB -->
    <ellipse cx="350" cy="380" rx="180" ry="25" fill="rgba(0,114,255,0.08)"/>

    <!-- Fils de connexion colorés (simulation) -->
    ${(() => {
      const [a1x, a1y] = iso(-28, -40, 22); const [a2x, a2y] = iso(20, -15, 4);
      const [b1x, b1y] = iso(-28, 25, 22); const [b2x, b2y] = iso(20, -5, 4);
      const [c1x, c1y] = iso(60, -50, 34); const [c2x, c2y] = iso(70, -30, 4);
      return `
        <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="#00ff80" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.7"/>
        <line x1="${b1x}" y1="${b1y}" x2="${b2x}" y2="${b2y}" stroke="#ff4b2b" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.7"/>
        <line x1="${c1x}" y1="${c1y}" x2="${c2x}" y2="${c2y}" stroke="#00f2ff" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.7"/>
      `;
    })()}

    <!-- Labels flottants -->
    ${(() => {
      const [q1x, q1y] = iso(-39, -32, 22);
      const [q2x, q2y] = iso(-39, 17, 22);
      const [icx, icy] = iso(37, -22, 12);
      const [hsx, hsy] = iso(-82, -5, 34);
      return `
        <rect x="${q1x + 5}" y="${q1y - 12}" width="50" height="14" rx="2" fill="rgba(0,51,204,0.8)"/>
        <text x="${q1x + 30}" y="${q1y - 2}" text-anchor="middle" font-size="7.5" fill="white">${npnOut.substring(0, 8)}</text>
        <rect x="${q2x + 5}" y="${q2y - 12}" width="50" height="14" rx="2" fill="rgba(204,0,51,0.8)"/>
        <text x="${q2x + 30}" y="${q2y - 2}" text-anchor="middle" font-size="7.5" fill="white">${pnpOut.substring(0, 8)}</text>
        <rect x="${icx - 12}" y="${icy - 12}" width="60" height="14" rx="2" fill="rgba(20,20,50,0.9)"/>
        <text x="${icx + 18}" y="${icy - 2}" text-anchor="middle" font-size="7.5" fill="#00f2ff">${ampClass === 'Class D' ? 'IRS2092S' : 'LM3886/TDA'}</text>
        <rect x="${hsx - 20}" y="${hsy - 12}" width="62" height="14" rx="2" fill="rgba(50,50,50,0.9)"/>
        <text x="${hsx + 11}" y="${hsy - 2}" text-anchor="middle" font-size="7.5" fill="#ccc">Dissipateur</text>
      `;
    })()}

    <!-- Legende -->
    <rect x="10" y="380" width="200" height="70" rx="3" fill="rgba(0,0,0,0.7)" stroke="#333" stroke-width="0.8"/>
    <text x="110" y="397" text-anchor="middle" font-size="8.5" fill="#00f2ff" font-weight="bold">Legende Vue 3D</text>
    <rect x="18" y="405" width="10" height="7" fill="#1a5c1a" stroke="#0a3a0a" stroke-width="0.5"/>
    <text x="32" y="412" font-size="7.5" fill="#ccc">PCB (FR4 epoxy)</text>
    <rect x="18" y="418" width="10" height="7" fill="#555" stroke="#333" stroke-width="0.5"/>
    <text x="32" y="425" font-size="7.5" fill="#ccc">Transistor TO-220</text>
    <rect x="18" y="431" width="10" height="7" fill="#222244" stroke="#1a1a3a" stroke-width="0.5"/>
    <text x="32" y="438" font-size="7.5" fill="#ccc">CI integre</text>
    <rect x="118" y="405" width="10" height="7" fill="#c87832" stroke="#333" stroke-width="0.5"/>
    <text x="132" y="412" font-size="7.5" fill="#ccc">Resistance</text>
    <rect x="118" y="418" width="10" height="7" fill="#1a3acc" stroke="#333" stroke-width="0.5"/>
    <text x="132" y="425" font-size="7.5" fill="#ccc">Condensateur</text>
    <rect x="118" y="431" width="10" height="7" fill="#ccc" stroke="#aaa" stroke-width="0.5"/>
    <text x="132" y="438" font-size="7.5" fill="#ccc">Dissipateur alum.</text>

    <!-- Note bas -->
    <text x="390" y="452" text-anchor="middle" font-size="8" fill="#555">
      Vue illustrative — Positions indicatives — Utiliser le schema normalise pour le cablage reel
    </text>
  </svg>`;
}

// ── Fonctions existantes (normalisé + SVG→canvas) ─────────
export function buildClassABSchematic(vcc: number, rl: number): string {
  const gain = (1 + 22000 / 1000).toFixed(0);
  return `<svg width="760" height="400" viewBox="0 0 760 400"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="760" height="400" fill="white"/>
    <text x="380" y="17" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema Normalise Classe AB — LM3886/TDA7294 — +/-${vcc}V / ${rl}Ohm — Gain ${gain}x
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>
    <line x1="10" y1="45" x2="740" y2="45" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="7,3"/>
    <text x="14" y="41" font-size="9.5" fill="#cc2200" font-weight="bold">+VCC (+${vcc}V)</text>
    <line x1="10" y1="355" x2="740" y2="355" stroke="#0033cc" stroke-width="1.2" stroke-dasharray="7,3"/>
    <text x="14" y="364" font-size="9.5" fill="#0033cc" font-weight="bold">-VCC (-${vcc}V)</text>
    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="82" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="82" y1="187" x2="82" y2="207" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="88" y1="187" x2="88" y2="207" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="88" y1="197" x2="112" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="85" y="179" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">C1</text>
    <text x="85" y="222" text-anchor="middle" font-size="8.5" fill="#333">1 uF</text>
    <rect x="112" y="191" width="28" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="140" y1="197" x2="162" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="126" y="181" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rin</text>
    <text x="126" y="215" text-anchor="middle" font-size="8.5" fill="#333">22 kOhm</text>
    <circle cx="162" cy="197" r="3" fill="#1a1a2e"/>
    <line x1="162" y1="197" x2="162" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="162" y1="175" x2="182" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="182,135 182,250 262,192" fill="#eef3ff" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="162" y1="175" x2="182" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="186" y="179" font-size="10" fill="#006600" font-weight="bold">+</text>
    <text x="165" y="171" font-size="7.5" fill="#cc0000" font-weight="bold">1</text>
    <rect x="162" y="162" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>
    <line x1="148" y1="210" x2="182" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="186" y="214" font-size="10" fill="#cc0000" font-weight="bold">-</text>
    <text x="133" y="206" font-size="7.5" fill="#cc0000" font-weight="bold">9</text>
    <rect x="130" y="197" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>
    <text x="218" y="186" text-anchor="middle" font-size="9.5" fill="#1a1a2e" font-weight="bold">LM3886</text>
    <text x="218" y="198" text-anchor="middle" font-size="8" fill="#555">/ TDA7294</text>
    <line x1="262" y1="192" x2="320" y2="192" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="264" y="185" font-size="7.5" fill="#cc0000" font-weight="bold">5</text>
    <rect x="261" y="176" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>
    <circle cx="320" cy="192" r="3" fill="#1a1a2e"/>
    <line x1="222" y1="45" x2="222" y2="135" stroke="#cc2200" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="224" y="95" font-size="7.5" fill="#cc2200">6,7(+Vcc)</text>
    <line x1="222" y1="250" x2="222" y2="355" stroke="#0033cc" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="224" y="310" font-size="7.5" fill="#0033cc">4(-Vcc)</text>
    <line x1="320" y1="192" x2="320" y2="110" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="225" y1="110" x2="248" y2="110" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="248" y="104" width="28" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="276" y1="110" x2="320" y2="110" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="262" y="97" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rfb1</text>
    <text x="262" y="127" text-anchor="middle" font-size="8.5" fill="#333">1 kOhm</text>
    <circle cx="225" cy="110" r="3" fill="#1a1a2e"/>
    <line x1="225" y1="110" x2="225" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="148" y1="210" x2="225" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <circle cx="148" cy="210" r="3" fill="#1a1a2e"/>
    <line x1="148" y1="210" x2="148" y2="232" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="141" y="232" width="14" height="28" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="148" y1="260" x2="148" y2="285" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="136" y1="285" x2="160" y2="285" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="139" y1="291" x2="157" y2="291" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="142" y1="297" x2="154" y2="297" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="164" y="242" font-size="9" fill="#0033cc" font-weight="bold">Rfb2</text>
    <text x="164" y="254" font-size="8.5" fill="#333">22 kOhm</text>
    <rect x="320" y="186" width="26" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="346" y1="192" x2="378" y2="192" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="333" y="176" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rs</text>
    <text x="333" y="212" text-anchor="middle" font-size="8.5" fill="#333">0.22 Ohm</text>
    <circle cx="378" cy="192" r="3" fill="#1a1a2e"/>
    <line x1="378" y1="192" x2="378" y2="158" stroke="#1a1a2e" stroke-width="1.2"/>
    <rect x="372" y="135" width="12" height="24" rx="1" fill="white" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="378" y1="135" x2="378" y2="115" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="369" y1="115" x2="387" y2="115" stroke="#1a1a2e" stroke-width="2.8"/>
    <line x1="369" y1="109" x2="387" y2="109" stroke="#1a1a2e" stroke-width="2.8"/>
    <line x1="378" y1="109" x2="378" y2="92" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="368" y1="92" x2="388" y2="92" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="371" y1="97" x2="385" y2="97" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="374" y1="102" x2="382" y2="102" stroke="#1a1a2e" stroke-width="1"/>
    <text x="393" y="148" font-size="8" fill="#555">10 Ohm</text>
    <text x="393" y="115" font-size="8" fill="#555">100 nF</text>
    <text x="393" y="95" font-size="8" fill="#555" font-weight="bold">Zobel</text>
    <line x1="378" y1="192" x2="415" y2="192" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="415" y="177" width="20" height="30" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="435,177 435,207 468,222 468,162" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="451" y1="222" x2="451" y2="290" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="440" y1="290" x2="462" y2="290" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="443" y1="296" x2="459" y2="296" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="446" y1="302" x2="456" y2="302" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="451" y="235" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="451" y="248" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="580" y1="45" x2="580" y2="68" stroke="#cc2200" stroke-width="1.2"/>
    <line x1="570" y1="68" x2="590" y2="68" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="570" y1="74" x2="590" y2="74" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="580" y1="74" x2="580" y2="98" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="572" y1="98" x2="588" y2="98" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="574" y1="104" x2="586" y2="104" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="576" y1="110" x2="584" y2="110" stroke="#1a1a2e" stroke-width="1"/>
    <text x="594" y="65" font-size="8.5" fill="#444" font-weight="bold">100 uF</text>
    <text x="594" y="75" font-size="8.5" fill="#444">+ 100 nF</text>
    <text x="594" y="90" font-size="8" fill="#555">Decouplage +VCC</text>
    <line x1="620" y1="355" x2="620" y2="332" stroke="#0033cc" stroke-width="1.2"/>
    <line x1="610" y1="332" x2="630" y2="332" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="610" y1="326" x2="630" y2="326" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="620" y1="326" x2="620" y2="302" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="612" y1="302" x2="628" y2="302" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="614" y1="296" x2="626" y2="296" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="616" y1="290" x2="624" y2="290" stroke="#1a1a2e" stroke-width="1"/>
    <text x="634" y="332" font-size="8.5" fill="#444" font-weight="bold">100 uF</text>
    <text x="634" y="342" font-size="8.5" fill="#444">+ 100 nF</text>
  </svg>`;
}

export function buildClassDSchematic(vcc: number, rl: number, lUH: number, cUF: number): string {
  const cBulk = Math.ceil((vcc / Math.sqrt(2) / rl) * 150);
  return `<svg width="760" height="400" viewBox="0 0 760 400"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="760" height="400" fill="white"/>
    <text x="380" y="17" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema Normalise Classe D — IRS2092S + Pont H — ${vcc}V / ${rl}Ohm
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>
    <line x1="10" y1="45" x2="740" y2="45" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="7,3"/>
    <text x="14" y="41" font-size="9.5" fill="#cc2200" font-weight="bold">VBUS +${vcc}V DC</text>
    <line x1="10" y1="355" x2="740" y2="355" stroke="#333" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="14" y="364" font-size="9.5" fill="#333" font-weight="bold">GND</text>
    <text x="12" y="203" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="60" y1="198" x2="82" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="82" y="192" width="26" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="108" y1="198" x2="128" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="95" y="181" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rin</text>
    <text x="95" y="217" text-anchor="middle" font-size="8.5" fill="#333">10 kOhm</text>
    <circle cx="128" cy="198" r="3" fill="#1a1a2e"/>
    <line x1="128" y1="198" x2="128" y2="220" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="119" y1="220" x2="137" y2="220" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="119" y1="227" x2="137" y2="227" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="128" y1="227" x2="128" y2="248" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="119" y1="248" x2="137" y2="248" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="122" y1="254" x2="134" y2="254" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="125" y1="260" x2="131" y2="260" stroke="#1a1a2e" stroke-width="1"/>
    <text x="140" y="222" font-size="9" fill="#0033cc" font-weight="bold">Cin</text>
    <text x="140" y="233" font-size="8.5" fill="#333">100 nF</text>
    <line x1="128" y1="198" x2="158" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="158" y="128" width="100" height="140" rx="5" fill="#eef0ff" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="208" y="148" text-anchor="middle" font-weight="bold" font-size="10" fill="#1a1a2e">IRS2092S</text>
    <text x="208" y="161" text-anchor="middle" font-size="8.5" fill="#555">Ctrl PWM 400kHz</text>
    <text x="163" y="194" font-size="7.5" fill="#333">5(IN+)</text>
    <text x="163" y="212" font-size="7.5" fill="#333">4(GND)</text>
    <text x="163" y="230" font-size="7.5" fill="#333">13(VCC)</text>
    <text x="220" y="188" font-size="7.5" fill="#333">12(HO)</text>
    <text x="220" y="258" font-size="7.5" fill="#333">9(LO)</text>
    <line x1="258" y1="185" x2="290" y2="185" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="258" y1="255" x2="290" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="208" y1="128" x2="208" y2="45" stroke="#cc2200" stroke-width="0.9" stroke-dasharray="4,2"/>
    <line x1="208" y1="268" x2="208" y2="295" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="199" y1="295" x2="217" y2="295" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="202" y1="301" x2="214" y2="301" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="205" y1="307" x2="211" y2="307" stroke="#1a1a2e" stroke-width="1"/>
    <rect x="290" y="115" width="60" height="80" rx="4" fill="#fff8ee" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="320" y="150" text-anchor="middle" font-size="8" font-weight="bold" fill="#1a1a2e">Q1 N-Ch</text>
    <text x="320" y="162" text-anchor="middle" font-size="7" fill="#555">IRFZ44N</text>
    <text x="325" y="120" font-size="7.5" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="270" y="168" font-size="7.5" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="325" y="200" font-size="7.5" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="285" y1="185" x2="290" y2="155" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="320" y1="115" x2="320" y2="45" stroke="#cc2200" stroke-width="1.8"/>
    <line x1="320" y1="195" x2="320" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    <circle cx="320" cy="228" r="3.5" fill="#1a1a2e"/>
    <rect x="290" y="262" width="60" height="80" rx="4" fill="#fff8ee" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="320" y="298" text-anchor="middle" font-size="8" font-weight="bold" fill="#1a1a2e">Q2 N-Ch</text>
    <text x="320" y="310" text-anchor="middle" font-size="7" fill="#555">IRFZ44N</text>
    <text x="325" y="268" font-size="7.5" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="270" y="288" font-size="7.5" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="325" y="346" font-size="7.5" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="285" y1="255" x2="290" y2="295" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="320" y1="262" x2="320" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="320" y1="342" x2="320" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="320" y1="228" x2="400" y2="228" stroke="#1a1a2e" stroke-width="2.5"/>
    <circle cx="400" cy="228" r="3.5" fill="#1a1a2e"/>
    <line x1="400" y1="228" x2="420" y2="228" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M 420,228 Q 427,214 434,228 Q 441,242 448,228 Q 455,214 462,228 Q 469,242 476,228" fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="476" y1="228" x2="500" y2="228" stroke="#1a1a2e" stroke-width="2"/>
    <text x="448" y="209" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="448" y="248" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    <circle cx="500" cy="228" r="3.5" fill="#1a1a2e"/>
    <line x1="500" y1="228" x2="500" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="491" y1="255" x2="509" y2="255" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="491" y1="262" x2="509" y2="262" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="500" y1="262" x2="500" y2="290" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="491" y1="290" x2="509" y2="290" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="494" y1="296" x2="506" y2="296" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="497" y1="302" x2="503" y2="302" stroke="#1a1a2e" stroke-width="1"/>
    <text x="512" y="257" font-size="9.5" fill="#0033cc" font-weight="bold">C</text>
    <text x="512" y="268" font-size="8.5" fill="#333">${cUF} uF</text>
    <line x1="500" y1="228" x2="560" y2="228" stroke="#1a1a2e" stroke-width="2.2"/>
    <rect x="560" y="212" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="578,212 578,244 608,258 608,198" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="592" y="272" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="592" y="284" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="592" y1="258" x2="592" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>
  </svg>`;
}

export async function svgToDataURL(svgString: string, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = w * 2; canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject('canvas error'); return; }
    ctx.scale(2, 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => { ctx.drawImage(img, 0, 0, w, h); URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/png', 1.0)); };
    img.onerror = () => { URL.revokeObjectURL(url); reject('SVG render error'); };
    img.src = url;
  });
}