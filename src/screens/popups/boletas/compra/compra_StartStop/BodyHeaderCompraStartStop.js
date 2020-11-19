import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "shared/componentes/PopupBodyHeader";

class BodyHeaderCompraStartStop extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.compraStartStopReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderCompraStartStop);
