import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../store';

export type FData = { kicker?: string; title: string; sub?: string; cls?: string; nodeId?: string; onClick?: () => void };

function FNode({ data }: NodeProps<Node<FData>>) {
  return (
    <div className={`fn ${data.cls ?? ''}`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      {data.kicker && <div className="k">{data.kicker}</div>}
      <div className="t">{data.title}</div>
      {data.sub && <div className="s">{data.sub}</div>}
    </div>
  );
}
const nodeTypes = { fn: FNode };
export const arrowEnd = { type: MarkerType.Arrow, width: 14, height: 14, color: '#485155' };

export const fnode = (id: string, x: number, y: number, data: FData): Node<FData> => ({ id, type: 'fn', position: { x, y }, data });
export const fedge = (source: string, target: string, opts: Partial<Edge> = {}): Edge => ({
  id: `${source}->${target}${opts.sourceHandle ?? ''}${opts.targetHandle ?? ''}`,
  source,
  target,
  type: 'smoothstep',
  markerEnd: arrowEnd,
  ...opts,
});

function Inner({ nodes, edges, fit = 0.15, direction }: { nodes: Node<FData>[]; edges: Edge[]; fit?: number; direction?: 'h' | 'v' }) {
  const openDetail = useStore((s) => s.openDetail);
  const rf = useReactFlow();
  const n = useMemo(() => nodes, [nodes]);
  const e = useMemo(() => edges, [edges]);
  void direction;
  return (
    <>
      <div className="hud" style={{ right: 10, top: 10 }}>
        <button onClick={() => rf.fitView({ padding: fit, duration: 400 })}>Centralizar</button>
      </div>
      <ReactFlow
        nodes={n}
        edges={e}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: fit }}
        minZoom={0.3}
        maxZoom={1.8}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => {
          const d = node.data as FData;
          if (d.onClick) d.onClick();
          else if (d.nodeId) openDetail(d.nodeId);
        }}
        preventScrolling={false}
        zoomOnScroll={false}
        panOnScroll
      >
        <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="rgba(20,25,27,0.13)" />
      </ReactFlow>
    </>
  );
}

export function FlowCanvas(props: { nodes: Node<FData>[]; edges: Edge[]; height?: number; fit?: number; direction?: 'h' | 'v' }) {
  return (
    <div className="bleed" style={{ height: props.height ?? 420, position: 'relative', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <ReactFlowProvider>
        <Inner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
