import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { BoletasState } from "redux/reducers";
import { MainStoreState } from "redux/StoreCreation";

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
