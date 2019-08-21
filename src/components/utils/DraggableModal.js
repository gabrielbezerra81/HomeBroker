import React, { Component } from "react";
import Draggable from "react-draggable";
import ConfigurarStop from "components/forms/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "components/forms/venda/venda_StartStop/ConfigurarStopVenda";
import { connect } from "react-redux";
import FiltrarOrdens from "components/forms/ordens_em_execucao/FiltrarOrdens"; //posicaoFormCompraVenda

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
    return (
      <Draggable
        enableUserSelectHack={false}
        handle=".mheader"
        position={this.state.draggableData}
        defaultPosition={{ x: 0, y: 0 }}
        onDrag={(e, draggableData) => {
          e.preventDefault();
          this.setState({
            draggableData: draggableData
          });
        }}
      >
        <div id={this.props.id} className={` ${this.props.classConfigAberto}`}>
          {this.props.renderDivFiltrarOrdens &&
          this.props.id === "ordens_execucao" ? (
            <FiltrarOrdens />
          ) : null}
          <div className="mcontent">
            {this.props.renderHeader(this.resetPosition)}
            {this.props.renderModalBody()}
          </div>
          {this.props.renderConfigForm &&
          this.props.id === "comprastartstop" ? (
            <ConfigurarStop className="mcontent configDiv" />
          ) : null}
          {this.props.renderConfigForm && this.props.id === "vendastartstop" ? (
            <ConfigurarStopVenda className="mcontent configDiv" />
          ) : null}
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(BSModal);

const aplicarPosicao = id => {
  const IDs = [];
  if (IDs.includes(id)) {
    return "posicaoFormCompraVenda";
  } else return "";
};
