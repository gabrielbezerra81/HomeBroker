import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN
} from "constants/ActionTypes";
import {
  realizarLoginAPI,
  buscarInformacoesUsuarioAPI,
  travarDestravarClique,
  realizarCadastroAPI
} from "components/api/API";
import { navigate } from "@reach/router";

export const abrirFecharMenuLateralAction = (event, menuLateralAberto) => {
  return dispatch => {
    if (menuLateralAberto)
      dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: false });
    else dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: true });
  };
};

export const logarUsuarioAction = (username, password) => {
  return async dispatch => {
    travarDestravarClique("travar", "botaoLogar");
    if (password === "passar")
      dispatch({
        type: LOGAR_DESLOGAR_USUARIO,
        payload: { usuarioConectado: "Gabriel Alencar", logado: true }
      });
    else {
      const token = await realizarLoginAPI(username, password);
      //const auth = await autenticacaoTokenAPI(token);
      let infoUsuario;
      if (token) {
        infoUsuario = await buscarInformacoesUsuarioAPI(token);
      }

      if (token && infoUsuario) {
        travarDestravarClique("destravar", "botaoLogar");
        await dispatch({
          type: MUDAR_DADOS_LOGIN,
          payload: { nomeVariavel: "token", valor: token }
        });
        await dispatch({
          type: LOGAR_DESLOGAR_USUARIO,
          payload: { usuarioConectado: infoUsuario.name, logado: true }
        });
        navigate("/home");
      } else {
        travarDestravarClique("destravar", "botaoLogar");
      }
    }
  };
};

export const cadastrarUsuarioAction = props => {
  return async dispatch => {
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
  return async dispatch => {
    await dispatch({
      type: LOGAR_DESLOGAR_USUARIO,
      payload: { usuarioConectado: "", logado: false }
    });
    await dispatch({
      type: MUDAR_DADOS_LOGIN,
      payload: { nomeVariavel: "token", valor: null }
    });
    navigate("/");
  };
};

export const abrirItemBarraLateralAction = (props, nameVariavelReducer) => {
  if (nameVariavelReducer === "multilegAberto") {
    if (props.eventSourceBook_Multileg) props.eventSourceBook_Multileg.close();
    if (props.eventSourceCotacao_Multileg)
      props.eventSourceCotacao_Multileg.close();
  } //
  else if (nameVariavelReducer === "listaCompletaAberta") {
    if (props.eventSourceEmblema_Posicao)
      props.eventSourceEmblema_Posicao.close();
  }
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: {
        name: nameVariavelReducer,
        valor: !props[nameVariavelReducer]
      }
    });
  };
};

export const mouseOverAction = (props, nameVariavelReducer) => {
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: true }
    });
  };
};

export const mouseLeaveAction = (props, nameVariavelReducer) => {
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: false }
    });
  };
};

export const mudarDadosLoginAction = (nomeVariavel, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_DADOS_LOGIN,
      payload: { nomeVariavel: nomeVariavel, valor: valor }
    });
  };
};
