import React, { useState } from "react";
import { connect } from "react-redux";
import ReactResizeDetector from "react-resize-detector";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Radio, Spin, Button, Tooltip } from "antd";
import { ModalHeaderSemBook } from "components/utils/componentesUI/FormHeader";
import MapaCalor from "components/forms/thl/MapaCalor";
import TabelaVencimentos from "components/forms/thl/tabelaDeVencimentos/TabelaVencimentos";
import TabelaCombinacoes from "components/forms/thl/TabelaCombinacoes";
import {
  GlobalContext,
  StateStorePrincipal,
  DispatchStorePrincipal,
  DispatchGlobalStore,
  StateGlobalStore,
} from "components/redux/StoreCreation";
import {
  mudarVariavelTHLAction,
  abrirMultilegTHLAction,
} from "components/redux/actions/menu_actions/THLActions";
import { aumentarZindexAction } from "components/redux/actions/MainAppActions";
import {
  pesquisarAtivoTHLAPIAction,
  recalcularPrecosTHLAPIAction,
} from "components/redux/actions/api_actions/ThlAPIAction";
import iconeRecalcularPrecos from "img/recalcularTHL.png";

// import "fixed-header-table/css/defaultTheme.css";

// window.jQuery = require("jquery");
// window.$ = window.jQuery;
// require("fixed-header-table");

class Tela_THL extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "thl") {
      document.getElementById("thl").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("thl", this.props.zIndex, true);
    }
  }

  render() {
    const { ModalBody } = this;
    return (
      <DraggableModal
        id="thl"
        renderModalBody={() => <ModalBody />}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() => (
          <ModalHeaderSemBook
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
          />
        )}
      />
    );
  }

  ModalBody = () => {
    const [scrollbarRef, setScrollbarRef] = useState("");
    const reduxState = StateStorePrincipal().THLReducer;
    const { carregandoTabelaVencimentos } = reduxState;

    return (
      <div className="containerTHL">
        <MapaCalor />
        <div className="containerVencimentos">
          <InputPesquisa />
          <EnviarOrdem />
          <RecalcularPrecos />
          <Spin
            className="spinnerTabelaVencimentos"
            indicator={<Spinner animation="border" variant="light" />}
            spinning={carregandoTabelaVencimentos}
          >
            <TabelaVencimentos setScrollbarRef={setScrollbarRef} />
          </Spin>
          <TabelaCombinacoes />
        </div>
        <ReactResizeDetector
          handleWidth
          onResize={(w, h) => {
            scrollbarRef.updateScroll();
          }}
        />
      </div>
    );
  };
}

const mapDateToPropsGlobal = (state) => ({
  divkey: state.MainAppReducer.divkey,
  zIndex: state.MainAppReducer.zIndex,
});

export default connect(mapDateToPropsGlobal, { aumentarZindexAction }, null, {
  context: GlobalContext,
})(Tela_THL);

const InputPesquisa = () => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const { ativoPesquisa, tipo, pesquisandoAtivo } = reduxState;

  return (
    <div className="containerPesquisaAtivo">
      <InputGroup>
        <Form.Control
          className="inputAtivo"
          type="text"
          value={ativoPesquisa.toUpperCase()}
          onChange={(event) =>
            dispatch(
              mudarVariavelTHLAction(
                "ativoPesquisa",
                event.currentTarget.value.toUpperCase()
              )
            )
          }
        />
        <InputGroup.Append className="inputAtivoAppend">
          <span
            className="input-group-text iconeProcurar divClicavel"
            onClick={() => dispatch(pesquisarAtivoTHLAPIAction(ativoPesquisa))}
          >
            {pesquisandoAtivo ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              <MDBIcon icon="search" />
            )}
          </span>
        </InputGroup.Append>
      </InputGroup>
      <Radio.Group
        className="radioGroupTipo"
        value={tipo}
        onChange={(e) =>
          dispatch(mudarVariavelTHLAction("tipo", e.target.value))
        }
      >
        <Radio style={radioStyle} value={"CALL"}>
          Call
        </Radio>
        <Radio style={radioStyle} value={"PUT"}>
          Put
        </Radio>
      </Radio.Group>
    </div>
  );
};

const EnviarOrdem = () => {
  const { divkey, zIndex } = StateGlobalStore().MainAppReducer;
  const { multilegAberto } = StateStorePrincipal().telaPrincipalReducer;
  const {
    multileg,
    eventSource,
    eventSourceCotacao,
    cotacoesMultileg,
  } = StateStorePrincipal().multilegReducer;
  const { booksSelecionados } = StateStorePrincipal().THLReducer;

  const dispatchGlobal = DispatchGlobalStore();
  const dispatchStorePrincipal = DispatchStorePrincipal();

  const props = {
    multileg,
    multilegAberto,
    eventSource,
    eventSourceCotacao,
    cotacoesMultileg,
    divkey,
    zIndex,
    dispatchGlobal,
    booksSelecionados,
  };

  return (
    <Button
      onClick={(e) => {
        if (booksSelecionados.length > 0) {
          e.stopPropagation();
          dispatchStorePrincipal(abrirMultilegTHLAction(props));
        } //
        else {
        }
      }}
      type="primary"
      className="botaoEnviarTHL"
    >
      Enviar Ordem
    </Button>
  );
};

const RecalcularPrecos = () => {
  const reduxState = StateStorePrincipal().THLReducer;
  const [visible, setVisible] = useState(false);
  const dispatch = DispatchStorePrincipal();
  const { codigoCelulaSelecionada } = reduxState;
  const classeBotaoDesabilitado = !codigoCelulaSelecionada
    ? " recalcularDesabilitado"
    : "";

  return (
    <div className="iconeRecalcularPrecos">
      <Tooltip
        overlayClassName="toolTipRecalcularPreco"
        title="Para recalcular os preços das estruturas é preciso selecionar uma Opção"
        visible={visible}
        onVisibleChange={(visible) =>
          setVisible(visible && !!classeBotaoDesabilitado)
        }
      >
        <Button
          className={`${classeBotaoDesabilitado}`}
          disabled={!!classeBotaoDesabilitado}
          onClick={() => dispatch(recalcularPrecosTHLAPIAction(reduxState))}
          ghost
          type="link"
        >
          <img src={iconeRecalcularPrecos} height="31" alt="recalcular preco" />
        </Button>
      </Tooltip>
    </div>
  );
};

const radioStyle = {
  display: "block",
  height: "15px",
  lineHeight: "4px",
};
