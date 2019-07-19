import React, { Component } from "react";
import Draggable from "react-draggable";
import ConfigurarStop from "../forms/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "../forms/venda/venda_StartStop/ConfigurarStopVenda";
import { connect } from "react-redux";
import { aumentarZindexAction } from "../redux/actions/AppActions";

class BSModal extends Component {
  render() {
    return (
      <Draggable enableUserSelectHack={false} handle=".mheader">
        <div
          id={this.props.id}
          className={this.props.classConfigAberto}
          onClick={() =>
            this.props.aumentarZindexAction(this.props.id, this.props.zIndex)
          }
        >
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

const mapStateToProps = state => ({
  zIndex: state.appReducer.zIndex
});

export default connect(
  mapStateToProps,
  { aumentarZindexAction }
)(BSModal);
