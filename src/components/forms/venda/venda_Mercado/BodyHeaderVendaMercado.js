import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/componentesUI/BodyHeader";

class BodyHeaderVendaMercado extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.vendaMercadoReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderVendaMercado);
