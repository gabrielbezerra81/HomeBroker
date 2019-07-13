import React from "react";
import { connect } from "react-redux";
import { BodyHeaderAtivo } from "../../utils/BodyHeader";

class BodyHeaderCompraStartMovel extends React.Component {
  render() {
    return <BodyHeaderAtivo props={this.props} />;
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraStartMovel);
