import React from "react";
import DraggableModal from "../DraggableModal";
import "../../css/BookOfertas.css";
import { connect } from "react-redux";
import {
  mudarQtdAction,
  comprarAction,
  venderAction,
  mudarStopLossAction,
  mudarGainAction
} from "../redux/actions/bookOfertaActions";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import TabelaOfertas from "../TabelaOfertas";

class BookOfertas extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="bookofertas"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        headerClass="no-border"
        renderOptionalHeader={() => false}
        closeButton={true}
      />
    );
  }
}

const modalBody = props => (
  <Modal.Body>
    <TabelaOfertas
      tableDataVenda={props.tableDataVenda}
      tableDataCompra={props.tableDataCompra}
    />
    <Form className="formNumericInput">
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Stop Loss</Form.Label>
            <Form.Control
              type="number"
              placeholder=""
              value={props.stopLoss}
              step={0.1}
              onChange={event => props.mudarStopLossAction(event)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Qtde</Form.Label>
            <Form.Control
              type="number"
              step={100}
              value={props.qtde}
              onChange={event => props.mudarQtdAction(event)}
              min={0}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Gain</Form.Label>
            <Form.Control
              type="number"
              placeholder=""
              step={0.1}
              value={props.gain}
              onChange={event => props.mudarGainAction(event)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <h6 className="erro-validacao">{props.erro}</h6>
      </Row>
    </Form>
    {modalFooter(props)}
  </Modal.Body>
);

const modalFooter = props => (
  <Modal.Footer className="no-border">
    <Button variant="danger" onClick={() => props.venderAction()}>
      Vender
    </Button>
    <Button variant="success" onClick={props.close}>
      Fechar
    </Button>
    <Button variant="primary" onClick={() => props.comprarAction()}>
      Comprar
    </Button>
  </Modal.Footer>
);

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  erro: state.bookOfertaReducer.erro,
  stopLoss: state.bookOfertaReducer.stopLoss,
  gain: state.bookOfertaReducer.gain
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    comprarAction,
    venderAction,
    mudarStopLossAction,
    mudarGainAction
  }
)(BookOfertas);
