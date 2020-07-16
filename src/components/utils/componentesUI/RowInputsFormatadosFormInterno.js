import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import InputFormatado, {
  boxShadowInput,
} from "components/utils/componentesUI/InputFormatado";
import {
  mudarAtributoBoletaAction,
  adicionarItemTabelaGainReducaoAction,
  mudarQtdAction,
} from "redux/actions/boletas/formInputActions";
import { mostrarErroQtdeOnBlurAction } from "redux/actions/boletas/bookOfertaActions";
import { IconeConfigAbrirFormulario } from "components/utils/componentesUI/IconesConfigFormInterno";
import { mapStateToPropsInputsPreco } from "components/utils/componentesUI/GraficoInputs";
import { MDBIcon } from "mdbreact";
import {
  COMPRA_STARTSTOP_NAMESPACE,
  VENDA_STARTSTOP_NAMESPACE,
} from "constants/ActionTypes";

class RowGainStopFormInterno extends React.Component {
  render() {
    const rowGain = (
      <Row>
        <Col md={2} className="colLabelInput">
          <h6 className="labelInput-verticalAlign">
            {this.props.namespace === COMPRA_STARTSTOP_NAMESPACE ||
            this.props.namespace === VENDA_STARTSTOP_NAMESPACE
              ? "Start"
              : "Gain"}
          </h6>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Disparo</Form.Label>
            <InputFormatado
              tipoInput="preco"
              className={`gainDisparo_Agendada ${boxShadowInput(
                "gainDisparo_Agendada"
              )}`}
              step={0.01}
              value={this.props[this.props.namespace].gainDisparo}
              onChange={(valor) =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "gainDisparo"
                )
              }
            />
          </Form.Group>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Execução</Form.Label>
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              className={`gainExec_Agendada ${boxShadowInput(
                "gainExec_Agendada"
              )}`}
              value={this.props[this.props.namespace].gainExec}
              onChange={(valor) =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "gainExec"
                )
              }
            />
          </Form.Group>
        </Col>
        <Col md={1} className="colIconeConfig">
          <IconeConfigAbrirFormulario
            nomeFormulario={this.props.iconeConfigGain}
          />
        </Col>
      </Row>
    );

    const rowStop = (
      <Row>
        <Col md={2} className="colLabelInput">
          <h6 className="labelInput-verticalAlign">Stop</h6>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Disparo</Form.Label>
            <InputFormatado
              tipoInput="preco"
              className={`stopDisparo_Agendada ${boxShadowInput(
                "stopDisparo_Agendada"
              )}`}
              step={0.01}
              value={this.props[this.props.namespace].stopDisparo}
              onChange={(valor) =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopDisparo"
                )
              }
            />
          </Form.Group>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Execução</Form.Label>
            <InputFormatado
              tipoInput="preco"
              className={`stopExec_Agendada ${boxShadowInput(
                "stopExec_Agendada"
              )}`}
              step={0.01}
              value={this.props[this.props.namespace].stopExec}
              onChange={(valor) =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopExec"
                )
              }
            />
          </Form.Group>
        </Col>
        <Col md={1} className="colIconeConfig">
          <IconeConfigAbrirFormulario
            nomeFormulario={this.props.iconeConfigStop}
          />
        </Col>
      </Row>
    );

    return (
      <Form>
        {this.props.cv === "compra" ? (
          <div>
            {rowGain}
            {rowStop}
          </div>
        ) : (
          <div>
            {rowStop}
            {rowGain}
          </div>
        )}
      </Form>
    );
  }
}

export const RowGainStopFormInternoConectada = connect(
  mapStateToPropsInputsPreco,
  { mudarAtributoBoletaAction }
)(RowGainStopFormInterno);

class RowInputsStopMovel extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col md={2} className="colLabelInput">
            <h6 className="labelInput-verticalAlign">Início</h6>
          </Col>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <InputFormatado
                tipoInput="preco"
                step={0.01}
                className={`inicioDisparo_Movel ${boxShadowInput(
                  "inicioDisparo_Movel"
                )}`}
                value={this.props[this.props.namespace].inicioDisparo}
                onChange={(valor) =>
                  this.props.mudarAtributoBoletaAction(
                    valor,
                    this.props.namespace,
                    "inicioDisparo"
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Ajuste padrão</Form.Label>
              <InputFormatado
                tipoInput="preco"
                step={0.01}
                value={this.props[this.props.namespace].ajustePadrao}
                onChange={(valor) =>
                  this.props.mudarAtributoBoletaAction(
                    valor,
                    this.props.namespace,
                    "ajustePadrao"
                  )
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={2} className="colLabelInput">
            <h6 className="labelInput-verticalAlign">Stop</h6>
          </Col>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <InputFormatado
                tipoInput="preco"
                step={0.01}
                className={`stopDisparo_Movel ${boxShadowInput(
                  "stopDisparo_Movel"
                )}`}
                value={this.props[this.props.namespace].stopDisparo}
                onChange={(valor) =>
                  this.props.mudarAtributoBoletaAction(
                    valor,
                    this.props.namespace,
                    "stopDisparo"
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <InputFormatado
                tipoInput="preco"
                className={`stopExec_Movel ${boxShadowInput("stopExec_Movel")}`}
                step={0.01}
                value={this.props[this.props.namespace].stopExec}
                onChange={(valor) =>
                  this.props.mudarAtributoBoletaAction(
                    valor,
                    this.props.namespace,
                    "stopExec"
                  )
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
  }
}

export const RowInputsStopMovelConectada = connect(mapStateToPropsInputsPreco, {
  mudarAtributoBoletaAction,
})(RowInputsStopMovel);

class RowInputsGainReducao extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <InputFormatado
                tipoInput="preco"
                step={0.01}
                value={this.props[this.props.namespace].gainDisparo}
                onChange={(valor) =>
                  this.props.mudarAtributoBoletaAction(
                    valor,
                    this.props.namespace,
                    "gainDisparo"
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <InputFormatado
                tipoInput="preco"
                step={0.01}
                value={this.props[this.props.namespace].gainExec}
                onChange={(valor) =>
                  this.props.mudarAtributoBoletaAction(
                    valor,
                    this.props.namespace,
                    "gainExec"
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col className="colTextInput">
            <Form.Group>
              <Form.Label>Qtde</Form.Label>
              <InputFormatado
                tipoInput="quantidade"
                step={100}
                value={this.props[this.props.namespace].qtde}
                onChange={(valor) =>
                  this.props.mudarQtdAction(valor, this.props.namespace)
                }
                name="qtde"
                onBlur={() =>
                  this.props.mostrarErroQtdeOnBlurAction(this.props.erro)
                }
              />
            </Form.Group>
          </Col>
          <Col md={1} className="colIconeConfig">
            <Button
              variant="link"
              className="operation-icons"
              onClick={() =>
                this.props.adicionarItemTabelaGainReducaoAction(
                  this.props,
                  this.props.namespace
                )
              }
            >
              <MDBIcon
                icon="plus-circle"
                size="2x"
                className="labelInput-verticalAlign"
              />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export const RowInputsGainReducaoConectada = connect(
  mapStateToPropsInputsPreco,
  {
    mudarAtributoBoletaAction,
    adicionarItemTabelaGainReducaoAction,
    mostrarErroQtdeOnBlurAction,
    mudarQtdAction,
  }
)(RowInputsGainReducao);
