import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoCompraMercado from "./FormInternoCompraMercado";
import GraficoCompraMercado from "./GraficoCompraMercado";
import BodyHeaderCompraMercado from "./BodyHeaderCompraMercado";
import { ModalHeader } from "shared/componentes/PopupHeader";

class CompraMercado extends React.Component {
  render() {
    return (
      <DraggableModal
        id={"compramercado"}
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
            eventSourceCotacao={this.props.eventSourceCotacao}
          />
        )}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderCompraMercado />
    <Row>
      <FormInternoCompraMercado ordem={ordem} />
      <GraficoCompraMercado />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.compraMercadoReducer.ativo,
  eventSourceCotacao: state.compraMercadoReducer.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(CompraMercado);

const ordem = {
  nome: "Compra a Mercado",
  tipoOrdem: "buy",
  tipoOferta: "C",
};
