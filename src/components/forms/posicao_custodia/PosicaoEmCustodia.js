import React from "react";

import { Row, Col, Form, InputGroup } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";
import { MDBIcon } from "mdbreact";
import { ReactComponent as IconeResumido } from "img/rounded-rectangle.svg";
import { ReactComponent as IconeAmpliado } from "img/check-box-empty.svg";
import PosicaoEmLista from "components/forms/posicao_custodia/PosicaoLista";
import PosicaoAmpliadaResumida from "components/forms/posicao_custodia/PosicaoAmpliadaResumida";
import { PosicaoDetalhadaConectada } from "components/redux/ElementosConectadosRedux";

export default class PosicaoEmCustodia extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "posicao_custodia") {
      document.getElementById("posicao_custodia").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "posicao_custodia",
        this.props.zIndex,
        true
      );
    }
    this.props.listarPosicoesAction(this.props);
  }
  componentDidUpdate(prevProps) {
    if (this.props.eventSourceEmblema) {
      if (prevProps.posicoesCustodia !== this.props.posicoesCustodia) {
        this.props.atualizarEmblemasAction(this.props);
      }
    }
    if (this.props.eventSourcePosicao) {
      if (prevProps.posicoesCustodia !== this.props.posicoesCustodia) {
        this.props.atualizarPosicaoAction(this.props);
      }
    }
  }

  render() {
    return (
      <DraggableModal
        id="posicao_custodia"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivPosicaoEmCustodia={true}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div className="bodyListaCompleta">
        <Row>
          <Col md={2}></Col>
          <Col md={2}>
            <div className="divIconeConfigOrdernar">
              <h6 className="mr-2">Ordernar</h6>
              {iconeConfigAbrirFormulario(() => false, "")}
            </div>
          </Col>
          <Col md={8}>
            <div className="divIconeConfigAmpliado">
              {iconeConfigAbrirFormulario(() => false, "")}
            </div>
          </Col>
        </Row>
        <Row className="rowHeaderListaCompleta mt-2">
          <Col md={2}>
            <InputGroup>
              <Form.Control
                className="inputAtivo"
                type="text"
                value={this.props.ativoPesquisa}
                onChange={event =>
                  this.props.mudarVariavelPosicaoAction(
                    "ativoPesquisa",
                    event.currentTarget.value
                  )
                }
              />
              <InputGroup.Append className="inputAtivoAppend">
                <span className="input-group-text iconeProcurar divClicavel">
                  <MDBIcon icon="search" />
                </span>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control
                as="select"
                className="textInput formPosicao"
                value={this.props.inputSelect}
                onChange={event =>
                  this.props.mudarVariavelPosicaoAction(
                    "inputSelect",
                    event.currentTarget.value
                  )
                }
              >
                <option value="posicao">Posição</option>
                <option value="posicao">Posição</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <div className="divSeletor">
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.ordenacao === "data" ? "seletorAtivo" : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction("ordenacao", "data")
                }
              >
                <h6>DATA</h6>
              </div>
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.ordenacao === "nome" ? "seletorAtivo" : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction("ordenacao", "nome")
                }
              >
                <h6>NOME</h6>
              </div>
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.ordenacao === "lucro" ? "seletorAtivo" : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction("ordenacao", "lucro")
                }
              >
                <h6>LUCRO</h6>
              </div>
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.ordenacao === "vencimento" ? "seletorAtivo" : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction(
                    "ordenacao",
                    "vencimento"
                  )
                }
              >
                <h6>VENCIMENTO</h6>
              </div>
            </div>
          </Col>
          <Col>
            <div className="divSeletor">
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.tipoVisualizacao === "ampliado"
                    ? "seletorAtivo"
                    : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction(
                    "tipoVisualizacao",
                    "ampliado"
                  )
                }
              >
                {" "}
                <IconeAmpliado
                  height="15"
                  width="15"
                  className="mr-1 iconeResumido"
                ></IconeAmpliado>
                <h6>AMPLIADO</h6>
              </div>
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.tipoVisualizacao === "resumido"
                    ? "seletorAtivo"
                    : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction(
                    "tipoVisualizacao",
                    "resumido"
                  )
                }
              >
                <IconeResumido
                  height="15"
                  className="mr-1 iconeResumido"
                ></IconeResumido>
                <h6>RESUMIDO</h6>
              </div>
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.tipoVisualizacao === "lista" ? "seletorAtivo" : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction(
                    "tipoVisualizacao",
                    "lista"
                  )
                }
              >
                <MDBIcon icon="list-ul" className="mr-1" />
                <h6>LISTA</h6>
              </div>
              <div
                tabIndex={0}
                className={`divClicavel ${
                  this.props.tipoVisualizacao === "detalhada"
                    ? "seletorAtivo"
                    : ""
                }`}
                onClick={() =>
                  this.props.mudarVariavelPosicaoAction(
                    "tipoVisualizacao",
                    "detalhada"
                  )
                }
              >
                <h6>DETALHADA</h6>
              </div>
            </div>
          </Col>
        </Row>
        {visualizacaoPosicao(this.props.tipoVisualizacao)}
      </div>
    );
  };
}

const visualizacaoPosicao = tipoVisualizacao => {
  if (tipoVisualizacao === "lista") {
    return <PosicaoEmLista />;
  } else if (
    tipoVisualizacao === "ampliado" ||
    tipoVisualizacao === "resumido"
  ) {
    return <PosicaoAmpliadaResumida emblemaMaior={true} />;
  } else if (tipoVisualizacao === "detalhada") {
    return <PosicaoDetalhadaConectada />;
  }
};
