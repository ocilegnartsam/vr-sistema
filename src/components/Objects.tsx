import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getChildren, getNode, moduleById, pagesLabel, type VRNode } from '../data';
import { useStore } from '../store';
import { Content } from './Content';

export const statusLabel: Record<string, string> = {
  definido: 'definido',
  'em-implantacao': 'em implantação',
  'a-mapear': 'a mapear',
  hipotese: 'hipótese',
  'a-validar': 'a validar',
  pendente: 'pendente',
  'campo-de-exploracao': 'campo de exploração',
};

/**
 * ExpandableObject — três estados: compacto → expandido (no lugar) → aberto (painel de detalhe).
 */
export function ExpandableObject({
  node,
  defaultOpen = false,
  side,
}: {
  node: VRNode;
  defaultOpen?: boolean;
  side?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const openDetail = useStore((s) => s.openDetail);
  const kids = getChildren(node.id);
  const status = node.status ? statusLabel[node.status] : null;
  return (
    <motion.div layout="position" className={`obj ${open ? 'open' : ''}`} onClick={() => !open && setOpen(true)}>
      <div className="obj-head">
        <div>
          {node.kicker && <div className="obj-kicker">{node.kicker}</div>}
          <div className="obj-title">{node.title}</div>
        </div>
        <div className="obj-side">
          {side ?? (
            <>
              {node.owner?.length ? <span>{node.owner.join(' + ')}</span> : null}
              {status && (
                <span className="status">
                  {node.owner?.length ? ' · ' : ''}
                  {status}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {node.summary && !open && <div className="obj-summary">{node.summary}</div>}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {node.summary && <div className="obj-summary">{node.summary}</div>}
            <div className="obj-body">
              <Content blocks={node.content?.slice(0, 3)} />
              {(node.content?.length ?? 0) > 3 && (
                <p className="faint small" style={{ marginTop: 10 }}>
                  … mais {node.content!.length - 3} trechos no detalhe completo.
                </p>
              )}
            </div>
            {kids.length > 0 && (
              <div className="obj-body" style={{ marginTop: 10 }}>
                <div className="kicker" style={{ marginBottom: 6 }}>
                  Contém
                </div>
                {kids.map((k) => (
                  <div key={k.id} style={{ padding: '4px 0' }}>
                    <button className="linklike" onClick={(e) => { e.stopPropagation(); openDetail(k.id); }}>
                      {k.title}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="obj-actions">
              <button onClick={(e) => { e.stopPropagation(); openDetail(node.id); }}>Ver tudo</button>
              <button onClick={(e) => { e.stopPropagation(); setOpen(false); }}>Recolher</button>
              <span className="pg">{pagesLabel(node.pages)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ObjectList({ ids, nodes }: { ids?: string[]; nodes?: VRNode[] }) {
  const list = nodes ?? (ids ?? []).map((i) => getNode(i)).filter((n): n is VRNode => !!n);
  return (
    <div>
      {list.map((n) => (
        <ExpandableObject key={n.id} node={n} />
      ))}
    </div>
  );
}

export function Section({ title, count, children, id }: { title: string; count?: string; children: ReactNode; id?: string }) {
  return (
    <section className="sec" id={id}>
      <div className="sec-title">
        <h2>{title}</h2>
        {count && <span className="n">{count}</span>}
      </div>
      {children}
    </section>
  );
}

/** Índice completo do bloco em árvore: garante que todo conteúdo seja alcançável. */
export function BlockTree({ rootId }: { rootId: string }) {
  const openDetail = useStore((s) => s.openDetail);
  const rows: { n: VRNode; d: number }[] = [];
  const walk = (id: string, d: number) => {
    for (const k of getChildren(id)) {
      rows.push({ n: k, d });
      walk(k.id, d + 1);
    }
  };
  walk(rootId, 0);
  return (
    <div className="tree">
      {rows.map(({ n, d }) => (
        <div key={n.id} className={`row d${Math.min(d, 3)}`} onClick={() => openDetail(n.id)}>
          <span className="k">{n.kicker ?? ''}</span>
          <span className="t">{n.title}</span>
          <span className="pg">{pagesLabel(n.pages)}</span>
        </div>
      ))}
    </div>
  );
}

export function BlockHeader({ moduleId, children }: { moduleId: number; children?: ReactNode }) {
  const m = moduleById(moduleId);
  const root = getNode(m.root);
  return (
    <header className="bh">
      <div>
        <div className="kicker">Bloco {m.id} · {m.macroarea}</div>
        <h1 className="display" style={{ marginTop: 8 }}>
          {m.title}
        </h1>
        <p className="sub">{root?.summary ?? m.subtitle}</p>
        {children}
      </div>
      <div className="meta">
        <div>
          <b>Fonte</b> {pagesLabel(m.pages)} do PDF
        </div>
        {root?.status && (
          <div>
            <b>Status</b> {statusLabel[root.status]}
          </div>
        )}
        <div>
          <button className="linklike" onClick={() => useStore.getState().openDetail(m.root)}>
            Ler o bloco na íntegra
          </button>
        </div>
      </div>
    </header>
  );
}
