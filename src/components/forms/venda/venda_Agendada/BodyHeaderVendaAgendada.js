import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderVendaAgendada extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  dadosPesquisa: state.vendaAgendadaReducer.dadosPesquisa
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaAgendada);
