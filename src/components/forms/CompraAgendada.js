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
        <div class="imgContainer">
          <img src={img} className="imgChart" />{" "}
          <div id="GainDisparoGrafico" class="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>26,50</text>
            </svg>
          </div>
          <div id="StopDisparoGrafico" class="textoGrafico">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560.96 558.98">
              <text>36,50</text>
            </svg>
          </div>
        </div>
      </Col>
    </Row>
  </Modal.Body>
);

const modalFooter = props => false;

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(CompraAgendada);
