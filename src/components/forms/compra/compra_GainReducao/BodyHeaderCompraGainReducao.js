import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderCompraGainReducao extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.compraGainReducao.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderCompraGainReducao);
