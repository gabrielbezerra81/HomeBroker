import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../../utils/BodyHeader";

class BodyHeaderVendaGainReducao extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.vendaGainReducao.porcentagem,
  cotacaoAtual: state.vendaGainReducao.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaGainReducao);
