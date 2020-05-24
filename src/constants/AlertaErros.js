export const VALIDACAO_QTDE = "A quantidade deve ser um múltiplo de 100";
export const ALERTA_COMPRA =
  "É recomendado que o preço de Execução seja maior que o preço de disparo para melhorar a chance da oferta ser executada";
export const ALERTA_VENDA =
  "É recomendado que o preço de Execução seja menor que o preço de disparo para melhorar a chance da oferta ser executada";

// Alertas API
export const erro_pesquisar_ativo = "Falha ao pesquisar ativo";
export const sucesso_enviar_ordem = "Ordem enviada com sucesso";
export const erro_enviar_ordem = "Falha ao enviar ordem";
export const sucesso_criar_alerta = "Alerta criado com sucesso";
export const erro_criar_alerta = "Falha ao criar alerta";
export const sucesso_criar_posicao = "Posição criada com sucesso";
export const erro_criar_posicao = "Falha ao criar posição";
export const sucesso_cancelar_ordem = "Ordem cancelada com sucesso";
export const erro_cancelar_ordem = "Falha ao cancelar ordem";
export const sucesso_finalizar_a_mercado = "Ordem finalizada com sucesso";
export const erro_finalizar_a_mercado = "Falha ao finalizar ordem";
export const sucesso_modificar_ordemExec = "Ordem modificada com sucesso";
export const erro_modificar_ordemExec = "Falha ao modificar ordem";
export const erro_realizar_login = "Falha ao fazer login";
export const erro_realizar_cadastro = "Falha ao fazer cadastro de usuário";
export const erro_listarBook = "Falha ao listar book de ofertas";
export const erro_listarTHL_thl = "Falha ao listar dados";
export const erro_pesquisarCombinacoes_thl = "Falha ao exibir combinações das travas de linha"
export const erro_favoritar_thl = "Falha ao tentar adicionar aos favoritos"
export const sucesso_favoritar_thl = ""

// Alertas Validação

export const erro_validar_ativo = "Ordem inválida, pesquise um ativo";
export const erro_validar_qtde =
  "Ordem inválida, a quantidade deve ser maior que 0";
export const erro_validar_disparo_start_movel =
  "O disparo móvel deve ser menor que o disparo stop";
export const erro_validar_codigo_duplicado_multileg =
  "Ativos duplicados na ordem";
export const erro_validar_contaSelecionada =
  "É preciso selecionar uma conta para enviar ordens";
export const erro_selecaoBook_THL =
  "Limite de seleção de ofertas excedido. Para selecionar este item é necessário remover a seleção de outro item";

// Alertas
export const erro_exportar_ordens_multileg = "Falha ao abrir ordem na Multileg";
export const erro_opcoes_ordens_exec = "Selecione uma ordem";
export const erro_timeout = "Não foi possível se conectar ao servidor remoto";
export const erro_sessaoExpirada = "Sessão expirada, faça login novamente.";

// Avisos
export const aviso_calculo_preco_multileg =
  "Book vazio! Cálculo feito com o preço do últ. negócio";
