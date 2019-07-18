import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../utils/BodyHeader";

class BodyHeaderCompraMercado extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraMercadoReducer.porcentagem,
  cotacaoAtual: state.compraMercadoReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraMercado);
