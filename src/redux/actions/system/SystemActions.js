import produce from "immer";
import _ from "lodash";

import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
  actionType,
} from "constants/ActionTypes";
import { setPointerWhileAwaiting } from "api/API";
import { realizarLoginAPI, realizarCadastroAPI } from "api/LoginAPI";
import { navigate } from "@reach/router";
import { persistor } from "redux/StoreCreation";
import api from "api/apiConfig";

import { INITIAL_STATE as initialSystemState } from "../../reducers/system/SystemReducer";

const waitDispatch = 1000;

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

      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: { nomeVariavel: "token", valor: { accessToken, tokenType } },
      });
      await dispatch({
        type: LOGAR_DESLOGAR_USUARIO,
        payload: {
          connectedUser: nickName,
          isLogged: true,
        },
      });
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: {
          nomeVariavel: "accounts",
          valor: accounts,
        },
      });
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: {
          nomeVariavel: "selectedAccount",
          valor: accounts[0],
        },
      });

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
      const combinedMainStore = combineMainStoreStateFromReducers(state);

      dispatch(clearReduxStateFromStorageAction(combinedMainStore));
      navigate("/");
    } catch (error) {
      console.log("error when wiping redux data", error);
    }
  };
};

export const abrirItemBarraLateralAction = (
  props,
  nameVariavelReducer,
  forceVisibility = null,
) => {
  const isVisible = props[nameVariavelReducer];
  let updatedVisibility = !isVisible;

  return (dispatch, getState) => {
    const { selectedTab, openedMenus } = getState().systemReducer;

    // Se estiver tentar abrir um popup fora da aba principal e ele já estiver aberto,
    // impede que ele seja fechado e redireciona para a aba principal
    const isTryingToOpenFromSecondaryTab = selectedTab !== "tab0";
    if (
      isTryingToOpenFromSecondaryTab &&
      nameVariavelReducer !== "isOpenMultileg"
    ) {
      dispatch(
        updateManySystemState({
          selectedTab: "tab0",
          [nameVariavelReducer]: true,
        }),
      );
      return;
    } //

    const multilegIndex = openedMenus.findIndex(
      (openedMenuItem) => openedMenuItem.menuKey === "multileg",
    );

    // Traz a multileg para a aba atual se estiver tentando abrir com ele já aberto em outra aba
    if (
      nameVariavelReducer === "isOpenMultileg" &&
      isVisible &&
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
  return (dispatch, getState) => {
    const { mainTabs } = getState().systemReducer;

    const updatedMainTabs = produce(mainTabs, (draft) => {
      draft.splice(tabIndex, 1);
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
        } else if (key.toLowerCase().includes("interval")) {
          clearInterval(props[key]);
        }
      }
    });
    dispatch({
      type: LOGAR_DESLOGAR_USUARIO,
      payload: {
        connectedUser: "",
        isLogged: false,
      },
    });

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
