import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import BookOfertas from "../book_Ofertas/BookOfertas";
import CompraAgendada from "screens/popups/compra/compra_Agendada/CompraAgendada";
import CompraLimitada from "screens/popups/compra/compra_Limitada/CompraLimitada";
import CompraMercado from "screens/popups/compra/compra_Mercado/CompraMercado";
import CompraStartStop from "screens/popups/compra/compra_StartStop/CompraStartStop";
import CompraStartMovel from "screens/popups/compra/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "screens/popups/compra/compra_GainReducao/CompraGainReducao";
import VendaAgendada from "../venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "../venda/venda_Limitada/VendaLimitada";
import VendaMercado from "../venda/venda_Mercado/VendaMercado";
import VendaStartStop from "../venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "../venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "../venda/venda_GainReducao/VendaGainReducao";
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
import Boleta from "screens/popups/boletas/Boleta";
import {
  COMPRA_AGENDADA_NAMESPACE,
  COMPRA_GAINREDUCAO_NAMESPACE,
  COMPRA_LIMITADA_NAMESPACE,
  COMPRA_MERCADO_NAMESPACE,
  COMPRA_STARTMOVEL_NAMESPACE,
  COMPRA_STARTSTOP_NAMESPACE,
  VENDA_AGENDADA_NAMESPACE,
  VENDA_GAINREDUCAO_NAMESPACE,
  VENDA_LIMITADA_NAMESPACE,
  VENDA_MERCADO_NAMESPACE,
  VENDA_STARTSTOP_NAMESPACE,
  VENDA_STOPMOVEL_NAMESPACE,
} from "constants/ActionTypes";

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
      <div className="AppBoletas">
        <Boleta
          appKey={props.appkey}
          boletaName="book"
          visibilityIndex={props.indiceShow}
        >
          <BookOfertas name="book" />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="compra_agendada"
          visibilityIndex={props.indiceShow}
          namespace={COMPRA_AGENDADA_NAMESPACE}
        >
          <CompraAgendada
            headerTitle="COMPRA AGENDADA"
            name="compra_agendada"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="compra_limitada"
          visibilityIndex={props.indiceShow}
          namespace={COMPRA_LIMITADA_NAMESPACE}
        >
          <CompraLimitada
            headerTitle="COMPRA LIMITADA"
            name="compra_limitada"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="compra_mercado"
          visibilityIndex={props.indiceShow}
          namespace={COMPRA_MERCADO_NAMESPACE}
        >
          <CompraMercado headerTitle="COMPRA A MERCADO" name="compra_mercado" />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="compra_startstop"
          visibilityIndex={props.indiceShow}
          namespace={COMPRA_STARTSTOP_NAMESPACE}
        >
          <CompraStartStop
            headerTitle="COMPRA START STOP"
            name="compra_startstop"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="compra_startmovel"
          visibilityIndex={props.indiceShow}
          namespace={COMPRA_STARTMOVEL_NAMESPACE}
        >
          <CompraStartMovel
            headerTitle="COMPRA START MÓVEL"
            name="compra_startmovel"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="compra_gainreducao"
          visibilityIndex={props.indiceShow}
          namespace={COMPRA_GAINREDUCAO_NAMESPACE}
        >
          <CompraGainReducao
            headerTitle="GAIN / REDUÇÃO DE COMPRA"
            name="compra_gainreducao"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="venda_agendada"
          visibilityIndex={props.indiceShow}
          namespace={VENDA_AGENDADA_NAMESPACE}
        >
          <VendaAgendada headerTitle="VENDA AGENDADA" name="venda_agendada" />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="venda_limitada"
          visibilityIndex={props.indiceShow}
          namespace={VENDA_LIMITADA_NAMESPACE}
        >
          <VendaLimitada headerTitle="VENDA LIMITADA" name="venda_limitada" />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="venda_mercado"
          visibilityIndex={props.indiceShow}
          namespace={VENDA_MERCADO_NAMESPACE}
        >
          <VendaMercado headerTitle="VENDA MERCADO" name="venda_mercado" />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="venda_startstop"
          visibilityIndex={props.indiceShow}
          namespace={VENDA_STARTSTOP_NAMESPACE}
        >
          <VendaStartStop
            headerTitle="VENDA START STOP"
            name="venda_startstop"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="venda_stopmovel"
          visibilityIndex={props.indiceShow}
          namespace={VENDA_STOPMOVEL_NAMESPACE}
        >
          <VendaStopMovel
            headerTitle="VENDA STOP MÓVEL"
            name="venda_stopmovel"
          />
        </Boleta>

        <Boleta
          appKey={props.appkey}
          boletaName="venda_gainreducao"
          visibilityIndex={props.indiceShow}
          namespace={VENDA_GAINREDUCAO_NAMESPACE}
        >
          <VendaGainReducao
            headerTitle="GAIN / REDUÇÃO DE VENDA"
            name="venda_gainreducao"
          />
        </Boleta>
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
  eventSourceBook_Book: state.bookOfertaReducer.esource_offersBook,
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
