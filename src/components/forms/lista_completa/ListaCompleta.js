import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Form, Row, Col, Nav } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

export default class ListaCompleta extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "lista_completa") {
      document.getElementById("lista_completa").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "lista_completa",
        this.props.zIndex,
        true
      );
    }
  }

  render() {
    return (
      <DraggableModal
        id="lista_completa"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivPosicaoEmCustodia={true}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
  /*
 
  */

  modalBody = props => {
    return <div className="bodyMultileg"></div>;
  };
}
