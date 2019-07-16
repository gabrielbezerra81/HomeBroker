import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../../utils/DraggableModal";
import FormInternoVendaLimitada from "./FormInternoVendaLimitada";
import GraficoVendaLimitada from "./GraficoVendaLimitada";
import BodyHeaderVendaLimitada from "./BodyHeaderVendaLimitada";
import { modalHeader } from "../../../utils/FormHeader";

class VendaLimitada extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id={"vendalimitada"}
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
    <BodyHeaderVendaLimitada />
    <Row>
      <FormInternoVendaLimitada />
      <GraficoVendaLimitada />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(VendaLimitada);