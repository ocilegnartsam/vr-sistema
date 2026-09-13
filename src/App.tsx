import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from './store';
import { moduleBySlug } from './data';
import { Atlas } from './views/Atlas';
import { Execucao } from './views/Execucao';
import { Contexto } from './views/Contexto';
import { Funil } from './views/Funil';
import { Prioridades } from './views/Prioridades';
import { Educacao } from './views/Educacao';
import { Jornada } from './views/Jornada';
import { CadeiaClinica } from './views/CadeiaClinica';
import { Economia } from './views/Economia';
import { Esteira } from './views/Esteira';
import { RevenueEngine } from './views/RevenueEngine';
import { Valor } from './views/Valor';
import { DetailPanel } from './components/DetailPanel';
import { CommandPalette } from './components/CommandPalette';

const viewFor = (slug: string) => {
  switch (slug) {
    case 'contexto': return <Contexto />;
    case 'funil': return <Funil />;
    case 'prioridades': return <Prioridades />;
    case 'educacao': return <Educacao />;
    case 'jornada': return <Jornada />;
    case 'cadeia-clinica': return <CadeiaClinica />;
    case 'economia': return <Economia />;
    case 'esteira': return <Esteira />;
    case 'revenue-engine': return <RevenueEngine />;
    case 'valor': return <Valor />;
    default: return null;
  }
};

export default function App() {
  const route = useStore((s) => s.route);
  const navigate = useStore((s) => s.navigate);
  const setSearch = useStore((s) => s.setSearch);
  const mod = route.view === 'block' ? moduleBySlug(route.slug) : undefined;

  useEffect(() => {
    document.title = mod ? `${mod.short} · Dr. Vladmir Resende` : 'Dr. Vladmir Resende · Diagnóstico e Estratégia 2026/2027';
  }, [mod]);

  const key = route.view === 'block' ? route.slug : route.view;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <button className="name" onClick={() => navigate({ view: 'atlas' })}>
            Dr. Vladmir Resende
          </button>
          <span className="sub">Diagnóstico e Estratégia 2026/2027</span>
        </div>
        <nav className="crumbs">
          <button className={route.view === 'atlas' ? 'cur' : ''} onClick={() => navigate({ view: 'atlas' })}>
            Atlas
          </button>
          {route.view === 'execucao' && (
            <>
              <span className="sep">›</span>
              <span className="cur">Execução</span>
            </>
          )}
          {mod && (
            <>
              <span className="sep">›</span>
              <span className="cur">
                Bloco {mod.id} · {mod.short}
              </span>
            </>
          )}
        </nav>
        <div className="nav">
          <button className={route.view === 'atlas' ? 'on' : ''} onClick={() => navigate({ view: 'atlas' })}>
            Atlas
          </button>
          <button className={route.view === 'execucao' ? 'on' : ''} onClick={() => navigate({ view: 'execucao' })}>
            Execução
          </button>
          <button onClick={() => setSearch(true)}>
            Buscar<kbd>⌘K</kbd>
          </button>
        </div>
      </header>
      <main className="stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {route.view === 'atlas' && <Atlas />}
            {route.view === 'execucao' && <Execucao />}
            {route.view === 'block' && viewFor(route.slug)}
          </motion.div>
        </AnimatePresence>
      </main>
      <DetailPanel />
      <CommandPalette />
    </div>
  );
}
