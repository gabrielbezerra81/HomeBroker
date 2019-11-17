export const cors_anywhere = "https://cors-anywhere.herokuapp.com/";
export const url_base = "http://173.249.37.183:8080/api/";
export const url_base_reativa = "http://173.249.37.183:8090/"

//Boletas de compra e venda
export const url_pesquisarAtivoBoletas_codigo = "price/quote/";
export const url_enviarOrdem = "order/list";

//Book de ofertas
export const url_listarBookOfertas_codigo = "book/";

//Ordens em execução
export const url_listarOrdensExecucao_ = "order/working";
export const url_cancelarOrdemExec_id = "order/cancel/"
export const url_finalizarAMercado_id = "order/market/"
export const url_aumentarQtde_id_qtde = "order/qtty/"
export const url_aumentarPreco_id_valor = "order/price/"

//Multileg
export const url_pesquisarOpcoesVencimentos_codigo = "stocks/options/expirations/";
export const url_pesquisarStrikesVencimentos_codigo =  "stocks/strikes/expirations/"
export const url_pesquisarStrikes_codigo_vencimento = "stocks/findBySymbolAndEndDate/"
export const url_criarPosicaoMultileg_ = "position/list"
export const url_criarAlertaOperacao_ = "advice/list"

//Posição
export const url_listarPosicoes = "position"

//Reativos
export const url_cotacaoReativa_codigos = "quotes/symbols?symbols="
export const url_bookReativo_codigos = "books/symbols?symbols="
export const url_emblemaReativo_ids = "structures/ids?ids="

//Monitorar e adicionar
export const url_monitorarAtivo_codigo = "price/add/"
export const url_listarAtivosMonitorados_ = "mt5/symbols"

//Login
export const url_realizarLogin_usuario_senha = "auth/signin"
export const url_autenticacao_token = "test/user"
export const url_informacoesUsuario_token = "auth/info"

//Cadastro 
export const url_realizarCadastro_dados = "auth/signup"