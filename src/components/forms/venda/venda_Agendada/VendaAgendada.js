import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaAgendada from "./FormInternoVendaAgendada";
import GraficoVendaAgendada from "./GraficoVendaAgendada";
import BodyHeaderVendaAgendada from "./BodyHeaderVendaAgendada";
import { modalHeader } from "components/utils/FormHeader";

class VendaAgendada extends React.Component {
  componentDidMount() {
    document.getElementById("vendaagendada").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendaagendada"
        renderModalBody={() => modalBody(this.props)}
        renderHeader={resetPosition =>
          modalHeader(
            this.props,
            this.props.headerTitle,
            "border-green",
            resetPosition
          )
        }
      />
    );
  }
}

const modalBody = props => (
  <div className="mbody">
    <BodyHeaderVendaAgendada />
    <Row>
      <FormInternoVendaAgendada handleShow={props.handleShow} ordem={ordem} />
      <GraficoVendaAgendada handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(VendaAgendada);

const ordem = {
  nome: "Venda Agendada",
  tipoOrdem: "sellWait",
  tipoOferta: "V"
};
