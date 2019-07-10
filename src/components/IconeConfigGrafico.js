import React from "react";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";

export default class IconeConfigGrafico extends React.Component {
  render() {
    return (
      <div id={this.props.id} className="wrapperIconeConfiguracaoGrafico">
        <Button
          variant=""
          className="iconeConfiguracaoGrafico"
          onClick={this.props.click}
        >
          <MDBIcon icon="cog" size="2x" />
        </Button>
      </div>
    );
  }
}
