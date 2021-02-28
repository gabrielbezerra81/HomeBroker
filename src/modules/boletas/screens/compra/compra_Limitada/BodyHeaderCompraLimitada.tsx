import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { BodyHeaderCompleto } from "shared/components/PopupBodyHeader";
import { BoletasState } from "redux/reducers";

class BodyHeaderCompraLimitada extends React.Component<PropsFromRedux> {
  render() {
    return <BodyHeaderCompleto dadosPesquisa={this.props.dadosPesquisa} />;
  }
}

const mapStateToProps = (state: BoletasState) => ({
  dadosPesquisa: state.compraLimitadaReducer.dadosPesquisa,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BodyHeaderCompraLimitada);
