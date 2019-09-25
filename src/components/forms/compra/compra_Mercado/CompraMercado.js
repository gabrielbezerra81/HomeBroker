import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraMercado from "./FormInternoCompraMercado";
import GraficoCompraMercado from "./GraficoCompraMercado";
import BodyHeaderCompraMercado from "./BodyHeaderCompraMercado";
import { modalHeader } from "components/utils/FormHeader";

class CompraMercado extends React.Component {
  render() {
    return (
      <DraggableModal
        id={"compramercado"}
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        headerClass="border-green"
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
    <BodyHeaderCompraMercado />
    <Row>
      <FormInternoCompraMercado handleShow={props.handleShow} ordem={ordem} />
      <GraficoCompraMercado handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(CompraMercado);

const ordem = {
  nome: "Compra a Mercado",
  tipoOrdem: "buy",
  tipoOferta: "C"
};
