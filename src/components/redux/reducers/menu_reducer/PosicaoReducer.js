import {} from "constants/MenuActionTypes";

const INITIAL_STATE = {
  ordenacao: "",
  tipoVisualizacao: "lista"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
