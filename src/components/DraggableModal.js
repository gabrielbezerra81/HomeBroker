import React, { Component } from "react";
import Draggable from "react-draggable";

class BSModal extends Component {
  render() {
    return (
      <Draggable enableUserSelectHack={false} handle=".mheader">
        <div id={this.props.id}>
          <div className="mcontent">
            <div className={`${this.props.headerClass} handle mheader`}>
              <h6 className="mtitle">{this.props.headerTitle}</h6>
              {this.props.renderOptionalHeader()}
            </div>
            {this.props.renderModalBody()}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default BSModal;
