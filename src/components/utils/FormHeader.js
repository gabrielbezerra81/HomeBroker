import React from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

export const modalHeader = (props, headerTitle, headerClass) => (
  <div className={`${headerClass} handle mheader`}>
    <h6 className="mtitle">{headerTitle}</h6>
    <div className="wrapperIconesHeader" name="book">
      <Button
        variant="link"
        className="iconesHeader"
        onClick={event => {
          event.stopPropagation();
          props.handleShow(event);
        }}
        name="book"
      >
        <MDBIcon icon="book" size="2x" name="book" />
      </Button>

      <Button variant="link" className="iconesHeader">
        <MDBIcon icon="cog" size="2x" />
      </Button>

      <Button variant="link" className="iconesHeader" onClick={props.close}>
        <span className="fa-stack">
          <MDBIcon icon="circle" className="fa-stack-2x" />
          <MDBIcon
            icon="times"
            className="fa-stack-1x iconeFechar"
            name={props.name}
          />
        </span>
      </Button>
    </div>
  </div>
);

export const bookHeader = (props, headerClass) => (
  <div className={`${headerClass} handle mheader`}>
    <Row>
      <Col md={10} className="colInputHeader">
        <Form>
          <Form.Control
            type="text"
            placeholder=""
            className="inputHeader"
            value={props.inputHeader}
            onChange={event => props.mudarInputHeaderAction(event)}
            onKeyPress={event => {
              //event.preventDefault();
              if (event.key === "Enter") props.onEnterInputHeader();
            }}
          />
        </Form>
      </Col>
      <Col md={2} className="wrapperIconesHeader">
        <Button variant="link" className="iconesHeader" onClick={props.close}>
          <span className="fa-stack">
            <MDBIcon icon="circle" className="fa-stack-2x" />
            <MDBIcon
              icon="times"
              className="fa-stack-1x iconeFechar"
              name="book"
            />
          </span>
        </Button>
      </Col>
    </Row>
  </div>
);
