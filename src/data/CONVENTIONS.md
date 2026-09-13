# Convenções da camada de dados

Fonte: `/home/claude/vr_paged.txt` (texto integral do PDF, com marcadores `=== PÁGINA N ===`).
Tipos: `src/data/types.ts`. Exemplos completos: `src/data/blocks/b0.ts` e `src/data/blocks/b1.ts`.

## Regras de fidelidade
- O PDF é a source of truth. NÃO altere o conteúdo. Preserve nomenclatura, raciocínio, nuances, ressalvas, incertezas.
- Não transforme hipótese em fato. Não invente números. Não "melhore" afirmações clínicas.
- TODO o conteúdo substantivo do bloco precisa estar em algum nó (`content`). Nada é descartado por não caber.
- Frases em destaque do documento (linhas soltas em caixa alta ou frases-tese) viram `{kind:'big'}` ou `{kind:'callout'}`.
- Sequências com "↓" viram `{kind:'flow', steps:[...]}`. Marcadores "●" viram `ul`. "A ● ● B" (justaposição) vira `flow` ou texto "A + B" conforme o sentido.
- Tabelas do PDF viram `{kind:'table'}`.
- Claims a validar (ex.: "95%"), hipóteses comerciais, pontos pendentes: `status` correspondente e `callout` com tone `claim` / `hypothesis` / `pending`.
- Citações/frases de paciente entre aspas curvas viram `{kind:'quote'}` ou permanecem dentro de `p` com aspas.

## Estrutura
- Cada arquivo `src/data/blocks/bN.ts` exporta `export const bN: VRNode[]`.
- O primeiro nó é o raiz do bloco: `id: 'bN'`, `type: 'module'`, `kicker: 'Bloco N'`, com `summary` de 1–2 frases e `content` contendo o cabeçalho do bloco (Macroárea, Função/Objetivo/Tese, Status quando houver) em `kv`.
- Cada seção numerada ou titulada do bloco vira um nó `section`/`concept`/`step`/`stage`/etc com `parent` e `order`.
- Subseções relevantes viram nós filhos (parent = nó da seção). Prefira nós de tamanho médio (3 a 12 blocos de conteúdo) a nós gigantes.
- `summary`: 1–2 frases fiéis. `title`: título do documento em Title case (não caixa alta), sem numeração.
- `kicker`: rótulo curto ("Etapa 3", "Nível 2", "Perfil A", "Quadrante 2", "Princípio"...).
- `pages`: página ou intervalo real (use os marcadores do arquivo).
- `tags`: termos buscáveis (nomes próprios, números, jargões: "SpineMED", "Carol", "ortopedista", "95%", "LTV", "follow-up"...).
- `related`: ids de outros nós, inclusive de outros blocos, seguindo o mapa de ids abaixo. Use somente ids do mapa (os ids obrigatórios) para blocos que você não está escrevendo.
- `owner`: só quando o documento nomeia responsável.
- ids em kebab-case, sem acento, prefixados pelo bloco: `b4.momento3`, `b4.momento3.janela1`.

## Mapa de ids obrigatórios por bloco
(Os nós abaixo PRECISAM existir com exatamente esses ids, porque as visualizações os referenciam. Você pode e deve criar nós adicionais.)

b2 (pages 6–19): b2, b2.stakeholders, b2.stakeholders.perfil-a, b2.stakeholders.perfil-b, b2.stakeholders.perfil-c, b2.stakeholders.perfil-d, b2.stakeholders.etapa1 … b2.stakeholders.etapa6, b2.stakeholders.resultado, b2.treinamento, b2.treinamento.conceito, b2.treinamento.principio, b2.treinamento.mudanca-modelo, b2.treinamento.regra, b2.treinamento.assertividade, b2.treinamento.filosofia, b2.governanca, b2.governanca.responsavel, b2.governanca.mandato, b2.governanca.horario, b2.governanca.nao-bloqueio, b2.governanca.impedimento, b2.governanca.acordo, b2.treinamento.ciclo1, b2.treinamento.modulo1 … b2.treinamento.modulo8, b2.treinamento.metricas, b2.mapa, b2.principio-trimestre

b3 (pages 20–26): b3, b3.chegada, b3.precisa, b3.tratar-causa, b3.causa-x-sintoma, b3.processo, b3.transformacao, b3.adesao, b3.papel, b3.principio, b3.aplicacao, b3.painel

b4 (pages 27–45): b4, b4.visao, b4.nivel1, b4.momento1, b4.momento1.marketing, b4.momento2, b4.perfil-economico, b4.nivel2, b4.momento3, b4.janela1, b4.gatekeeper, b4.stakeholder01, b4.momento4, b4.efeito-psicologico, b4.recorrencia, b4.janela2, b4.nivel3, b4.estado-funcional, b4.estado-psicologico, b4.medos-cirurgia, b4.golden-moment, b4.porque-vr, b4.posicionamento, b4.spinemed, b4.governanca-claim, b4.preco, b4.timeline, b4.implicacao-marketing, b4.arquitetura-conteudo, b4.descoberta, b4.painel, b4.insight

b5 (pages 46–61): b5, b5.visao, b5.causa, b5.alteracao, b5.fisiologia, b5.sintomas, b5.exemplo, b5.principio, b5.estrategico, b5.spinemed-cadeia, b5.perfil-spinemed, b5.grupo-a, b5.grupo-b, b5.grupo-c, b5.grupo-c.protese, b5.grupo-c.instabilidade, b5.grupo-c.mielopatia, b5.nuance, b5.marketing, b5.landing, b5.criterio, b5.dados-historicos, b5.claim95, b5.conexao-educacao, b5.diagrama, b5.painel, b5.conexoes, b5.insight

b6 (pages 62–80): b6, b6.premissa, b6.valores, b6.perfil-a, b6.perfil-a.obs, b6.perfil-b, b6.perfil-c, b6.comparacao, b6.ponto, b6.oportunidade, b6.ltv-atual-potencial, b6.pos-motor, b6.problema, b6.principio, b6.retencao-clinica, b6.retencao-cirurgico, b6.efeito-psicologico, b6.nao-considera, b6.medir, b6.ltv-real, b6.conexao-stakeholders, b6.conexao-marketing, b6.conexao-esteira, b6.painel, b6.conexoes, b6.insight

b7 (pages 81–105): b7, b7.tese, b7.trilhos, b7.equacao, b7.arquitetura, b7.nivel0, b7.nivel1, b7.nivel1.consulta, b7.nivel1.transformacao, b7.nivel1.outras, b7.nivel1.objetivos, b7.nivel2, b7.nivel2.funcoes, b7.nivel2.experiencia, b7.nivel2.prova, b7.nivel3, b7.nivel3.produto, b7.nivel3.ticket, b7.nivel3.componentes, b7.nivel3.problema, b7.nivel3.transformacao, b7.nivel3.historia-natural, b7.nivel3.valor-economico, b7.nao-pode, b7.esteira-visual, b7.psicologia, b7.desperdicio, b7.pos-ponte, b7.segmentacao, b7.produto-premium, b7.camadas-futuras, b7.matriz, b7.metricas, b7.regra-ouro, b7.painel, b7.conexoes, b7.principio

b8 (pages 106–138): b8, b8.visao, b8.principio, b8.equacao, b8.marketing, b8.marketing.lead-qualificado, b8.marketing.lead-quente, b8.marketing.lead-frio, b8.marketing.video, b8.marketing.reel-bom, b8.marketing.landing, b8.marketing.inteligencia, b8.comercial, b8.comercial.funcao, b8.comercial.modelo, b8.comercial.principio, b8.comercial.prioritaria, b8.comercial.reatividade, b8.comercial.estrutura, b8.operacao, b8.operacao.elementos, b8.operacao.alimenta, b8.pos, b8.pos.vazamento, b8.pos.efeito, b8.pos.esteira, b8.stakeholders, b8.cultura, b8.cultura.identidade, b8.cultura.funcao, b8.cultura.endomarketing, b8.cultura.dia-do-bolo, b8.cultura.porque, b8.cultura.futuro, b8.gestao, b8.gestao.governanca, b8.gestao.modelo, b8.gestao.regra, b8.gestao.barreira, b8.custo-oportunidade, b8.marketing-insuficiente, b8.fluxo, b8.onde-entra, b8.matriz, b8.ordem, b8.potencial, b8.principio-estrategico, b8.painel, b8.insight

b9 (pages 139–161): b9, b9.eixo-a, b9.vr-a, b9.eixo-b, b9.captura-vs-faturamento, b9.hoje, b9.problema-nao-entrega, b9.consequencia, b9.porque-medicina, b9.sinais, b9.cam, b9.cam.arquetipo, b9.cam.capacidades, b9.tese, b9.lastro, b9.quadrante, b9.quadrante.q1, b9.quadrante.q2, b9.quadrante.q3, b9.quadrante.q4, b9.objetivo, b9.percepcao, b9.gap, b9.flywheel, b9.reinvestimento, b9.paradoxo, b9.limitador, b9.representacao, b9.painel, b9.insight

Ids de b0 e b1 já existentes: b0, b0.claim.95, b0.pessoas, b1, b1.reels, b1.landing, b1.whatsapp, b1.conversao, b1.principio-comercial, b1.consulta, b1.pendente.criterios, b1.painel.

## Verificação
Ao terminar, rode `npx tsc --noEmit -p tsconfig.app.json` na raiz do projeto e corrija erros de tipo do seu arquivo.
