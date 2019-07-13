import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../utils/BodyHeader";

class BodyHeaderCompraLimitada extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraLimitadaReducer.porcentagem
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraLimitada);
