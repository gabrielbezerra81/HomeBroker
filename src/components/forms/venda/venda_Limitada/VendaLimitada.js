import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaLimitada from "./FormInternoVendaLimitada";
import GraficoVendaLimitada from "./GraficoVendaLimitada";
import BodyHeaderVendaLimitada from "./BodyHeaderVendaLimitada";
import { modalHeader } from "components/utils/FormHeader";

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
    <BodyHeaderVendaLimitada />
    <Row>
      <FormInternoVendaLimitada handleShow={props.handleShow} ordem={ordem} />
      <GraficoVendaLimitada handleShow={props.handleShow} />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  ativo: state.vendaLimitadaReducer.ativo,
  eventSourceCotacao: state.vendaLimitadaReducer.eventSourceCotacao
});

export default connect(mapStateToProps, {})(VendaLimitada);

const ordem = {
  nome: "Venda Limitada",
  tipoOrdem: "sellLimit",
  tipoOferta: "V"
};
