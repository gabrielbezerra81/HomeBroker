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

  render() {
    return (
      <DraggableModal
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
});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(VendaGainReducao);
