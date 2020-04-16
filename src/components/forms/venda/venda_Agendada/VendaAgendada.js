import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaAgendada from "./FormInternoVendaAgendada";
import GraficoVendaAgendada from "./GraficoVendaAgendada";
import BodyHeaderVendaAgendada from "./BodyHeaderVendaAgendada";
import { ModalHeader } from "components/utils/FormHeader";

class VendaAgendada extends React.Component {
  componentDidMount() {
    document.getElementById("vendaagendada").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendaagendada"
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
    <BodyHeaderVendaAgendada />
    <Row>
      <FormInternoVendaAgendada handleShow={props.handleShow} ordem={ordem} />
      <GraficoVendaAgendada handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaAgendadaReducer.ativo,
  eventSourceCotacao: state.vendaAgendadaReducer.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(VendaAgendada);

const ordem = {
  nome: "Venda Agendada",
  tipoOrdem: "sellWait",
  tipoOferta: "V",
};
