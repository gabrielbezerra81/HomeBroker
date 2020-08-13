import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoCompraLimitada from "./FormInternoCompraLimitada";
import GraficoCompraLimitada from "./GraficoCompraLimitada";
import BodyHeaderCompraLimitada from "./BodyHeaderCompraLimitada";
import { ModalHeader } from "shared/componentes/PopupHeader";

class CompraLimitada extends React.Component {
  render() {
    return (
      <DraggableModal
        id={"compra_limitada"}
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
            eventSourceCotacao={this.props.eventSourceCotacao}
          />
        )}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderCompraLimitada />
    <Row>
      <FormInternoCompraLimitada ordem={ordem} />
      <GraficoCompraLimitada />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.compraLimitadaReducer.ativo,
  eventSourceCotacao: state.compraLimitadaReducer.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(CompraLimitada);

const ordem = {
  nome: "Compra Limitada",
  tipoOrdem: "buyLimit",
  tipoOferta: "C",
};
