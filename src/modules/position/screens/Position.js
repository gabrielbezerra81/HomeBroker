import React from "react";
import { Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import { compose } from "redux";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";

import DraggableModal from "shared/componentes/DraggableModal";
import { PopupHeader } from "shared/componentes/PopupHeader";
import { IconeConfigAbrirFormulario } from "shared/componentes/IconesConfigFormInterno";
import { ReactComponent as IconeResumido } from "assets/rounded-rectangle.svg";
import { ReactComponent as IconeAmpliado } from "assets/check-box-empty.svg";

import PosicaoEmLista from "./PosicaoLista";
import PosicaoAmpliadaResumida from "./PosicaoAmpliadaResumida";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import { mudarVariavelPosicaoAction } from "../duck/actions/PosicaoActions";

import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import PosicaoDetalhada from "./posicao_detalhada/PosicaoDetalhada";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";

class Position extends React.Component {
  componentDidMount() {
    const { props } = this;

    if (props.divkey !== "" && props.divkey === "posicao_custodia") {
      document.getElementById("posicao_custodia").style.zIndex =
        props.zIndex + 1;
      props.aumentarZindexAction("posicao_custodia", props.zIndex, true);
    }

    // Começa a atualizar emblemas e cotações ao abrir a posição, exceto quando recarrega a página,
    // pois isso é feito pela própria action de listar posição
    // if (posicoesCustodia.length) {
    //   if (
    //     (esource_emblem && esource_emblem.readyState === 2) ||
    //     !esource_emblem
    //   ) {
    //     props.atualizarEmblemasAction();
    //   }

    //   if (
    //     (esource_positionQuote && esource_positionQuote.readyState === 2) ||
    //     !esource_positionQuote
    //   ) {
    //     props.atualizarCotacoesPosicaoAction();
    //   }
    // }
  }

  // Limpa eventSources e timers
  // componentWillUnmount() {
  //   const {
  //     esource_emblem,
  //     esource_positionQuote,
  //     interval_emblem,
  //     interval_positionQuote,
  //   } = this.props;

  //   if (esource_emblem && esource_emblem.close) {
  //     esource_emblem.close();
  //   }
  //   if (interval_emblem) {
  //     clearInterval(interval_emblem);
  //   }

  //   if (esource_positionQuote && esource_positionQuote.close) {
  //     esource_positionQuote.close();
  //   }
  //   if (interval_positionQuote) {
  //     clearInterval(interval_positionQuote);
  //   }
  // }

  componentDidUpdate(prevProps) {
    const { props } = this;
    const { divkey, isOpenPosition, aumentarZindexAction, zIndex } = props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "posicao_custodia",
      popupVisibility: isOpenPosition,
      updateFunction: aumentarZindexAction,
    });

    // if (
    //   props.esource_position &&
    //   props.esource_emblem &&
    //   props.esource_positionQuote
    // ) {
    //   if (props.posicoesCustodia.length !== props.arrayPrecos.length) {
    //     if (prevProps.posicoesCustodia !== props.posicoesCustodia) {
    //       if (
    //         props.posicoesCustodia.length &&
    //         props.arrayPrecos.length &&
    //         props.arrayCotacoes.length
    //       ) {
    //         // props.atualizarEmblemasAction();
    //         // props.atualizarCotacoesPosicaoAction();
    //       }
    //     }
    //   }
    // }
  }

  render() {
    const { props } = this;
    return (
      <DraggableModal
        id="posicao_custodia"
        renderModalBody={() => this.modalBody(props)}
        renderDivPosicaoEmCustodia={true}
        renderHeader={() => (
          <PopupHeader
            name={props.name}
            headerTitle={props.headerTitle}
            headerClass="border-green"
            onConfig={() => {}}
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
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
  };
};

const mapStateToPropsPosicao = (state) => ({
  ordenacao: state.positionReducer.ordenacao,
  tipoVisualizacao: state.positionReducer.tipoVisualizacao,
  ativoPesquisa: state.positionReducer.ativoPesquisa,
  inputSelect: state.positionReducer.inputSelect,
  token: state.systemReducer.token,
  isOpenPosition: state.systemReducer.isOpenPosition,
});

export default compose(
  connect(mapStateToPropsGlobalStore, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(
    mapStateToPropsPosicao,
    {
      mudarVariavelPosicaoAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(Position);

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
            className="inputWithSearchIcon"
            type="text"
            value={props.ativoPesquisa}
            onChange={(event) =>
              props.mudarVariavelPosicaoAction(
                "ativoPesquisa",
                event.currentTarget.value,
              )
            }
          />
          <InputGroup.Append>
            <span className="input-group-text appendedSearchIcon divClicavel">
              {false ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                <MDBIcon icon="search" />
              )}
            </span>
          </InputGroup.Append>
        </InputGroup>
      </Col>
      <Col md={"0"}>
        <Form.Group>
          <Form.Control
            as="select"
            className="textInput formPosicao"
            value={props.inputSelect}
            onChange={(event) =>
              props.mudarVariavelPosicaoAction(
                "inputSelect",
                event.currentTarget.value,
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
