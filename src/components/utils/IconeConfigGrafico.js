import React from "react";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { abrirFormularioAction } from "../redux/actions/AppActions";

class IconeConfigGrafico extends React.Component {
  render() {
    return (
      <div
        id={this.props.id}
        className="wrapperIconeConfiguracaoGrafico"
        name={this.props.name}
      >
        <Button
          variant=""
          className="iconeConfiguracaoGrafico"
          onClick={this.props.abrirFormularioAction}
          name={this.props.name}
        >
          <MDBIcon icon="cog" size="2x" name={this.props.name} />
        </Button>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { abrirFormularioAction }
)(IconeConfigGrafico);
