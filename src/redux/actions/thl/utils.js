import { MUDAR_VARIAVEL_THL, MUDAR_VARIAVEIS_THL } from "constants/MenuActionTypes";

export const mudarVariavelTHL = ({ nome, valor }) => {
  return {
    type: MUDAR_VARIAVEL_THL,
    payload: { nome, valor },
  };
};

export const mudarVariaveisTHL = (payload) => {
  return {
    type: MUDAR_VARIAVEIS_THL,
    payload,
  };
};
