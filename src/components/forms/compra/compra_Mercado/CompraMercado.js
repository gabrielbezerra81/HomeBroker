import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraMercado from "./FormInternoCompraMercado";
import GraficoCompraMercado from "./GraficoCompraMercado";
import BodyHeaderCompraMercado from "./BodyHeaderCompraMercado";
import { ModalHeader } from "components/utils/FormHeader";

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
            handleShow={this.props.handleShow}
            ativo={this.props.ativo}
            close={this.props.close}
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
      <FormInternoCompraMercado handleShow={props.handleShow} ordem={ordem} />
      <GraficoCompraMercado handleShow={props.handleShow} />
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
