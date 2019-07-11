import React from "react";
import { MDBIcon } from "mdbreact";
import DatePicker from "react-datepicker";
import { Col, Row, Form } from "react-bootstrap";

export const rowFormValidade = props => (
  <Row className="rowFormValidade">
    <Form>
      <Col md={3}>
        <Form.Label>Validade:</Form.Label>
      </Col>
      <Col className="colValidadeCheck">
        <Form.Control
          as="select"
          className="textInput"
          value={props.validadeSelect}
          onChange={event => props.mudarValidadeSelectAction(event)}
        >
          <option value="hoje">HOJE</option>
          <option value="dia">ATÉ O DIA</option>
          <option value="cancelar">ATÉ CANCELAR</option>
        </Form.Control>
      </Col>
    </Form>
    {renderFormData(props)}
    {renderIconeData(props)}
  </Row>
);

const renderFormData = props => {
  if (props.validadeSelect === "dia") {
    return (
      <Col className="colFormDate">
        <DatePicker
          className="form-control textInput"
          selected={props.date}
          onChange={data => props.mudarDataAction(data)}
          dateFormat="dd/MM/yyyy"
          popperPlacement="top-start"
        />
      </Col>
    );
  } else return null;
};

const renderIconeData = props => {
  if (props.validadeSelect === "dia") {
    return (
      <Col md={2} className="colDateIcon">
        <MDBIcon icon="calendar-alt" size="lg" />
      </Col>
    );
  } else return null;
};
