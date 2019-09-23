import React from "react";
import { connect } from "react-redux";
import { BodyHeaderAtivo } from "components/utils/BodyHeader";

class BodyHeaderCompraStartMovel extends React.Component {
  render() {
    return <BodyHeaderAtivo props={this.props} />;
  }
}

const mapStateToProps = state => ({
  dadosPesquisa: state.compraStartMovelReducer.dadosPesquisa
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraStartMovel);
