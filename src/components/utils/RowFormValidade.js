import React from "react";
import DatePicker from "react-datepicker";
import { Col, Row, Form } from "react-bootstrap";

export default props => (
  <Row className="rowFormValidade">
    <Col md={4}>
      <h6>Validade:</h6>
    </Col>
    <Form>
      <Col className="colValidadeCheck">
        {props.validadeSelect !== "dia" ? formSelect(props, "ATÉ O DIA") : null}{" "}
      </Col>
    </Form>
    {props.validadeSelect === "dia" ? renderFormData(props) : null}
  </Row>
);

const renderFormData = props => (
  <DatePicker
    className="form-control textInput"
    selected={props.date}
    onChange={data => props.mudarDataAction(data)}
    dateFormat="dd/MM/yyyy"
    popperPlacement="top-start"
    autoFocus
    customInput={<Form>{formSelect(props, getformatedDate(props.date))}</Form>}
  />
);

const formSelect = (props, opcao2) => (
  <Form.Control
    as="select"
    className="textInput"
    value={props.validadeSelect}
    onChange={event => props.mudarValidadeSelectAction(event)}
    autoFocus
  >
    <option value="hoje">HOJE</option>
    <option value="dia">{opcao2}</option>
    <option value="cancelar">ATÉ CANCELAR</option>
  </Form.Control>
);

const getformatedDate = date => {
  const DD = date.getDate();
  const MM = date.getMonth() + 1;
  const YYYY = date.getFullYear();
  const formatedDate = `${DD}/${MM}/${YYYY}`;
  return formatedDate;
};
