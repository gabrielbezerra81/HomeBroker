import React from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { mudarInputHeaderAction } from "redux/actions/boletas/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "redux/actions/boletas/bookOfertaAPIActions";
import {
  fecharFormAction,
  abrirFormAction,
  fecharFormConfigurarAction,
} from "redux/actions/GlobalAppActions";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/telaPrincipal/TelaPrincipalActions";
import { abrirFecharConfigComplAction } from "redux/actions/multileg/MultilegActions";
import { mudarVariavelOrdensExecAction } from "redux/actions/ordensExecucao/OrdensExecActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

import useStateBoletas from "hooks/useStateBoletas";

// Apenas para boletas de compra e venda
export const ModalHeader = ({
  headerTitle,
  headerClass,
  resetPosition,
  name,
  ativo,
  eventSourceCotacao,
}) => {
  const {
    appBoletasReducer: { appProps },
  } = useStateBoletas();
  const {
    telaPrincipalReducer: { token },
  } = useStateStorePrincipal();
  const stateGlobalStore = useStateGlobalStore();
  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchBoletas();
  const formShow = stateGlobalStore.show;
  const { appkey } = appProps;
  const abrirBookProps = {
    ...stateGlobalStore,
    dispatch,
    token,
  };
  return (
    <div className={`${headerClass} handle mheader`}>
      <h6 className="mtitle">{headerTitle}</h6>
      <div className="wrapperIconesHeader">
        <Button
          variant="link"
          className="iconesHeader"
          onClick={(event) => {
            event.stopPropagation();
            dispatchGlobal(abrirFormAction(event, abrirBookProps, ativo));
          }}
          data-name="book"
        >
          <MDBIcon icon="book" size="2x" data-name="book" />
        </Button>

        <Button variant="link" className="iconesHeader">
          <MDBIcon icon="cog" size="2x" />
        </Button>

        <Button
          variant="link"
          className="iconesHeader"
          onClick={() => {
            resetPosition();
            dispatchGlobal(fecharFormAction(formShow, name, appkey));
            if (eventSourceCotacao) eventSourceCotacao.close();
          }}
        >
          <span className="fa-stack">
            <MDBIcon icon="circle" className="fa-stack-2x" />
            <MDBIcon
              icon="times"
              className="fa-stack-1x iconeFechar"
              name={name}
            />
          </span>
        </Button>
      </div>
    </div>
  );
};

export const BookHeader = ({ headerClass, resetPosition }) => {
  const {
    bookOfertaReducer: { inputHeader, eventSource },
    appBoletasReducer: { appProps },
  } = useStateBoletas();

  const stateGlobalStore = useStateGlobalStore();

  const {
    telaPrincipalReducer: { token },
  } = useStateStorePrincipal();

  const formShow = stateGlobalStore.show;
  const { appkey } = appProps;

  const dispatch = useDispatchBoletas();
  const dispatchGlobal = useDispatchGlobalStore();

  return (
    <div className={`${headerClass} handle mheader`}>
      <Row>
        <Col md={10} className="colInputHeader">
          <Form.Control
            type="text"
            placeholder=""
            className="inputHeader"
            value={inputHeader}
            onChange={(event) =>
              dispatch(mudarInputHeaderAction(event.target.value))
            }
            onKeyUp={(event) => {
              //event.preventDefault();
              if (event.key === "Enter")
                dispatch(
                  listarBookOfertaOnEnterAction({
                    codigoAtivo: event.target.value,
                    token,
                  })
                );
            }}
          />
        </Col>
        <Col md={2} className="wrapperIconesHeader">
          <Button
            variant="link"
            className="iconesHeader"
            onClick={() => {
              dispatchGlobal(fecharFormAction(formShow, "book", appkey));
              resetPosition();
              if (eventSource) eventSource.close();
            }}
          >
            <span className="fa-stack hoverIconeFechar">
              <MDBIcon icon="circle" className="fa-stack-2x" />
              <MDBIcon
                icon="times"
                className="fa-stack-1x iconeFechar"
                name="book"
              />
            </span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

// Menus multileg, posição, thl, ordens exec, relatorio
export const ModalHeaderSemBook = React.memo(
  ({ headerTitle, headerClass, name }) => {
    const dispatchStorePrincipal = useDispatchStorePrincipal();
    const nomeVariavelReducer = getNomeVariavelReducer(headerTitle);
    const abrirMenuProps = GetAbrirMenuProps();

    return (
      <div className={`${headerClass} handle mheader`}>
        <h6 className="mtitle">{headerTitle === "THL" ? "" : headerTitle}</h6>
        <div className="wrapperIconesHeader">
          <BotaoAbrirFiltrarOrdens headerTitle={headerTitle} />
          <Button variant="link" className="iconesHeader">
            <MDBIcon icon="cog" size="2x" />
          </Button>

          <Button
            variant="link"
            className="iconesHeader"
            onClick={() =>
              dispatchStorePrincipal(
                abrirItemBarraLateralAction(abrirMenuProps, nomeVariavelReducer)
              )
            }
          >
            <span className="fa-stack hoverIconeFechar">
              <MDBIcon icon="circle" className="fa-stack-2x" />
              <MDBIcon
                icon="times"
                className="fa-stack-1x iconeFechar"
                name={name}
              />
            </span>
          </Button>
        </div>
      </div>
    );
  }
);

// form configurar ordem start stop
export const ModalHeaderLimpo = ({ titulo, name = "" }) => {
  let funcaoFechar;

  const dispatchStorePrincipal = useDispatchStorePrincipal();
  const dispatch = useDispatchBoletas();
  const {
    multilegReducer: { configComplementarAberto },
  } = useStateStorePrincipal();

  if (["config_compra", "config_venda"].includes(name)) {
    funcaoFechar = (e) => dispatch(fecharFormConfigurarAction(e));
  } //
  else if (name === "config_complementar") {
    funcaoFechar = (e) =>
      dispatchStorePrincipal(
        abrirFecharConfigComplAction(configComplementarAberto)
      );
  }

  return (
    <div className="border-green mheader">
      <h6 className="mtitle">{titulo}</h6>
      <div className="wrapperIconesHeader">
        <Button
          variant="link"
          className="iconesHeader"
          onClick={(event) => funcaoFechar(event)}
          name={name}
        >
          <span className="fa-stack">
            <MDBIcon icon="circle" className="fa-stack-2x" />
            <MDBIcon
              icon="times"
              className="fa-stack-1x iconeFechar"
              name={name}
            />
          </span>
        </Button>
      </div>
    </div>
  );
};

const getNomeVariavelReducer = (headerTitle) => {
  switch (headerTitle) {
    case "HISTÓRICO DE OPERAÇÕES":
      return "ordensExecucaoAberto";
    case "RELATÓRIO DETALHADO":
      return "relatorioDetalhadoAberto";
    case "POSIÇÃO EM CUSTÓDIA":
      return "listaCompletaAberta";
    case "MULTI ATIVOS":
      return "multilegAberto";
    case "THL":
      return "thlAberta";
    default:
      return "";
  }
};

const GetAbrirMenuProps = () => {
  const {
    telaPrincipalReducer: {
      ordensExecucaoAberto,
      relatorioDetalhadoAberto,
      listaCompletaAberta,
      multilegAberto,
      thlAberta,
    },
    multilegReducer: { eventSourceCotacao, setIntervalCotacoesMultileg },
    THLReducer: { eventSourcePrecos, setIntervalPrecosTHL },
  } = useStateStorePrincipal();

  const props = {
    ordensExecucaoAberto,
    relatorioDetalhadoAberto,
    listaCompletaAberta,
    multilegAberto,
    thlAberta,
    eventSourceCotacao_Multileg: eventSourceCotacao,
    setIntervalCotacoes_Multileg: setIntervalCotacoesMultileg,
    // eventSourceEmblema_Posicao: eventSourceEmblema,
    // setIntervalEmblema_Posicao: setIntervalEmblema,
    // eventSourcePosicao_Posicao: eventSourcePosicao,
    // eventSourceCotacoes_Posicao: eventSourceCotacoes,
    // setIntervalCotacoes_Posicao: setIntervalCotacoesPosicao,
    // eventSourceOrdensExec_OrdensExec: eventSourceOrdensExec,
    eventSourcePrecos_THL: eventSourcePrecos,
    setIntervalPrecos_THL: setIntervalPrecosTHL,
  };

  return props;

  // const {
  //   eventSourceEmblema,
  //   eventSourcePosicao,
  //   eventSourceCotacoes,
  //   setIntervalCotacoesPosicao,
  //   setIntervalEmblema,
  // } = state.posicaoReducer;
  // const { eventSourceOrdensExec } = state.ordensExecReducer;
};

const BotaoAbrirFiltrarOrdens = ({ headerTitle }) => {
  let botaoAbrirFiltrarOrdens = <div></div>;

  const dispatch = useDispatchStorePrincipal();
  const {
    ordensExecReducer: { filtrarOrdensAberto },
  } = useStateStorePrincipal();

  if (headerTitle === "HISTÓRICO DE OPERAÇÕES") {
    botaoAbrirFiltrarOrdens = (
      <Button
        variant="link"
        className="iconesHeader"
        style={{ marginRight: "6px" }}
        onClick={() =>
          dispatch(
            mudarVariavelOrdensExecAction(
              "filtrarOrdensAberto",
              !filtrarOrdensAberto
            )
          )
        }
      >
        <MDBIcon icon="search" size="2x"></MDBIcon>
      </Button>
    );
  }

  return botaoAbrirFiltrarOrdens;
};
