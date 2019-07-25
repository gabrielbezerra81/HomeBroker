import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderVendaStartStop extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.vendaStartStopReducer.porcentagem,
  cotacaoAtual: state.vendaStartStopReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaStartStop);
