import { getChildren, mustNode } from '../data';
import { useStore } from '../store';
import { useIsMobile } from '../hooks';
import { FlowCanvas, fnode, fedge } from '../components/FlowCanvas';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';

const chain = [
  { id: 'b5.causa', k: '1 · Causa', t: 'Doença', ex: ['Hérnia de disco', 'Doença degenerativa', 'Espondiloartrose', 'Alterações discais', 'Tumores / infecções (outra lógica)'] },
  { id: 'b5.alteracao', k: '2 · Alteração estrutural', t: 'O que a doença provocou', ex: ['Compressão neural', 'Inflamação', 'Alteração mecânica / estreitamento'] },
  { id: 'b5.fisiologia', k: '3 · Consequência fisiológica', t: 'Como o funcionamento muda', ex: ['Dor inflamatória', 'Dor neuropática', 'Dor muscular', 'Dor radicular'] },
  { id: 'b5.sintomas', k: '4 · Sintoma', t: 'O que o paciente percebe', ex: ['Lombalgia', 'Cervicalgia', 'Mialgia', 'Irradiação', 'Limitação funcional'] },
  { id: 'b5.diagrama', k: '5 · Investigação clínica', t: 'Reconstrução da cadeia', ex: ['Sintoma → mecanismo → alteração → causa'] },
  { id: 'b5.spinemed-cadeia', k: '6 · Decisão terapêutica', t: 'SpineMED ou outra conduta', ex: ['SpineMED', 'Tratamento conservador', 'Intervenção', 'Cirurgia', 'Encaminhamento específico'] },
];

export function CadeiaClinica() {
  const mobile = useIsMobile();
  const openDetail = useStore((s) => s.openDetail);
  const nodes = [
    ...chain.map((c, i) => fnode(c.id, i * 270, 0, { kicker: c.k, title: c.t, cls: i < 4 ? 'clinical' : i === 5 ? 'accent' : '', nodeId: c.id })),
    ...chain.map((c, i) => fnode(`${c.id}.ex`, i * 270, 150, { title: c.ex.join(' · '), cls: 'ghost-ex', nodeId: c.id })),
    fnode('paciente', 3 * 270 + 120, -150, { kicker: 'Onde o paciente chega', title: '"Estou com dor."', sub: 'Ele conhece principalmente o bloco 4. O trabalho médico busca 3 → 2 → 1.', cls: 'wide', nodeId: 'b5.visao' }),
  ];
  const edges = [
    ...chain.slice(0, -1).map((c, i) => fedge(c.id, chain[i + 1].id, i === 3 ? { className: 'thick' } : {})),
    ...chain.map((c) => fedge(c.id, `${c.id}.ex`, { sourceHandle: 'bottom', targetHandle: 'top', className: 'faint', markerEnd: undefined })),
    fedge('paciente', 'b5.sintomas', { sourceHandle: 'bottom', targetHandle: 'top', className: 'faint' }),
  ];

  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={5} />
        {mobile ? (
          <div className="drill">
            {chain.map((c, i) => (
              <div key={c.id} className="it" onClick={() => openDetail(c.id)}>
                <span className="n">{i + 1}</span>
                <span>
                  <div className="kicker">{c.k}</div>
                  <div className="t">{c.t}</div>
                  <div className="s">{c.ex.join(' · ')}</div>
                </span>
                <span className="a">→</span>
              </div>
            ))}
          </div>
        ) : (
          <FlowCanvas nodes={nodes} edges={edges} height={440} fit={0.08} />
        )}
        <p className="faint small" style={{ marginTop: 10 }}>
          Compressão nervosa não é necessariamente a doença: pode ser consequência de diferentes doenças. Pacientes diferentes
          podem ter causas diferentes e sintomas parecidos; a mesma doença pode ter manifestações diferentes.
        </p>

        <Section title="Quem é candidato à SpineMED" count="grandes grupos · avaliação sempre individual">
          <div className="groups">
            {(['a', 'b', 'c'] as const).map((g) => {
              const n = mustNode(`b5.grupo-${g}`);
              const ul = n.content?.find((b) => b.kind === 'ul');
              const kids = getChildren(n.id);
              return (
                <div key={g} className={`g ${g}`} onClick={() => openDetail(n.id)}>
                  <div className="k">{n.kicker}</div>
                  <div className="t">{n.title}</div>
                  <div className="s">{n.summary}</div>
                  {ul && ul.kind === 'ul' && (
                    <ul>
                      {ul.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                  {kids.length > 0 && (
                    <ul>
                      {kids.map((k) => (
                        <li key={k.id}>{k.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24 }}>
            <ExpandableObject node={mustNode('b5.nuance')} />
            <ExpandableObject node={mustNode('b5.perfil-spinemed')} />
          </div>
        </Section>

        <Section title="O critério é o produto">
          <ExpandableObject node={mustNode('b5.criterio')} defaultOpen />
          <ExpandableObject node={mustNode('b5.marketing')} />
          <ExpandableObject node={mustNode('b5.landing')} />
        </Section>

        <Section title="Dados históricos e governança do 95%">
          <ExpandableObject node={mustNode('b5.dados-historicos')} />
          <ExpandableObject node={mustNode('b5.claim95')} />
        </Section>

        <Section title="A cadeia, seção a seção">
          {getChildren('b5').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Índice do bloco">
          <BlockTree rootId="b5" />
        </Section>
      </div>
    </div>
  );
}
