import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

export default () => (
  <Row className="operacoes justify-content-md-center">
    <Col>
      <Button variant="" className="opicons">
        <MDBIcon icon="chevron-down" />
      </Button>
    </Col>
    <Col>
      <Button variant="" className="opicons">
        <MDBIcon icon="chevron-up" />
      </Button>
    </Col>
  </Row>
);
