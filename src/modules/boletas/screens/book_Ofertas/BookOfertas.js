import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import DraggableModal from "shared/components/DraggableModal";
import { connect } from "react-redux";
import {
  mudarQtdAction,
  mudarStopLossAction,
  mudarGainAction,
  mudarInputHeaderAction,
  mostrarErroQtdeOnBlurAction,
} from "../../duck/actions/bookOfertaActions";
import TabelaOfertas from "./TabelaOfertas";
import { BookHeader } from "shared/components/PopupHeader";

class BookOfertas extends React.Component {
  render() {
    return (
      <DraggableModal
        id="bookofertas"
        renderModalBody={() => modalBody(this.props)}
        headerClass="no-border"
        renderHeader={(resetPosition) => (
          <BookHeader resetPosition={resetPosition} headerClass="no-border" />
        )}
        closeButton={false}
      />
    );
  }
}

const modalBody = (props) => (
  <Modal.Body>
    <TabelaOfertas
      tableDataVenda={props.tabelaOfertasVenda}
      tableDataCompra={props.tabelaOfertasCompra}
    />
    <Form className="formNumericInput">
      <Row>
        <Col className="ColFormStopLoss">
          <Form.Group className="text-align-center">
            <Form.Label>Stop Loss</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              placeholder=""
              value={props.stopLoss}
              step={0.01}
              onChange={(event) => props.mudarStopLossAction(event)}
            />
          </Form.Group>
        </Col>
        <Col className="ColFormQtde">
          <Form.Group className="text-align-center">
            <Form.Label>Qtde</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              step={100}
              value={props.qtde}
              onChange={(event) => props.mudarQtdAction(event)}
              onBlur={() => props.mostrarErroQtdeOnBlurAction(props.erro)}
              min={0}
            />
          </Form.Group>
        </Col>
        <Col className="ColFormGain">
          <Form.Group className="text-align-center">
            <Form.Label>Gain</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              placeholder=""
              step={0.01}
              value={props.gain}
              onChange={(event) => props.mudarGainAction(event)}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
    {modalFooter(props)}
  </Modal.Body>
);

const modalFooter = (props) => (
  <div className="no-border modal-footer">
    <Button variant="danger" size="sm" onClick={() => false}>
      <h6>Vender</h6>
    </Button>
    <Button variant="success" size="sm" onClick={props.close} name="book">
      <h6>Fechar</h6>
    </Button>
    <Button variant="primary" size="sm" onClick={() => false}>
      <h6>Comprar</h6>
    </Button>
  </div>
);

const mapStateToProps = (state) => ({
  qtde: state.bookOfertaReducer.qtde,
  erro: state.bookOfertaReducer.erro,
  stopLoss: state.bookOfertaReducer.stopLoss,
  gain: state.bookOfertaReducer.gain,
  inputHeader: state.bookOfertaReducer.inputHeader,
  tabelaOfertasCompra: state.bookOfertaReducer.tabelaOfertasCompra,
  tabelaOfertasVenda: state.bookOfertaReducer.tabelaOfertasVenda,
  esource_offersBook: state.bookOfertaReducer.esource_offersBook,
});

export default connect(mapStateToProps, {
  mudarQtdAction,
  mudarStopLossAction,
  mudarGainAction,
  mudarInputHeaderAction,
  mostrarErroQtdeOnBlurAction,
})(BookOfertas);
