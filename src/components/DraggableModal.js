import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Draggable from "react-draggable";
import ModalDialog from "react-bootstrap/ModalDialog";

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle=".modal-header" enableUserSelectHack={false}>
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
        enforceFocus={false}
      >
        <Modal.Header
          closeButton={this.props.closeButton}
          className={`${this.props.headerClass} handle`}
        >
          <Modal.Title>{this.props.headerTitle}</Modal.Title>
          {this.props.renderOptionalHeader()}
        </Modal.Header>
        {this.props.renderModalBody()}
      </Modal>
    );
  }
}

export default BSModal;
