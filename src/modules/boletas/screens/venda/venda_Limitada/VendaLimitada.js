import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoVendaLimitada from "./FormInternoVendaLimitada";
import GraficoVendaLimitada from "./GraficoVendaLimitada";
import BodyHeaderVendaLimitada from "./BodyHeaderVendaLimitada";
import { ModalHeader } from "shared/components/PopupHeader";
import { VENDA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { shouldResetBoletaPositionForClass } from "modules/boletas/utils/handleBoletaPositionReset";

class VendaLimitada extends React.Component {
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
    document.getElementById("vendalimitada").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id={"vendalimitada"}
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
            namespace={VENDA_LIMITADA_NAMESPACE}
          />
        )}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderVendaLimitada />
    <Row>
      <FormInternoVendaLimitada ordem={ordem} />
      <GraficoVendaLimitada />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaLimitadaReducer.ativo,
  appProps: state.appBoletasReducer.appProps,
});

export default connect(mapStateToProps, {})(VendaLimitada);

const ordem = {
  nome: "Venda Limitada",
  tipoOrdem: "sellLimit",
  tipoOferta: "V",
};
