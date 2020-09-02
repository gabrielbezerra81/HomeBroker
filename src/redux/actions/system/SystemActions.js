import produce from "immer";
import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
  actionType,
} from "constants/ActionTypes";
import { travarDestravarClique } from "api/API";
import { realizarLoginAPI, realizarCadastroAPI } from "api/LoginAPI";
import { navigate } from "@reach/router";
import { persistor } from "redux/StoreCreation";
import api from "api/apiConfig";

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
    travarDestravarClique("travar", "botaoLogar");

    const data = await realizarLoginAPI(email, senha);
    //const auth = await autenticacaoTokenAPI();

    if (data) {
      const { name, accessToken, tokenType, accounts } = data;

      api.defaults.headers.authorization = `${tokenType} ${accessToken}`;

      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: { nomeVariavel: "token", valor: { accessToken, tokenType } },
      });
      await dispatch({
        type: LOGAR_DESLOGAR_USUARIO,
        payload: {
          connectedUser: name,
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

    travarDestravarClique("destravar", "botaoLogar");
  };
};

export const cadastrarUsuarioAction = (data) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "botaoCadastrar");
    const role = ["ROLE_USER"];

    const { name, username, email, password } = data;

    const retornoCadastro = await realizarCadastroAPI({
      name,
      username,
      email,
      role,
      password,
    });

    travarDestravarClique("destravar", "botaoCadastrar");
    if (retornoCadastro) {
      navigate("/");
    }
  };
};

export const deslogarUsuarioAction = (props) => {
  return async (dispatch) => {
    try {
      dispatch(clearReduxStateFromStorageAction(props));
      navigate("/");
    } catch (error) {
      console.log("error when wiping redux data", error);
    }
  };
};

export const abrirItemBarraLateralAction = (props, nameVariavelReducer) => {
  Object.keys(props).forEach((key) => {
    if (props[key]) {
      if (key.includes("eventSource")) props[key].close();
      else if (key.includes("setInterval")) clearInterval(props[key]);
    }
  });

  const isVisible = props[nameVariavelReducer];
  const updatedVisibility = !isVisible;

  return (dispatch, getState) => {
    const { selectedTab, openedMenus } = getState().systemReducer;

    // Se estiver tentar abrir um popup fora da aba principal e ele já estiver aberto,
    // impede que ele seja fechado e redireciona para a aba principal
    if (selectedTab !== "tab0") {
      dispatch(
        updateManySystemState({
          selectedTab: "tab0",
          [nameVariavelReducer]: true,
        }),
      );
    } //
    else {
      const updateOpenedMenus = handleCloseMenusInMainTab({
        isOpenAttribute: nameVariavelReducer,
        visibility: updatedVisibility,
        openedMenus,
      });

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
    }
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

  if (!visibilidadeMenu)
    setTimeout(() => {
      dispatch({
        type: actionType.RESET_REDUX_STATE,
        payload: { name: nameVariavelReducer, limparReducer },
      });
    }, waitDispatch);
};

export const handleOpenMenusInMainTabAction = (menuChildren) => {
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
              tabKey: "tab0",
            });
          }
        }
      });
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
      const updatedMainTabs = produce(mainTabs, (draft) => {
        draft.push({ tabName: `Aba ${draft.length + 1}` });
      });

      dispatch(
        updateManySystemState({
          mainTabs: updatedMainTabs,
          selectedTab: `tab${updatedMainTabs.length - 1}`,
        }),
      );
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
        if (key.includes("eventSource")) props[key].close();
        else if (key.includes("setInterval")) clearInterval(props[key]);
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
