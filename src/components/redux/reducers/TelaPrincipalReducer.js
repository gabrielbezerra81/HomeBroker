const INITIAL_STATE = {
  usuarioConectado: "Gabriel Alencar",
  menuLateralAberto: true,
  logado: true,
  valorLiquido: "15.000,00",
  valorComprar: "3.000,00",
  ativo: "Bender"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
