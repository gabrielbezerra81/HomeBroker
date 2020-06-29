import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import FormInternoCompraGainReducao from "./FormInternoCompraGainReducao";
import GraficoCompraGainReducao from "./GraficoCompraGainReducao";
import BodyHeaderCompraGainReducao from "./BodyHeaderCompraGainReducao";
import { ModalHeader } from "components/utils/componentesUI/FormHeader";

class CompraGainReducao extends React.Component {
  render() {
    return (
      <DraggableModal
        id="compragainreducao"
        renderModalBody={() => modalBody()}
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

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraGainReducao />
    <Row>
      <FormInternoCompraGainReducao />
      <GraficoCompraGainReducao />
    </Row>
  </div>
);

const mapStateToProps = (state) => ({
  ativo: state.compraGainReducao.ativo,
  eventSourceCotacao: state.compraGainReducao.eventSourceCotacao,
});

export default connect(mapStateToProps, {})(CompraGainReducao);
