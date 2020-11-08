import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoVendaAgendada from "./FormInternoVendaAgendada";
import GraficoVendaAgendada from "./GraficoVendaAgendada";
import BodyHeaderVendaAgendada from "./BodyHeaderVendaAgendada";
import { ModalHeader } from "shared/componentes/PopupHeader";
import { VENDA_AGENDADA_NAMESPACE } from "constants/ActionTypes";

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
            ativo={this.props.ativo}
            namespace={VENDA_AGENDADA_NAMESPACE}
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
      <FormInternoVendaAgendada ordem={ordem} />
      <GraficoVendaAgendada />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaAgendadaReducer.ativo,
});

export default connect(mapStateToProps, {})(VendaAgendada);

const ordem = {
  nome: "Venda Agendada",
  tipoOrdem: "sellWait",
  tipoOferta: "V",
};
