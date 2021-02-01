import MultiBoxState from "types/multiBox/MultiBoxState";
import Action from "types/Action";
import {
  UPDATE_ONE_MULTIBOX,
  UPDATE_MANY_MULTIBOX,
} from "constants/MenuActionTypes";

const INITIAL_STATE: MultiBoxState = {
  boxes: [],
  boxesTab1Data: [],
  esource_multiBox: null,
  interval_multiBox: null,
};

export default (
  state = INITIAL_STATE,
  { payload, type }: Action,
): MultiBoxState => {
  switch (type) {
    case UPDATE_ONE_MULTIBOX:
      const { attributeName, attributeValue } = payload;
      return { ...state, [attributeName]: attributeValue };
    case UPDATE_MANY_MULTIBOX:
      return { ...state, ...payload };
    default:
      return state;
  }
};

// {
//   id: "asdasd12312312",
//   activeTab: "5",
//   minimized: false,
//   //tab5
//   symbolInput: "PETR4",
//   searchedSymbol: "",
//   stockSymbol: "",
//   stockOptions: [],
//   expirations: [],
//   selectedStrike: 0,
//   selectedExpiration: "",
//   boxOffers: [],
//   strikeViewMode: "strike",
//   topSymbols: [],
//   tab1Id: -1,
//   //tab5
// },
