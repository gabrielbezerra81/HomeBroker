import React from "react";
import { connect } from "react-redux";
import {BodyHeaderCompleto} from "../../../utils/BodyHeader";

class BodyHeaderVendaMercado extends React.Component {
  render() {
    return <BodyHeaderCompleto props={this.props} />;
  }
}

const mapStateToProps = state => ({
  porcentagem: state.vendaMercadoReducer.porcentagem
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderVendaMercado);
