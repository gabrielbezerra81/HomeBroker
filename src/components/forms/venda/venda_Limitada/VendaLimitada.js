import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaLimitada from "./FormInternoVendaLimitada";
import GraficoVendaLimitada from "./GraficoVendaLimitada";
import BodyHeaderVendaLimitada from "./BodyHeaderVendaLimitada";
import { ModalHeader } from "components/utils/FormHeader";

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
            handleShow={this.props.handleShow}
            ativo={this.props.ativo}
            close={this.props.close}
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
      <FormInternoVendaLimitada handleShow={props.handleShow} ordem={ordem} />
      <GraficoVendaLimitada handleShow={props.handleShow} />
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
