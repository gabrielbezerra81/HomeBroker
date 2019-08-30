import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Form } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

export default class Posicao extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "posicao") {
      document.getElementById("posicao").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("posicao", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="posicao"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div className="bodyPosicao">
        <Row>
          <Col md={2}>
            <h6>Balanço atual</h6>
            <h6>Dinheiro</h6>
            <h6>Posição líquido</h6>
          </Col>
          <Col md={2}>
            <h6>Valor</h6>
            <h6>${dados.dinheiro}</h6>
            <h6>${dados.posicaoLiquida}</h6>
          </Col>
          <Col md={2}>
            <h6>Mudança do dia</h6>
          </Col>
          <Col md={6}>
            <div
              style={{
                border: "2px solid #4a494c",
                borderRadius: "10px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <h4>Gráfico</h4>
            </div>
          </Col>
        </Row>
        <Row className="rowCheckbox">
          <Col md={7} className="divCheckbox">
            <Col md={0}>
              <div className="divCheckbox">
                <div className="round mr-3">
                  <input type="checkbox" id="checkbox" />
                  <label for="checkbox"></label>
                </div>
                <h6>Ações</h6>
              </div>
            </Col>
            <Col md={0}>
              <div className="divCheckbox">
                <div class="round mr-3">
                  <input type="checkbox" id="checkbox2" />
                  <label for="checkbox2"></label>
                </div>
                <h6>Opções</h6>
              </div>
            </Col>
            <Col md={0}>
              <div className="divCheckbox">
                <div class="round mr-3">
                  <input type="checkbox" id="checkbox3" />
                  <label for="checkbox3"></label>
                </div>
                <h6>Agrupados por Operações</h6>
              </div>
            </Col>
            <Col md={0}>
              <div className="divCheckbox">
                <div class="round mr-3">
                  <input type="checkbox" id="checkbox4" />
                  <label for="checkbox4"></label>
                </div>
                <h6>Executando</h6>
              </div>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <h5>COMPRA: {dados.ativo}</h5>
          </Col>
        </Row>
        <Row>
          <Col md={4}></Col>
          <Col md={4} className="text-align-right">
            <h6>Resultado:</h6>
          </Col>
          <Col md={4} className="text-align-right">
            <h6>Início: {dados.dataInicio}</h6>
          </Col>
        </Row>
        <Row></Row>
      </div>
    );
  };
}

const dados = {
  dinheiro: "227,708",
  posicaoLiquida: "227,708",
  ativo: "PETR4",
  dataInicio: "25/06/2019"
};
