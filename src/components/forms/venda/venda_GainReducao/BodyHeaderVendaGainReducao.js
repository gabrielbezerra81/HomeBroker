import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderVendaGainReducao extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  dadosPesquisa: state.vendaGainReducao.dadosPesquisa
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaGainReducao);
