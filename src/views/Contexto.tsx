import { mustNode } from '../data';
import { useStore } from '../store';
import { Content } from '../components/Content';
import { ObjectList, Section } from '../components/Objects';

const zeros = [
  ['pouco', 'empresário'],
  ['pouco', 'relacionamento'],
  ['zero', 'stakeholders e parcerias estratégicas'],
  ['zero', 'marketing e mídia (tudo boca a boca)'],
  ['zero', 'esteira de produtos'],
  ['zero', 'pacotes de tratamento'],
  ['zero', 'treinamento em atendimento e vendas para a equipe'],
  ['zero', 'endomarketing'],
];

export function Contexto() {
  const openDetail = useStore((s) => s.openDetail);
  const goToModule = useStore((s) => s.goToModule);
  const root = mustNode('b0');
  return (
    <div className="page">
      <div className="page-inner">
        <div className="ctx">
          <div>
            <div className="kicker">Bloco 0 · Contexto</div>
            <h1 className="display" style={{ marginTop: 10 }}>
              Dr. Vladmir Resende
            </h1>
            <p className="lead">
              Neurocirurgião especialista em coluna, há mais de vinte anos tratando casos avançados e complexos. Na última
              década, atua também com a SpineMED. Muito bom como médico, pouco empresário: é esse o gap que este sistema
              existe para fechar.
            </p>
            <div className="facts">
              <div className="f">
                <div className="v">20+</div>
                <div className="l">anos tratando doenças da coluna</div>
              </div>
              <div className="f" style={{ cursor: 'pointer' }} onClick={() => openDetail('b0.claim.95')}>
                <div className="v">
                  300+<sup>claim</sup>
                </div>
                <div className="l">pacientes SpineMED na última década</div>
              </div>
              <div className="f" style={{ cursor: 'pointer' }} onClick={() => openDetail('b0.claim.95')}>
                <div className="v">
                  95%<sup>a validar</sup>
                </div>
                <div className="l">de sucesso nos casos indicados, sempre criterioso</div>
              </div>
            </div>
            <div className="goal">
              <div className="kicker" style={{ marginBottom: 10 }}>
                Objetivo do material
              </div>
              <Content blocks={root.content?.filter((b) => b.kind === 'p').slice(2, 3)} />
              <div style={{ marginTop: 18, display: 'flex', gap: 22, fontSize: 13.5 }}>
                <button className="linklike" onClick={() => goToModule(8)}>
                  Ver o Atlas do sistema
                </button>
                <button className="linklike" onClick={() => goToModule(9)}>
                  Entender a tese: 9,5 × 2
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="zero">
              <div className="lbl">Situação atual, nas palavras do documento</div>
              {zeros.map(([z, w]) => (
                <div key={w} className="row">
                  <span className={`z ${z === 'pouco' ? 'w' : ''}`}>{z}</span>
                  <span className="w2">{w}</span>
                </div>
              ))}
            </div>
            <p className="faint small" style={{ marginTop: 14 }}>
              Registro do diagnóstico inicial (p. 1). Cada um desses pontos é endereçado por um bloco do sistema.
            </p>
          </div>
        </div>

        <Section title="Objetos deste bloco">
          <ObjectList ids={['b0', 'b0.claim.95', 'b0.pessoas']} />
        </Section>
      </div>
    </div>
  );
}
