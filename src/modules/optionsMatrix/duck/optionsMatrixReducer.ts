import { UPDATE_STATE_OPTIONS_MATRIX } from "constants/MenuActionTypes";
import Action from "types/Action";
import OptionsMatrixState from "../types/OptionsMatrixState";

const INITIAL_STATE: OptionsMatrixState = {
  options: [],
  checkedSymbols: [],
  symbolsToUpdate: [],
  stockSymbolId: null,
  checkIntersection: true,
  checkedColumns: [],
  checkedLines: [],
};

export default function (
  state = INITIAL_STATE,
  { type, payload }: Action,
): OptionsMatrixState {
  switch (type) {
    case UPDATE_STATE_OPTIONS_MATRIX:
      return { ...state, ...payload };

    default:
      return state;
  }
}
