// ============================================================
//  Schémas électroniques SVG — Symboles normalisés + numéros de broches
// ============================================================

export function buildClassABSchematic(vcc: number, rl: number): string {
  const gain = (1 + 22000 / 1000).toFixed(0);
  return `<svg width="760" height="400" viewBox="0 0 760 400"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">

    <rect width="760" height="400" fill="white"/>

    <!-- Titre -->
    <text x="380" y="17" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema Classe AB — LM3886 / TDA7294 — +/-${vcc}V / ${rl}Ohm — Gain ${gain}x
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>

    <!-- ══ RAILS ══ -->
    <line x1="10" y1="45" x2="740" y2="45" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="7,3"/>
    <text x="14" y="41" font-size="9.5" fill="#cc2200" font-weight="bold">+VCC (+${vcc}V)</text>
    <line x1="10" y1="355" x2="740" y2="355" stroke="#0033cc" stroke-width="1.2" stroke-dasharray="7,3"/>
    <text x="14" y="364" font-size="9.5" fill="#0033cc" font-weight="bold">-VCC (-${vcc}V)</text>

    <!-- ══ ENTREE AUDIO ══ -->
    <text x="12" y="202" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="62" y1="197" x2="82" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ── C1 Condensateur couplage ── -->
    <line x1="82" y1="187" x2="82" y2="207" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="88" y1="187" x2="88" y2="207" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="88" y1="197" x2="112" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="85" y="179" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">C1</text>
    <text x="85" y="222" text-anchor="middle" font-size="8.5" fill="#333">1 uF</text>

    <!-- ── Rin Resistance entree ── -->
    <rect x="112" y="191" width="28" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="140" y1="197" x2="162" y2="197" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="126" y="181" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rin</text>
    <text x="126" y="215" text-anchor="middle" font-size="8.5" fill="#333">22 kOhm</text>

    <!-- Jonction + input -->
    <circle cx="162" cy="197" r="3" fill="#1a1a2e"/>
    <line x1="162" y1="197" x2="162" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="162" y1="175" x2="182" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ══ TRIANGLE AOP LM3886 ══ -->
    <!-- Triangle: (182,135) haut-gauche, (182,250) bas-gauche, (262,192) apex droit -->
    <polygon points="182,135 182,250 262,192" fill="#eef3ff" stroke="#1a1a2e" stroke-width="2.2"/>

    <!-- Broche + (Pin 1 — entree non-inverseuse) -->
    <line x1="162" y1="175" x2="182" y2="175" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="186" y="179" font-size="10" fill="#006600" font-weight="bold">+</text>
    <!-- Numero de broche Pin 1 -->
    <text x="165" y="171" font-size="7.5" fill="#cc0000" font-weight="bold">1</text>
    <rect x="162" y="162" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>

    <!-- Broche - (Pin 9 — entree inverseuse) -->
    <line x1="148" y1="210" x2="182" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="186" y="214" font-size="10" fill="#cc0000" font-weight="bold">-</text>
    <!-- Numero de broche Pin 9 -->
    <text x="133" y="206" font-size="7.5" fill="#cc0000" font-weight="bold">9</text>
    <rect x="130" y="197" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>

    <!-- Nom du CI -->
    <text x="218" y="186" text-anchor="middle" font-size="9.5" fill="#1a1a2e" font-weight="bold">LM3886</text>
    <text x="218" y="198" text-anchor="middle" font-size="8" fill="#555">/ TDA7294</text>

    <!-- Broche sortie (Pin 5) -->
    <line x1="262" y1="192" x2="320" y2="192" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Numero de broche Pin 5 -->
    <text x="264" y="185" font-size="7.5" fill="#cc0000" font-weight="bold">5</text>
    <rect x="261" y="176" width="12" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.7"/>
    <circle cx="320" cy="192" r="3" fill="#1a1a2e"/>

    <!-- Broches alim +VCC (Pin 6,7) -->
    <line x1="222" y1="45" x2="222" y2="135" stroke="#cc2200" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="224" y="95" font-size="7.5" fill="#cc2200">6,7 (+Vcc)</text>

    <!-- Broches alim -VCC (Pin 4) -->
    <line x1="222" y1="250" x2="222" y2="355" stroke="#0033cc" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="224" y="310" font-size="7.5" fill="#0033cc">4 (-Vcc)</text>

    <!-- ══ RESEAU FEEDBACK ══ -->
    <!-- Montee vers Rfb1 -->
    <line x1="320" y1="192" x2="320" y2="110" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Rfb1 horizontal -->
    <line x1="225" y1="110" x2="248" y2="110" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="248" y="104" width="28" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="276" y1="110" x2="320" y2="110" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="262" y="97" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rfb1</text>
    <text x="262" y="127" text-anchor="middle" font-size="8.5" fill="#333">1 kOhm</text>

    <!-- Jonction entree inverseuse -->
    <circle cx="225" cy="110" r="3" fill="#1a1a2e"/>
    <line x1="225" y1="110" x2="225" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="148" y1="210" x2="225" y2="210" stroke="#1a1a2e" stroke-width="1.8"/>
    <circle cx="148" cy="210" r="3" fill="#1a1a2e"/>

    <!-- Rfb2 vers GND (broche 9 via inverseuse) -->
    <line x1="148" y1="210" x2="148" y2="232" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="141" y="232" width="14" height="28" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="148" y1="260" x2="148" y2="285" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Symbole GND -->
    <line x1="136" y1="285" x2="160" y2="285" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="139" y1="291" x2="157" y2="291" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="142" y1="297" x2="154" y2="297" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="164" y="242" font-size="9" fill="#0033cc" font-weight="bold">Rfb2</text>
    <text x="164" y="254" font-size="8.5" fill="#333">22 kOhm</text>

    <!-- ══ SORTIE ══ -->
    <!-- Rs resistance serie -->
    <rect x="320" y="186" width="26" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="346" y1="192" x2="378" y2="192" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="333" y="176" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rs</text>
    <text x="333" y="212" text-anchor="middle" font-size="8.5" fill="#333">0.22 Ohm</text>

    <!-- ══ RESEAU ZOBEL ══ -->
    <circle cx="378" cy="192" r="3" fill="#1a1a2e"/>
    <line x1="378" y1="192" x2="378" y2="158" stroke="#1a1a2e" stroke-width="1.2"/>
    <!-- Rz -->
    <rect x="372" y="135" width="12" height="24" rx="1" fill="white" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="378" y1="135" x2="378" y2="115" stroke="#1a1a2e" stroke-width="1.2"/>
    <!-- Cz plaques -->
    <line x1="369" y1="115" x2="387" y2="115" stroke="#1a1a2e" stroke-width="2.8"/>
    <line x1="369" y1="109" x2="387" y2="109" stroke="#1a1a2e" stroke-width="2.8"/>
    <line x1="378" y1="109" x2="378" y2="92" stroke="#1a1a2e" stroke-width="1.2"/>
    <!-- GND Zobel -->
    <line x1="368" y1="92" x2="388" y2="92" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="371" y1="97" x2="385" y2="97" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="374" y1="102" x2="382" y2="102" stroke="#1a1a2e" stroke-width="1"/>
    <text x="393" y="148" font-size="8" fill="#555">10 Ohm</text>
    <text x="393" y="115" font-size="8" fill="#555">100 nF</text>
    <text x="393" y="95" font-size="8" fill="#555" font-weight="bold">Zobel</text>

    <!-- ══ HAUT-PARLEUR ══ -->
    <line x1="378" y1="192" x2="415" y2="192" stroke="#1a1a2e" stroke-width="1.8"/>
    <rect x="415" y="177" width="20" height="30" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="435,177 435,207 468,222 468,162" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="451" y1="222" x2="451" y2="290" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- GND HP -->
    <line x1="440" y1="290" x2="462" y2="290" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="443" y1="296" x2="459" y2="296" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="446" y1="302" x2="456" y2="302" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="451" y="235" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="451" y="248" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>

    <!-- ══ CONDENSATEURS DECOUPLAGE ══ -->
    <!-- +VCC -->
    <line x1="580" y1="45" x2="580" y2="68" stroke="#cc2200" stroke-width="1.2"/>
    <line x1="570" y1="68" x2="590" y2="68" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="570" y1="74" x2="590" y2="74" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="580" y1="74" x2="580" y2="98" stroke="#1a1a2e" stroke-width="1.2"/>
    <!-- GND decouplage + -->
    <line x1="572" y1="98" x2="588" y2="98" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="574" y1="104" x2="586" y2="104" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="576" y1="110" x2="584" y2="110" stroke="#1a1a2e" stroke-width="1"/>
    <text x="594" y="65" font-size="8.5" fill="#444" font-weight="bold">100 uF</text>
    <text x="594" y="75" font-size="8.5" fill="#444">+ 100 nF</text>
    <text x="594" y="90" font-size="8" fill="#555">Decouplage +VCC</text>

    <!-- -VCC -->
    <line x1="620" y1="355" x2="620" y2="332" stroke="#0033cc" stroke-width="1.2"/>
    <line x1="610" y1="332" x2="630" y2="332" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="610" y1="326" x2="630" y2="326" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="620" y1="326" x2="620" y2="302" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="612" y1="302" x2="628" y2="302" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="614" y1="296" x2="626" y2="296" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="616" y1="290" x2="624" y2="290" stroke="#1a1a2e" stroke-width="1"/>
    <text x="634" y="332" font-size="8.5" fill="#444" font-weight="bold">100 uF</text>
    <text x="634" y="342" font-size="8.5" fill="#444">+ 100 nF</text>
    <text x="634" y="304" font-size="8" fill="#555">Decouplage -VCC</text>

    <!-- ══ LEGENDE ══ -->
    <rect x="500" y="150" width="195" height="135" rx="4" fill="#f8f9ff" stroke="#bbb" stroke-width="1"/>
    <text x="597" y="167" text-anchor="middle" font-size="10" font-weight="bold" fill="#1a1a2e">Legende symboles</text>
    <line x1="506" y1="172" x2="690" y2="172" stroke="#ddd" stroke-width="0.6"/>

    <!-- Resistance -->
    <line x1="508" y1="186" x2="516" y2="186" stroke="#1a1a2e" stroke-width="1.5"/>
    <rect x="516" y="181" width="20" height="10" rx="1" fill="white" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="536" y1="186" x2="544" y2="186" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="548" y="190" font-size="9" fill="#333">Resistance (R)</text>

    <!-- Condensateur -->
    <line x1="508" y1="207" x2="520" y2="207" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="520" y1="201" x2="520" y2="213" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="526" y1="201" x2="526" y2="213" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="526" y1="207" x2="538" y2="207" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="548" y="211" font-size="9" fill="#333">Condensateur (C)</text>

    <!-- Bobine -->
    <path d="M 508,228 Q 513,220 518,228 Q 523,236 528,228 Q 533,220 538,228"
      fill="none" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="548" y="232" font-size="9" fill="#333">Inductance (L)</text>

    <!-- AOP -->
    <polygon points="508,244 508,258 520,251" fill="#eef3ff" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="548" y="253" font-size="9" fill="#333">Amplificateur IC</text>

    <!-- HP -->
    <rect x="508" y="264" width="10" height="14" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.2"/>
    <polygon points="518,264 518,278 526,282 526,260" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="548" y="274" font-size="9" fill="#333">Haut-parleur (HP)</text>

    <!-- Num broches -->
    <rect x="508" y="276" width="12" height="8" rx="2" fill="none" stroke="#cc0000" stroke-width="0.8"/>
    <text x="514" y="283" font-size="7" fill="#cc0000" font-weight="bold" text-anchor="middle">n</text>
    <text x="548" y="284" font-size="9" fill="#333">Num. broche (rouge)</text>
  </svg>`;
}

export function buildClassDSchematic(vcc: number, rl: number, lUH: number, cUF: number): string {
  const cBulk = Math.ceil((vcc / Math.sqrt(2) / rl) * 100);
  return `<svg width="760" height="400" viewBox="0 0 760 400"
    xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">

    <rect width="760" height="400" fill="white"/>

    <!-- Titre -->
    <text x="380" y="17" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0a0a2e">
      Schema Classe D — IRS2092S + Pont en H IRFZ44N — ${vcc}V / ${rl}Ohm
    </text>
    <line x1="10" y1="22" x2="750" y2="22" stroke="#bbb" stroke-width="0.7"/>

    <!-- ══ RAILS ══ -->
    <line x1="10" y1="45" x2="740" y2="45" stroke="#cc2200" stroke-width="1.2" stroke-dasharray="7,3"/>
    <text x="14" y="41" font-size="9.5" fill="#cc2200" font-weight="bold">VBUS (+${vcc}V DC)</text>
    <line x1="10" y1="355" x2="740" y2="355" stroke="#333" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="14" y="364" font-size="9.5" fill="#333" font-weight="bold">GND</text>

    <!-- ══ ENTREE AUDIO ══ -->
    <text x="12" y="203" font-size="9" fill="#333" font-weight="bold">Audio IN</text>
    <line x1="60" y1="198" x2="82" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Filtre RC entree -->
    <rect x="82" y="192" width="26" height="13" rx="1.5" fill="white" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="108" y1="198" x2="128" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="95" y="181" text-anchor="middle" font-size="9" fill="#0033cc" font-weight="bold">Rin</text>
    <text x="95" y="217" text-anchor="middle" font-size="8.5" fill="#333">10 kOhm</text>

    <!-- Cin vers GND -->
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

    <!-- ══ IRS2092S CI PWM ══ -->
    <rect x="158" y="128" width="100" height="140" rx="5" fill="#eef0ff" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="208" y="148" text-anchor="middle" font-weight="bold" font-size="10" fill="#1a1a2e">IRS2092S</text>
    <text x="208" y="161" text-anchor="middle" font-size="8.5" fill="#555">Ctrl PWM</text>
    <text x="208" y="173" text-anchor="middle" font-size="8" fill="#777">400 kHz</text>

    <!-- Broche IN (Pin 5) -->
    <line x1="128" y1="198" x2="158" y2="198" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="160" y="194" font-size="8" fill="#333">IN</text>
    <!-- Num broche 5 -->
    <text x="130" y="194" font-size="7.5" fill="#cc0000" font-weight="bold">5</text>
    <rect x="127" y="185" width="11" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.8"/>

    <!-- Broche HO (Pin 12) -->
    <line x1="258" y1="165" x2="290" y2="165" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="240" y="161" font-size="8" fill="#333">HO</text>
    <!-- Num broche 12 -->
    <text x="260" y="158" font-size="7.5" fill="#cc0000" font-weight="bold">12</text>
    <rect x="257" y="149" width="14" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.8"/>

    <!-- Broche LO (Pin 9) -->
    <line x1="258" y1="230" x2="290" y2="230" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="240" y="226" font-size="8" fill="#333">LO</text>
    <!-- Num broche 9 -->
    <text x="260" y="222" font-size="7.5" fill="#cc0000" font-weight="bold">9</text>
    <rect x="257" y="213" width="11" height="9" rx="2" fill="none" stroke="#cc0000" stroke-width="0.8"/>

    <!-- Broche VCC CI (Pin 13) -->
    <line x1="208" y1="128" x2="208" y2="45" stroke="#cc2200" stroke-width="0.9" stroke-dasharray="4,2"/>
    <text x="212" y="92" font-size="7.5" fill="#cc2200">13 (VCC)</text>

    <!-- Broche GND CI (Pin 4) -->
    <line x1="208" y1="268" x2="208" y2="295" stroke="#1a1a2e" stroke-width="1.2"/>
    <line x1="199" y1="295" x2="217" y2="295" stroke="#1a1a2e" stroke-width="2.2"/>
    <line x1="202" y1="301" x2="214" y2="301" stroke="#1a1a2e" stroke-width="1.6"/>
    <line x1="205" y1="307" x2="211" y2="307" stroke="#1a1a2e" stroke-width="1"/>
    <text x="220" y="291" font-size="7.5" fill="#333">4 (GND)</text>

    <!-- ══ PONT EN H (4 MOSFETs IRFZ44N) ══ -->
    <rect x="290" y="88" width="148" height="224" rx="5"
      fill="#fff8ee" stroke="#cc6600" stroke-width="1.8" stroke-dasharray="6,2"/>
    <text x="364" y="106" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#cc6600">Pont en H</text>

    <!-- ── Q1 MOSFET haut gauche (IRFZ44N) ── -->
    <!-- Drain -->
    <line x1="320" y1="45" x2="320" y2="112" stroke="#cc2200" stroke-width="1.5"/>
    <!-- Canal MOSFET -->
    <line x1="313" y1="112" x2="320" y2="112" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="313" y1="112" x2="313" y2="140" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="313" y1="140" x2="320" y2="140" stroke="#1a1a2e" stroke-width="1.8"/>
    <!-- Source -->
    <line x1="320" y1="140" x2="320" y2="158" stroke="#1a1a2e" stroke-width="1.5"/>
    <!-- Grille -->
    <line x1="305" y1="126" x2="290" y2="126" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="305" y1="112" x2="305" y2="140" stroke="#1a1a2e" stroke-width="1.5"/>
    <!-- Fleche MOSFET N -->
    <polygon points="315,126 322,121 322,131" fill="#1a1a2e"/>
    <!-- Labels Q1 + num broches -->
    <text x="328" y="114" font-size="9" fill="#0033cc" font-weight="bold">Q1</text>
    <text x="328" y="124" font-size="7.5" fill="#444">IRFZ44N</text>
    <!-- Num broches Q1 -->
    <text x="293" y="121" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="324" y="108" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="324" y="144" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>

    <!-- Grille Q1 vers HO -->
    <line x1="290" y1="165" x2="290" y2="126" stroke="#1a1a2e" stroke-width="1.5"/>

    <!-- ── Q2 MOSFET bas gauche (IRFZ44N) ── -->
    <line x1="320" y1="200" x2="320" y2="218" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="313" y1="218" x2="320" y2="218" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="313" y1="218" x2="313" y2="246" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="313" y1="246" x2="320" y2="246" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="320" y1="246" x2="320" y2="355" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="305" y1="232" x2="290" y2="232" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="305" y1="218" x2="305" y2="246" stroke="#1a1a2e" stroke-width="1.5"/>
    <polygon points="315,232 322,227 322,237" fill="#1a1a2e"/>
    <text x="328" y="222" font-size="9" fill="#0033cc" font-weight="bold">Q2</text>
    <text x="328" y="232" font-size="7.5" fill="#444">IRFZ44N</text>
    <!-- Num broches Q2 -->
    <text x="293" y="228" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="324" y="215" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="324" y="250" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>

    <!-- Grille Q2 vers LO -->
    <line x1="290" y1="230" x2="290" y2="232" stroke="#1a1a2e" stroke-width="1.5"/>

    <!-- Noeud milieu gauche -->
    <circle cx="320" cy="179" r="3.5" fill="#1a1a2e"/>
    <line x1="320" y1="158" x2="320" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- ── Q3 MOSFET haut droit ── -->
    <line x1="408" y1="45" x2="408" y2="112" stroke="#cc2200" stroke-width="1.5"/>
    <line x1="401" y1="112" x2="408" y2="112" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="401" y1="112" x2="401" y2="140" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="401" y1="140" x2="408" y2="140" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="408" y1="140" x2="408" y2="158" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="393" y1="126" x2="380" y2="126" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="393" y1="112" x2="393" y2="140" stroke="#1a1a2e" stroke-width="1.5"/>
    <polygon points="403,126 410,121 410,131" fill="#1a1a2e"/>
    <text x="415" y="114" font-size="9" fill="#0033cc" font-weight="bold">Q3</text>
    <text x="415" y="124" font-size="7.5" fill="#444">IRFZ44N</text>
    <!-- Num broches Q3 -->
    <text x="356" y="122" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="410" y="108" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="410" y="144" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>
    <!-- Grille Q3 via signal HO -->
    <line x1="380" y1="126" x2="380" y2="165" stroke="#1a1a2e" stroke-width="0.9" stroke-dasharray="3,2"/>

    <!-- ── Q4 MOSFET bas droit ── -->
    <line x1="408" y1="200" x2="408" y2="218" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="401" y1="218" x2="408" y2="218" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="401" y1="218" x2="401" y2="246" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="401" y1="246" x2="408" y2="246" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="408" y1="246" x2="408" y2="355" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="393" y1="232" x2="380" y2="232" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="393" y1="218" x2="393" y2="246" stroke="#1a1a2e" stroke-width="1.5"/>
    <polygon points="403,232 410,227 410,237" fill="#1a1a2e"/>
    <text x="415" y="222" font-size="9" fill="#0033cc" font-weight="bold">Q4</text>
    <text x="415" y="232" font-size="7.5" fill="#444">IRFZ44N</text>
    <!-- Num broches Q4 -->
    <text x="356" y="228" font-size="7" fill="#cc0000" font-weight="bold">G(1)</text>
    <text x="410" y="215" font-size="7" fill="#cc0000" font-weight="bold">D(2)</text>
    <text x="410" y="250" font-size="7" fill="#cc0000" font-weight="bold">S(3)</text>
    <line x1="380" y1="232" x2="380" y2="230" stroke="#1a1a2e" stroke-width="0.9" stroke-dasharray="3,2"/>

    <!-- Noeud milieu droit -->
    <circle cx="408" cy="179" r="3.5" fill="#1a1a2e"/>
    <line x1="408" y1="158" x2="408" y2="200" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Rails dans le pont -->
    <line x1="320" y1="45" x2="408" y2="45" stroke="#cc2200" stroke-width="1.8"/>
    <line x1="320" y1="355" x2="408" y2="355" stroke="#333" stroke-width="1.2"/>

    <!-- ══ FILTRE LC SORTIE ══ -->
    <line x1="320" y1="179" x2="440" y2="179" stroke="#1a1a2e" stroke-width="2.2"/>

    <!-- Inductance L (bobine) -->
    <path d="M 440,179 Q 447,164 454,179 Q 461,194 468,179 Q 475,164 482,179 Q 489,194 496,179"
      fill="none" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="496" y1="179" x2="520" y2="179" stroke="#1a1a2e" stroke-width="2.2"/>
    <text x="468" y="163" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">L</text>
    <text x="468" y="200" text-anchor="middle" font-size="8.5" fill="#333">${lUH} uH</text>

    <!-- Condensateur C vers GND -->
    <circle cx="520" cy="179" r="3.5" fill="#1a1a2e"/>
    <line x1="520" y1="179" x2="520" y2="205" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="508" y1="205" x2="532" y2="205" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="508" y1="212" x2="532" y2="212" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="520" y1="212" x2="520" y2="238" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="510" y1="238" x2="530" y2="238" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="513" y1="244" x2="527" y2="244" stroke="#1a1a2e" stroke-width="1.8"/>
    <line x1="516" y1="250" x2="524" y2="250" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="535" y="207" font-size="9.5" fill="#0033cc" font-weight="bold">C</text>
    <text x="535" y="218" font-size="8.5" fill="#333">${cUF} uF</text>

    <line x1="520" y1="179" x2="560" y2="179" stroke="#1a1a2e" stroke-width="2.2"/>

    <!-- ══ HAUT-PARLEUR ══ -->
    <rect x="560" y="163" width="20" height="32" rx="1" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <polygon points="580,163 580,195 610,210 610,148" fill="#ddeeff" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="594" y="223" text-anchor="middle" font-size="9.5" fill="#0033cc" font-weight="bold">HP</text>
    <text x="594" y="236" text-anchor="middle" font-size="9" fill="#333">${rl} Ohm</text>
    <line x1="594" y1="210" x2="594" y2="355" stroke="#1a1a2e" stroke-width="1.8"/>

    <!-- Retour GND via Q2/Q4 -->
    <line x1="408" y1="179" x2="440" y2="179" stroke="#1a1a2e" stroke-width="1"/>
    <line x1="440" y1="179" x2="440" y2="310" stroke="#1a1a2e" stroke-width="1"/>
    <line x1="440" y1="310" x2="594" y2="310" stroke="#1a1a2e" stroke-width="1"/>
    <line x1="594" y1="310" x2="594" y2="210" stroke="#1a1a2e" stroke-width="1"/>

    <!-- ══ CONDENSATEUR BUS ══ -->
    <line x1="680" y1="45" x2="680" y2="72" stroke="#cc2200" stroke-width="1.2"/>
    <line x1="669" y1="72" x2="691" y2="72" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="669" y1="79" x2="691" y2="79" stroke="#1a1a2e" stroke-width="3.5"/>
    <line x1="680" y1="79" x2="680" y2="355" stroke="#1a1a2e" stroke-width="1.2"/>
    <text x="695" y="68" font-size="8.5" fill="#0033cc" font-weight="bold">Cbulk</text>
    <text x="695" y="79" font-size="8.5" fill="#444">${cBulk} uF</text>
    <text x="695" y="90" font-size="8" fill="#555">/${Math.ceil(vcc * 1.3)}V ESR-</text>

    <!-- ══ LEGENDE ══ -->
    <rect x="455" y="268" width="195" height="78" rx="4" fill="#f8f9ff" stroke="#bbb" stroke-width="1"/>
    <text x="552" y="283" text-anchor="middle" font-size="10" font-weight="bold" fill="#1a1a2e">Legende</text>
    <line x1="460" y1="287" x2="645" y2="287" stroke="#ddd" stroke-width="0.6"/>
    <!-- Bobine -->
    <path d="M 463,302 Q 468,294 473,302 Q 478,310 483,302"
      fill="none" stroke="#1a1a2e" stroke-width="1.8"/>
    <text x="488" y="305" font-size="9" fill="#333">Inductance (L)</text>
    <!-- Capa -->
    <line x1="463" y1="321" x2="474" y2="321" stroke="#1a1a2e" stroke-width="2.5"/>
    <line x1="463" y1="327" x2="474" y2="327" stroke="#1a1a2e" stroke-width="2.5"/>
    <text x="488" y="325" font-size="9" fill="#333">Condensateur (C)</text>
    <!-- MOSFET -->
    <line x1="463" y1="340" x2="467" y2="340" stroke="#1a1a2e" stroke-width="1.5"/>
    <line x1="467" y1="335" x2="467" y2="345" stroke="#1a1a2e" stroke-width="3"/>
    <polygon points="468,340 474,336 474,344" fill="#1a1a2e"/>
    <line x1="474" y1="335" x2="474" y2="345" stroke="#1a1a2e" stroke-width="3"/>
    <line x1="474" y1="340" x2="480" y2="340" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="488" y="344" font-size="9" fill="#333">MOSFET N-Ch G(1)D(2)S(3)</text>
  </svg>`;
}

export async function svgToDataURL(svgString: string, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject('canvas error'); return; }
    ctx.scale(2, 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png', 1.0));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject('SVG render error'); };
    img.src = url;
  });
}