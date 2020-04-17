import React from "react";
import { Row } from "react-bootstrap";
import "../css";
import BookOfertas from "./forms/book_Ofertas/BookOfertas";
import CompraAgendada from "components/forms/compra/compra_Agendada/CompraAgendada";
import CompraLimitada from "components/forms/compra/compra_Limitada/CompraLimitada";
import CompraMercado from "components/forms/compra/compra_Mercado/CompraMercado";
import CompraStartStop from "components/forms/compra/compra_StartStop/CompraStartStop";
import CompraStartMovel from "components/forms/compra/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "components/forms/compra/compra_GainReducao/CompraGainReducao";
import VendaAgendada from "./forms/venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "./forms/venda/venda_Limitada/VendaLimitada";
import VendaMercado from "./forms/venda/venda_Mercado/VendaMercado";
import VendaStartStop from "./forms/venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "./forms/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./forms/venda/venda_GainReducao/VendaGainReducao";
import { Animate } from "react-show";

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

export default class AppBoletas extends React.Component {
  componentWillMount() {
    const { props } = this;

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
