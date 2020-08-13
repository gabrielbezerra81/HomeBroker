import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "shared/componentes/PopupBodyHeader";

class BodyHeaderVendaGainReducao extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.vendaGainReducao.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderVendaGainReducao);
