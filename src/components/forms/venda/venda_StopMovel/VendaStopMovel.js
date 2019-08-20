import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaStopMovel from "./FormInternoVendaStopMovel";
import GraficoVendaStopMovel from "./GraficoVendaStopMovel";
import BodyHeaderVendaStopMovel from "./BodyHeaderVendaStopMovel";
import { modalHeader } from "components/utils/FormHeader";

class VendaStopMovel extends React.Component {
  componentDidMount() {
    document.getElementById("vendastopmovel").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendastopmovel"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody()}
        headerClass="border-green"
        renderHeader={(resetPosition) =>
          modalHeader(this.props, this.props.headerTitle, "border-green",resetPosition)
        }
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderVendaStopMovel />
    <Row>
      <FormInternoVendaStopMovel />
      <GraficoVendaStopMovel />
    </Row>
  </div>
);

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(VendaStopMovel);
