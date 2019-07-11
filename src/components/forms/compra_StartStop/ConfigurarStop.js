import React from "react";
import configurarStop from "../../../img/configurarStop.PNG";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import IconeConfigGrafico from "../../utils/IconeConfigGrafico";
import { mostrarConfigurarStopAction } from "../../redux/actions/compraStartStopActions";

class ConfigurarStop extends React.Component {
  render() {
    return (
      <div className="configDiv mcontent">
        <div className="border-green mheader">
          <h6 className="mtitle">CONFIGURAR STOP</h6>
          {modalHeader(this.props)}
        </div>
        {modalBody(this.props)}
      </div>
    );
  }
}

const modalHeader = props => (
  <div className="wrapperIconesHeader">
    <Button
      variant=""
      className="iconesHeader"
      onClick={() => props.mostrarConfigurarStopAction()}
    >
      <span className="fa-stack">
        <MDBIcon icon="circle" className="fa-stack-2x" />
        <MDBIcon
          icon="times"
          className="fa-stack-1x iconeFechar"
          name="startstop"
        />
      </span>
    </Button>
  </div>
);

const modalBody = props => (
  <div className="imgContainer imgConfigurar">
    <img src={configurarStop} className="imgChart" alt="" />
    <IconeConfigGrafico id="ConfigGain1Grafico_CONFIGURAR" />
    <IconeConfigGrafico id="ConfigStop1Grafico_CONFIGURAR" />
    <IconeConfigGrafico id="ConfigGain2Grafico_CONFIGURAR" />
    <IconeConfigGrafico id="ConfigStop2Grafico_CONFIGURAR" />
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { mostrarConfigurarStopAction }
)(ConfigurarStop);
