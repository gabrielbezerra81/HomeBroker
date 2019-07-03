import React from "react";
import DraggableModal from "../../DraggableModal";
import { connect } from "react-redux";
import { Modal, Row, Col } from "react-bootstrap";
import "../../../css/CompraAgendada.css";
import { mudarQtdAction } from "../../redux/actions/bookOfertaActions";
import "react-datepicker/dist/react-datepicker.css";
import FormInternoCompraAgendada from "./FormInternoCompraAgendada";
import img from "../../../img/compraAgendada.PNG";
import { MDBIcon } from "mdbreact";

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
            <h6>{props.gainDisparo}</h6>
          </div>
          <div id="GainExecGrafico" className="textoGrafico">
            <h6>{props.gainExec}</h6>
          </div>
          <div id="StopDisparoGrafico" className="textoGrafico">
            <h6>{props.stopDisparo}</h6>
          </div>
          <div id="StopExecGrafico" className="textoGrafico">
            <h6>{props.stopExec}</h6>
          </div>
          <div id="CotacaoAtualGrafico" className="textoGrafico">
            <h6>{props.valorTotal}</h6>
          </div>
          <div id="ConfigGainGrafico" className="iconeConfiguracaoGrafico">
            <MDBIcon icon="cog" size="2x" />
          </div>
          <div id="ConfigStopGrafico" className="iconeConfiguracaoGrafico">
            <MDBIcon icon="cog" size="2x" />
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
  cotacaoAtual: state.compraAgendadaReducer.cotacaoAtual,
  valorTotal: state.compraAgendadaReducer.valorTotal
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(CompraAgendada);
