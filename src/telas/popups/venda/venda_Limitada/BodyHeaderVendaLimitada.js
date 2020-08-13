import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "shared/componentes/PopupBodyHeader";

class BodyHeaderVendaLimitada extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.vendaLimitadaReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderVendaLimitada);
