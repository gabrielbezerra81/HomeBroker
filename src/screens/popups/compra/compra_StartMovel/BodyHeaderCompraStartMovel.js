import React from "react";
import { connect } from "react-redux";
import { BodyHeaderAtivo } from "shared/componentes/PopupBodyHeader";

class BodyHeaderCompraStartMovel extends React.Component {
  render() {
    return <BodyHeaderAtivo dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.compraStartMovelReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderCompraStartMovel);