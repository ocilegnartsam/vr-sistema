import { useRef, useState } from 'react';
import { getChildren, mustNode } from '../data';
import { useStore } from '../store';
import { useIsMobile } from '../hooks';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';
import { Content } from '../components/Content';

const moments = [
  { id: 'b4.momento1', age: '28', t: 'Primeiros episódios', s: 'Dor leve. Relaxante, analgésico, repouso. "Era só uma dor."', x: 90, dir: 'up' },
  { id: 'b4.momento2', age: '32', t: 'Recorrência', s: 'A dor aparece com maior frequência. "Isso está acontecendo com frequência."', x: 430, dir: 'down' },
  { id: 'b4.momento3', age: '40', t: 'Primeiro médico', s: 'Ortopedista generalista: avaliação, radiografia, medicamentos, eventual ressonância, encaminhamento.', x: 900, dir: 'up' },
  { id: 'b4.momento4', age: '40–41', t: 'Primeiro tratamento especializado', s: 'Bloqueios, medicações, fisioterapia. Melhora parcial, esperança, recorrência, frustração.', x: 1250, dir: 'down' },
  { id: 'b4.golden-moment', age: '41–42', t: 'Golden Moment', s: 'Dor + limitação + consciência + histórico + frustração + capacidade de decisão + necessidade de orientação.', x: 1620, dir: 'up', gold: true },
] as const;

const levels = [
  { id: 'b4.nivel1', x: 0, lv: 'Nível de consciência 1', q: '"Tenho uma dor."' },
  { id: 'b4.nivel2', x: 780, lv: 'Nível de consciência 2', q: '"Talvez exista algum problema aqui."' },
  { id: 'b4.nivel3', x: 1490, lv: 'Nível de consciência 3', q: '"Preciso resolver isso direito."', l3: true },
];

const windows = [
  { id: 'b4.janela1', x: 900, b: 'Oportunidade VR #1', t: 'Stakeholder: ortopedista (gatekeeper)' },
  { id: 'b4.janela2', x: 1250, b: 'Oportunidade VR #2', t: 'Stakeholder: médico da dor / profissional especializado' },
];

const W = 2000;

function Timeline() {
  const openDetail = useStore((s) => s.openDetail);
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const drag = useRef<{ x: number; sl: number } | null>(null);
  const [grab, setGrab] = useState(false);

  const onDown = (e: React.PointerEvent) => {
    if (!ref.current) return;
    drag.current = { x: e.clientX, sl: ref.current.scrollLeft };
    setGrab(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !ref.current) return;
    ref.current.scrollLeft = drag.current.sl - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    drag.current = null;
    setGrab(false);
  };
  const moved = useRef(false);
  const s = (x: number) => x * zoom;

  return (
    <div className="tl-wrap">
      <div
        ref={ref}
        className={`tl-scroller ${grab ? 'grabbing' : ''}`}
        onPointerDown={(e) => { moved.current = false; onDown(e); }}
        onPointerMove={(e) => { if (drag.current && Math.abs(e.clientX - drag.current.x) > 4) moved.current = true; onMove(e); }}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <div className="tl" style={{ width: s(W) + 260 }}>
          {levels.map((l) => (
            <div key={l.id} className={`band ${l.l3 ? 'l3' : ''}`} style={{ left: s(l.x) }} onClick={() => !moved.current && openDetail(l.id)}>
              <div className="lv" style={{ marginTop: 6 }}>{l.lv}</div>
              <div className="lq">{l.q}</div>
            </div>
          ))}
          <div className="axis" />
          {moments.map((m) => (
            <div
              key={m.id}
              className={`mo ${m.dir} ${'gold' in m && m.gold ? 'gold' : ''}`}
              style={{ left: s(m.x), top: m.dir === 'up' ? 230 : 230, height: 0 }}
              onClick={() => !moved.current && openDetail(m.id)}
            >
              <div className="dot" />
              <div className="stem" />
              <div className="box">
                <div className="age">
                  {m.age}
                  <small>anos ≈</small>
                </div>
                <div className="t">{m.t}</div>
                <div className="s">{m.s}</div>
              </div>
            </div>
          ))}
          {windows.map((w) => (
            <div key={w.id} className="win" style={{ left: s(w.x) + 10, top: 236 }} onClick={() => !moved.current && openDetail(w.id)}>
              <b>{w.b}</b>
              {w.t}
            </div>
          ))}
        </div>
      </div>
      <div className="tl-hint">
        <span>Arraste para percorrer a jornada. As idades são arquétipo, não regra epidemiológica.</span>
        <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.2))}>aproximar</button>
        <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}>afastar</button>
      </div>
    </div>
  );
}

function MobileJourney() {
  const openDetail = useStore((s) => s.openDetail);
  const items = [levels[0], moments[0], moments[1], levels[1], moments[2], windows[0], moments[3], windows[1], levels[2], moments[4]];
  return (
    <div className="drill">
      {items.map((it) => {
        if ('lv' in it)
          return (
            <div key={it.id} className="it" onClick={() => openDetail(it.id)}>
              <span className="n">§</span>
              <span>
                <div className="kicker">{it.lv}</div>
                <div className="t serif" style={{ fontStyle: 'italic' }}>{it.q}</div>
              </span>
              <span className="a">→</span>
            </div>
          );
        if ('b' in it)
          return (
            <div key={it.id} className="it" onClick={() => openDetail(it.id)}>
              <span className="n" style={{ color: 'var(--accent)' }}>★</span>
              <span>
                <div className="t" style={{ color: 'var(--accent)', fontSize: 16 }}>{it.b}</div>
                <div className="s">{it.t}</div>
              </span>
              <span className="a">→</span>
            </div>
          );
        return (
          <div key={it.id} className="it" onClick={() => openDetail(it.id)}>
            <span className="n">{it.age}</span>
            <span>
              <div className="t">{it.t}</div>
              <div className="s">{it.s}</div>
            </span>
            <span className="a">→</span>
          </div>
        );
      })}
    </div>
  );
}

export function Jornada() {
  const mobile = useIsMobile();
  const impl = mustNode('b4.implicacao-marketing');
  const arq = mustNode('b4.arquitetura-conteudo');
  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={4} />
        {mobile ? <MobileJourney /> : <Timeline />}

        <Section title="Uma jornada, várias conversas" count="implicação para marketing · p. 43">
          <div className="two">
            <div>
              <Content blocks={impl.content?.filter((b) => b.kind === 'table')} />
            </div>
            <div>
              <div className="kicker" style={{ marginBottom: 8 }}>Arquitetura de conteúdo</div>
              <Content blocks={arq.content?.filter((b) => b.kind === 'kv')} />
            </div>
          </div>
        </Section>

        <Section title="Descoberta mais importante">
          <ExpandableObject node={mustNode('b4.descoberta')} defaultOpen />
          <ExpandableObject node={mustNode('b4.insight')} />
        </Section>

        <Section title="A jornada, momento a momento">
          {getChildren('b4').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Índice do bloco">
          <BlockTree rootId="b4" />
        </Section>
      </div>
    </div>
  );
}
