import React, { Component } from "react";
import Draggable from "react-draggable";
import { connect } from "react-redux";

import ConfigurarStop from "modules/boletas/screens/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "modules/boletas/screens/venda/venda_StartStop/ConfigurarStopVenda";
import FiltrarOrdens from "modules/ordersExec/screens/FiltrarOrdens"; //posicaoFormCompraVenda
import ConfigComplementar from "modules/multileg/screens/ConfigComplementar";
import { Resizable } from "re-resizable";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { StorePrincipalContext } from "redux/StoreCreation";
// import loadPopupPosition from "shared/utils/PopupPosition/loadPopupPosition";
import savePopupPositionOnDragEnd from "shared/utils/PopupPosition/savePopupPositionOnDragEnd";

const limitY = 75;

class DragglableModal extends Component {
  constructor(props) {
    super(props);

    // const position = loadPopupPosition(this.props.id);

    console.log(this.props.name);

    this.state = {
      position: { x: 0, y: 0 },
      bounds: undefined,
      limitX: 88,
    };
    this.resetPosition = this.resetPosition.bind(this);
    this.onStartDragging = this.onStartDragging.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onStopDragging = this.onStopDragging.bind(this);
  }

  componentDidMount() {
    let limitX = 88;

    if (this.props.isOpenLeftUserMenu) {
      limitX = 220;
    }

    this.setState({ ...this.state, limitX });
  }

  componentDidUpdate(prevProps) {
    const { isOpenLeftUserMenu, shouldResetPosition } = this.props;

    if (
      typeof shouldResetPosition === "boolean" &&
      shouldResetPosition &&
      !prevProps.shouldResetPosition
    ) {
      this.setState({ ...this.state, position: { x: 0, y: 0 } });
    }

    if (prevProps.isOpenLeftUserMenu !== isOpenLeftUserMenu) {
      let limitX = 88;

      if (isOpenLeftUserMenu) limitX = 220;

      this.setState({ ...this.state, limitX });
    }
  }

  resetPosition() {
    this.setState({ ...this.state, position: { x: 0, y: 0 } });
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

  onDrag(e, data) {
    e.preventDefault();

    const { x, y } = data;

    this.setState({
      position: { x, y },
    });
  }

  onStopDragging() {
    const { position } = this.state;

    savePopupPositionOnDragEnd({
      id: this.props.id,
      position: {
        x: position.x,
        y: position.y,
      },
    });
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
        {this.props.renderConfigComplementar &&
        ["multileg", "conditionalMultileg"].includes(id) ? (
          <ConfigComplementar />
        ) : null}
      </div>
    );

    return (
      <Draggable
        enableUserSelectHack={false}
        handle={handle ? handle : ".mheader"}
        position={this.state.position}
        defaultPosition={{ x: 0, y: 0 }}
        onStart={this.onStartDragging}
        onDrag={this.onDrag}
        onStop={this.onStopDragging}
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
