import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../utils/DraggableModal";
import FormInternoCompraAgendada from "./FormInternoCompraAgendada";
import GraficoCompraAgendada from "./GraficoCompraAgendada";
import BodyHeaderCompraAgendada from "./BodyHeaderCompraAgendada";
import { modalHeader } from "../../utils/FormHeader";
import { abrirFormularioAction } from "../../redux/actions/AppActions";

class CompraAgendada extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        renderModalBody={() => modalBody()}
        renderHeader={() =>
          modalHeader(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraAgendada />
    <Row>
      <FormInternoCompraAgendada />
      <GraficoCompraAgendada />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { abrirFormularioAction }
)(CompraAgendada);
