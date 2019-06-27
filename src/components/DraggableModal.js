import React, { Component } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Draggable from "react-draggable";
import ModalDialog from "react-bootstrap/ModalDialog";

import "../css/GenericModalForm.css";
import { connect } from "react-redux";
import { mudarQtdAction } from "./redux/actions/bookOfertaActions";
import TabelaCotacoes from "./TabelaCotacoes";

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle=".modal-header">
        <ModalDialog {...this.props} />
      </Draggable>
    );
  }
}

class BSModal extends Component {
  render() {
    return (
      <Modal
        dialogAs={DraggableModalDialog}
        //show={this.props.show}
        show={true}
        backdrop="static"
        onHide={this.props.close}
        backdropClassName="modal-backdrop"
        className="modal-dialog"
        dialogClassName="dialog"
        id={this.props.id}
      >
        <Modal.Header closeButton className="no-border">
          <Modal.Title>{this.props.headerTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TabelaCotacoes />
          <Form className="formNumericInput">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Stop Loss</Form.Label>
                  <Form.Control type="number" placeholder="" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Qtde</Form.Label>
                  <Form.Control
                    type="number"
                    step={100}
                    value={this.props.qtde}
                    onChange={event => this.props.mudarQtdAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Gain</Form.Label>
                  <Form.Control type="number" placeholder="" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <h6 className="erro-validacao">{this.props.erro}</h6>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="no-border">
          <Button variant="danger">Vender</Button>
          <Button variant="success">Fechar</Button>
          <Button variant="primary">Comprar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  erro: state.bookOfertaReducer.erro
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(BSModal);
