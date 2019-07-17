import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../utils/DraggableModal";
import FormInternoCompraMercado from "./FormInternoCompraMercado";
import GraficoCompraMercado from "./GraficoCompraMercado";
import BodyHeaderCompraMercado from "./BodyHeaderCompraMercado";
import { modalHeader } from "../../utils/FormHeader";
import { abrirFormularioAction } from "../../redux/actions/AppActions";

class CompraMercado extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id={"compramercado"}
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
    <BodyHeaderCompraMercado />
    <Row>
      <FormInternoCompraMercado />
      <GraficoCompraMercado />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(CompraMercado);
