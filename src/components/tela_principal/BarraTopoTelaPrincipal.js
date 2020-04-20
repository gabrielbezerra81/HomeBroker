import React from "react";
import { Row, Col, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import imgCaraFeliz from "img/iconeCaraFeliz.png";
import {
  abrirFecharMenuLateralAction,
  mudarDadosLoginAction,
} from "components/redux/actions/TelaPrincipalActions";
import { ReactComponent as IconeAbrirMenu } from "img/more.svg";
import { ReactComponent as IconeHome } from "img/IconeHome.svg";
import { StorePrincipalContext } from "components/redux/StoreCreation";

class BarraTopoTelaPrincipal extends React.Component {
  render() {
    const { props } = this;

    return (
      <div className="divBarraTopo">
        <Row>
          <Col md={1}>
            <div
              className="iconesMostrarMenu divClicavel"
              onClick={(event) => {
                if (props.menuLateralAberto === true) {
                  props.abrirFecharMenuLateralAction(
                    event,
                    props.menuLateralAberto
                  );
                } else {
                  props.abrirFecharMenuLateralAction(
                    event,
                    props.menuLateralAberto
                  );
                }
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
          <Col md={0}>
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
                value={props.contaSelecionada.id}
                onChange={(e) => {
                  const novoID = Number(e.currentTarget.value);
                  const novaConta = props.conta.filter(
                    (conta) => conta.id === novoID
                  )[0];

                  props.mudarDadosLoginAction("contaSelecionada", novaConta);
                }}
              >
                {props.conta.map((conta, indice) => {
                  const gateway = conta.gateway ? `, ${conta.gateway}` : "";
                  return (
                    <option value={conta.id} key={`conta${indice}`}>
                      {`${conta.nome}, 
                    ${conta.sigla}, 
                    ${conta.numero}${gateway}`}
                    </option>
                  );
                })}
              </FormControl>
            </div>
          </Col>
          <Col md={0}>
            <img src={imgCaraFeliz} alt="cara feliz" className="mr-1" />
          </Col>
          <Col md={0}>
            <h6 className="">VALOR LIQUIDO:</h6>
          </Col>
          <Col md={2}>
            <h6 className="valorLiquido">{props.valorLiquido} R$</h6>
          </Col>
          <Col md={0}>
            <h6>COMPRAR:</h6>
          </Col>
          <Col>
            <h6 className="valorComprar">{props.valorComprar} R$</h6>
          </Col>
          <Col md={0}>
            <h4>{props.ativo}</h4>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  usuarioConectado: state.telaPrincipalReducer.usuarioConectado,
  valorLiquido: state.telaPrincipalReducer.valorLiquido,
  valorComprar: state.telaPrincipalReducer.valorComprar,
  ativo: state.telaPrincipalReducer.ativo,
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto,
  logado: state.telaPrincipalReducer.logado,
  conta: state.telaPrincipalReducer.conta,
  contaSelecionada: state.telaPrincipalReducer.contaSelecionada,
});

export default connect(
  mapStateToProps,
  {
    abrirFecharMenuLateralAction,
    mudarDadosLoginAction,
  },
  null,
  { context: StorePrincipalContext }
)(BarraTopoTelaPrincipal);
