import { motion } from 'motion/react';
import { getChildren, mustNode } from '../data';
import { useStore } from '../store';
import { BlockHeader, BlockTree, ExpandableObject, Section } from '../components/Objects';

const flows = (id: string) => {
  const n = mustNode(id);
  return (n.content ?? []).filter((b) => b.kind === 'flow') as { kind: 'flow'; label?: string; steps: string[] }[];
};
const kv = (id: string) => {
  const n = mustNode(id);
  const b = (n.content ?? []).find((x) => x.kind === 'kv');
  return b && b.kind === 'kv' ? b.pairs : [];
};
const ol = (id: string) => {
  const n = mustNode(id);
  const b = (n.content ?? []).find((x) => x.kind === 'ol');
  return b && b.kind === 'ol' ? b.items : [];
};

export function Educacao() {
  const openDetail = useStore((s) => s.openDetail);
  const [entrada, processo, saida] = flows('b3.transformacao');
  const aplic = kv('b3.aplicacao');
  const papel = ol('b3.papel');

  return (
    <div className="page">
      <div className="page-inner">
        <BlockHeader moduleId={3} />

        <div className="tf" onClick={() => openDetail('b3.transformacao')} style={{ cursor: 'pointer' }}>
          <div className="st in">
            <div className="lbl">{entrada?.label}</div>
            {entrada?.steps.map((s, i) => (
              <motion.div key={s} className="q" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                {s}
              </motion.div>
            ))}
          </div>
          <div className="st mid">
            <div className="lbl">{processo?.label}</div>
            {processo?.steps.map((s, i) => (
              <motion.div key={s} className="q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }}>
                {s}
              </motion.div>
            ))}
          </div>
          <div className="st out">
            <div className="lbl">{saida?.label}</div>
            {saida?.steps.map((s) => (
              <motion.div key={s} className="q" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}>
                {s}
              </motion.div>
            ))}
            <p className="faint small" style={{ marginTop: 14 }}>
              Sintoma → causa → diagnóstico → plano. Responsável clínico: Dr. Vladmir.
            </p>
          </div>
        </div>

        <Section title="Onde o conceito atravessa a jornada" count="aplicação na operação · p. 26">
          <div className="chain">
            {aplic.map(([t, e]) => (
              <div key={t} className="c" onClick={() => openDetail('b3.aplicacao')}>
                <div className="t">{t}</div>
                <div className="e">{e}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="As quatro funções simultâneas do Dr. Vladmir" count="p. 25">
          <div className="four">
            {papel.map((it, i) => {
              const [t, e] = it.split(' — ');
              return (
                <div key={t} className="f" onClick={() => openDetail('b3.papel')}>
                  <div className="n">{i + 1}</div>
                  <div className="t">{t}</div>
                  <div className="e">{e}</div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="O raciocínio, seção a seção">
          {getChildren('b3').map((n) => (
            <ExpandableObject key={n.id} node={n} />
          ))}
        </Section>

        <Section title="Índice do bloco">
          <BlockTree rootId="b3" />
        </Section>
      </div>
    </div>
  );
}
