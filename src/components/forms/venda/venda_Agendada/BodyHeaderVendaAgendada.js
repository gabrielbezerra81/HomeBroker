import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../../utils/BodyHeader";

class BodyHeaderVendaAgendada extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.vendaAgendadaReducer.porcentagem,
  cotacaoAtual: state.vendaAgendadaReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaAgendada);
