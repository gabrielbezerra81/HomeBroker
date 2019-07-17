import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../utils/DraggableModal";
import FormInternoCompraStartStop from "./FormInternoCompraStartStop";
import GraficoCompraStartStop from "./GraficoCompraStartStop";
import BodyHeaderCompraStartStop from "./BodyHeaderCompraStartStop";
import { modalHeader } from "../../utils/FormHeader";
import { abrirFormularioAction } from "../../redux/actions/AppActions";

class CompraStartStop extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="comprastartstop"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
        headerClass="border-green"
        renderHeader={() =>
          modalHeader(this.props, this.props.headerTitle, "border-green")
        }
        renderConfigForm={this.props.showConfigStop}
        classConfigAberto={
          this.props.showConfigStop ? "configStopAberto" : null
        }
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraStartStop />
    <Row>
      <FormInternoCompraStartStop />
      <GraficoCompraStartStop />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  showConfigStop: state.compraStartStopReducer.showConfigStop
});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(CompraStartStop);
