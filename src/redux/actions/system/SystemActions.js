import produce from "immer";
import _ from "lodash";
import qs from "qs";

import {
  ABRIR_FECHAR_MENU_LATERAL,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
  actionType,
} from "constants/ActionTypes";
import { setPointerWhileAwaiting } from "api/API";
import { realizarLoginAPI, realizarCadastroAPI } from "api/LoginAPI";
import { navigate } from "@reach/router";
import { globalStore, persistor } from "redux/StoreCreation";
import api from "api/apiConfig";

import { INITIAL_STATE as initialSystemState } from "../../reducers/system/SystemReducer";
import { handleDeleteBoxAction } from "modules/multiBox/duck/actions/multiBoxActions";
import { fecharFormAction } from "../GlobalAppActions";
import axios from "axios";
import { clearIntervalAsync } from "set-interval-async/dynamic";

const waitDispatch = 1000;

// const redirectURL =
//   // eslint-disable-next-line no-restricted-globals
//   location.hostname === "localhost"
//     ? "http://localhost:3000/"
//     : "https://homebroker-react.herokuapp.com/";

export const updateOneSystemStateAction = (attributeName, attributeValue) => {
  return (dispatch) => {
    dispatch({
      type: actionType.UPDATE_ONE_SYSTEM_STATE,
      payload: { attributeName, attributeValue },
    });
  };
};

export const updateManySystemState = (payload) => {
  return {
    type: actionType.UPDATE_MANY_SYSTEM_STATE,
    payload,
  };
};

export const abrirFecharMenuLateralAction = (isOpenLeftUserMenu) => {
  return (dispatch) => {
    dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: isOpenLeftUserMenu });
  };
};

export const logarUsuarioAction = (email, senha) => {
  return async (dispatch, getState) => {
    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "botaoLogar",
      parentID: "body",
    });

    const data = await realizarLoginAPI(email, senha);
    //const auth = await autenticacaoTokenAPI();

    if (data) {
      const { accessToken, tokenType, accounts, nickName } = data;

      api.defaults.headers.authorization = `${tokenType} ${accessToken}`;

      dispatch(
        updateManySystemState({
          token: { accessToken, tokenType },
          connectedUser: nickName,
          isLogged: true,
          accounts,
          selectedAccount: accounts[0],
        }),
      );

      navigate("/home");
    }

    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "botaoLogar",
      parentID: "body",
    });
  };
};

export const cadastrarUsuarioAction = (data) => {
  return async (dispatch) => {
    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "botaoCadastrar",
      parentID: "body",
    });
    const role = ["ROLE_USER"];

    const { name, username, email, password } = data;

    const retornoCadastro = await realizarCadastroAPI({
      name,
      username,
      email,
      role,
      password,
    });

    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "botaoCadastrar",
      parentID: "body",
    });
    if (retornoCadastro) {
      navigate("/");
    }
  };
};

export const deslogarUsuarioAction = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        systemReducer: { authData },
      } = state;
      const combinedMainStore = combineMainStoreStateFromReducers(state);

      await axios.post(
        "https://auth.rendacontinua.com/auth/realms/auth_sso/protocol/openid-connect/logout",
        qs.stringify({
          client_id: "homebroker-react",
          refresh_token: authData?.refresh_token,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      dispatch(
        updateManySystemState({
          authData: null,
        }),
      );

      dispatch(clearReduxStateFromStorageAction(combinedMainStore));
    } catch (error) {
      console.log("error when wiping redux data", error.response);
    }
  };
};

export const abrirItemBarraLateralAction = (
  nameVariavelReducer,
  forceVisibility = null,
  mainTabOnly = true,
) => {
  return (dispatch, getState) => {
    const { selectedTab, openedMenus, ...props } = getState().systemReducer;

    const isVisible = props[nameVariavelReducer];
    let updatedVisibility = !isVisible;

    // Se estiver tentar abrir um popup fora da aba principal e ele já estiver aberto,
    // impede que ele seja fechado e redireciona para a aba principal
    const isTryingToOpenFromSecondaryTab = selectedTab !== "tab0";
    const isOpeningMultileg = [
      "isOpenMultileg",
      "isOpenConditionalMultileg",
    ].includes(nameVariavelReducer);

    if (isTryingToOpenFromSecondaryTab && !isOpeningMultileg && mainTabOnly) {
      dispatch(
        updateManySystemState({
          selectedTab: "tab0",
          [nameVariavelReducer]: true,
        }),
      );
      return;
    } //

    // Traz a multileg para a aba atual se estiver tentando abrir com ele já aberto em outra aba
    if (isOpeningMultileg && isVisible) {
      let multilegKey = "multileg";

      if (nameVariavelReducer === "isOpenConditionalMultileg") {
        multilegKey = "conditionalMultileg";
      }

      const multilegIndex = openedMenus.findIndex(
        (openedMenuItem) => openedMenuItem.menuKey === multilegKey,
      );

      if (
        multilegIndex !== -1 &&
        openedMenus[multilegIndex].tabKey !== selectedTab
      ) {
        const updatedOpenedMenus = produce(openedMenus, (draft) => {
          draft[multilegIndex].tabKey = selectedTab;
        });

        dispatch(
          updateManySystemState({
            openedMenus: updatedOpenedMenus,
            [nameVariavelReducer]: true,
          }),
        );

        return;
      }
    }

    let updateOpenedMenus = handleCloseMenusInMainTab({
      isOpenAttribute: nameVariavelReducer,
      visibility: updatedVisibility,
      openedMenus,
    });

    if (forceVisibility === true || forceVisibility === false) {
      // Se estiver querendo manter o estado atual de visibilidade, não precisa alterar.
      if (forceVisibility === isVisible) {
        updateOpenedMenus = openedMenus;
      }

      updatedVisibility = forceVisibility;
    }

    dispatch(
      updateManySystemState({
        [nameVariavelReducer]: updatedVisibility,
        openedMenus: updateOpenedMenus,
      }),
    );

    resetarDadosReducerAction({
      dispatch,
      nameVariavelReducer,
      visibilidadeMenu: updatedVisibility,
    });
  };
};

export const mouseOverAction = (nameVariavelReducer) => {
  return (dispatch) => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: true },
    });
  };
};

export const mouseLeaveAction = (nameVariavelReducer) => {
  return (dispatch) => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: false },
    });
  };
};

export const mudarDadosLoginAction = (nomeVariavel, valor) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_DADOS_LOGIN,
      payload: { nomeVariavel: nomeVariavel, valor: valor },
    });
  };
};

const resetarDadosReducerAction = ({
  nameVariavelReducer,
  dispatch,
  visibilidadeMenu,
}) => {
  let limparReducer = true;
  // Não reseta os estados de Ordens em execução e da posição ao fechar o popup
  if (["isOpenOrdersExec", "isOpenPosition"].includes(nameVariavelReducer))
    limparReducer = false;

  const timer = nameVariavelReducer === "isOpenMultileg" ? 0 : waitDispatch;

  if (!visibilidadeMenu)
    setTimeout(() => {
      dispatch({
        type: actionType.RESET_REDUX_STATE,
        payload: { name: nameVariavelReducer, limparReducer },
      });
    }, timer);
};

export const handleOpenMenusInMainScreenTabsAction = (
  menuChildren,
  tabKey = "tab0",
) => {
  return (dispatch, getState) => {
    const { openedMenus } = getState().systemReducer;

    const updatedOpenedMenus = produce(openedMenus, (draft) => {
      menuChildren.forEach((menuChildItem) => {
        const menuIndex = draft.findIndex(
          (menuItem) => menuItem.menuKey === menuChildItem.key,
        );
        if (menuChildItem.isOpen) {
          if (menuIndex === -1) {
            draft.push({
              menuKey: menuChildItem.key,
              tabKey,
            });
          }
        }
      });
    });

    dispatch(updateOneSystemStateAction("openedMenus", updatedOpenedMenus));
  };
};

export const handleCloseMenusAction = ({ isOpenAttribute, visibility }) => {
  return (dispatch, getState) => {
    const {
      systemReducer: { openedMenus },
    } = getState();

    const updatedOpenedMenus = handleCloseMenusInMainTab({
      openedMenus,
      isOpenAttribute,
      visibility,
    });

    dispatch(updateOneSystemStateAction("openedMenus", updatedOpenedMenus));
  };
};

const handleCloseMenusInMainTab = ({
  isOpenAttribute,
  visibility,
  openedMenus,
}) => {
  if (!visibility) {
    let menuKey = "";

    switch (isOpenAttribute) {
      case "isOpenOrdersExec":
        menuKey = "ordens_execucao";
        break;
      case "isOpenDetailedReport":
        menuKey = "relatorio_detalhado";
        break;
      case "isOpenPosition":
        menuKey = "posicao_custodia";
        break;
      case "isOpenMultileg":
        menuKey = "multileg";
        break;
      case "isOpenTHL":
        menuKey = "thl";
        break;
      case "isOpenOptionsMatrix":
        menuKey = "optionsMatrix";
        break;
      case "isOpenCategoryList":
        menuKey = "category_list";
        break;
      case "isOpenInitialPlanner":
        menuKey = "initialPlanner";
        break;
      case "isOpenDetailedPlanner":
        menuKey = "detailedPlanner";
        break;
      case "isOpenConditionalMultileg":
        menuKey = "conditionalMultileg";
        break;
      default:
        menuKey = isOpenAttribute;
        break;
    }

    const updatedOpenedMenus = produce(openedMenus, (draft) => {
      const filtered = draft.filter(
        (openedMenuItem) => openedMenuItem.menuKey !== menuKey,
      );

      return filtered;
    });

    return updatedOpenedMenus;
  }

  return openedMenus;
};

export const handleAddOrSelectTabAction = (eventKey) => {
  return (dispatch, getState) => {
    const { mainTabs } = getState().systemReducer;

    if (eventKey === "addTab") {
      if (mainTabs.length < 11) {
        const updatedMainTabs = produce(mainTabs, (draft) => {
          draft.push({ tabName: `Aba ${draft.length + 1}` });
        });

        dispatch(
          updateManySystemState({
            mainTabs: updatedMainTabs,
            selectedTab: `tab${updatedMainTabs.length - 1}`,
          }),
        );
      }
    } //
    else {
      dispatch(updateOneSystemStateAction("selectedTab", eventKey));
    }
  };
};

export const handleRemoveTabAction = (tabIndex) => {
  return async (dispatch, getState) => {
    const { mainTabs, openedMenus, selectedTab } = getState().systemReducer;

    const {
      GlobalReducer: { show: boletasVisibility },
    } = globalStore.getState();

    const updatedMainTabs = produce(mainTabs, (draft) => {
      draft.splice(tabIndex, 1);
    });

    const openedMenusToRemove = openedMenus
      .filter((item) => item.tabKey === selectedTab)
      .map((item) => item.menuKey);

    const boxesToRemove = [];
    let otherPopupsToRemove = [];
    const boletasToRemove = []; // compra_mercado0, book0

    openedMenusToRemove.forEach((menuKey) => {
      if (menuKey.includes("multiBox")) {
        boxesToRemove.push(menuKey.replace("multiBox", ""));
      } //
      else if (
        [
          "multileg",
          "optionsMatrix",
          "category_list",
          "conditionalMultileg",
        ].includes(menuKey)
      ) {
        otherPopupsToRemove.push(menuKey);
      } //
      else {
        boletasToRemove.push(menuKey);
      }
    });

    otherPopupsToRemove = otherPopupsToRemove.map((menuKey) => {
      switch (menuKey) {
        case "multileg":
          return "isOpenMultileg";
        case "conditionalMultileg":
          return "isOpenConditionalMultileg";
        case "optionsMatrix":
          return "isOpenOptionsMatrix";
        case "category_list":
          return "isOpenCategoryList";
        default:
          return "";
      }
    });

    otherPopupsToRemove.forEach((isOpenAttrKey) => {
      dispatch(abrirItemBarraLateralAction(isOpenAttrKey, null, false));
    });

    if (boxesToRemove.length > 0) {
      Promise.all(
        boxesToRemove.map(async (boxId) => {
          await dispatch(handleDeleteBoxAction(boxId));
        }),
      );
    }

    boletasToRemove.forEach((boletaKey) => {
      const boletaName = boletaKey.substr(0, boletaKey.length - 1);
      const appKey = boletaKey.substr(boletaKey.length - 1);

      globalStore.dispatch(
        fecharFormAction(boletasVisibility, boletaName, appKey),
      );
    });

    dispatch(
      updateManySystemState({
        mainTabs: updatedMainTabs,
        selectedTab: `tab${tabIndex - 1}`,
      }),
    );
  };
};

export const handleChangeTabPropsAction = ({
  tabIndex,
  attributeName,
  attributeValue,
}) => {
  return (dispatch, getState) => {
    const { mainTabs } = getState().systemReducer;

    const updatedMainTabs = produce(mainTabs, (draft) => {
      draft[tabIndex][attributeName] = attributeValue;
    });

    dispatch(updateOneSystemStateAction("mainTabs", updatedMainTabs));
  };
};

export const clearReduxStateFromStorageAction = (props) => {
  return async (dispatch) => {
    await persistor.purge();

    Object.keys(props).forEach((key) => {
      if (props[key]) {
        if (key.toLowerCase().includes("esource") && props[key].close) {
          props[key].close();
        } //
        else if (key.toLowerCase().includes("interval")) {
          if (Number.isInteger(props[key])) {
            clearInterval(props[key]);
          } //
          else {
            clearIntervalAsync(props[key]);
          }
        }
      }
    });

    dispatch(
      updateManySystemState({
        connectedUser: "",
        isLogged: false,
      }),
    );

    resetarDadosReducerAction({
      nameVariavelReducer: "deslogar",
      dispatch,
      visibilidadeMenu: false,
    });
  };
};

export const checkIfSystemStateHasChangedShapeAction = () => {
  return (dispatch, getState) => {
    const { systemReducer, ...reducers } = getState();

    const currentSystemKeys = Object.keys(systemReducer);
    const expectedSystemKeys = Object.keys(initialSystemState);

    const differenceBetweenStates = _.difference(
      expectedSystemKeys,
      currentSystemKeys,
    );

    if (differenceBetweenStates.length > 0) {
      const combinedMainStore = combineMainStoreStateFromReducers(reducers);
      dispatch(clearReduxStateFromStorageAction(combinedMainStore));
    }
  };
};

const combineMainStoreStateFromReducers = (reducers) => {
  const combinedMainStoreState = {};

  Object.keys(reducers).forEach((key) => {
    Object.assign(combinedMainStoreState, reducers[key]);
  });

  return combinedMainStoreState;
};

export const sendMultilegToCurrentTabAction = () => {
  return (dispatch, getState) => {
    const {
      systemReducer: { selectedTab, openedMenus, isOpenMultileg },
    } = getState();

    if (isOpenMultileg) {
      const updatedMenus = produce(openedMenus, (draft) => {
        const menuItem = draft.find((item) => item.menuKey === "multileg");

        if (menuItem) {
          menuItem.tabKey = selectedTab;
        }
      });

      dispatch(updateManySystemState({ openedMenus: updatedMenus }));
    }
  };
};
