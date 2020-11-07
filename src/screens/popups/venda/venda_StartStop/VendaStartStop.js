import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoVendaStartStop from "./FormInternoVendaStartStop";
import GraficoVendaStartStop from "./GraficoVendaStartStop";
import BodyHeaderVendaStartStop from "./BodyHeaderVendaStartStop";
import { ModalHeader } from "shared/componentes/PopupHeader";
import {} from "redux/actions/boletas/AppBoletasActions";

class VendaStartStop extends React.Component {
  componentDidMount() {
    document.getElementById("vendastartstop").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendastartstop"
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
            esource_boletaQuote={this.props.esource_boletaQuote}
          />
        )}
        renderConfigForm={this.props.config_venda}
        classConfigAberto={this.props.config_venda ? "configStopAberto" : null}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="mbody">
    <BodyHeaderVendaStartStop />
    <Row>
      <FormInternoVendaStartStop ordem={ordem} />
      <GraficoVendaStartStop />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  config_venda: state.appBoletasReducer.config_venda,
  ativo: state.vendaStartStopReducer.ativo,
  esource_boletaQuote: state.vendaStartStopReducer.esource_boletaQuote,
});

export default connect(mapStateToProps, {})(VendaStartStop);

const ordem = {
  nome: "Venda Start Stop",
  tipoOrdem: "sellDoubleStart",
  tipoOferta: "V",
};
