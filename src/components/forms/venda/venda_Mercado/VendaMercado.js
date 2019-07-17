import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../../utils/DraggableModal";
import FormInternoVendaMercado from "./FormInternoVendaMercado";
import GraficoVendaMercado from "./GraficoVendaMercado";
import BodyHeaderVendaMercado from "./BodyHeaderVendaMercado";
import { modalHeader } from "../../../utils/FormHeader";
import { abrirFormularioAction } from "../../../redux/actions/AppActions";

class VendaMercado extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id={"vendamercado"}
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
    <BodyHeaderVendaMercado />
    <Row>
      <FormInternoVendaMercado />
      <GraficoVendaMercado />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(VendaMercado);
