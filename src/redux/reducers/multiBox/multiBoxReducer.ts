import MultiBoxState from "types/multiBox/MultiBoxState";
import Action from "types/Action";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";

const INITIAL_STATE: MultiBoxState = {
  boxes: [{ id: "asdasd12312312", activeTab: "4", minimized: false }],
  strikeViewMode: "strike",
};

export default (
  state = INITIAL_STATE,
  { payload, type }: Action,
): MultiBoxState => {
  switch (type) {
    case UPDATE_MANY_MULTIBOX:
      return { ...state, ...payload };
    default:
      return state;
  }
};
