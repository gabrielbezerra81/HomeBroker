import Action from "types/Action";
import { UPDATE_CATEGORY_LIST_STATE } from "./actions/actionsTypes";
import { CategoryListState } from "../types/CategoryListState";

const INITIAL_STATE: CategoryListState = {
  categories: [],
  symbolsData: [],
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): CategoryListState => {
  switch (type) {
    case UPDATE_CATEGORY_LIST_STATE:
      return { ...state, ...payload };
    default:
      return state;
  }
};
