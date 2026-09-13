import { getChildren, mustNode } from '../data';
import { useStore } from '../store';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';
import { Content } from '../components/Content';

const levels = [
  { id: 'b7.nivel0', n: 'Nível 0', t: 'Descoberta', tk: 'R$ 0', tks: 'conteúdo / educação gratuita', con: 'baixa', obj: 'ser conhecido', q: '"Já vi esse médico."' },
  { id: 'b7.nivel1', n: 'Nível 1', t: 'Entrada', tk: 'até ≈ R$ 1.000', tks: 'consulta / produto educativo inicial', con: 'baixa → média', obj: 'compreender + confiar', q: '"Esse médico parece realmente entender disso."' },
  { id: 'b7.nivel2', n: 'Nível 2', t: 'Solução / Fidelização', tk: '≈ R$ 5–6 mil+', tks: 'SpineMED e outras soluções clinicamente indicadas', con: 'média → alta', obj: 'resultado + experiência + confiança consolidada', q: '"Eu fui tratado por ele e confio nele."' },
  { id: 'b7.nivel3', n: 'Nível 3', t: 'Continuidade Premium', tk: '≈ R$ 30 mil/ano', tks: 'hipótese · programa anual / acompanhamento longitudinal / comunidade', con: 'alta → muito alta', obj: 'manutenção + recorrência + prevenção + relacionamento', q: '"Quero continuar tendo essa estrutura comigo."' },
];

export function Esteira() {
  const openDetail = useStore((s) => s.openDetail);
  const matriz = mustNode('b7.matriz');
  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={7} />

        <div className="ladder">
          {levels.map((l) => (
            <div key={l.id} className="lv" onClick={() => openDetail(l.id)}>
              <div className="n">{l.n}</div>
              <div className="t">{l.t}</div>
              <div className="tk">
                {l.tk}
                <small>{l.tks}</small>
              </div>
              <div className="row">
                <span className="l">consciência</span>
                <span>{l.con}</span>
              </div>
              <div className="row">
                <span className="l">objetivo</span>
                <span>{l.obj}</span>
              </div>
              <div className="q">{l.q}</div>
            </div>
          ))}
        </div>
        <div className="ladder-foot">→ Paciente longitudinal: permanece conectado ao ecossistema</div>

        <Section title="Dois trilhos, uma regra" count="o tratamento continua soberano">
          <ExpandableObject node={mustNode('b7.tese')} />
          <ExpandableObject node={mustNode('b7.trilhos')} defaultOpen />
          <ExpandableObject node={mustNode('b7.equacao')} />
          <ExpandableObject node={mustNode('b7.regra-ouro')} />
        </Section>

        <Section title="Matriz da esteira" count="p. 102">
          <Content blocks={matriz.content?.filter((b) => b.kind === 'table')} />
        </Section>

        <Section title="Nível 3 · a maior oportunidade ainda não desenvolvida" count="hipótese de produto">
          <ExpandableObject node={mustNode('b7.nivel3.produto')} />
          <ExpandableObject node={mustNode('b7.nivel3.ticket')} />
          {getChildren('b7.nivel3.componentes').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
          <ExpandableObject node={mustNode('b7.produto-premium')} />
          <ExpandableObject node={mustNode('b7.nao-pode')} />
        </Section>

        <Section title="Segmentação, métricas e camadas futuras">
          <ExpandableObject node={mustNode('b7.segmentacao')} />
          <ExpandableObject node={mustNode('b7.metricas')} />
          <ExpandableObject node={mustNode('b7.camadas-futuras')} />
          <ExpandableObject node={mustNode('b7.principio')} />
        </Section>


        <Section title="Índice do bloco">
          <BlockTree rootId="b7" />
        </Section>
      </div>
    </div>
  );
}
