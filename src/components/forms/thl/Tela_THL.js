import React from "react";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

class Tela_THL extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "thl") {
      document.getElementById("thl").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("thl", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="thl"
        renderModalBody={() => this.modalBody(this.props)}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div>
        <h1>THL</h1>
      </div>
    );
  };
}

export default Tela_THL;
