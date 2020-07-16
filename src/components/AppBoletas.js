import React from "react";
import { Row } from "react-bootstrap";
import { Animate } from "react-show";
import { compose } from "redux";
import { connect } from "react-redux";
import BookOfertas from "./popups/book_Ofertas/BookOfertas";
import CompraAgendada from "components/popups/compra/compra_Agendada/CompraAgendada";
import CompraLimitada from "components/popups/compra/compra_Limitada/CompraLimitada";
import CompraMercado from "components/popups/compra/compra_Mercado/CompraMercado";
import CompraStartStop from "components/popups/compra/compra_StartStop/CompraStartStop";
import CompraStartMovel from "components/popups/compra/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "components/popups/compra/compra_GainReducao/CompraGainReducao";
import VendaAgendada from "./popups/venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "./popups/venda/venda_Limitada/VendaLimitada";
import VendaMercado from "./popups/venda/venda_Mercado/VendaMercado";
import VendaStartStop from "./popups/venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "./popups/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./popups/venda/venda_GainReducao/VendaGainReducao";
import { GlobalContext } from "redux/StoreCreation";
import {
  fecharFormAction,
  abrirFormAction,
  aumentarZindexAction,
  receberAppPropsAction,
  receberDadosOrdemExecMainReducerAction,
} from "redux/actions/GlobalAppActions";
import { listarBookOfertaOnEnterAction } from "redux/actions/boletas/bookOfertaAPIActions";
import { mudarInputHeaderAction } from "redux/actions/boletas/bookOfertaActions";
import { montarBoletaFromOrdemExecAction } from "redux/actions/boletas/formInputActions";

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const animate = (props, Componente) => {
  return (
    <Animate
      show={props.show[props.indiceShow][Componente.props.name]}
      duration={props.show[props.indiceShow][Componente.props.name] ? 100 : 0}
      transitionOnMount
      preMount
      start={startStyle}
      id={`${Componente.props.name}${props.appkey}`}
      onClick={() =>
        props.aumentarZindexAction(
          `${Componente.props.name}${props.appkey}`,
          props.zIndex,
          props.show[props.indiceShow][Componente.props.name]
        )
      }
    >
      {Componente}
    </Animate>
  );
};

class AppBoletas extends React.Component {
  componentDidMount() {
    const { props } = this;

    if (
      props.divkey !== "" &&
      props.divkey !== "divOrdens" &&
      props.divkey !== "ordens_execucao" &&
      props.divkey !== "posicao_custodia" &&
      props.divkey !== "multileg" &&
      props.divkey !== "relatorio_detalhado"
    )
      document.getElementById(props.divkey).style.zIndex = props.zIndex + 1;
    props.receberAppPropsAction(props);

    if (props.appkey !== 0 && props.codigoBook) {
      props.mudarInputHeaderAction(props.codigoBook);
      props.listarBookOfertaOnEnterAction(props.codigoBook);
    }
    //Disparar montagem de ordem vinda das ordens em execução ao criar App Local
    if (props.dadosOrdemExec) props.montarBoletaFromOrdemExecAction(props);
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    if (
      props.divkey !== "" &&
      props.divkey !== "divOrdens" &&
      props.divkey !== "ordens_execucao" &&
      props.divkey !== "posicao_custodia" &&
      props.divkey !== "multileg" &&
      props.divkey !== "relatorio_detalhado" &&
      document.getElementById(props.divkey)
    )
      document.getElementById(props.divkey).style.zIndex = props.zIndex + 1;

    //Disparar montagem de ordem ao mostrar App Local
    //1 - Filtra o appBoleta que deve ser alterado com a nova ordem em execução, pois ele terá seu estado "show" alterado.
    //2 - Verifica se foi enviada uma ordem de execução para ser aberta nas boletas
    if (
      prevProps.show[props.appkey] !== props.show[props.appkey] &&
      props.dadosOrdemExec
    ) {
      props.montarBoletaFromOrdemExecAction(props);
    }

    if (prevProps !== props) {
      props.receberAppPropsAction(props);
    }
  }

  render() {
    const { props } = this;

    return (
      <div className="App">
        <Row className="appbody">
          {animate(props, <BookOfertas name="book" />)}
          {animate(
            props,
            <CompraAgendada
              headerTitle="COMPRA AGENDADA"
              name="compra_agendada"
            />
          )}
          {animate(
            props,
            <CompraLimitada
              headerTitle="COMPRA LIMITADA"
              name="compra_limitada"
            />
          )}

          {animate(
            props,
            <CompraMercado
              headerTitle="COMPRA A MERCADO"
              name="compra_mercado"
            />
          )}

          {animate(
            props,
            <CompraStartStop
              headerTitle="COMPRA START STOP"
              name="compra_startstop"
            />
          )}

          {animate(
            props,
            <CompraStartMovel
              headerTitle="COMPRA START MÓVEL"
              name="compra_startmovel"
            />
          )}

          {animate(
            props,
            <CompraGainReducao
              headerTitle="GAIN / REDUÇÃO DE COMPRA"
              name="compra_gainreducao"
            />
          )}

          {animate(
            props,
            <VendaAgendada headerTitle="VENDA AGENDADA" name="venda_agendada" />
          )}
          {animate(
            props,
            <VendaLimitada headerTitle="VENDA LIMITADA" name="venda_limitada" />
          )}
          {animate(
            props,
            <VendaMercado headerTitle="VENDA MERCADO" name="venda_mercado" />
          )}
          {animate(
            props,
            <VendaStartStop
              headerTitle="VENDA START STOP"
              name="venda_startstop"
            />
          )}
          {animate(
            props,
            <VendaStopMovel
              headerTitle="VENDA STOP MÓVEL"
              name="venda_stopmovel"
            />
          )}
          {animate(
            props,
            <VendaGainReducao
              headerTitle="GAIN / REDUÇÃO DE VENDA"
              name="venda_gainreducao"
            />
          )}
        </Row>
      </div>
    );
  }
}

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
    dadosOrdemExec: state.MainAppReducer.dadosOrdemExec,
    ultimaBoletaAbertaOrdemExec:
      state.MainAppReducer.ultimaBoletaAbertaOrdemExec,
  };
};

const mapStateToPropsLocal = (state) => ({
  eventSourceBook_Book: state.bookOfertaReducer.eventSource,
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction,
      fecharFormAction,
      abrirFormAction,
      receberDadosOrdemExecMainReducerAction,
    },
    null,
    { context: GlobalContext }
  ),
  connect(mapStateToPropsLocal, {
    receberAppPropsAction,
    listarBookOfertaOnEnterAction,
    mudarInputHeaderAction,
    montarBoletaFromOrdemExecAction,
  })
)(AppBoletas);
