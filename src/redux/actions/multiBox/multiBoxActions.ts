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
        if (payload.boxOffers) {
          payload.boxOffers.forEach((offer) => {
            draft[index].boxOffers.push(offer);
          });
        } //
        else {
          delete payload.boxOffers;
          Object.assign(draft[index], payload);
        }
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};
