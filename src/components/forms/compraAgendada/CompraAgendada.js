import React from "react";
import { MDBIcon } from "mdbreact";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Modal, Row, Col, Button } from "react-bootstrap";
import DraggableModal from "../../DraggableModal";
import FormInternoCompraAgendada from "./FormInternoCompraAgendada";
import { mudarQtdAction } from "../../redux/actions/bookOfertaActions";
import img from "../../../img/compraAgendada.PNG";
import { ReactComponent as ArrowDown } from "../../../img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "../../../img/up-arrow.svg";
import Clock from "../../Clock";

class CompraAgendada extends React.Component {
  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        headerClass="border-green"
        renderOptionalHeader={() => modalHeader(this.props)}
        closeButton={false}
      />
    );
  }
}

const modalHeader = props => (
  <div className="wrapperIconesHeader">
    <Button variant="" className="iconesHeader">
      <span className="fa-stack">
        <MDBIcon far icon="circle" className="fa-stack-2x" />
        <MDBIcon icon="caret-left" className="fa-stack-2x" />
      </span>
    </Button>

    <Button variant="" className="iconesHeader">
      <MDBIcon icon="cog" size="2x" />
    </Button>

    <Button variant="" className="iconesHeader" onClick={props.close}>
      <span className="fa-stack">
        <MDBIcon icon="circle" className="fa-stack-2x" />
        <MDBIcon icon="times" className="fa-stack-1x iconeFechar" />
      </span>
    </Button>
  </div>
);

const modalBody = props => (
  <Modal.Body>
    <Row className="rowBodyHeader">
      <Col md={3} className="colAtivo1BodyHeader">
        <h5>PETR4, PETROBRAS</h5>
      </Col>
      <Col md={2} className="colAtivo2BodyHeader">
        <h5>PN N2</h5>
      </Col>
      <Col md={1} className="colValorBodyHeader">
        <h5>4,17</h5>
      </Col>
      <Col md={1} className="colIconeSetaBodyHeader">
        {renderSeta(1)}
      </Col>
      <Col md={1} className="colPorcentagemBodyHeader">
        {renderValorPorcentagem(props.porcentagem)}
      </Col>
      <Col md={2} className="colDataBodyHeader">
        <span className="dataBodyHeader">{Clock()}</span>
      </Col>
    </Row>
    <Row>
      <Col className="colFormInterno">
        <FormInternoCompraAgendada />
      </Col>

      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <div id="GainDisparoGrafico" className="textoGrafico">
            <h6>{props.gainDisparo}</h6>
          </div>
          <div id="GainExecGrafico" className="textoGrafico">
            <h6>{props.gainExec}</h6>
          </div>
          <div id="StopDisparoGrafico" className="textoGrafico">
            <h6>{props.stopDisparo}</h6>
          </div>
          <div id="StopExecGrafico" className="textoGrafico">
            <h6>{props.stopExec}</h6>
          </div>
          <div id="CotacaoAtualGrafico" className="textoGrafico">
            <h6>{props.valorTotal}</h6>
          </div>
          <div
            id="ConfigGainGrafico"
            className="wrapperIconeConfiguracaoGrafico"
          >
            <Button variant="" className="iconeConfiguracaoGrafico">
              <MDBIcon icon="cog" size="2x" />
            </Button>
          </div>
          <div
            id="ConfigStopGrafico"
            className="wrapperIconeConfiguracaoGrafico"
          >
            <Button variant="" className="iconeConfiguracaoGrafico">
              <MDBIcon icon="cog" size="2x" />
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  </Modal.Body>
);

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  cotacaoAtual: state.compraAgendadaReducer.cotacaoAtual,
  valorTotal: state.compraAgendadaReducer.valorTotal,
  porcentagem: state.compraAgendadaReducer.porcentagem
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(CompraAgendada);

const renderSeta = valor => {
  if (valor >= 0) return <ArrowUp fill="green" className="iconeSeta" />;
  else return <ArrowDown fill="red" className="iconeSeta" />;
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    return <h5 className="porcentagemPositiva">+{porcentagem}%</h5>;
  } else if (porcentagem < 0) {
    return <h5 className="porcentagemNegativa">{porcentagem}%</h5>;
  } else return <h5>+{porcentagem}%</h5>;
};
