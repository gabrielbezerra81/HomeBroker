import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderCompraLimitada extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraLimitadaReducer.porcentagem,
  cotacaoAtual: state.compraLimitadaReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraLimitada);
