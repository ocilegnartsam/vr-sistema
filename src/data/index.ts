import type { VRNode } from './types';
import { b0 } from './blocks/b0';
import { b1 } from './blocks/b1';
import { b2 } from './blocks/b2';
import { b3 } from './blocks/b3';
import { b4 } from './blocks/b4';
import { b5 } from './blocks/b5';
import { b6 } from './blocks/b6';
import { b7 } from './blocks/b7';
import { b8 } from './blocks/b8';
import { b9 } from './blocks/b9';

export * from './types';
export * from './modules';

export const allNodes: VRNode[] = [...b0, ...b1, ...b2, ...b3, ...b4, ...b5, ...b6, ...b7, ...b8, ...b9];

const index = new Map<string, VRNode>();
for (const n of allNodes) {
  if (index.has(n.id)) console.warn('[data] id duplicado', n.id);
  index.set(n.id, n);
}

const childrenIndex = new Map<string, VRNode[]>();
for (const n of allNodes) {
  if (!n.parent) continue;
  const arr = childrenIndex.get(n.parent) ?? [];
  arr.push(n);
  childrenIndex.set(n.parent, arr);
}
for (const arr of childrenIndex.values()) {
  arr.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

// relações inversas (quem aponta para mim)
const inbound = new Map<string, Set<string>>();
for (const n of allNodes) {
  for (const r of n.related ?? []) {
    if (!index.has(r)) {
      if (import.meta.env.DEV) console.warn('[data] related inexistente', n.id, '->', r);
      continue;
    }
    const s = inbound.get(r) ?? new Set();
    s.add(n.id);
    inbound.set(r, s);
  }
}

export const getNode = (id: string): VRNode | undefined => index.get(id);
export const mustNode = (id: string): VRNode => {
  const n = index.get(id);
  if (!n) throw new Error(`nó ausente: ${id}`);
  return n;
};
export const getChildren = (id: string): VRNode[] => childrenIndex.get(id) ?? [];
export const getRelated = (id: string): VRNode[] => {
  const n = index.get(id);
  if (!n) return [];
  const ids = new Set<string>(n.related ?? []);
  for (const r of inbound.get(id) ?? []) ids.add(r);
  ids.delete(id);
  return [...ids].map((i) => index.get(i)).filter((x): x is VRNode => !!x);
};
export const getAncestors = (id: string): VRNode[] => {
  const out: VRNode[] = [];
  let cur = index.get(id);
  while (cur?.parent) {
    const p = index.get(cur.parent);
    if (!p) break;
    out.unshift(p);
    cur = p;
  }
  return out;
};
export const nodesOfModule = (m: number) => allNodes.filter((n) => n.module === m);
export const pagesLabel = (p: VRNode['pages']) =>
  Array.isArray(p) ? (p[0] === p[1] ? `p. ${p[0]}` : `p. ${p[0]}–${p[1]}`) : `p. ${p}`;
