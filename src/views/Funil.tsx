import { getChildren, mustNode } from '../data';
import { useStore } from '../store';
import { useIsMobile } from '../hooks';
import { FlowCanvas, fnode, fedge } from '../components/FlowCanvas';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';

const steps = [
  { id: 'b1.reels', k: '1 · Reels', t: 'Atração qualificada', s: 'Público segmentado por território, intenção, poder aquisitivo e necessidade real' },
  { id: 'b1.landing', k: '2 · Landing page', t: 'Valor e consciência', s: 'Aprofunda entendimento e reduz objeções antes do contato' },
  { id: 'b1.whatsapp', k: '3 · WhatsApp', t: 'Atendimento + triagem', s: 'Resposta em até 5 min · Elizângela + Carol' },
  { id: 'b1.conversao', k: '4 · Conversão', t: 'Condução comercial', s: 'Particular → PP → Plano quando o paciente levantar' },
  { id: 'b1.consulta', k: '5 · Consulta', t: 'Critério clínico', s: 'A venda inicial termina na consulta, não na SpineMED' },
];

export function Funil() {
  const mobile = useIsMobile();
  const openDetail = useStore((s) => s.openDetail);
  const painel = mustNode('b1.painel');
  const kv = painel.content?.find((b) => b.kind === 'kv');
  const pairs = kv && kv.kind === 'kv' ? kv.pairs : [];

  const nodes = [
    ...steps.map((s, i) => fnode(s.id, i * 270, 0, { kicker: s.k, title: s.t, sub: s.s, nodeId: s.id })),
    fnode('q', 4 * 270 + 40, 150, { title: 'Elegível para SpineMED?', cls: 'q', nodeId: 'b1.pendente.criterios' }),
    fnode('sim', 4 * 270 + 300, 60, { kicker: 'Sim', title: 'Proposta / tratamento', cls: 'clinical', nodeId: 'b5.spinemed-cadeia' }),
    fnode('nao', 4 * 270 + 300, 220, { kicker: 'Não', title: 'Conduta clínica apropriada', nodeId: 'b5.diagrama' }),
  ];
  const edges = [
    ...steps.slice(0, -1).map((s, i) => fedge(s.id, steps[i + 1].id)),
    fedge('b1.consulta', 'q', { sourceHandle: 'bottom', targetHandle: 'top' }),
    fedge('q', 'sim'),
    fedge('q', 'nao'),
  ];

  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={1} />

        {mobile ? (
          <div className="drill">
            {steps.map((s, i) => (
              <div key={s.id} className="it" onClick={() => openDetail(s.id)}>
                <span className="n">{i + 1}</span>
                <span>
                  <div className="t">{s.t}</div>
                  <div className="s">{s.s}</div>
                </span>
                <span className="a">→</span>
              </div>
            ))}
            <div className="it" onClick={() => openDetail('b1.pendente.criterios')}>
              <span className="n">?</span>
              <span>
                <div className="t">Elegível para SpineMED?</div>
                <div className="s">Sim: proposta/tratamento · Não: conduta clínica apropriada</div>
              </span>
              <span className="a">→</span>
            </div>
          </div>
        ) : (
          <FlowCanvas nodes={nodes} edges={edges} height={380} fit={0.1} />
        )}

        <Section title="Parâmetros do funil" count="bloco para o painel · p. 5">
          <div className="spec">
            {pairs.map(([l, v]) => (
              <div key={l} className="it">
                <div className="l">{l}</div>
                <div className={`v ${/gargalo|pendente/i.test(l) ? 'acc' : ''}`}>{v}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Etapas em profundidade">
          {getChildren('b1').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Princípios e pendências">
          <ExpandableObject node={mustNode('b1.principio-comercial')} />
          <ExpandableObject node={mustNode('b1.pendente.criterios')} />
        </Section>

        <Section title="Índice do bloco" count="todo o conteúdo, na ordem do documento">
          <BlockTree rootId="b1" />
        </Section>
      </div>
    </div>
  );
}
