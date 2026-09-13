/**
 * Modelo semântico do documento "VR - Diagnóstico e Estratégia (2026/2027)".
 * O PDF é a source of truth. Cada VRNode representa um objeto do documento
 * (seção, conceito, etapa, stakeholder, métrica, claim, hipótese...) e pode ser
 * reutilizado em qualquer visualização: mapa, timeline, kanban, busca, detalhe.
 */

export type ContentBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'flow'; steps: string[]; label?: string }
  | { kind: 'quote'; text: string; by?: string }
  | { kind: 'big'; text: string }
  | { kind: 'callout'; text: string; tone?: 'principle' | 'warning' | 'claim' | 'hypothesis' | 'pending' }
  | { kind: 'kv'; pairs: [string, string][] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'vs'; left: { label: string; items: string[] }; right: { label: string; items: string[] } };

export type NodeType =
  | 'module'
  | 'section'
  | 'concept'
  | 'step'
  | 'stage'
  | 'stakeholder'
  | 'task'
  | 'metric'
  | 'claim'
  | 'principle'
  | 'hypothesis'
  | 'pending'
  | 'role'
  | 'insight';

export type NodeStatus =
  | 'definido'
  | 'em-implantacao'
  | 'a-mapear'
  | 'hipotese'
  | 'a-validar'
  | 'pendente'
  | 'campo-de-exploracao';

export type Priority = 'imediata' | 'segunda-camada' | 'terceira-camada';

export interface VRNode {
  /** id estável, ex.: 'b2.stakeholders.etapa1' */
  id: string;
  /** bloco de origem 0..9 */
  module: number;
  type: NodeType;
  title: string;
  /** rótulo curto acima do título (ex.: "Etapa 1", "Nível 3", "Perfil A") */
  kicker?: string;
  /** 1 a 2 frases, fiel ao documento, usadas no estado compacto/expandido */
  summary?: string;
  /** conteúdo completo, fiel ao PDF, em blocos */
  content?: ContentBlock[];
  owner?: string[];
  status?: NodeStatus;
  priority?: Priority;
  /** página(s) de origem no PDF */
  pages: number | [number, number];
  tags?: string[];
  /** ids de nós relacionados (em qualquer bloco) */
  related?: string[];
  /** id do nó pai (hierarquia do documento) */
  parent?: string;
  /** ordem entre irmãos */
  order?: number;
}

export type ViewType =
  | 'context'
  | 'funnel'
  | 'kanban'
  | 'transformation'
  | 'timeline'
  | 'causal'
  | 'economics'
  | 'ladder'
  | 'engine'
  | 'matrix';

export interface ModuleMeta {
  id: number;
  slug: string;
  title: string;
  short: string;
  subtitle: string;
  macroarea: string;
  viewType: ViewType;
  pages: [number, number];
  /** id do VRNode raiz do bloco */
  root: string;
  /** frase de uma linha usada no Atlas */
  atlasLine: string;
}
