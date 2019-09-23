import React from "react";
import { connect } from "react-redux";
import { BodyHeaderAtivo } from "components/utils/BodyHeader";

class BodyHeaderVendaStopMovel extends React.Component {
  render() {
    return <BodyHeaderAtivo props={this.props} />;
  }
}

const mapStateToProps = state => ({
  dadosPesquisa: state.vendaStopMovel.dadosPesquisa
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaStopMovel);
