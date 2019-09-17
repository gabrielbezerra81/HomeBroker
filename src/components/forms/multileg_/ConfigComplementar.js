import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { modalHeaderLimpo } from "components/utils/FormHeader";

class ConfigComplementar extends React.Component {
  render() {
    return (
      <div className="mcontent config_complementar">
        {modalHeaderLimpo(this.props, "CONFIGURAÇÃO COMPLEMENTAR", "")}
        <div className="p-1 pl-3 pr-3 bodyConfigComplementar">
          <Row className="mt-2 mb-2">
            <Col md={5}>
              <h6>Hora inicial</h6>
            </Col>
            <Col md={6}>
              <Form.Control type="time" className="textInput" />
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col md={5}>
              <h6>Hora Final</h6>
            </Col>
            <Col md={6}>
              <Form.Control type="time" className="textInput" />
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col md={5}>
              <h6>Modo de Exec</h6>
            </Col>
            <Col md={6}>
              <Form.Control as="select" className="textInput">
                <option value="preço">NO PREÇO</option>
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col md={5} className="pr-0">
              <h6>Apregoar melhor oferta aparente</h6>
            </Col>
            <Col md={1}>
              <Form.Check type="checkbox" />
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

export default ConfigComplementar;
