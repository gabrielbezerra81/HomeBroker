import React from "react";
import { Row, Col, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import imgCaraFeliz from "assets/iconeCaraFeliz.png";
import {
  abrirFecharMenuLateralAction,
  mudarDadosLoginAction,
} from "redux/actions/telaPrincipal/TelaPrincipalActions";
import { ReactComponent as IconeAbrirMenu } from "assets/more.svg";
import { ReactComponent as IconeHome } from "assets/IconeHome.svg";
import { StorePrincipalContext } from "redux/StoreCreation";

class BarraTopoTelaPrincipal extends React.Component {
  render() {
    const { props } = this;
    const {
      selectedAccount,
      isOpenLeftUserMenu,
      accounts,
      liquidValue,
      buyingValue,
      broker,
    } = props;

    return (
      <div className="divBarraTopo">
        <Row>
          <Col md={1}>
            <div
              className="iconesMostrarMenu divClicavel"
              onClick={() => {
                props.abrirFecharMenuLateralAction(!isOpenLeftUserMenu);
              }}
            >
              <IconeAbrirMenu
                className="ml-2"
                fill="#aaa"
                height="35"
                width="35"
              ></IconeAbrirMenu>
            </div>
          </Col>
          <Col md={"0"}>
            <IconeHome height="25" fill="#eee"></IconeHome>
          </Col>
          <Col md={1}>
            <h6>HOME</h6>
          </Col>

          <Col md={3}>
            <div className="containerSelectConta">
              <h6>CONTA:</h6>
              <FormControl
                className="textInput"
                as="select"
                value={selectedAccount ? selectedAccount.id : ""}
                onChange={(e) => {
                  const novoID = Number(e.currentTarget.value);
                  const novaConta = accounts.filter(
                    (item) => item.id === novoID,
                  )[0];

                  props.mudarDadosLoginAction("selectedAccount", novaConta);
                }}
              >
                {accounts.map((item, indice) => {
                  const gateway = item.gateway ? `, ${item.gateway}` : "";
                  return (
                    <option value={item.id} key={`account${indice}`}>
                      {`${item.nome}, 
                    ${item.sigla}, 
                    ${item.numero}${gateway}`}
                    </option>
                  );
                })}
              </FormControl>
            </div>
          </Col>
          <Col md={"0"}>
            <img src={imgCaraFeliz} alt="cara feliz" className="mr-1" />
          </Col>
          <Col md={"0"}>
            <h6 className="">VALOR LIQUIDO:</h6>
          </Col>
          <Col md={2}>
            <h6 className="liquidValue">{liquidValue} R$</h6>
          </Col>
          <Col md={"0"}>
            <h6>COMPRAR:</h6>
          </Col>
          <Col>
            <h6 className="buyingValue">{buyingValue} R$</h6>
          </Col>
          <Col md={"0"}>
            <h4>{broker}</h4>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connectedUser: state.systemReducer.connectedUser,
  liquidValue: state.systemReducer.liquidValue,
  buyingValue: state.systemReducer.buyingValue,
  broker: state.systemReducer.broker,
  isOpenLeftUserMenu: state.systemReducer.isOpenLeftUserMenu,
  isLogged: state.systemReducer.isLogged,
  accounts: state.systemReducer.accounts,
  selectedAccount: state.systemReducer.selectedAccount,
});

export default connect(
  mapStateToProps,
  {
    abrirFecharMenuLateralAction,
    mudarDadosLoginAction,
  },
  null,
  { context: StorePrincipalContext },
)(BarraTopoTelaPrincipal);
