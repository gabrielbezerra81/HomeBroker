import React from "react";
import { Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import { compose } from "redux";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import { ModalHeaderSemBook } from "components/utils/componentesUI/FormHeader";
import { IconeConfigAbrirFormulario } from "components/utils/componentesUI/IconesConfigFormInterno";
import { ReactComponent as IconeResumido } from "img/rounded-rectangle.svg";
import { ReactComponent as IconeAmpliado } from "img/check-box-empty.svg";
import PosicaoEmLista from "components/popups/posicao_custodia/PosicaoLista";
import PosicaoAmpliadaResumida from "components/popups/posicao_custodia/PosicaoAmpliadaResumida";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  mudarVariavelPosicaoAction,
  atualizarCotacoesAction,
  atualizarEmblemasAction,
} from "redux/actions/posicao/PosicaoActions";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import PosicaoDetalhada from "components/popups/posicao_custodia/posicao_detalhada/PosicaoDetalhada";

class PosicaoEmCustodia extends React.Component {
  componentDidMount() {
    const { props } = this;
    if (props.divkey !== "" && props.divkey === "posicao_custodia") {
      document.getElementById("posicao_custodia").style.zIndex =
        props.zIndex + 1;
      props.aumentarZindexAction("posicao_custodia", props.zIndex, true);
    }
  }
  componentDidUpdate(prevProps) {
    const { props } = this;

    if (
      props.eventSourcePosicao &&
      props.eventSourceEmblema &&
      props.eventSourceCotacoes
    ) {
      if (props.posicoesCustodia.length !== props.arrayPrecos.length) {
        if (prevProps.posicoesCustodia !== props.posicoesCustodia) {
          if (
            props.posicoesCustodia.length &&
            props.arrayPrecos.length &&
            props.arrayCotacoes.length
          ) {
            props.atualizarEmblemasAction(props);
            props.atualizarCotacoesAction(props);
          }
        }
      }
    }
  }

  render() {
    const { props } = this;
    return (
      <DraggableModal
        id="posicao_custodia"
        renderModalBody={() => this.modalBody(props)}
        renderDivPosicaoEmCustodia={true}
        renderHeader={() => (
          <ModalHeaderSemBook
            name={props.name}
            headerTitle={props.headerTitle}
            headerClass="border-green"
          />
        )}
      />
    );
  }

  modalBody = (props) => {
    return (
      <div className="bodyListaCompleta">
        <Linha1 />
        <Linha2 props={props} />

        {visualizacaoPosicao(props.tipoVisualizacao)}
      </div>
    );
  };
}

const visualizacaoPosicao = (tipoVisualizacao) => {
  if (tipoVisualizacao === "lista") {
    return <PosicaoEmLista />;
  } else if (
    tipoVisualizacao === "ampliado" ||
    tipoVisualizacao === "resumido"
  ) {
    return <PosicaoAmpliadaResumida emblemaMaior={true} />;
  } else if (tipoVisualizacao === "detalhada") {
    return <PosicaoDetalhada />;
  }
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
  };
};

const mapStateToPropsPosicao = (state) => ({
  ordenacao: state.posicaoReducer.ordenacao,
  tipoVisualizacao: state.posicaoReducer.tipoVisualizacao,
  ativoPesquisa: state.posicaoReducer.ativoPesquisa,
  inputSelect: state.posicaoReducer.inputSelect,
  eventSourceEmblema: state.posicaoReducer.eventSourceEmblema,
  eventSourcePosicao: state.posicaoReducer.eventSourcePosicao,
  eventSourceCotacoes: state.posicaoReducer.eventSourceCotacoes,
  setIntervalEmblema: state.posicaoReducer.setIntervalEmblema,
  setIntervalCotacoesPosicao: state.posicaoReducer.setIntervalCotacoesPosicao,
  posicoesCustodia: state.posicaoReducer.posicoesCustodia,
  arrayCotacoes: state.posicaoReducer.arrayCotacoes,
  arrayPrecos: state.posicaoReducer.arrayPrecos,
  arrayPrecosID: state.posicaoReducer.arrayPrecosID,
  token: state.telaPrincipalReducer.token,
});

export default compose(
  connect(mapStateToPropsGlobalStore, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(
    mapStateToPropsPosicao,
    {
      mudarVariavelPosicaoAction,
      atualizarCotacoesAction,
      atualizarEmblemasAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(PosicaoEmCustodia);

const Linha1 = () => {
  return (
    <Row>
      <Col md={2}></Col>
      <Col md={2}>
        <div className="divIconeConfigOrdernar">
          <h6 className="mr-2">Ordernar</h6>
          <IconeConfigAbrirFormulario nomeFormulario="" />
        </div>
      </Col>
      <Col md={8}>
        <div className="divIconeConfigAmpliado">
          <IconeConfigAbrirFormulario nomeFormulario="" />
        </div>
      </Col>
    </Row>
  );
};

const Linha2 = ({ props }) => {
  return (
    <Row className="rowHeaderListaCompleta mt-2">
      <Col md={2}>
        <InputGroup>
          <Form.Control
            className="inputAtivo"
            type="text"
            value={props.ativoPesquisa}
            onChange={(event) =>
              props.mudarVariavelPosicaoAction(
                "ativoPesquisa",
                event.currentTarget.value
              )
            }
          />
          <InputGroup.Append className="inputAtivoAppend">
            <span className="input-group-text iconeProcurar divClicavel">
              {false ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                <MDBIcon icon="search" />
              )}
            </span>
          </InputGroup.Append>
        </InputGroup>
      </Col>
      <Col md={0}>
        <Form.Group>
          <Form.Control
            as="select"
            className="textInput formPosicao"
            value={props.inputSelect}
            onChange={(event) =>
              props.mudarVariavelPosicaoAction(
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

      <Col className="pl-3 pr-0">
        <div className="divSeletor">
          <div
            tabIndex={0}
            className={`divClicavel ${
              props.ordenacao === "data" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("ordenacao", "data")
            }
          >
            <h6>DATA</h6>
          </div>
          <div
            tabIndex={0}
            className={`divClicavel ${
              props.ordenacao === "nome" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("ordenacao", "nome")
            }
          >
            <h6>NOME</h6>
          </div>
          <div
            tabIndex={0}
            className={`divClicavel ${
              props.ordenacao === "lucro" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("ordenacao", "lucro")
            }
          >
            <h6>LUCRO</h6>
          </div>
          <div
            tabIndex={0}
            className={`divClicavel ${
              props.ordenacao === "vencimento" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("ordenacao", "vencimento")
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
              props.tipoVisualizacao === "ampliado" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("tipoVisualizacao", "ampliado")
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
              props.tipoVisualizacao === "resumido" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("tipoVisualizacao", "resumido")
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
              props.tipoVisualizacao === "lista" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("tipoVisualizacao", "lista")
            }
          >
            <MDBIcon icon="list-ul" className="mr-1" />
            <h6>LISTA</h6>
          </div>
          <div
            tabIndex={0}
            className={`divClicavel ${
              props.tipoVisualizacao === "detalhada" ? "seletorAtivo" : ""
            }`}
            onClick={() =>
              props.mudarVariavelPosicaoAction("tipoVisualizacao", "detalhada")
            }
          >
            <h6>DETALHADA</h6>
          </div>
        </div>
      </Col>
    </Row>
  );
};