import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import InputFormatado from "components/utils/InputFormatado";
import {
  mudarAtributoBoletaAction,
  adicionarItemTabelaGainReducaoAction,
  mudarQtdAction
} from "components/redux/actions/formInputActions";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";
import { mapStateToPropsInputsPreco } from "components/utils/GraficoInputs";
import { MDBIcon } from "mdbreact";

class RowGainStopFormInterno extends React.Component {
  render() {
    const rowGain = (
      <Row>
        <Col md={2} className="colLabelInput">
          <h6 className="labelInput-verticalAlign">
            {this.props.namespace === "_COMPRA_STARTSTOP" ||
            this.props.namespace === "_VENDA_STARTSTOP"
              ? "Start"
              : "Gain"}
          </h6>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Disparo</Form.Label>
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              value={this.props[this.props.namespace].gainDisparo}
              onChange={valor =>
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
              onChange={valor =>
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
          {iconeConfigAbrirFormulario(
            this.props.handleShow,
            this.props.iconeConfigGain
          )}
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
              step={0.01}
              value={this.props[this.props.namespace].stopDisparo}
              onChange={valor =>
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
              step={0.01}
              value={this.props[this.props.namespace].stopExec}
              onChange={valor =>
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
          {iconeConfigAbrirFormulario(
            this.props.handleShow,
            this.props.iconeConfigStop
          )}
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
                value={this.props[this.props.namespace].inicioDisparo}
                onChange={valor =>
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
                onChange={valor =>
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
                value={this.props[this.props.namespace].stopDisparo}
                onChange={valor =>
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
                step={0.01}
                value={this.props[this.props.namespace].stopExec}
                onChange={valor =>
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

export const RowInputsStopMovelConectada = connect(
  mapStateToPropsInputsPreco,
  { mudarAtributoBoletaAction }
)(RowInputsStopMovel);

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
                onChange={valor =>
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
                onChange={valor =>
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
                onChange={valor =>
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
    mudarQtdAction
  }
)(RowInputsGainReducao);
