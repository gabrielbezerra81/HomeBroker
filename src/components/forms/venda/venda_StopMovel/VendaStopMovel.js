import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaStopMovel from "./FormInternoVendaStopMovel";
import GraficoVendaStopMovel from "./GraficoVendaStopMovel";
import BodyHeaderVendaStopMovel from "./BodyHeaderVendaStopMovel";
import { ModalHeader } from "components/utils/FormHeader";

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
            eventSourceCotacao={this.props.eventSourceCotacao}
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
  eventSourceCotacao: state.vendaStopMovel.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(VendaStopMovel);

const ordem = {
  nome: "Venda Stop Móvel",
  tipoOrdem: "sellMovel",
  tipoOferta: "V",
};
