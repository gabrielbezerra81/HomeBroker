import React from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import FormInternoCompraAgendada from "./FormInternoCompraAgendada";
import GraficoCompraAgendada from "./GraficoCompraAgendada";
import BodyHeaderCompraAgendada from "./BodyHeaderCompraAgendada";
import { ModalHeader } from "components/utils/componentesUI/FormHeader";

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
    <BodyHeaderCompraAgendada />
    <Row>
      <FormInternoCompraAgendada ordem={ordem} />
      <GraficoCompraAgendada />
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
