import React, { useState } from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Radio, Button, Tooltip } from "antd";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  mudarVariavelTHLAction,
  abrirMultilegTHLAction,
} from "redux/actions/thl/THLActions";
import {
  pesquisarAtivoTHLAPIAction,
  recalcularPrecosTHLAPIAction,
  favoritarTHLAPIAction,
  criarAlertaTHLAPIAction,
  pesquisarCombinacoesTHLAPIAction,
} from "redux/actions/thl/ThlAPIAction";
import iconeRecalcularPrecos from "assets/THL/iconeRecalcular.svg";
import iconeEnviarOrdem from "assets/THL/iconeEnviarOrdem.svg";
import iconeFavorito from "assets/THL/iconeFavorito.svg";
import iconeCriarAlerta from "assets/THL/iconeCriarAlerta.svg";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

const textoRecalcular =
  "Para recalcular os preços das estruturas é preciso selecionar uma Opção.";
const textoEnviarOrdem =
  "Para enviar a ordem para a Multileg é preciso selecionar um book de uma Opção.";
const textoCriarAlerta = "Para criar um alerta é preciso selecionar uma Opção.";
const textoFavoritar =
  "Para adicionar aos favoritos é preciso selecionar uma Opção.";

export default () => {
  return (
    <>
      <InputPesquisa />
      <RecalcularPrecos />
      <Favoritar />
      <CriarAlerta />
      <EnviarOrdem />
    </>
  );
};

const InputPesquisa = () => {
  const reduxState = useStateStorePrincipal("thl");
  const dispatch = useDispatchStorePrincipal();
  const {
    ativoPesquisa,
    tipo,
    pesquisandoAtivo,
    eventSourceCotacoesTHL,
    setIntervalCotacoesTHL,
  } = reduxState;
  const propsPesquisarCombinacoes = {
    ativoPesquisa,
    eventSourceCotacoesTHL,
    setIntervalCotacoesTHL,
  };

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
            onClick={() => {
              if (!pesquisandoAtivo) {
                dispatch(pesquisarAtivoTHLAPIAction(ativoPesquisa));
                dispatch(
                  pesquisarCombinacoesTHLAPIAction(propsPesquisarCombinacoes)
                );
              }
            }}
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
  const { divkey, zIndex } = useStateGlobalStore();
  const { multilegAberto } = useStateStorePrincipal("principal");
  const {
    multileg,
    eventSource,
    eventSourceCotacao,
    cotacoesMultileg,
  } = useStateStorePrincipal("multileg");
  const { booksSelecionados } = useStateStorePrincipal("thl");

  const dispatchGlobal = useDispatchGlobalStore();
  const dispatchStorePrincipal = useDispatchStorePrincipal();

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
    <div className="containerBotaoMenuTopo containerBotaoEnviarTHL">
      <BotaoMenuTopo
        texto={textoEnviarOrdem}
        condicaoVisibilidade={!booksSelecionados.length}
        icone={iconeEnviarOrdem}
        onClick={(e) => {
          e.stopPropagation();
          dispatchStorePrincipal(abrirMultilegTHLAction(props));
        }}
      />
    </div>
  );
};

const RecalcularPrecos = () => {
  const reduxState = useStateStorePrincipal("thl");
  const dispatch = useDispatchStorePrincipal();
  const { codigoCelulaSelecionada } = reduxState;
  const classeBotaoDesabilitado = !codigoCelulaSelecionada
    ? " botaoDesabilitado"
    : "";

  return (
    <div className="containerBotaoMenuTopo iconeRecalcularPrecos">
      <BotaoMenuTopo
        texto={textoRecalcular}
        condicaoVisibilidade={classeBotaoDesabilitado}
        icone={iconeRecalcularPrecos}
        onClick={() => dispatch(recalcularPrecosTHLAPIAction())}
      />
    </div>
  );
};

const Favoritar = () => {
  const { idCelulaSelecionada } = useStateStorePrincipal("thl");
  const { token } = useStateStorePrincipal("principal");
  const dispatch = useDispatchStorePrincipal();
  const classeBotaoDesabilitado = !idCelulaSelecionada
    ? " botaoDesabilitado"
    : "";

  return (
    <div className="containerBotaoMenuTopo containerBotaoFavoritar">
      <BotaoMenuTopo
        texto={textoFavoritar}
        condicaoVisibilidade={classeBotaoDesabilitado}
        icone={iconeFavorito}
        onClick={() =>
          dispatch(favoritarTHLAPIAction({ idCelulaSelecionada, token }))
        }
      />
    </div>
  );
};
const CriarAlerta = () => {
  const reduxState = useStateStorePrincipal("thl");
  const dispatch = useDispatchStorePrincipal();
  const { idCelulaSelecionada } = reduxState;
  const classeBotaoDesabilitado = !idCelulaSelecionada
    ? " botaoDesabilitado"
    : "";
  const actionProps = { idCelulaSelecionada };

  return (
    <div className="containerBotaoMenuTopo containerBotaoCriarAlerta">
      <BotaoMenuTopo
        texto={textoCriarAlerta}
        condicaoVisibilidade={classeBotaoDesabilitado}
        icone={iconeCriarAlerta}
        onClick={() => dispatch(criarAlertaTHLAPIAction(actionProps))}
      />
    </div>
  );
};

const radioStyle = {
  display: "block",
  height: "15px",
  lineHeight: "4px",
};

const BotaoMenuTopo = (props) => {
  const [visible, setVisible] = useState(false);
  const { texto, condicaoVisibilidade, icone, onClick } = props;

  return (
    <Tooltip
      overlayClassName="toolTipMenuTopoTHL"
      title={texto}
      visible={visible}
      onVisibleChange={(visible) => {
        setVisible(visible && !!condicaoVisibilidade);
      }}
    >
      <Button
        className={condicaoVisibilidade ? "botaoDesabilitado" : ""}
        disabled={condicaoVisibilidade}
        ghost
        type="link"
        onClick={onClick}
      >
        <img src={icone} height="32" alt="recalcular preco" />
      </Button>
    </Tooltip>
  );
};