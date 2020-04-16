import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaGainReducao from "./FormInternoVendaGainReducao";
import GraficoVendaGainReducao from "./GraficoVendaGainReducao";
import BodyHeaderVendaGainReducao from "./BodyHeaderVendaGainReducao";
import { ModalHeader } from "components/utils/FormHeader";

class VendaGainReducao extends React.Component {
  render() {
    return (
      <DraggableModal
        id="vendagainreducao"
        renderModalBody={() => modalBody()}
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

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderVendaGainReducao />
    <Row>
      <FormInternoVendaGainReducao />
      <GraficoVendaGainReducao />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.vendaGainReducao.ativo,
  eventSourceCotacao: state.vendaGainReducao.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(VendaGainReducao);
