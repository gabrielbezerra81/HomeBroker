import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoCompraStartMovel from "./FormInternoCompraStartMovel";
import GraficoCompraStartMovel from "./GraficoCompraStartMovel";
import BodyHeaderCompraStartMovel from "./BodyHeaderCompraStartMovel";
import { ModalHeader } from "shared/components/PopupHeader";
import { COMPRA_STARTMOVEL_NAMESPACE } from "constants/ActionTypes";

class CompraStarMovel extends React.Component {
  render() {
    return (
      <DraggableModal
        id="comprastartmovel"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
        headerClass="border-green"
        renderHeader={(resetPosition) => (
          <ModalHeader
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            resetPosition={resetPosition}
            name={this.props.name}
            ativo={this.props.ativo}
            namespace={COMPRA_STARTMOVEL_NAMESPACE}
          />
        )}
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraStartMovel />
    <Row>
      <FormInternoCompraStartMovel ordem={ordem} />
      <GraficoCompraStartMovel />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.compraStartMovelReducer.ativo,
});

export default connect(mapStateToProps, {})(CompraStarMovel);

const ordem = {
  nome: "Compra Stop Móvel",
  tipoOrdem: "buyMovel",
  tipoOferta: "C",
};
