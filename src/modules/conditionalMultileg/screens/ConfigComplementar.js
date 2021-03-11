import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { PopupHeader } from "shared/components/PopupHeader";
import { connect } from "react-redux";
import { updateConditionalMultilegStateAction } from "../duck/actions/ConditionalMultilegActions";
import { StorePrincipalContext } from "redux/StoreCreation";

class ConfigComplementar extends React.Component {
  render() {
    return (
      <div className="mcontent config_complementar">
        <PopupHeader
          headerTitle="CONFIGURAÇÃO COMPLEMENTAR"
          name="config_complementar_conditional_multileg"
        />

        <div className="p-1 pl-3 pr-3 bodyConfigComplementar">
          <Row className="mt-2 mb-2">
            <Col md={5}>
              <h6>Hora inicial</h6>
            </Col>
            <Col md={6}>
              <Form.Control
                type="time"
                className="textInput"
                value={this.props.horaInicial}
                onChange={(event) =>
                  this.props.updateConditionalMultilegStateAction(
                    "horaInicial",
                    event.currentTarget.value,
                  )
                }
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col md={5}>
              <h6>Hora Final</h6>
            </Col>
            <Col md={6}>
              <Form.Control
                type="time"
                className="textInput"
                value={this.props.horaFinal}
                onChange={(event) =>
                  this.props.updateConditionalMultilegStateAction(
                    "horaFinal",
                    event.currentTarget.value,
                  )
                }
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col md={5}>
              <h6>Modo de Exec</h6>
            </Col>
            <Col md={6}>
              <Form.Control
                as="select"
                className="textInput"
                value={this.props.modoExec}
                onChange={(event) =>
                  this.props.updateConditionalMultilegStateAction(
                    "modoExec",
                    event.currentTarget.value,
                  )
                }
              >
                <option value="preço">NO PREÇO</option>
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col md={5} className="pr-0">
              <h6>Apregoar melhor oferta aparente</h6>
            </Col>
            <Col md={1}>
              <Form.Check
                type="checkbox"
                checked={this.props.apregoarOferta}
                onChange={(event) =>
                  this.props.updateConditionalMultilegStateAction(
                    "apregoarOferta",
                    event.currentTarget.checked,
                  )
                }
              />
            </Col>
          </Row>
          <Row className="mt-3 mb-2">
            <Col md={3}>
              <Button variant="secondary" size="sm">
                RESET
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="primary" size="sm">
                OK
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  configComplementarAberto:
    state.conditionalMultilegReducer.configComplementarAberto,
  multileg: state.conditionalMultilegReducer.multileg,
  horaInicial: state.conditionalMultilegReducer.horaInicial,
  horaFinal: state.conditionalMultilegReducer.horaFinal,
  modoExec: state.conditionalMultilegReducer.modoExec,
  apregoarOferta: state.conditionalMultilegReducer.apregoarOferta,
});

export default connect(
  mapStateToProps,
  { updateConditionalMultilegStateAction },
  null,
  {
    context: StorePrincipalContext,
  },
)(ConfigComplementar);
