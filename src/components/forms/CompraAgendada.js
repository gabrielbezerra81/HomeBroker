import React from "react";
import DraggableModal from "../DraggableModal";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

class CompraAgendada extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        renderModalFooter={() => modalFooter(this.props)}
      />
    );
  }
}

const modalBody = props => <Modal.Body />;

const modalFooter = props => <Modal.Footer className="no-border" />;

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(CompraAgendada);
