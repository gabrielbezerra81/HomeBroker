import React, { useState } from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Radio, Button, Tooltip } from "antd";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
  DispatchGlobalStore,
  StateGlobalStore,
} from "components/redux/StoreCreation";
import {
  mudarVariavelTHLAction,
  abrirMultilegTHLAction,
} from "components/redux/actions/menu_actions/THLActions";
import {
  pesquisarAtivoTHLAPIAction,
  recalcularPrecosTHLAPIAction,
} from "components/redux/actions/api_actions/ThlAPIAction";
import iconeRecalcularPrecos from "img/recalcularTHL.png";

export default () => {
  return (
    <>
      <InputPesquisa />
      <EnviarOrdem />
      <RecalcularPrecos />
    </>
  );
};

const InputPesquisa = () => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const { ativoPesquisa, tipo, pesquisandoAtivo } = reduxState;

  return (
    <div className="containerPesquisaAtivo inverted-border-radius">
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
  const [visible, setVisible] = useState(false);
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
    <div className="containerBotaoEnviarTHL">
      <Tooltip
        overlayClassName="toolTipRecalcularPreco"
        title="Para enviar a ordem para a Multileg é preciso selecionar um book de uma Opção."
        visible={visible}
        onVisibleChange={(visible) =>
          setVisible(visible && !booksSelecionados.length)
        }
      >
        <Button
          disabled={!booksSelecionados.length}
          className={!booksSelecionados.length ? "botaoDesabilitado" : ""}
          onClick={(e) => {
            e.stopPropagation();
            dispatchStorePrincipal(abrirMultilegTHLAction(props));
          }}
          type="primary"
        >
          Enviar Ordem
        </Button>
      </Tooltip>
    </div>
  );
};

const RecalcularPrecos = () => {
  const reduxState = StateStorePrincipal().THLReducer;
  const [visible, setVisible] = useState(false);
  const dispatch = DispatchStorePrincipal();
  const { codigoCelulaSelecionada } = reduxState;
  const classeBotaoDesabilitado = !codigoCelulaSelecionada
    ? " botaoDesabilitado"
    : "";

  return (
    <div className="iconeRecalcularPrecos">
      <Tooltip
        overlayClassName="toolTipRecalcularPreco"
        title="Para recalcular os preços das estruturas é preciso selecionar uma Opção."
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
          <div className="flexJustifyCenter">
            <img
              src={iconeRecalcularPrecos}
              height="32"
              alt="recalcular preco"
            />
            <h6 className="textoRecalcular">Recalcular</h6>
          </div>
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
