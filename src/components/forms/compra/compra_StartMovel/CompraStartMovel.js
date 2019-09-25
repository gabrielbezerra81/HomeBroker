import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraStartMovel from "./FormInternoCompraStartMovel";
import GraficoCompraStartMovel from "./GraficoCompraStartMovel";
import BodyHeaderCompraStartMovel from "./BodyHeaderCompraStartMovel";
import { modalHeader } from "components/utils/FormHeader";

class CompraStarMovel extends React.Component {
  render() {
    return (
      <DraggableModal
        id="comprastartmovel"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
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

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraStartMovel />
    <Row>
      <FormInternoCompraStartMovel ordem={ordem} />
      <GraficoCompraStartMovel />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(CompraStarMovel);

const ordem = {
  nome: "Compra Stop Movel",
  tipoOrdem: "buyMovel",
  tipoOferta: "C"
};
