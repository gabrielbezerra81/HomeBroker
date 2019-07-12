import React from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";

class BodyHeaderCompraStartMovel extends React.Component {
  render() {
    return (
      <Row className="rowBodyHeader">
        <Col md={3} className="colAtivo1BodyHeader">
          <h5>PETR4, PETROBRAS</h5>
        </Col>
        <Col md={2} className="colAtivo2BodyHeader">
          <h5>PN N2</h5>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  porcentagem: state.formInputReducer.porcentagem
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraStartMovel);
