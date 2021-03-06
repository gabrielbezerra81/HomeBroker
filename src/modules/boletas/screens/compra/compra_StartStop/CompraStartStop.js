import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoCompraStartStop from "./FormInternoCompraStartStop";
import GraficoCompraStartStop from "./GraficoCompraStartStop";
import BodyHeaderCompraStartStop from "./BodyHeaderCompraStartStop";
import { ModalHeader } from "shared/components/PopupHeader";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { shouldResetBoletaPositionForClass } from "modules/boletas/utils/handleBoletaPositionReset";

class CompraStartStop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldResetPosition: false,
    };
  }

  componentDidUpdate() {
    shouldResetBoletaPositionForClass(this);
  }

  render() {
    return (
      <DraggableModal
        id="comprastartstop"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        shouldResetPosition={this.state.shouldResetPosition}
        headerClass="border-green"
        renderHeader={(resetPosition) => (
          <ModalHeader
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            resetPosition={resetPosition}
            name={this.props.name}
            ativo={this.props.ativo}
            namespace={COMPRA_STARTSTOP_NAMESPACE}
          />
        )}
        renderConfigForm={this.props.config_compra}
        classConfigAberto={this.props.config_compra ? "configStopAberto" : null}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderCompraStartStop />
    <Row>
      <FormInternoCompraStartStop ordem={ordem} />
      <GraficoCompraStartStop />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  config_compra: state.appBoletasReducer.config_compra,
  ativo: state.compraStartStopReducer.ativo,
  appProps: state.appBoletasReducer.appProps,
});

export default connect(mapStateToProps, {})(CompraStartStop);

const ordem = {
  nome: "Compra Start Stop",
  tipoOrdem: "buyDoubleStart",
  tipoOferta: "C",
};
