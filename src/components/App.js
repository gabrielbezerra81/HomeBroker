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
  pointerEvents: "none"
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

export default class App extends React.Component {
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
    //1 - Filtra o subapp que deve ser alterado com a nova ordem em execução, pois ele terá seu estado "show" alterado.
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

  handleShow = (event, ativo) => {
    this.props.abrirFormAction(event, this.props, ativo);
  };

  render() {
    const { props } = this;

    return (
      <div className="App">
        <Row className="appbody">
          {animate(
            props,
            <BookOfertas
              close={() => {
                props.fecharFormAction(props, "book");
              }}
              name="book"
            />
          )}
          {animate(
            props,
            <CompraAgendada
              close={() => {
                props.fecharFormAction(props, "compra_agendada");
              }}
              headerTitle="COMPRA AGENDADA"
              name="compra_agendada"
              handleShow={this.handleShow}
            />
          )}
          {animate(
            props,
            <CompraLimitada
              close={() => {
                props.fecharFormAction(props, "compra_limitada");
              }}
              headerTitle="COMPRA LIMITADA"
              name="compra_limitada"
              handleShow={this.handleShow}
            />
          )}

          {animate(
            props,
            <CompraMercado
              close={() => {
                props.fecharFormAction(props, "compra_mercado");
              }}
              headerTitle="COMPRA A MERCADO"
              name="compra_mercado"
              handleShow={this.handleShow}
            />
          )}

          {animate(
            props,
            <CompraStartStop
              close={() => {
                props.fecharFormAction(props, "compra_startstop");
              }}
              headerTitle="COMPRA START STOP"
              name="compra_startstop"
              handleShow={this.handleShow}
            />
          )}

          {animate(
            props,
            <CompraStartMovel
              close={() => {
                props.fecharFormAction(props, "compra_startmovel");
              }}
              headerTitle="COMPRA START MÓVEL"
              name="compra_startmovel"
              handleShow={this.handleShow}
            />
          )}

          {animate(
            props,
            <CompraGainReducao
              close={() => {
                props.fecharFormAction(props, "compra_gainreducao");
              }}
              headerTitle="GAIN / REDUÇÃO DE COMPRA"
              name="compra_gainreducao"
              handleShow={this.handleShow}
            />
          )}

          {animate(
            props,
            <VendaAgendada
              close={() => {
                props.fecharFormAction(props, "venda_agendada");
              }}
              headerTitle="VENDA AGENDADA"
              name="venda_agendada"
              handleShow={this.handleShow}
            />
          )}
          {animate(
            props,
            <VendaLimitada
              close={() => {
                props.fecharFormAction(props, "venda_limitada");
              }}
              headerTitle="VENDA LIMITADA"
              name="venda_limitada"
              handleShow={this.handleShow}
            />
          )}
          {animate(
            props,
            <VendaMercado
              close={() => {
                props.fecharFormAction(props, "venda_mercado");
              }}
              headerTitle="VENDA MERCADO"
              name="venda_mercado"
              handleShow={this.handleShow}
            />
          )}
          {animate(
            props,
            <VendaStartStop
              close={() => {
                props.fecharFormAction(props, "venda_startstop");
              }}
              headerTitle="VENDA START STOP"
              name="venda_startstop"
              handleShow={this.handleShow}
            />
          )}
          {animate(
            props,
            <VendaStopMovel
              close={() => {
                props.fecharFormAction(props, "venda_stop_movel");
              }}
              headerTitle="VENDA STOP MÓVEL"
              name="venda_stop_movel"
              handleShow={this.handleShow}
            />
          )}
          {animate(
            props,
            <VendaGainReducao
              close={() => {
                props.fecharFormAction(props, "venda_gainreducao");
              }}
              headerTitle="GAIN / REDUÇÃO DE VENDA"
              name="venda_gainreducao"
              handleShow={this.handleShow}
            />
          )}
        </Row>
      </div>
    );
  }
}
