import MultiBoxState from "types/multiBox/MultiBoxState";
import Action from "types/Action";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";

const INITIAL_STATE: MultiBoxState = {
  boxes: [
    {
      id: "asdasd12312312",
      activeTab: "5",
      minimized: false,
      //tab5
      symbolInput: "PETR4",
      searchedSymbol: "",
      stockOptions: [],
      expirations: [],
      selectedStrike: 0,
      selectedExpiration: "",
      boxOffers: [],
      strikeViewMode: "strike",
      //tab5
    },
  ],
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
