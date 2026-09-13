import { getChildren, mustNode } from '../data';
import { useStore } from '../store';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';
import { KanbanLane, LANES } from '../components/Kanban';

const chain = [
  ['Dr. Vladmir', 'Patrocinador e autoridade final'],
  ['Nathan / Mastrangeli & Co.', 'Responsável pelo desenho e implantação'],
  ['Gerência', 'Viabiliza operacionalmente'],
  ['Elizângela + Carol', 'Participam, executam e incorporam o novo processo'],
];

export function Prioridades() {
  const openDetail = useStore((s) => s.openDetail);
  const goExec = () => useStore.getState().navigate({ view: 'execucao' });
  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={2}>
          <p className="small faint" style={{ marginTop: 14 }}>
            Horizonte: próximas semanas, com implantação e amadurecimento em até aproximadamente 3 meses. Princípio do
            trimestre: o que for decidido precisa ganhar responsável, data e execução.
          </p>
        </BlockHeader>

        <div className="four">
          {chain.map(([who, what], i) => (
            <div key={who} className="f" onClick={() => openDetail('b2.governanca.acordo')}>
              <div className="n">{i + 1}</div>
              <div className="t">{who}</div>
              <div className="e">{what}</div>
            </div>
          ))}
        </div>
        <p className="faint small" style={{ marginTop: 10 }}>
          Acordo operacional (p. 17). Decisão tomada → execução. Nathan possui autoridade operacional real sobre a
          implantação da frente de treinamento.
        </p>

        <KanbanLane lane={LANES[0]} />
        <KanbanLane lane={LANES[1]} />
        <p className="faint small" style={{ marginTop: 8 }}>
          Arraste os cards entre colunas para acompanhar a execução. As posições ficam salvas neste navegador. A visão
          consolidada, com a ordem de execução do Bloco 8 e as pendências de todo o documento, está em{' '}
          <button className="linklike" onClick={goExec}>
            Execução
          </button>
          .
        </p>

        <Section title="Frente 1 · Stakeholders" count="owner: Dr. Vladmir">
          <ExpandableObject node={mustNode('b2.stakeholders')} />
          {getChildren('b2.stakeholders').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Frente 2 · Treinamento da equipe de atendimento" count="implantação: Nathan / Mastrangeli & Co.">
          <ExpandableObject node={mustNode('b2.treinamento')} />
          {getChildren('b2.treinamento').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Governança para o treinamento acontecer">
          <ExpandableObject node={mustNode('b2.governanca')} />
          {getChildren('b2.governanca').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Mapa e princípio do trimestre">
          <ExpandableObject node={mustNode('b2.mapa')} />
          <ExpandableObject node={mustNode('b2.principio-trimestre')} />
        </Section>

        <Section title="Índice do bloco" count="todo o conteúdo, na ordem do documento">
          <BlockTree rootId="b2" />
        </Section>
      </div>
    </div>
  );
}
