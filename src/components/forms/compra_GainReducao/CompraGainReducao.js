import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "../../utils/DraggableModal";
import FormInternoCompraGainReducao from "./FormInternoCompraGainReducao";
import GraficoCompraGainReducao from "./GraficoCompraGainReducao";
import BodyHeaderCompraGainReducao from "./BodyHeaderCompraGainReducao";
import { modalHeader } from "../../utils/FormHeader";
import { abrirFormularioAction } from "../../redux/actions/AppActions";

class CompraGainReducao extends React.Component {
  componentDidMount() {
    document.getElementById("compragainreducao").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compragainreducao"
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
    <BodyHeaderCompraGainReducao />
    <Row>
      <FormInternoCompraGainReducao />
      <GraficoCompraGainReducao />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  zIndex: state.appReducer.zIndex
});

export default connect(
  mapStateToProps,
  {abrirFormularioAction}
)(CompraGainReducao);
