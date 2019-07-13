import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../utils/BodyHeader";

class BodyHeaderCompraAgendada extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraAgendadaReducer.porcentagem
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraAgendada);
