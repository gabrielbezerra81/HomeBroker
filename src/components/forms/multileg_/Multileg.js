import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import {} from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

export default class Multileg extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "multileg")
      document.getElementById("multileg").style.zIndex = this.props.zIndex + 1;
  }

  render() {
    return (
      <DraggableModal
        id="multileg"
        renderModalBody={() => modalBody(this.props)}
        renderDivFiltrarOrdens={false}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = props => (
  <div className="bodyMultileg">
    <h1>multileg</h1>
  </div>
);
