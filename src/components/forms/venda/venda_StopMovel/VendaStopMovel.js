import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../../utils/DraggableModal";
import FormInternoVendaStopMovel from "./FormInternoVendaStopMovel";
import GraficoVendaStopMovel from "./GraficoVendaStopMovel";
import BodyHeaderVendaStopMovel from "./BodyHeaderVendaStopMovel";
import { modalHeader } from "../../../utils/FormHeader";
import { abrirFormularioAction } from "../../../redux/actions/AppActions";

class VendaStopMovel extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="vendastopmovel"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
        headerClass="border-green"
        renderHeader={() =>
          modalHeader(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderVendaStopMovel />
    <Row>
      <FormInternoVendaStopMovel />
      <GraficoVendaStopMovel />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(VendaStopMovel);
