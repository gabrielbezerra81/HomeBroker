import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraLimitada from "./FormInternoCompraLimitada";
import GraficoCompraLimitada from "./GraficoCompraLimitada";
import BodyHeaderCompraLimitada from "./BodyHeaderCompraLimitada";
import { modalHeader } from "components/utils/FormHeader";

class CompraLimitada extends React.Component {
  render() {
    return (
      <DraggableModal
        id={"compra_limitada"}
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
    <BodyHeaderCompraLimitada />
    <Row>
      <FormInternoCompraLimitada handleShow={props.handleShow} ordem={ordem} />
      <GraficoCompraLimitada handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  ativo: state.compraLimitadaReducer.ativo,
  eventSourceCotacao: state.compraLimitadaReducer.eventSourceCotacao
});

export default connect(
  mapStateToProps,
  {}
)(CompraLimitada);

const ordem = {
  nome: "Compra Limitada",
  tipoOrdem: "buyLimit",
  tipoOferta: "C"
};
