import React from "react";

import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import FormInternoVendaGainReducao from "./FormInternoVendaGainReducao";
import GraficoVendaGainReducao from "./GraficoVendaGainReducao";
import BodyHeaderVendaGainReducao from "./BodyHeaderVendaGainReducao";
import { ModalHeader } from "shared/components/PopupHeader";
import { VENDA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import { shouldResetBoletaPositionForClass } from "modules/boletas/utils/handleBoletaPositionReset";

class VendaGainReducao extends React.Component {
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
        id="vendagainreducao"
        shouldResetPosition={this.state.shouldResetPosition}
        renderModalBody={() => modalBody()}
        renderHeader={(resetPosition) => (
          <ModalHeader
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            resetPosition={resetPosition}
            name={this.props.name}
            ativo={this.props.ativo}
            namespace={VENDA_GAINREDUCAO_NAMESPACE}
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
  appProps: state.appBoletasReducer.appProps,
});

export default connect(mapStateToProps, {})(VendaGainReducao);
