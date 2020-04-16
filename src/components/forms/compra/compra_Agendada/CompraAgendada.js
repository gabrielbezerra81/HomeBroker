import React from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraAgendada from "./FormInternoCompraAgendada";
import GraficoCompraAgendada from "./GraficoCompraAgendada";
import BodyHeaderCompraAgendada from "./BodyHeaderCompraAgendada";
import { ModalHeader } from "components/utils/FormHeader";

class CompraAgendada extends React.Component {
  render() {
    return (
      <DraggableModal
        id="compra_agendada"
        renderModalBody={() => modalBody(this.props)}
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
    <BodyHeaderCompraAgendada />
    <Row>
      <FormInternoCompraAgendada handleShow={props.handleShow} ordem={ordem} />
      <GraficoCompraAgendada handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.compraAgendadaReducer.ativo,
  eventSourceCotacao: state.compraAgendadaReducer.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(CompraAgendada);

const ordem = {
  nome: "Compra Agendada",
  tipoOrdem: "buyWait",
  tipoOferta: "C",
};
