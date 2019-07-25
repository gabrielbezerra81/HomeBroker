import React from "react";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";

class IconeConfigGrafico extends React.Component {
  render() {
    return (
      <div
        id={this.props.id}
        className="wrapperIconeConfiguracaoGrafico"
      >
        <Button
          variant="link"
          className="iconeConfiguracaoGrafico"
          onClick={event => {
            event.stopPropagation();
            this.props.handleShow(event);
          }}
          name={this.props.name}
        >
          <MDBIcon icon="cog" size="2x" name={this.props.name} />
        </Button>
      </div>
    );
  }
}

export default IconeConfigGrafico;
