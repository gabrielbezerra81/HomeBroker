import { ABRIR_FECHAR_MENU_LATERAL } from "constants/ActionTypes";

export const abrirFecharMenuLateralAction = (event, menuLateralAberto) => {
  return dispatch => {
    if (menuLateralAberto)
      dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: false });
    else dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: true });
  };
};
