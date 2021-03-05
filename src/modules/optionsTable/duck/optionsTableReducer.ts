import { UPDATE_STATE_OPTIONS_TABLE } from "constants/MenuActionTypes";
import Action from "types/Action";
import OptionsTableState from "../types/OptionsTableState";

const INITIAL_STATE: OptionsTableState = {
  options: [],
  checkedItems: ["10.5", "11.5"],
  symbolsToUpdate: [],
  stockSymbolId: null,
};

export default function (
  state = INITIAL_STATE,
  { type, payload }: Action,
): OptionsTableState {
  switch (type) {
    case UPDATE_STATE_OPTIONS_TABLE:
      return { ...state, ...payload };

    default:
      return state;
  }
}
