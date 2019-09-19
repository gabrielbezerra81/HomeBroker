import { MUDAR_TIPO } from "constants/MenuActionTypes";

export const mudarTipoAction = tipo => {
  return dispatch => {
    let novo_tipo = "";

    if (tipo === "call") novo_tipo = "put";
    else if (tipo === "put") novo_tipo = "call";

    dispatch({
      type: MUDAR_TIPO,
      payload: novo_tipo
    });
  };
};
