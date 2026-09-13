import { mustNode } from '../data';
import { useStore } from '../store';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';
import { Content } from '../components/Content';

const motors = ['b8.marketing', 'b8.comercial', 'b8.operacao', 'b8.pos'];

export function RevenueEngine() {
  const navigate = useStore((s) => s.navigate);
  const openDetail = useStore((s) => s.openDetail);
  const eq = mustNode('b8.equacao');
  const matriz = mustNode('b8.matriz');
  const fluxo = mustNode('b8.fluxo');
  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={8}>
          <div style={{ marginTop: 16, fontSize: 13.5 }}>
            <button className="linklike" onClick={() => navigate({ view: 'atlas' })}>
              Este bloco é o mapa-mãe: ver no Atlas
            </button>
          </div>
        </BlockHeader>

        <div onClick={() => openDetail('b8.equacao')} style={{ cursor: 'pointer' }}>
          <Content blocks={eq.content?.filter((b) => b.kind === 'big' || b.kind === 'kv')} />
        </div>

        <Section title="Quatro motores" count="sustentados por cultura, pessoas, gestão, stakeholders, dados, processos, produtos e marca">
          {motors.map((id) => (
            <ExpandableObject key={id} node={mustNode(id)} />
          ))}
          <ExpandableObject node={mustNode('b8.principio')} />
        </Section>

        <Section title="Segunda máquina de aquisição e camadas transversais">
          <ExpandableObject node={mustNode('b8.stakeholders')} />
          <ExpandableObject node={mustNode('b8.cultura')} />
          <ExpandableObject node={mustNode('b8.gestao')} />
          <ExpandableObject node={mustNode('b8.custo-oportunidade')} />
        </Section>

        <Section title="Matriz de responsabilidade" count="p. 134">
          <Content blocks={matriz.content?.filter((b) => b.kind === 'table')} />
        </Section>

        <Section title="Fluxo completo" count="mercado → LTV">
          <div className="two">
            <Content blocks={fluxo.content?.filter((b) => b.kind === 'flow')} />
            <div>
              <ExpandableObject node={mustNode('b8.ordem')} />
              <ExpandableObject node={mustNode('b8.potencial')} />
              <ExpandableObject node={mustNode('b8.principio-estrategico')} />
              <ExpandableObject node={mustNode('b8.insight')} />
            </div>
          </div>
        </Section>


        <Section title="Índice do bloco">
          <BlockTree rootId="b8" />
        </Section>
      </div>
    </div>
  );
}
