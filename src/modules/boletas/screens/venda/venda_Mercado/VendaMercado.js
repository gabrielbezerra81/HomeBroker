import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoVendaMercado from "./FormInternoVendaMercado";
import GraficoVendaMercado from "./GraficoVendaMercado";
import BodyHeaderVendaMercado from "./BodyHeaderVendaMercado";
import { ModalHeader } from "shared/components/PopupHeader";
import { VENDA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { shouldResetBoletaPositionForClass } from "modules/boletas/utils/handleBoletaPositionReset";

class VendaMercado extends React.Component {
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
    document.getElementById("vendamercado").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id={"vendamercado"}
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
            namespace={VENDA_MERCADO_NAMESPACE}
          />
        )}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderVendaMercado />
    <Row>
      <FormInternoVendaMercado ordem={ordem} />
      <GraficoVendaMercado />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaMercadoReducer.ativo,
  appProps: state.appBoletasReducer.appProps,
});

export default connect(mapStateToProps, {})(VendaMercado);

const ordem = {
  nome: "Venda a Mercado",
  tipoOrdem: "sell",
  tipoOferta: "V",
};
