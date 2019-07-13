import React from "react";
import DraggableModal from "../../utils/DraggableModal";
import { connect } from "react-redux";
import {
  mudarQtdAction,
  comprarAction,
  venderAction,
  mudarStopLossAction,
  mudarGainAction,
  onEnterInputHeader
} from "../../redux/actions/bookOfertaActions";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import TabelaOfertas from "./TabelaOfertas";
import { bookHeader } from "../../utils/FormHeader";

class BookOfertas extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="bookofertas"
        renderModalBody={() => modalBody(this.props)}
        headerClass="no-border"
        renderHeader={() => bookHeader(this.props, "no-border")}
        closeButton={false}
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
        <Col className="ColFormStopLoss">
          <Form.Group>
            <Form.Label>Stop Loss</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              placeholder=""
              value={props.stopLoss}
              step={0.01}
              onChange={event => props.mudarStopLossAction(event)}
            />
          </Form.Group>
        </Col>
        <Col className="ColFormQtde">
          <Form.Group>
            <Form.Label>Qtde</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              step={100}
              value={props.qtde}
              onChange={event => props.mudarQtdAction(event)}
              min={0}
            />
          </Form.Group>
        </Col>
        <Col className="ColFormGain">
          <Form.Group>
            <Form.Label>Gain</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              placeholder=""
              step={0.01}
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
  <div className="no-border modal-footer">
    <Button variant="danger" size="sm" onClick={() => props.venderAction()}>
      <h6>Vender</h6>
    </Button>
    <Button variant="success" size="sm" onClick={props.close} name="book">
      <h6>Fechar</h6>
    </Button>
    <Button variant="primary" size="sm" onClick={() => props.comprarAction()}>
      <h6>Comprar</h6>
    </Button>
  </div>
);

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  erro: state.bookOfertaReducer.erro,
  stopLoss: state.bookOfertaReducer.stopLoss,
  gain: state.bookOfertaReducer.gain,
  inputHeader: state.bookOfertaReducer.inputHeader
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    comprarAction,
    venderAction,
    mudarStopLossAction,
    mudarGainAction,
    onEnterInputHeader
  }
)(BookOfertas);
