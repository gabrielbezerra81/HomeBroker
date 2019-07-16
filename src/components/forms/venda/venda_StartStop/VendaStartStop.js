import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../../utils/DraggableModal";
import FormInternoVendaStartStop from "./FormInternoVendaStartStop";
import GraficoVendaStartStop from "./GraficoVendaStartStop";
import BodyHeaderVendaStartStop from "./BodyHeaderVendaStartStop";
import { modalHeader } from "../../../utils/FormHeader";

class VendaStartStop extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="vendastartstop"
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
    <BodyHeaderVendaStartStop />
    <Row>
      <FormInternoVendaStartStop />
      <GraficoVendaStartStop />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  showConfigStop: state.vendaStartStopReducer.showConfigStop
});

export default connect(
  mapStateToProps,
  {}
)(VendaStartStop);
