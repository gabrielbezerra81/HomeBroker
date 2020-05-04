import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import FormInternoCompraStartStop from "./FormInternoCompraStartStop";
import GraficoCompraStartStop from "./GraficoCompraStartStop";
import BodyHeaderCompraStartStop from "./BodyHeaderCompraStartStop";
import { ModalHeader } from "components/utils/componentesUI/FormHeader";

class CompraStartStop extends React.Component {
  render() {
    return (
      <DraggableModal
        id="comprastartstop"
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
        renderConfigForm={this.props.config_compra}
        classConfigAberto={this.props.config_compra ? "configStopAberto" : null}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderCompraStartStop />
    <Row>
      <FormInternoCompraStartStop ordem={ordem} />
      <GraficoCompraStartStop />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  config_compra: state.appBoletasReducer.config_compra,
  ativo: state.compraStartStopReducer.ativo,
  eventSourceCotacao: state.compraStartStopReducer.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(CompraStartStop);

const ordem = {
  nome: "Compra Start Stop",
  tipoOrdem: "buyDoubleStart",
  tipoOferta: "C",
};
