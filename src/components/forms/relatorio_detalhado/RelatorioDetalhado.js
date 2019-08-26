import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import {} from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

export default class RelatorioDetalhado extends React.Component {
  componentDidMount() {
    if (
      this.props.divkey !== "" &&
      this.props.divkey === "relatorio_detalhado"
    ) {
      document.getElementById("relatorio_detalhado").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "relatorio_detalhado",
        this.props.zIndex,
        true
      );
    }
  }

  render() {
    return (
      <DraggableModal
        id="relatorio_detalhado"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
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
