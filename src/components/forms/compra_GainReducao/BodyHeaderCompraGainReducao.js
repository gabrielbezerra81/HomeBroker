import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../utils/BodyHeader";

class BodyHeaderCompraGainReducao extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraGainReducao.porcentagem,
  cotacaoAtual: state.compraGainReducao.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraGainReducao);
