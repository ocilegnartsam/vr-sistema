import type { VRNode } from '../types';

export const b0: VRNode[] = [
  {
    id: 'b0',
    module: 0,
    type: 'module',
    title: 'Contexto',
    kicker: 'Bloco 0',
    summary:
      'Quem é o Dr. Vladmir Resende, a situação atual da operação e o objetivo deste material.',
    pages: 1,
    content: [
      { kind: 'h', text: 'Quem é' },
      {
        kind: 'p',
        text: 'Dr. Vladmir Resende, neurocirurgião especialista em coluna, há 20+ anos tratando pacientes em casos avançados e complexos de doenças da coluna. Na última década, atua também com a SpineMED em 300+ pacientes, com mais de 95% de sucesso nos casos indicados, pois sempre foi muito criterioso.',
      },
      { kind: 'h', text: 'Situação atual (diagnóstico registrado no documento)' },
      {
        kind: 'p',
        text: 'Muito bom como médico, mas pouco empresário. Nas palavras do documento: pouco em relacionamento; zero em stakeholders e parcerias estratégicas; zero em marketing e mídia (tudo boca a boca); zero em esteira de produtos; zero em pacotes de tratamento; zero treinamento em atendimento e vendas para a equipe de atendimento; zero em endomarketing.',
      },
      { kind: 'h', text: 'Objetivo do material' },
      {
        kind: 'p',
        text: 'Transformar o conteúdo em uma experiência digital (HTML/programação) com visuais, imagens, gráficos, blocos clicáveis e expansíveis, textos, concatenação inteligente, fontes, dados e sustentações, tudo fiel ao material aqui descrito (concebido por Nathan Mastrangeli). Colocar no ar para o Dr. ter acesso e usar para apresentar, ler, relembrar e todo uso útil a mais, especialmente com IAs, para conceber outros materiais.',
      },
      {
        kind: 'callout',
        tone: 'pending',
        text: 'O documento prevê incluir também missão, visão, valores, como falamos e como não falamos, quem somos e quem não somos, serviços, produtos, canais e stakeholders. Esses itens ainda não constam neste material.',
      },
    ],
    tags: ['contexto', 'Dr. Vladmir', 'SpineMED', 'neurocirurgião', 'coluna'],
    related: ['b9.hoje', 'b1', 'b2'],
  },
  {
    id: 'b0.claim.95',
    module: 0,
    type: 'claim',
    title: '300+ pacientes SpineMED, 95%+ de sucesso',
    kicker: 'Claim a validar',
    summary:
      'Dado histórico interno citado no contexto. O documento determina que seja tratado como claim a auditar e documentar antes de uso público.',
    pages: 1,
    status: 'a-validar',
    content: [
      {
        kind: 'p',
        text: 'Na última década, atuação com a SpineMED em 300+ pacientes e mais de 95% de sucesso nos casos indicados.',
      },
      {
        kind: 'callout',
        tone: 'claim',
        text: 'Internamente, o sistema registra esse número como "DADO CLÍNICO HISTÓRICO A AUDITAR E FORMALIZAR". Ver governança do claim no Bloco 5.',
      },
    ],
    tags: ['95%', 'SpineMED', 'claim'],
    related: ['b5.claim95', 'b4.governanca-claim'],
    parent: 'b0',
  },
  {
    id: 'b0.pessoas',
    module: 0,
    type: 'role',
    title: 'Pessoas e papéis citados no documento',
    summary:
      'Dr. Vladmir (sponsor e autoridade final), Nathan Mastrangeli / Mastrangeli & Co. (inteligência empresarial e implantação), Gerência (viabilização) e Elizângela + Carol (equipe de atendimento).',
    pages: [1, 17],
    content: [
      {
        kind: 'kv',
        pairs: [
          ['Dr. Vladmir Resende', 'Neurocirurgião especialista em coluna. Patrocinador e autoridade final. Owner de Stakeholders e da Operação Clínica.'],
          ['Nathan Mastrangeli / Mastrangeli & Co.', 'Inteligência empresarial, estratégia, marketing, comercial, treinamentos, processos, produtos e experiência. Responsável pelo desenho e implantação das frentes aprovadas.'],
          ['Gerência', 'Viabilização operacional e administrativa: agenda, pessoas, compras, financeiro operacional, contabilidade, rotina e logística.'],
          ['Elizângela + Carol', 'Equipe de Atendimento. Responsáveis pelo atendimento no WhatsApp, triagem e condução do paciente até a consulta.'],
        ],
      },
    ],
    tags: ['Elizângela', 'Carol', 'Nathan', 'Mastrangeli', 'Gerência', 'equipe'],
    related: ['b2.governanca.acordo', 'b8.gestao.modelo', 'b8.matriz'],
    parent: 'b0',
  },
];
