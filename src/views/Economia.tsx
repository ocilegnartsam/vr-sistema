import { useState } from 'react';
import { mustNode } from '../data';
import { useStore } from '../store';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';

const brl = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');

type Prof = { id: string; k: string; t: string; parts: [string, number][]; rec: number; first: number };
const DEFAULTS: Prof[] = [
  { id: 'b6.perfil-a', k: 'Perfil A', t: 'Paciente SpineMED', parts: [['Consulta particular inicial', 850], ['Segunda consulta', 850], ['SpineMED', 5000]], rec: 3, first: 850 },
  { id: 'b6.perfil-b', k: 'Perfil B', t: 'Cirúrgico via plano', parts: [['Consulta de convênio', 125], ['Cirurgia de plano', 5000], ['Consulta posterior', 125]], rec: 5, first: 125 },
  { id: 'b6.perfil-c', k: 'Perfil C', t: 'Cirúrgico particular', parts: [['Consulta particular inicial', 850], ['Consulta particular posterior', 850], ['Honorários cirúrgicos', 50000]], rec: 5, first: 850 },
];

const prices = [
  ['R$ 850', 'Consulta particular'],
  ['R$ 450', 'Consulta especial (plano não atendido)'],
  ['R$ 125', 'Consulta via convênio (R$ 100–150)'],
  ['R$ 5.000', 'SpineMED, valor médio provisório'],
  ['R$ 5.000', 'Cirurgia via plano, receita aproximada'],
  ['R$ 50.000', 'Cirurgia particular, honorários no modelo'],
];

function Simulator() {
  const openDetail = useStore((s) => s.openDetail);
  const [win, setWin] = useState(30);
  const [rec, setRec] = useState(DEFAULTS.map((p) => p.rec));
  const [tk, setTk] = useState(DEFAULTS.map((p) => p.parts.reduce((a, [, v]) => a + v, 0)));
  const ticketDoc = DEFAULTS.map((p) => p.parts.reduce((a, [, v]) => a + v, 0));
  const cycles = DEFAULTS.map((_, i) => Math.floor(win / rec[i]));
  const ltv = DEFAULTS.map((_, i) => tk[i] * cycles[i]);
  const max = Math.max(...ltv, 1);
  const dirty = win !== 30 || rec.some((r, i) => r !== DEFAULTS[i].rec) || tk.some((t, i) => t !== ticketDoc[i]);
  const reset = () => { setWin(30); setRec(DEFAULTS.map((p) => p.rec)); setTk(ticketDoc); };

  return (
    <div className="sim">
      <div>
        <div className="window">
          <span>Janela de relacionamento</span>
          <input type="range" min={10} max={40} value={win} onChange={(e) => setWin(+e.target.value)} />
          <b className="serif" style={{ fontSize: 18 }}>{win} anos</b>
          <span className="faint small">40 → {40 + win} anos</span>
          {dirty && <button className="reset" onClick={reset}>voltar aos valores do documento</button>}
        </div>
        {DEFAULTS.map((p, i) => (
          <div key={p.id} className="prof">
            <div className="h">
              <span className="t">
                <button onClick={() => openDetail(p.id)} className="linklike" style={{ border: 0 }}>
                  {p.t}
                </button>
              </span>
              <span className="k">{p.k}</span>
            </div>
            <div className={`ltv ${ltv[i] !== ticketDoc[i] * Math.floor(30 / p.rec) ? 'chg' : ''}`}>
              {brl(ltv[i])}
              <small>LTV {dirty ? 'simulado' : 'didático'}</small>
            </div>
            <div className="eq">
              {p.parts.map(([l, v]) => `${l} ${brl(v)}`).join(' + ')} = {brl(ticketDoc[i])} por ciclo · 1 ciclo a cada {rec[i]} anos · {win} ÷ {rec[i]} = {cycles[i]} ciclos
            </div>
            <div className="ctl">
              <div>
                <label>
                  Recorrência <b>{rec[i]} anos</b>
                </label>
                <input type="range" min={1} max={10} value={rec[i]} onChange={(e) => setRec(rec.map((r, j) => (j === i ? +e.target.value : r)))} />
              </div>
              <div>
                <label>
                  Ticket do ciclo <b>{brl(tk[i])}</b>
                </label>
                <input type="range" min={Math.round(ticketDoc[i] * 0.5)} max={Math.round(ticketDoc[i] * 2)} step={50} value={tk[i]} onChange={(e) => setTk(tk.map((t, j) => (j === i ? +e.target.value : t)))} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bars">
        <div className="lbl">LTV em {win} anos · comparação</div>
        {DEFAULTS.map((p, i) => (
          <div key={p.id}>
            <div className="bar">
              <span>{p.t}</span>
              <div className="track">
                <div className={`fill ${i === 2 ? 'acc' : ''}`} style={{ width: `${(ltv[i] / max) * 100}%` }} />
              </div>
              <span className="v">{brl(ltv[i])}</span>
            </div>
            <div className="first">
              <span>primeira consulta</span>
              <span style={{ borderLeft: '1px solid var(--line-2)', paddingLeft: 6 }}>{((p.first / ltv[i]) * 100).toFixed(1)}% do LTV</span>
              <span style={{ textAlign: 'right' }}>{brl(p.first)}</span>
            </div>
          </div>
        ))}
        <p className="note">
          Modelo LTV 0.1: simulação estratégica, didática, ainda não robusta para projeções financeiras formais. As
          frequências e valores precisam ser substituídos por dados reais da operação. A primeira consulta representa uma
          fração pequena do valor potencial do relacionamento.
        </p>
        <p className="note">
          <button className="linklike" onClick={() => openDetail('b6.nao-considera')}>O que o modelo ainda não considera</button>
          {' · '}
          <button className="linklike" onClick={() => openDetail('b6.medir')}>O que medir a partir de agora</button>
        </p>
      </div>
    </div>
  );
}

export function Economia() {
  const openDetail = useStore((s) => s.openDetail);
  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={6} />
        <Simulator />

        <Section title="Valores de referência do modelo" count="p. 62–63">
          <div className="prices" onClick={() => openDetail('b6.valores')} style={{ cursor: 'pointer' }}>
            {prices.map(([v, l]) => (
              <div key={l} className="p">
                <div className="v">{v}</div>
                <div className="l">{l}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Por que a continuidade vale mais que a primeira consulta">
          <ExpandableObject node={mustNode('b6.ponto')} defaultOpen />
          <ExpandableObject node={mustNode('b6.oportunidade')} />
          <ExpandableObject node={mustNode('b6.pos-motor')} />
          <ExpandableObject node={mustNode('b6.problema')} />
          <ExpandableObject node={mustNode('b6.principio')} />
        </Section>

        <Section title="Retenção e hipóteses comerciais">
          <ExpandableObject node={mustNode('b6.retencao-clinica')} />
          <ExpandableObject node={mustNode('b6.retencao-cirurgico')} />
          <ExpandableObject node={mustNode('b6.efeito-psicologico')} />
        </Section>

        <Section title="Conexões: stakeholders, marketing e esteira">
          <ExpandableObject node={mustNode('b6.conexao-stakeholders')} />
          <ExpandableObject node={mustNode('b6.conexao-marketing')} />
          <ExpandableObject node={mustNode('b6.conexao-esteira')} />
          <ExpandableObject node={mustNode('b6.insight')} />
        </Section>


        <Section title="Índice do bloco">
          <BlockTree rootId="b6" />
        </Section>
      </div>
    </div>
  );
}
