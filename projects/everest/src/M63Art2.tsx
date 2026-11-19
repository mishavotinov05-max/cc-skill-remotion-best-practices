import React from 'react';
import {clamp, lerp, rnd, mixc, Tx, Glow, poseStand, poseWalk, poseSit, poseReach, E} from './M60Base';
import {Full, Chars, CS, VASYA, MAXL, NIKL, MEDIC, CROWD, WORKER, CityScene} from './M63Art1';

// ---------------- apartment ----------------
export const Room: React.FC<{t: number; hot: number; dark: number; blinds: number; chars: CS[]; bed?: boolean}> = ({t, hot, dark, blinds, chars, bed}) => {
  const wall = mixc('#e8dcc6', '#cdb48c', hot);
  return (
    <g>
      <Full c={wall} />
      <rect x={-1500} y={820} width={7200} height={400} fill={mixc('#b08a5a', '#9a7a52', hot)} />
      <rect x={-1500} y={808} width={7200} height={14} fill="#f2ead8" />
      {/* window */}
      <g transform="translate(560 420)">
        <rect x={-220} y={-250} width={440} height={500} fill="#bfe0f0" stroke="#f6f2ea" strokeWidth={18} />
        <svg x={-210} y={-240} width={420} height={480} viewBox="0 0 420 480" overflow="hidden"><g transform="scale(0.32) translate(-100 -300)"><CityScene t={t} p={{hot: hot * 0.9, cars: 0.6, cx: 960}} /></g></svg>
        <rect x={-210} y={-240} width={420} height={blinds * 480} fill="#d9d3c4" />
        {Array.from({length: Math.round(blinds * 24)}).map((_, i) => <rect key={i} x={-210} y={-240 + i * 20} width={420} height={4} fill="#a49c8a" />)}
        <line x1={0} y1={-250} x2={0} y2={250} stroke="#f6f2ea" strokeWidth={10} />
      </g>
      {/* sun patch on floor */}
      <polygon points="420,830 700,830 1120,1080 560,1080" fill="#ffd84a" opacity={(1 - blinds) * (0.28 + hot * 0.16)} />
      {/* furniture */}
      {bed && <g transform="translate(1230 880)"><rect x={-230} y={-105} width={460} height={105} rx={14} fill="#8a6a4a" /><rect x={-224} y={-120} width={448} height={40} rx={16} fill="#e8e2d6" /><rect x={-224} y={-136} width={120} height={30} rx={14} fill="#fff" /><rect x={-100} y={-124} width={320} height={28} rx={12} fill="#7aa0c8" opacity={0.9} /></g>}
      <g transform="translate(1760 820)"><rect x={-260} y={-260} width={520} height={30} fill="#7a5a3a" /><rect x={-250} y={-230} width={20} height={230} fill="#6a4a2a" /><rect x={230} y={-230} width={20} height={230} fill="#6a4a2a" /><rect x={-180} y={-330} width={110} height={70} rx={6} fill="#2a2f38" /><rect x={-170} y={-322} width={90} height={54} fill="#5a8fc0" opacity={dark > 0.5 ? 0 : 0.7} /><rect x={90} y={-320} width={70} height={60} rx={10} fill="#d8d0c0" /></g>
      <g transform="translate(1000 820)"><rect x={-40} y={-120} width={80} height={120} fill="#6a4a2a" /></g>
      <Chars list={chars} />
      <rect x={-1500} y={-600} width={7200} height={1900} fill="#05070d" opacity={dark * 0.74} />
    </g>
  );
};

export const WindowClose: React.FC<{t: number; blinds: number; hot: number}> = ({t, blinds, hot}) => (
  <g>
    <Full c="#e8dcc6" />
    <g transform="translate(960 540)">
      <rect x={-520} y={-420} width={1040} height={840} fill="#f6f2ea" />
      <svg x={-480} y={-380} width={960} height={760} viewBox="0 0 960 760" overflow="hidden"><g transform="scale(0.7) translate(-40 -120)"><CityScene t={t} p={{hot: hot * 0.8, cars: 0.5, cx: 960}} /></g></svg>
      {blinds > 0 && <g>
        <rect x={-480} y={-380} width={960} height={blinds * 760} fill="#d9d3c4" />
        {Array.from({length: Math.round(blinds * 38)}).map((_, i) => <rect key={i} x={-480} y={-380 + i * 20} width={960} height={4} fill="#a49c8a" />)}
        <rect x={-480} y={-380 + blinds * 760 - 8} width={960} height={14} fill="#8a826e" />
      </g>}
      <line x1={0} y1={-420} x2={0} y2={420} stroke="#f6f2ea" strokeWidth={14} />
    </g>
    <polygon points="500,400 1400,400 1900,1100 100,1100" fill="#ffd84a" opacity={(1 - blinds) * 0.18} />
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#05070d" opacity={blinds * 0.18} />
  </g>
);

export const ThermoWall: React.FC<{t: number; val: number; digital?: boolean}> = ({t, val, digital}) => {
  const f = clamp((val - 20) / 40);
  const col = val >= 50 ? '#ff4a3a' : val >= 40 ? '#ff8a2a' : '#ffbf40';
  return (
    <g>
      <Full c="#e8dcc6" />
      <rect x={-1500} y={820} width={7200} height={400} fill="#b08a5a" />
      {digital ? (
        <g transform="translate(960 540)"><rect x={-340} y={-220} width={680} height={440} rx={40} fill="#15181e" stroke="#3a4050" strokeWidth={10} /><Tx x={0} y={60} size={230} fill={col}>{`+${Math.round(val)}°`}</Tx><Tx x={0} y={-130} size={46} fill="#9fb4d0">ВНУТРИ</Tx></g>
      ) : (
        <g transform="translate(960 540)">
          <rect x={-90} y={-440} width={180} height={880} rx={50} fill="#f6f2ea" stroke="#7a6a52" strokeWidth={10} />
          <rect x={-18} y={-380} width={36} height={640} rx={18} fill="#d8d2c4" />
          <rect x={-18} y={260 - f * 640} width={36} height={f * 640 + 20} rx={18} fill={col} />
          <circle cx={0} cy={310} r={50} fill={col} />
          {Array.from({length: 9}).map((_, i) => <g key={i}><line x1={30} y1={-340 + i * 70} x2={70} y2={-340 + i * 70} stroke="#5a5448" strokeWidth={5} /><Tx x={118} y={-326 + i * 70} size={30} fill="#5a5448">{String(60 - i * 5)}</Tx></g>)}
          <Tx x={-300} y={-60} size={150} fill={col}>{`${Math.round(val)}°`}</Tx>
        </g>
      )}
      <rect x={-1500} y={-600} width={7200} height={1900} fill="#ff8a2a" opacity={clamp((val - 38) / 40) * 0.2} />
    </g>
  );
};

export const TapScene: React.FC<{t: number; flow: number; fill: number}> = ({t, flow, fill}) => (
  <g>
    <Full c="#d8d4c8" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={-300 + i * 220} y={-200} width={4} height={1300} fill="#c0baa8" />)}
    <rect x={-300} y={820} width={3000} height={400} fill="#8a6a4a" />
    <g transform="translate(820 560)">
      <path d="M-120 0 L-120 -140 Q-120 -230 -30 -230 L130 -230 L130 -190 L-20 -190 Q-70 -190 -70 -140 L-70 0 Z" fill="#c0c8d4" stroke="#7a8494" strokeWidth={6} />
      <rect x={110} y={-200} width={36} height={60} rx={8} fill="#a8b0bc" />
      {flow > 0.02 && <rect x={120 - flow * 2.5} y={-140} width={5 + flow * 6} height={340} fill="#6fb8ff" opacity={0.9} />}
      {flow <= 0.02 && <circle cx={128} cy={-130 + ((t * 80) % 160)} r={6} fill="#6fb8ff" opacity={0.8} />}
      <rect x={-260} y={250} width={680} height={110} rx={20} fill="#a8b0bc" stroke="#7a8494" strokeWidth={6} />
    </g>
    {[0, 1, 2, 3].map((i) => {
      const lvl = clamp(fill * 4 - i);
      return (
        <g key={i} transform={`translate(${1300 + i * 140} 830)`}>
          <rect x={-40} y={-240} width={80} height={240} rx={20} fill="#cfe6f7" opacity={0.55} stroke="#8aa8c0" strokeWidth={4} />
          <rect x={-36} y={-8 - lvl * 220} width={72} height={lvl * 220} rx={16} fill="#6fb8ff" opacity={0.85} />
          <rect x={-18} y={-262} width={36} height={26} rx={6} fill="#2f6ea8" />
        </g>
      );
    })}
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#ff8a2a" opacity={0.1} />
  </g>
);

// ---------------- hallway ----------------
export const Hall: React.FC<{t: number; dark: number; door: number; nik: number; chars: CS[]; beam?: boolean}> = ({t, dark, door, nik, chars, beam}) => {
  const flick = dark > 0 ? 0.6 + 0.4 * Math.sin(t * 17) * Math.sin(t * 5) : 1;
  return (
    <g>
      <Full c="#cfc6b4" />
      <rect x={-1500} y={840} width={7200} height={400} fill="#6a5a48" />
      <rect x={-1500} y={820} width={7200} height={26} fill="#4a3f32" />
      {/* apartment door */}
      <g transform="translate(560 840)">
        <rect x={-150} y={-540} width={300} height={540} fill="#5a3a24" stroke="#2a1a0e" strokeWidth={8} />
        <g transform={`translate(-150 0)`}><path d={`M0 -540 L${300 - door * 180} ${-540 - door * 20} L${300 - door * 180} ${door * 20} L0 0 Z`} fill="#7a4a2a" stroke="#2a1a0e" strokeWidth={6} opacity={door > 0 ? 1 : 0} /></g>
        {door <= 0 && <><circle cx={0} cy={-340} r={10} fill="#c0c4cc" /><circle cx={100} cy={-260} r={14} fill="#c9b080" /></>}
        <rect x={-70} y={-480} width={140} height={60} fill="#e8e0d0" /><Tx x={0} y={-436} size={40} fill="#3a2a1a">№ 94</Tx>
      </g>
      {/* lift */}
      <g transform="translate(1560 840)">
        <rect x={-190} y={-520} width={380} height={520} fill="#8a919e" stroke="#4a5058" strokeWidth={8} />
        <rect x={-6} y={-510} width={12} height={500} fill="#4a5058" />
        <rect x={-80} y={-580} width={160} height={50} fill="#15181e" /><Tx x={0} y={-543} size={34} fill="#ff4a3a">{dark > 0 ? '--' : '9'}</Tx>
        <circle cx={230} cy={-300} r={14} fill={dark > 0 ? '#555' : '#ffbf40'} />
      </g>
      {/* ceiling lamp */}
      <g transform="translate(1060 60)"><rect x={-70} y={-20} width={140} height={20} rx={8} fill="#e8e8ee" /><rect x={-60} y={0} width={120} height={14} fill="#fff6c8" opacity={dark > 0 ? 0.3 * flick : 0.9} /></g>
      <Chars list={chars} />
      {nik > 0 && <Chars list={[{look: NIKL, x: 1480, y: 1030, pose: poseStand({mood: 'scared', lean: 4, hip: [0, -60], hf: [80, -60], hb: [30, -50], lf: [60, 0], lb: [40, 0]}), lie: -86, s: 1.15}]} />}
      <rect x={-1500} y={-600} width={7200} height={1900} fill="#030508" opacity={dark * 0.8} />
      {beam && <polygon points="1060,620 2400,300 2400,1100" fill="#fff6c8" opacity={0.16} />}
      {beam && <Glow x={1100} y={640} r={420} c="#fff6c8" o={0.25} id="hb63" />}
    </g>
  );
};

export const Stairs: React.FC<{t: number; prog: number; crack: number; floor: string; chars?: boolean}> = ({t, prog, crack, floor, chars = true}) => {
  const sx = (p: number) => 200 + p * 1500, sy = (p: number) => 640 + p * 340;
  const steps = Array.from({length: 16});
  const shards = crack > 0.9 ? Array.from({length: 18}) : [];
  return (
    <g>
      <Full c="#bfb6a4" />
      <rect x={-1500} y={0} width={7200} height={130} fill="#9a917e" />
      {/* glass window */}
      <g transform="translate(1300 400)">
        <rect x={-260} y={-210} width={520} height={420} fill="#bfe0f0" stroke="#6a717c" strokeWidth={16} />
        <rect x={-250} y={-200} width={500} height={400} fill="#ffe7a0" opacity={0.3} />
        {crack > 0 && <g stroke="#fff" strokeOpacity={0.9} strokeWidth={4} fill="none"><path d={`M0 0 L${-120 * crack} ${-150 * crack} M0 0 L${160 * crack} ${-100 * crack} M0 0 L${-100 * crack} ${130 * crack} M0 0 L${140 * crack} ${150 * crack} M0 0 L${10 * crack} ${-190 * crack}`} /><path d={`M${-60 * crack} ${-70 * crack} L${-30 * crack} ${-100 * crack} M${70 * crack} ${70 * crack} L${100 * crack} ${40 * crack}`} /></g>}
        {crack > 0.9 && <rect x={-250} y={-200} width={500} height={400} fill="#fff" opacity={0.2} />}
      </g>
      {steps.map((_, i) => <g key={i}><rect x={sx(i / 15)} y={sy(i / 15)} width={130} height={26} fill="#8a8f98" /><rect x={sx(i / 15)} y={sy(i / 15) + 26} width={130} height={44} fill="#6a707a" /></g>)}
      <line x1={sx(0)} y1={sy(0) - 120} x2={sx(1) + 130} y2={sy(1) - 120} stroke="#3a4050" strokeWidth={12} />
      {steps.map((_, i) => i % 2 === 0 && <line key={i} x1={sx(i / 15) + 30} y1={sy(i / 15) - 120} x2={sx(i / 15) + 30} y2={sy(i / 15)} stroke="#3a4050" strokeWidth={7} />)}
      <g transform="translate(330 470)"><rect x={-120} y={-100} width={240} height={200} rx={16} fill="#2f6ea8" /><Tx x={0} y={40} size={170} fill="#fff">{floor}</Tx></g>
      {chars && <Chars list={[
        {look: VASYA, x: sx(prog) + 160, y: sy(prog) + 4, pose: poseWalk(t, 2.6, 10), s: 1.5},
        {look: NIKL, x: sx(Math.max(0, prog - 0.1)) + 160, y: sy(Math.max(0, prog - 0.1)) + 4, pose: crack > 0 && crack < 1 ? poseStand({mood: 'worried', lean: 10, nod: 10}) : poseWalk(t + 0.4, 2.0, 12), s: 1.5},
      ]} />}
      {shards.map((_, i) => {
        const a = ((t - 0) * 1.6 + rnd(i)) % 1;
        return <polygon key={i} points="0,0 14,6 6,18" fill="#dff2fb" opacity={0.85 * (1 - a)} transform={`translate(${1300 + (rnd(i + 4) - 0.5) * 460 + a * 80} ${400 + a * 560}) rotate(${a * 400})`} />;
      })}
    </g>
  );
};

export const TechRoom: React.FC<{t: number; sit: boolean; worker: boolean; chars?: CS[]}> = ({t, sit, worker, chars}) => (
  <g>
    <Full c="#dfe6ec" />
    <rect x={-1500} y={820} width={7200} height={400} fill="#8a919e" />
    <rect x={-1500} y={0} width={7200} height={90} fill="#c0c8d4" />
    {Array.from({length: 4}).map((_, i) => <rect key={i} x={-300 + i * 700} y={40} width={300} height={22} fill="#fff" opacity={0.95} />)}
    {[300, 1500, 2300].map((x, i) => <g key={x} transform={`translate(${x} 480)`}><circle r={130} fill="#2a2f38" /><circle r={110} fill="#14171c" />{[0, 1, 2, 3].map((k) => <path key={k} d="M0 0 Q-30 -60 0 -104 Q30 -60 0 0 Z" fill="#8a919e" transform={`rotate(${k * 90 + t * 700 * (1 + i * 0.1)})`} />)}<circle r={16} fill="#3a4050" /></g>)}
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${340 + i * 40} 620 q60 ${60 + i * 8} 140 ${100 + i * 20}`} stroke="#bfe3ff" strokeOpacity={0.45} strokeWidth={5} fill="none" />)}
    <g transform="translate(1000 820)"><rect x={-40} y={-90} width={80} height={14} fill="#4a5262" /><rect x={-4} y={-76} width={8} height={76} fill="#4a5262" /><rect x={-50} y={-4} width={100} height={8} fill="#4a5262" /></g>
    <rect x={1900} y={600} width={0} height={0} />
    <Chars list={chars ?? [{look: VASYA, x: 1000, y: 828, pose: sit ? poseSit({mood: 'worried', nod: 14}) : poseWalk(t, 2.4, 6), s: 1.5, flip: false}, ...(worker ? [{look: WORKER, x: 1420, y: 1000, pose: poseReach(70, -110, {lean: 14}), flip: true, s: 1.4}] : [])]} />
  </g>
);

// ---------------- phone ----------------
const BG = '#0d1420';
export const Phone: React.FC<{t: number; mode: string; k?: number}> = ({t, mode, k = 1}) => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  const hdr = (c: string, txt: string) => <g><rect x={-250} y={-450} width={500} height={110} fill={c} /><Tx x={0} y={-380} size={34} fill="#fff">{txt}</Tx></g>;
  let body: React.ReactNode = null;
  if (mode === 'alert') body = <g>{hdr('#c0392b', 'ЭКСТРЕННОЕ СООБЩЕНИЕ')}<Tx x={0} y={-220} size={44} fill="#ff8a7a">АНОМАЛЬНАЯ ЖАРА</Tx><Tx x={0} y={-80} size={150} fill="#fff">+60°C</Tx><Tx x={0} y={50} size={40} fill="#cfd6e0">ПРОДЛИТСЯ 72 ЧАСА</Tx><Tx x={0} y={180} size={36} fill="#9fb4d0">ОСТАВАЙТЕСЬ ДОМА</Tx><Tx x={0} y={240} size={36} fill="#9fb4d0">ПЕЙТЕ ВОДУ</Tx></g>;
  if (mode === 'forecast') body = <g>{hdr('#e8862a', 'ПРОГНОЗ ПОГОДЫ')}<circle cx={0} cy={-170} r={70 + pulse * 6} fill="#ffd23a" />{Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-282} width={8} height={30} rx={4} fill="#ffd23a" transform={`rotate(${i * 30} 0 -170)`} />)}<Tx x={0} y={90} size={190} fill="#ff5a3a">{`+${Math.round(lerp(36, 60, E(k, 0, 1)))}°`}</Tx><Tx x={0} y={190} size={38} fill="#cfd6e0">СЛЕДУЮЩИЕ 72 ЧАСА</Tx></g>;
  if (mode === 'call') body = <g>{hdr('#2f6ea8', 'ВЫЗОВ')}<circle cx={0} cy={-80} r={90} fill="#1f3a58" />{[0, 1, 2].map((i) => <circle key={i} cx={0} cy={-80} r={110 + ((t * 70 + i * 40) % 120)} fill="none" stroke="#6fb8ff" strokeOpacity={0.5 - ((t * 70 + i * 40) % 120) / 260} strokeWidth={5} />)}<Tx x={0} y={-60} size={80} fill="#fff">112</Tx><Tx x={0} y={140} size={46} fill="#fff">СПАСАТЕЛИ</Tx><Tx x={0} y={200} size={32} fill="#9fb4d0">идёт соединение…</Tx><circle cx={0} cy={330} r={46} fill="#c0392b" /></g>;
  if (mode === 'bldg') body = <g>{hdr('#c0392b', '⚠ ПРЕДУПРЕЖДЕНИЕ')}<Tx x={0} y={-200} size={42} fill="#ff8a7a">ТЕМПЕРАТУРА В ЗДАНИИ</Tx><Tx x={0} y={-140} size={42} fill="#ff8a7a">КРИТИЧЕСКАЯ</Tx><rect x={-190} y={-70} width={380} height={44} rx={22} fill="#2a1a18" /><rect x={-190} y={-70} width={380 * 0.93} height={44} rx={22} fill="#ff3b3b" opacity={0.7 + pulse * 0.3} /><Tx x={0} y={120} size={110} fill="#fff">+58°</Tx><Tx x={0} y={200} size={34} fill="#cfd6e0">ПОКИНЬТЕ ПОМЕЩЕНИЕ</Tx></g>;
  if (mode === 'msgmax') body = <g>{hdr('#2f6ea8', 'МАКС')}<g transform="translate(-200 -290)"><rect width={380} height={150} rx={24} fill="#1f3a58" /><Tx x={190} y={60} size={34} fill="#fff">Вась, я застрял</Tx><Tx x={190} y={104} size={34} fill="#fff">у супермаркета</Tx></g><g transform="translate(-170 -110)"><rect width={380} height={150} rx={24} fill="#1f3a58" /><Tx x={190} y={60} size={34} fill="#fff">Воды почти нет,</Tx><Tx x={190} y={104} size={34} fill="#fff">вокруг толпа</Tx></g></g>;
  if (mode === 'map') body = <g>{hdr('#2a7a4a', 'ПУНКТЫ ОХЛАЖДЕНИЯ')}<rect x={-250} y={-340} width={500} height={760} fill="#1a2a24" />{[-200, -100, 0, 100, 200].map((x) => <line key={x} x1={x} y1={-340} x2={x} y2={420} stroke="#2a4a3a" strokeWidth={4} />)}{[-250, -130, -10, 110, 230, 340].map((y) => <line key={y} x1={-250} y1={y} x2={250} y2={y} stroke="#2a4a3a" strokeWidth={4} />)}{[[-120, -220, 1], [100, -140, 0], [-60, 20, 0], [150, 120, 1], [-140, 200, 0], [40, 300, 0]].map(([x, y, ok], i) => <g key={i}><circle cx={x} cy={y} r={26} fill={ok ? '#3bff7a' : '#ff3b3b'} opacity={0.9} />{!ok && <g stroke="#fff" strokeWidth={6}><line x1={x - 12} y1={y - 12} x2={x + 12} y2={y + 12} /><line x1={x + 12} y1={y - 12} x2={x - 12} y2={y + 12} /></g>}</g>)}{k > 0.5 && <g transform="translate(0 60)"><rect x={-210} y={-50} width={420} height={110} rx={16} fill="#0a0c10" stroke="#ff3b3b" strokeWidth={5} /><Tx x={0} y={-6} size={34} fill="#ff8a7a">ЗАКРЫТ ВЧЕРА</Tx><Tx x={0} y={36} size={34} fill="#fff">18:40 · ДО ЖАРЫ</Tx></g>}</g>;
  if (mode === 'voice') body = <g>{hdr('#2f6ea8', 'МАКС · ГОЛОСОВОЕ')}<rect x={-220} y={-200} width={440} height={170} rx={28} fill="#1f3a58" /><circle cx={-160} cy={-115} r={34} fill="#6fb8ff" /><polygon points="-170,-132 -170,-98 -142,-115" fill="#0d1420" />{Array.from({length: 22}).map((_, i) => <rect key={i} x={-110 + i * 14} y={-115 - (6 + Math.abs(Math.sin(i * 1.7 + t * 9)) * 44 * (0.4 + 0.6 * Math.abs(Math.sin(t * 3.1 + i)))) / 2} width={7} height={6 + Math.abs(Math.sin(i * 1.7 + t * 9)) * 44 * (0.4 + 0.6 * Math.abs(Math.sin(t * 3.1 + i)))} rx={3.5} fill="#fff" opacity={0.9} />)}<Tx x={150} y={-48} size={26} fill="#9fb4d0">0:14</Tx></g>;
  if (mode === 'missed') body = <g>{hdr('#555a63', 'ЗВОНКИ')}{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(0 ${-250 + i * 130})`}><rect x={-230} y={0} width={460} height={100} rx={18} fill="#1a2230" /><circle cx={-170} cy={50} r={26} fill="#c0392b" /><Tx x={-20} y={44} size={34} fill="#fff">Макс</Tx><Tx x={10} y={82} size={26} fill="#ff8a7a">пропущенный</Tx><Tx x={190} y={60} size={26} fill="#9fb4d0">{`${i * 6 + 8} мин`}</Tx></g>)}</g>;
  if (mode === 'notice18') body = <g>{hdr('#e8862a', 'НИКОЛАЙ · СООБЩЕНИЕ')}<rect x={-220} y={-260} width={440} height={190} rx={24} fill="#1f3a58" /><Tx x={0} y={-190} size={32} fill="#fff">Опасный прогноз был</Tx><Tx x={0} y={-146} size={32} fill="#fff">у властей заранее</Tx><rect x={-230} y={-30} width={460} height={150} rx={20} fill="#3a0a08" stroke="#ff3b3b" strokeWidth={5} /><Tx x={0} y={36} size={38} fill="#ff8a7a">ПРОГНОЗ ПОЛУЧЕН</Tx><Tx x={0} y={90} size={52} fill="#fff">ЗА 18 ЧАСОВ</Tx></g>;
  if (mode === 'ended') body = <g>{hdr('#2a7a4a', 'ОПОВЕЩЕНИЕ')}<circle cx={0} cy={-180} r={80} fill="#1f5a38" /><path d="M-40 -180 L-10 -148 L44 -216" stroke="#3bff7a" strokeWidth={16} fill="none" strokeLinecap="round" /><Tx x={0} y={0} size={44} fill="#7fffa8">АНОМАЛЬНАЯ ЖАРА</Tx><Tx x={0} y={56} size={44} fill="#7fffa8">ЗАВЕРШИЛАСЬ</Tx><Tx x={0} y={210} size={130} fill="#fff">+34°</Tx></g>;
  if (mode === 'coords') body = <g>{hdr('#2f6ea8', 'ГЕОЛОКАЦИЯ')}<rect x={-250} y={-340} width={500} height={540} fill="#1a2a24" />{[-200, -100, 0, 100, 200].map((x) => <line key={x} x1={x} y1={-340} x2={x} y2={200} stroke="#2a4a3a" strokeWidth={4} />)}<circle cx={80} cy={-90} r={50 + pulse * 20} fill="#ff3b3b" opacity={0.25} /><circle cx={80} cy={-90} r={18} fill="#ff3b3b" /><rect x={-210} y={240} width={420} height={80} rx={16} fill="#2a7a4a" /><Tx x={0} y={292} size={32} fill="#fff">МЕСТО МАКСА ОТПРАВЛЕНО</Tx></g>;
  if (mode === 'time40') body = <g>{hdr('#c0392b', 'ЭВАКУАЦИЯ РАЙОНА')}<Tx x={0} y={-130} size={34} fill="#ff8a7a">ПОСАДКА ЧЕРЕЗ</Tx><Tx x={0} y={60} size={190} fill="#fff">40:00</Tx></g>;
  return (
    <g>
      <Full c="#161a22" />
      <Glow x={960} y={540} r={900} c="#6fb8ff" o={0.1} id="ph63" />
      <g transform="translate(960 585) scale(0.92)">
        <rect x={-290} y={-490} width={580} height={980} rx={64} fill="#05070b" stroke="#3a4050" strokeWidth={10} />
        <rect x={-262} y={-462} width={524} height={924} rx={44} fill={BG} />
        <g transform="translate(0 0)" clipPath="url(#ph63c)"><clipPath id="ph63c"><rect x={-262} y={-462} width={524} height={924} rx={44} /></clipPath>{body}</g>
        <rect x={-60} y={-470} width={120} height={22} rx={11} fill="#05070b" />
      </g>
    </g>
  );
};

export const Desk: React.FC<{t: number; item: number}> = ({t, item}) => (
  <g>
    <Full c="#3a2c20" />
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#6a4a2a" opacity={0.0} />
    <g transform="translate(960 600)">
      <rect x={-900} y={-340} width={1800} height={700} rx={30} fill="#7a5a3a" />
      <g transform="translate(-520 -60)" opacity={item >= 0 ? 1 : 0.3}>
        <rect x={-130} y={-100} width={260} height={200} rx={50} fill="#2a303b" stroke="#15181e" strokeWidth={6} /><rect x={-90} y={-60} width={180} height={90} rx={20} fill="#3a4250" /><rect x={-24} y={-120} width={48} height={30} rx={12} fill="#15181e" />
        {item === 0 && <rect x={-150} y={-120} width={300} height={240} rx={60} fill="none" stroke="#ffd84a" strokeWidth={6} opacity={0.7} />}
      </g>
      <g transform="translate(-130 -40) rotate(-14)">
        <rect x={-130} y={-24} width={200} height={48} rx={12} fill="#2a2f38" /><rect x={70} y={-32} width={70} height={64} rx={10} fill="#e0a22a" /><circle cx={142} cy={0} r={24} fill="#fff6c8" opacity={item >= 1 ? 1 : 0.5} />
        {item === 1 && <polygon points="150,-14 700,-120 700,120 150,14" fill="#fff6c8" opacity={0.25} />}
      </g>
      <g transform="translate(260 -50)"><rect x={-100} y={-60} width={200} height={120} rx={14} fill="#2a2f38" stroke="#15181e" strokeWidth={5} />{[0, 1, 2, 3].map((i) => <rect key={i} x={-70 + i * 36} y={34} width={22} height={12} rx={3} fill={item === 2 ? '#3bff7a' : '#4a5262'} />)}<Tx x={0} y={-10} size={30} fill="#9fb4d0">POWER</Tx></g>
      <g transform="translate(640 -60) rotate(8)"><rect x={-110} y={-130} width={220} height={260} fill="#f2ead8" /><rect x={-110} y={-130} width={220} height={260} fill="none" stroke="#a49c8a" strokeWidth={4} />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-80} y={-96 + i * 40} width={160} height={8} fill="#8a826e" />)}<rect x={-120} y={-150} width={120} height={140} fill="#2f6ea8" transform="rotate(-6)" /><Tx x={-60} y={-70} size={28} fill="#fff">ПАСПОРТ</Tx>{item === 3 && <rect x={-130} y={-160} width={260} height={310} fill="none" stroke="#ffd84a" strokeWidth={6} opacity={0.8} />}</g>
    </g>
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#05070d" opacity={0.35} />
  </g>
);

export const Medical: React.FC<{t: number; kind: string}> = ({t, kind}) => (
  <g>
    <Full c="#e6edf2" />
    <rect x={-1500} y={820} width={7200} height={400} fill="#9aa3b0" />
    <rect x={-1500} y={0} width={7200} height={80} fill="#c0c8d4" />
    {kind === 'resc' ? (
      <g>
        {[0, 1].map((i) => <g key={i} transform={`translate(${300 + i * 700} 820)`}><rect x={-230} y={-60} width={460} height={40} rx={10} fill="#f2f4f7" stroke="#aab4c0" strokeWidth={4} /><rect x={-210} y={-20} width={16} height={100} fill="#7a8494" /><rect x={194} y={-20} width={16} height={100} fill="#7a8494" /></g>)}
        <Chars list={[{look: VASYA, x: 700, y: 1010, pose: poseStand({mood: 'happy', nod: 4}), s: 1.5}, {look: WORKER, x: lerp(1900, 1160, E(t, 0, 2.5)), y: 1010, pose: poseWalk(t, 2.4, 6), flip: true, s: 1.5}]} />
      </g>
    ) : kind === 'bag' ? (
      <g>
        <g transform="translate(900 780)"><rect x={-240} y={-190} width={480} height={190} rx={24} fill="#c0392b" /><rect x={-60} y={-160} width={120} height={120} fill="#fff" /><rect x={-14} y={-148} width={28} height={96} fill="#c0392b" /><rect x={-48} y={-114} width={96} height={28} fill="#c0392b" /><path d="M-120 -190 Q0 -270 120 -190" stroke="#8a2a20" strokeWidth={16} fill="none" /></g>
        <g transform="translate(1500 800)"><path d="M0 0 q-80 -120 40 -180 q120 -40 140 60" stroke="#2a2f38" strokeWidth={14} fill="none" /><circle cx={180} cy={-120} r={26} fill="#9aa3b0" stroke="#2a2f38" strokeWidth={8} /></g>
        <Chars list={[{look: NIKL, x: 520, y: 1000, pose: poseSit({mood: 'worried', nod: 12, lean: 14}), s: 1.5}, {look: MEDIC, x: 300, y: 1010, pose: poseReach(90, -130, {lean: 22}), s: 1.5}]} />
      </g>
    ) : (
      <g>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${380 + i * 640} 820)`}><rect x={-230} y={-60} width={460} height={40} rx={10} fill="#f2f4f7" stroke="#aab4c0" strokeWidth={4} /><rect x={-210} y={-20} width={16} height={100} fill="#7a8494" /><rect x={194} y={-20} width={16} height={100} fill="#7a8494" /><rect x={-230} y={-100} width={170} height={44} rx={16} fill="#fff" stroke="#aab4c0" strokeWidth={3} /></g>)}
        <g transform="translate(1700 360)"><rect x={-200} y={-70} width={400} height={140} rx={16} fill="#f2f4f7" stroke="#aab4c0" strokeWidth={5} />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-170} y={-40 + i * 14} width={340} height={5} fill="#aab4c0" />)}{[0, 1, 2].map((i) => <path key={i} d={`M${-120 + i * 120} 80 q10 ${50 + ((t * 40 + i * 20) % 40)} 0 ${100}`} stroke="#bfe3ff" strokeOpacity={0.6} strokeWidth={6} fill="none" />)}</g>
        <Chars list={[{look: MEDIC, x: 1000, y: 1010, pose: poseWalk(t, 2.4, 8), s: 1.4}, {look: VASYA, x: 520, y: 1010, pose: poseSit({nod: 6}), s: 1.4}, {look: NIKL, x: 700, y: 1010, pose: poseSit({nod: 6}), s: 1.4}]} />
      </g>
    )}
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#fff6c8" opacity={0.04} />
  </g>
);

export const Fridge: React.FC<{t: number; pick: number}> = ({t, pick}) => (
  <g>
    <Full c="#cfc8b6" />
    <g transform="translate(960 560)">
      <rect x={-330} y={-520} width={660} height={1040} rx={40} fill="#e6eaf0" stroke="#8a919e" strokeWidth={10} />
      <rect x={-290} y={-480} width={580} height={960} rx={20} fill="#f6f8fb" />
      {[-240, -20, 200].map((y, i) => <rect key={i} x={-290} y={y + 100} width={580} height={12} fill="#aab4c0" />)}
      {/* spoiled */}
      <g opacity={1 - pick * 0.0}>
        <rect x={-250} y={-390} width={150} height={110} rx={14} fill="#8a9a4a" /><rect x={-60} y={-340} width={120} height={60} rx={10} fill="#a8a05a" />
        <ellipse cx={170} cy={-320} rx={70} ry={50} fill="#7a8a4a" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${-180 + i * 140} -430 q10 -30 0 -60 q-10 -30 0 -60`} stroke="#9aaa3a" strokeWidth={6} fill="none" opacity={0.6} transform={`translate(0 ${Math.sin(t * 3 + i) * 8})`} />)}
      </g>
      {/* safe */}
      <g transform={`translate(0 ${pick > 0 ? 0 : 0})`}>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-190 + i * 190} 90)`}><rect x={-60} y={-100} width={120} height={160} rx={14} fill="#c0a24a" /><rect x={-60} y={-60} width={120} height={50} fill="#fff" /><Tx x={0} y={-22} size={28} fill="#3a2a14">КОНСЕРВЫ</Tx></g>)}
        {[0, 1].map((i) => <g key={i} transform={`translate(${-100 + i * 200} 330)`}><rect x={-80} y={-70} width={160} height={110} rx={10} fill="#d8b46a" /><Tx x={0} y={-6} size={30} fill="#3a2a14">СУХАРИ</Tx></g>)}
        {pick > 0 && <rect x={-290} y={-10} width={580} height={420} fill="none" stroke="#3bff7a" strokeWidth={8} rx={20} opacity={0.5 + 0.4 * Math.sin(t * 6)} />}
      </g>
    </g>
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#05070d" opacity={0.18} />
  </g>
);

export const Timer40: React.FC<{t: number; v: number}> = ({t, v}) => (
  <g>
    <Full c="#120b0a" />
    <Glow x={960} y={540} r={900} c="#ff3b3b" o={0.15 + 0.08 * Math.sin(t * 8)} id="t4063" />
    <Tx x={960} y={420} size={60} fill="#ff8a7a">ПОСАДКА ЧЕРЕЗ</Tx>
    <Tx x={960} y={640} size={260} fill="#fff">{`${String(Math.floor(v / 60)).padStart(2, '0')}:${String(Math.floor(v % 60)).padStart(2, '0')}`}</Tx>
  </g>
);

export const TitleCard: React.FC<{lines: string[]; sub?: string; col?: string}> = ({lines, sub, col = '#fff'}) => (
  <g>
    <Full c="#06080c" />
    {lines.map((l, i) => <Tx key={i} x={960} y={500 + i * 130} size={110} fill={col}>{l}</Tx>)}
    {sub && <Tx x={960} y={500 + lines.length * 130 + 20} size={56} fill="#9fb4d0">{sub}</Tx>}
  </g>
);
