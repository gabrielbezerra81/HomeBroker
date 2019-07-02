import React from "react";
import DraggableModal from "../DraggableModal";
import { connect } from "react-redux";
import { Modal, Row, Col } from "react-bootstrap";
import "../../css/CompraAgendada.css";
import { mudarQtdAction } from "../redux/actions/bookOfertaActions";
import "react-datepicker/dist/react-datepicker.css";
import FormInternoCompraAgendada from "./compraAgendada/FormInternoCompraAgendada";
import img from "../../img/compraAgendada.PNG";

class CompraAgendada extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        headerClass="border-green"
      />
    );
  }
}

const modalBody = props => (
  <Modal.Body>
    <Row className="textBodyHeader">
      <Col>
        <h6>PETR4, PETROBRAS PN N2 4,17</h6>
      </Col>
    </Row>
    <Row>
      <Col>
        <FormInternoCompraAgendada />
      </Col>

      <Col md={6} className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <div id="GainDisparoGrafico" className="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>{props.gainDisparo}</text>
            </svg>
          </div>
          <div id="GainExecGrafico" className="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>{props.gainExec}</text>
            </svg>
          </div>
          <div id="StopDisparoGrafico" className="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>{props.stopDisparo}</text>
            </svg>
          </div>
          <div id="StopExecGrafico" className="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>{props.stopExec}</text>
            </svg>
          </div>
          <div id="CotacaoAtualGrafico" className="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>{props.cotacaoAtual}</text>
            </svg>
          </div>
        </div>
      </Col>
    </Row>
  </Modal.Body>
);

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  cotacaoAtual: state.compraAgendadaReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(CompraAgendada);
