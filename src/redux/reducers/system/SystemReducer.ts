import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
  actionType,
} from "constants/ActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";
import SystemState from "types/system/SystemState";
import Action from "types/Action";
import { Token, Account } from "types/system/system";

// var boxes: BoxProps[] = [
//   {
//     id: 1,
//     buy: 2.5,
//     sell: 2.6,
//     quote: 24.57,
//     min: 0,
//     max: 3.6,
//     dayOscilation: -0.54,
//     book: {
//       buy: [
//         {
//           qtty: 43300,
//           price: 26.71,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//       ],
//       sell: [
//         {
//           qtty: 43300,
//           price: 26.71,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//       ],
//     },
//     codes: [
//       { symbol: "BRZU", type: "buy", qtty: 100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//     ],
//   },
//   {
//     id: 2,
//     buy: 2.5,
//     sell: 2.6,
//     quote: 24.57,
//     min: 0,
//     max: 3.6,
//     dayOscilation: -0.54,
//     book: {
//       buy: [
//         {
//           qtty: 43300,
//           price: 26.71,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//       ],
//       sell: [
//         {
//           qtty: 43300,
//           price: 26.71,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//       ],
//     },
//     codes: [
//       { symbol: "BRZU", type: "buy", qtty: 100 },
//       { symbol: "BRZU", type: "buy", qtty: 100 },
//       { symbol: "BRZU", type: "buy", qtty: 100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//     ],
//   },
//   {
//     id: 3,
//     buy: 2.5,
//     sell: 2.6,
//     quote: 24.57,
//     min: 0,
//     max: 3.6,
//     dayOscilation: 21.54,
//     book: {
//       buy: [
//         {
//           qtty: 43300,
//           price: 26.71,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//       ],
//       sell: [
//         {
//           qtty: 43300,
//           price: 26.71,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//         {
//           qtty: 9800,
//           price: 26.7,
//         },
//       ],
//     },
//     codes: [
//       { symbol: "BRZU", type: "buy", qtty: 100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//       { symbol: "GDX", type: "sell", qtty: -100 },
//     ],
//   },
// ];

export const INITIAL_STATE: SystemState = {
  connectedUser: "",
  isOpenLeftUserMenu: false,
  isLogged: false,
  liquidValue: "15.000,00",
  buyingValue: "3.500,00",
  broker: "Bender",
  isOpenOrdersHoverMenu: false,
  isOpenOrdersExec: false,
  isOpenDetailedReport: false,
  isOpenPosition: false,
  isOpenMultileg: false,
  isOpenTHL: false,
  isOpenRightSideMenu: false,
  isOpenCategoryList: false,
  token: {} as Token,
  accounts: [],
  selectedAccount: {} as Account,
  mainTabs: [{ tabName: "Principal" }, { tabName: "Aba 2" }],
  selectedTab: "tab0",
  openedMenus: [
    // { menuKey: "category_list", tabKey: "tab0" },
    // { menuKey: "box1", tabKey: "tab0" },
    // { menuKey: "box2", tabKey: "tab0" },
    // { menuKey: "box3", tabKey: "tab1" },
  ],
  quoteBoxes: [],
  boxesVisibility: [
    // { boxKey: "box1", visibility: true },
    // { boxKey: "box2", visibility: false },
    // { boxKey: "box3", visibility: true },
  ],

  // inputUsuario: "gabrielAB",
  // inputSenha: "123456789",
  // nomeCadastro: "",
  // usernameCadastro: "",
  // emailCadastro: "",
  // senhaCadastro: "",
  esource_box: null,
  interval_box: null,
  activeItemRightSideMenu: "ALERTAS",
  multilegButtonsVisibility: true,
  createAlertButtonVisibility: false,
  updateMode: "reactive",
  updateInterval: 3000,
  isLeftSideMenuConfigOpen: false,
};

const {
  RESET_REDUX_STATE,
  UPDATE_ONE_SYSTEM_STATE,
  UPDATE_MANY_SYSTEM_STATE,
} = actionType;

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): SystemState => {
  switch (type) {
    case ABRIR_FECHAR_MENU_LATERAL:
      return { ...state, isOpenLeftUserMenu: payload };
    case LOGAR_DESLOGAR_USUARIO:
      return {
        // ...resetarEstadoRedux(state, INITIAL_STATE, [], !payload.isLogged),
        ...state,
        ...payload,
      };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return { ...state, [payload.name]: payload.valor };
    case MUDAR_DADOS_LOGIN:
      return { ...state, [payload.nomeVariavel]: payload.valor };

    case UPDATE_ONE_SYSTEM_STATE:
      const { attributeName, attributeValue } = payload;
      return { ...state, [attributeName]: attributeValue };
    case UPDATE_MANY_SYSTEM_STATE:
      return { ...state, ...payload };
    case RESET_REDUX_STATE:
      if (["deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux({
            state,
            initialState: INITIAL_STATE,
            omitions: [
              "isOpenOrdersExec",
              "isOpenDetailedReport",
              "isOpenPosition",
              "isOpenMultileg",
              "isOpenTHL",
            ],
            reducerName: "telaprincipal",
            shouldClearAllProps: false,
          }),
        };
      else return state;
    default:
      return state;
  }
};
