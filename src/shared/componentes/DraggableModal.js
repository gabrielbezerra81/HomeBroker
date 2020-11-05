import React, { Component } from "react";
import Draggable from "react-draggable";
import { connect } from "react-redux";

import ConfigurarStop from "screens/popups/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "screens/popups/venda/venda_StartStop/ConfigurarStopVenda";
import FiltrarOrdens from "screens/popups/ordens_em_execucao/FiltrarOrdens"; //posicaoFormCompraVenda
import ConfigComplementar from "screens/popups/multileg_/ConfigComplementar";
import { Resizable } from "re-resizable";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { StorePrincipalContext } from "redux/StoreCreation";

const limitY = 75;

class DragglableModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draggableData: { x: 0, y: 0 },
      bounds: undefined,
      limitX: 88,
    };
    this.resetPosition = this.resetPosition.bind(this);
    this.onStartDragging = this.onStartDragging.bind(this);
  }

  componentDidMount() {
    let limitX = 88;

    if (this.props.isOpenLeftUserMenu) {
      limitX = 220;
    }

    this.setState({ ...this.state, limitX });
  }

  componentDidUpdate(prevProps) {
    const { isOpenLeftUserMenu } = this.props;

    if (prevProps.isOpenLeftUserMenu !== isOpenLeftUserMenu) {
      let limitX = 88;

      if (isOpenLeftUserMenu) limitX = 220;

      this.setState({ ...this.state, limitX });
    }
  }

  resetPosition() {
    this.setState({ ...this.state, draggableData: { x: 0, y: 0 } });
  }

  onStartDragging(e, data) {
    if (!this.state.bounds) {
      const bound = data.node.getBoundingClientRect();

      this.setState({
        ...this.state,
        bounds: {
          left: -1 * bound.x + this.state.limitX,
          top: -1 * bound.y + limitY,
        },
      });
    }
  }

  render() {
    const { classConfigAberto, id, handle } = this.props;
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
        handle={handle ? handle : ".mheader"}
        position={this.state.draggableData}
        defaultPosition={{ x: 0, y: 0 }}
        onStart={this.onStartDragging}
        onDrag={(e, draggableData) => {
          e.preventDefault();
          this.setState({
            draggableData: draggableData,
          });
        }}
        bounds={this.state.bounds}
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

const mapStateToProps = (state) => ({
  isOpenLeftUserMenu: state.systemReducer.isOpenLeftUserMenu,
});

export default connect(mapStateToProps, {}, null, {
  context: StorePrincipalContext,
})(DragglableModal);

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
