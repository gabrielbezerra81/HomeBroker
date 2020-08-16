import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { MainStoreState, BoletasState } from "redux/reducers";

export type GlobalThunkAction = ThunkAction<
  void,
  { state: string },
  unknown,
  Action<string>
>;

export type MainThunkAction = ThunkAction<
  void,
  MainStoreState,
  unknown,
  Action<string>
>;

export type MainThunkDispatch = ThunkDispatch<
  MainStoreState,
  unknown,
  Action<string>
>;

export type BoletasThunkAction = ThunkAction<
  void,
  BoletasState,
  unknown,
  Action<string>
>;
