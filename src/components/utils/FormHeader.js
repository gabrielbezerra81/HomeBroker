import React from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

export const modalHeader = (props, headerTitle, headerClass, resetPosition) => (
  <div className={`${headerClass} handle mheader`}>
    <h6 className="mtitle">{headerTitle}</h6>
    <div className="wrapperIconesHeader">
      <Button
        variant="link"
        className="iconesHeader"
        onClick={event => {
          event.stopPropagation();
          props.handleShow(event, props.ativo);
        }}
        name="book"
      >
        <MDBIcon icon="book" size="2x" name="book" />
      </Button>

      <Button variant="link" className="iconesHeader">
        <MDBIcon icon="cog" size="2x" />
      </Button>

      <Button
        variant="link"
        className="iconesHeader"
        onClick={() => {
          resetPosition();
          props.close();
          if (props.eventSourceCotacao) props.eventSourceCotacao.close();
        }}
      >
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

export const bookHeader = (props, headerClass, resetPosition) => (
  <div className={`${headerClass} handle mheader`}>
    <Row>
      <Col md={10} className="colInputHeader">
        <Form.Control
          type="text"
          placeholder=""
          className="inputHeader"
          value={props.inputHeader}
          onChange={event => props.mudarInputHeaderAction(event.target.value)}
          onKeyPress={event => {
            //event.preventDefault();
            if (event.key === "Enter")
              props.listarBookOfertaOnEnterAction(event.target.value, props);
          }}
        />
      </Col>
      <Col md={2} className="wrapperIconesHeader">
        <Button
          variant="link"
          className="iconesHeader"
          onClick={() => {
            props.close();
            resetPosition();
            if (props.eventSource) props.eventSource.close();
          }}
        >
          <span className="fa-stack hoverIconeFechar">
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

export const modalHeaderSemBook = (props, headerTitle, headerClass) => (
  <div className={`${headerClass} handle mheader`}>
    <h6 className="mtitle">{headerTitle}</h6>
    <div className="wrapperIconesHeader">
      <Button variant="link" className="iconesHeader">
        <MDBIcon icon="cog" size="2x" />
      </Button>

      <Button
        variant="link"
        className="iconesHeader"
        onClick={props.close}
      >
        <span className="fa-stack hoverIconeFechar iconesHeader">
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

export const modalHeaderLimpo = (funcaoFechar, titulo, name) => (
  <div className="border-green mheader">
    <h6 className="mtitle">{titulo}</h6>
    <div className="wrapperIconesHeader">
      <Button
        variant="link"
        className="iconesHeader"
        onClick={event => funcaoFechar(event)}
        name={name}
      >
        <span className="fa-stack">
          <MDBIcon icon="circle" className="fa-stack-2x" />
          <MDBIcon
            icon="times"
            className="fa-stack-1x iconeFechar"
            name={name}
          />
        </span>
      </Button>
    </div>
  </div>
);
