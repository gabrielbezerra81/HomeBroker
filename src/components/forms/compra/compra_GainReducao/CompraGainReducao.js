import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoCompraGainReducao from "./FormInternoCompraGainReducao";
import GraficoCompraGainReducao from "./GraficoCompraGainReducao";
import BodyHeaderCompraGainReducao from "./BodyHeaderCompraGainReducao";
import { modalHeader } from "components/utils/FormHeader";

class CompraGainReducao extends React.Component {
  render() {
    return (
      <DraggableModal
        id="compragainreducao"
        renderModalBody={() => modalBody()}
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

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraGainReducao />
    <Row>
      <FormInternoCompraGainReducao />
      <GraficoCompraGainReducao />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  ativo: state.compraGainReducao.ativo,
  eventSourceCotacao: state.compraGainReducao.eventSourceCotacao
});

export default connect(
  mapStateToProps,
  {}
)(CompraGainReducao);
