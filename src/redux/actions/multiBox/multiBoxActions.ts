import { getSymbolInfoAPI } from "api/symbolAPI";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";
import produce from "immer";
import MultiBoxState, { MultiBoxData } from "types/multiBox/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";

export const updateManyMultiBoxAction = (
  payload: Partial<MultiBoxState>,
): MainThunkAction => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_MANY_MULTIBOX,
      payload,
    });
  };
};

export const updateBoxAttrAction = (
  id: string,
  payload: Partial<MultiBoxData>,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const updatedBoxes = produce(boxes, (draft) => {
      const index = draft.findIndex((box) => box.id === id);

      if (index !== -1) {
        Object.assign(draft[index], payload);
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};

export const getSymbolToolTipInfoAction = (symbol: string): MainThunkAction => {
  return async (dispatch) => {};
};

/*

           “Descrição”: “nome do atributo do json” 
Empresa: corporationName  
Mercado: market
Ativo: symbol +  specificationCode
Tipo: type
Modelo: model
Strike: strike
Vencimento: endBusiness


*/
