import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import FormInternoVendaStartStop from "./FormInternoVendaStartStop";
import GraficoVendaStartStop from "./GraficoVendaStartStop";
import BodyHeaderVendaStartStop from "./BodyHeaderVendaStartStop";
import { modalHeader } from "components/utils/FormHeader";
import {} from "components/redux/actions/SubAppActions";

class VendaStartStop extends React.Component {
  componentDidMount() {
    document.getElementById("vendastartstop").style.zIndex = this.props.zIndex;
  }
  render() {
    return (
      <DraggableModal
        id="vendastartstop"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        headerClass="border-green"
        renderHeader={resetPosition =>
          modalHeader(
            this.props,
            this.props.headerTitle,
            "border-green",
            resetPosition
          )
        }
        renderConfigForm={this.props.config_venda}
        classConfigAberto={this.props.config_venda ? "configStopAberto" : null}
      />
    );
  }
}

const modalBody = props => (
  <div className="mbody">
    <BodyHeaderVendaStartStop />
    <Row>
      <FormInternoVendaStartStop handleShow={props.handleShow} ordem={ordem} />
      <GraficoVendaStartStop />
    </Row>
  </div>
);

const mapStateToProps = state => ({
  config_venda: state.SubAppReducer.config_venda,
  ativo: state.vendaStartStopReducer.ativo,
  eventSourceCotacao: state.vendaStartStopReducer.eventSourceCotacao
});

export default connect(
  mapStateToProps,
  {}
)(VendaStartStop);

const ordem = {
  nome: "Venda Start Stop",
  tipoOrdem: "sellDoubleStart",
  tipoOferta: "V"
};
