import React, { Component } from "react";
import Draggable from "react-draggable";
import ConfigurarStop from "components/forms/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "components/forms/venda/venda_StartStop/ConfigurarStopVenda";
import { connect } from "react-redux";

class BSModal extends Component {
  render() {
    return (
      <Draggable enableUserSelectHack={false} handle=".mheader">
        <div id={this.props.id} className={this.props.classConfigAberto}>
          <div className="mcontent">
            {this.props.renderHeader()}
            {this.props.renderModalBody()}
          </div>
          {this.props.renderConfigForm &&
          this.props.id === "comprastartstop" ? (
            <ConfigurarStop className="mcontent configDiv" />
          ) : null}
          {this.props.renderConfigForm && this.props.id === "vendastartstop" ? (
            <ConfigurarStopVenda className="mcontent configDiv" />
          ) : null}
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(BSModal);
