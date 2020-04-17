import React, { Component } from "react";
import Draggable from "react-draggable";
import ConfigurarStop from "components/forms/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "components/forms/venda/venda_StartStop/ConfigurarStopVenda";
import FiltrarOrdens from "components/forms/ordens_em_execucao/FiltrarOrdens"; //posicaoFormCompraVenda
import ConfigComplementar from "components/forms/multileg_/ConfigComplementar";
import { Resizable } from "re-resizable";
import { StateStorePrincipal } from "components/redux/StoreCreation";
class BSModal extends Component {
  constructor(props) {
    super(props);

    this.state = { draggableData: { x: 0, y: 0 } };
    this.resetPosition = this.resetPosition.bind(this);
  }

  resetPosition() {
    this.setState({ draggableData: { x: 0, y: 0 } });
  }

  render() {
    const formulario = (
      <div id={this.props.id} className={` ${this.props.classConfigAberto}`}>
        {this.props.id === "ordens_execucao" ? <RenderFiltrarOrdens /> : null}
        <div className="mcontent">
          {this.props.renderHeader(this.resetPosition)}
          {this.props.renderModalBody()}
        </div>
        {this.props.renderConfigForm && this.props.id === "comprastartstop" ? (
          <ConfigurarStop />
        ) : null}
        {this.props.renderConfigForm && this.props.id === "vendastartstop" ? (
          <ConfigurarStopVenda />
        ) : null}
        {this.props.renderConfigComplementar && this.props.id === "multileg" ? (
          <ConfigComplementar />
        ) : null}
      </div>
    );

    return (
      <Draggable
        enableUserSelectHack={false}
        handle=".mheader"
        position={this.state.draggableData}
        defaultPosition={{ x: 0, y: 0 }}
        onDrag={(e, draggableData) => {
          e.preventDefault();
          this.setState({
            draggableData: draggableData,
          });
        }}
      >
        {this.props.id === "thl" ? (
          <Resizable
            defaultSize={{
              width: 1210,
            }}
            minWidth="607"
            minHeight="1205"
            maxHeight="1205"
            style={{ position: "absolute" }}
          >
            {formulario}
          </Resizable>
        ) : (
          formulario
        )}
      </Draggable>
    );
  }
}

export default BSModal;

const RenderFiltrarOrdens = () => {
  const state = StateStorePrincipal();
  const { filtrarOrdensAberto } = state.ordensExecReducer;

  if (filtrarOrdensAberto) return <FiltrarOrdens />;
  return <div></div>;
};

/*
const aplicarPosicao = id => {
  const IDs = [];
  if (IDs.includes(id)) {
    return "posicaoFormCompraVenda";
  } else return "";
};

*/
