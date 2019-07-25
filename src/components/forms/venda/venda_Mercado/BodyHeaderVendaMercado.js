import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderVendaMercado extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.vendaMercadoReducer.porcentagem,
  cotacaoAtual: state.vendaMercadoReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaMercado);
