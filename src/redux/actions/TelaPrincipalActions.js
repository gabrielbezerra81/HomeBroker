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

const waitDispatch = 1000;

export const abrirFecharMenuLateralAction = (menuLateralAberto) => {
  return (dispatch) => {
    dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: menuLateralAberto });
  };
};

export const logarUsuarioAction = (email, senha) => {
  return async (dispatch, getState) => {
    travarDestravarClique("travar", "botaoLogar");

    const data = await realizarLoginAPI(email, senha);
    //const auth = await autenticacaoTokenAPI(token);

    if (data) {
      const { name, accessToken, tokenType, accounts } = data;

      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: { nomeVariavel: "token", valor: { accessToken, tokenType } },
      });
      await dispatch({
        type: LOGAR_DESLOGAR_USUARIO,
        payload: {
          usuarioConectado: name,
          logado: true,
        },
      });
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: {
          nomeVariavel: "conta",
          valor: accounts,
        },
      });
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: {
          nomeVariavel: "contaSelecionada",
          valor: accounts[0],
        },
      });

      navigate("/home");
    }

    travarDestravarClique("destravar", "botaoLogar");
  };
};

export const cadastrarUsuarioAction = (props) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "botaoCadastrar");
    const role = ["ROLE_USER"];

    const retornoCadastro = await realizarCadastroAPI(
      props.nomeCadastro,
      props.usernameCadastro,
      props.emailCadastro,
      role,
      props.senhaCadastro
    );

    travarDestravarClique("destravar", "botaoCadastrar");
    if (retornoCadastro) {
      navigate("/");
    }
  };
};
export const deslogarUsuarioAction = (props) => {
  return (dispatch) => {
    persistor
      .purge()
      .then(() => {
        Object.keys(props).forEach((key) => {
          if (props[key]) {
            if (key.includes("eventSource")) props[key].close();
            else if (key.includes("setInterval")) clearInterval(props[key]);
          }
        });
        dispatch({
          type: LOGAR_DESLOGAR_USUARIO,
          payload: {
            usuarioConectado: "",
            logado: false,
          },
        });

        resetarDadosReducerAction({
          nameVariavelReducer: "deslogar",
          dispatch,
          visibilidadeMenu: false,
        });

        navigate("/");
      })
      .catch((erro) => {
        console.log("purge error: ", erro);
      });
  };
};

export const abrirItemBarraLateralAction = (props, nameVariavelReducer) => {
  Object.keys(props).forEach((key) => {
    if (props[key]) {
      if (key.includes("eventSource")) props[key].close();
      else if (key.includes("setInterval")) clearInterval(props[key]);
    }
  });

  const visibilidadeMenu = !props[nameVariavelReducer];

  return (dispatch) => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: {
        name: nameVariavelReducer,
        valor: visibilidadeMenu,
      },
    });
    resetarDadosReducerAction({
      dispatch,
      nameVariavelReducer,
      visibilidadeMenu,
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
  if (
    ["ordensExecucaoAberto", "listaCompletaAberta"].includes(
      nameVariavelReducer
    )
  )
    limparReducer = false;

  if (!visibilidadeMenu)
    setTimeout(() => {
      dispatch({
        type: actionType.RESET_REDUX_STATE,
        payload: { name: nameVariavelReducer, limparReducer },
      });
    }, waitDispatch);
};
