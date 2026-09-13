import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getAncestors, getChildren, getNode, getRelated, moduleById, pagesLabel } from '../data';
import { useStore } from '../store';
import { Content } from './Content';
import { statusLabel } from './Objects';

const typeLabel: Record<string, string> = {
  module: 'Bloco',
  section: 'Seção',
  concept: 'Conceito',
  step: 'Etapa',
  stage: 'Estágio',
  stakeholder: 'Stakeholder',
  task: 'Ação',
  metric: 'Métrica',
  claim: 'Claim',
  principle: 'Princípio',
  hypothesis: 'Hipótese',
  pending: 'Pendência',
  role: 'Papel',
  insight: 'Insight',
};

export function DetailPanel() {
  const detail = useStore((s) => s.detail);
  const stack = useStore((s) => s.detailStack);
  const closeDetail = useStore((s) => s.closeDetail);
  const openDetail = useStore((s) => s.openDetail);
  const backDetail = useStore((s) => s.backDetail);
  const goToModule = useStore((s) => s.goToModule);
  const route = useStore((s) => s.route);
  const node = detail ? getNode(detail) : undefined;

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node, closeDetail]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 720;

  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div
            key="veil"
            className="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDetail}
          />
          <motion.aside
            key={node.id}
            className="panel"
            initial={isMobile ? { y: '100%' } : { x: 40, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <PanelBody
              id={node.id}
              hasBack={stack.length > 0}
              onBack={backDetail}
              onClose={closeDetail}
              onOpen={(id) => openDetail(id, { push: true })}
              onModule={(m) => {
                const mod = moduleById(m);
                if (route.view === 'block' && route.slug === mod.slug) closeDetail();
                else goToModule(m);
              }}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelBody({
  id,
  hasBack,
  onBack,
  onClose,
  onOpen,
  onModule,
}: {
  id: string;
  hasBack: boolean;
  onBack: () => void;
  onClose: () => void;
  onOpen: (id: string) => void;
  onModule: (m: number) => void;
}) {
  const node = getNode(id)!;
  const mod = moduleById(node.module);
  const ancestors = getAncestors(id);
  const kids = getChildren(id);
  const related = getRelated(id);
  const route = useStore((s) => s.route);
  const inThisModule = route.view === 'block' && route.slug === mod.slug;

  return (
    <div className="panel-in">
      <div className="panel-top">
        <div className="path">
          {hasBack && (
            <button onClick={onBack} style={{ marginRight: 8 }}>
              ← voltar
            </button>
          )}
          <button onClick={() => onModule(mod.id)}>Bloco {mod.id} · {mod.short}</button>
          {ancestors
            .filter((a) => a.type !== 'module')
            .map((a) => (
              <span key={a.id}>
                <span style={{ opacity: 0.5, margin: '0 2px' }}>›</span>
                <button onClick={() => onOpen(a.id)}>{a.title}</button>
              </span>
            ))}
        </div>
        <button className="x" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      </div>

      <div className="kicker">
        {typeLabel[node.type] ?? node.type}
        {node.kicker ? ` · ${node.kicker}` : ''}
      </div>
      <h2 style={{ marginTop: 8 }}>{node.title}</h2>
      {node.summary && <p className="summary">{node.summary}</p>}
      <div className="facts">
        <span>
          <b>Fonte</b> PDF {pagesLabel(node.pages)}
        </span>
        {node.owner?.length ? (
          <span>
            <b>Responsável</b> {node.owner.join(' + ')}
          </span>
        ) : null}
        {node.status && (
          <span>
            <b>Status</b> {statusLabel[node.status]}
          </span>
        )}
        {node.priority && (
          <span>
            <b>Prioridade</b> {node.priority.replace('-', ' ')}
          </span>
        )}
      </div>

      <Content blocks={node.content} />

      {kids.length > 0 && (
        <div className="sect">
          <div className="lbl">Contém</div>
          <div className="rel">
            {kids.map((k) => (
              <button key={k.id} onClick={() => onOpen(k.id)}>
                <span className="m">{k.kicker ? '' : '·'}</span>
                <span>
                  {k.kicker && <span className="k">{k.kicker} · </span>}
                  <span className="t">{k.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="sect">
          <div className="lbl">Relacionado</div>
          <div className="rel">
            {related.map((r) => (
              <button key={r.id} onClick={() => onOpen(r.id)}>
                <span className="m">B{r.module}</span>
                <span>
                  <span className="t">{r.title}</span>
                  {r.kicker && <span className="k"> · {r.kicker}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {node.tags?.length ? (
        <div className="sect">
          <div className="lbl">Termos</div>
          <p className="small faint">{node.tags.join(' · ')}</p>
        </div>
      ) : null}

      {!inThisModule && (
        <div className="nav-mod">
          <button className="linklike" onClick={() => onModule(mod.id)}>
            Abrir o Bloco {mod.id} — {mod.title}
          </button>
        </div>
      )}
    </div>
  );
}
