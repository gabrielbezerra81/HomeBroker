import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../utils/DraggableModal";
import FormInternoCompraAgendada from "./FormInternoCompraAgendada";
import GraficoCompraAgendada from "./GraficoCompraAgendada";
import BodyHeaderCompraAgendada from "./BodyHeaderCompraAgendada";
import { modalHeader } from "../../utils/FormHeader";
import { abrirFormularioAction } from "../../redux/actions/AppActions";

class CompraAgendada extends React.Component {
  componentDidMount() {
    document.getElementById("compra_agendada").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compra_agendada"
        renderModalBody={() => modalBody(this.props)}
        renderHeader={() =>
          modalHeader(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraAgendada />
    <Row>
      <FormInternoCompraAgendada />
      <GraficoCompraAgendada />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  zIndex: state.appReducer.zIndex
});

export default connect(
  mapStateToProps,
  { abrirFormularioAction }
)(CompraAgendada);
