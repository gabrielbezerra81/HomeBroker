import React from "react";
import DraggableModal from "../DraggableModal";
import '../../css/BookOfertas.css'

class CompraAgendada extends React.Component {
  render() {
    return (
      <div>
        <DraggableModal
          show={this.props.show}
          close={this.props.handleClose}
          id="compralimitada"
          headerTitle="PETR4, PETROBRAS PN N2"
        />
      </div>
    );
  }
}

export default CompraAgendada;

/*<DraggableModal
          show={this.props.show}
          close={this.props.handleClose}
          id="compraagendada"
        />*/
