import React from "react";
import DraggableModal from "../../DraggableModal";
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
import { MDBIcon } from "mdbreact";

class BookOfertas extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="bookofertas"
        renderModalBody={() => modalBody(this.props)}
        headerClass="no-border"
        renderOptionalHeader={() => modalHeader(this.props)}
        closeButton={false}
      />
    );
  }
}

const modalHeader = props => (
  <Row>
    <Col md={10} className="colInputHeader">
      <Form>
        <Form.Control
          type="text"
          placeholder=""
          className="inputHeader"
          defaultValue="PETR4, PETROBRAS PN N2"
          //value={props.inputHeader}
          onKeyPress={event => {
            event.preventDefault();
            if (event.key === "Enter") props.onEnterInputHeader();
          }}
        />
      </Form>
    </Col>
    <Col md={2} className="wrapperIconesHeader">
      <Button variant="" className="iconesHeader" onClick={props.close}>
        <span className="fa-stack">
          <MDBIcon icon="circle" className="fa-stack-2x" />
          <MDBIcon icon="times" className="fa-stack-1x iconeFechar" />
        </span>
      </Button>
    </Col>
  </Row>
);

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
              className="textInput"
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
              className="textInput"
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
              className="textInput"
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
