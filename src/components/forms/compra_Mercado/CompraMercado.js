import React from "react";
import { MDBIcon } from "mdbreact";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row, Button } from "react-bootstrap";
import DraggableModal from "../../DraggableModal";
import FormInternoCompraMercado from "./FormInternoCompraMercado";
import GraficoCompraMercado from "./GraficoCompraMercado";
import BodyHeaderCompraMercado from "./BodyHeaderCompraMercado";

class CompraMercado extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id={"compramercado"}
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
        headerClass="border-green"
        renderOptionalHeader={() => modalHeader(this.props)}
        closeButton={false}
      />
    );
  }
}

const modalHeader = props => (
  <div className="wrapperIconesHeader">
    <Button variant="" className="iconesHeader">
      <span className="fa-stack">
        <MDBIcon far icon="circle" className="fa-stack-2x" />
        <MDBIcon icon="caret-left" className="fa-stack-2x" />
      </span>
    </Button>

    <Button variant="" className="iconesHeader">
      <MDBIcon icon="cog" size="2x" />
    </Button>

    <Button variant="" className="iconesHeader" onClick={props.close}>
      <span className="fa-stack">
        <MDBIcon icon="circle" className="fa-stack-2x" />
        <MDBIcon
          icon="times"
          className="fa-stack-1x iconeFechar"
          name="mercado"
        />
      </span>
    </Button>
  </div>
);

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraMercado />
    <Row>
      <FormInternoCompraMercado />
      <GraficoCompraMercado />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(CompraMercado);
