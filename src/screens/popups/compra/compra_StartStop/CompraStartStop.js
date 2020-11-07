import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoCompraStartStop from "./FormInternoCompraStartStop";
import GraficoCompraStartStop from "./GraficoCompraStartStop";
import BodyHeaderCompraStartStop from "./BodyHeaderCompraStartStop";
import { ModalHeader } from "shared/componentes/PopupHeader";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";

class CompraStartStop extends React.Component {
  render() {
    return (
      <DraggableModal
        id="comprastartstop"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
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
});

export default connect(mapStateToProps, {})(CompraStartStop);

const ordem = {
  nome: "Compra Start Stop",
  tipoOrdem: "buyDoubleStart",
  tipoOferta: "C",
};
