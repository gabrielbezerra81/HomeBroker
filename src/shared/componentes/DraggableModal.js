import React, { Component } from "react";
import Draggable from "react-draggable";
import ConfigurarStop from "screens/popups/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "screens/popups/venda/venda_StartStop/ConfigurarStopVenda";
import FiltrarOrdens from "screens/popups/ordens_em_execucao/FiltrarOrdens"; //posicaoFormCompraVenda
import ConfigComplementar from "screens/popups/multileg_/ConfigComplementar";
import { Resizable } from "re-resizable";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

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
    const { classConfigAberto, id } = this.props;
    const formulario = (
      <div
        id={id !== "thl" ? id : ""}
        className={`${classConfigAberto ? classConfigAberto : ""}`}
      >
        {id === "ordens_execucao" ? <RenderFiltrarOrdens /> : null}
        <div className="mcontent">
          {this.props.renderHeader(this.resetPosition)}
          {this.props.renderModalBody()}
        </div>
        {this.props.renderConfigForm && id === "comprastartstop" ? (
          <ConfigurarStop />
        ) : null}
        {this.props.renderConfigForm && id === "vendastartstop" ? (
          <ConfigurarStopVenda />
        ) : null}
        {this.props.renderConfigComplementar && id === "multileg" ? (
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
            id={id}
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
  const { ordersExecReducer } = useStateStorePrincipal();
  const { filtrarOrdensAberto } = ordersExecReducer;

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
