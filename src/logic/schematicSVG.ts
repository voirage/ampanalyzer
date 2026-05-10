// ============================================================
//  Schémas SVG — Normalisé + Discret BJT + 3D ISO
//  Cohérence totale avec le CI sélectionné par l'utilisateur
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
    <text x="${cx + r + 5}" y="${cy + r * 0.95 + 5}" font-size="8" fill="#cc0000" font-weight="bold">E</text>`;
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
    <text x="${cx + r + 5}" y="${cy + r * 0.95 + 5}" font-size="8" fill="#cc0000" font-weight="bold">E</text>`;
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
  const dx = x2 - x1; const dy = y2 - y1; const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len; const ny = dy / len; const px = -ny * s; const py = nx * s;
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

function jDot(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y}" r="3.5" fill="#1a1a2e"/>`;
}

// ============================================================
//  SCHÉMA NORMALISÉ CLASSE AB — icName dynamique
// ============================================================
export function buildClassABSchematic(
  vcc: number, rl: number, icName = 'LM3886'
): string {
  const gain = (1 + 22000 / 1000).toFixed(0);
  return `<svg width="760" height="400" viewBox="0 0 760 400"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="760" height="400" fill="white"/>
    <text x="380" y="17" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema Normalise Classe AB — ${icName} — +/-${vcc}V / ${rl}Ohm — Gain ${gain}x
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
    <text x="186" y="179" font-size="10" fill="#006600" font-weight="bold">+</text>
    <text x="165" y="171" font-size="7.5" fill="#cc0000" font-weight="bold">1</text>
    <rect x="162" y="162" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>
    <line x1="148" y1="210" x2="182" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="186" y="214" font-size="10" fill="#cc0000" font-weight="bold">-</text>
    <text x="133" y="206" font-size="7.5" fill="#cc0000" font-weight="bold">9</text>
    <rect x="130" y="197" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>
    <text x="218" y="183" text-anchor="middle" font-size="10" fill="#1a1a2e" font-weight="bold">${icName}</text>
    <text x="218" y="196" text-anchor="middle" font-size="7.5" fill="#555">Ampli Audio</text>
    <text x="218" y="207" text-anchor="middle" font-size="7" fill="#777">+/-${vcc}V</text>
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
    <text x="594" y="89" font-size="8" fill="#555">Decouplage +VCC</text>
    <line x1="640" y1="355" x2="640" y2="332" stroke="#0033cc" stroke-width="1.2"/>
    <line x1="630" y1="332" x2="650" y2="332" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="630" y1="326" x2="650" y2="326" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="640" y1="326" x2="640" y2="302" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="632" y1="302" x2="648" y2="302" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="634" y1="296" x2="646" y2="296" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="636" y1="290" x2="644" y2="290" stroke="#1a1a2e" stroke-width="1"/>
    <text x="654" y="332" font-size="8.5" fill="#444" font-weight="bold">100 uF</text>
    <text x="654" y="342" font-size="8.5" fill="#444">+ 100 nF</text>
    <text x="654" y="304" font-size="8" fill="#555">Decouplage -VCC</text>
  </svg>`;
}

// ============================================================
//  SCHÉMA NORMALISÉ CLASSE D — icName + isIntegrated dynamiques
// ============================================================
export function buildClassDSchematic(
  vcc: number, rl: number, lUH: number, cUF: number,
  icName = 'IRS2092S', isIntegrated = false
): string {
  const cBulk = Math.ceil((vcc / Math.sqrt(2) / rl) * 150);
  const mosfetLabel = isIntegrated ? 'MOSFETs internes' : 'IRFZ44N';
  const mosfetNote = isIntegrated ? 'Integres dans le CI' : 'N-Ch externe';

  return `<svg width="760" height="400" viewBox="0 0 760 400"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="760" height="400" fill="white"/>
    <text x="380" y="17" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema Normalise Classe D — ${icName} — ${vcc}V / ${rl}Ohm${isIntegrated ? ' (CI Integre)' : ' + Pont H externe'}
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
    <!-- CI principal -->
    <rect x="158" y="118" width="105" height="160" rx="5" fill="#eef0ff" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="210" y="140" text-anchor="middle" font-weight="bold" font-size="11" fill="#1a1a2e">${icName}</text>
    <text x="210" y="155" text-anchor="middle" font-size="8.5" fill="#555">${isIntegrated ? 'CI Integre' : 'Ctrl PWM'}</text>
    <text x="210" y="168" text-anchor="middle" font-size="8" fill="#777">${isIntegrated ? 'H-Bridge interne' : '400 kHz'}</text>
    <text x="163" y="200" font-size="7.5" fill="#333">IN(+)</text>
    <text x="163" y="218" font-size="7.5" fill="#333">GND</text>
    <text x="163" y="236" font-size="7.5" fill="#333">VCC</text>
    <text x="226" y="190" font-size="7.5" fill="#333">HO</text>
    <text x="226" y="260" font-size="7.5" fill="#333">LO</text>
    <line x1="263" y1="188" x2="${isIntegrated ? 295 : 290}" y2="188" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="263" y1="258" x2="${isIntegrated ? 295 : 290}" y2="258" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="210" y1="118" x2="210" y2="45" stroke="#cc2200" stroke-width="0.9" stroke-dasharray="4,2"/>
    <line x1="210" y1="278" x2="210" y2="310" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="201" y1="310" x2="219" y2="310" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="204" y1="316" x2="216" y2="316" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="207" y1="322" x2="213" y2="322" stroke="#1a1a2e" stroke-width="1"/>
    <!-- MOSFETs ou note integre -->
    ${isIntegrated ? `
    <rect x="290" y="148" width="80" height="130" rx="4" fill="#fff8f0" stroke="#cc6600" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="330" y="170" text-anchor="middle" font-size="8.5" fill="#cc6600" font-weight="bold">H-Bridge</text>
    <text x="330" y="184" text-anchor="middle" font-size="7.5" fill="#cc6600">Integre dans</text>
    <text x="330" y="196" text-anchor="middle" font-size="7.5" fill="#cc6600">${icName}</text>
    <text x="330" y="215" text-anchor="middle" font-size="7" fill="#888">Pas de MOSFET</text>
    <text x="330" y="227" text-anchor="middle" font-size="7" fill="#888">externe requis</text>
    <line x1="370" y1="213" x2="400" y2="213" stroke="#1a1a2e" stroke-width="2.2"/>
    ` : `
    <rect x="290" y="118" width="65" height="80" rx="4" fill="#fff8ee" stroke="#cc6600" stroke-width="1.8"/>
    <text x="322" y="148" text-anchor="middle" font-size="8.5" fill="#1a1a2e" font-weight="bold">Q1 N-Ch</text>
    <text x="322" y="162" text-anchor="middle" font-size="7.5" fill="#555">IRFZ44N</text>
    <text x="327" y="123" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="270" y="170" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="327" y="200" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="285" y1="188" x2="290" y2="158" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="322" y1="118" x2="322" y2="45" stroke="#cc2200" stroke-width="1.8"/>
    <line x1="322" y1="198" x2="322" y2="222" stroke="#1a1a2e" stroke-width="1.8"/>
    <circle cx="322" cy="222" r="3.5" fill="#1a1a2e"/>
    <rect x="290" y="262" width="65" height="80" rx="4" fill="#fff8ee" stroke="#cc6600" stroke-width="1.8"/>
    <text x="322" y="298" text-anchor="middle" font-size="8.5" fill="#1a1a2e" font-weight="bold">Q2 N-Ch</text>
    <text x="322" y="312" text-anchor="middle" font-size="7.5" fill="#555">IRFZ44N</text>
    <text x="327" y="268" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="270" y="285" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="327" y="346" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="285" y1="258" x2="290" y2="298" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="322" y1="262" x2="322" y2="222" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="322" y1="342" x2="322" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="322" y1="222" x2="400" y2="222" stroke="#1a1a2e" stroke-width="2.5"/>
    <circle cx="400" cy="222" r="3.5" fill="#1a1a2e"/>
    `}
    <!-- Filtre LC -->
    <line x1="${isIntegrated ? 400 : 400}" y1="${isIntegrated ? 213 : 222}" x2="420" y2="${isIntegrated ? 213 : 222}" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M 420,${isIntegrated ? 213 : 222} Q 427,${isIntegrated ? 199 : 208} 434,${isIntegrated ? 213 : 222} Q 441,${isIntegrated ? 227 : 236} 448,${isIntegrated ? 213 : 222} Q 455,${isIntegrated ? 199 : 208} 462,${isIntegrated ? 213 : 222} Q 469,${isIntegrated ? 227 : 236} 476,${isIntegrated ? 213 : 222}"
      fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="476" y1="${isIntegrated ? 213 : 222}" x2="500" y2="${isIntegrated ? 213 : 222}" stroke="#1a1a2e" stroke-width="2"/>
    <text x="448" y="${isIntegrated ? 198 : 207}" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="448" y="${isIntegrated ? 233 : 242}" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    <circle cx="500" cy="${isIntegrated ? 213 : 222}" r="3.5" fill="#1a1a2e"/>
    <line x1="500" y1="${isIntegrated ? 213 : 222}" x2="500" y2="${isIntegrated ? 235 : 248}" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="491" y1="${isIntegrated ? 235 : 248}" x2="509" y2="${isIntegrated ? 235 : 248}" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="491" y1="${isIntegrated ? 242 : 255}" x2="509" y2="${isIntegrated ? 242 : 255}" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="500" y1="${isIntegrated ? 242 : 255}" x2="500" y2="310" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="491" y1="310" x2="509" y2="310" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="494" y1="316" x2="506" y2="316" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="497" y1="322" x2="503" y2="322" stroke="#1a1a2e" stroke-width="1"/>
    <text x="512" y="${isIntegrated ? 237 : 250}" font-size="9.5" fill="#0033cc" font-weight="bold">C</text>
    <text x="512" y="${isIntegrated ? 248 : 261}" font-size="8.5" fill="#333">${cUF} uF</text>
    <line x1="500" y1="${isIntegrated ? 213 : 222}" x2="565" y2="${isIntegrated ? 213 : 222}" stroke="#1a1a2e" stroke-width="2.2"/>
    <!-- HP -->
    <rect x="565" y="${isIntegrated ? 197 : 206}" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="583,${isIntegrated ? 197 : 206} 583,${isIntegrated ? 229 : 238} 610,${isIntegrated ? 243 : 252} 610,${isIntegrated ? 183 : 192}" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="596" y="${isIntegrated ? 258 : 272}" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="596" y="${isIntegrated ? 270 : 284}" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="596" y1="${isIntegrated ? 243 : 252}" x2="596" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Condensateur bus -->
    <line x1="680" y1="45" x2="680" y2="72" stroke="#cc2200" stroke-width="1.2"/>
    <line x1="669" y1="72" x2="691" y2="72" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="669" y1="79" x2="691" y2="79" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="680" y1="79" x2="680" y2="355" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="695" y="68" font-size="8.5" fill="#0033cc" font-weight="bold">Cbulk</text>
    <text x="695" y="79" font-size="8.5" fill="#444">${cBulk}uF/${Math.ceil(vcc * 1.35)}V</text>
  </svg>`;
}

// ============================================================
//  SCHÉMA DISCRET CLASSE AB
// ============================================================
export function buildDiscreteClassABSchematic(
  vcc: number, rl: number,
  npnOut: string, pnpOut: string,
  pairs: number, driverNPN: string, driverPNP: string,
  re: number
): string {
  return `<svg width="820" height="480" viewBox="0 0 820 480"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
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
    <line x1="80" y1="232" x2="80" y2="252" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="86" y1="232" x2="86" y2="252" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="86" y1="242" x2="112" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="83" y="222" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">C4</text>
    <text x="83" y="268" text-anchor="middle" font-size="8" fill="#333">1 uF</text>
    ${resistorSVG(112, 242, 30, 'R9', '47kOhm')}
    ${jDot(142, 242)}
    <line x1="142" y1="242" x2="142" y2="268" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(142, 268, 30, 'R7', '22kOhm', true)}
    ${gndSym(142, 298)}
    <line x1="142" y1="242" x2="168" y2="242" stroke="#1a1a2e" stroke-width="1.8"/>
    ${pnpBJT(200, 242, 24, 'Q7', driverPNP)}
    <line x1="224" y1="220" x2="224" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="224" y1="264" x2="265" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="224" y1="42" x2="224" y2="148" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(224, 148, 27, 'R6', '18kOhm', true)}
    ${npnBJT(292, 242, 24, 'Q6', driverNPN)}
    <line x1="224" y1="175" x2="224" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(224, 200, 28, 'R5', '1kOhm', true)}
    ${gndSym(224, 228)}
    <line x1="316" y1="220" x2="316" y2="185" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(316, 155, 30, 'R4', '560Ohm', true)}
    ${gndSym(316, 185)}
    <line x1="380" y1="42" x2="380" y2="68" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(380, 68, 30, 'R1', '2.7kOhm', true)}
    ${resistorSVG(380, 108, 30, 'R2', '2.7kOhm', true)}
    ${capSVG(373, 148, 'C1', '47uF', true)}
    ${jDot(380, 108)}
    <line x1="380" y1="168" x2="380" y2="195" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(316, 264, 40, 'R3', '22kOhm')}
    <line x1="356" y1="264" x2="365" y2="264" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="365" y1="264" x2="365" y2="240" stroke="#1a1a2e" stroke-width="1.8"/>
    ${diodeSVG(365, 240, 365, 210, 'D2')}
    ${diodeSVG(365, 210, 365, 180, 'D3')}
    ${diodeSVG(365, 180, 365, 150, 'D4')}
    <line x1="365" y1="150" x2="365" y2="120" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="365" y1="120" x2="380" y2="120" stroke="#1a1a2e" stroke-width="1.8"/>
    ${jDot(365, 150)}
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
    ${resistorSVG(537 + 28, 245, 18, 'RE1', `${re.toFixed(2)}Ohm`, true)}
    <line x1="${537 + 28}" y1="${290 - 28}" x2="${537 + 28}" y2="263" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(537 + 28, 263, 18, 'RE2', `${re.toFixed(2)}Ohm`, true)}
    ${jDot(537 + 28, 245)}
    <line x1="${537 + 28}" y1="245" x2="620" y2="245" stroke="#1a1a2e" stroke-width="2.2"/>
    ${jDot(620, 245)}
    <line x1="620" y1="245" x2="620" y2="208" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(620, 180, 28, 'Rz', `${rl}Ohm`, true)}
    <line x1="620" y1="180" x2="620" y2="162" stroke="#1a1a2e" stroke-width="1.8"/>
    ${capSVG(613, 137, 'Cz', '100nF', true)}
    ${gndSym(620, 137)}
    <line x1="630" y1="245" x2="665" y2="245" stroke="#1a1a2e" stroke-width="2.2"/>
    <rect x="665" y="229" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="683,229 683,261 714,275 714,215" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="698" y1="275" x2="698" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>
    ${gndSym(698, 355)}
    <text x="698" y="290" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="698" y="302" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="620" y1="245" x2="620" y2="390" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    <line x1="620" y1="390" x2="316" y2="390" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    ${resistorSVG(316, 390, 50, 'Rfb2', '22kOhm')}
    <line x1="366" y1="390" x2="366" y2="264" stroke="#1a1a2e" stroke-width="1.5" stroke-dasharray="6,3"/>
    ${resistorSVG(253, 264, 30, 'Rfb1', '1kOhm')}
    <line x1="253" y1="264" x2="253" y2="305" stroke="#1a1a2e" stroke-width="1.5"/>
    ${gndSym(253, 305)}
    <text x="460" y="407" font-size="8" fill="#888" font-style="italic">--- Boucle de feedback (retroaction negative)</text>
  </svg>`;
}

// ============================================================
//  SCHÉMA DISCRET CLASSE D
// ============================================================
export function buildDiscreteClassDSchematic(
  vcc: number, rl: number, mosfet: string, lUH: number, cUF: number
): string {
  const cBulk = Math.ceil((vcc / Math.sqrt(2) / rl) * 150);
  return `<svg width="820" height="440" viewBox="0 0 820 440"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="820" height="440" fill="white"/>
    <text x="410" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a0a2e">
      Schema Discret Classe D — IRS2092S + ${mosfet} — ${vcc}V / ${rl}Ohm
    </text>
    <line x1="10" y1="22" x2="810" y2="22" stroke="#bbb" stroke-width="0.8"/>
    <line x1="10" y1="42" x2="810" y2="42" stroke="#cc2200" stroke-width="1.5" stroke-dasharray="8,3"/>
    <text x="14" y="39" font-size="9.5" fill="#cc2200" font-weight="bold">VBUS +${vcc}V DC</text>
    <line x1="10" y1="410" x2="810" y2="410" stroke="#333" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="14" y="420" font-size="9.5" fill="#333" font-weight="bold">GND</text>
    <text x="12" y="228" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="58" y1="222" x2="80" y2="222" stroke="#1a1a2e" stroke-width="1.8"/>
    ${resistorSVG(80, 222, 28, 'Rin', '10kOhm')}
    ${jDot(108, 222)}
    <line x1="108" y1="222" x2="108" y2="245" stroke="#1a1a2e" stroke-width="1.8"/>
    ${capSVG(101, 245, 'Cin', '100nF', true)}
    ${gndSym(108, 278)}
    <line x1="108" y1="222" x2="140" y2="222" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="140" y="148" width="108" height="148" rx="5" fill="#eef0ff" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="194" y="170" text-anchor="middle" font-weight="bold" font-size="11" fill="#1a1a2e">IRS2092S</text>
    <text x="194" y="185" text-anchor="middle" font-size="8.5" fill="#555">Controleur PWM</text>
    <text x="194" y="198" text-anchor="middle" font-size="8" fill="#777">400 kHz</text>
    <text x="145" y="218" font-size="7.5" fill="#333">5(IN+)</text>
    <text x="145" y="236" font-size="7.5" fill="#333">4(GND)</text>
    <text x="145" y="254" font-size="7.5" fill="#333">13(VCC)</text>
    <text x="216" y="205" font-size="7.5" fill="#333">12(HO)</text>
    <text x="216" y="270" font-size="7.5" fill="#333">9(LO)</text>
    <line x1="248" y1="202" x2="285" y2="202" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="248" y1="268" x2="285" y2="268" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="194" y1="148" x2="194" y2="42" stroke="#cc2200" stroke-width="0.9" stroke-dasharray="4,2"/>
    <line x1="194" y1="296" x2="194" y2="322" stroke="#1a1a2e" stroke-width="1.2"/>
    ${gndSym(194, 322)}
    <rect x="285" y="118" width="65" height="84" rx="4" fill="#fff8ee" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="317" y="155" text-anchor="middle" font-size="9" fill="#1a1a2e" font-weight="bold">Q1</text>
    <text x="317" y="168" text-anchor="middle" font-size="7.5" fill="#555">${mosfet.substring(0, 8)}</text>
    <text x="317" y="180" text-anchor="middle" font-size="7" fill="#777">N-Ch</text>
    <text x="322" y="123" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="268" y="183" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="322" y="207" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="280" y1="202" x2="285" y2="160" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="317" y1="118" x2="317" y2="42" stroke="#cc2200" stroke-width="1.8"/>
    <line x1="317" y1="202" x2="317" y2="230" stroke="#1a1a2e" stroke-width="1.8"/>
    ${jDot(317, 230)}
    <rect x="285" y="278" width="65" height="84" rx="4" fill="#fff8ee" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="317" y="315" text-anchor="middle" font-size="9" fill="#1a1a2e" font-weight="bold">Q2</text>
    <text x="317" y="328" text-anchor="middle" font-size="7.5" fill="#555">${mosfet.substring(0, 8)}</text>
    <text x="317" y="340" text-anchor="middle" font-size="7" fill="#777">N-Ch</text>
    <text x="322" y="283" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="268" y="305" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="322" y="368" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="280" y1="268" x2="285" y2="310" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="317" y1="278" x2="317" y2="230" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="317" y1="362" x2="317" y2="410" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="317" y1="230" x2="400" y2="230" stroke="#1a1a2e" stroke-width="2.5"/>
    ${jDot(400, 230)}
    <line x1="400" y1="230" x2="420" y2="230" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M 420,230 Q 427,216 434,230 Q 441,244 448,230 Q 455,216 462,230 Q 469,244 476,230" fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="476" y1="230" x2="500" y2="230" stroke="#1a1a2e" stroke-width="2"/>
    <text x="448" y="211" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="448" y="250" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>
    ${jDot(500, 230)}
    <line x1="500" y1="230" x2="500" y2="255" stroke="#1a1a2e" stroke-width="1.8"/>
    ${capSVG(493, 255, 'C', `${cUF}uF`, true)}
    ${gndSym(500, 288)}
    <line x1="500" y1="230" x2="565" y2="230" stroke="#1a1a2e" stroke-width="2.2"/>
    <rect x="565" y="214" width="18" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="583,214 583,246 612,260 612,200" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="596" y1="260" x2="596" y2="410" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="596" y="275" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="596" y="287" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="680" y1="42" x2="680" y2="70" stroke="#cc2200" stroke-width="1.2"/>
    ${capSVG(673, 70, 'Cbulk', `${cBulk}uF/${Math.ceil(vcc * 1.35)}V`, true)}
    ${gndSym(680, 103)}
  </svg>`;
}

// ============================================================
//  VUE 3D ISO — icName dynamique
// ============================================================
export function buildPseudo3DView(
  vcc: number, rl: number,
  npnOut: string, pnpOut: string,
  ampClass: string, pairs: number,
  icName = 'LM3886'
): string {

  function isoX(x: number, y: number): number { return 350 + (x - y) * 0.8; }
  function isoY(x: number, y: number, z: number): number { return 220 + (x + y) * 0.4 - z; }

  function topFace(x: number, y: number, z: number, w: number, d: number, col: string): string {
    const ax = isoX(x, y), ay = isoY(x, y, z);
    const bx = isoX(x + w, y), by = isoY(x + w, y, z);
    const cx = isoX(x + w, y + d), cy = isoY(x + w, y + d, z);
    const dx = isoX(x, y + d), dy = isoY(x, y + d, z);
    return `<polygon points="${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}" fill="${col}" stroke="#1a1a1a" stroke-width="0.8"/>`;
  }
  function frontFace(x: number, y: number, z: number, w: number, h: number, col: string): string {
    const ax = isoX(x, y), ay = isoY(x, y, z);
    const bx = isoX(x + w, y), by = isoY(x + w, y, z);
    const cx = isoX(x + w, y), cy = isoY(x + w, y, z + h);
    const dx = isoX(x, y), dy = isoY(x, y, z + h);
    return `<polygon points="${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}" fill="${col}" stroke="#1a1a1a" stroke-width="0.8"/>`;
  }
  function rightFace(x: number, y: number, z: number, d: number, h: number, col: string): string {
    const ax = isoX(x, y), ay = isoY(x, y, z);
    const bx = isoX(x, y + d), by = isoY(x, y + d, z);
    const cx = isoX(x, y + d), cy = isoY(x, y + d, z + h);
    const dx = isoX(x, y), dy = isoY(x, y, z + h);
    return `<polygon points="${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}" fill="${col}" stroke="#1a1a1a" stroke-width="0.8"/>`;
  }
  function box3D(x: number, y: number, z: number, w: number, d: number, h: number, cT: string, cF: string, cR: string, label = ''): string {
    const lx = isoX(x + w / 2, y + d / 2); const ly = isoY(x + w / 2, y + d / 2, z + h + 1);
    return `${frontFace(x, y, z, w, h, cF)}${rightFace(x + w, y, z, d, h, cR)}${topFace(x, y, z + h, w, d, cT)}
      ${label ? `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="7" fill="white" font-weight="bold" font-family="Arial">${label}</text>` : ''}`;
  }
  function cyl3D(x: number, y: number, z: number, r: number, h: number, bc: string, tc: string, label = ''): string {
    const cx = isoX(x, y); const cy = isoY(x, y, z); const ty = isoY(x, y, z + h); const ry = r * 0.35;
    return `<rect x="${cx - r}" y="${ty}" width="${r * 2}" height="${cy - ty}" fill="${bc}" stroke="#1a1a1a" stroke-width="0.8"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry}" fill="${bc}" stroke="#1a1a1a" stroke-width="0.8"/>
      <ellipse cx="${cx}" cy="${ty}" rx="${r}" ry="${ry}" fill="${tc}" stroke="#1a1a1a" stroke-width="0.8"/>
      ${label ? `<text x="${cx + r + 4}" y="${ty + 4}" font-size="7" fill="#00f2ff" font-family="Arial">${label}</text>` : ''}`;
  }
  function res3D(x: number, y: number, z: number, label = ''): string {
    const cx = isoX(x, y); const cy = isoY(x, y, z);
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
    const sx = isoX(x, y); const sy = isoY(x, y, z); const w = txt.length * 5.5 + 10;
    return `<rect x="${sx}" y="${sy - 13}" width="${w}" height="14" rx="2" fill="rgba(0,0,0,0.88)" stroke="${col}" stroke-width="0.5"/>
      <text x="${sx + w / 2}" y="${sy - 2}" text-anchor="middle" font-size="7.5" fill="${col}" font-family="Arial">${txt}</text>`;
  }

  // PCB
  const pcb = box3D(-120, -80, 0, 240, 160, 4, '#1a5c1a', '#0a3a0a', '#0d4a0d');

  // Pads
  const padPos: [number, number][] = [
    [-90, -60], [-54, -60], [-18, -60], [18, -60], [54, -60], [90, -60],
    [-90, -22], [-54, -22], [-18, -22], [18, -22], [54, -22], [90, -22],
    [-90, 16], [-54, 16], [-18, 16], [18, 16], [54, 16], [90, 16],
    [-90, 54], [-54, 54], [-18, 54], [18, 54], [54, 54], [90, 54],
  ];
  const pads = padPos.map(([px, py]) => {
    const sx = isoX(px, py); const sy = isoY(px, py, 4);
    return `<ellipse cx="${sx}" cy="${sy}" rx="4" ry="1.8" fill="#c8a000" opacity="0.42"/>`;
  }).join('');

  // Traces
  function trace(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): string {
    return `<line x1="${isoX(x1, y1)}" y1="${isoY(x1, y1, z1)}" x2="${isoX(x2, y2)}" y2="${isoY(x2, y2, z2)}" stroke="#c8a000" stroke-width="2" opacity="0.65"/>`;
  }
  const traces = `${trace(-80, -30, 4, -20, -30, 4)}${trace(-20, -30, 4, -20, 20, 4)}${trace(-20, 20, 4, 40, 20, 4)}${trace(40, 20, 4, 80, 20, 4)}${trace(22, -12, 4, 62, -12, 4)}`;

  // Dissipateur
  const heatsinkParts: string[] = [];
  for (let i = 0; i < 7; i++) heatsinkParts.push(box3D(-115 + i * 8, -28, 4, 4, 56, 26 + i * 1.5, '#d0d0d0', '#b0b0b0', '#c0c0c0'));
  const heatsink = heatsinkParts.join('');

  // Transistors
  const q1 = `${box3D(-52, -42, 4, 22, 15, 18, '#484848', '#282828', '#383838', npnOut.substring(0, 8))}${box3D(-52, -42, 22, 22, 15, 4, '#aaa', '#999', '#888')}`;
  const q2 = `${box3D(-52, 10, 4, 22, 15, 18, '#483838', '#281818', '#382828', pnpOut.substring(0, 8))}${box3D(-52, 10, 22, 22, 15, 4, '#aaa', '#999', '#888')}`;
  const q3 = pairs > 1 ? `${box3D(-52, -7, 4, 22, 15, 18, '#484848', '#282828', '#383838', npnOut.substring(0, 8))}${box3D(-52, -7, 22, 22, 15, 4, '#aaa', '#999', '#888')}` : '';
  const q4 = pairs > 1 ? `${box3D(-52, 27, 4, 22, 15, 18, '#483838', '#281818', '#382828', pnpOut.substring(0, 8))}${box3D(-52, 27, 22, 22, 15, 4, '#aaa', '#999', '#888')}` : '';

  // CI — icName dynamique
  const ic1 = box3D(22, -35, 4, 38, 25, 8, '#222244', '#111133', '#1a1a3a', icName.substring(0, 9));
  const icPinsList: string[] = [];
  for (let i = 0; i < 7; i++) {
    const px = 24 + i * 5; const sx = isoX(px, -35); const sy = isoY(px, -35, 4);
    icPinsList.push(`<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + 6}" stroke="#c8c840" stroke-width="1"/>`);
  }

  const caps = `${cyl3D(62, -52, 4, 12, 32, '#1a3acc', '#3355ee', 'C_bus')}${cyl3D(62, 10, 4, 9, 24, '#2a5aaa', '#3366cc', 'Cdec')}${cyl3D(-92, -20, 4, 9, 22, '#1a3acc', '#3355ee', 'C_in')}`;
  const resistors = `${res3D(-85, -52, 4, 'Rfb1')}${res3D(-85, 32, 4, 'Rfb2')}${res3D(72, -30, 4, 'Rz')}${res3D(-35, -70, 4, 'Rin')}`;

  const w1x1 = isoX(-30, -42), w1y1 = isoY(-30, -42, 22), w1x2 = isoX(22, -22), w1y2 = isoY(22, -22, 12);
  const w2x1 = isoX(-30, 24), w2y1 = isoY(-30, 24, 22), w2x2 = isoX(22, -12), w2y2 = isoY(22, -12, 12);
  const w3x1 = isoX(62, -52), w3y1 = isoY(62, -52, 36), w3x2 = isoX(72, -30), w3y2 = isoY(72, -30, 4);
  const wires = `
    <line x1="${w1x1}" y1="${w1y1}" x2="${w1x2}" y2="${w1y2}" stroke="#00ff80" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8"/>
    <line x1="${w2x1}" y1="${w2y1}" x2="${w2x2}" y2="${w2y2}" stroke="#ff4b2b" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8"/>
    <line x1="${w3x1}" y1="${w3y1}" x2="${w3x2}" y2="${w3y2}" stroke="#00f2ff" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8"/>`;

  const labels = `
    ${floatLabel(-41, -34, 42, npnOut.substring(0, 9))}
    ${floatLabel(-41, 18, 42, pnpOut.substring(0, 9), '#ff9999')}
    ${floatLabel(30, -22, 18, icName.substring(0, 10))}
    ${floatLabel(-110, -2, 38, 'Dissipateur', '#cccccc')}
    ${floatLabel(60, -28, 14, ampClass === 'Class D' ? 'Filtre LC' : 'Zobel', '#ffaa00')}`;

  const gridH: string[] = []; const gridV: string[] = [];
  for (let i = 0; i < 14; i++) gridH.push(`<line x1="${i * 55}" y1="0" x2="${i * 55}" y2="460" stroke="#161b22" stroke-width="0.5"/>`);
  for (let j = 0; j < 9; j++)  gridV.push(`<line x1="0" y1="${j * 55}" x2="720" y2="${j * 55}" stroke="#161b22" stroke-width="0.5"/>`);

  return `<svg width="720" height="460" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">
    <rect width="720" height="460" fill="#0d1117"/>
    ${gridH.join('')}${gridV.join('')}
    <text x="360" y="22" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#00f2ff">
      Vue 3D PCB — ${icName} — ${ampClass} — +/-${vcc}V / ${rl}Ohm
    </text>
    <line x1="30" y1="28" x2="690" y2="28" stroke="#1e3a5f" stroke-width="0.6"/>
    ${pcb}${pads}${traces}${heatsink}${q1}${q2}${q3}${q4}
    ${ic1}${icPinsList.join('')}
    ${caps}${resistors}${wires}
    <ellipse cx="350" cy="368" rx="200" ry="16" fill="rgba(0,114,255,0.07)"/>
    ${labels}
    <rect x="10" y="368" width="218" height="84" rx="3" fill="rgba(0,0,0,0.82)" stroke="#333" stroke-width="0.8"/>
    <text x="119" y="384" text-anchor="middle" font-size="9" fill="#00f2ff" font-weight="bold">Legende Vue 3D</text>
    <rect x="18" y="392" width="10" height="7" fill="#1a5c1a"/><text x="32" y="399" font-size="7.5" fill="#ccc">PCB FR4</text>
    <rect x="18" y="404" width="10" height="7" fill="#484848"/><text x="32" y="411" font-size="7.5" fill="#ccc">Transistor NPN (${npnOut.substring(0, 8)})</text>
    <rect x="18" y="416" width="10" height="7" fill="#483838"/><text x="32" y="423" font-size="7.5" fill="#ccc">Transistor PNP (${pnpOut.substring(0, 8)})</text>
    <rect x="18" y="428" width="10" height="7" fill="#222244"/><text x="32" y="435" font-size="7.5" fill="#ccc">CI ${icName.substring(0, 10)}</text>
    <rect x="120" y="392" width="10" height="7" fill="#b06828"/><text x="134" y="399" font-size="7.5" fill="#ccc">Resistance</text>
    <rect x="120" y="404" width="10" height="7" fill="#1a3acc"/><text x="134" y="411" font-size="7.5" fill="#ccc">Condensateur</text>
    <rect x="120" y="416" width="10" height="7" fill="#d0d0d0"/><text x="134" y="423" font-size="7.5" fill="#ccc">Dissipateur alum.</text>
    <line x1="120" y1="432" x2="130" y2="432" stroke="#00ff80" stroke-width="2" stroke-dasharray="3,1"/><text x="134" y="436" font-size="7.5" fill="#ccc">Connexions</text>
    <text x="360" y="452" text-anchor="middle" font-size="8" fill="#444">Vue illustrative — positions indicatives — schema normalise pour le cablage reel</text>
  </svg>`;
}

// ============================================================
//  SVG → DATA URL (pour PDF)
// ============================================================
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