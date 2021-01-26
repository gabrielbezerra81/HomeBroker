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

export const updateMultiBoxAction = (
  multiBox: Partial<MultiBoxData>,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const updatedBoxes = produce(boxes, (draft) => {
      const index = draft.findIndex((box) => box.id === multiBox.id);

      if (index !== -1) {
        Object.assign(draft[index], multiBox);
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};
