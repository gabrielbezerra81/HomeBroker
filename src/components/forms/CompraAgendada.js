import React from "react";
import DraggableModal from "../DraggableModal";
import { connect } from "react-redux";
import { Modal, Row, Col } from "react-bootstrap";
import "../../css/CompraAgendada.css";
import { mudarQtdAction } from "../redux/actions/bookOfertaActions";
import "react-datepicker/dist/react-datepicker.css";
import FormInternoCompraAgendada from "./compraAgendada/FormInternoCompraAgendada";
import img from "../../img/compraAgendada.PNG";
import { MDBMask, MDBView, MDBContainer, MDBRow, MDBCol } from "mdbreact";

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
    <MDBRow className="textBodyHeader">
      <MDBCol>
        <h6>PETR4, PETROBRAS PN N2 4,17</h6>
      </MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol >
        <FormInternoCompraAgendada />
      </MDBCol>

      <MDBCol  className="colGrafico">
        <div class="valorTotalGrafico">26,50</div>
      </MDBCol>
    </MDBRow>
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
