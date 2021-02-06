import React from "react";
import DatePicker from "react-datepicker";
import { Col, Row, Form } from "react-bootstrap";
import { getformatedDate } from "shared/utils/Formatacoes";

export default (props, namespace) => (
  <Row className="rowFormValidade">
    <Col md={4}>
      <h6>Validade:</h6>
    </Col>
    <Form>
      <Col className="colValidadeCheck">
        {props.validadeSelect !== "SPECIFIED_DAY"
          ? formSelect(props, "ATÉ O DIA", namespace)
          : renderFormData(props, namespace)}
      </Col>
    </Form>
  </Row>
);

const renderFormData = (props, namespace) => (
  <DatePicker
    className="form-control textInput"
    selected={props.date}
    onChange={data => props.mudarDataAction(data, namespace)}
    dateFormat="dd/MM/yyyy"
    popperPlacement="top-start"
    autoFocus
    customInput={
      <Form>{formSelect(props, getformatedDate(props.date), namespace)}</Form>
    }
  />
);

const formSelect = (props, opcao2, namespace) => (
  <Form.Control
    as="select"
    className="textInput"
    value={props.validadeSelect}
    onChange={event => props.mudarValidadeSelectAction(event, namespace)}
    autoFocus
  >
    <option value="DAY">HOJE</option>
    <option value="SPECIFIED_DAY">{opcao2}</option>
    <option value="GTC">ATÉ CANCELAR</option>
  </Form.Control>
);
