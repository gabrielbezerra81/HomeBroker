import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

export default class Posicao extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "posicao") {
      document.getElementById("posicao").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("posicao", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="posicao"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div className="bodyPosicao">
        <Row></Row>
      </div>
    );
  };
}
