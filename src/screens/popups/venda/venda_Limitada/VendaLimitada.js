import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoVendaLimitada from "./FormInternoVendaLimitada";
import GraficoVendaLimitada from "./GraficoVendaLimitada";
import BodyHeaderVendaLimitada from "./BodyHeaderVendaLimitada";
import { ModalHeader } from "shared/componentes/PopupHeader";

class VendaLimitada extends React.Component {
  componentDidMount() {
    document.getElementById("vendalimitada").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id={"vendalimitada"}
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
    <BodyHeaderVendaLimitada />
    <Row>
      <FormInternoVendaLimitada ordem={ordem} />
      <GraficoVendaLimitada />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaLimitadaReducer.ativo,
  eventSourceCotacao: state.vendaLimitadaReducer.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(VendaLimitada);

const ordem = {
  nome: "Venda Limitada",
  tipoOrdem: "sellLimit",
  tipoOferta: "V",
};
