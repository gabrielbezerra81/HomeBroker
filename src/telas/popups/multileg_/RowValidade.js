import React from "react";
import DatePicker from "react-datepicker";
import { Col, Row, Form } from "react-bootstrap";
import { getformatedDate } from "shared/utils/Formatacoes";

export default (props, abaMultileg) => (
  <Row className="mr-2 mb-2">
    <Col md={4} className="ml-2">
      <h6>Validade</h6>
    </Col>

    <Col>
      {abaMultileg.validadeSelect !== "SPECIFIED_DAY"
        ? formSelect(props, "ATÉ O DIA", abaMultileg)
        : renderFormData(props, abaMultileg)}
    </Col>
  </Row>
);

const renderFormData = (props, abaMultileg) => (
  <DatePicker
    className={`form-control textInput ${
      abaMultileg.validadeSelect === "SPECIFIED_DAY" ? "formDatepicker" : ""
    }`}
    selected={abaMultileg.date}
    onChange={data =>
      props.modificarAtributoAbaAction(
        props.multileg,
        props.indice,
        "date",
        data
      )
    }
    dateFormat="dd/MM/yyyy"
    popperPlacement="top-start"
    autoFocus
    customInput={formSelect(
      props,
      getformatedDate(abaMultileg.date),
      abaMultileg
    )}
  />
);

const formSelect = (props, opcao2, abaMultileg) => (
  <span>
    <Form.Control
      as="select"
      className={`textInput ${
        abaMultileg.validadeSelect === "SPECIFIED_DAY"
          ? "inputDate"
          : "inputValidade"
      }`}
      value={abaMultileg.validadeSelect}
      onChange={event =>
        props.modificarAtributoAbaAction(
          props.multileg,
          props.indice,
          "validadeSelect",
          event.currentTarget.value
        )
      }
      autoFocus
    >
      <option value="DAY">HOJE</option>
      <option value="SPECIFIED_DAY">{opcao2}</option>
      <option value="GTC">ATÉ CANCELAR</option>
    </Form.Control>
  </span>
);
