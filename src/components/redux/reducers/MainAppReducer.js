import {
  AUMENTAR_ZINDEX,
  CRIAR_APP,
  MOSTRAR_APP,
  ATUALIZAR_SHOW,
  ATUALIZAR_DIVKEY,
  FECHAR_FORM
} from "constants/ActionTypes";
import React from "react";
import { SubAppConectado } from "../../../MainApp";

const INITIAL_STATE = {
  apps: [],
  show: [],
  divkey: 0,
  zIndex: 100
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CRIAR_APP:
      return {
        ...state,
        apps: action.apps,
        show: action.show,
        zIndex: action.zIndex
      };
    case MOSTRAR_APP:
      return {
        ...state,
        apps: action.apps,
        show: action.show,
        zIndex: action.zIndex
      };
    case ATUALIZAR_SHOW:
      return { ...state, show: action.payload };
    case AUMENTAR_ZINDEX:
      return { ...state, zIndex: action.payload, divkey: action.divkey };
    case ATUALIZAR_DIVKEY:
      return { ...state, divkey: action.payload };
    case FECHAR_FORM:
      return { ...state, show: action.payload, divkey: "" };
    default:
      return state;
  }
};

export const criarMostrarAppAction = (apps, show, zindex, dispatch) => {
  dispatch({ type: CRIAR_APP, apps: apps, show: show, zIndex: zindex + 1 });
};
export const mostrarAppAction = (apps, show, zindex, dispatch) => {
  dispatch({
    type: MOSTRAR_APP,
    apps: apps,
    show: show,
    zIndex: zindex + 1
  });
};

export const atualizarShowAction = (show, dispatch) => {
  dispatch({ type: ATUALIZAR_SHOW, payload: show });
};

export const atualizarDivKeyAction = (divkey, dispatch) => {
  dispatch({ type: ATUALIZAR_DIVKEY, payload: divkey });
};

export const fecharFormAction = (props, divkey) => {
  let show = [...props.show];
  show[props.appkey][divkey] = false;
  return dispatch => {
    dispatch({ type: FECHAR_FORM, payload: show });
  };
};

//Usado para aumentar o Zindex e dar foco ao clicar em uma div.
export const aumentarZindexAction = (div_id, zIndex, show) => {
  return dispatch => {
    if (show) {
      zIndex = zIndex + 1;
      document.getElementById(div_id).style.zIndex = zIndex;
      dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex, divkey: div_id });
    }
  };
};

//Abrir formulário de maneira geral, decide entre criar novo sub-app e mostrar o form, ou apenas mostrar o form
export const abrirFormAction = (event, props) => {
  return dispatch => {
    let apps = [...props.apps];
    const name = event.target.getAttribute("name");
    let length = apps.length;

    if (length === 0) {
      criarMostrarApp(name, props, dispatch);
    } else {
      //percorrer array de show e ver se todos já estão abertos. Se sim, criar e mostrar um novo. Senão, apenas mostrar
      let show = [...props.show];

      let todosAbertos = show.every((element, index) => {
        if (element[name] === false) {
          mostrarApp(name, index, props, dispatch);
          return false;
        } else return true;
      });

      if (todosAbertos) {
        criarMostrarApp(name, props, dispatch);
      }
    }
  };
};

//Cria um sub-app e mostra o formulario desejado
const criarMostrarApp = (name, props, dispatch) => {
  let apps = [...props.apps];
  let show = [...props.show];
  atualizarDivKeyAction(`${name}${apps.length}`, dispatch);
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
    venda_stop_movel: false,
    venda_gainreducao: false,
    config_compra: false,
    config_venda: false
  });
  atualizarShowAction(show, dispatch);
  const length = show.length;

  //escolher o que vai ser mostrado
  show[length - 1][name] = true;

  let numeroApps = show.length;
  let sub = (
    <SubAppConectado
      key={apps.length}
      index={apps.length}
      indiceShow={numeroApps - 1}
      context={props.context}
    />
  );
  apps.push(sub);
  criarMostrarAppAction(apps, show, props.zIndex, dispatch);
};

const mostrarApp = (name, index, props, dispatch) => {
  let apps = [...props.apps];
  let show = [...props.show];
  atualizarDivKeyAction(`${name}${index}`, dispatch);
  show[index][name] = true;
  mostrarAppAction(apps, show, props.zIndex, dispatch);
};