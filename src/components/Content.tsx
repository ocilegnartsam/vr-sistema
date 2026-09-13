import type { ContentBlock } from '../data';

const toneLabel: Record<string, string> = {
  claim: 'Claim a validar / documentar',
  hypothesis: 'Hipótese a validar',
  pending: 'Ponto pendente',
  warning: '',
  principle: '',
};

export function Content({ blocks }: { blocks?: ContentBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <div className="content">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'p':
            return <p key={i}>{b.text}</p>;
          case 'h':
            return <h4 key={i}>{b.text}</h4>;
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );
          case 'flow':
            return (
              <div key={i} className="flow">
                {b.label && <div className="lbl">{b.label}</div>}
                {b.steps.map((s, j) => (
                  <div key={j} className="st">
                    {s}
                  </div>
                ))}
              </div>
            );
          case 'quote':
            return (
              <blockquote key={i} className="quote" style={{ margin: 0 }}>
                {b.text}
                {b.by && <span className="by">{b.by}</span>}
              </blockquote>
            );
          case 'big':
            return (
              <div key={i} className="big">
                {b.text}
              </div>
            );
          case 'callout': {
            const tone = b.tone ?? '';
            const lbl = toneLabel[tone];
            return (
              <div key={i} className={`callout ${tone}`}>
                {lbl && <span className="tone">{lbl}</span>}
                {b.text}
              </div>
            );
          }
          case 'kv':
            return (
              <dl key={i} className="kv">
                {b.pairs.map(([k, v], j) => (
                  <div key={j} style={{ display: 'contents' }}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            );
          case 'table':
            return (
              <div key={i} className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'vs':
            return (
              <div key={i} className="vs">
                <div className="col l">
                  <div className="lbl">{b.left.label}</div>
                  <ul>
                    {b.left.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </div>
                <div className="col r">
                  <div className="lbl">{b.right.label}</div>
                  <ul>
                    {b.right.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
