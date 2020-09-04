import React, { Suspense } from "react";
import { mudarInputHeaderAction } from "redux/actions/boletas/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "redux/actions/boletas/bookOfertaAPIActions";
import {
  AUMENTAR_ZINDEX,
  CRIAR_APP,
  MOSTRAR_APP,
  ATUALIZAR_SHOW,
  ATUALIZAR_DIVKEY,
  FECHAR_FORM,
  ABRIR_FORMULARIO, //Apenas para form de configurar, pois usa o reducer dos sub-apps
  FECHAR_FORMULARIO, //Apenas para form de configurar, pois usa o reducer dos sub-apps
  RECEBER_APPKEYLOCAL,
} from "constants/ActionTypes";
import { MUDAR_ORDEM_EXEC_MAIN_REDUCER } from "constants/MenuActionTypes";

const ContainerAppBoletas = React.lazy(() => import("screens/popups/boletas/ContainerAppBoletas"));

export const criarMostrarAppAction = (apps, show, zindex, dispatch) => {
  dispatch({
    type: CRIAR_APP,
    payload: {
      apps: apps,
      show: show,
      zIndex: zindex + 1,
    },
  });
};
export const mostrarAppAction = (apps, show, zindex, dispatch) => {
  dispatch({
    type: MOSTRAR_APP,
    payload: {
      apps: apps,
      show: show,
      zIndex: zindex + 1,
    },
  });
};

export const atualizarShowAction = (show, dispatch) => {
  dispatch({ type: ATUALIZAR_SHOW, payload: show });
};

export const atualizarDivKeyAction = (divkey) => {
  return (dispatch) => {
    dispatch({ type: ATUALIZAR_DIVKEY, payload: divkey });
  };
};

export const atualizarDivKeyAction2 = (divkey, dispatch) => {
  dispatch({ type: ATUALIZAR_DIVKEY, payload: divkey });
};

export const fecharFormAction = (show, divkey, appkey) => {
  const showModificado = [...show];
  showModificado[appkey][divkey] = false;

  return (dispatch) => {
    dispatch({ type: FECHAR_FORM, payload: showModificado });
  };
};

//Usado para aumentar o Zindex e dar foco ao clicar em uma div.
export const aumentarZindexAction = (div_id, zIndex, show) => {
  return (dispatch) => {
    if (show) {
      zIndex = zIndex + 1;
      document.getElementById(div_id).style.zIndex = zIndex;
      dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex, divkey: div_id });
    }
  };
};

//Abrir formulário de maneira geral, decide entre criar novo sub-app e mostrar o form, ou apenas mostrar o form
export const abrirFormAction = (
  event,
  props,
  codigo_ativo = "",
  nameOrdemExec = "", //identificação da boleta que irá ser aberta vindo das ordens em execução
) => {
  return (dispatch) => {
    let apps = [...props.apps];
    let name;

    if (nameOrdemExec) {
      name = nameOrdemExec;
    } else {
      name = event.currentTarget.getAttribute("data-name");
    }
    let length = apps.length;

    if (length === 0) {
      criarMostrarApp(name, props, dispatch, codigo_ativo);
    } else {
      //percorrer array de show e ver se todos já estão abertos. Se sim, criar e mostrar um novo. Senão, apenas mostrar
      let show = [...props.show];

      let todosAbertos = show.every((element, index) => {
        if (element[name] === false) {
          mostrarApp(name, index, props, dispatch, codigo_ativo);
          return false;
        } else return true;
      });

      if (todosAbertos) {
        criarMostrarApp(name, props, dispatch, codigo_ativo);
      }
    }
  };
};

//Cria um sub-app e altera o estado de visibilidade da boleta escolhida
const criarMostrarApp = (name, props, dispatch, codigo_ativo) => {
  let apps = [...props.apps];
  let show = [...props.show];

  atualizarDivKeyAction2(`${name}${apps.length}`, dispatch);
  show.push({
    book: false,
    compra_agendada: false,
    compra_limitada: false,
    compra_mercado: false,
    compra_startstop: false,
    compra_startmovel: false,
    compra_gainreducao: false,
    venda_agendada: false,
    venda_limitada: false,
    venda_mercado: false,
    venda_startstop: false,
    venda_stopmovel: false,
    venda_gainreducao: false,
    config_compra: false,
    config_venda: false,
  });
  //Faz o dispatch dos dados de visibilidade das boletas
  atualizarShowAction(show, dispatch);
  const length = show.length;

  //escolher o que vai ser mostrado
  show[length - 1][name] = true;

  let sub = adicionarContainerAppBoletas({
    numeroAppsAbertos: apps.length,
    context: props.context,
    codigoBook: codigo_ativo,
  });

  apps.push(sub);
  criarMostrarAppAction(apps, show, props.zIndex, dispatch);
};

//Muda o estado de visibilidade de uma determinada boleta no ultimo appBoletas criado
const mostrarApp = (name, index, props, dispatch, codigo_ativo) => {
  if (name === "book" && codigo_ativo) {
    // Quando abrir o book a partir de uma boleta de compra ou venda
    const dispatchBoleta = props.dispatch;
    dispatchBoleta(mudarInputHeaderAction(codigo_ativo));
    dispatchBoleta(
      listarBookOfertaOnEnterAction({
        codigoAtivo: codigo_ativo,
        token: props.token,
      }),
    );
  }

  let apps = [...props.apps];
  let show = [...props.show];
  atualizarDivKeyAction2(`${name}${index}`, dispatch);
  show[index] = { ...show[index] };
  show[index][name] = true;
  mostrarAppAction(apps, show, props.zIndex, dispatch);
};

//Usado apenas na store local de cada sub-app para abrir os forms de configuração de start/stop movel
export const abrirFormConfigurarAction = (event, props) => {
  const name = event.target.getAttribute("data-name");

  return (dispatch) => {
    dispatch({
      type: ABRIR_FORMULARIO,
      name: name,
      payload: true,
    });

    aumentarZindex(props.zIndex, dispatch);
  };
};

//Usado apenas na store local de cada sub-app para abrir os forms de configuração de start/stop movel
export const fecharFormConfigurarAction = (event) => {
  const name = event.target.getAttribute("name");
  return (dispatch) => {
    dispatch({
      type: FECHAR_FORMULARIO,
      name: name,
      payload: false,
    });
  };
};

//Apenas para form configurar
export const aumentarZindex = (zIndex, dispatch) => {
  zIndex = zIndex + 1;
  dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex });
};

export const receberAppPropsAction = (appProps) => {
  return (dispatch) => {
    dispatch({ type: RECEBER_APPKEYLOCAL, payload: appProps });
  };
};

export const receberDadosOrdemExecMainReducerAction = (dados) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_ORDEM_EXEC_MAIN_REDUCER,
      payload: {
        dadosOrdemExec: dados.dadosOrdemExec,
        ultimaBoletaAbertaOrdemExec: dados.ultimaBoletaAbertaOrdemExec,
      },
    });
  };
};

const adicionarContainerAppBoletas = ({
  numeroAppsAbertos,
  context,
  codigoBook,
}) => {
  const key = `containerBoleta${numeroAppsAbertos}`;

  const containerApp = (
    <ContainerAppBoletas
      key={key}
      index={numeroAppsAbertos}
      indiceShow={numeroAppsAbertos}
      codigoBook={codigoBook}
    />
  );

  if (numeroAppsAbertos === 0)
    return (
      <Suspense key={key} fallback={null}>
        {containerApp}
      </Suspense>
    );

  return containerApp;
};
