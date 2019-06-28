import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Draggable from "react-draggable";
import ModalDialog from "react-bootstrap/ModalDialog";
import "../css/GenericModalForm.css";

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle=".modal-header">
        <ModalDialog {...this.props} />
      </Draggable>
    );
  }
}

class BSModal extends Component {
  render() {
    return (
      <Modal
        dialogAs={DraggableModalDialog}
        show={this.props.show}
        backdrop="static"
        onHide={this.props.close}
        backdropClassName="modal-backdrop"
        className="modal-dialog"
        dialogClassName="dialog"
        id={this.props.id}
      >
        <Modal.Header closeButton className={this.props.headerClass}>
          <Modal.Title>{this.props.headerTitle}</Modal.Title>
        </Modal.Header>
        {this.props.renderModalBody()}

        {this.props.renderModalFooter()}
      </Modal>
    );
  }
}

export default BSModal;
