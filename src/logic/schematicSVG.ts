// ============================================================
//  schematicSVG.ts — 7 schémas distincts selon CI sélectionné
// ============================================================

// ── Helpers ──────────────────────────────────────────────────
function rH(x: number, y: number, w: number, lbl: string, val: string): string {
  const rw = w * .55, rx = x + (w - rw) / 2;
  return `<line x1="${x}" y1="${y}" x2="${rx}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="${rx}" y="${y - 5.5}" width="${rw}" height="11" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${rx + rw}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="${x + w / 2}" y="${y - 9}" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">${lbl}</text>
    <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="8" fill="#333">${val}</text>`;
}
function rV(x: number, y: number, h: number, lbl: string, val: string): string {
  const rh = h * .55, ry = y + (h - rh) / 2;
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${ry}" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="${x - 5.5}" y="${ry}" width="11" height="${rh}" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x}" y1="${ry + rh}" x2="${x}" y2="${y + h}" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="${x + 12}" y="${y + h / 2 + 3}" font-size="9" fill="#0033cc" font-weight="bold">${lbl}</text>
    <text x="${x + 12}" y="${y + h / 2 + 13}" font-size="8" fill="#333">${val}</text>`;
}
function cH(x: number, y: number, lbl: string, val: string): string {
  return `<line x1="${x}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x + 14}" y1="${y - 8}" x2="${x + 14}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${x + 19}" y1="${y - 8}" x2="${x + 19}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${x + 19}" y1="${y}" x2="${x + 33}" y2="${y}" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="${x + 16}" y="${y - 11}" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">${lbl}</text>
    <text x="${x + 16}" y="${y + 20}" text-anchor="middle" font-size="8" fill="#333">${val}</text>`;
}
function cV(x: number, y: number, lbl: string, val: string): string {
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 14}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x - 8}" y1="${y + 14}" x2="${x + 8}" y2="${y + 14}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${x - 8}" y1="${y + 19}" x2="${x + 8}" y2="${y + 19}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${x}" y1="${y + 19}" x2="${x}" y2="${y + 33}" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="${x + 12}" y="${y + 16}" font-size="9" fill="#0033cc" font-weight="bold">${lbl}</text>
    <text x="${x + 12}" y="${y + 26}" font-size="8" fill="#333">${val}</text>`;
}
function gnd(x: number, y: number): string {
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x - 12}" y1="${y + 8}" x2="${x + 12}" y2="${y + 8}" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="${x - 8}" y1="${y + 13}" x2="${x + 8}" y2="${y + 13}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${x - 4}" y1="${y + 18}" x2="${x + 4}" y2="${y + 18}" stroke="#1a1a2e" stroke-width="1.2"/>`;
}
function dot(x: number, y: number): string { return `<circle cx="${x}" cy="${y}" r="3.5" fill="#1a1a2e"/>`; }
function pin(x: number, y: number, num: string, side: 'L' | 'R' = 'L'): string {
  const tx = side === 'L' ? x + 4 : x - 4, anchor = side === 'L' ? 'start' : 'end';
  return `<text x="${tx}" y="${y + 4}" font-size="7.5" fill="#cc0000" font-weight="bold" text-anchor="${anchor}">${num}</text>`;
}
function decoupling(x: number, y: number, rail: 'top' | 'bot'): string {
  if (rail === 'top') return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 25}" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(x - 7, y + 25, '', '100uF')}<line x1="${x}" y1="${y + 58}" x2="${x}" y2="${y + 75}" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(x - 7, y + 75, '', '100nF')}<line x1="${x}" y1="${y + 108}" x2="${x}" y2="${y + 120}" stroke="#1a1a2e" stroke-width="1.2"/>${gnd(x, y + 120)}`;
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 25}" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(x - 7, y - 58, '', '100uF')}<line x1="${x}" y1="${y - 58}" x2="${x}" y2="${y - 75}" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(x - 7, y - 92, '', '100nF')}<line x1="${x}" y1="${y - 92}" x2="${x}" y2="${y - 105}" stroke="#1a1a2e" stroke-width="1.2"/>${gnd(x, y - 120)}`;
}
function hp(x: number, y: number, rl: number): string {
  return `<rect x="${x}" y="${y - 16}" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="${x + 18},${y - 16} ${x + 18},${y + 16} ${x + 45},${y + 28} ${x + 45},${y - 28}" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="${x + 30}" y="${y + 42}" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="${x + 30}" y="${y + 54}" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>`;
}
function rails(vcc: number, title: string): string {
  return `<line x1="10" y1="38" x2="750" y2="38" stroke="#cc2200" stroke-width="1.3" stroke-dasharray="8,3"/>
    <text x="14" y="35" font-size="9.5" fill="#cc2200" font-weight="bold">+VCC (+${vcc}V)</text>
    <line x1="10" y1="362" x2="750" y2="362" stroke="#0033cc" stroke-width="1.3" stroke-dasharray="8,3"/>
    <text x="14" y="372" font-size="9.5" fill="#0033cc" font-weight="bold">-VCC (-${vcc}V)</text>
    <text x="380" y="18" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">${title}</text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>`;
}
function svgWrap(content: string): string {
  return `<svg width="760" height="400" viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="760" height="400" fill="white"/>
    ${content}</svg>`;
}

// ============================================================
//  AB — TEMPLATE 1 : 5 broches (TDA2030A / TDA2050 / TDA2052)
// ============================================================
function schAB_Simple(vcc: number, rl: number, icName: string): string {
  const gain = 10; const rfb2 = 47000; const rfb1 = rfb2 / gain;
  return svgWrap(`
    ${rails(vcc, `Schema ${icName} — Pentawatt 5 broches — +/-${vcc}V / ${rl}Ohm — Gain ${gain}x`)}
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">Brochage Pentawatt : 1=IN+ · 2=IN- · 3=VS- · 4=OUT · 5=VS+</text>

    <!-- Audio IN -->
    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="82" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cH(82, 197, 'C1', '1 uF')}
    ${rH(115, 197, 40, 'Rin', '47 kOhm')}
    <line x1="155" y1="197" x2="175" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- IC block — 5 broches Pentawatt -->
    <rect x="175" y="130" width="130" height="140" rx="6" fill="#f0f4ff" stroke="#1a1a2e" stroke-width="2.5"/>
    <text x="240" y="158" text-anchor="middle" font-size="12" font-weight="bold" fill="#1a1a2e">${icName}</text>
    <text x="240" y="173" text-anchor="middle" font-size="8.5" fill="#555">Ampli Audio</text>
    <text x="240" y="186" text-anchor="middle" font-size="8" fill="#777">Pentawatt — 5 broches</text>

    <!-- Pin 1 (IN+) -->
    <line x1="155" y1="197" x2="175" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="178" y="201" font-size="8" fill="#cc0000" font-weight="bold">1</text>
    <text x="178" y="212" font-size="7" fill="#555">(IN+)</text>

    <!-- Pin 2 (IN-) -->
    <line x1="175" y1="230" x2="148" y2="230" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="178" y="234" font-size="8" fill="#cc0000" font-weight="bold">2</text>
    <text x="178" y="245" font-size="7" fill="#555">(IN-)</text>

    <!-- Pin 5 (VS+) -->
    <line x1="240" y1="130" x2="240" y2="38" stroke="#cc2200" stroke-width="1.8"/>
    <text x="244" y="125" font-size="8" fill="#cc0000" font-weight="bold">5(VS+)</text>

    <!-- Pin 3 (VS-) -->
    <line x1="240" y1="270" x2="240" y2="362" stroke="#0033cc" stroke-width="1.8"/>
    <text x="244" y="285" font-size="8" fill="#0033cc" font-weight="bold">3(VS-)</text>

    <!-- Pin 4 (OUT) -->
    <line x1="305" y1="197" x2="380" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="295" y="201" font-size="8" fill="#cc0000" font-weight="bold">4</text>
    <text x="292" y="212" font-size="7" fill="#555">(OUT)</text>
    ${dot(380, 197)}

    <!-- Réseau feedback : OUT → Rfb1 → IN-(2) -->
    <line x1="380" y1="197" x2="380" y2="230" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>
    ${rH(272, 230, 55, 'Rfb1', `${(rfb1 / 1000).toFixed(1)} kOhm`)}
    <line x1="327" y1="230" x2="380" y2="230" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>
    ${dot(272, 230)}
    <line x1="148" y1="230" x2="175" y2="230" stroke="#1a1a2e" stroke-width="1.8"/>
    ${dot(148, 230)}

    <!-- Rfb2 : IN-(2) → GND -->
    <line x1="148" y1="230" x2="148" y2="278" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(148, 278, 35, 'Rfb2', `${(rfb2 / 1000).toFixed(0)} kOhm`)}
    ${gnd(148, 313)}

    <!-- Cs bootstrap (IN+ → IN-) -->
    ${cH(155, 260, 'Cs', '10uF')}
    <line x1="155" y1="260" x2="148" y2="260" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>
    <line x1="188" y1="260" x2="197" y2="260" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>
    <line x1="197" y1="260" x2="197" y2="197" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>

    <!-- Zobel + HP -->
    ${rH(380, 197, 30, 'Rz', `${rl} Ohm`)}
    ${dot(380, 197)}
    <line x1="380" y1="197" x2="380" y2="160" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(373, 137, 'Cz', '100nF')}
    ${gnd(380, 137)}
    <line x1="410" y1="197" x2="440" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(440, 197, rl)}
    <line x1="485" y1="225" x2="485" y2="290" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gnd(485, 290)}

    <!-- Découpages alim -->
    ${decoupling(660, 38, 'top')}
    ${decoupling(700, 362, 'bot')}

    <!-- Note gain -->
    <text x="380" y="348" text-anchor="middle" font-size="9" fill="#555">
      Gain = 1 + Rfb2/Rfb1 = 1 + ${rfb2 / 1000}k/${(rfb1 / 1000).toFixed(1)}k = ${gain}x (${(20 * Math.log10(gain)).toFixed(0)} dB)
    </text>
  `);
}

// ============================================================
//  AB — TEMPLATE 2 : Overture TI (LM3886/LM3875/LM3876/LM1875)
// ============================================================
function schAB_Overture(vcc: number, rl: number, icName: string): string {
  const rfb1 = 1000, rfb2 = 22000, gain = (1 + rfb2 / rfb1).toFixed(0);
  const pins = icName.startsWith('LM1875')
    ? '1=IN+ · 2=IN- · 3=VS- · 4=OUT · 5=VS+'
    : '1=IN+ · 3=GND · 4=-VS · 5=OUT · 6,7=+VS · 8=MUTE · 11=IN-';
  const nPins = icName.startsWith('LM1875') ? '5' : '11';
  return svgWrap(`
    ${rails(vcc, `Schema ${icName} — Overture TI — ${nPins} broches — +/-${vcc}V / ${rl}Ohm — Gain ${gain}x`)}
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">Brochage : ${pins}</text>

    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="75" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cH(75, 197, 'C1', '1 uF')}
    ${rH(108, 197, 38, 'Rin', '22 kOhm')}
    <line x1="146" y1="197" x2="162" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- IC block — 11 broches DIP -->
    <rect x="162" y="118" width="130" height="164" rx="6" fill="#f0f4ff" stroke="#1a1a2e" stroke-width="2.5"/>
    <text x="227" y="145" text-anchor="middle" font-size="12" font-weight="bold" fill="#1a1a2e">${icName}</text>
    <text x="227" y="160" text-anchor="middle" font-size="8.5" fill="#555">Overture™ Series</text>
    <text x="227" y="172" text-anchor="middle" font-size="7.5" fill="#777">${nPins} broches — SPiKe™ Protection</text>

    <!-- Broches gauche -->
    <line x1="162" y1="197" x2="146" y2="197" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="165" y="201" font-size="8" fill="#cc0000" font-weight="bold">1(IN+)</text>

    ${!icName.startsWith('LM1875') ? `
    <line x1="162" y1="228" x2="138" y2="228" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="165" y="232" font-size="8" fill="#cc0000" font-weight="bold">11(IN-)</text>
    <line x1="162" y1="248" x2="148" y2="248" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="165" y="252" font-size="8" fill="#cc0000" font-weight="bold">3(GND)</text>
    ${dot(148, 248)}<line x1="148" y1="248" x2="148" y2="282" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gnd(148, 282)}
    `: `
    <line x1="162" y1="228" x2="138" y2="228" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="165" y="232" font-size="8" fill="#cc0000" font-weight="bold">2(IN-)</text>
    `}

    <!-- MUTE pin (LM3886 seulement) -->
    ${!icName.startsWith('LM1875') ? `
    <line x1="227" y1="118" x2="227" y2="95" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="231" y="113" font-size="8" fill="#cc0000" font-weight="bold">8(MUTE)</text>
    ${rH(190, 95, 35, 'Rm', '10 kOhm')}
    <line x1="190" y1="95" x2="180" y2="95" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="180" y1="95" x2="180" y2="38" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="4,2"/>
    `: ''}

    <!-- VS+ -->
    <line x1="227" y1="118" x2="227" y2="38" stroke="#cc2200" stroke-width="1.8"/>
    <text x="231" y="${!icName.startsWith('LM1875') ? '80' : '80'}" font-size="8" fill="#cc2200" font-weight="bold">${!icName.startsWith('LM1875') ? '6,7(+VS)' : '5(VS+)'}</text>

    <!-- VS- -->
    <line x1="227" y1="282" x2="227" y2="362" stroke="#0033cc" stroke-width="1.8"/>
    <text x="231" y="296" font-size="8" fill="#0033cc" font-weight="bold">${!icName.startsWith('LM1875') ? '4(-VS)' : '3(VS-)'}</text>

    <!-- OUT -->
    <line x1="292" y1="200" x2="360" y2="200" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="280" y="204" font-size="8" fill="#cc0000" font-weight="bold">${!icName.startsWith('LM1875') ? '5(OUT)' : '4(OUT)'}</text>
    ${dot(360, 200)}

    <!-- Feedback -->
    ${rH(235, 238, 55, 'Rfb1', '1 kOhm')}
    <line x1="235" y1="238" x2="220" y2="238" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="220" y1="238" x2="220" y2="${!icName.startsWith('LM1875') ? '228' : '228'}" stroke="#1a1a2e" stroke-width="1.5"/>
    ${dot(220, 228)}
    <line x1="220" y1="228" x2="138" y2="228" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="290" y1="238" x2="360" y2="238" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>
    <line x1="360" y1="200" x2="360" y2="238" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>
    ${dot(138, 228)}<line x1="138" y1="228" x2="138" y2="270" stroke="#1a1a2e" stroke-width="1.5"/>
    ${rV(138, 270, 35, 'Rfb2', '22 kOhm')}
    ${gnd(138, 305)}

    <!-- Zobel + HP -->
    ${rH(360, 200, 28, 'Rs', '0.22 Ohm')}
    <line x1="388" y1="200" x2="430" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>
    ${dot(430, 200)}
    <line x1="430" y1="200" x2="430" y2="165" stroke="#1a1a2e" stroke-width="1.2"/>
    ${rV(430, 135, 30, 'Rz', `${rl} Ohm`)}
    ${cV(423, 108, 'Cz', '100nF')}
    ${gnd(430, 108)}
    <line x1="430" y1="200" x2="468" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(468, 200, rl)}
    <line x1="513" y1="228" x2="513" y2="300" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gnd(513, 300)}

    ${decoupling(660, 38, 'top')}
    ${decoupling(700, 362, 'bot')}

    <text x="380" y="348" text-anchor="middle" font-size="9" fill="#555">
      Gain = 1 + Rfb2/Rfb1 = 1 + 22k/1k = ${gain}x (${(20 * Math.log10(parseFloat(gain))).toFixed(0)} dB)
    </text>
  `);
}

// ============================================================
//  AB — TEMPLATE 3 : ST DMOS (TDA7294 / TDA7293 / TDA7295)
// ============================================================
function schAB_ST(vcc: number, rl: number, icName: string): string {
  const rfb1 = 680, rfb2 = 22000, gain = (1 + rfb2 / rfb1).toFixed(0);
  return svgWrap(`
    ${rails(vcc, `Schema ${icName} — Multiwatt15 — 15 broches — +/-${vcc}V / ${rl}Ohm — Gain ${gain}x`)}
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">1=IN+ · 2=IN- · 3=SGND · 4=BOOTSTRAP · 5=PGND · 6-8=-Vs · 9=STANDBY · 10=MUTE · 11=OUT · 13-15=+Vs</text>

    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="75" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cH(75, 197, 'C1', '1 uF')}
    ${rH(108, 197, 38, 'Rin', '22 kOhm')}
    <line x1="146" y1="197" x2="160" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- IC block — 15 broches Multiwatt15 -->
    <rect x="160" y="100" width="140" height="200" rx="6" fill="#fff0f0" stroke="#1a1a2e" stroke-width="2.5"/>
    <text x="230" y="125" text-anchor="middle" font-size="12" font-weight="bold" fill="#1a1a2e">${icName}</text>
    <text x="230" y="141" text-anchor="middle" font-size="8.5" fill="#555">DMOS — Multiwatt15</text>
    <text x="230" y="155" text-anchor="middle" font-size="8" fill="#777">Mute + Standby + Bootstrap</text>

    <!-- Broches gauche -->
    <line x1="160" y1="197" x2="146" y2="197" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="163" y="201" font-size="8" fill="#cc0000" font-weight="bold">1(IN+)</text>
    <line x1="160" y1="220" x2="135" y2="220" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="163" y="224" font-size="8" fill="#cc0000" font-weight="bold">2(IN-)</text>
    <line x1="160" y1="240" x2="148" y2="240" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="163" y="244" font-size="8" fill="#cc0000" font-weight="bold">3(SGND)</text>
    ${dot(148, 240)}<line x1="148" y1="240" x2="148" y2="268" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gnd(148, 268)}
    <line x1="160" y1="262" x2="148" y2="262" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="163" y="266" font-size="8" fill="#cc0000" font-weight="bold">5(PGND)</text>
    ${dot(148, 262)}<line x1="148" y1="262" x2="148" y2="268" stroke="#1a1a2e" stroke-width="1"/>

    <!-- STANDBY pin 9 -->
    <line x1="230" y1="100" x2="230" y2="72" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="208" y="96" font-size="8" fill="#cc0000" font-weight="bold">9(STBY)</text>
    ${rH(200, 72, 35, 'R_stby', '47 kOhm')}
    <line x1="200" y1="72" x2="185" y2="72" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="185" y1="72" x2="185" y2="38" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="4,2"/>

    <!-- MUTE pin 10 -->
    <line x1="255" y1="100" x2="255" y2="72" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="258" y="96" font-size="8" fill="#cc0000" font-weight="bold">10(MUTE)</text>
    ${rH(255, 72, 35, 'R_mute', '47 kOhm')}
    <line x1="290" y1="72" x2="298" y2="72" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gnd(298, 72)}

    <!-- BOOTSTRAP pin 4 -->
    <line x1="160" y1="170" x2="130" y2="170" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="174" font-size="8" fill="#cc0000" font-weight="bold">4(BOOT)</text>
    ${cH(88, 170, 'Cbt', '22uF')}
    <line x1="88" y1="170" x2="78" y2="170" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="78" y1="170" x2="78" y2="220" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>

    <!-- VS+ (pins 13,14,15) -->
    <line x1="230" y1="100" x2="230" y2="38" stroke="#cc2200" stroke-width="1.8"/>
    <text x="258" y="115" font-size="8" fill="#cc2200" font-weight="bold">13,14,15(+Vs)</text>

    <!-- VS- (pins 6,7,8) -->
    <line x1="230" y1="300" x2="230" y2="362" stroke="#0033cc" stroke-width="1.8"/>
    <text x="233" y="320" font-size="8" fill="#0033cc" font-weight="bold">6,7,8(-Vs)</text>

    <!-- OUT pin 11 -->
    <line x1="300" y1="210" x2="360" y2="210" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="288" y="214" font-size="8" fill="#cc0000" font-weight="bold">11(OUT)</text>
    ${dot(360, 210)}
    <!-- Bootstrap feedback to OUT -->
    <line x1="78" y1="220" x2="360" y2="220" stroke="#1a1a2e" stroke-width="1" stroke-dasharray="3,2"/>

    <!-- Feedback réseau -->
    <line x1="360" y1="210" x2="360" y2="248" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>
    ${rH(225, 248, 55, 'Rfb1', `${(rfb1 / 1000).toFixed(2)}kOhm`)}
    <line x1="225" y1="248" x2="210" y2="248" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="210" y1="248" x2="210" y2="220" stroke="#1a1a2e" stroke-width="1.5"/>
    ${dot(210, 220)}
    <line x1="210" y1="220" x2="135" y2="220" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="280" y1="248" x2="360" y2="248" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="5,2"/>
    ${dot(135, 220)}<line x1="135" y1="220" x2="135" y2="276" stroke="#1a1a2e" stroke-width="1.5"/>
    ${rV(135, 276, 35, 'Rfb2', '22 kOhm')}
    ${gnd(135, 311)}

    <!-- Output + HP -->
    ${rH(360, 210, 28, 'Rs', '0.22Ohm')}
    <line x1="388" y1="210" x2="430" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    ${dot(430, 210)}
    <line x1="430" y1="210" x2="430" y2="175" stroke="#1a1a2e" stroke-width="1.2"/>
    ${rV(430, 145, 30, 'Rz', `${rl}Ohm`)}
    ${cV(423, 118, 'Cz', '100nF')}
    ${gnd(430, 118)}
    <line x1="430" y1="210" x2="468" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(468, 210, rl)}
    <line x1="513" y1="238" x2="513" y2="305" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gnd(513, 305)}

    ${decoupling(660, 38, 'top')}
    ${decoupling(700, 362, 'bot')}

    <text x="380" y="348" text-anchor="middle" font-size="9" fill="#555">
      Gain = 1+${rfb2 / 1000}k/${rfb1}Ohm = ${gain}x — Mute actif-bas (pin10) — Standby actif-haut (pin9)
    </text>
  `);
}

// ============================================================
//  AB — TEMPLATE 4 : Module (STK4048XI / LM4780)
// ============================================================
function schAB_Module(vcc: number, rl: number, icName: string): string {
  const isLM4780 = icName.includes('4780');
  return svgWrap(`
    ${rails(vcc, `Schema ${icName} — Module ${isLM4780 ? 'DIP-28' : 'SIP'} — +/-${vcc}V / ${rl}Ohm`)}
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">${isLM4780 ? 'LM4780 : 2 amplis 60W intégrés — mono bridge ou stereo' : 'STK4048XI : Module hybride Sanyo — alimentation ±32V'}</text>

    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="75" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cH(75, 197, 'C1', '1 uF')}
    ${rH(108, 197, 35, 'Rin', '22 kOhm')}
    <line x1="143" y1="197" x2="160" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Module block — gros bloc avec nombreuses broches -->
    <rect x="160" y="90" width="180" height="220" rx="6" fill="#fff8e8" stroke="#1a1a2e" stroke-width="2.5"/>
    <rect x="160" y="90" width="180" height="30" rx="6" fill="#e8c060" stroke="#1a1a2e" stroke-width="2.5"/>
    <text x="250" y="111" text-anchor="middle" font-size="11" font-weight="bold" fill="#1a1a2e">${icName}</text>
    <text x="250" y="138" text-anchor="middle" font-size="9" fill="#555">Module ${isLM4780 ? 'Hybride Dual' : 'Hybride'}</text>
    <text x="250" y="152" text-anchor="middle" font-size="8" fill="#777">${isLM4780 ? '2x 60W → Bridge 120W' : '150W @ ±32V'}</text>
    <text x="250" y="166" text-anchor="middle" font-size="8" fill="#aa6600">Protection intégrée</text>

    <!-- Broches module (représentation schématique) -->
    <!-- Gauche : entrées -->
    ${[['IN+', '197'], ['IN-', '220'], ['FB-', '243'], ['GND', '266']].map(([lbl, y], i) => `
      <line x1="160" y1="${y}" x2="135" y2="${y}" stroke="#1a1a2e" stroke-width="1.5"/>
      <text x="163" y="${parseInt(y) + 4}" font-size="8" fill="#cc0000" font-weight="bold">${lbl}</text>
    `).join('')}

    <!-- Droite : sorties et alim -->
    ${[['OUT', '200'], ['+VS', '160'], ['-VS', '290']].map(([lbl, y]) => `
      <line x1="340" y1="${y}" x2="365" y2="${y}" stroke="#1a1a2e" stroke-width="1.5"/>
      <text x="342" y="${parseInt(y) + 4}" font-size="8" fill="${lbl.includes('VS') ? lbl.includes('+') ? "#cc2200" : "#0033cc" : "#cc0000"}" font-weight="bold">${lbl}</text>
    `).join('')}

    <!-- Connexions alim -->
    <line x1="365" y1="160" x2="390" y2="160" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="390" y1="160" x2="390" y2="38" stroke="#cc2200" stroke-width="1.8"/>
    <line x1="365" y1="290" x2="390" y2="290" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="390" y1="290" x2="390" y2="362" stroke="#0033cc" stroke-width="1.8"/>

    <!-- Feedback -->
    ${dot(135, 220)}
    <line x1="135" y1="220" x2="135" y2="270" stroke="#1a1a2e" stroke-width="1.5"/>
    ${rV(135, 270, 35, 'Rfb2', '22 kOhm')}
    ${gnd(135, 305)}
    <line x1="135" y1="243" x2="115" y2="243" stroke="#1a1a2e" stroke-width="1.5"/>
    ${dot(135, 243)}
    <line x1="115" y1="243" x2="115" y2="305" stroke="#1a1a2e" stroke-width="1.5"/>
    ${rH(115, 305, 40, 'Rfb1', '1 kOhm')}

    <!-- OUT → HP -->
    <line x1="365" y1="200" x2="430" y2="200" stroke="#1a1a2e" stroke-width="2.2"/>
    ${dot(430, 200)}
    <line x1="430" y1="200" x2="430" y2="168" stroke="#1a1a2e" stroke-width="1.2"/>
    ${rV(430, 138, 30, 'Rz', `${rl}Ohm`)}
    ${cV(423, 110, 'Cz', '100nF')}
    ${gnd(430, 110)}
    <line x1="430" y1="200" x2="470" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(470, 200, rl)}
    <line x1="515" y1="228" x2="515" y2="305" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gnd(515, 305)}

    ${decoupling(660, 38, 'top')}
    ${decoupling(700, 362, 'bot')}
  `);
}

// ============================================================
//  D — TEMPLATE 1 : CI Intégré — ZÉRO MOSFET EXTERNE
//  (TPA3116D2 / TPA3255 / MA12070 / TDA8954TH)
// ============================================================
function schD_Integrated(vcc: number, rl: number, lUH: number, cUF: number, icName: string): string {
  const isHighPow = icName.includes('3255') || icName.includes('TDA8954');
  return svgWrap(`
    <line x1="10" y1="38" x2="750" y2="38" stroke="#cc2200" stroke-width="1.3" stroke-dasharray="8,3"/>
    <text x="14" y="35" font-size="9.5" fill="#cc2200" font-weight="bold">PVCC +${vcc}V (Puissance)</text>
    <line x1="10" y1="362" x2="750" y2="362" stroke="#333" stroke-width="1.2" stroke-dasharray="6,3"/>
    <text x="14" y="372" font-size="9.5" fill="#333" font-weight="bold">GND</text>
    <text x="380" y="18" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema ${icName} — CI Intégré — ${vcc}V / ${rl}Ohm — MOSFET internes (pas d'externe)
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">PVCC=Alim puissance · VCC=Alim logique (5V) · GAIN=réglage gain · SD=Shutdown</text>

    <!-- Note importante -->
    <rect x="500" y="45" width="240" height="32" rx="4" fill="#e8fff0" stroke="#00cc66" stroke-width="1.2"/>
    <text x="620" y="59" text-anchor="middle" font-size="9" fill="#006633" font-weight="bold">✓ CI Intégré — H-Bridge interne</text>
    <text x="620" y="72" text-anchor="middle" font-size="8.5" fill="#006633">Aucun MOSFET externe requis</text>

    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="75" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cH(75, 197, 'Cin', '100nF')}
    ${rH(108, 197, 38, 'Rin', '10 kOhm')}
    ${dot(146, 197)}
    <line x1="146" y1="197" x2="146" y2="230" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(139, 230, 'Cf', '100nF')}
    ${gnd(146, 263)}
    <line x1="146" y1="197" x2="165" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- IC block — GRAND bloc intégré -->
    <rect x="165" y="85" width="200" height="230" rx="8" fill="#eef8ff" stroke="#0066cc" stroke-width="3"/>
    <rect x="165" y="85" width="200" height="35" rx="8" fill="#0066cc" stroke="#0066cc" stroke-width="0"/>
    <text x="265" y="106" text-anchor="middle" font-size="13" font-weight="bold" fill="white">${icName}</text>
    <text x="265" y="136" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">CI Intégré — H-Bridge interne</text>
    <text x="265" y="150" text-anchor="middle" font-size="8.5" fill="#333">MOSFETs intégrés dans le boitier</text>
    <text x="265" y="164" text-anchor="middle" font-size="8" fill="#555">${isHighPow ? 'Pout max ~' + icName.includes('3255') ? '315W' : '210W' : 'Pout max ~50W'}</text>

    <!-- Broches gauche (entrées) -->
    <line x1="165" y1="197" x2="146" y2="197" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="168" y="201" font-size="8" fill="#cc0000" font-weight="bold">IN+(+)</text>
    <line x1="165" y1="218" x2="148" y2="218" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="168" y="222" font-size="8" fill="#cc0000" font-weight="bold">IN-(−)</text>
    <line x1="165" y1="242" x2="148" y2="242" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="168" y="246" font-size="8" fill="#cc0000" font-weight="bold">GAIN0</text>
    <line x1="165" y1="260" x2="148" y2="260" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="168" y="264" font-size="8" fill="#cc0000" font-weight="bold">GAIN1</text>
    <line x1="165" y1="280" x2="148" y2="280" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="168" y="284" font-size="8" fill="#cc0000" font-weight="bold">SD(EN)</text>

    <!-- GAIN pins config -->
    ${dot(148, 242)}<line x1="148" y1="242" x2="132" y2="242" stroke="#1a1a2e" stroke-width="1.2"/>
    ${gnd(132, 242)}
    ${dot(148, 260)}<line x1="148" y1="260" x2="132" y2="260" stroke="#1a1a2e" stroke-width="1.2"/>
    ${gnd(132, 260)}
    <!-- SD : pull-up vers VCC -->
    ${dot(148, 280)}<line x1="148" y1="280" x2="132" y2="280" stroke="#1a1a2e" stroke-width="1.2"/>
    ${rV(132, 245, 28, 'R_sd', '100kOhm')}

    <!-- Broches droite (sorties) -->
    <line x1="365" y1="188" x2="390" y2="188" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="345" y="192" font-size="8" fill="#cc0000" font-weight="bold">OUTP</text>
    <line x1="365" y1="210" x2="380" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="345" y="214" font-size="8" fill="#cc0000" font-weight="bold">OUTN</text>

    <!-- PVCC en haut -->
    <line x1="265" y1="85" x2="265" y2="38" stroke="#cc2200" stroke-width="2"/>
    <text x="268" y="72" font-size="8" fill="#cc2200" font-weight="bold">PVCC(+${vcc}V)</text>

    <!-- VCC logique -->
    <line x1="305" y1="85" x2="305" y2="62" stroke="#1a1a2e" stroke-width="1.5"/>
    ${cV(298, 62, 'Cvcc', '100uF')}
    <line x1="305" y1="95" x2="320" y2="95" stroke="#1a1a2e" stroke-width="1.2"/>
    ${rH(320, 95, 35, 'Rvcc', '10Ohm')}
    <text x="312" y="82" font-size="7.5" fill="#555">VCC(5V)</text>
    <line x1="355" y1="95" x2="365" y2="95" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="365" y1="95" x2="365" y2="38" stroke="#cc2200" stroke-width="1" stroke-dasharray="4,2"/>

    <!-- GND bas -->
    <line x1="265" y1="315" x2="265" y2="362" stroke="#333" stroke-width="1.8"/>
    <text x="268" y="335" font-size="8" fill="#333" font-weight="bold">GND</text>

    <!-- Condensateurs de découplage PVCC -->
    ${cV(215, 38, 'Cb1', '100uF')} <text x="235" y="52" font-size="7.5" fill="#555">@PVCC</text>
    ${cV(235, 38, 'Cb2', '100nF')}

    <!-- Filtre LC sortie -->
    <line x1="390" y1="188" x2="410" y2="188" stroke="#1a1a2e" stroke-width="2.2"/>
    <path d="M 410,188 Q 417,174 424,188 Q 431,202 438,188 Q 445,174 452,188 Q 459,202 466,188" fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="466" y1="188" x2="490" y2="188" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="438" y="170" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="438" y="208" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    ${dot(490, 188)}
    <line x1="490" y1="188" x2="490" y2="215" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cV(483, 215, 'C', `${cUF}uF`)}
    ${gnd(490, 248)}

    <!-- OUTN → GND (mode BTL simplifié) -->
    <line x1="380" y1="210" x2="380" y2="248" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gnd(380, 248)}
    <text x="384" y="240" font-size="7.5" fill="#555">GND(BTL)</text>

    <!-- HP -->
    <line x1="490" y1="188" x2="530" y2="188" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(530, 188, rl)}
    <line x1="575" y1="216" x2="575" y2="300" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gnd(575, 300)}

    <!-- Inductance mode commun -->
    ${rH(488, 140, 35, 'Lcm', '22uH')}
    <text x="505" y="128" text-anchor="middle" font-size="7.5" fill="#555">Filtre EMI</text>
  `);
}

// ============================================================
//  D — TEMPLATE 2 : IRS2092S / UCD3138 + MOSFETs EXTERNES
// ============================================================
function schD_HalfBridge(vcc: number, rl: number, lUH: number, cUF: number, icName: string): string {
  const cBulk = Math.ceil((vcc / Math.sqrt(2) / 8) * 150);
  return svgWrap(`
    <line x1="10" y1="38" x2="750" y2="38" stroke="#cc2200" stroke-width="1.3" stroke-dasharray="8,3"/>
    <text x="14" y="35" font-size="9.5" fill="#cc2200" font-weight="bold">VBUS +${vcc}V DC</text>
    <line x1="10" y1="362" x2="750" y2="362" stroke="#333" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="14" y="372" font-size="9.5" fill="#333" font-weight="bold">PGND</text>
    <text x="380" y="18" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema ${icName} — Demi-pont — ${vcc}V / ${rl}Ohm — MOSFETs N-Ch externes obligatoires
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">${icName} : Contrôleur PWM 400kHz — HO/LO = commandes grille haut/bas — HS = source MOSFET haut</text>

    <!-- Note MOSFETs obligatoires -->
    <rect x="500" y="45" width="240" height="32" rx="4" fill="#fff3e8" stroke="#cc6600" stroke-width="1.2"/>
    <text x="620" y="59" text-anchor="middle" font-size="9" fill="#884400" font-weight="bold">⚠ 2 MOSFETs N-Ch externes requis</text>
    <text x="620" y="72" text-anchor="middle" font-size="8.5" fill="#884400">ex: IRFZ44N, STP80NF55, IRFB4227</text>

    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="75" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rH(75, 197, 38, 'Rin', '10 kOhm')}
    ${dot(113, 197)}
    <line x1="113" y1="197" x2="113" y2="225" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(106, 225, 'Cin', '100nF')}
    ${gnd(113, 258)}
    <line x1="113" y1="197" x2="130" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- IRS2092S block -->
    <rect x="130" y="118" width="118" height="178" rx="5" fill="#eef0ff" stroke="#1a1a2e" stroke-width="2.5"/>
    <text x="189" y="141" text-anchor="middle" font-size="11" font-weight="bold" fill="#1a1a2e">${icName}</text>
    <text x="189" y="156" text-anchor="middle" font-size="8.5" fill="#555">Ctrl PWM 400kHz</text>
    <text x="189" y="169" text-anchor="middle" font-size="8" fill="#777">16 broches SOIC</text>

    <!-- Broches gauche -->
    <line x1="130" y1="197" x2="113" y2="197" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="201" font-size="7.5" fill="#cc0000" font-weight="bold">16(IN+)</text>
    <line x1="130" y1="213" x2="113" y2="213" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="217" font-size="7.5" fill="#cc0000" font-weight="bold">2(IN-)</text>
    <line x1="130" y1="228" x2="118" y2="228" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="232" font-size="7.5" fill="#cc0000" font-weight="bold">4(GND)</text>
    ${dot(118, 228)}<line x1="118" y1="228" x2="118" y2="270" stroke="#1a1a2e" stroke-width="1.2"/>${gnd(118, 270)}
    <line x1="130" y1="245" x2="113" y2="245" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="249" font-size="7.5" fill="#cc0000" font-weight="bold">5(CS+)</text>
    <line x1="130" y1="260" x2="113" y2="260" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="264" font-size="7.5" fill="#cc0000" font-weight="bold">6(OC)</text>
    <line x1="130" y1="275" x2="113" y2="275" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="133" y="279" font-size="7.5" fill="#cc0000" font-weight="bold">7(SDN)</text>

    <!-- VCC du CI -->
    <line x1="189" y1="118" x2="189" y2="95" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="193" y="113" font-size="7.5" fill="#cc0000" font-weight="bold">3(VCC=15V)</text>
    ${rH(165, 95, 35, 'Rvcc', '100Ohm')}
    <line x1="165" y1="95" x2="155" y2="95" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="155" y1="95" x2="155" y2="38" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="4,2"/>
    ${cV(195, 95, 'Cvcc', '10uF')}

    <!-- Broches droite : HO, LO, HS, VS, VBOOT, PGND -->
    <line x1="248" y1="180" x2="272" y2="180" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="235" y="184" font-size="7.5" fill="#cc0000" font-weight="bold">12(HO)</text>
    <line x1="248" y1="255" x2="272" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="235" y="259" font-size="7.5" fill="#cc0000" font-weight="bold">9(LO)</text>
    <line x1="248" y1="220" x2="270" y2="220" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="235" y="224" font-size="7.5" fill="#cc0000" font-weight="bold">11(HS)</text>
    <line x1="248" y1="200" x2="268" y2="200" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="235" y="204" font-size="7.5" fill="#cc0000" font-weight="bold">13(VS)</text>
    <line x1="248" y1="165" x2="268" y2="165" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="235" y="169" font-size="7.5" fill="#cc0000" font-weight="bold">14(VBT)</text>
    <line x1="248" y1="270" x2="268" y2="270" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="235" y="274" font-size="7.5" fill="#cc0000" font-weight="bold">10(PGD)</text>
    ${dot(268, 270)}<line x1="268" y1="270" x2="268" y2="290" stroke="#1a1a2e" stroke-width="1.2"/>${gnd(268, 290)}

    <!-- Résistances de grille -->
    ${rH(272, 180, 28, 'Rg1', '22Ohm')}
    ${rH(272, 255, 28, 'Rg2', '22Ohm')}

    <!-- MOSFET Q1 (haut-côté) -->
    <rect x="310" y="108" width="68" height="88" rx="4" fill="#fff8ee" stroke="#cc6600" stroke-width="2"/>
    <text x="344" y="145" text-anchor="middle" font-size="9" font-weight="bold" fill="#1a1a2e">Q1 N-Ch</text>
    <text x="344" y="158" text-anchor="middle" font-size="8" fill="#555">ex: IRFZ44N</text>
    <text x="344" y="170" text-anchor="middle" font-size="7" fill="#777">MOSFET externe</text>
    <text x="316" y="113" font-size="7" fill="#cc0000" font-weight="bold">D(Drain)</text>
    <text x="300" y="162" font-size="7" fill="#cc0000" font-weight="bold">G(Gate)</text>
    <text x="316" y="200" font-size="7" fill="#cc0000" font-weight="bold">S(Source)</text>
    <line x1="300" y1="180" x2="310" y2="152" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="344" y1="108" x2="344" y2="38" stroke="#cc2200" stroke-width="2"/>
    <line x1="344" y1="196" x2="344" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    ${dot(344, 228)}

    <!-- Bootstrap cap -->
    ${cH(268, 165, 'Cbt', '100nF')}
    <line x1="301" y1="165" x2="344" y2="165" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>
    <line x1="344" y1="165" x2="344" y2="108" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>

    <!-- VS (source Q1 = drain Q2 = milieu pont) -->
    <line x1="270" y1="220" x2="344" y2="220" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>

    <!-- MOSFET Q2 (bas-côté) -->
    <rect x="310" y="268" width="68" height="80" rx="4" fill="#fff8ee" stroke="#cc6600" stroke-width="2"/>
    <text x="344" y="305" text-anchor="middle" font-size="9" font-weight="bold" fill="#1a1a2e">Q2 N-Ch</text>
    <text x="344" y="318" text-anchor="middle" font-size="8" fill="#555">ex: IRFZ44N</text>
    <text x="316" y="273" font-size="7" fill="#cc0000" font-weight="bold">D(Drain)</text>
    <text x="300" y="292" font-size="7" fill="#cc0000" font-weight="bold">G(Gate)</text>
    <text x="316" y="355" font-size="7" fill="#cc0000" font-weight="bold">S(Source)</text>
    <line x1="300" y1="255" x2="310" y2="295" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="344" y1="268" x2="344" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="344" y1="348" x2="344" y2="362" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Shunt Rs pour OC -->
    ${rH(92, 245, 28, 'Rs', '10mOhm')}
    <line x1="92" y1="245" x2="80" y2="245" stroke="#1a1a2e" stroke-width="1.2"/>
    ${gnd(80, 245)}

    <!-- Milieu pont → filtre LC -->
    <line x1="344" y1="228" x2="400" y2="228" stroke="#1a1a2e" stroke-width="2.5"/>
    <path d="M 400,228 Q 408,213 416,228 Q 424,243 432,228 Q 440,213 448,228 Q 456,243 464,228" fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="464" y1="228" x2="490" y2="228" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="432" y="208" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="432" y="248" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    ${dot(490, 228)}
    <line x1="490" y1="228" x2="490" y2="258" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cV(483, 258, 'C', `${cUF}uF`)}
    ${gnd(490, 291)}

    <!-- TVS protection -->
    <line x1="395" y1="228" x2="395" y2="280" stroke="#1a1a2e" stroke-width="1.2"/>
    ${rV(395, 280, 25, 'TVS', `${Math.ceil(vcc * 1.3)}V`)}
    ${gnd(395, 305)}

    <!-- Condensateur bus Cbulk -->
    <line x1="344" y1="38" x2="430" y2="38" stroke="#cc2200" stroke-width="1"/>
    ${cV(423, 38, 'Cbulk', `${cBulk}uF/${Math.ceil(vcc * 1.4)}V`)}
    <line x1="430" y1="71" x2="430" y2="362" stroke="#333" stroke-width="1.2"/>

    <!-- HP -->
    <line x1="490" y1="228" x2="540" y2="228" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(540, 228, rl)}
    <line x1="585" y1="256" x2="585" y2="362" stroke="#1a1a2e" stroke-width="1.8"/>
  `);
}

// ============================================================
//  D — TEMPLATE 3 : IR2110 / IRS2110 / SG3525+IRS2110
// ============================================================
function schD_DriverCombo(vcc: number, rl: number, lUH: number, cUF: number, icName: string): string {
  const needsSG = icName.includes('SG3525') || icName.includes('IR2110') || icName.includes('IRS2110');
  return svgWrap(`
    <line x1="10" y1="38" x2="750" y2="38" stroke="#cc2200" stroke-width="1.3" stroke-dasharray="8,3"/>
    <text x="14" y="35" font-size="9.5" fill="#cc2200" font-weight="bold">VBUS +${vcc}V DC</text>
    <line x1="10" y1="362" x2="750" y2="362" stroke="#333" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="14" y="372" font-size="9.5" fill="#333" font-weight="bold">PGND</text>
    <text x="380" y="18" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema ${icName} — ${needsSG ? 'SG3525 (PWM) + ' : ''}Driver + MOSFETs N-Ch externes — ${vcc}V / ${rl}Ohm
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>
    <text x="380" y="390" text-anchor="middle" font-size="8" fill="#888">SG3525=générateur PWM · IR2110=driver grille haut/bas · Q1,Q2=MOSFETs N-Ch externes</text>

    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="190" x2="78" y2="190" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Bloc SG3525 (générateur PWM) -->
    <rect x="78" y="140" width="100" height="120" rx="5" fill="#fef0ff" stroke="#660066" stroke-width="2"/>
    <text x="128" y="162" text-anchor="middle" font-size="9" font-weight="bold" fill="#660066">SG3525</text>
    <text x="128" y="175" text-anchor="middle" font-size="7.5" fill="#555">Generat. PWM</text>
    <text x="128" y="188" text-anchor="middle" font-size="7.5" fill="#777">DIP-16 — 400kHz</text>
    <line x1="78" y1="190" x2="62" y2="190" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="81" y="194" font-size="7.5" fill="#cc0000" font-weight="bold">1(INV)</text>
    <line x1="78" y1="210" x2="62" y2="210" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="81" y="214" font-size="7.5" fill="#cc0000" font-weight="bold">2(N-INV)</text>
    <line x1="128" y1="140" x2="128" y2="110" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="132" y="135" font-size="7.5" fill="#cc0000" font-weight="bold">VCC(15V)</text>
    <line x1="178" y1="190" x2="200" y2="190" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="166" y="194" font-size="7.5" fill="#cc0000" font-weight="bold">11(A)</text>
    <line x1="178" y1="210" x2="200" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="166" y="214" font-size="7.5" fill="#cc0000" font-weight="bold">14(B)</text>
    <!-- Composants fréquence SG3525 -->
    ${rH(85, 240, 30, 'Rt', '10kOhm')}
    <line x1="85" y1="240" x2="78" y2="240" stroke="#1a1a2e" stroke-width="1.2"/>
    ${cV(118, 233, 'Ct', '1nF')}
    <text x="90" y="268" font-size="7" fill="#555">f=1/RtCt</text>

    <!-- Bloc IR2110 (driver) -->
    <rect x="200" y="135" width="105" height="130" rx="5" fill="#fff0e8" stroke="#cc6600" stroke-width="2"/>
    <text x="252" y="158" text-anchor="middle" font-size="10" font-weight="bold" fill="#cc6600">IR2110</text>
    <text x="252" y="171" text-anchor="middle" font-size="8" fill="#555">Driver grille</text>
    <text x="252" y="184" text-anchor="middle" font-size="7.5" fill="#777">DIP-14 — 600V</text>
    <line x1="200" y1="190" x2="178" y2="190" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="203" y="194" font-size="7.5" fill="#cc0000" font-weight="bold">2(HIN)</text>
    <line x1="200" y1="210" x2="178" y2="210" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="203" y="214" font-size="7.5" fill="#cc0000" font-weight="bold">4(LIN)</text>
    <line x1="252" y1="135" x2="252" y2="105" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="256" y="130" font-size="7.5" fill="#cc0000" font-weight="bold">VDD(5V)</text>
    <line x1="305" y1="178" x2="330" y2="178" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="290" y="182" font-size="7.5" fill="#cc0000" font-weight="bold">11(HO)</text>
    <line x1="305" y1="218" x2="330" y2="218" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="290" y="222" font-size="7.5" fill="#cc0000" font-weight="bold">6(LO)</text>
    <line x1="305" y1="198" x2="320" y2="198" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="290" y="202" font-size="7.5" fill="#cc0000" font-weight="bold">12(VS)</text>
    <line x1="305" y1="158" x2="320" y2="158" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="290" y="162" font-size="7.5" fill="#cc0000" font-weight="bold">10(VB)</text>
    <!-- VCC IR2110 *)
    <line x1="252" y1="265" x2="252" y2="285" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="256" y="280" font-size="7.5" fill="#333" font-weight="bold">8(VCC=15V)</text>
    ${cV(235, 265, 'Cvcc', '10uF')}

    <!-- Bootstrap cap -->
    ${cH(320, 158, 'Cbt', '100nF')}
    <line x1="353" y1="158" x2="370" y2="158" stroke="#1a1a2e" stroke-width="1.2" stroke-dasharray="3,2"/>

    <!-- Gate resistors -->
    ${rH(330, 178, 28, 'Rg1', '10Ohm')}
    ${rH(330, 218, 28, 'Rg2', '10Ohm')}

    <!-- Q1 MOSFET haut -->
    <rect x="368" y="105" width="70" height="85" rx="4" fill="#fff8ee" stroke="#cc6600" stroke-width="2"/>
    <text x="403" y="143" text-anchor="middle" font-size="9" font-weight="bold" fill="#1a1a2e">Q1 N-Ch</text>
    <text x="403" y="156" text-anchor="middle" font-size="8" fill="#555">IRFZ44N</text>
    <text x="403" y="168" text-anchor="middle" font-size="7" fill="#777">MOSFET externe</text>
    <text x="374" y="110" font-size="7" fill="#cc0000" font-weight="bold">D</text>
    <text x="358" y="155" font-size="7" fill="#cc0000" font-weight="bold">G</text>
    <text x="374" y="195" font-size="7" fill="#cc0000" font-weight="bold">S</text>
    <line x1="358" y1="178" x2="368" y2="148" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="403" y1="105" x2="403" y2="38" stroke="#cc2200" stroke-width="2"/>
    <line x1="403" y1="190" x2="403" y2="225" stroke="#1a1a2e" stroke-width="1.8"/>
    ${dot(403, 225)}
    <!-- Bootstrap VS=source Q1 -->
    <line x1="320" y1="198" x2="403" y2="198" stroke="#1a1a2e" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="370" y1="158" x2="403" y2="158" stroke="#1a1a2e" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="403" y1="158" x2="403" y2="105" stroke="#1a1a2e" stroke-width="1" stroke-dasharray="3,2"/>

    <!-- Q2 MOSFET bas -->
    <rect x="368" y="258" width="70" height="80" rx="4" fill="#fff8ee" stroke="#cc6600" stroke-width="2"/>
    <text x="403" y="295" text-anchor="middle" font-size="9" font-weight="bold" fill="#1a1a2e">Q2 N-Ch</text>
    <text x="403" y="308" text-anchor="middle" font-size="8" fill="#555">IRFZ44N</text>
    <text x="374" y="263" font-size="7" fill="#cc0000" font-weight="bold">D</text>
    <text x="358" y="285" font-size="7" fill="#cc0000" font-weight="bold">G</text>
    <text x="374" y="343" font-size="7" fill="#cc0000" font-weight="bold">S</text>
    <line x1="358" y1="218" x2="368" y2="288" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="403" y1="258" x2="403" y2="225" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="403" y1="338" x2="403" y2="362" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Milieu pont → filtre -->
    <line x1="403" y1="225" x2="450" y2="225" stroke="#1a1a2e" stroke-width="2.5"/>
    <path d="M 450,225 Q 458,210 466,225 Q 474,240 482,225 Q 490,210 498,225 Q 506,240 514,225" fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="514" y1="225" x2="540" y2="225" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="482" y="205" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="482" y="245" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    ${dot(540, 225)}
    <line x1="540" y1="225" x2="540" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cV(533, 255, 'C', `${cUF}uF`)}
    ${gnd(540, 288)}
    <line x1="540" y1="225" x2="580" y2="225" stroke="#1a1a2e" stroke-width="1.8"/>
    ${hp(580, 225, rl)}
    <line x1="625" y1="253" x2="625" y2="362" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Cbulk -->
    ${cV(680, 38, 'Cbulk', `${Math.ceil((vcc / Math.sqrt(2) / 8) * 150)}uF`)}
    <line x1="687" y1="38" x2="403" y2="38" stroke="#cc2200" stroke-width="1"/>
    <line x1="687" y1="71" x2="687" y2="362" stroke="#333" stroke-width="1.2"/>
  `);
}

// ============================================================
//  HELPERS BJT pour Discret AB
// ============================================================
function npnBJT(cx: number, cy: number, r: number, ref: string, part: string): string {
  const bx = cx - r + 5;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f5f7ff" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy - r * .62}" x2="${bx}" y2="${cy + r * .62}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${bx}" y1="${cy - r * .5}" x2="${cx + r * .9}" y2="${cy - r * .9}" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy + r * .5}" x2="${cx + r * .9}" y2="${cy + r * .9}" stroke="#1a1a2e" stroke-width="2"/>
    <polygon points="${cx + r * .52},${cy + r * .7} ${cx + r * .9},${cy + r * .9} ${cx + r * .7},${cy + r * 1.12}" fill="#1a1a2e"/>
    <text x="${cx + 1}" y="${cy + 4}" text-anchor="middle" font-size="7.5" fill="#333">${part.substring(0, 8)}</text>
    <text x="${cx}" y="${cy - r - 8}" text-anchor="middle" font-size="10" fill="#0033cc" font-weight="bold">${ref}</text>
    <text x="${cx + r + 5}" y="${cy - r * .85}" font-size="8" fill="#cc0000" font-weight="bold">C</text>
    <text x="${cx - r - 18}" y="${cy + 4}" font-size="8" fill="#cc0000" font-weight="bold">B</text>
    <text x="${cx + r + 5}" y="${cy + r * .95 + 5}" font-size="8" fill="#cc0000" font-weight="bold">E</text>`;
}
function pnpBJT(cx: number, cy: number, r: number, ref: string, part: string): string {
  const bx = cx - r + 5;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff5f5" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy - r * .62}" x2="${bx}" y2="${cy + r * .62}" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="${bx}" y1="${cy - r * .5}" x2="${cx + r * .9}" y2="${cy - r * .9}" stroke="#1a1a2e" stroke-width="2"/>
    <line x1="${bx}" y1="${cy + r * .5}" x2="${cx + r * .9}" y2="${cy + r * .9}" stroke="#1a1a2e" stroke-width="2"/>
    <polygon points="${bx + 12},${cy - r * .42} ${bx},${cy - r * .5} ${bx + 7},${cy - r * .68}" fill="#1a1a2e"/>
    <text x="${cx + 1}" y="${cy + 4}" text-anchor="middle" font-size="7.5" fill="#333">${part.substring(0, 8)}</text>
    <text x="${cx}" y="${cy - r - 8}" text-anchor="middle" font-size="10" fill="#cc0033" font-weight="bold">${ref}</text>
    <text x="${cx + r + 5}" y="${cy - r * .85}" font-size="8" fill="#cc0000" font-weight="bold">C</text>
    <text x="${cx - r - 18}" y="${cy + 4}" font-size="8" fill="#cc0000" font-weight="bold">B</text>
    <text x="${cx + r + 5}" y="${cy + r * .95 + 5}" font-size="8" fill="#cc0000" font-weight="bold">E</text>`;
}

// ============================================================
//  SCHÉMA DISCRET AB — complet
// ============================================================
export function buildClassABSchematic(
  vcc: number, rl: number, icName = 'LM3886', selectedIC = 'LM3886'
): string {
  return `<svg width="820" height="480" viewBox="0 0 820 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="820" height="480" fill="white"/>
    <text x="410" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a0a2e">
      Schema Discret Classe AB — ±${vcc}V / ${rl}Ohm — ${pairs} paire${pairs > 1 ? 's' : ''}
    </text>
    <line x1="10" y1="22" x2="810" y2="22" stroke="#bbb" stroke-width="0.8"/>
    <line x1="10" y1="42" x2="810" y2="42" stroke="#cc2200" stroke-width="1.5" stroke-dasharray="8,3"/>
    <text x="14" y="39" font-size="9.5" fill="#cc2200" font-weight="bold">+VCC (+${vcc}V)</text>
    <line x1="10" y1="445" x2="810" y2="445" stroke="#0033cc" stroke-width="1.5" stroke-dasharray="8,3"/>
    <text x="14" y="455" font-size="9.5" fill="#0033cc" font-weight="bold">-VCC (-${vcc}V)</text>
    <text x="14" y="247" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="58" y1="242" x2="80" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    ${cH(80, 242, 'C4', '1uF')}
    ${rH(113, 242, 30, 'R9', '47kOhm')}
    ${dot(143, 242)}
    <line x1="143" y1="242" x2="143" y2="268" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(143, 268, 30, 'R7', '22kOhm')}
    ${gnd(143, 298)}
    <line x1="143" y1="242" x2="168" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    ${pnpBJT(200, 242, 24, 'Q7', drvPNP)}
    <line x1="224" y1="220" x2="224" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="224" y1="264" x2="265" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="224" y1="42" x2="224" y2="148" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(224, 148, 27, 'R6', '18kOhm')}
    ${npnBJT(292, 242, 24, 'Q6', drvNPN)}
    <line x1="224" y1="175" x2="224" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(224, 200, 28, 'R5', '1kOhm')}
    ${gnd(224, 228)}
    <line x1="316" y1="220" x2="316" y2="185" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(316, 155, 30, 'R4', '560Ohm')}
    ${gnd(316, 185)}
    <line x1="380" y1="42" x2="380" y2="68" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(380, 68, 30, 'R1', '2.7kOhm')}
    ${rV(380, 108, 30, 'R2', '2.7kOhm')}
    ${cV(373, 148, 'C1', '47uF')}
    ${dot(380, 108)}
    <line x1="380" y1="168" x2="380" y2="195" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rH(316, 264, 40, 'R3', '22kOhm')}
    <line x1="356" y1="264" x2="365" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="365" y1="264" x2="365" y2="240" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Diodes D2 D3 D4 -->
    ${(() => {
      const d = (x1: number, y1: number, x2: number, y2: number, l: string) => {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, s = 9, dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), nx = dx / len, ny = dy / len, px = -ny * s, py = nx * s;
        return `<line x1="${x1}" y1="${y1}" x2="${mx - nx * s}" y2="${my - ny * s}" stroke="#1a1a2e" stroke-width="1.8"/>
          <polygon points="${mx - nx * s + px},${my - ny * s + py} ${mx - nx * s - px},${my - ny * s - py} ${mx + nx * s},${my + ny * s}" fill="#1a1a2e"/>
          <line x1="${mx + nx * s + px * 1.1}" y1="${my + ny * s + py * 1.1}" x2="${mx + nx * s - px * 1.1}" y2="${my + ny * s - py * 1.1}" stroke="#1a1a2e" stroke-width="2.5"/>
          <line x1="${mx + nx * s}" y1="${my + ny * s}" x2="${x2}" y2="${y2}" stroke="#1a1a2e" stroke-width="1.8"/>
          <text x="${mx + 10}" y="${my}" font-size="8" fill="#0033cc" font-weight="bold">${l}</text>`;
      };
      return d(365, 240, 365, 210, 'D2') + d(365, 210, 365, 180, 'D3') + d(365, 180, 365, 150, 'D4');
    })()}
    <line x1="365" y1="150" x2="365" y2="120" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="365" y1="120" x2="380" y2="120" stroke="#1a1a2e" stroke-width="1.8"/>
    ${dot(365, 150)}
    ${npnBJT(435, 178, 26, 'Q4', 'BD139')}
    <line x1="365" y1="150" x2="409" y2="150" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="409" y1="150" x2="409" y2="178" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="461" y1="152" x2="485" y2="152" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="485" y1="152" x2="485" y2="42" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="461" y1="202" x2="495" y2="202" stroke="#1a1a2e" stroke-width="1.8"/>
    ${pnpBJT(435, 310, 26, 'Q5', 'BD140')}
    <line x1="365" y1="264" x2="409" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="409" y1="264" x2="409" y2="310" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="461" y1="334" x2="485" y2="334" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="485" y1="334" x2="485" y2="445" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="461" y1="288" x2="495" y2="288" stroke="#1a1a2e" stroke-width="1.8"/>
    ${npnBJT(537, 202, pairs > 1 ? 30 : 28, 'Q1', npnOut)}
    <line x1="${537 + 28}" y1="${202 - 28}" x2="${565 + 28}" y2="100" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${565 + 28}" y1="100" x2="${565 + 28}" y2="42" stroke="#1a1a2e" stroke-width="1.8"/>
    ${pnpBJT(537, 290, pairs > 1 ? 30 : 28, 'Q2', pnpOut)}
    <line x1="${537 + 28}" y1="${290 + 28}" x2="${565 + 28}" y2="380" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${565 + 28}" y1="380" x2="${565 + 28}" y2="445" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="${537 + 28}" y1="${202 + 28}" x2="${537 + 28}" y2="245" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(537 + 28, 245, 18, 'RE1', `${re.toFixed(2)}Ohm`)}
    <line x1="${537 + 28}" y1="${290 - 28}" x2="${537 + 28}" y2="263" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(537 + 28, 263, 18, 'RE2', `${re.toFixed(2)}Ohm`)}
    ${dot(537 + 28, 245)}
    <line x1="${537 + 28}" y1="245" x2="620" y2="245" stroke="#1a1a2e" stroke-width="2.2"/>
    ${dot(620, 245)}
    <line x1="620" y1="245" x2="620" y2="208" stroke="#1a1a2e" stroke-width="1.8"/>
    ${rV(620, 178, 30, 'Rz', `${rl}Ohm`)}
    ${cV(613, 150, 'Cz', '100nF')}
    ${gnd(620, 150)}
    <line x1="630" y1="245" x2="665" y2="245" stroke="#1a1a2e" stroke-width="2.2"/>
    <rect x="665" y="229" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="683,229 683,261 710,275 710,215" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="696" y1="275" x2="696" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gnd(696, 355)}
    <text x="696" y="290" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="696" y="302" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="620" y1="245" x2="620" y2="390" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    <line x1="620" y1="390" x2="316" y2="390" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    ${rH(316, 390, 50, 'Rfb2', '22kOhm')}
    <line x1="366" y1="390" x2="366" y2="264" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    ${rH(253, 264, 30, 'Rfb1', '1kOhm')}
    <line x1="253" y1="264" x2="253" y2="305" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gnd(253, 305)}
    <text x="460" y="410" font-size="8" fill="#888" font-style="italic">--- Boucle de feedback (retroaction negative)</text>
  </svg>`;
}

// ============================================================
//  SCHÉMA DISCRET D — IRS2092S + MOSFETs
// ============================================================
export function buildDiscreteClassDSchematic(
  vcc: number, rl: number, mosfet: string, lUH: number, cUF: number
): string {
  return schD_HalfBridge(vcc, rl, lUH, cUF, 'IRS2092S');
}

// ============================================================
//  FONCTIONS PRINCIPALES — ROUTING VERS LE BON SCHÉMA
// ============================================================
const SIMPLE_AB = ['TDA2030A', 'TDA2050', 'TDA2052'];
const ST_AB = ['TDA7294', 'TDA7293', 'TDA7295'];
const MODULE_AB = ['STK4048XI', 'LM4780'];
const INTEGRATED_D = ['TPA3116D2', 'TPA3110D2', 'TPA3255', 'MA12070', 'TDA8954TH'];
const DRIVER_D = ['IR2110', 'IRS2110', 'SG3525_IRS2110'];
export function buildClassABSchematic(
  vcc: number, rl: number, icName: string, selectedIC: string
): string {

  if (SIMPLE_AB.includes(selectedIC)) return schAB_Simple(vcc, rl, icName);
  if (ST_AB.includes(selectedIC)) return schAB_ST(vcc, rl, icName);
  if (MODULE_AB.includes(selectedIC)) return schAB_Module(vcc, rl, icName);
  return schAB_Overture(vcc, rl, icName); // LM3886, LM3875, LM3876, LM1875
}

export function buildClassDSchematic(
  vcc: number, rl: number, lUH: number, cUF: number,
  icName: string, isIntegrated: boolean, selectedIC: string
): string {
  if (isIntegrated || INTEGRATED_D.includes(selectedIC))
    return schD_Integrated(vcc, rl, lUH, cUF, icName);
  if (DRIVER_D.includes(selectedIC))
    return schD_DriverCombo(vcc, rl, lUH, cUF, icName);
  return schD_HalfBridge(vcc, rl, lUH, cUF, icName); // IRS2092S, UCD3138
}

// ============================================================
//  VUE 3D PCB ISOMÉTRIQUE
// ============================================================
export function buildPseudo3DView(
  vcc: number, rl: number, npnOut: string, pnpOut: string,
  ampClass: string, pairs: number, icName = 'LM3886'
): string {
  function isoX(x: number, y: number): number { return 350 + (x - y) * .8; }
  function isoY(x: number, y: number, z: number): number { return 220 + (x + y) * .4 - z; }
  function topFace(x: number, y: number, z: number, w: number, d: number, col: string): string {
    return `<polygon points="${isoX(x, y)},${isoY(x, y, z)} ${isoX(x + w, y)},${isoY(x + w, y, z)} ${isoX(x + w, y + d)},${isoY(x + w, y + d, z)} ${isoX(x, y + d)},${isoY(x, y + d, z)}" fill="${col}" stroke="#1a1a1a" stroke-width="0.8"/>`;
  }
  function frontFace(x: number, y: number, z: number, w: number, h: number, col: string): string {
    return `<polygon points="${isoX(x, y)},${isoY(x, y, z)} ${isoX(x + w, y)},${isoY(x + w, y, z)} ${isoX(x + w, y)},${isoY(x + w, y, z + h)} ${isoX(x, y)},${isoY(x, y, z + h)}" fill="${col}" stroke="#1a1a1a" stroke-width="0.8"/>`;
  }
  function rightFace(x: number, y: number, z: number, d: number, h: number, col: string): string {
    return `<polygon points="${isoX(x, y)},${isoY(x, y, z)} ${isoX(x, y + d)},${isoY(x, y + d, z)} ${isoX(x, y + d)},${isoY(x, y + d, z + h)} ${isoX(x, y)},${isoY(x, y, z + h)}" fill="${col}" stroke="#1a1a1a" stroke-width="0.8"/>`;
  }
  function box3D(x: number, y: number, z: number, w: number, d: number, h: number, cT: string, cF: string, cR: string, label = ''): string {
    const lx = isoX(x + w / 2, y + d / 2), ly = isoY(x + w / 2, y + d / 2, z + h + 1);
    return frontFace(x, y, z, w, h, cF) + rightFace(x + w, y, z, d, h, cR) + topFace(x, y, z + h, w, d, cT) + (label ? `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="7" fill="white" font-weight="bold" font-family="Arial">${label}</text>` : '');
  }
  function cyl3D(x: number, y: number, z: number, r: number, h: number, bc: string, tc: string, label = ''): string {
    const cx = isoX(x, y), cy = isoY(x, y, z), ty = isoY(x, y, z + h), ry = r * .35;
    return `<rect x="${cx - r}" y="${ty}" width="${r * 2}" height="${cy - ty}" fill="${bc}" stroke="#1a1a1a" stroke-width="0.8"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry}" fill="${bc}" stroke="#1a1a1a" stroke-width="0.8"/>
      <ellipse cx="${cx}" cy="${ty}" rx="${r}" ry="${ry}" fill="${tc}" stroke="#1a1a1a" stroke-width="0.8"/>
      ${label ? `<text x="${cx + r + 4}" y="${ty + 4}" font-size="7" fill="#00f2ff" font-family="Arial">${label}</text>` : ''}`;
  }
  function res3D(x: number, y: number, z: number, label = ''): string {
    const cx = isoX(x, y), cy = isoY(x, y, z);
    return `<line x1="${cx - 18}" y1="${cy}" x2="${cx - 8}" y2="${cy}" stroke="#aaa" stroke-width="1.2"/>
      <ellipse cx="${cx - 8}" cy="${cy}" rx="5" ry="2.5" fill="#b06828" stroke="#333" stroke-width="0.8"/>
      <rect x="${cx - 8}" y="${cy - 5}" width="16" height="10" fill="#b06828" stroke="none"/>
      <rect x="${cx - 5}" y="${cy - 5}" width="3" height="10" fill="#ffaa00" stroke="none"/>
      <rect x="${cx + 1}" y="${cy - 5}" width="3" height="10" fill="#cc3300" stroke="none"/>
      <ellipse cx="${cx + 8}" cy="${cy}" rx="5" ry="2.5" fill="#804818" stroke="#333" stroke-width="0.8"/>
      <line x1="${cx + 8}" y1="${cy}" x2="${cx + 18}" y2="${cy}" stroke="#aaa" stroke-width="1.2"/>
      ${label ? `<text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="7" fill="#00f2ff" font-family="Arial">${label}</text>` : ''}`;
  }
  function floatLabel(x: number, y: number, z: number, txt: string, col = '#00f2ff'): string {
    const sx = isoX(x, y), sy = isoY(x, y, z), w = txt.length * 5.5 + 10;
    return `<rect x="${sx}" y="${sy - 13}" width="${w}" height="14" rx="2" fill="rgba(0,0,0,0.88)" stroke="${col}" stroke-width="0.5"/>
      <text x="${sx + w / 2}" y="${sy - 2}" text-anchor="middle" font-size="7.5" fill="${col}" font-family="Arial">${txt}</text>`;
  }

  const pcb = box3D(-120, -80, 0, 240, 160, 4, '#1a5c1a', '#0a3a0a', '#0d4a0d');
  const padPos: [number, number][] = [[-90, -60], [-54, -60], [-18, -60], [18, -60], [54, -60], [90, -60], [-90, -22], [-54, -22], [-18, -22], [18, -22], [54, -22], [90, -22], [-90, 16], [-54, 16], [-18, 16], [18, 16], [54, 16], [90, 16], [-90, 54], [-54, 54], [-18, 54], [18, 54], [54, 54], [90, 54]];
  const pads = padPos.map(([px, py]) => `<ellipse cx="${isoX(px, py)}" cy="${isoY(px, py, 4)}" rx="4" ry="1.8" fill="#c8a000" opacity="0.42"/>`).join('');
  function trace(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): string { return `<line x1="${isoX(x1, y1)}" y1="${isoY(x1, y1, z1)}" x2="${isoX(x2, y2)}" y2="${isoY(x2, y2, z2)}" stroke="#c8a000" stroke-width="2" opacity="0.65"/>`; }
  const traces = trace(-80, -30, 4, -20, -30, 4) + trace(-20, -30, 4, -20, 20, 4) + trace(-20, 20, 4, 40, 20, 4) + trace(40, 20, 4, 80, 20, 4) + trace(22, -12, 4, 62, -12, 4);
  let hs = ''; for (let i = 0; i < 7; i++) hs += box3D(-115 + i * 8, -28, 4, 4, 56, 26 + i * 1.5, '#d0d0d0', '#b0b0b0', '#c0c0c0');
  const q1 = box3D(-52, -42, 4, 22, 15, 18, '#484848', '#282828', '#383838', npnOut.substring(0, 8)) + box3D(-52, -42, 22, 22, 15, 4, '#aaa', '#999', '#888');
  const q2 = box3D(-52, 10, 4, 22, 15, 18, '#483838', '#281818', '#382828', pnpOut.substring(0, 8)) + box3D(-52, 10, 22, 22, 15, 4, '#aaa', '#999', '#888');
  const q3 = pairs > 1 ? box3D(-52, -7, 4, 22, 15, 18, '#484848', '#282828', '#383838', npnOut.substring(0, 8)) + box3D(-52, -7, 22, 22, 15, 4, '#aaa', '#999', '#888') : '';
  const q4 = pairs > 1 ? box3D(-52, 27, 4, 22, 15, 18, '#483838', '#281818', '#382828', pnpOut.substring(0, 8)) + box3D(-52, 27, 22, 22, 15, 4, '#aaa', '#999', '#888') : '';
  const ic1 = box3D(22, -35, 4, 38, 25, 8, '#222244', '#111133', '#1a1a3a', icName.substring(0, 9));
  const icPins = Array.from({ length: 7 }, (_, i) => { const px = 24 + i * 5, sx = isoX(px, -35), sy = isoY(px, -35, 4); return `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + 6}" stroke="#c8c840" stroke-width="1"/>`; }).join('');
  const caps = cyl3D(62, -52, 4, 12, 32, '#1a3acc', '#3355ee', 'C_bus') + cyl3D(62, 10, 4, 9, 24, '#2a5aaa', '#3366cc', 'Cdec') + cyl3D(-92, -20, 4, 9, 22, '#1a3acc', '#3355ee', 'C_in');
  const resistors = res3D(-85, -52, 4, 'Rfb1') + res3D(-85, 32, 4, 'Rfb2') + res3D(72, -30, 4, 'Rz') + res3D(-35, -70, 4, 'Rin');
  const w1x1 = isoX(-30, -42), w1y1 = isoY(-30, -42, 22), w1x2 = isoX(22, -22), w1y2 = isoY(22, -22, 12);
  const w2x1 = isoX(-30, 24), w2y1 = isoY(-30, 24, 22), w2x2 = isoX(22, -12), w2y2 = isoY(22, -12, 12);
  const wires = `<line x1="${w1x1}" y1="${w1y1}" x2="${w1x2}" y2="${w1y2}" stroke="#00ff80" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8"/>
    <line x1="${w2x1}" y1="${w2y1}" x2="${w2x2}" y2="${w2y2}" stroke="#ff4b2b" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8"/>`;
  const labels = floatLabel(-41, -34, 42, npnOut.substring(0, 9)) + floatLabel(-41, 18, 42, pnpOut.substring(0, 9), '#ff9999') + floatLabel(30, -22, 18, icName.substring(0, 10)) + floatLabel(-110, -2, 38, 'Dissipateur', '#ccc');
  const gridH = Array.from({ length: 14 }, (_, i) => `<line x1="${i * 55}" y1="0" x2="${i * 55}" y2="460" stroke="#161b22" stroke-width="0.5"/>`).join('');
  const gridV = Array.from({ length: 9 }, (_, j) => `<line x1="0" y1="${j * 55}" x2="720" y2="${j * 55}" stroke="#161b22" stroke-width="0.5"/>`).join('');

  return `<svg width="720" height="460" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="720" height="460" fill="#0d1117"/>
    ${gridH}${gridV}
    <text x="360" y="22" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#00f2ff">
      Vue 3D PCB — ${icName} — ${ampClass} — +/-${vcc}V / ${rl}Ohm
    </text>
    <line x1="30" y1="28" x2="690" y2="28" stroke="#1e3a5f" stroke-width="0.6"/>
    ${pcb}${pads}${traces}${hs}${q1}${q2}${q3}${q4}${ic1}${icPins}${caps}${resistors}${wires}
    <ellipse cx="350" cy="368" rx="200" ry="16" fill="rgba(0,114,255,0.07)"/>
    ${labels}
    <rect x="10" y="368" width="218" height="84" rx="3" fill="rgba(0,0,0,0.82)" stroke="#333" stroke-width="0.8"/>
    <text x="119" y="384" text-anchor="middle" font-size="9" fill="#00f2ff" font-weight="bold">Legende</text>
    <rect x="18" y="392" width="10" height="7" fill="#1a5c1a"/><text x="32" y="399" font-size="7.5" fill="#ccc">PCB FR4</text>
    <rect x="18" y="404" width="10" height="7" fill="#484848"/><text x="32" y="411" font-size="7.5" fill="#ccc">Transistor NPN</text>
    <rect x="18" y="416" width="10" height="7" fill="#483838"/><text x="32" y="423" font-size="7.5" fill="#ccc">Transistor PNP</text>
    <rect x="18" y="428" width="10" height="7" fill="#222244"/><text x="32" y="435" font-size="7.5" fill="#ccc">CI ${icName.substring(0, 10)}</text>
    <rect x="120" y="392" width="10" height="7" fill="#b06828"/><text x="134" y="399" font-size="7.5" fill="#ccc">Resistance</text>
    <rect x="120" y="404" width="10" height="7" fill="#1a3acc"/><text x="134" y="411" font-size="7.5" fill="#ccc">Condensateur</text>
    <rect x="120" y="416" width="10" height="7" fill="#d0d0d0"/><text x="134" y="423" font-size="7.5" fill="#ccc">Dissipateur</text>
    <text x="360" y="452" text-anchor="middle" font-size="8" fill="#444">Vue illustrative — Utiliser schema normalise pour le cablage reel</text>
  </svg>`;
}

// ============================================================
//  SVG → DATA URL pour PDF
// ============================================================
export async function svgToDataURL(svgString: string, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = w * 2; canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject('canvas error'); return; }
    ctx.scale(2, 2); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, w, h);
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => { ctx.drawImage(img, 0, 0, w, h); URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/png', 1.0)); };
    img.onerror = () => { URL.revokeObjectURL(url); reject('SVG render error'); };
    img.src = url;
  });
}