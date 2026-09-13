import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { getNode, type VRNode } from '../data';
import { useStore } from '../store';
import { useLocal } from '../hooks';
import { statusLabel } from './Objects';

export const COLS = ['Mapear', 'Preparar', 'Em execução', 'Concluído'] as const;
export type Col = (typeof COLS)[number];

export interface Lane {
  id: string;
  title: string;
  owner: string;
  rootId: string;
  cards: { id: string; col: Col }[];
}

export const LANES: Lane[] = [
  {
    id: 'p1',
    title: 'Prioridade 01 · Stakeholders',
    owner: 'Owner: Dr. Vladmir',
    rootId: 'b2.stakeholders',
    cards: [
      { id: 'b2.stakeholders.perfil-a', col: 'Mapear' },
      { id: 'b2.stakeholders.perfil-b', col: 'Mapear' },
      { id: 'b2.stakeholders.perfil-c', col: 'Mapear' },
      { id: 'b2.stakeholders.perfil-d', col: 'Mapear' },
      { id: 'b2.stakeholders.etapa1', col: 'Mapear' },
      { id: 'b2.stakeholders.etapa2', col: 'Mapear' },
      { id: 'b2.stakeholders.etapa3', col: 'Preparar' },
      { id: 'b2.stakeholders.etapa4', col: 'Preparar' },
      { id: 'b2.stakeholders.etapa5', col: 'Preparar' },
      { id: 'b2.stakeholders.etapa6', col: 'Preparar' },
    ],
  },
  {
    id: 'p2',
    title: 'Prioridade 02 · Equipe de atendimento',
    owner: 'Implantação: Nathan / Mastrangeli & Co. · Executoras: Elizângela + Carol · Patrocínio: Dr. Vladmir',
    rootId: 'b2.treinamento',
    cards: [
      { id: 'b2.treinamento.ciclo1', col: 'Em execução' },
      { id: 'b2.treinamento.modulo1', col: 'Preparar' },
      { id: 'b2.treinamento.modulo2', col: 'Preparar' },
      { id: 'b2.treinamento.modulo3', col: 'Preparar' },
      { id: 'b2.treinamento.modulo4', col: 'Preparar' },
      { id: 'b2.treinamento.modulo5', col: 'Preparar' },
      { id: 'b2.treinamento.modulo6', col: 'Preparar' },
      { id: 'b2.treinamento.modulo7', col: 'Preparar' },
      { id: 'b2.treinamento.modulo8', col: 'Preparar' },
      { id: 'b2.treinamento.metricas', col: 'Preparar' },
      { id: 'b2.governanca.mandato', col: 'Concluído' },
      { id: 'b2.governanca.horario', col: 'Concluído' },
      { id: 'b2.governanca.nao-bloqueio', col: 'Concluído' },
      { id: 'b2.governanca.impedimento', col: 'Concluído' },
      { id: 'b2.governanca.acordo', col: 'Concluído' },
    ],
  },
  {
    id: 'p3',
    title: 'Ordem de execução · Bloco 8',
    owner: 'Fase imediata → segunda camada → terceira camada',
    rootId: 'b8.ordem',
    cards: [
      { id: 'b8.ordem.1', col: 'Em execução' },
      { id: 'b8.ordem.2', col: 'Em execução' },
      { id: 'b8.ordem.3', col: 'Em execução' },
      { id: 'b8.ordem.4', col: 'Mapear' },
      { id: 'b8.ordem.5', col: 'Mapear' },
      { id: 'b8.ordem.6', col: 'Mapear' },
      { id: 'b8.cultura.dia-do-bolo', col: 'Mapear' },
      { id: 'b8.ordem.7', col: 'Mapear' },
      { id: 'b8.ordem.8', col: 'Mapear' },
      { id: 'b8.ordem.9', col: 'Mapear' },
    ],
  },
];

function Card({ node, dragging, overlay }: { node: VRNode; dragging?: boolean; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const openDetail = useStore((s) => s.openDetail);
  const { attributes, listeners, setNodeRef } = useDraggable({ id: node.id, disabled: overlay });
  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      className={`kc ${dragging ? 'dragging' : ''} ${overlay ? 'overlay' : ''}`}
      onClick={() => setOpen((o) => !o)}
    >
      {node.kicker && <div className="k">{node.kicker}</div>}
      <div className="t">{node.title}</div>
      <div className="f">
        <span className="own">{node.owner?.[0] ?? ''}</span>
        <span>{node.status ? statusLabel[node.status] : ''}</span>
      </div>
      {open && !overlay && (
        <div className="open" onClick={(e) => e.stopPropagation()}>
          {node.summary}
          <div className="act">
            <button onClick={() => openDetail(node.id)}>Ver tudo</button>
            <button onClick={() => setOpen(false)}>Recolher</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Column({ lane, col, ids, active }: { lane: string; col: Col; ids: string[]; active: string | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: `${lane}::${col}` });
  return (
    <div className={`kb-col ${isOver ? 'over' : ''}`}>
      <div className="h">
        <span className="t">{col}</span>
        <span className="n">{ids.length}</span>
      </div>
      <div ref={setNodeRef} className="kb-list">
        {ids.map((id) => {
          const n = getNode(id);
          return n ? <Card key={id} node={n} dragging={active === id} /> : null;
        })}
      </div>
    </div>
  );
}

export function KanbanLane({ lane }: { lane: Lane }) {
  const openDetail = useStore((s) => s.openDetail);
  const [pos, setPos] = useLocal<Record<string, Col>>(`vr.kanban.${lane.id}`, {});
  const [active, setActive] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  );
  const colOf = (id: string) => pos[id] ?? lane.cards.find((c) => c.id === id)!.col;
  const onEnd = (e: DragEndEvent) => {
    setActive(null);
    const over = e.over?.id as string | undefined;
    if (!over) return;
    const col = over.split('::')[1] as Col;
    setPos((p) => ({ ...p, [e.active.id as string]: col }));
  };
  const onStart = (e: DragStartEvent) => setActive(e.active.id as string);
  const activeNode = active ? getNode(active) : null;
  const dirty = Object.keys(pos).length > 0;
  return (
    <div className="lane">
      <div className="lane-h">
        <h2>
          <button onClick={() => openDetail(lane.rootId)}>{lane.title}</button>
        </h2>
        <span className="own">{lane.owner}</span>
        {dirty && (
          <button className="rst" onClick={() => setPos({})}>
            restaurar posições do documento
          </button>
        )}
      </div>
      <DndContext sensors={sensors} onDragStart={onStart} onDragEnd={onEnd} onDragCancel={() => setActive(null)}>
        <div className="kb">
          {COLS.map((c) => (
            <Column key={c} lane={lane.id} col={c} active={active} ids={lane.cards.map((x) => x.id).filter((id) => colOf(id) === c)} />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>{activeNode ? <Card node={activeNode} overlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
