import {
  MUDAR_VARIAVEL_THL,
  MUDAR_VARIAVEIS_THL,
} from "constants/MenuActionTypes";

export const updateOneTHLState = ({ attributeName, attributeValue }) => {
  return {
    type: MUDAR_VARIAVEL_THL,
    payload: { attributeName, attributeValue },
  };
};

export const updateManyTHLState = (payload) => {
  return {
    type: MUDAR_VARIAVEIS_THL,
    payload,
  };
};
