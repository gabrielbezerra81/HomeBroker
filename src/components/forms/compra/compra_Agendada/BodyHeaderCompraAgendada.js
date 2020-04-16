import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "components/utils/BodyHeader";

class BodyHeaderCompraAgendada extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.compraAgendadaReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderCompraAgendada);
