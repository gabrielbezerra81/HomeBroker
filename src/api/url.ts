// export const cors_anywhere = "https://cors-anywhere.herokuapp.com/";
export const url_base = "https://api.rendacontinua.com/api/"; //"http://173.249.37.183:8080/api/";
export const url_base_reativa = "http://62.171.190.108:8090/"; //"https://quotes.rendacontinua.com/";
export const url_base_proactive = "https://rcv.rendacontinua.com/";

//Boletas de compra e venda
export const url_pesquisarAtivoBoletas_codigo = "price/quotes/";
export const url_enviarOrdem = "order/list";

//Book de ofertas
export const url_listarBookOfertas_codigo = "book/";

//Ordens em execução
export const url_listarOrdensExecucao_ = "order/working";
export const url_cancelarOrdemExec_id = "order/cancel/";
export const url_finalizarAMercado_id = "order/market/";
export const url_aumentarQtde_id_qtde = "order/qtty/";
export const url_aumentarPreco_id_valor = "order/price/";

//Multileg
export const url_pesquisarOpcoesVencimentos_codigo =
  "stocks/options/expirations/";
export const url_pesquisarStrikesVencimentos_codigo =
  "stocks/strikes/expirations/";
export const url_pesquisarStrikes_codigo_vencimento =
  "stocks/findBySymbolAndEndDate/";
export const url_criarPosicaoMultileg_ = "position/list";
export const url_criarAlertaOperacao_param_operator = "advice/by-order/";
export const url_addQuoteBox_groupName = "favorite/by-order/";

//Posição
export const url_listarPosicoes = "position";

//Reativos
export const url_cotacaoReativa_codigos = "quotes?subjects=";
export const url_bookReativo_codigos = "books/symbols?symbols=";
export const url_emblemaReativo_ids = "structures?subjects="; //Id estrutura
export const url_ordensExecReativas_idUser = "orders/user/";
export const url_posicaoReativa_idUser = "position/user/";

//Monitorar e adicionar
export const url_monitorarAtivo_codigo = "price/add/";
export const url_listarAtivosMonitorados_ = "mt5/symbols";

//Login
export const url_realizarLogin_usuario_senha = "auth/signin";
export const url_autenticacao_token = "test/user";
// export const url_informacoesUsuario_token = "auth/info";
// export const url_listarContas_token = "account/login";
export const url_verificarToken_token = "auth/";
export const url_getAccounts = "account/login";

//Cadastro
export const url_realizarCadastro_dados = "auth/signup";

//THL
export const url_pesquisarListaStrike_codigo = "stocks/strikes/integer/";
export const url_listarTabelaInicialTHL_ativo_strike_tipo =
  "structure/thl/list/";
export const url_atualizarPrecosTHL_ids = "structures?subjects=";
export const url_recalcularPrecos_acao_ativo_strike_tipo = "structure/thl/ids/";
export const url_criarAlertaTHL_boolMontagem_ = "advice/structure/";
export const url_favoritarTHL_ = "favorite";
export const url_pesquisarCombinacoes_ativo = "structure/list/ /CalendarLine";

export const url_listarAlertas = "advice/working";

// Proactive
export const url_singleQuote_quote = "quotes/";
export const url_multiQuote_quotes = "quotes/symbols?symbols=";
export const url_singleStructure_id = "structures/";
export const url_multiStructure_ids = "structures/ids?ids=";
export const url_ordersExec_ids = "order/working/ids?ids=";
export const url_multiBookOneLine_symbols = "quotes/bookline/symbols?symbols=";

// Symbol
export const url_stockInfo_symbol = "stocks/info/";

// Matriz de opções
export const url_optionsTable_symbol_type = "structure/thl/matrix/";

// Box
export const url_box = "favorite";
export const url_updateBoxConfig_id = "favorite/config/";
export const url_listPositionBox = "position2";
export const url_createPositionBox = "position2/list";
export const url_createBoxAlert = "advice";

// Lista de categorias
export const url_updateCategoryTitle_title_ids = "favorite/groups/";
export const url_deleteCategories_ids = "favorite/list?ids=";

// Planejador financeiro
export const url_saveSimulation ="projections/user"