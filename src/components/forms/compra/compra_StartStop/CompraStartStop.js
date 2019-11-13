import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraStartStop from "./FormInternoCompraStartStop";
import GraficoCompraStartStop from "./GraficoCompraStartStop";
import BodyHeaderCompraStartStop from "./BodyHeaderCompraStartStop";
import { modalHeader } from "components/utils/FormHeader";

class CompraStartStop extends React.Component {
  render() {
    return (
      <DraggableModal
        id="comprastartstop"
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
        renderConfigForm={this.props.config_compra}
        classConfigAberto={this.props.config_compra ? "configStopAberto" : null}
      />
    );
  }
}

const modalBody = props => (
  <div className="mbody">
    <BodyHeaderCompraStartStop />
    <Row>
      <
// @ts-ignore
      FormInternoCompraStartStop handleShow={props.handleShow} ordem={ordem} />
      <GraficoCompraStartStop />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  config_compra: state.SubAppReducer.config_compra,
  ativo: state.compraStartStopReducer.ativo,
  eventSourceCotacao: state.compraStartStopReducer.eventSourceCotacao
});

export default connect(mapStateToProps, {})(CompraStartStop);

const ordem = {
  nome: "Compra Start Stop",
  tipoOrdem: "buyDoubleStart",
  tipoOferta: "C"
};
