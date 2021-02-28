import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "shared/components/PopupBodyHeader";

class BodyHeaderCompraMercado extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.compraMercadoReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderCompraMercado);
