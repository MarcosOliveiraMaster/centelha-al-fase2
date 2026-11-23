import React, { useState, useEffect, useMemo, useContext, createContext, useRef } from "react";

const STORE_KEY = "centelha-al-fase2-v2";
function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveStore(s) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch (e) {
  }
}
const brl = (n) => (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const BRT = (iso, end) => /* @__PURE__ */ new Date(iso + (end ? "T23:59:59-03:00" : "T00:00:00-03:00"));
const fmt = (iso) => {
  const [y, m, d] = iso.split("-");
  return d + "/" + m + "/" + y;
};
const DEADLINE = (/* @__PURE__ */ new Date("2026-12-04T18:00:00-03:00")).getTime();
function useNow() {
  const [n, setN] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setN(Date.now()), 6e4);
    return () => clearInterval(t);
  }, []);
  return n;
}
const ELEG = [
  ["e1", "O resultado final da Fase 1 (12/11/2026) traz a sua ideia classificada e voc\xEA abre a nota e o parecer no Sistema Centelha.", "12.1.2, 13.1"],
  ["e2", "Coordenador com 18 anos completos, residente em Alagoas, com comprovante de resid\xEAncia atualizado, e adimplente com FAPEAL, SECTI-AL e SEBRAE-AL.", "3.1.1 a-f"],
  ["e3", "Coordenador nunca foi s\xF3cio de empresa contratada na 1\xAA ou 2\xAA edi\xE7\xE3o do Centelha, nem em qualquer edi\xE7\xE3o do Tecnova.", "3.1.1 g"],
  ["e4", "Coordenador n\xE3o \xE9 s\xF3cio de outra empresa com atividade afim \xE0 ideia. Se for, isso precisa ser resolvido antes, porque exige declara\xE7\xE3o assinada e pode barrar a proposta.", "3.1.1 h"],
  ["e5", "Coordenador tem pelo menos 20 horas semanais para o projeto e domina ao menos uma compet\xEAncia essencial: t\xE9cnica, de gest\xE3o ou de mercado.", "3.1.1 i-j"],
  ["e6", "Empresa, se j\xE1 existir: sediada em Alagoas, ME ou EPP (MEI e EI n\xE3o valem), faturamento at\xE9 R$ 4,8 milh\xF5es e constitu\xEDda depois de 28/05/2025. Se a proposta for por uma empresa que j\xE1 existe, confira a data de abertura no cart\xE3o CNPJ. Se a empresa n\xE3o atende ou n\xE3o existe, siga como pessoa f\xEDsica e abra a empresa ap\xF3s a aprova\xE7\xE3o (at\xE9 26/03/2027). O Inova Simples \xE9 aceito, com o certificado CINOVA.", "3.1.2, 4.8"],
  ["e7", "Equipe com no m\xE1ximo 5 pessoas (incluindo voc\xEA), todas cadastradas no Sistema Centelha e nenhuma em outro projeto da Fase 2.", "3.3, 3.4"],
  ["e8", "Ningu\xE9m da equipe tem v\xEDnculo profissional ou parentesco at\xE9 3\xBA grau com MCTI, Finep, CNPq, Funda\xE7\xE3o CERTI, FAPEAL, SECTI-AL ou SEBRAE-AL.", "3.6"],
  ["e9", "Se algu\xE9m da equipe for servidor p\xFAblico: regimento interno da institui\xE7\xE3o verificado e carta de anu\xEAncia providenciada.", "3.1.1.1"]
];
const RISCOS = [
  ["Pedir mais de R$ 80.000 de subven\xE7\xE3o elimina a proposta.", "5.4"],
  ["Nota menor que 2 em Consist\xEAncia da Proposta (modelo de neg\xF3cio, cronograma e or\xE7amento) elimina, mesmo com nota alta no resto.", "10.2 c"],
  ["Rascunho n\xE3o conta. S\xF3 vale proposta enviada pelo Sistema Centelha at\xE9 18h de 04/12/2026, por nenhum outro meio.", "4.5, 4.6"],
  ["Pessoa em dois projetos na Fase 2: todas as propostas dela s\xE3o desclassificadas. D\xE1 para retirar a pessoa da equipe at\xE9 o fim do prazo.", "3.3, 3.3.1"],
  ["Campos obrigat\xF3rios incompletos, anexos incorretos ou ileg\xEDveis.", "9.3 d"],
  ["Conte\xFAdo similar a outra proposta, ou equipes executoras similares em propostas diferentes.", "9.3 a-b"],
  ["Trocar o coordenador durante a sele\xE7\xE3o desclassifica. O nome do projeto da Fase 1 tamb\xE9m n\xE3o pode mudar.", "3.2, 4.2.1.1"],
  ["Na Fase 2 o v\xEDdeo pitch de at\xE9 3 minutos \xE9 obrigat\xF3rio.", "4.2.2 l"]
];
const FACTS = [
  ["Prazo de envio", "04/12/2026, 18h", "Hor\xE1rio de Bras\xEDlia, pelo Sistema Centelha"],
  ["Subven\xE7\xE3o", "at\xE9 R$ 80.000", "Em at\xE9 2 parcelas, n\xE3o reembols\xE1vel"],
  ["Bolsas CNPq", "at\xE9 R$ 50.000", "Por projeto, modalidades DTI, EV e SET"],
  ["Contrapartida", "m\xEDn. 5%", "Da subven\xE7\xE3o contratada, em dinheiro"],
  ["Execu\xE7\xE3o", "12 meses", "Contados da assinatura do Termo de Outorga"],
  ["Nota final", "(F1 + F2) / 2", "At\xE9 47 projetos aprovados"]
];
const PLANO = [
  { id: "p1", titulo: "Destravar", faixa: "17/11 a 19/11", start: "2026-11-17", end: "2026-11-19", tasks: [
    ["p1a", "Abrir o formul\xE1rio da Fase 2 no Sistema Centelha e copiar todos os campos, limites de caracteres e anexos para o documento mestre.", "4.3, 4.5"],
    ["p1b", "Ler a nota e o parecer da Fase 1 e listar cada ponto fraco apontado. Cada um vira uma resposta na Fase 2.", "12.1.2, 13.1"],
    ["p1c", "Fechar a elegibilidade com a lista da aba Início.", "3.1"],
    ["p1d", "Fechar a equipe, cadastrar cada pessoa no Sistema e confirmar que ningu\xE9m est\xE1 em outro projeto.", "3.3, 3.4"],
    ["p1e", "Decidir o valor de subven\xE7\xE3o a pedir (at\xE9 R$ 80.000) e se haver\xE1 bolsa CNPq.", "5.2, 6"]
  ] },
  { id: "p2", titulo: "Levantar dados", faixa: "20/11 a 24/11", nota: "20/11 \xE9 feriado nacional (Consci\xEAncia Negra).", start: "2026-11-20", end: "2026-11-24", tasks: [
    ["p2a", "Reunir as evid\xEAncias do est\xE1gio atual: prot\xF3tipo, testes, entrevistas, pilotos, cartas de inten\xE7\xE3o, receita.", "4.2.2 b"],
    ["p2b", "Levantar mercado com fontes e ano: segmento, TAM, SAM, SOM, concorrentes, pre\xE7os.", "4.2.2 d"],
    ["p2c", "Pedir cota\xE7\xF5es e propostas para cada item do or\xE7amento, com valor e data.", "4.2.2 h"],
    ["p2d", "Definir o que existir\xE1 ao fim dos 12 meses e quais marcos provam isso.", "4.2.2 c"],
    ["p2e", "Colher curr\xEDculo, fun\xE7\xE3o e carga hor\xE1ria de cada membro da equipe.", "3.1.3 c"]
  ] },
  { id: "p3", titulo: "Redigir", faixa: "25/11 a 29/11", nota: "Mande d\xFAvidas \xE0 FAPEAL at\xE9 26/11. A resposta leva at\xE9 72 horas \xFAteis.", start: "2026-11-25", end: "2026-11-29", tasks: [
    ["p3a", "Escrever primeiro cronograma e or\xE7amento. Juntos pesam cerca de 27% da nota da Fase 2.", "10.2"],
    ["p3b", "Escrever solu\xE7\xE3o, est\xE1gio atual e pretendido, mercado, modelo de neg\xF3cio e impacto.", "4.2.2 a-e"],
    ["p3c", "Escrever gest\xE3o, equipe, dom\xEDnio da tecnologia e parcerias.", "4.2.2 f, i, j"],
    ["p3d", "Enviar as d\xFAvidas pendentes para centelha.alagoas@gmail.com ou pelo helpdesk.", "4.9"],
    ["p3e", "Colher a assinatura das declara\xE7\xF5es individuais de todos os membros.", "3.3.2, 3.4"]
  ] },
  { id: "p4", titulo: "V\xEDdeo e revis\xE3o", faixa: "30/11 a 02/12", start: "2026-11-30", end: "2026-12-02", tasks: [
    ["p4a", "Roteirizar, gravar e publicar o v\xEDdeo de at\xE9 3 minutos como N\xE3o Listado ou P\xFAblico no YouTube, ou compartilhado no Vimeo.", "4.2.2 l"],
    ["p4b", "Abrir o link do v\xEDdeo em janela an\xF4nima para confirmar que qualquer pessoa assiste.", "4.2.2 l"],
    ["p4c", "Pedir a algu\xE9m que n\xE3o escreveu a proposta para avali\xE1-la com a tabela de pesos da aba Informa\xE7\xF5es.", "10.2"],
    ["p4d", "Escrever o resumo public\xE1vel por \xFAltimo, sem segredos industriais nem dados sens\xEDveis.", "4.2.2 k"],
    ["p4e", "Congelar os textos no fim do dia 02/12.", ""]
  ] },
  { id: "p5", titulo: "Enviar", faixa: "03/12 e 04/12", nota: "A FAPEAL n\xE3o responde por congestionamento do sistema. Envie no dia 03.", start: "2026-12-03", end: "2026-12-04", tasks: [
    ["p5a", "Preencher o sistema com o texto congelado, anexar o PDF opcional e clicar em enviar. Salvar rascunho n\xE3o basta.", "4.5.4"],
    ["p5b", "Confirmar o e-mail autom\xE1tico de recebimento e guardar print e PDF da vers\xE3o enviada.", "4.5.1"],
    ["p5c", "\xDAltimo dia para qualquer edi\xE7\xE3o: 04/12 at\xE9 18h. Vale sempre a \xFAltima vers\xE3o salva.", "4.5.3, 4.6"]
  ] }
];
const DOCS_A = [
  ["da1", "Formul\xE1rio da Fase 2 completo no Sistema Centelha (campos a a k)", "Todos os campos obrigat\xF3rios preenchidos. Incompleto desclassifica.", "4.2.2, 9.3 d"],
  ["da2", "V\xEDdeo pitch de at\xE9 3 minutos (obrigat\xF3rio)", "Link do YouTube N\xE3o Listado ou P\xFAblico, ou do Vimeo compartilhado.", "4.2.2 l"],
  ["da3", "PDF de apoio \xE0 apresenta\xE7\xE3o (opcional)", "S\xF3 entra se acrescentar algo que o formul\xE1rio n\xE3o comporta.", "4.2.2 m"],
  ["da4", "Cadastro de cada membro da equipe no Sistema Centelha", "Quem n\xE3o estiver cadastrado n\xE3o \xE9 considerado na avalia\xE7\xE3o.", "3.1.3 e, 3.4"],
  ["da5", "Declara\xE7\xE3o de participa\xE7\xE3o individual assinada, de cada membro", "O edital menciona esta declara\xE7\xE3o na Fase 2 e tamb\xE9m ap\xF3s a aprova\xE7\xE3o. Veja no formul\xE1rio se h\xE1 campo de envio. Na d\xFAvida, colha j\xE1.", "3.3.2, 3.4"],
  ["da6", "Declara\xE7\xE3o individual de 20 horas semanais de dedica\xE7\xE3o", "Exigida do proponente. Prepare agora, mesmo que s\xF3 seja enviada na contrata\xE7\xE3o.", "3.1.1 j, 14.1 o"]
];
const DOCS_B = [
  ["db_a", "a", "CNPJ com porte (ME ou EPP), nome e endere\xE7o atualizado", "Cart\xE3o CNPJ, Receita Federal", "14.1-a_CNPJ.pdf"],
  ["db_b", "b", "Contrato Social registrado e atualiza\xE7\xF5es, ou certificado CINOVA (Inova Simples)", "JUCEAL, RCPJ ou portal Inova Simples", "14.1-b_Contrato-Social.pdf"],
  ["db_c", "c", "Certid\xE3o Conjunta Negativa de Tributos Federais e D\xEDvida Ativa da Uni\xE3o", "Receita Federal e PGFN", "14.1-c_CND-Federal.pdf"],
  ["db_d", "d", "Certid\xE3o Negativa da Fazenda Estadual", "SEFAZ-AL", "14.1-d_CND-Estadual.pdf"],
  ["db_e", "e", "Certid\xE3o Negativa da Fazenda Municipal", "Prefeitura do munic\xEDpio sede", "14.1-e_CND-Municipal.pdf"],
  ["db_f", "f", "Certid\xE3o Negativa de D\xE9bitos Trabalhistas", "Tribunal Superior do Trabalho", "14.1-f_CNDT.pdf"],
  ["db_g", "g", "Certificado de Regularidade do FGTS", "Caixa Econ\xF4mica Federal", "14.1-g_CRF-FGTS.pdf"],
  ["db_h", "h", "CPF e RG do respons\xE1vel da empresa ou proponente", "Documentos pessoais", "14.1-h_CPF-RG.pdf"],
  ["db_i", "i", "Comprovante de resid\xEAncia do respons\xE1vel", "Conta recente em nome do respons\xE1vel", "14.1-i_Residencia.pdf"],
  ["db_j", "j", "Conta corrente exclusiva do projeto no Banco do Brasil: declara\xE7\xE3o ou extrato com nome personalizado, nome e CNPJ da empresa, n\xFAmero da conta e ag\xEAncia", "Banco do Brasil", "14.1-j_Conta-BB.pdf"],
  ["db_k", "k", "Declara\xE7\xE3o do respons\xE1vel legal de que a empresa n\xE3o tem s\xF3cios em outra empresa de atividade afim ao projeto", "Modelo a redigir, assinatura do respons\xE1vel legal", "14.1-k_Decl-Socios.pdf"],
  ["db_l", "l", "Declara\xE7\xE3o do coordenador e de cada integrante: sem v\xEDnculo ou parentesco at\xE9 3\xBA grau com as institui\xE7\xF5es do programa, sem projeto aprovado em outro estado, compromisso com as atividades do Centelha", "Uma declara\xE7\xE3o por pessoa", "14.1-l_Decl-Equipe.pdf"],
  ["db_m", "m", "Carta de anu\xEAncia de todos os integrantes da equipe executora", "Uma carta por pessoa", "14.1-m_Anuencia-Equipe.pdf"],
  ["db_n", "n", "Carta de anu\xEAncia da institui\xE7\xE3o de v\xEDnculo, somente se houver servidor p\xFAblico na equipe", "Institui\xE7\xE3o do servidor", "14.1-n_Anuencia-Servidor.pdf"],
  ["db_o", "o", "Declara\xE7\xE3o individual de 20 horas semanais de dedica\xE7\xE3o", "Assinada por quem se compromete", "14.1-o_Decl-20h.pdf"]
];
const CRONO = [
  ["2026-05-28", "2026-05-28", "28/05/2026", "Lan\xE7amento da chamada p\xFAblica", ""],
  ["2026-05-28", "2026-08-17", "28/05 a 17/08/2026", "Fase 1: submiss\xE3o das ideias inovadoras", ""],
  ["2026-08-18", "2026-09-17", "18/08 a 17/09/2026", "Fase 1: avalia\xE7\xE3o e sele\xE7\xE3o", ""],
  ["2026-09-29", "2026-09-29", "29/09/2026", "Fase 1: resultado preliminar", ""],
  ["2026-09-30", "2026-10-09", "30/09 a 09/10/2026", "Fase 1: recursos administrativos", ""],
  ["2026-11-12", "2026-11-12", "12/11/2026", "Fase 1: resultado final das ideias selecionadas", ""],
  ["2026-11-13", "2026-12-04", "13/11 a 04/12/2026", "Fase 2: submiss\xE3o dos Projetos de Fomento", "At\xE9 18h de 04/12 pelo Sistema Centelha. \xC9 o prazo que importa agora."],
  ["2026-12-10", "2027-01-20", "10/12/2026 a 20/01/2027", "Fase 2: avalia\xE7\xE3o e sele\xE7\xE3o", "Dois avaliadores. Um terceiro arbitra s\xF3 se uma nota classifica e a outra desclassifica e a diferen\xE7a entre elas \xE9 de 20% ou mais. A nota do \xE1rbitro substitui as anteriores."],
  ["2027-01-29", "2027-01-29", "29/01/2027", "Fase 2: resultado preliminar", "Nota e parecer ficam dispon\xEDveis no sistema."],
  ["2027-01-30", "2027-02-08", "30/01 a 08/02/2027", "Fase 2: recursos administrativos", "Um \xFAnico recurso por fase, pelo helpdesk, no modelo da plataforma, com assinatura digital gov.br. N\xE3o aceita documentos novos."],
  ["2027-02-26", "2027-02-26", "26/02/2027", "Resultado final da Fase 2 e publica\xE7\xE3o no Di\xE1rio Oficial", ""],
  ["2027-02-27", "2027-03-26", "at\xE9 26/03/2027", "Constituir a empresa (se necess\xE1rio) e enviar a documenta\xE7\xE3o do item 14.1", "Um \xFAnico e-mail com os PDFs separados. Atraso faz perder a vaga para um suplente."],
  ["2027-03-27", "2027-05-26", "at\xE9 26/05/2027", "Contrata\xE7\xE3o dos projetos de fomento", "Plano de trabalho f\xEDsico e financeiro aprovado pela FAPEAL e documenta\xE7\xE3o completa."],
  ["2027-05-27", "2027-06-26", "at\xE9 26/06/2027", "Chamada de suplentes", "Suplentes: 30 dias para a documenta\xE7\xE3o e 60 dias para contratar."],
  ["2027-06-27", "2028-12-31", "12 meses ap\xF3s a contrata\xE7\xE3o", "Execu\xE7\xE3o dos projetos", "Presta\xE7\xE3o de contas final em at\xE9 60 dias corridos do fim da vig\xEAncia do Termo."]
];
const DEPOIS = [
  "Termo de Outorga assinado e extrato publicado, contrapartida depositada em conta exclusiva e extrato enviado \xE0 FAPEAL. S\xF3 ent\xE3o sai a 1\xAA parcela. (15.1)",
  "Despesas s\xF3 valem depois do Termo e do recebimento da subven\xE7\xE3o. Nada anterior \xE9 reembolsado, nem custos de abrir a empresa. (7.3)",
  "2\xAA parcela: pelo menos 80% da 1\xAA usada, presta\xE7\xE3o de contas parcial aprovada e 2\xAA contrapartida depositada. (15.3)",
  "Mudan\xE7a de rubrica, de plano de trabalho ou prorroga\xE7\xE3o s\xF3 com autoriza\xE7\xE3o expressa da FAPEAL. (16.2)",
  "Participar das capacita\xE7\xF5es, visitas t\xE9cnicas e pesquisas de monitoramento por at\xE9 5 anos ap\xF3s o programa. (3.9, 16.6)",
  "Descumprimento obriga a devolver os recursos corrigidos em 30 dias. (17.4)"
];
const PESOS = [
  ["Or\xE7amento", "O", 13.3, true],
  ["Cronograma f\xEDsico", "CF", 13.3, true],
  ["Potencial de desenvolvimento tecnol\xF3gico", "PDT", 11.1, false],
  ["Fornecimento de valor para o mercado", "FV", 8.3, false],
  ["Potencial de escala", "PE", 8.3, false],
  ["Potencial de impacto socioambiental positivo", "PI", 8.3, false],
  ["Externalidades socioambientais", "EX", 8.3, false],
  ["Dom\xEDnio tecnol\xF3gico", "DT", 8.3, false],
  ["Capacidade de execu\xE7\xE3o", "CE", 8.3, false],
  ["Modelo de neg\xF3cio", "MN", 6.7, false],
  ["Evid\xEAncias do est\xE1gio de desenvolvimento", "EED", 5.6, false]
];
const INFO = [
  {
    k: "a",
    t: "Descri\xE7\xE3o detalhada da solu\xE7\xE3o",
    crit: "PDT (11,1%)",
    ref: "4.2.2 a",
    pede: "Caracter\xEDsticas inovadoras, funcionalidades, diferenciais e benef\xEDcios gerados.",
    levantar: ["Lista de funcionalidades com prioridade: essencial, importante, futura", "Para cada uma, o problema que resolve e quem sente essa dor", "Diferencial concreto frente a 3 a 5 alternativas que o cliente usa hoje", "Benef\xEDcio que se pode medir: tempo, custo, receita ou acesso", "O que \xE9 novidade ou aperfei\xE7oamento, no conceito de inova\xE7\xE3o da Lei 13.243/2016"],
    organizar: "Uma tabela: funcionalidade, problema, diferencial, benef\xEDcio, est\xE1gio atual. Ela alimenta tamb\xE9m os campos b, c e g."
  },
  {
    k: "b",
    t: "Est\xE1gio atual e evid\xEAncias",
    crit: "EED (5,6%)",
    ref: "4.2.2 b",
    pede: "Em que ponto a solu\xE7\xE3o est\xE1 hoje e as evid\xEAncias disso.",
    levantar: ["Prot\xF3tipo ou MVP: prints, v\xEDdeo curto, link ou reposit\xF3rio", "Valida\xE7\xE3o com clientes: quantas entrevistas, quando, o que aprenderam", "Pilotos, testes e m\xE9tricas de uso", "Cartas de inten\xE7\xE3o ou pr\xE9-vendas, com nome, data e assinatura", "Receita ou contratos j\xE1 fechados, se houver"],
    organizar: "Pasta de evid\xEAncias numeradas (E01, E02...) e uma tabela: afirma\xE7\xE3o do texto, evid\xEAncia que a prova, data. Toda frase de est\xE1gio atual aponta para uma evid\xEAncia."
  },
  {
    k: "c",
    t: "Est\xE1gio pretendido e estrat\xE9gia de desenvolvimento",
    crit: "PDT (11,1%)",
    ref: "4.2.2 c",
    pede: "Onde a solu\xE7\xE3o estar\xE1 ao fim do projeto e como chegar l\xE1.",
    levantar: ["Entrega final dos 12 meses: MVP, vers\xE3o comercial, primeiros clientes pagantes", "Roadmap t\xE9cnico por trimestre", "Riscos tecnol\xF3gicos e como cada um ser\xE1 reduzido", "Indicadores de sucesso com meta num\xE9rica"],
    organizar: "Roadmap em 4 trimestres, cada marco com um entreg\xE1vel verific\xE1vel. Os marcos viram as atividades do cronograma (campo g)."
  },
  {
    k: "d",
    t: "Mercado, clientes, modelo de neg\xF3cio e monetiza\xE7\xE3o",
    crit: "FV + PE (16,7%) e MN (6,7%)",
    ref: "4.2.2 d",
    pede: "Mercado, segmento de clientes, modelo de neg\xF3cio e estrat\xE9gia de monetiza\xE7\xE3o.",
    levantar: ["Perfil do cliente ideal e tamanho do segmento: TAM, SAM, SOM, com fonte e ano", "Concorrentes diretos e indiretos, com pre\xE7o e diferen\xE7a", "Pre\xE7o, formas de cobran\xE7a, custo de aquisi\xE7\xE3o, margem", "Canais de venda e primeiros clientes identificados", "Proje\xE7\xE3o de receita para 12 a 36 meses e premissas", "Caminho de escala: outras cidades, estados ou segmentos"],
    organizar: "Planilha com abas Mercado, Concorrentes, Pre\xE7o e Proje\xE7\xE3o. Toda premissa fica numa c\xE9lula com fonte, para o texto citar o n\xFAmero e a fonte."
  },
  {
    k: "e",
    t: "Impacto socioambiental positivo e negativo",
    crit: "PI + EX (16,7%)",
    ref: "4.2.2 e",
    pede: "Contexto de impacto positivo e negativo gerado pela solu\xE7\xE3o e pela opera\xE7\xE3o do neg\xF3cio.",
    levantar: ["ODS relacionados e um indicador para cada um", "Quem se beneficia e quantas pessoas, com estimativa", "Efeitos negativos poss\xEDveis: uso de dados pessoais (LGPD), exclus\xE3o digital, energia, res\xEDduos, concentra\xE7\xE3o de renda", "Medida de mitiga\xE7\xE3o para cada efeito negativo"],
    organizar: "Duas colunas lado a lado, positivo e negativo, cada linha com indicador e mitiga\xE7\xE3o. O edital avalia os dois separadamente (PI e EX), ent\xE3o responda os dois."
  },
  {
    k: "f",
    t: "Gest\xE3o e maturidade do neg\xF3cio",
    crit: "Sem peso pr\xF3prio. Apoia MN e CE",
    ref: "4.2.2 f",
    pede: "Aspectos de gest\xE3o e grau de maturidade atual e pretendido.",
    levantar: ["Como a empresa decide, acompanha metas e controla finan\xE7as hoje", "Ferramentas, rotinas e respons\xE1veis", "N\xEDvel de maturidade atual e o pretendido ao fim do projeto"],
    organizar: "Uma p\xE1gina com pap\xE9is, rotinas e indicadores acompanhados, mais uma frase sobre o antes e o depois."
  },
  {
    k: "g",
    t: "Cronograma f\xEDsico",
    crit: "CF (13,3%)",
    ref: "4.2.2 g",
    pede: "Cronograma detalhado do desenvolvimento da solu\xE7\xE3o e do neg\xF3cio.",
    levantar: ["Atividades dos 12 meses, contados da assinatura do Termo e n\xE3o da submiss\xE3o", "Para cada uma: in\xEDcio, fim, respons\xE1vel, entreg\xE1vel", "Depend\xEAncias entre atividades", "Rubrica do or\xE7amento que financia cada atividade"],
    organizar: "Planilha de Gantt em meses M1 a M12, com a coluna de rubrica preenchida. \xC9 a base do or\xE7amento: nenhuma despesa sem atividade."
  },
  {
    k: "h",
    t: "Or\xE7amento e sustentabilidade financeira",
    crit: "O (13,3%)",
    ref: "4.2.2 h",
    pede: "Plano de aplica\xE7\xE3o dos recursos de subven\xE7\xE3o e planejamento de sustentabilidade financeira.",
    levantar: ["Cota\xE7\xF5es com valor, data e fornecedor para cada item", "Rubrica de cada gasto (7.1 a-h) e checagem contra a lista de itens n\xE3o financi\xE1veis", "Quanto vir\xE1 de subven\xE7\xE3o e quanto de contrapartida", "Como o neg\xF3cio se sustenta depois que a subven\xE7\xE3o acabar"],
    organizar: "Use a aba Or\xE7amento desta p\xE1gina. Cada linha com rubrica, atividade que a justifica e cota\xE7\xE3o arquivada."
  },
  {
    k: "i",
    t: "Equipe executora",
    crit: "DT + CE (16,7%)",
    ref: "4.2.2 i, 3.1.3",
    pede: "Dados e informa\xE7\xF5es sobre a equipe de execu\xE7\xE3o.",
    levantar: ["At\xE9 5 pessoas, incluindo o coordenador", "Para cada uma: fun\xE7\xE3o efetiva, horas por semana, experi\xEAncia que prova a capacidade", "Curr\xEDculo Lattes ou LinkedIn atualizado", "Cadastro no Sistema Centelha e declara\xE7\xE3o assinada"],
    organizar: "Quadro: pessoa, fun\xE7\xE3o, horas semanais, compet\xEAncia, atividades do cronograma em que atua, status do cadastro e da declara\xE7\xE3o."
  },
  {
    k: "j",
    t: "Dom\xEDnio da tecnologia e parcerias",
    crit: "DT (8,3%)",
    ref: "4.2.2 j",
    pede: "Dom\xEDnio da tecnologia e previs\xE3o de parcerias de desenvolvimento, se houver.",
    levantar: ["O que a equipe j\xE1 domina e o que vai aprender ou contratar", "Propriedade intelectual: o que se pretende proteger e onde registrar", "Parceiros poss\xEDveis, como universidades, institutos e incubadoras, com carta de interesse"],
    organizar: "Tabela: tecnologia, quem domina, n\xEDvel, lacuna, como ser\xE1 coberta. Cartas de parceria na pasta de evid\xEAncias."
  },
  {
    k: "k",
    t: "Resumo public\xE1vel",
    crit: "Sem crit\xE9rio pr\xF3prio",
    ref: "4.2.2 k",
    pede: "Resumo com as principais informa\xE7\xF5es e o objetivo da proposta.",
    levantar: ["Problema, solu\xE7\xE3o, p\xFAblico, resultado esperado e valor solicitado em poucas linhas"],
    organizar: "Escreva por \xFAltimo. O nome diz que pode ser divulgado, ent\xE3o deixe de fora segredos industriais e dados sens\xEDveis."
  },
  {
    k: "l",
    t: "V\xEDdeo pitch, at\xE9 3 minutos (obrigat\xF3rio)",
    crit: "Apresenta toda a proposta",
    ref: "4.2.2 l",
    pede: "Link do YouTube em formato N\xE3o Listado ou P\xFAblico, ou do Vimeo em formato compartilhado.",
    levantar: ["Roteiro com tempos: problema, solu\xE7\xE3o e demonstra\xE7\xE3o, mercado e tra\xE7\xE3o, equipe, uso da verba", "Telas ou prot\xF3tipo para mostrar em vez de descrever", "\xC1udio limpo e v\xEDdeo abrindo em janela an\xF4nima"],
    organizar: "Roteiro na pasta do v\xEDdeo. Divis\xE3o sugerida: problema 30 s, solu\xE7\xE3o e demonstra\xE7\xE3o 60 s, mercado e tra\xE7\xE3o 30 s, equipe 30 s, pedido e uso da verba 30 s."
  }
];
const RUBRICAS = [
  ["a", "Di\xE1rias da equipe (Res. FAPEAL 200/2023)"],
  ["b", "Passagens nacionais da equipe"],
  ["c", "Material de consumo, inclui software"],
  ["d", "Servi\xE7os de terceiros, registro de PI, consultoria, marketing"],
  ["e", "Loca\xE7\xE3o de espa\xE7o ou incubadora (pr\xE9-incuba\xE7\xE3o)"],
  ["f", "Equipamentos e material permanente"],
  ["g", "Pr\xF3-labore de s\xF3cios da equipe"],
  ["h", "Contabilidade"]
];
const NAO_FIN = [
  "Itens que n\xE3o t\xEAm rela\xE7\xE3o com o projeto",
  "Obras e constru\xE7\xE3o civil",
  "Eventos, recep\xE7\xF5es, festividades, refei\xE7\xF5es e coffee break",
  "Apoio administrativo em geral (contabilidade \xE9 exce\xE7\xE3o)",
  "Pagamento a servidor p\xFAblico ou empregado de estatal",
  "Sal\xE1rios, estagi\xE1rios e outras remunera\xE7\xF5es (pr\xF3-labore \xE9 exce\xE7\xE3o)",
  "Multas e encargos sociais (exceto os do pr\xF3-labore)"
];
const EX_BUDGET = [
  { id: 1, rub: "d", desc: "Desenvolvimento de m\xF3dulo por terceiros", sub: 3e4, cp: 0, ex: true },
  { id: 2, rub: "g", desc: "Pr\xF3-labore de s\xF3cios, 12 parcelas iguais", sub: 18e3, cp: 0, ex: true },
  { id: 3, rub: "f", desc: "Notebooks da equipe", sub: 12e3, cp: 0, ex: true },
  { id: 4, rub: "c", desc: "Licen\xE7as de software", sub: 8e3, cp: 0, ex: true },
  { id: 5, rub: "h", desc: "Contabilidade", sub: 4e3, cp: 0, ex: true },
  { id: 6, rub: "d", desc: "An\xFAncios de lan\xE7amento", sub: 0, cp: 4e3, ex: true }
];
const TREE = [
  "Centelha-AL_Fase2/",
  "\u251C\u2500 00_Edital_e_Regras/",
  "\u2502  \u251C\u2500 Edital_06-2026_2a-retificacao.pdf",
  "\u2502  \u2514\u2500 Parecer_Fase1_e_pontos_a_corrigir.md",
  "\u251C\u2500 01_Documento_Mestre/",
  "\u2502  \u2514\u2500 Fase2_textos_a-k_v01.docx        (um arquivo, na ordem do formul\xE1rio)",
  "\u251C\u2500 02_Equipe/",
  "\u2502  \u251C\u2500 Quadro_da_equipe.xlsx",
  "\u2502  \u251C\u2500 Declaracoes_individuais_assinadas/",
  "\u2502  \u2514\u2500 Curriculos/",
  "\u251C\u2500 03_Evidencias_Estagio_Atual/",
  "\u2502  \u251C\u2500 E01_prototipo/",
  "\u2502  \u251C\u2500 E02_validacao_entrevistas/",
  "\u2502  \u251C\u2500 E03_cartas_de_intencao/",
  "\u2502  \u2514\u2500 E04_metricas_e_receita/",
  "\u251C\u2500 04_Mercado_e_Negocio/",
  "\u2502  \u251C\u2500 TAM-SAM-SOM_com_fontes.xlsx",
  "\u2502  \u251C\u2500 Concorrentes.xlsx",
  "\u2502  \u2514\u2500 Preco_e_projecao.xlsx",
  "\u251C\u2500 05_Cronograma_e_Orcamento/",
  "\u2502  \u251C\u2500 Cronograma_M1-M12.xlsx",
  "\u2502  \u251C\u2500 Orcamento_subvencao_contrapartida.xlsx",
  "\u2502  \u2514\u2500 Cotacoes/",
  "\u251C\u2500 06_Impacto_e_Tecnologia/",
  "\u2502  \u251C\u2500 ODS_e_indicadores.md",
  "\u2502  \u251C\u2500 Externalidades_e_mitigacao.md",
  "\u2502  \u2514\u2500 Dominio_tecnologico_PI_parcerias.md",
  "\u251C\u2500 07_Video_Pitch/",
  "\u2502  \u251C\u2500 Roteiro_3min.md",
  "\u2502  \u2514\u2500 link_video.txt",
  "\u251C\u2500 08_Submissao/",
  "\u2502  \u251C\u2500 Versao_enviada_2026-12-0X.pdf",
  "\u2502  \u2514\u2500 Email_de_confirmacao.png",
  "\u2514\u2500 09_Contratacao_Art14/",
  "   \u251C\u2500 14.1-a_CNPJ.pdf",
  "   \u2514\u2500 ... ate 14.1-o_Decl-20h.pdf"
].join("\n");
const PAPEIS = [
  ["Coordenador", "Respons\xE1vel final, fecha as decis\xF5es, envia a proposta e \xE9 o \xFAnico a mexer no sistema."],
  ["Mercado e neg\xF3cio", "Campo d, planilhas de mercado, pre\xE7o e proje\xE7\xE3o."],
  ["T\xE9cnico", "Campos a, b, c, j e as evid\xEAncias de est\xE1gio."],
  ["Or\xE7amento e cronograma", "Campos g e h, cota\xE7\xF5es, rubricas. \xC9 a dupla de maior peso."],
  ["Revisor independente", "Quem n\xE3o escreveu avalia o texto com a tabela de pesos e anota notas de 1 a 5 por crit\xE9rio."],
  ["V\xEDdeo", "Roteiro, grava\xE7\xE3o, publica\xE7\xE3o e teste do link."]
];
const TABS = [
  ["resumo", "In\xEDcio"],
  ["plano", "Plano at\xE9 04/12"],
  ["cronograma", "Datas oficiais"],
  ["documentos", "Documentos"],
  ["anexos", "Anexos e modelos"],
  ["formulario", "Formul\xE1rio"],
  ["informacoes", "Informa\xE7\xF5es"],
  ["orcamento", "Or\xE7amento"],
  ["organizacao", "Organiza\xE7\xE3o"]
];
const MODELO = { da5: 1, da6: 1, db_k: 1, db_l: 1, db_m: 1, db_n: 1, db_o: 1 };
const ALL_IDS = [].concat(
  ELEG.map((x) => x[0]),
  PLANO.reduce((a, b) => a.concat(b.tasks.map((t) => t[0])), []),
  DOCS_A.map((x) => x[0]),
  DOCS_B.map((x) => x[0])
);
const Ctx = createContext(null);
function Tag({ kind }) {
  return /* @__PURE__ */ React.createElement("span", { className: "tag tag-" + kind }, kind === "edital" ? "Edital" : "Sugest\xE3o");
}
function Ref({ children }) {
  return children ? /* @__PURE__ */ React.createElement("span", { className: "ref" }, "item ", children) : null;
}
function Check({ id, children, sub, refs, extra }) {
  const { checks, toggle } = useContext(Ctx);
  const on = !!checks[id];
  return /* @__PURE__ */ React.createElement("label", { className: "check" + (on ? " done" : ""), htmlFor: "c-" + id }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", id: "c-" + id, checked: on, onChange: () => toggle(id) }), /* @__PURE__ */ React.createElement("span", { className: "box", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "check-text" }, children, sub ? /* @__PURE__ */ React.createElement("span", { className: "sub" }, sub) : null, refs ? /* @__PURE__ */ React.createElement(Ref, null, refs) : null, extra || null));
}
function Countdown({ compact }) {
  const now = useNow();
  const diff = DEADLINE - now;
  if (diff <= 0) {
    return compact ? /* @__PURE__ */ React.createElement("div", { className: "count-c crit" }, /* @__PURE__ */ React.createElement("strong", null, "Prazo encerrado")) : /* @__PURE__ */ React.createElement("div", { className: "count crit" }, /* @__PURE__ */ React.createElement("div", { className: "count-n" }, "Encerrado"), /* @__PURE__ */ React.createElement("div", { className: "count-s" }, "O prazo de 04/12/2026, 18h, passou."));
  }
  const d = Math.floor(diff / 864e5);
  const hr = Math.floor(diff % 864e5 / 36e5);
  const tone = d <= 3 ? "crit" : d <= 7 ? "warn" : "ok";
  if (compact) {
    return /* @__PURE__ */ React.createElement("div", { className: "count-c " + tone, role: "status" }, /* @__PURE__ */ React.createElement("strong", null, d, " dias ", hr, " h"), /* @__PURE__ */ React.createElement("span", null, "para o envio, 04/12 \xE0s 18h"));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "count " + tone, role: "status" }, /* @__PURE__ */ React.createElement("div", { className: "count-l" }, "Faltam para o envio"), /* @__PURE__ */ React.createElement("div", { className: "count-n" }, d, /* @__PURE__ */ React.createElement("span", null, " dias"), " ", hr, /* @__PURE__ */ React.createElement("span", null, " h")), /* @__PURE__ */ React.createElement("div", { className: "count-s" }, "Prazo final: 04/12/2026, 18h (Bras\xEDlia)"));
}
function Plano() {
  const now = useNow();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "lede wide" }, "Plano de tr\xE1s para frente a partir de 04/12. Os blocos e as datas internas s\xE3o ", /* @__PURE__ */ React.createElement(Tag, { kind: "sugestao" }), ". As refer\xEAncias entre par\xEAnteses s\xE3o regras do ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" }), "."), /* @__PURE__ */ React.createElement("div", { className: "blocks" }, PLANO.map((b, i) => {
    const st = now > BRT(b.end, true).getTime() ? "past" : now >= BRT(b.start).getTime() ? "now" : "future";
    return /* @__PURE__ */ React.createElement("section", { className: "block " + st, key: b.id }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("span", { className: "block-n" }, i + 1), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, b.titulo), /* @__PURE__ */ React.createElement("div", { className: "block-d" }, b.faixa, st === "now" ? /* @__PURE__ */ React.createElement("span", { className: "pill pill-now" }, "Em curso") : null))), b.nota ? /* @__PURE__ */ React.createElement("p", { className: "note" }, b.nota) : null, /* @__PURE__ */ React.createElement("div", { className: "checks" }, b.tasks.map((t) => /* @__PURE__ */ React.createElement(Check, { key: t[0], id: t[0], refs: t[2] }, t[1]))));
  })));
}
function Cronograma() {
  const now = useNow();
  const firstOpen = CRONO.findIndex((r) => now <= BRT(r[1], true).getTime());
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "lede wide" }, "Cronograma do item 11 da 2\xAA retifica\xE7\xE3o, publicada em 23/10/2026. As datas podem mudar e cabe ao proponente acompanhar as vers\xF5es novas no site do programa (11.2)."), /* @__PURE__ */ React.createElement("ol", { className: "timeline" }, CRONO.map((r, i) => {
    const st = i < firstOpen ? "past" : i === firstOpen ? "now" : "future";
    return /* @__PURE__ */ React.createElement("li", { className: "tl " + st, key: i }, /* @__PURE__ */ React.createElement("div", { className: "tl-when" }, r[2]), /* @__PURE__ */ React.createElement("div", { className: "tl-body" }, /* @__PURE__ */ React.createElement("div", { className: "tl-t" }, r[3], st === "now" ? /* @__PURE__ */ React.createElement("span", { className: "pill pill-now" }, "Agora") : null), r[4] ? /* @__PURE__ */ React.createElement("div", { className: "tl-n" }, r[4]) : null));
  })), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Depois da aprova\xE7\xE3o ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" })), /* @__PURE__ */ React.createElement("ul", { className: "plain" }, DEPOIS.map((x, i) => /* @__PURE__ */ React.createElement("li", { key: i }, x)))));
}
function Documentos() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Para enviar a Fase 2, at\xE9 04/12/2026 ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" })), /* @__PURE__ */ React.createElement("div", { className: "checks" }, DOCS_A.map((d) => /* @__PURE__ */ React.createElement(Check, { key: d[0], id: d[0], sub: d[2], refs: d[3], extra: MODELO[d[0]] ? /* @__PURE__ */ React.createElement(ModelBtn, { id: d[0] }) : null }, d[1])))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Para contratar, depois do resultado final ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" })), /* @__PURE__ */ React.createElement("div", { className: "callout" }, /* @__PURE__ */ React.createElement("strong", null, "Regras de envio (14.2, 14.3)."), " Um \xFAnico e-mail para centelha.alagoas@gmail.com, com um PDF por documento, cada arquivo nomeado conforme as letras 14.1-a a 14.1-o. Prazo: at\xE9 26/03/2027. Se passar, a vaga vai para um suplente. Certid\xF5es t\xEAm validade, ent\xE3o emita perto da data de envio. Aus\xEAncia de qualquer documento ou inadimpl\xEAncia com \xF3rg\xE3o p\xFAblico impede a contrata\xE7\xE3o (14.4)."), /* @__PURE__ */ React.createElement("div", { className: "checks" }, DOCS_B.map((d) => /* @__PURE__ */ React.createElement(Check, { key: d[0], id: d[0], sub: "Onde obter: " + d[3] + ". Arquivo sugerido: " + d[4], refs: "14.1 " + d[1], extra: MODELO[d[0]] ? /* @__PURE__ */ React.createElement(ModelBtn, { id: d[0] }) : null }, /* @__PURE__ */ React.createElement("strong", { className: "letter" }, d[1]), " ", d[2])))));
}
function Informacoes() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Onde est\xE1 a nota da Fase 2 ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" })), /* @__PURE__ */ React.createElement("p", { className: "lede" }, "Nota Fase 2 = (S + M + E + 2\xD7CP + I) / 6. Convertida em peso por crit\xE9rio, cronograma e or\xE7amento somam cerca de 27% da nota. A nota final \xE9 a m\xE9dia entre Fase 1 e Fase 2, e a Fase 1 j\xE1 est\xE1 fechada. Valores arredondados."), /* @__PURE__ */ React.createElement("div", { className: "bars" }, PESOS.map((p) => /* @__PURE__ */ React.createElement("div", { className: "bar" + (p[3] ? " hi" : ""), key: p[1] }, /* @__PURE__ */ React.createElement("div", { className: "bar-l" }, /* @__PURE__ */ React.createElement("span", { className: "bar-c" }, p[1]), " ", p[0]), /* @__PURE__ */ React.createElement("div", { className: "bar-t", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "bar-f", style: { width: p[2] / 13.3 * 100 + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "bar-v" }, String(p[2]).replace(".", ","), "%")))), /* @__PURE__ */ React.createElement("div", { className: "callout warn" }, /* @__PURE__ */ React.createElement("strong", null, "Corte eliminat\xF3rio."), " Consist\xEAncia da Proposta (CP) abaixo de 2 elimina. CP = (MN + 2\xD7CF + 2\xD7O) / 5, ou seja, o cronograma e o or\xE7amento mandam nela. A associa\xE7\xE3o entre campos do formul\xE1rio e crit\xE9rios nesta aba \xE9 leitura do texto do edital, que lista as duas coisas em itens separados (4.2.2 e 10.2).")), /* @__PURE__ */ React.createElement("div", { className: "info-grid" }, INFO.map((s) => /* @__PURE__ */ React.createElement("article", { className: "info", key: s.k }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("span", { className: "info-k" }, s.k), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", null, s.t), /* @__PURE__ */ React.createElement("div", { className: "info-m" }, /* @__PURE__ */ React.createElement("span", null, s.crit), " ", /* @__PURE__ */ React.createElement(Ref, null, s.ref)))), /* @__PURE__ */ React.createElement("p", { className: "info-p" }, s.pede), /* @__PURE__ */ React.createElement("h4", null, "Levantar"), /* @__PURE__ */ React.createElement("ul", null, s.levantar.map((l, i) => /* @__PURE__ */ React.createElement("li", { key: i }, l))), /* @__PURE__ */ React.createElement("h4", null, "Organizar ", /* @__PURE__ */ React.createElement(Tag, { kind: "sugestao" })), /* @__PURE__ */ React.createElement("p", null, s.organizar)))));
}
function Orcamento({ budget, setBudget }) {
  const rows = budget;
  const totSub = rows.reduce((a, r) => a + (Number(r.sub) || 0), 0);
  const totCp = rows.reduce((a, r) => a + (Number(r.cp) || 0), 0);
  const total = totSub + totCp;
  const pro = rows.filter((r) => r.rub === "g").reduce((a, r) => a + (Number(r.sub) || 0) + (Number(r.cp) || 0), 0);
  const cpMin = totSub * 0.05;
  const proMax = total * 0.3;
  const checks = [
    [totSub <= 8e4, "Subven\xE7\xE3o at\xE9 R$ 80.000", brl(totSub) + " de R$ 80.000 (5.4)"],
    [totCp >= cpMin, "Contrapartida de pelo menos 5% da subven\xE7\xE3o", brl(totCp) + " para um m\xEDnimo de " + brl(cpMin) + " (5.3)"],
    [pro <= proMax, "Pr\xF3-labore at\xE9 30% do valor total do projeto", brl(pro) + " para um m\xE1ximo de " + brl(proMax) + " (7.1 g)"]
  ];
  const hasEx = rows.some((r) => r.ex);
  const upd = (id, k, v) => setBudget(rows.map((r) => r.id === id ? Object.assign({}, r, { [k]: v, ex: false }) : r));
  const del = (id) => setBudget(rows.filter((r) => r.id !== id));
  const add = () => setBudget(rows.concat([{ id: Date.now(), rub: "d", desc: "", sub: 0, cp: 0, ex: false }]));
  const clear = () => setBudget([{ id: Date.now(), rub: "d", desc: "", sub: 0, cp: 0, ex: false }]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "facts", "aria-label": "Refer\xEAncia para R$ 80.000" }, /* @__PURE__ */ React.createElement("div", { className: "fact" }, /* @__PURE__ */ React.createElement("div", { className: "fact-l" }, "Subven\xE7\xE3o m\xE1xima"), /* @__PURE__ */ React.createElement("div", { className: "fact-v" }, brl(8e4)), /* @__PURE__ */ React.createElement("div", { className: "fact-s" }, "Acima disso a proposta \xE9 eliminada")), /* @__PURE__ */ React.createElement("div", { className: "fact" }, /* @__PURE__ */ React.createElement("div", { className: "fact-l" }, "Contrapartida m\xEDnima"), /* @__PURE__ */ React.createElement("div", { className: "fact-v" }, brl(4e3)), /* @__PURE__ */ React.createElement("div", { className: "fact-s" }, "5% de R$ 80.000, antes de cada parcela")), /* @__PURE__ */ React.createElement("div", { className: "fact" }, /* @__PURE__ */ React.createElement("div", { className: "fact-l" }, "Teto de pr\xF3-labore"), /* @__PURE__ */ React.createElement("div", { className: "fact-v" }, brl(25200)), /* @__PURE__ */ React.createElement("div", { className: "fact-s" }, "30% de R$ 84.000, se o total do projeto for subven\xE7\xE3o mais contrapartida")), /* @__PURE__ */ React.createElement("div", { className: "fact" }, /* @__PURE__ */ React.createElement("div", { className: "fact-l" }, "Bolsas CNPq"), /* @__PURE__ */ React.createElement("div", { className: "fact-v" }, "at\xE9 R$ 50.000"), /* @__PURE__ */ React.createElement("div", { className: "fact-s" }, "Fora do teto de R$ 80.000"))), /* @__PURE__ */ React.createElement("div", { className: "cols" }, /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Regras que mexem no or\xE7amento ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" })), /* @__PURE__ */ React.createElement("ul", { className: "plain" }, /* @__PURE__ */ React.createElement("li", null, "Contrapartida em dinheiro, gasta no projeto, depositada em conta exclusiva antes de cada parcela. ", /* @__PURE__ */ React.createElement(Ref, null, "5.3")), /* @__PURE__ */ React.createElement("li", null, "S\xF3 valem despesas feitas depois do Termo de Outorga e do recebimento da subven\xE7\xE3o. ", /* @__PURE__ */ React.createElement(Ref, null, "7.3")), /* @__PURE__ */ React.createElement("li", null, "Pr\xF3-labore: s\xF3 s\xF3cios da equipe, parcelas mensais iguais por at\xE9 12 meses. ", /* @__PURE__ */ React.createElement(Ref, null, "7.1 g")), /* @__PURE__ */ React.createElement("li", null, "S\xF3cio que recebe pr\xF3-labore n\xE3o pode receber bolsa CNPq. ", /* @__PURE__ */ React.createElement(Ref, null, "7.2")), /* @__PURE__ */ React.createElement("li", null, "Membro da equipe n\xE3o pode ser pago como prestador de servi\xE7o com recurso do projeto. ", /* @__PURE__ */ React.createElement(Ref, null, "3.1.3.1")), /* @__PURE__ */ React.createElement("li", null, "Item n\xE3o financi\xE1vel no or\xE7amento pode ser cortado antes da contrata\xE7\xE3o, e o valor sai da subven\xE7\xE3o. ", /* @__PURE__ */ React.createElement(Ref, null, "14.6")), /* @__PURE__ */ React.createElement("li", null, "Bolsas DTI, EV e SET seguem a Portaria CNPq 2.262/2025. ", /* @__PURE__ */ React.createElement(Ref, null, "6")), /* @__PURE__ */ React.createElement("li", null, 'O edital n\xE3o define "valor total do projeto" para o limite de 30%. Esta p\xE1gina usa subven\xE7\xE3o mais contrapartida. Confirme com a FAPEAL.'))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "N\xE3o financi\xE1vel ", /* @__PURE__ */ React.createElement(Tag, { kind: "edital" })), /* @__PURE__ */ React.createElement("ul", { className: "plain" }, NAO_FIN.map((x, i) => /* @__PURE__ */ React.createElement("li", { key: i }, x))), /* @__PURE__ */ React.createElement("p", { className: "note" }, "Item 8.1."))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Rascunho do or\xE7amento ", /* @__PURE__ */ React.createElement(Tag, { kind: "sugestao" })), hasEx ? /* @__PURE__ */ React.createElement("div", { className: "callout warn" }, "As linhas abaixo s\xE3o exemplos. Substitua pelos seus valores ou limpe a tabela. Edite qualquer c\xE9lula e a linha deixa de ser exemplo.") : null, /* @__PURE__ */ React.createElement("div", { className: "verdicts" }, checks.map((c, i) => /* @__PURE__ */ React.createElement("div", { className: "verdict " + (c[0] ? "ok" : "crit"), key: i }, /* @__PURE__ */ React.createElement("span", { className: "pill" }, c[0] ? "Dentro" : "Fora"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, c[1]), /* @__PURE__ */ React.createElement("span", null, c[2]))))), /* @__PURE__ */ React.createElement("div", { className: "tbl-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "budget" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Rubrica (7.1)"), /* @__PURE__ */ React.createElement("th", null, "Descri\xE7\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Subven\xE7\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Contrapartida"), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement("span", { className: "sr" }, "Remover")))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, className: r.ex ? "ex" : "" }, /* @__PURE__ */ React.createElement("td", { "data-l": "Rubrica (7.1)" }, /* @__PURE__ */ React.createElement("select", { id: "rub-" + r.id, "aria-label": "Rubrica", value: r.rub, onChange: (e) => upd(r.id, "rub", e.target.value) }, RUBRICAS.map((o) => /* @__PURE__ */ React.createElement("option", { key: o[0], value: o[0] }, o[0], ") ", o[1])))), /* @__PURE__ */ React.createElement("td", { "data-l": "Descri\xE7\xE3o" }, /* @__PURE__ */ React.createElement("input", { id: "desc-" + r.id, "aria-label": "Descri\xE7\xE3o", type: "text", value: r.desc, placeholder: "Atividade que justifica o gasto", onChange: (e) => upd(r.id, "desc", e.target.value) })), /* @__PURE__ */ React.createElement("td", { className: "num", "data-l": "Subven\xE7\xE3o" }, /* @__PURE__ */ React.createElement("input", { id: "sub-" + r.id, "aria-label": "Valor de subven\xE7\xE3o", type: "number", min: "0", step: "100", value: r.sub || "", onChange: (e) => upd(r.id, "sub", e.target.value === "" ? 0 : parseFloat(e.target.value)) })), /* @__PURE__ */ React.createElement("td", { className: "num", "data-l": "Contrapartida" }, /* @__PURE__ */ React.createElement("input", { id: "cp-" + r.id, "aria-label": "Valor de contrapartida", type: "number", min: "0", step: "100", value: r.cp || "", onChange: (e) => upd(r.id, "cp", e.target.value === "" ? 0 : parseFloat(e.target.value)) })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("button", { className: "x", type: "button", "aria-label": "Remover linha", onClick: () => del(r.id) }, "\xD7"))))), /* @__PURE__ */ React.createElement("tfoot", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "2" }, "Totais"), /* @__PURE__ */ React.createElement("td", { className: "num" }, brl(totSub)), /* @__PURE__ */ React.createElement("td", { className: "num" }, brl(totCp)), /* @__PURE__ */ React.createElement("td", null)), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "2" }, "Total do projeto"), /* @__PURE__ */ React.createElement("td", { className: "num", colSpan: "2" }, brl(total)), /* @__PURE__ */ React.createElement("td", null))))), /* @__PURE__ */ React.createElement("div", { className: "btns" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: add }, "Adicionar linha"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn ghost", onClick: clear }, "Limpar tabela")), /* @__PURE__ */ React.createElement("p", { className: "note" }, "Rubricas: a) di\xE1rias, b) passagens, c) material de consumo e software, d) terceiros, PI, consultoria e marketing, e) loca\xE7\xE3o de espa\xE7o ou incubadora, f) equipamentos, g) pr\xF3-labore, h) contabilidade. O que sai desta tabela precisa existir tamb\xE9m no formul\xE1rio do sistema.")));
}
function Organizacao() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(TREE).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      }, () => {
      });
    } catch (e) {
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "lede wide" }, "Tudo nesta aba \xE9 ", /* @__PURE__ */ React.createElement(Tag, { kind: "sugestao" }), ". A ideia \xE9 ter uma fonte \xFAnica para cada informa\xE7\xE3o e conseguir provar cada frase da proposta."), /* @__PURE__ */ React.createElement("div", { className: "cols" }, /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Estrutura de pastas"), /* @__PURE__ */ React.createElement("pre", { className: "tree", tabIndex: "0" }, TREE), /* @__PURE__ */ React.createElement("div", { className: "btns" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: copy }, copied ? "Copiado" : "Copiar estrutura"))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Regras de organiza\xE7\xE3o"), /* @__PURE__ */ React.createElement("ol", { className: "steps" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Um documento mestre."), " Todos os textos dos campos a a k em um arquivo, na ordem do formul\xE1rio, com o limite de caracteres de cada campo copiado do sistema. S\xF3 depois se cola no sistema."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Uma vers\xE3o valendo."), " Sufixo v01, v02. Quem edita avisa. Congele em 02/12."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Cadeia de coer\xEAncia."), " Problema, funcionalidade, atividade do cronograma, rubrica do or\xE7amento, entreg\xE1vel. Se uma ponta n\xE3o tem a seguinte, o avaliador nota."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Toda afirma\xE7\xE3o tem prova."), " N\xFAmero com fonte e ano, est\xE1gio atual com evid\xEAncia numerada (E01, E02), custo com cota\xE7\xE3o."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Nomes que se ordenam."), " Prefixo num\xE9rico nas pastas e data no formato 2026-11-25 nos arquivos. Para a contrata\xE7\xE3o, siga o padr\xE3o 14.1-a a 14.1-o exigido pelo edital."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Rotina curta."), " 15 minutos por dia para atualizar a aba Plano e destravar quem est\xE1 parado.")))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", null, "Quem faz o qu\xEA"), /* @__PURE__ */ React.createElement("div", { className: "tbl-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "roles" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Papel"), /* @__PURE__ */ React.createElement("th", null, "Responsabilidade"), /* @__PURE__ */ React.createElement("th", null, "Quem"))), /* @__PURE__ */ React.createElement("tbody", null, PAPEIS.map((p) => /* @__PURE__ */ React.createElement("tr", { key: p[0] }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, p[0])), /* @__PURE__ */ React.createElement("td", null, p[1]), /* @__PURE__ */ React.createElement("td", { className: "fill" }, "Preencher"))))))));
}
const TAB_INFO = {
  resumo: ["In\xEDcio", "O essencial do edital, o que conferir antes de escrever e o que pode eliminar a proposta."],
  plano: ["Plano at\xE9 04/12", "Cinco blocos de trabalho, do primeiro dia ao envio."],
  cronograma: ["Datas oficiais", "Todo o cronograma do item 11, com a etapa atual em destaque."],
  documentos: ["Documentos", "O que enviar agora e o que reunir para a contrata\xE7\xE3o."],
  anexos: ["Anexos e modelos", "Situa\xE7\xE3o dos anexos citados no edital e modelos de declara\xE7\xF5es e cartas para preencher e copiar."],
  formulario: ["Formul\xE1rio da Fase 2", "Redija aqui os campos do item 4.2.2 e cole no sistema."],
  informacoes: ["Informa\xE7\xF5es a levantar", "Onde est\xE1 a nota e o que reunir para cada campo."],
  orcamento: ["Or\xE7amento", "Regras de aplica\xE7\xE3o dos recursos e um rascunho que confere os limites."],
  organizacao: ["Organiza\xE7\xE3o", "Pastas, regras de trabalho e pap\xE9is da equipe."]
};
const ANEXOS = [
  { t: "Edital FAPEAL n\xBA 06/2026, 2\xAA Retifica\xE7\xE3o", st: "ok", pill: "Em m\xE3os", d: "O PDF do edital, com 24 p\xE1ginas, datado de 23/10/2026. Vale sempre o edital em caso de diverg\xEAncia (22.8).", ref: "22.8" },
  { t: "Anexo I: Termo de Outorga de Concess\xE3o da Subven\xE7\xE3o Econ\xF4mica", st: "warn", pill: "N\xE3o est\xE1 no PDF", d: "O item 14.10 cita este anexo, mas as 24 p\xE1ginas do edital terminam na assinatura, sem ele. O Termo \xE9 assinado na contrata\xE7\xE3o, at\xE9 26/05/2027. Pe\xE7a o modelo \xE0 FAPEAL pelo e-mail do programa.", ref: "14.10" },
  { t: "Formul\xE1rio da Fase 2 (Projeto de Fomento)", st: "info", pill: "Dentro do sistema", d: "Fica no Sistema Centelha, com login. Os limites reais de caracteres s\xF3 aparecem l\xE1. A aba Formul\xE1rio desta p\xE1gina espelha os campos do item 4.2.2 para voc\xEA redigir antes e colar depois.", ref: "4.3, 4.5" },
  { t: "Modelo de recurso administrativo", st: "soon", pill: "No HelpDesk", d: "Dispon\xEDvel na plataforma de HelpDesk, na op\xE7\xE3o Recursos Administrativos, com assinatura digital gov.br. Um \xFAnico recurso por fase.", ref: "13.3" },
  { t: "Formul\xE1rios-padr\xE3o de acompanhamento, altera\xE7\xE3o e presta\xE7\xE3o de contas", st: "soon", pill: "A FAPEAL envia", d: "Relat\xF3rios peri\xF3dicos, pedido de altera\xE7\xE3o ou remanejamento e Relat\xF3rio T\xE9cnico Final com Presta\xE7\xE3o de Contas. A FAPEAL disponibiliza durante ou ap\xF3s a contrata\xE7\xE3o, junto com o Manual de Presta\xE7\xE3o de Contas.", ref: "5.3.1, 16.1, 16.2.1, 17.3" },
  { t: "Resolu\xE7\xE3o FAPEAL n\xBA 200/2023", st: "ok", pill: "Link no edital", d: "Define os valores de di\xE1rias para a rubrica de di\xE1rias do or\xE7amento.", ref: "7.1 a", href: "https://www.fapeal.br/wp-content/uploads/2023/04/Resolucao-Fapeal-200-2023.pdf", hl: "Abrir a resolu\xE7\xE3o" },
  { t: "Portaria CNPq n\xBA 2.262, de 19/05/2025", st: "ok", pill: "Link no edital", d: "Requisitos das bolsas DTI, EV e SET, de at\xE9 R$ 50.000 por projeto.", ref: "6.3", href: "http://www.cnpq.br/web/guest/view/-/journal_content/56_INSTANCE_0oED/10157/25314", hl: "Abrir a portaria" }
];
const PFIELDS = [
  ["nome", "Nome completo", "text"],
  ["cpf", "CPF", "text"],
  ["funcao", "Fun\xE7\xE3o na equipe", "text"],
  ["projeto", "Nome do projeto (o mesmo da Fase 1)", "text"],
  ["coordenador", "Coordenador do projeto", "text"],
  ["empresa", "Empresa", "text"],
  ["cnpj", "CNPJ", "text"],
  ["horas", "Horas semanais", "number"],
  ["cidade", "Cidade", "text"]
];
const TPL = [
  {
    id: "t1",
    t: "Declara\xE7\xE3o individual de participa\xE7\xE3o e dedica\xE7\xE3o",
    refs: "3.3.2, 3.1.1 j, 14.1 o",
    quem: "Cada membro da equipe. As 20 horas semanais s\xE3o exigidas do proponente. Confirme no formul\xE1rio se valem para os demais.",
    fn: (v) => [
      "DECLARA\xC7\xC3O INDIVIDUAL DE PARTICIPA\xC7\xC3O E DEDICA\xC7\xC3O",
      "",
      "Eu, " + v.nome + ", CPF n\xBA " + v.cpf + ", declaro, para os fins do Edital FAPEAL n\xBA 06/2026 (Programa Centelha 3 Alagoas), que integro a equipe executora do projeto \u201C" + v.projeto + "\u201D, na fun\xE7\xE3o de " + v.funcao + ", e que disponho de, no m\xEDnimo, 20 (vinte) horas semanais para dedica\xE7\xE3o ao desenvolvimento do projeto.",
      "",
      "Declaro, ainda, que participo de apenas um projeto na Fase 2 do programa e que estou ciente de que a participa\xE7\xE3o em mais de uma proposta implica a desclassifica\xE7\xE3o de todas elas.",
      "",
      v.cidade + ", " + v.data + ".",
      "",
      "______________________________________",
      v.nome
    ].join("\n")
  },
  {
    id: "t2",
    t: "Declara\xE7\xE3o de inexist\xEAncia de v\xEDnculo e compromisso com o programa",
    refs: "14.1 l",
    quem: "Coordenador e cada integrante da equipe executora.",
    fn: (v) => [
      "DECLARA\xC7\xC3O DE INEXIST\xCANCIA DE V\xCDNCULO E DE COMPROMISSO COM O PROGRAMA",
      "",
      "Eu, " + v.nome + ", CPF n\xBA " + v.cpf + ", integrante da equipe executora do projeto \u201C" + v.projeto + "\u201D, declaro, para os fins do item 14.1 do Edital FAPEAL n\xBA 06/2026, que:",
      "",
      "1. n\xE3o possuo v\xEDnculo profissional ou de parentesco at\xE9 o terceiro grau com o MCTI, a Finep, o CNPq, a Funda\xE7\xE3o CERTI, a FAPEAL, a SECTI-AL, o SEBRAE-AL ou outras institui\xE7\xF5es parceiras estaduais respons\xE1veis pela execu\xE7\xE3o do edital;",
      "2. n\xE3o possuo projeto aprovado em outro estado executor do Programa Centelha;",
      "3. comprometo-me a participar das atividades promovidas pelo Programa Centelha e das reuni\xF5es solicitadas pela FAPEAL.",
      "",
      v.cidade + ", " + v.data + ".",
      "",
      "______________________________________",
      v.nome
    ].join("\n")
  },
  {
    id: "t3",
    t: "Declara\xE7\xE3o do respons\xE1vel legal sobre s\xF3cios em empresa de atividade afim",
    refs: "14.1 k, 3.1.1 h",
    quem: "Respons\xE1vel legal da empresa. Se a empresa ainda ser\xE1 aberta, assine depois da constitui\xE7\xE3o.",
    fn: (v) => [
      "DECLARA\xC7\xC3O DO RESPONS\xC1VEL LEGAL",
      "",
      "Eu, " + v.nome + ", CPF n\xBA " + v.cpf + ", representante legal da empresa " + v.empresa + ", CNPJ n\xBA " + v.cnpj + ", declaro, para os fins do item 14.1, al\xEDnea k, do Edital FAPEAL n\xBA 06/2026, que a empresa n\xE3o possui s\xF3cios com participa\xE7\xE3o em outra(s) empresa(s) de atividade afim ao projeto \u201C" + v.projeto + "\u201D.",
      "",
      v.cidade + ", " + v.data + ".",
      "",
      "______________________________________",
      v.nome
    ].join("\n")
  },
  {
    id: "t4",
    t: "Carta de anu\xEAncia de integrante da equipe",
    refs: "14.1 m, 3.1.3 f",
    quem: "Cada integrante da equipe executora, uma carta por pessoa.",
    fn: (v) => [
      "CARTA DE ANU\xCANCIA DE INTEGRANTE DA EQUIPE EXECUTORA",
      "",
      "Eu, " + v.nome + ", CPF n\xBA " + v.cpf + ", anuo com a minha participa\xE7\xE3o na equipe executora do projeto \u201C" + v.projeto + "\u201D, coordenado por " + v.coordenador + ", na fun\xE7\xE3o de " + v.funcao + ", com dedica\xE7\xE3o de " + v.horas + " horas semanais, no \xE2mbito do Edital FAPEAL n\xBA 06/2026 (Programa Centelha 3 Alagoas).",
      "",
      "Estou ciente das regras do edital e de que devo estar presente \xE0s visitas de acompanhamento t\xE9cnico e \xE0s reuni\xF5es de avalia\xE7\xE3o do projeto, quando convocado pela FAPEAL.",
      "",
      v.cidade + ", " + v.data + ".",
      "",
      "______________________________________",
      v.nome
    ].join("\n")
  },
  {
    id: "t5",
    t: "Carta de anu\xEAncia da institui\xE7\xE3o de v\xEDnculo (servidor p\xFAblico)",
    refs: "14.1 n, 3.1.1.1",
    quem: "S\xF3 se algu\xE9m da equipe for servidor p\xFAblico. Assinada pela institui\xE7\xE3o.",
    fn: (v) => [
      "CARTA DE ANU\xCANCIA DA INSTITUI\xC7\xC3O DE V\xCDNCULO",
      "",
      "A [INSTITUI\xC7\xC3O], CNPJ n\xBA [CNPJ DA INSTITUI\xC7\xC3O], por meio de seu representante legal, [NOME E CARGO DO REPRESENTANTE], anui com a participa\xE7\xE3o do(a) servidor(a) " + v.nome + ", CPF n\xBA " + v.cpf + ", matr\xEDcula [MATR\xCDCULA], na equipe executora do projeto \u201C" + v.projeto + "\u201D, no \xE2mbito do Edital FAPEAL n\xBA 06/2026 (Programa Centelha 3 Alagoas), observado o regimento interno desta institui\xE7\xE3o.",
      "",
      v.cidade + ", " + v.data + ".",
      "",
      "______________________________________",
      "[NOME E CARGO DO REPRESENTANTE]"
    ].join("\n")
  }
];
function CopyBtn({ text, label, ghost }) {
  const [s, setS] = useState("");
  const click = () => {
    const done = (ok) => {
      setS(ok ? "ok" : "fail");
      setTimeout(() => setS(""), 2600);
    };
    try {
      navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
    } catch (e) {
      done(false);
    }
  };
  return /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn" + (ghost ? " ghost" : ""), onClick: click }, s === "ok" ? "Copiado" : s === "fail" ? "N\xE3o copiou. Selecione o texto" : label || "Copiar");
}
function budgetText(rows) {
  const used = rows.filter((r) => r.sub || r.cp || r.desc);
  const lines = used.map((r) => {
    const rub = RUBRICAS.find((x) => x[0] === r.rub);
    return "- (" + r.rub + ") " + (rub ? rub[1] : "") + " | " + (r.desc || "sem descri\xE7\xE3o") + " | subven\xE7\xE3o " + brl(r.sub) + " | contrapartida " + brl(r.cp);
  });
  const ts = used.reduce((a, r) => a + (Number(r.sub) || 0), 0);
  const tc = used.reduce((a, r) => a + (Number(r.cp) || 0), 0);
  lines.push("Total: subven\xE7\xE3o " + brl(ts) + " | contrapartida " + brl(tc));
  return lines.join("\n");
}
function Formulario({ form, setForm, budget }) {
  const get = (k) => form[k] || {};
  const setF = (k, patch) => setForm((f) => Object.assign({}, f, { [k]: Object.assign({}, f[k] || {}, patch) }));
  const filled = INFO.filter((s) => (get(s.k).text || "").trim().length > 0).length;
  const all = INFO.map((s) => "## " + s.k + ") " + s.t + "\n" + ((get(s.k).text || "").trim() || "[a preencher]")).join("\n\n");
  const hasEx = budget.some((r) => r.ex);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "card accent" }, /* @__PURE__ */ React.createElement("div", { className: "form-top" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, filled, " de ", INFO.length, " campos com texto"), /* @__PURE__ */ React.createElement("p", { className: "lede" }, "Os campos seguem o item 4.2.2 do edital, na ordem do formul\xE1rio. Os limites de caracteres do sistema s\xF3 aparecem l\xE1: informe cada um no campo ao lado do contador. Os textos ficam salvos s\xF3 neste navegador, ent\xE3o copie tudo para o seu documento mestre de vez em quando. O PDF de apoio (campo m) \xE9 opcional e vai direto no sistema.")), /* @__PURE__ */ React.createElement(CopyBtn, { text: all, label: "Copiar tudo" }))), /* @__PURE__ */ React.createElement("div", { className: "fld-list" }, INFO.map((s) => {
    const f = get(s.k);
    const text = f.text || "";
    const lim = parseInt(f.limit, 10) || 0;
    const over = lim && text.length > lim;
    return /* @__PURE__ */ React.createElement("article", { className: "card fld" + (f.done ? " ready" : ""), key: s.k }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("span", { className: "info-k" }, s.k), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", null, s.t), /* @__PURE__ */ React.createElement("div", { className: "info-m" }, /* @__PURE__ */ React.createElement("span", null, s.crit), " ", /* @__PURE__ */ React.createElement(Ref, null, s.ref)))), /* @__PURE__ */ React.createElement("p", { className: "info-p" }, s.pede), /* @__PURE__ */ React.createElement("details", null, /* @__PURE__ */ React.createElement("summary", null, "O que incluir neste campo"), /* @__PURE__ */ React.createElement("ul", null, s.levantar.map((l, i) => /* @__PURE__ */ React.createElement("li", { key: i }, l)))), s.k === "l" ? /* @__PURE__ */ React.createElement("input", { id: "f-" + s.k, className: "txt", type: "url", inputMode: "url", placeholder: "https://youtu.be/... (N\xE3o Listado ou P\xFAblico) ou link do Vimeo", "aria-label": s.t, value: text, onChange: (e) => setF(s.k, { text: e.target.value }) }) : /* @__PURE__ */ React.createElement("textarea", { id: "f-" + s.k, className: "txt", rows: s.k === "k" ? 5 : 8, placeholder: "Escreva aqui o texto deste campo.", "aria-label": s.t, value: text, onChange: (e) => setF(s.k, { text: e.target.value }) }), /* @__PURE__ */ React.createElement("div", { className: "fld-bar" }, s.k !== "l" ? /* @__PURE__ */ React.createElement("span", { className: "count-ch" + (over ? " over" : "") }, text.length, lim ? " de " + lim : "", " caracteres") : /* @__PURE__ */ React.createElement("span", null), s.k !== "l" ? /* @__PURE__ */ React.createElement("label", { className: "lim", htmlFor: "lim-" + s.k }, "Limite do sistema", /* @__PURE__ */ React.createElement("input", { id: "lim-" + s.k, type: "number", min: "0", inputMode: "numeric", value: f.limit || "", onChange: (e) => setF(s.k, { limit: e.target.value }) })) : null, /* @__PURE__ */ React.createElement("label", { className: "ready-c", htmlFor: "rd-" + s.k }, /* @__PURE__ */ React.createElement("input", { id: "rd-" + s.k, type: "checkbox", checked: !!f.done, onChange: () => setF(s.k, { done: !f.done }) }), "Pronto para colar")), /* @__PURE__ */ React.createElement("div", { className: "btns" }, /* @__PURE__ */ React.createElement(CopyBtn, { text, label: "Copiar campo", ghost: true }), s.k === "h" ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn ghost", disabled: hasEx, title: hasEx ? "Substitua as linhas de exemplo na aba Or\xE7amento antes de inserir" : "", onClick: () => setF("h", { text: (text ? text + "\n\n" : "") + budgetText(budget) }) }, "Inserir or\xE7amento da aba Or\xE7amento") : null), s.k === "h" && hasEx ? /* @__PURE__ */ React.createElement("p", { className: "note" }, "A tabela da aba Or\xE7amento ainda tem linhas de exemplo. Preencha com seus valores para poder inserir.") : null);
  })));
}
function Progress() {
  const { checks } = useContext(Ctx);
  const done = ALL_IDS.filter((id) => checks[id]).length;
  const pct = Math.round(done / ALL_IDS.length * 100);
  return /* @__PURE__ */ React.createElement("div", { className: "prog", "aria-label": "Progresso: " + done + " de " + ALL_IDS.length + " itens" }, /* @__PURE__ */ React.createElement("div", { className: "prog-t" }, /* @__PURE__ */ React.createElement("div", { className: "prog-f", style: { width: pct + "%" } })), /* @__PURE__ */ React.createElement("span", null, done, " de ", ALL_IDS.length, " itens marcados"));
}


/* ===== Componentes da versão landing page ===== */

const PLAN_TASKS = PLANO.reduce((a, b) => a.concat(b.tasks.map((t) => ({ id: t[0], text: t[1], refs: t[2], block: b }))), []);
const firstPending = (checks) => PLAN_TASKS.find((t) => !checks[t.id]) || null;

/* Os itens marcados continuam na lista, na mesma posição, só preenchidos.
   O bloco exibido só muda quando todos os seus itens estiverem marcados. */
function Proximos() {
  const { checks } = useContext(Ctx);
  const cur = PLANO.find((b) => b.tasks.some((t) => !checks[t[0]])) || PLANO[PLANO.length - 1];
  const done = cur.tasks.filter((t) => checks[t[0]]).length;
  return (
    <section className="card accent">
      <h2>
        Próximos passos <Tag kind="sugestao" />
      </h2>
      <p className="lede">
        {cur.titulo} · {cur.faixa} · {done} de {cur.tasks.length} concluídos. O que você marca fica aqui, preenchido, no mesmo lugar.
      </p>
      <div className="checks">
        {cur.tasks.map((t) => (
          <Check key={t[0]} id={t[0]} refs={t[2]}>
            {t[1]}
          </Check>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  const { checks, go } = useContext(Ctx);
  const next = firstPending(checks);
  return (
    <section className="hero glass">
      <div className="hero-t">
        <div className="eyebrow">Edital FAPEAL nº 06/2026 · 2ª retificação de 23/10/2026</div>
        <h1>Centelha Alagoas, Fase 2: Projeto de Fomento</h1>
        <p>Guia de preparação da proposta, da submissão à contratação: prazos, documentos, modelos e orçamento num só lugar.</p>
        <Progress />
        <div className="btns">
          <button type="button" className="btn" onClick={() => go("plano")}>
            Ver o plano
          </button>
          <button type="button" className="btn ghost" onClick={() => go("cronograma")}>
            Datas oficiais
          </button>
        </div>
      </div>
      <Countdown />
      <div className="hero-next">
        <div className="hero-next-l">Próximo passo pendente</div>
        {next ? (
          <>
            <div className="hero-next-t">{next.text}</div>
            <div className="hero-next-m">
              {next.block.titulo} · {next.block.faixa} <Ref>{next.refs}</Ref>
            </div>
          </>
        ) : (
          <div className="hero-next-t">Todos os passos do plano estão marcados.</div>
        )}
      </div>
    </section>
  );
}

function Resumo() {
  return (
    <>
      <section aria-label="Resumo do programa">
        <h2 className="sec-t">Resumo do programa</h2>
        <div className="facts scroll-row">
          {FACTS.map((f) => (
            <div className="fact" key={f[0]}>
              <div className="fact-l">{f[0]}</div>
              <div className="fact-v">{f[1]}</div>
              <div className="fact-s">{f[2]}</div>
            </div>
          ))}
        </div>
      </section>
      <Proximos />
      <div className="cols">
        <section className="card">
          <h2>
            Confirme antes de escrever <Tag kind="edital" />
          </h2>
          <p className="lede">Se algum item falhar, ele pode derrubar a proposta depois da avaliação. Marque cada um quando conferir.</p>
          <div className="checks">
            {ELEG.map((e) => (
              <Check key={e[0]} id={e[0]} refs={e[2]}>
                {e[1]}
              </Check>
            ))}
          </div>
        </section>
        <section className="card">
          <h2>
            O que elimina ou desclassifica <Tag kind="edital" />
          </h2>
          <ul className="risk">
            {RISCOS.map((r, i) => (
              <li key={i}>
                <span>{r[0]}</span> <Ref>{r[1]}</Ref>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="card">
        <h2>Canais oficiais</h2>
        <div className="links">
          <div>
            <strong>Sistema Centelha AL</strong>
            <a href="https://al.programacentelha.com.br" target="_blank" rel="noreferrer">
              al.programacentelha.com.br
            </a>
            <span>Envio das propostas e consulta de notas e pareceres.</span>
          </div>
          <div>
            <strong>Site do programa</strong>
            <a href="https://programacentelha.com.br/al/" target="_blank" rel="noreferrer">
              programacentelha.com.br/al
            </a>
            <span>Versões atualizadas do cronograma.</span>
          </div>
          <div>
            <strong>Dúvidas e recursos</strong>
            <a href="https://www.helpdeskcentelha.com.br/al" target="_blank" rel="noreferrer">
              helpdeskcentelha.com.br/al
            </a>
            <span>E-mail: centelha.alagoas@gmail.com. Resposta em até 72 horas úteis.</span>
          </div>
          <div>
            <strong>FAPEAL</strong>
            <a href="https://www.fapeal.br" target="_blank" rel="noreferrer">
              www.fapeal.br
            </a>
            <span>Divulgação dos resultados.</span>
          </div>
        </div>
      </section>
    </>
  );
}

/* ===== Documentos: biblioteca + pré-visualização ===== */

const MODEL_MAP = { da5: "t1", da6: "t1", db_k: "t3", db_l: "t2", db_m: "t4", db_n: "t5", db_o: "t1" };

function ModelBtn({ id }) {
  const { openDoc } = useContext(Ctx);
  return (
    <button
      type="button"
      className="mini"
      onClick={(e) => {
        e.preventDefault();
        openDoc(MODEL_MAP[id] || "t1");
      }}
    >
      Ver modelo
    </button>
  );
}

const CRONO_FISICO = [
  ["Marco 1: protótipo funcional", [1, 2, 3, 4]],
  ["Marco 2: testes com usuários", [4, 5, 6, 7]],
  ["Marco 3: primeiros clientes pagantes", [7, 8, 9, 10]],
  ["Marco 4: estrutura de operação", [9, 10, 11, 12]],
  ["Prestação de contas e relatório final", [11, 12]]
];

function sheetCols(n) {
  return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
}

function buildLibrary() {
  const lib = [];
  TPL.forEach((t) => lib.push({ id: t.id, kind: "doc", title: t.t, refs: t.refs, tag: "sugestao", pill: "Modelo", pillCls: "st-info", d: "Quem assina: " + t.quem }));
  lib.push({ id: "s_orc", kind: "sheet", sheet: "orc", title: "Planilha de orçamento", refs: "5.3, 5.4, 7.1", tag: "sugestao", pill: "Planilha", pillCls: "st-info", d: "Mostra as linhas do seu rascunho da aba Orçamento, com subvenção, contrapartida e totais." });
  lib.push({ id: "s_crono", kind: "sheet", sheet: "crono", title: "Cronograma físico de 12 meses", refs: "4.2.2 g", tag: "sugestao", pill: "Planilha", pillCls: "st-info", d: "Exemplo de como os marcos se distribuem pelos 12 meses de execução." });
  ANEXOS.forEach((a, i) => lib.push({ id: "a" + i, kind: "ficha", title: a.t, refs: a.ref, tag: "edital", pill: a.pill, pillCls: "st-" + a.st, d: a.d, href: a.href, hl: a.hl }));
  return lib;
}

function textToTsv(rows) {
  return rows.map((r) => r.join("\t")).join("\n");
}

function Sheet({ cols, head, rows, foot, className }) {
  const letters = sheetCols(cols);
  return (
    <div className="sheet-wrap scroll-x" tabIndex="0">
      <table className={"sheet " + (className || "")}>
        <thead>
          <tr className="sheet-letters">
            <th className="corner"></th>
            {letters.map((l) => (
              <th key={l}>{l}</th>
            ))}
          </tr>
          <tr className="sheet-head">
            <th className="rn">1</th>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th className="rn">{i + 2}</th>
              {r.map((c, j) => {
                const o = c && typeof c === "object" ? c : { v: c };
                return (
                  <td key={j} className={(o.num ? "num " : "") + (o.cls || "")}>
                    {o.v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        {foot ? (
          <tfoot>
            <tr>
              <th className="rn">{rows.length + 2}</th>
              {foot.map((c, j) => (
                <td key={j} className={typeof c === "object" ? "num" : ""}>
                  {typeof c === "object" ? c.v : c}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

function DocModal({ doc, onClose, p, setP, v, budget }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      try {
        if (prev && prev.focus) prev.focus();
      } catch (e) {}
    };
  }, []);

  let body = null;
  let copyText = "";
  const isDoc = doc.kind === "doc";
  if (isDoc) {
    const t = TPL.find((x) => x.id === doc.id);
    const text = t.fn(v);
    copyText = text;
    const lines = text.split("\n");
    body = (
      <div className="dm-grid">
        <aside className="dm-side">
          <h3>Preencher os campos</h3>
          <p className="note">Os dados ficam só na sua tela e não são salvos.</p>
          {PFIELDS.map((f) => (
            <div className="fld-s" key={f[0]}>
              <label htmlFor={"dm-" + f[0]}>{f[1]}</label>
              <input id={"dm-" + f[0]} type={f[2]} inputMode={f[0] === "cpf" || f[0] === "cnpj" ? "numeric" : undefined} autoComplete="off" value={p[f[0]] || ""} onChange={(e) => setP(Object.assign({}, p, { [f[0]]: e.target.value }))} />
            </div>
          ))}
        </aside>
        <div className="dm-canvas">
          <article className="paper" aria-label={"Pré-visualização: " + doc.title}>
            {lines.map((ln, i) =>
              i === 0 ? (
                <h4 className="paper-title" key={i}>
                  {ln}
                </h4>
              ) : ln === "" ? (
                <div className="paper-gap" key={i} />
              ) : /^_{5,}/.test(ln) ? (
                <div className="paper-sign" key={i} />
              ) : (
                <p key={i}>{ln}</p>
              )
            )}
          </article>
        </div>
      </div>
    );
  } else if (doc.sheet === "orc") {
    const used = budget.filter((r) => r.sub || r.cp || r.desc);
    const ts = used.reduce((a, r) => a + (Number(r.sub) || 0), 0);
    const tc = used.reduce((a, r) => a + (Number(r.cp) || 0), 0);
    const rows = used.map((r) => {
      const rub = RUBRICAS.find((x) => x[0] === r.rub);
      return [r.rub, rub ? rub[1] : "", r.desc || "sem descrição", { v: brl(r.sub), num: true }, { v: brl(r.cp), num: true }, { v: brl((Number(r.sub) || 0) + (Number(r.cp) || 0)), num: true }];
    });
    copyText = textToTsv([["Rubrica", "Descrição da rubrica", "Item", "Subvenção", "Contrapartida", "Total"]].concat(rows.map((r) => r.map((c) => (typeof c === "object" ? c.v : c))), [["", "", "Total", brl(ts), brl(tc), brl(ts + tc)]]));
    body = (
      <div className="dm-sheet">
        <p className="note">Mostra o rascunho da aba Orçamento. Para alterar valores, volte à aba Orçamento.{budget.some((r) => r.ex) ? " As linhas atuais são exemplos." : ""}</p>
        <Sheet cols={6} head={["Rubrica", "Descrição da rubrica", "Item", "Subvenção", "Contrapartida", "Total"]} rows={rows} foot={["", "", "Total", { v: brl(ts) }, { v: brl(tc) }, { v: brl(ts + tc) }]} />
      </div>
    );
  } else if (doc.sheet === "crono") {
    const months = Array.from({ length: 12 }, (_, i) => "M" + (i + 1));
    const rows = CRONO_FISICO.map((r) => [r[0]].concat(months.map((_, i) => ({ v: r[1].indexOf(i + 1) >= 0 ? "■" : "", cls: r[1].indexOf(i + 1) >= 0 ? "on" : "" }))));
    copyText = textToTsv([["Atividade"].concat(months)].concat(CRONO_FISICO.map((r) => [r[0]].concat(months.map((_, i) => (r[1].indexOf(i + 1) >= 0 ? "x" : ""))))));
    body = (
      <div className="dm-sheet">
        <p className="note">Exemplo ilustrativo. Os marcos reais saem do seu campo g do formulário, com as atividades distribuídas nos 12 meses de execução.</p>
        <Sheet cols={13} head={["Atividade"].concat(months)} rows={rows} className="crono" />
      </div>
    );
  } else {
    copyText = [doc.title, "", doc.d, "", "Referência: item " + doc.refs].join("\n");
    body = (
      <div className="dm-canvas">
        <article className="paper" aria-label={"Ficha: " + doc.title}>
          <h4 className="paper-title">{doc.title}</h4>
          <p>
            <span className={"pill " + doc.pillCls}>{doc.pill}</span>
          </p>
          <p>{doc.d}</p>
          <p>
            Referência no edital: <Ref>{doc.refs}</Ref>
          </p>
          {doc.href ? (
            <p>
              <a className="linkbtn" href={doc.href} target="_blank" rel="noreferrer">
                {doc.hl}
              </a>
            </p>
          ) : null}
        </article>
      </div>
    );
  }

  return (
    <div
      className="dm-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dm" role="dialog" aria-modal="true" aria-label={doc.title}>
        <header className="dm-bar">
          <span className={"dm-ico " + (doc.kind === "sheet" ? "is-sheet" : "is-doc")} aria-hidden="true" />
          <div className="dm-title">
            <strong>{doc.title}</strong>
            <span>{doc.kind === "sheet" ? "Planilha" : doc.kind === "doc" ? "Documento" : "Ficha do anexo"} · pré-visualização</span>
          </div>
          <CopyBtn text={copyText} label={doc.kind === "sheet" ? "Copiar tabela" : "Copiar texto"} ghost />
          <button type="button" className="btn" ref={closeRef} onClick={onClose}>
            Fechar
          </button>
        </header>
        {body}
      </div>
    </div>
  );
}

function Anexos() {
  const { openDoc } = useContext(Ctx);
  const lib = useMemo(buildLibrary, []);
  const groups = [
    ["Modelos de declarações e cartas", "Clique para abrir a pré-visualização, preencher os campos e copiar.", lib.filter((x) => x.kind === "doc")],
    ["Planilhas", "Orçamento e cronograma físico, no formato de planilha.", lib.filter((x) => x.kind === "sheet")],
    ["Anexos e formulários do edital", "Situação de cada anexo citado no edital.", lib.filter((x) => x.kind === "ficha")]
  ];
  return (
    <>
      <p className="lede wide">
        Cada item abre numa pré-visualização, como um documento ou uma planilha. Se a FAPEAL ou o sistema oferecer um modelo próprio, use o oficial.
      </p>
      {groups.map((g) => (
        <section className="card" key={g[0]}>
          <h2>{g[0]}</h2>
          <p className="lede">{g[1]}</p>
          <div className="lib scroll-row">
            {g[2].map((x) => (
              <button type="button" className="libcard" key={x.id} onClick={() => openDoc(x.id)}>
                <span className={"dm-ico " + (x.kind === "sheet" ? "is-sheet" : "is-doc")} aria-hidden="true" />
                <span className="libcard-t">{x.title}</span>
                <span className="libcard-m">
                  <span className={"pill " + x.pillCls}>{x.pill}</span>
                  <Ref>{x.refs}</Ref>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

/* ===== Estrutura: navbar no topo + corpo ===== */

function downloadJson(obj, name) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function App() {
  const initial = useMemo(loadStore, []);
  const [checks, setChecks] = useState(initial.checks || {});
  const [budget, setBudget] = useState(initial.budget || EX_BUDGET);
  const [form, setForm] = useState(initial.form || {});
  const [p, setP] = useState({ cidade: "Maceió", horas: "20" });
  const [doc, setDoc] = useState(null);
  const [menu, setMenu] = useState(false);
  const [askReset, setAskReset] = useState(false);
  const [msg, setMsg] = useState("");
  const menuRef = useRef(null);
  const fileRef = useRef(null);

  const readHash = () => {
    const hs = (location.hash || "").replace("#", "");
    return TABS.some((t) => t[0] === hs) ? hs : "resumo";
  };
  const [tab, setTab] = useState(readHash);
  useEffect(() => {
    const f = () => {
      setTab(readHash());
      try {
        window.scrollTo({ top: 0 });
      } catch (e) {}
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    saveStore({ checks, budget, form });
  }, [checks, budget, form]);
  useEffect(() => {
    try {
      const el = document.getElementById("tab-" + tab);
      if (el) el.scrollIntoView({ inline: "center", block: "nearest" });
    } catch (e) {}
  }, [tab]);
  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
        setAskReset(false);
      }
    };
    const esc = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        setAskReset(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const go = (id) => {
    try {
      if (location.hash === "#" + id) {
        setTab(id);
        window.scrollTo({ top: 0 });
      } else location.hash = id;
    } catch (e) {
      setTab(id);
    }
  };
  const toggle = (id) => setChecks((c) => Object.assign({}, c, { [id]: !c[id] }));
  const openDoc = (id) => {
    const d = buildLibrary().find((x) => x.id === id);
    if (d) setDoc(d);
  };

  const resetAll = () => {
    setChecks({});
    setBudget(EX_BUDGET);
    setForm({});
    setAskReset(false);
    setMenu(false);
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (e) {}
    setMsg("Página redefinida.");
  };
  const exportAll = () => {
    downloadJson({ app: "centelha-al-fase2", v: 1, checks, budget, form }, "centelha-progresso.json");
    setMenu(false);
    setMsg("Progresso exportado.");
  };
  const importAll = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(String(rd.result));
        if (!o || o.app !== "centelha-al-fase2" || typeof o.checks !== "object") throw new Error("formato");
        setChecks(o.checks || {});
        if (Array.isArray(o.budget)) setBudget(o.budget);
        if (o.form && typeof o.form === "object") setForm(o.form);
        setMsg("Progresso importado.");
      } catch (err) {
        setMsg("Arquivo não reconhecido. Use um arquivo exportado por esta página.");
      }
      setMenu(false);
    };
    rd.readAsText(file);
  };
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3600);
    return () => clearTimeout(t);
  }, [msg]);

  const val = (x, l) => (x && String(x).trim() ? String(x).trim() : "[" + l + "]");
  const v = {
    nome: val(p.nome, "NOME"),
    cpf: val(p.cpf, "CPF"),
    funcao: val(p.funcao, "FUNÇÃO"),
    projeto: val(p.projeto, "NOME DO PROJETO"),
    coordenador: val(p.coordenador, "COORDENADOR"),
    empresa: val(p.empresa, "EMPRESA"),
    cnpj: val(p.cnpj, "CNPJ"),
    horas: val(p.horas, "HORAS"),
    cidade: val(p.cidade, "CIDADE"),
    data: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
  };

  const head = TAB_INFO[tab];
  return (
    <Ctx.Provider value={{ checks, toggle, go, openDoc }}>
      <a className="skip" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="topbar glass">
        <a className="tb-brand" href="#resumo" onClick={() => go("resumo")}>
          <span className="brand-dot" aria-hidden="true" />
          <span className="tb-brand-t">
            <strong>Centelha AL</strong>
            <span>Fase 2 · Projeto de Fomento</span>
          </span>
        </a>
        <nav className="tb-nav scroll-x" aria-label="Seções">
          {TABS.map((t) => (
            <a key={t[0]} id={"tab-" + t[0]} href={"#" + t[0]} aria-current={tab === t[0] ? "page" : undefined} className={tab === t[0] ? "on" : ""} onClick={(e) => { e.preventDefault(); go(t[0]); }}>
              {t[1]}
            </a>
          ))}
        </nav>
        <div className="tb-menu" ref={menuRef}>
          <button type="button" className="btn ghost" aria-haspopup="true" aria-expanded={menu} onClick={() => setMenu(!menu)}>
            Opções
          </button>
          {menu ? (
            <div className="menu-pop glass" role="menu">
              <p className="note">As marcações e os textos ficam salvos só neste navegador.</p>
              <button type="button" role="menuitem" className="menu-it" onClick={exportAll}>
                Exportar progresso
              </button>
              <button type="button" role="menuitem" className="menu-it" onClick={() => fileRef.current && fileRef.current.click()}>
                Importar progresso
              </button>
              {askReset ? (
                <div className="reset-row">
                  <span>Apagar marcações, orçamento e formulário?</span>
                  <button type="button" className="btn" onClick={resetAll}>
                    Sim, apagar
                  </button>
                  <button type="button" className="btn ghost" onClick={() => setAskReset(false)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button type="button" role="menuitem" className="menu-it danger" onClick={() => setAskReset(true)}>
                  Redefinir página
                </button>
              )}
            </div>
          ) : null}
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr" tabIndex={-1} onChange={importAll} />
        </div>
      </header>

      <div className="shell">
        {tab === "resumo" ? (
          <Hero />
        ) : (
          <>
            <div className="strip glass">
              <Countdown compact />
              <Progress />
            </div>
            <div className="tabhead">
              <h2>{head[0]}</h2>
              <p>{head[1]}</p>
            </div>
          </>
        )}
        <main className="panel" id="conteudo" tabIndex={-1}>
          {tab === "resumo" && <Resumo />}
          {tab === "plano" && <Plano />}
          {tab === "cronograma" && <Cronograma />}
          {tab === "documentos" && <Documentos />}
          {tab === "anexos" && <Anexos />}
          {tab === "formulario" && <Formulario form={form} setForm={setForm} budget={budget} />}
          {tab === "informacoes" && <Informacoes />}
          {tab === "orcamento" && <Orcamento budget={budget} setBudget={setBudget} />}
          {tab === "organizacao" && <Organizacao />}
        </main>
        <footer className="foot">
          Fonte: Edital FAPEAL nº 06/2026, Programa Centelha 3 Alagoas, 2ª retificação (23/10/2026). Os números entre parênteses são itens do edital. Em caso de divergência, vale o edital (22.8). Material de apoio independente, sem vínculo com a FAPEAL ou com o Programa Centelha.
        </footer>
      </div>
      {doc ? <DocModal doc={doc} onClose={() => setDoc(null)} p={p} setP={setP} v={v} budget={budget} /> : null}
      <div className="toast" role="status" aria-live="polite">
        {msg}
      </div>
    </Ctx.Provider>
  );
}

export default App;
