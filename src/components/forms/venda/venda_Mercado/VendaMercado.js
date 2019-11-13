import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaMercado from "./FormInternoVendaMercado";
import GraficoVendaMercado from "./GraficoVendaMercado";
import BodyHeaderVendaMercado from "./BodyHeaderVendaMercado";
import { modalHeader } from "components/utils/FormHeader";

class VendaMercado extends React.Component {
  componentDidMount() {
    document.getElementById("vendamercado").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id={"vendamercado"}
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
    <BodyHeaderVendaMercado />
    <Row>
      <FormInternoVendaMercado handleShow={props.handleShow} ordem={ordem} />
      <GraficoVendaMercado handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  ativo: state.vendaMercadoReducer.ativo,
  eventSourceCotacao: state.vendaMercadoReducer.eventSourceCotacao
});

export default connect(mapStateToProps, {})(VendaMercado);

const ordem = {
  nome: "Venda a Mercado",
  tipoOrdem: "sell",
  tipoOferta: "V"
};
