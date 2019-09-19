import {} from "constants/ActionTypes";
import { MUDAR_TIPO } from "constants/MenuActionTypes";

const INITIAL_STATE = {
  tipo: "put"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_TIPO:
      return { ...state, tipo: action.payload };
    default:
      return state;
  }
};
