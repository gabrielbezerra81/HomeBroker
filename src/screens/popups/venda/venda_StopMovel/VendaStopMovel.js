import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoVendaStopMovel from "./FormInternoVendaStopMovel";
import GraficoVendaStopMovel from "./GraficoVendaStopMovel";
import BodyHeaderVendaStopMovel from "./BodyHeaderVendaStopMovel";
import { ModalHeader } from "shared/componentes/PopupHeader";

class VendaStopMovel extends React.Component {
  componentDidMount() {
    document.getElementById("vendastopmovel").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendastopmovel"
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
    <BodyHeaderVendaStopMovel />
    <Row>
      <FormInternoVendaStopMovel ordem={ordem} />
      <GraficoVendaStopMovel />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaStopMovel.ativo,
  esource_boletaQuote: state.vendaStopMovel.esource_boletaQuote,
});

export default connect(mapStateToProps, {})(VendaStopMovel);

const ordem = {
  nome: "Venda Stop Móvel",
  tipoOrdem: "sellMovel",
  tipoOferta: "V",
};
