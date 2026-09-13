import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { allNodes, moduleById, modules, pagesLabel, type ContentBlock, type VRNode } from '../data';
import { useStore } from '../store';

const flatten = (blocks?: ContentBlock[]) =>
  (blocks ?? [])
    .map((b) => {
      switch (b.kind) {
        case 'p': case 'h': case 'big': case 'quote': case 'callout':
          return b.text;
        case 'ul': case 'ol':
          return b.items.join(' ');
        case 'flow':
          return b.steps.join(' ');
        case 'kv':
          return b.pairs.map((p) => p.join(' ')).join(' ');
        case 'table':
          return [b.head.join(' '), ...b.rows.map((r) => r.join(' '))].join(' ');
        case 'vs':
          return [...b.left.items, ...b.right.items].join(' ');
        default:
          return '';
      }
    })
    .join(' ');

type Doc = { id: string; title: string; kicker: string; summary: string; tags: string; body: string; module: number; type: string };

const docs: Doc[] = allNodes.map((n) => ({
  id: n.id,
  title: n.title,
  kicker: n.kicker ?? '',
  summary: n.summary ?? '',
  tags: (n.tags ?? []).join(' '),
  body: flatten(n.content),
  module: n.module,
  type: n.type,
}));

const fuse = new Fuse(docs, {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'kicker', weight: 0.1 },
    { name: 'summary', weight: 0.15 },
    { name: 'body', weight: 0.1 },
  ],
  threshold: 0.32,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
});

const typeLabel: Record<string, string> = {
  module: 'bloco', section: 'seção', concept: 'conceito', step: 'etapa', stage: 'estágio', stakeholder: 'stakeholder',
  task: 'ação', metric: 'métrica', claim: 'claim', principle: 'princípio', hypothesis: 'hipótese', pending: 'pendência', role: 'papel', insight: 'insight',
};

export function CommandPalette() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearch);
  const goToNode = useStore((s) => s.goToNode);
  const navigate = useStore((s) => s.navigate);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!useStore.getState().searchOpen);
      } else if (e.key === 'Escape' && useStore.getState().searchOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) {
      return [
        ...modules.map((m) => ({ kind: 'module' as const, m })),
        { kind: 'exec' as const },
      ];
    }
    return fuse
      .search(q, { limit: 14 })
      .map((r) => ({ kind: 'node' as const, d: r.item as Doc }));
  }, [q]);

  useEffect(() => setSel(0), [q]);

  if (!open) return null;

  const pick = (i: number) => {
    const r = results[i];
    if (!r) return;
    setOpen(false);
    if (r.kind === 'node') goToNode(r.d.id);
    else if (r.kind === 'module') navigate({ view: 'block', slug: r.m.slug });
    else navigate({ view: 'execucao' });
  };

  return (
    <div className="cmdk-veil" onMouseDown={() => setOpen(false)}>
      <div className="cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar: SpineMED, Carol, ortopedista, 95%, LTV, follow-up…"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === 'Enter') pick(sel);
          }}
        />
        <div className="res">
          {results.length === 0 && <div className="empty">Nada encontrado para “{q}”.</div>}
          {results.map((r, i) => {
            if (r.kind === 'module') {
              return (
                <div key={r.m.id} className={`r ${i === sel ? 'on' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => pick(i)}>
                  <span className="m">Bloco {r.m.id}</span>
                  <span>
                    <div className="t">{r.m.title}</div>
                    <div className="s">{r.m.atlasLine}</div>
                  </span>
                  <span className="ty">bloco</span>
                </div>
              );
            }
            if (r.kind === 'exec') {
              return (
                <div key="exec" className={`r ${i === sel ? 'on' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => pick(i)}>
                  <span className="m">Ferramenta</span>
                  <span>
                    <div className="t">Execução</div>
                    <div className="s">Kanban das prioridades, ordem de execução e pendências</div>
                  </span>
                  <span className="ty">operação</span>
                </div>
              );
            }
            const n = allNodes.find((x) => x.id === r.d.id) as VRNode;
            return (
              <div key={r.d.id} className={`r ${i === sel ? 'on' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => pick(i)}>
                <span className="m">
                  B{n.module} · {moduleById(n.module).short}
                  <br />
                  {pagesLabel(n.pages)}
                </span>
                <span>
                  <div className="t">{n.title}</div>
                  <div className="s">{n.kicker ? `${n.kicker} · ` : ''}{n.summary ?? ''}</div>
                </span>
                <span className="ty">{typeLabel[n.type] ?? n.type}</span>
              </div>
            );
          })}
        </div>
        <div className="hint">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span>esc fechar</span>
          <span style={{ marginLeft: 'auto' }}>{allNodes.length} objetos indexados</span>
        </div>
      </div>
    </div>
  );
}
