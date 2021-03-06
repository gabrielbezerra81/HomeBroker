import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoVendaStartStop from "./FormInternoVendaStartStop";
import GraficoVendaStartStop from "./GraficoVendaStartStop";
import BodyHeaderVendaStartStop from "./BodyHeaderVendaStartStop";
import { ModalHeader } from "shared/components/PopupHeader";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { shouldResetBoletaPositionForClass } from "modules/boletas/utils/handleBoletaPositionReset";

class VendaStartStop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldResetPosition: false,
    };
  }

  componentDidUpdate() {
    shouldResetBoletaPositionForClass(this);
  }

  componentDidMount() {
    document.getElementById("vendastartstop").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendastartstop"
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
            namespace={VENDA_STARTSTOP_NAMESPACE}
          />
        )}
        renderConfigForm={this.props.config_venda}
        classConfigAberto={this.props.config_venda ? "configStopAberto" : null}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderVendaStartStop />
    <Row>
      <FormInternoVendaStartStop ordem={ordem} />
      <GraficoVendaStartStop />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  config_venda: state.appBoletasReducer.config_venda,
  ativo: state.vendaStartStopReducer.ativo,
  appProps: state.appBoletasReducer.appProps,
});

export default connect(mapStateToProps, {})(VendaStartStop);

const ordem = {
  nome: "Venda Start Stop",
  tipoOrdem: "sellDoubleStart",
  tipoOferta: "V",
};
