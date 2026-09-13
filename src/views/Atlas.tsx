import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnimatePresence, motion } from 'motion/react';
import { getNode, moduleById, modules } from '../data';
import { useStore } from '../store';
import { useIsMobile } from '../hooks';

type AData = {
  kicker?: string;
  label: string;
  output?: string;
  cls?: string;
  block: number;
  nodeId?: string;
  line?: string;
};

function AtlasNode({ data, selected }: NodeProps<Node<AData>>) {
  return (
    <div className={`an ${data.cls ?? ''} ${selected ? 'hl' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      {data.kicker && <div className="k">{data.kicker}</div>}
      <div className="t">{data.label}</div>
      {data.output && (
        <div className="o">
          {data.output.startsWith('→') ? data.output : <>Output <b>{data.output}</b></>}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { atlas: AtlasNode };

const X = (i: number) => i * 245;

const NODES: Node<AData>[] = [
  // origem
  { id: 'ctx', type: 'atlas', position: { x: X(0) - 60, y: -135 }, data: { kicker: 'Bloco 0 · Contexto', label: 'Dr. Vladmir Resende', output: '→ 9,5 de entrega, 2 de captura', cls: 'ghost', block: 0, nodeId: 'b0' } },
  // motores
  { id: 'mkt', type: 'atlas', position: { x: X(0), y: 0 }, data: { kicker: '1 · Da porta para fora', label: 'Marketing', output: 'lead qualificado', block: 8, nodeId: 'b8.marketing' } },
  { id: 'com', type: 'atlas', position: { x: X(1), y: 0 }, data: { kicker: '2 · Da porta para dentro', label: 'Comercial / Atendimento', output: 'consulta', block: 8, nodeId: 'b8.comercial' } },
  { id: 'ope', type: 'atlas', position: { x: X(2), y: 0 }, data: { kicker: '3 · Serviço comprado', label: 'Entrega clínica', output: 'valor clínico entregue', block: 8, nodeId: 'b8.operacao' } },
  { id: 'pos', type: 'atlas', position: { x: X(3), y: 0 }, data: { kicker: '4 · Maior reserva de valor', label: 'Pós-atendimento', output: 'continuidade', cls: 'star', block: 8, nodeId: 'b8.pos' } },
  { id: 'est', type: 'atlas', position: { x: X(4), y: 0 }, data: { kicker: 'Bloco 7', label: 'Esteira de Valor', output: 'novas entregas relevantes', block: 7, nodeId: 'b7' } },
  { id: 'rec', type: 'atlas', position: { x: X(5), y: 0 }, data: { kicker: 'Recorrência', label: 'Paciente permanece', output: 'novas transações', block: 6, nodeId: 'b6.pos-motor' } },
  { id: 'ltv', type: 'atlas', position: { x: X(6), y: -6 }, data: { kicker: 'Bloco 6', label: 'LTV', output: 'valor econômico da relação', cls: 'ltv', block: 6, nodeId: 'b6' } },
  // stakeholders: segunda máquina de aquisição
  { id: 'stk', type: 'atlas', position: { x: X(0) + 215, y: -135 }, data: { kicker: 'Bloco 2 · Prioridade 01', label: 'Stakeholders', output: 'indicações · confiança transferida', block: 2, nodeId: 'b2.stakeholders' } },
  // funil e treinamento (as frentes operacionais)
  { id: 'fun', type: 'atlas', position: { x: X(0), y: 140 }, data: { kicker: 'Bloco 1', label: 'Funil Instagram', output: '→ Reels → LP → WhatsApp → consulta', cls: 'ghost', block: 1, nodeId: 'b1' } },
  { id: 'tre', type: 'atlas', position: { x: X(1), y: 140 }, data: { kicker: 'Bloco 2 · Prioridade 02', label: 'Treinamento da equipe', output: '→ Elizângela + Carol · Nathan implanta', cls: 'ghost', block: 2, nodeId: 'b2.treinamento' } },
  // camada de inteligência (acima)
  { id: 'jor', type: 'atlas', position: { x: X(1) - 40, y: -270 }, data: { kicker: 'Bloco 4 · Patient Journey', label: 'Jornada de consciência', output: '→ define quando capturar', cls: 'ghost', block: 4, nodeId: 'b4' } },
  { id: 'cad', type: 'atlas', position: { x: X(2) + 20, y: -270 }, data: { kicker: 'Bloco 5 · Cadeia Clínica', label: 'Da doença ao sintoma', output: '→ define o que está acontecendo', cls: 'ghost', block: 5, nodeId: 'b5' } },
  { id: 'edu', type: 'atlas', position: { x: X(3) + 80, y: -270 }, data: { kicker: 'Bloco 3 · Educação e adesão', label: 'Sintoma → causa → plano', output: '→ aumenta compreensão', cls: 'ghost', block: 3, nodeId: 'b3' } },
  // tese (B9)
  { id: 'gap', type: 'atlas', position: { x: X(5) + 40, y: -270 }, data: { kicker: 'Bloco 9 · Tese', label: 'Valor criado × capturado', output: '→ fechar o gap 2 → 8', cls: 'ghost', block: 9, nodeId: 'b9' } },
  // camadas transversais
  ...['Cultura', 'Pessoas', 'Gestão', 'Governança', 'Dados', 'Marca', 'Missão, visão e valores'].map((l, i) => ({
    id: `lay-${i}`,
    type: 'atlas',
    position: { x: X(0) + 30 + i * 228, y: 305 },
    data: {
      label: l,
      cls: 'layer',
      block: 8,
      nodeId: l === 'Cultura' ? 'b8.cultura' : l === 'Gestão' ? 'b8.gestao' : l === 'Governança' ? 'b8.gestao.governanca' : 'b8.painel',
    } as AData,
    selectable: true,
  })),
];

const arrow = { type: MarkerType.Arrow, width: 14, height: 14, color: '#485155' };
const EDGES: Edge[] = [
  { id: 'e0', source: 'ctx', sourceHandle: 'bottom', target: 'mkt', targetHandle: 'top', className: 'faint' },
  { id: 'e1', source: 'mkt', target: 'com', className: 'thick', markerEnd: arrow },
  { id: 'e2', source: 'com', target: 'ope', className: 'thick', markerEnd: arrow },
  { id: 'e3', source: 'ope', target: 'pos', className: 'thick', markerEnd: arrow },
  { id: 'e4', source: 'pos', target: 'est', className: 'thick', markerEnd: arrow },
  { id: 'e5', source: 'est', target: 'rec', className: 'thick', markerEnd: arrow },
  { id: 'e6', source: 'rec', target: 'ltv', className: 'thick', markerEnd: arrow },
  { id: 'e7', source: 'stk', sourceHandle: 'bottom', target: 'com', targetHandle: 'top', markerEnd: arrow },
  { id: 'e8', source: 'mkt', sourceHandle: 'bottom', target: 'fun', targetHandle: 'top', className: 'faint' },
  { id: 'e9', source: 'com', sourceHandle: 'bottom', target: 'tre', targetHandle: 'top', className: 'faint' },
  { id: 'e10', source: 'jor', sourceHandle: 'bottom', target: 'stk', targetHandle: 'top', className: 'faint' },
  { id: 'e11', source: 'jor', sourceHandle: 'bottom', target: 'mkt', targetHandle: 'top', className: 'faint' },
  { id: 'e12', source: 'cad', sourceHandle: 'bottom', target: 'ope', targetHandle: 'top', className: 'faint' },
  { id: 'e13', source: 'edu', sourceHandle: 'bottom', target: 'ope', targetHandle: 'top', className: 'faint' },
  { id: 'e14', source: 'edu', sourceHandle: 'bottom', target: 'pos', targetHandle: 'top', className: 'faint' },
  { id: 'e15', source: 'gap', sourceHandle: 'bottom', target: 'ltv', targetHandle: 'top', className: 'faint' },
];

function AtlasInner() {
  const goToModule = useStore((s) => s.goToModule);
  const openDetail = useStore((s) => s.openDetail);
  const [peek, setPeek] = useState<{ d: AData; x: number; y: number } | null>(null);
  const rf = useReactFlow();

  const onNodeClick = useCallback((e: React.MouseEvent, n: Node) => {
    const d = n.data as AData;
    const host = (e.currentTarget as HTMLElement).closest('.canvas-page') as HTMLElement | null;
    const r = host?.getBoundingClientRect();
    const x = Math.min((e.clientX - (r?.left ?? 0)) + 14, (r?.width ?? 1200) - 360);
    const y = Math.min((e.clientY - (r?.top ?? 0)) + 14, (r?.height ?? 800) - 290);
    setPeek({ d, x, y });
  }, []);

  const nodes = useMemo(() => NODES, []);
  const edges = useMemo(() => EDGES, []);

  return (
    <div className="canvas-page">
      <div className="atlas-title">
        <h1 className="display">Atlas do sistema</h1>
        <p>
          O faturamento depende da qualidade do sistema inteiro. Arraste para mover, role para aproximar, clique em uma
          área para entrar.
        </p>
      </div>
      <div className="hud" style={{ right: 28, top: 20 }}>
        <button onClick={() => rf.fitView({ padding: 0.15, duration: 500 })}>Centralizar</button>
        <button onClick={() => rf.zoomIn({ duration: 250 })}>+</button>
        <button onClick={() => rf.zoomOut({ duration: 250 })}>−</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.05 }}
        minZoom={0.35}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        onNodeClick={onNodeClick}
        onPaneClick={() => setPeek(null)}
        onMoveStart={() => setPeek(null)}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(20,25,27,0.16)" />
      </ReactFlow>
      <AnimatePresence>
        {peek && (
          <motion.div
            key={peek.d.nodeId}
            className="peek"
            style={{ left: peek.x, top: peek.y }}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="k">Bloco {peek.d.block} · {moduleById(peek.d.block).short}</div>
            <h3>{peek.d.nodeId ? getNode(peek.d.nodeId)?.title ?? peek.d.label : peek.d.label}</h3>
            <p>{peek.d.nodeId ? getNode(peek.d.nodeId)?.summary : moduleById(peek.d.block).atlasLine}</p>
            <div className="acts">
              <button className="primary" onClick={() => goToModule(peek.d.block)}>
                Entrar na área
              </button>
              {peek.d.nodeId && (
                <button onClick={() => openDetail(peek.d.nodeId!)}>Ler o conteúdo</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="atlas-blocks">
        {modules.map((m) => (
          <button key={m.id} onClick={() => goToModule(m.id)}>
            <b>{m.id}</b>
            {m.short}
          </button>
        ))}
      </div>
      <div className="atlas-legend">
        <span>Receita = leads × qualificação × conversão × ticket × recorrência</span>
        <span>★ área com maior potencial subexplorado</span>
      </div>
    </div>
  );
}

function AtlasMobile() {
  const goToModule = useStore((s) => s.goToModule);
  const order = [8, 0, 1, 2, 3, 4, 5, 6, 7, 9];
  return (
    <div className="page">
      <div className="page-inner">
        <div className="kicker">Sistema de inteligência, estratégia e operação</div>
        <h1 className="display" style={{ fontSize: 34, marginTop: 8 }}>
          Atlas do sistema
        </h1>
        <p className="muted" style={{ marginTop: 10 }}>
          O faturamento depende da qualidade do sistema inteiro. Escolha uma área para aprofundar.
        </p>
        <div className="drill" style={{ marginTop: 24 }}>
          {order.map((id) => {
            const m = moduleById(id);
            return (
              <div key={id} className="it" onClick={() => goToModule(id)}>
                <span className="n">{m.id}</span>
                <span>
                  <div className="t">{m.short}</div>
                  <div className="s">{m.atlasLine}</div>
                </span>
                <span className="a">→</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Atlas() {
  const mobile = useIsMobile();
  if (mobile) return <AtlasMobile />;
  return (
    <ReactFlowProvider>
      <AtlasInner />
    </ReactFlowProvider>
  );
}
