import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "../../utils/BodyHeader";

class BodyHeaderCompraStartStop extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraStartStopReducer.porcentagem,
  cotacaoAtual: state.compraStartStopReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraStartStop);
