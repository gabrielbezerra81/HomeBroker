import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Table, ProgressBar } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import {} from "recharts";
import Tabela1Custos from "components/forms/relatorio_detalhado/Tabela1Custos";
import Tabela2ProximaOrdem from "components/forms/relatorio_detalhado/Tabela2ProximaOrdem";

export default class RelatorioDetalhado extends React.Component {
  componentDidMount() {
    if (
      this.props.divkey !== "" &&
      this.props.divkey === "relatorio_detalhado"
    ) {
      document.getElementById("relatorio_detalhado").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "relatorio_detalhado",
        this.props.zIndex,
        true
      );
    }
  }

  render() {
    return (
      <DraggableModal
        id="relatorio_detalhado"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
  /*
 
  */

  modalBody = props => {
    return (
      <div className="bodyRelatorioDetalhado">
        <Row className="row1">
          <Col md={0}>
            <h6>TRAVA HORIZONTAL DE LINHA - THL</h6>
            <h6>PUT 28 PETR</h6>
          </Col>
          <Col md={0}>
            <div className="flexRow ativoCompra">
              <h6 className="mr-1">PETRT275</h6>
              <h6 className="qtdeAtivo">+1k</h6>
            </div>
            <div className="flexRow ativoVenda">
              <h6 className="mr-1">PETRX280</h6>
              <h6 className="qtdeAtivo">+1k</h6>
            </div>
          </Col>
          <Col md={0}>
            <div className={`flexRow ${positivoNegativo(180)}`}>
              <h6 className="mr-3">Resultado: R$ +180,00</h6>
              <h6>+38,46%</h6>
            </div>
          </Col>
          <Col md={0}>
            <div className={`${positivoNegativo(180)}`}>
              <h6>Inicio</h6>
              <h6>25/06/2019</h6>
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="p-1">
            <Tabela1Custos></Tabela1Custos>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <h6>Próxima Ordem</h6>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="p-1">
            <Tabela2ProximaOrdem></Tabela2ProximaOrdem>
          </Col>
        </Row>
        <Row className="text-align-center">
          <Col className="colTextoPosicao mr-1 ml-1 p-1">
            <h6>POSIÇÃO</h6>
          </Col>
        </Row>
        <Row className="mt-2 text-align-center">
          <Col className="colTextoPosicao mr-2 ml-1 p-1">
            <h6>PROVISÓRIO</h6>
          </Col>
          <Col className="colTextoPosicao mr-1 ml-2 p-1">
            <h6>PERMANENTE (GARANTIAS)</h6>
          </Col>
        </Row>
        <Row className="mt-2"></Row>
      </div>
    );
  };
}

const positivoNegativo = valor => {
  if (valor >= 0) return "porcentagemPositiva";
  else return "porcentagemNegativa";
};
