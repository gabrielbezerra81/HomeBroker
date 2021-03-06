import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoCompraGainReducao from "./FormInternoCompraGainReducao";
import GraficoCompraGainReducao from "./GraficoCompraGainReducao";
import BodyHeaderCompraGainReducao from "./BodyHeaderCompraGainReducao";
import { ModalHeader } from "shared/components/PopupHeader";
import { COMPRA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import { shouldResetBoletaPositionForClass } from "modules/boletas/utils/handleBoletaPositionReset";

class CompraGainReducao extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldResetPosition: false,
    };
  }

  componentDidUpdate() {
    shouldResetBoletaPositionForClass(this);
  }

  render() {
    return (
      <DraggableModal
        id="compragainreducao"
        renderModalBody={() => modalBody()}
        shouldResetPosition={this.state.shouldResetPosition}
        renderHeader={(resetPosition) => (
          <ModalHeader
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            resetPosition={resetPosition}
            name={this.props.name}
            ativo={this.props.ativo}
            namespace={COMPRA_GAINREDUCAO_NAMESPACE}
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
  appProps: state.appBoletasReducer.appProps,
});

export default connect(mapStateToProps, {})(CompraGainReducao);
