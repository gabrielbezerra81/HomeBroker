import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoCompraStartMovel from "./FormInternoCompraStartMovel";
import GraficoCompraStartMovel from "./GraficoCompraStartMovel";
import BodyHeaderCompraStartMovel from "./BodyHeaderCompraStartMovel";
import { ModalHeader } from "shared/componentes/PopupHeader";

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
            esource_boletaQuote={this.props.esource_boletaQuote}
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
  esource_boletaQuote: state.compraStartMovelReducer.esource_boletaQuote,
});

export default connect(mapStateToProps, {})(CompraStarMovel);

const ordem = {
  nome: "Compra Stop Móvel",
  tipoOrdem: "buyMovel",
  tipoOferta: "C",
};
