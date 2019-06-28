import React from "react";
import DraggableModal from "../DraggableModal";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../css/CompraAgendada.css";
import { mudarQtdAction } from "../redux/actions/bookOfertaActions";

class CompraAgendada extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        renderModalFooter={() => false}
        headerClass="border-green"
      />
    );
  }
}

const modalBody = props => (
  <Modal.Body>
    <div className="divAsModalContainer">
      <Form className="padding-padrao">
        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Ativo</h6>
          </Col>
          <Col className="formAtivo">
            <Form.Group>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Qtde</Form.Label>
              <Form.Control
                type="number"
                step={100}
                min={0}
                value={props.qtde}
                onChange={event => props.mudarQtdAction(event)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Entrada</h6>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <Form.Control type="number" step={0.1} min={0} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <Form.Control type="number" step={0.1} min={0} />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col>
          <h2 className="valorTotalText">VALOR TOTAL: 26,50</h2>
        </Col>
      </Row>

      <Form className="padding-padrao">
        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Gain</h6>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <Form.Control type="number" step={0.1} min={0} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <Form.Control type="number" step={0.1} min={0} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Stop</h6>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <Form.Control type="number" step={0.1} min={0} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <Form.Control type="number" step={0.1} min={0} />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  </Modal.Body>
);

const modalFooter = props => <Modal.Footer className="no-border" />;

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(CompraAgendada);

/*

      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        renderModalFooter={() => modalFooter(this.props)}
        headerClass="border-green"
      />


      
*/
