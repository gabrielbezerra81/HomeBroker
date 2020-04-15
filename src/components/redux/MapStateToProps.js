export const mapStateToPropsEnvioOrdem = (state) => ({
  token: state.telaPrincipalReducer.token,
  conta: state.telaPrincipalReducer.conta,
  contaSelecionada: state.telaPrincipalReducer.contaSelecionada,
});
