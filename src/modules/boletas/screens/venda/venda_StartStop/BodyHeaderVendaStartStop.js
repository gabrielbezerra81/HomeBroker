import React from "react";
import { connect } from "react-redux";
import { BodyHeaderCompleto } from "shared/components/PopupBodyHeader";

class BodyHeaderVendaStartStop extends React.Component {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state) => ({
  dadosPesquisa: state.vendaStartStopReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {})(BodyHeaderVendaStartStop);
