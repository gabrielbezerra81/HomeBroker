import React, { useCallback } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

import { FaCog } from "react-icons/fa";

import { MDBIcon } from "mdbreact";
import { mudarInputHeaderAction } from "modules/boletas/duck/actions/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "modules/boletas/duck/actions/bookOfertaAPIActions";
import {
  fecharFormAction,
  abrirFormAction,
  fecharFormConfigurarAction,
} from "redux/actions/GlobalAppActions";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import { openCloseMultilegExtraConfigsAction } from "modules/multileg/duck/actions/MultilegActions";
import { updateOneOrdersExecStateAction } from "modules/ordersExec/duck/actions/OrdensExecActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

import closeIcon from "assets/closeIcon.png";

import useStateBoletas from "hooks/useStateBoletas";
import { BoletaNamespace } from "constants/ActionTypes";
import { mudarAtributoBoletaAction } from "modules/boletas/duck/actions/boletaActions";
import { IoMdRepeat } from "react-icons/io";

interface ModalHeaderProps {
  headerTitle?: any;
  headerClass?: any;
  resetPosition?: any;
  name?: any;
  ativo?: any;
  namespace?: BoletaNamespace;
}

// Apenas para boletas de compra e venda
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  headerTitle,
  headerClass,
  resetPosition,
  name,
  ativo,
  namespace,
}) => {
  const boletaState = useStateBoletas();
  const {
    appBoletasReducer: { appProps },
  } = boletaState;

  const { esource_boletaQuote, interval_boletaQuote } = boletaState[
    namespace as BoletaNamespace
  ];

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

  const handleOpenBook = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      dispatchGlobal(abrirFormAction(event, abrirBookProps, ativo));
    },
    [abrirBookProps, ativo, dispatchGlobal],
  );

  const handleCloseBoleta = useCallback(() => {
    resetPosition();
    dispatchGlobal(fecharFormAction(formShow, name, appkey));
    dispatch(mudarAtributoBoletaAction(0, namespace, "orderId"));

    if (esource_boletaQuote) {
      esource_boletaQuote.close();
    }
    if (interval_boletaQuote) {
      clearInterval(interval_boletaQuote);
    }
  }, [
    appkey,
    dispatch,
    dispatchGlobal,
    esource_boletaQuote,
    formShow,
    interval_boletaQuote,
    name,
    namespace,
    resetPosition,
  ]);

  return (
    <div className={`${headerClass} handle mheader`}>
      <h6 className="mtitle">{headerTitle}</h6>
      <div className="wrapperIconesHeader">
        <Button
          variant="link"
          className="iconesHeader"
          onClick={handleOpenBook}
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
          onClick={handleCloseBoleta}
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
    bookOfertaReducer: { inputHeader, esource_offersBook, interval_offersBook },
    appBoletasReducer: { appProps },
  } = useStateBoletas();

  const stateGlobalStore = useStateGlobalStore();

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
              if (esource_offersBook) {
                esource_offersBook.close();
              }
              if (interval_offersBook) {
                clearInterval(interval_offersBook);
              }
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

interface PopupHeaderProps {
  headerTitle?: string;
  headerClass?: string;
  name?: string;
  onClose?: (...data: any) => any;
  onConfig?: (...data: any) => any;
  onStrikeViewChange?: (...data: any) => any;
}

// Menus multileg, posição, thl, ordens exec, relatorio
export const PopupHeader: React.FC<PopupHeaderProps> = React.memo(
  ({
    headerTitle = "",
    headerClass = "",
    name = "",
    children,
    onClose,
    onConfig,
    onStrikeViewChange,
  }) => {
    const dispatchStorePrincipal = useDispatchStorePrincipal();
    const nomeVariavelReducer = getNomeVariavelReducer(headerTitle);

    const handleConfig = useCallback(
      (event) => {
        if (onConfig) {
          onConfig();
        }
      },
      [onConfig],
    );

    const handleClose = useCallback(
      (event) => {
        if (onClose) {
          onClose(event);
        } //
        else if (name === "config_complementar") {
          dispatchStorePrincipal(openCloseMultilegExtraConfigsAction());
        } //
        else {
          dispatchStorePrincipal(
            abrirItemBarraLateralAction(nomeVariavelReducer),
          );
        }
      },
      [dispatchStorePrincipal, name, nomeVariavelReducer, onClose],
    );

    return (
      <div className={`${headerClass} handle mheader`}>
        {children}
        <h6 className="mtitle">{headerTitle === "THL" ? "" : headerTitle}</h6>
        <div className="wrapperIconesHeader">
          <BotaoAbrirFiltrarOrdens headerTitle={headerTitle} />

          {!!onStrikeViewChange && (
            <button
              onClick={onStrikeViewChange}
              className="brokerCustomButton iconesHeader"
            >
              <IoMdRepeat size={19} color="#C4C4C4" />
            </button>
          )}

          {!!onConfig && (
            <button
              className="brokerCustomButton iconesHeader"
              onClick={handleConfig}
            >
              <FaCog size={20} />
            </button>
          )}

          <button
            className="brokerCustomButton iconesHeader"
            name={name}
            onClick={handleClose}
          >
            <img className="closeIcon" src={closeIcon} alt="Fechar" />
          </button>
        </div>
      </div>
    );
  },
);

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
