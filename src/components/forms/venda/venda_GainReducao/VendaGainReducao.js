import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../../utils/DraggableModal";
import FormInternoVendaGainReducao from "./FormInternoVendaGainReducao";
import GraficoVendaGainReducao from "./GraficoVendaGainReducao"
import BodyHeaderVendaGainReducao from "./BodyHeaderVendaGainReducao";
import { modalHeader } from "../../../utils/FormHeader";
import { abrirFormularioAction } from "../../../redux/actions/AppActions";

class VendaGainReducao extends React.Component {
  componentDidMount() {
    document.getElementById("vendagainreducao").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="vendagainreducao"
        renderModalBody={() => modalBody()}
        renderHeader={() =>
          modalHeader(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderVendaGainReducao />
    <Row>
      <FormInternoVendaGainReducao />
      <GraficoVendaGainReducao />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  zIndex: state.appReducer.zIndex
});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(VendaGainReducao);
