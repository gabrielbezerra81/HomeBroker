import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoVendaMercado from "./FormInternoVendaMercado";
import GraficoVendaMercado from "./GraficoVendaMercado";
import BodyHeaderVendaMercado from "./BodyHeaderVendaMercado";
import { ModalHeader } from "shared/componentes/PopupHeader";
import { VENDA_MERCADO_NAMESPACE } from "constants/ActionTypes";

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
        renderHeader={(resetPosition) => (
          <ModalHeader
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            resetPosition={resetPosition}
            name={this.props.name}
            ativo={this.props.ativo}
            namespace={VENDA_MERCADO_NAMESPACE}
          />
        )}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderVendaMercado />
    <Row>
      <FormInternoVendaMercado ordem={ordem} />
      <GraficoVendaMercado />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaMercadoReducer.ativo,
});

export default connect(mapStateToProps, {})(VendaMercado);

const ordem = {
  nome: "Venda a Mercado",
  tipoOrdem: "sell",
  tipoOferta: "V",
};
