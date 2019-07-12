import React, { Component } from "react";
import Draggable from "react-draggable";
import ConfigurarStop from "../forms/compra_StartStop/ConfigurarStop";

class BSModal extends Component {
  render() {
    return (
      <Draggable
        enableUserSelectHack={false}
        handle=".mheader"
        
      >
        <div id={this.props.id} className={this.props.classConfigAberto}>
          <div className="mcontent">
            <div className={`${this.props.headerClass} handle mheader`}>
              <h6 className="mtitle">{this.props.headerTitle}</h6>
              {this.props.renderOptionalHeader()}
            </div>
            {this.props.renderModalBody()}
          </div>
          {this.props.renderConfigForm ? (
            <ConfigurarStop className="mcontent configDiv" />
          ) : null}
        </div>
      </Draggable>
    );
  }
}

export default BSModal;
