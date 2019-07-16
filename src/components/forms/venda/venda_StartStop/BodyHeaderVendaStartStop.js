import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "../../../utils/BodyHeader";

class BodyHeaderVendaStartStop extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.vendaStartStopReducer.porcentagem
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaStartStop);
