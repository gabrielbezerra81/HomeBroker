import React, { Suspense } from "react";
import { mudarInputHeaderAction } from "modules/boletas/duck/actions/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "modules/boletas/duck/actions/bookOfertaAPIActions";
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
import { globalStore } from "redux/StoreCreation";

const ContainerAppBoletas = React.lazy(() =>
  import("modules/boletas/screens/ContainerAppBoletas"),
);

export const criarMostrarAppAction = (apps, show, zindex) => {
  globalStore.dispatch({
    type: CRIAR_APP,
    payload: {
      apps: apps,
      show: show,
      zIndex: zindex + 1,
    },
  });
};
export const mostrarAppAction = (apps, show, zindex) => {
  globalStore.dispatch({
    type: MOSTRAR_APP,
    payload: {
      apps: apps,
      show: show,
      zIndex: zindex + 1,
    },
  });
};

export const atualizarShowAction = (show) => {
  globalStore.dispatch({ type: ATUALIZAR_SHOW, payload: show });
};

export const atualizarDivKeyAction = (divkey) => {
  return (dispatch) => {
    dispatch({ type: ATUALIZAR_DIVKEY, payload: divkey });
  };
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
  return () => {
    let apps = [...props.apps];
    let name;

    if (nameOrdemExec) {
      name = nameOrdemExec;
    } else {
      name = event.currentTarget.getAttribute("data-name");
    }
    let length = apps.length;

    if (length === 0) {
      criarMostrarApp(name, props, codigo_ativo);
    } else {
      //percorrer array de show e ver se todos já estão abertos. Se sim, criar e mostrar um novo. Senão, apenas mostrar
      let show = [...props.show];

      let todosAbertos = show.every((element, index) => {
        if (element[name] === false) {
          mostrarApp(name, index, props, codigo_ativo);
          return false;
        } else return true;
      });

      if (todosAbertos) {
        criarMostrarApp(name, props, codigo_ativo);
      }
    }
  };
};

//Cria um sub-app e altera o estado de visibilidade da boleta escolhida
const criarMostrarApp = (name, props, codigo_ativo) => {
  let apps = [...props.apps];
  let show = [...props.show];

  globalStore.dispatch(atualizarDivKeyAction(`${name}${apps.length}`));
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
  atualizarShowAction(show);
  const length = show.length;

  //escolher o que vai ser mostrado
  show[length - 1][name] = true;

  let appBoleta = addAppBoleta({
    numeroAppsAbertos: apps.length,
    codigoBook: codigo_ativo,
  });

  apps.push(appBoleta);
  criarMostrarAppAction(apps, show, props.zIndex);
};

//Muda o estado de visibilidade de uma determinada boleta no ultimo appBoletas criado
const mostrarApp = (name, index, props, codigo_ativo) => {
  if (name === "book" && codigo_ativo) {
    // Quando abrir o book a partir de uma boleta de compra ou venda
    const dispatchBoleta = props.dispatch;
    dispatchBoleta(mudarInputHeaderAction(codigo_ativo));
    dispatchBoleta(
      listarBookOfertaOnEnterAction({
        codigoAtivo: codigo_ativo,
      }),
    );
  }

  let apps = [...props.apps];
  let show = [...props.show];
  globalStore.dispatch(atualizarDivKeyAction(`${name}${index}`));
  show[index] = { ...show[index] };
  show[index][name] = true;
  mostrarAppAction(apps, show, props.zIndex);
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

    aumentarZindex(props.zIndex);
  };
};

//Usado apenas na store local de cada sub-app para abrir os forms de configuração de start/stop movel
export const fecharFormConfigurarAction = (event) => {
  const name = event.currentTarget.getAttribute("name");
  return (dispatch) => {
    dispatch({
      type: FECHAR_FORMULARIO,
      name: name,
      payload: false,
    });
  };
};

//Apenas para form configurar
export const aumentarZindex = (zIndex) => {
  zIndex = zIndex + 1;
  globalStore.dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex });
};

export const receberAppPropsAction = (appProps) => {
  return (dispatch) => {
    dispatch({ type: RECEBER_APPKEYLOCAL, payload: appProps });
  };
};

export const receberDadosOrdemExecMainReducerAction = ({
  dadosOrdemExec,
  ultimaBoletaAbertaOrdemExec,
}) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_ORDEM_EXEC_MAIN_REDUCER,
      payload: {
        dadosOrdemExec,
        ultimaBoletaAbertaOrdemExec,
      },
    });
  };
};

const addAppBoleta = ({ numeroAppsAbertos, codigoBook }) => {
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
