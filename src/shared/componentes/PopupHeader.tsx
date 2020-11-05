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
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import { openCloseMultilegExtraConfigsAction } from "redux/actions/multileg/MultilegActions";
import { updateOneOrdersExecStateAction } from "redux/actions/ordensExecucao/OrdensExecActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

import useStateBoletas from "hooks/useStateBoletas";

// Apenas para boletas de compra e venda
export const ModalHeader: React.FC<any> = ({
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
    systemReducer: { token },
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

export const BookHeader: React.FC<any> = ({ headerClass, resetPosition }) => {
  const {
    bookOfertaReducer: { inputHeader, eventSource },
    appBoletasReducer: { appProps },
  } = useStateBoletas();

  const stateGlobalStore = useStateGlobalStore();

  const {
    systemReducer: { token },
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
            onKeyUp={(event: any) => {
              //event.preventDefault();
              if (event.key === "Enter")
                dispatch(
                  listarBookOfertaOnEnterAction({
                    codigoAtivo: event.target.value,
                    token,
                  }),
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
export const ModalHeaderSemBook: React.FC<any> = React.memo(
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
                abrirItemBarraLateralAction(
                  abrirMenuProps,
                  nomeVariavelReducer,
                ),
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
  },
);

// form configurar ordem start stop
export const ModalHeaderClean: React.FC<any> = ({
  titulo,
  name = "",
  onClose,
}) => {
  let funcaoFechar: any;

  const dispatchStorePrincipal = useDispatchStorePrincipal();

  if (["config_compra", "config_venda"].includes(name)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatchBoletas();
    funcaoFechar = (e: any) => dispatch(fecharFormConfigurarAction(e));
  } //
  else if (name === "config_complementar") {
    funcaoFechar = (e: any) =>
      dispatchStorePrincipal(openCloseMultilegExtraConfigsAction());
  }

  if (onClose) {
    funcaoFechar = onClose;
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

const getNomeVariavelReducer = (headerTitle: string) => {
  switch (headerTitle) {
    case "HISTÓRICO DE OPERAÇÕES":
      return "isOpenOrdersExec";
    case "RELATÓRIO DETALHADO":
      return "isOpenDetailedReport";
    case "POSIÇÃO EM CUSTÓDIA":
      return "isOpenPosition";
    case "MULTI ATIVOS":
      return "isOpenMultileg";
    case "THL":
      return "isOpenTHL";
    default:
      return "";
  }
};

const GetAbrirMenuProps = () => {
  const {
    systemReducer: {
      isOpenOrdersExec,
      isOpenDetailedReport,
      isOpenPosition,
      isOpenMultileg,
      isOpenTHL,
    },
    multilegReducer: { eventSourceCotacao, setIntervalCotacoesMultileg },
    thlReducer: { eventSourcePrecos, setIntervalPrecosTHL },
  } = useStateStorePrincipal();

  const props = {
    isOpenOrdersExec,
    isOpenDetailedReport,
    isOpenPosition,
    isOpenMultileg,
    isOpenTHL,
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
  // } = state.positionReducer;
  // const { eventSourceOrdensExec } = state.ordersExecReducer;
};

const BotaoAbrirFiltrarOrdens: React.FC<any> = ({ headerTitle }) => {
  let botaoAbrirFiltrarOrdens = <div></div>;

  const dispatch = useDispatchStorePrincipal();
  const {
    ordersExecReducer: { filtrarOrdensAberto },
  } = useStateStorePrincipal();

  if (headerTitle === "HISTÓRICO DE OPERAÇÕES") {
    botaoAbrirFiltrarOrdens = (
      <Button
        variant="link"
        className="iconesHeader"
        style={{ marginRight: "6px" }}
        onClick={() =>
          dispatch(
            updateOneOrdersExecStateAction(
              "filtrarOrdensAberto",
              !filtrarOrdensAberto,
            ),
          )
        }
      >
        <MDBIcon icon="search" size="2x"></MDBIcon>
      </Button>
    );
  }

  return botaoAbrirFiltrarOrdens;
};
