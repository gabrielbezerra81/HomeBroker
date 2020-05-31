import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
  actionType,
} from "constants/ActionTypes";
import { travarDestravarClique } from "components/api/API";
import {
  realizarLoginAPI,
  buscarInformacoesUsuarioAPI,
  realizarCadastroAPI,
  listarContasAPI,
} from "components/api/LoginAPI";
import { navigate } from "@reach/router";
import { persistor } from "components/redux/StoreCreation";

const waitDispatch = 1000;

export const abrirFecharMenuLateralAction = (event, menuLateralAberto) => {
  return (dispatch) => {
    if (menuLateralAberto)
      dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: false });
    else dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: true });
  };
};

export const logarUsuarioAction = (username, password) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "botaoLogar");

    const token = await realizarLoginAPI(username, password);
    //const auth = await autenticacaoTokenAPI(token);
    let infoUsuario;
    let conta;
    if (token) {
      infoUsuario = await buscarInformacoesUsuarioAPI(token);
      conta = await listarContasAPI(token);
    }

    if (token && infoUsuario) {
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: { nomeVariavel: "token", valor: token },
      });
      await dispatch({
        type: LOGAR_DESLOGAR_USUARIO,
        payload: {
          usuarioConectado: infoUsuario.name,
          logado: true,
        },
      });
      navigate("/home");
    }
    if (conta) {
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: {
          nomeVariavel: "conta",
          valor: conta,
        },
      });
      await dispatch({
        type: MUDAR_DADOS_LOGIN,
        payload: {
          nomeVariavel: "contaSelecionada",
          valor: conta[0],
        },
      });
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
export const deslogarUsuarioAction = (event, props) => {
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

        resetarDadosReducerAction("deslogar", dispatch, false);

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

  const visibilidade = !props[nameVariavelReducer];

  return (dispatch) => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: {
        name: nameVariavelReducer,
        valor: visibilidade,
      },
    });
    resetarDadosReducerAction(nameVariavelReducer, dispatch, visibilidade);
  };
};

export const mouseOverAction = (props, nameVariavelReducer) => {
  return (dispatch) => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: true },
    });
  };
};

export const mouseLeaveAction = (props, nameVariavelReducer) => {
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

const resetarDadosReducerAction = (nome, dispatch, visibilidadeMenu) => {
  let limparReducer = true;
  if (["ordensExecucaoAberto", "listaCompletaAberta"].includes(nome))
    limparReducer = false;

  if (!visibilidadeMenu)
    setTimeout(() => {
      dispatch({
        type: actionType.RESET_REDUX_STATE,
        payload: { name: nome, limparReducer },
      });
    }, waitDispatch);
};
