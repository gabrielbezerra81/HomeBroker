import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../utils/DraggableModal";
import FormInternoCompraStartMovel from "./FormInternoCompraStartMovel";
import GraficoCompraStartMovel from "./GraficoCompraStartMovel";
import BodyHeaderCompraStartMovel from "./BodyHeaderCompraStartMovel";
import { modalHeader } from "../../utils/FormHeader";
import { abrirFormularioAction } from "../../redux/actions/AppActions";

class CompraStarMovel extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="comprastartmovel"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
        headerClass="border-green"
        renderHeader={() =>
          modalHeader(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}



const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraStartMovel />
    <Row>
      <FormInternoCompraStartMovel />
      <GraficoCompraStartMovel />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(CompraStarMovel);
