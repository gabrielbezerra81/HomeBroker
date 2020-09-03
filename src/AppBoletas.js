import React from "react";
import { Animate } from "react-show";
import { compose } from "redux";
import { connect } from "react-redux";
import BookOfertas from "./screens/popups/book_Ofertas/BookOfertas";
import CompraAgendada from "screens/popups/compra/compra_Agendada/CompraAgendada";
import CompraLimitada from "screens/popups/compra/compra_Limitada/CompraLimitada";
import CompraMercado from "screens/popups/compra/compra_Mercado/CompraMercado";
import CompraStartStop from "screens/popups/compra/compra_StartStop/CompraStartStop";
import CompraStartMovel from "screens/popups/compra/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "screens/popups/compra/compra_GainReducao/CompraGainReducao";
import VendaAgendada from "./screens/popups/venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "./screens/popups/venda/venda_Limitada/VendaLimitada";
import VendaMercado from "./screens/popups/venda/venda_Mercado/VendaMercado";
import VendaStartStop from "./screens/popups/venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "./screens/popups/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./screens/popups/venda/venda_GainReducao/VendaGainReducao";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
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
          props.show[props.indiceShow][Componente.props.name],
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
      // quando a abertura do book for solicitada a partir de um AppBoletas que já possui book, será criado um novo
      // AppBoletas que precisará receber os dados do código do book
      props.mudarInputHeaderAction(props.codigoBook);
      props.listarBookOfertaOnEnterAction({
        codigoAtivo: props.codigoBook,
        token: props.token,
      });
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
        {animate(props, <BookOfertas name="book" />)}
        {animate(
          props,
          <CompraAgendada
            headerTitle="COMPRA AGENDADA"
            name="compra_agendada"
          />,
        )}
        {animate(
          props,
          <CompraLimitada
            headerTitle="COMPRA LIMITADA"
            name="compra_limitada"
          />,
        )}

        {animate(
          props,
          <CompraMercado
            headerTitle="COMPRA A MERCADO"
            name="compra_mercado"
          />,
        )}

        {animate(
          props,
          <CompraStartStop
            headerTitle="COMPRA START STOP"
            name="compra_startstop"
          />,
        )}

        {animate(
          props,
          <CompraStartMovel
            headerTitle="COMPRA START MÓVEL"
            name="compra_startmovel"
          />,
        )}

        {animate(
          props,
          <CompraGainReducao
            headerTitle="GAIN / REDUÇÃO DE COMPRA"
            name="compra_gainreducao"
          />,
        )}

        {animate(
          props,
          <VendaAgendada headerTitle="VENDA AGENDADA" name="venda_agendada" />,
        )}
        {animate(
          props,
          <VendaLimitada headerTitle="VENDA LIMITADA" name="venda_limitada" />,
        )}
        {animate(
          props,
          <VendaMercado headerTitle="VENDA MERCADO" name="venda_mercado" />,
        )}
        {animate(
          props,
          <VendaStartStop
            headerTitle="VENDA START STOP"
            name="venda_startstop"
          />,
        )}
        {animate(
          props,
          <VendaStopMovel
            headerTitle="VENDA STOP MÓVEL"
            name="venda_stopmovel"
          />,
        )}
        {animate(
          props,
          <VendaGainReducao
            headerTitle="GAIN / REDUÇÃO DE VENDA"
            name="venda_gainreducao"
          />,
        )}
      </div>
    );
  }
}

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.GlobalReducer.apps,
    show: state.GlobalReducer.show,
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
    dadosOrdemExec: state.GlobalReducer.dadosOrdemExec,
    ultimaBoletaAbertaOrdemExec:
      state.GlobalReducer.ultimaBoletaAbertaOrdemExec,
  };
};

const mapStateToPropsStorePrincipal = (state) => ({
  token: state.systemReducer.token,
});

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
    { context: GlobalContext },
  ),
  connect(mapStateToPropsStorePrincipal, {}, null, {
    context: StorePrincipalContext,
  }),
  connect(mapStateToPropsLocal, {
    receberAppPropsAction,
    listarBookOfertaOnEnterAction,
    mudarInputHeaderAction,
    montarBoletaFromOrdemExecAction,
  }),
)(AppBoletas);
