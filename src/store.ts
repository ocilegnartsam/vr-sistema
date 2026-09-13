import { create } from 'zustand';
import { getNode, moduleById, moduleBySlug } from './data';

export type Route =
  | { view: 'atlas' }
  | { view: 'execucao' }
  | { view: 'block'; slug: string };

interface State {
  route: Route;
  detail: string | null;
  detailStack: string[];
  searchOpen: boolean;
  highlight: string | null;
  navigate: (r: Route) => void;
  openDetail: (id: string, opts?: { push?: boolean }) => void;
  backDetail: () => void;
  closeDetail: () => void;
  goToModule: (moduleId: number) => void;
  goToNode: (id: string) => void;
  setSearch: (v: boolean) => void;
  setHighlight: (id: string | null) => void;
}

const parseHash = (): { route: Route; detail: string | null } => {
  const h = window.location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  let detail: string | null = null;
  const nIdx = parts.indexOf('n');
  if (nIdx >= 0) {
    detail = decodeURIComponent(parts.slice(nIdx + 1).join('/')) || null;
    parts.splice(nIdx);
  }
  let route: Route = { view: 'atlas' };
  if (parts[0] === 'execucao') route = { view: 'execucao' };
  else if (parts[0] === 'b' && parts[1] && moduleBySlug(parts[1])) route = { view: 'block', slug: parts[1] };
  if (detail && !getNode(detail)) detail = null;
  return { route, detail };
};

const toHash = (route: Route, detail: string | null) => {
  let h = '#/';
  if (route.view === 'execucao') h = '#/execucao';
  if (route.view === 'block') h = `#/b/${route.slug}`;
  if (detail) h += (h.endsWith('/') ? '' : '/') + 'n/' + encodeURIComponent(detail);
  return h;
};

let syncing = false;
const write = (route: Route, detail: string | null) => {
  const h = toHash(route, detail);
  if (window.location.hash !== h) {
    syncing = true;
    window.location.hash = h;
    setTimeout(() => (syncing = false), 0);
  }
};

const initial = parseHash();

export const useStore = create<State>((set, get) => ({
  route: initial.route,
  detail: initial.detail,
  detailStack: [],
  searchOpen: false,
  highlight: null,
  navigate: (route) => {
    set({ route, detail: null, detailStack: [], highlight: null });
    write(route, null);
  },
  openDetail: (id, opts) => {
    const cur = get().detail;
    const stack = opts?.push && cur && cur !== id ? [...get().detailStack, cur] : [];
    set({ detail: id, detailStack: stack });
    write(get().route, id);
  },
  backDetail: () => {
    const stack = [...get().detailStack];
    const prev = stack.pop() ?? null;
    set({ detail: prev, detailStack: stack });
    write(get().route, prev);
  },
  closeDetail: () => {
    set({ detail: null, detailStack: [] });
    write(get().route, null);
  },
  goToModule: (moduleId) => {
    const m = moduleById(moduleId);
    get().navigate({ view: 'block', slug: m.slug });
  },
  goToNode: (id) => {
    const n = getNode(id);
    if (!n) return;
    const m = moduleById(n.module);
    const route: Route = { view: 'block', slug: m.slug };
    set({ route, detail: n.type === 'module' ? null : id, detailStack: [], highlight: id });
    write(route, n.type === 'module' ? null : id);
  },
  setSearch: (v) => set({ searchOpen: v }),
  setHighlight: (id) => set({ highlight: id }),
}));

window.addEventListener('hashchange', () => {
  if (syncing) return;
  const { route, detail } = parseHash();
  useStore.setState({ route, detail, detailStack: [] });
});
