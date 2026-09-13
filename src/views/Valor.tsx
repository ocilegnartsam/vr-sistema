import { motion } from 'motion/react';
import { mustNode } from '../data';
import { useStore } from '../store';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';

const W = 560, H = 480, P = 56;
const sx = (v: number) => P + (v / 10) * (W - P * 2);
const sy = (v: number) => H - P - (v / 10) * (H - P * 2);

const quadr = [
  { id: 'b9.quadrante.q2', k: 'Quadrante 2', t: 'Excelência Invisível', s: 'Entrega alta + captura baixa. Aqui está o problema que queremos resolver.', cls: 'cur' },
  { id: 'b9.quadrante.q4', k: 'Quadrante 4', t: 'Autoridade Sustentável', s: 'Entrega alta + captura alta. É o destino: 9,5 de valor criado, 8–9 de valor capturado.', cls: 'dest' },
  { id: 'b9.quadrante.q1', k: 'Quadrante 1', t: 'Operação Fraca', s: 'Entrega baixa + captura baixa. Pouco valor, pouca demanda, pouco crescimento.', cls: '' },
  { id: 'b9.quadrante.q3', k: 'Quadrante 3', t: 'Hipercomercialização Frágil', s: 'Entrega baixa + captura alta. Pode crescer rápido, mas com fragilidade potencial.', cls: '' },
];

const scores = [
  { id: 'b9.hoje', t: 'Dr. Vladmir hoje', k: 'hipótese interna', a: 9.5, b: 2 },
  { id: 'b9.cam.arquetipo', t: 'CAM · arquétipo didático', k: 'Concorrente de Alta Monetização', a: 2, b: 8 },
  { id: 'b9.objetivo', t: 'Destino estratégico', k: 'objetivo da Mastrangeli & Co.', a: 9.5, b: 8.5 },
];

const fly = ['Excelência clínica', 'Resultado / experiência', 'Reputação', 'Comunicação', 'Demanda', 'Receita', 'Reinvestimento', 'Equipe + tecnologia + dados + experiência'];

function Matrix() {
  const openDetail = useStore((s) => s.openDetail);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 620, display: 'block' }}>
      {/* quadrantes */}
      <rect x={sx(0)} y={sy(10)} width={sx(5) - sx(0)} height={sy(5) - sy(10)} fill="rgba(29,90,77,0.07)" />
      <rect x={sx(5)} y={sy(10)} width={sx(10) - sx(5)} height={sy(5) - sy(10)} fill="rgba(29,90,77,0.14)" />
      <line x1={sx(5)} y1={sy(0)} x2={sx(5)} y2={sy(10)} stroke="rgba(20,25,27,0.25)" strokeDasharray="3 4" />
      <line x1={sx(0)} y1={sy(5)} x2={sx(10)} y2={sy(5)} stroke="rgba(20,25,27,0.25)" strokeDasharray="3 4" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(10)} y2={sy(0)} stroke="#14191b" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(10)} stroke="#14191b" />
      {/* labels dos quadrantes */}
      <g fontSize="11" fill="#7f898c" style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>
        <text x={sx(0.3)} y={sy(5.3)} style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.quadrante.q2')}>Excelência invisível</text>
        <text x={sx(9.7)} y={sy(5.3)} textAnchor="end" style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.quadrante.q4')}>Autoridade sustentável</text>
        <text x={sx(0.3)} y={sy(0.35)} style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.quadrante.q1')}>Operação fraca</text>
        <text x={sx(9.7)} y={sy(0.35)} textAnchor="end" style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.quadrante.q3')}>Hipercomercialização frágil</text>
      </g>
      {/* eixos */}
      <text x={sx(5)} y={H - 14} textAnchor="middle" fontSize="12" fill="#485155">Eixo B · Valor capturado (0 → 10)</text>
      <text x={16} y={sy(5)} textAnchor="middle" fontSize="12" fill="#485155" transform={`rotate(-90 16 ${sy(5)})`}>Eixo A · Valor criado (0 → 10)</text>
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <g key={v} fontSize="10" fill="#7f898c">
          <text x={sx(v)} y={sy(0) + 14} textAnchor="middle">{v}</text>
          <text x={sx(0) - 8} y={sy(v) + 3} textAnchor="end">{v}</text>
        </g>
      ))}
      {/* trajetória */}
      <motion.line
        x1={sx(2)} y1={sy(9.5)} x2={sx(8.5)} y2={sy(9.5)}
        stroke="#1d5a4d" strokeWidth={1.5} strokeDasharray="5 5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }}
      />
      <text x={sx(5.25)} y={sy(9.5) + 46} textAnchor="middle" fontSize="11" fill="#1d5a4d">2 → 8 em captura, mantendo 9,5 na entrega</text>
      {/* pontos */}
      <g style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.hoje')}>
        <motion.circle cx={sx(2)} cy={sy(9.5)} r={9} fill="#1d5a4d" initial={{ scale: 0 }} animate={{ scale: 1 }} />
        <text x={sx(2)} y={sy(9.5) + 26} textAnchor="middle" fontSize="12" fill="#14191b" fontFamily="Newsreader, serif">Dr. Vladmir hoje · 9,5 × 2</text>
      </g>
      <g style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.objetivo')}>
        <motion.circle cx={sx(8.5)} cy={sy(9.5)} r={9} fill="none" stroke="#14191b" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} />
        <text x={sx(8.5)} y={sy(9.5) + 26} textAnchor="middle" fontSize="12" fill="#14191b" fontFamily="Newsreader, serif">Destino · 9,5 × 8,5</text>
      </g>
      <g style={{ cursor: 'pointer' }} onClick={() => openDetail('b9.cam.arquetipo')}>
        <motion.circle cx={sx(8)} cy={sy(2)} r={7} fill="#f6f7f4" stroke="#14191b" strokeWidth={1.5} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
        <text x={sx(8)} y={sy(2) - 14} textAnchor="middle" fontSize="12" fill="#14191b" fontFamily="Newsreader, serif">CAM · 2 × 8</text>
      </g>
    </svg>
  );
}

function Flywheel() {
  const openDetail = useStore((s) => s.openDetail);
  const R = 150, C = 200;
  return (
    <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 440, display: 'block', cursor: 'pointer' }} onClick={() => openDetail('b9.flywheel')}>
      <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(20,25,27,0.25)" />
      <motion.circle cx={C} cy={C} r={R} fill="none" stroke="#14191b" strokeWidth={1.5} strokeDasharray="6 8" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }} style={{ transformOrigin: '200px 200px' }} />
      {fly.map((f, i) => {
        const a = (i / fly.length) * Math.PI * 2 - Math.PI / 2;
        const x = C + Math.cos(a) * R, y = C + Math.sin(a) * R;
        const lx = C + Math.cos(a) * (R + 26), ly = C + Math.sin(a) * (R + 26);
        const anchor = Math.cos(a) > 0.2 ? 'start' : Math.cos(a) < -0.2 ? 'end' : 'middle';
        return (
          <g key={f}>
            <circle cx={x} cy={y} r={i === 0 ? 6 : 4} fill={i === 0 ? '#1d5a4d' : '#14191b'} />
            <text x={lx} y={ly + 4} textAnchor={anchor} fontSize="11.5" fill="#14191b">{f}</text>
          </g>
        );
      })}
      <text x={C} y={C - 8} textAnchor="middle" fontSize="13" fill="#485155" fontFamily="Newsreader, serif" fontStyle="italic">mais valor → mais reputação</text>
      <text x={C} y={C + 12} textAnchor="middle" fontSize="13" fill="#485155" fontFamily="Newsreader, serif" fontStyle="italic">→ mais demanda, e o ciclo continua</text>
    </svg>
  );
}

export function Valor() {
  const openDetail = useStore((s) => s.openDetail);
  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={9} />
        <div className="mx">
          <Matrix />
          <div className="side">
            <div className="lbl">Representação do caso · p. 159</div>
            {scores.map((s) => (
              <div key={s.id} className="sc" style={{ cursor: 'pointer' }} onClick={() => openDetail(s.id)}>
                <div className="h">
                  <span className="t">{s.t}</span>
                  <span className="k">{s.k}</span>
                </div>
                <div className="b">
                  <span>valor criado</span>
                  <div className="tr"><div className="fl" style={{ width: `${s.a * 10}%` }} /></div>
                  <span className="v">{s.a.toString().replace('.', ',')}</span>
                </div>
                <div className="b">
                  <span>valor capturado</span>
                  <div className="tr"><div className="fl acc" style={{ width: `${s.b * 10}%` }} /></div>
                  <span className="v">{s.b.toString().replace('.', ',')}</span>
                </div>
              </div>
            ))}
            <p className="faint small" style={{ marginTop: 14 }}>
              As notas não são auditoria: são posição relativa no modelo interno. O gráfico é um instrumento estratégico,
              não um ranking científico. Gap estratégico ≈ 6–7 pontos.
            </p>
          </div>
        </div>

        <Section title="Os quatro quadrantes">
          <div className="q4">
            {quadr.map((q) => (
              <div key={q.id} className={`q ${q.cls}`} onClick={() => openDetail(q.id)}>
                <div className="k">{q.k}{q.cls === 'cur' ? ' · onde o Dr. Vladmir está' : q.cls === 'dest' ? ' · destino' : ''}</div>
                <div className="t">{q.t}</div>
                <div className="s">{q.s}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="O flywheel" count="p. 155–156">
          <div className="two" style={{ alignItems: 'center' }}>
            <Flywheel />
            <div>
              <ExpandableObject node={mustNode('b9.gap')} defaultOpen />
              <ExpandableObject node={mustNode('b9.reinvestimento')} />
            </div>
          </div>
        </Section>

        <Section title="Por que isso acontece na medicina">
          <ExpandableObject node={mustNode('b9.porque-medicina')} />
          <ExpandableObject node={mustNode('b9.sinais')} />
          <ExpandableObject node={mustNode('b9.lastro')} />
          <ExpandableObject node={mustNode('b9.paradoxo')} />
          <ExpandableObject node={mustNode('b9.limitador')} />
        </Section>


        <Section title="Índice do bloco">
          <BlockTree rootId="b9" />
        </Section>
      </div>
    </div>
  );
}
