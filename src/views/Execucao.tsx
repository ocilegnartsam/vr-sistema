import { allNodes, getChildren, moduleById, pagesLabel } from '../data';
import { useStore } from '../store';
import { KanbanLane, LANES } from '../components/Kanban';
import { Section, statusLabel } from '../components/Objects';

export function Execucao() {
  const openDetail = useStore((s) => s.openDetail);
  const ordem = getChildren('b8.ordem');
  const phases = [
    { lbl: 'Fase imediata', p: 'imediata' },
    { lbl: 'Segunda camada', p: 'segunda-camada' },
    { lbl: 'Terceira camada', p: 'terceira-camada' },
  ] as const;
  const pend = allNodes.filter((n) => n.status && ['pendente', 'a-validar', 'hipotese', 'campo-de-exploracao'].includes(n.status));

  return (
    <div className="page">
      <div className="page-inner">
        <header className="bh">
          <div>
            <div className="kicker">Execução · o que possui responsável, status e próximo passo</div>
            <h1 className="display" style={{ marginTop: 8 }}>
              Execução
            </h1>
            <p className="sub">
              Duas frentes prioritárias até dezembro de 2026, a ordem de execução em três camadas e tudo que o documento
              marca como hipótese, claim a validar ou pendência.
            </p>
          </div>
          <div className="meta">
            <div>
              <b>Fonte</b> Blocos 2 e 8, mais pendências de todo o documento
            </div>
          </div>
        </header>

        <Section title="Ordem de execução" count="Bloco 8 · p. 135">
          <div className="road">
            {phases.map((ph) => (
              <div key={ph.p} className="ph">
                <div className="lbl">{ph.lbl}</div>
                {ordem
                  .filter((n) => n.priority === ph.p)
                  .map((n, i) => {
                    const target = n.related?.[0];
                    const tm = target ? moduleById(allNodes.find((x) => x.id === target)!.module) : null;
                    return (
                      <div key={n.id} className="it" onClick={() => openDetail(target ?? n.id)}>
                        <span className="n">{ordem.indexOf(n) + 1}</span>
                        <span>
                          <div className="t">{n.title}</div>
                          <div className="s">{tm ? `Bloco ${tm.id} · ${tm.short}` : ''}{i === 0 && ph.p === 'imediata' ? ' · em implantação' : ''}</div>
                        </span>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </Section>

        <KanbanLane lane={LANES[0]} />
        <KanbanLane lane={LANES[1]} />
        <KanbanLane lane={LANES[2]} />

        <Section title="Hipóteses, claims e pendências" count={`${pend.length} itens marcados no documento`}>
          <div className="pend">
            {pend.map((n) => (
              <div key={n.id} className="row" onClick={() => openDetail(n.id)}>
                <span className="st">{statusLabel[n.status!]}</span>
                <span>
                  <div className="t">{n.title}</div>
                  {n.summary && <div className="s">{n.summary}</div>}
                </span>
                <span className="m">
                  B{n.module} · {pagesLabel(n.pages)}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
