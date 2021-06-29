import React, { useCallback } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

import { FaCog } from "react-icons/fa";

import { MDBIcon } from "mdbreact";
import { mudarInputHeaderAction } from "modules/boletas/duck/actions/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "modules/boletas/duck/actions/bookOfertaAPIActions";
import {
  fecharFormAction,
  abrirFormAction,
} from "redux/actions/GlobalAppActions";

import { clearIntervalAsync } from "set-interval-async";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { openCloseMultilegExtraConfigsAction } from "modules/multileg/duck/actions/MultilegActions";
import { updateOneOrdersExecStateAction } from "modules/ordersExec/duck/actions/OrdensExecActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

import closeIcon from "assets/closeIcon.png";

import useStateBoletas from "hooks/useStateBoletas";
import { BoletaNamespace } from "constants/ActionTypes";
import { IoMdRepeat } from "react-icons/io";
import { cond_openCloseMultilegExtraConfigsAction } from "modules/conditionalMultileg/duck/actions/ConditionalMultilegActions";
import { FiSearch } from "react-icons/fi";

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
  name,
  ativo,
}) => {
  const boletaState = useStateBoletas();
  const {
    appBoletasReducer: { appProps },
  } = boletaState;

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
    dispatchGlobal(fecharFormAction(formShow, name, appkey));
  }, [appkey, dispatchGlobal, formShow, name]);

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

  const handleClose = useCallback(() => {
    dispatchGlobal(fecharFormAction(formShow, "book", appkey));
    resetPosition();
    if (esource_offersBook) {
      esource_offersBook.close();
    }
    if (interval_offersBook) {
      clearIntervalAsync(interval_offersBook);
    }
  }, [
    appkey,
    dispatchGlobal,
    esource_offersBook,
    formShow,
    interval_offersBook,
    resetPosition,
  ]);

  const onInputChange = useCallback(
    (event) => dispatch(mudarInputHeaderAction(event.target.value)),
    [dispatch],
  );

  const onSearchByEnter = useCallback(
    (event: any) => {
      //event.preventDefault();
      if (event.key === "Enter")
        dispatch(
          listarBookOfertaOnEnterAction({
            codigoAtivo: event.target.value,
          }),
        );
    },
    [dispatch],
  );

  return (
    <div className={`${headerClass} handle mheader`}>
      <Row>
        <Col md={10} className="colInputHeader">
          <Form.Control
            type="text"
            placeholder=""
            className="inputHeader"
            value={inputHeader}
            onChange={onInputChange}
            onKeyUp={onSearchByEnter}
          />
        </Col>
        <Col md={2} className="wrapperIconesHeader">
          <Button variant="link" className="iconesHeader" onClick={handleClose}>
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
  icons?: React.ReactNode;
  showCloseButton?: boolean;
  showSearchButton?: boolean;
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
    icons,
    showCloseButton = true,
    showSearchButton = true,
  }) => {
    const dispatchStorePrincipal = useDispatchStorePrincipal();

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
        else if (name === "config_complementar_conditional_multileg") {
          dispatchStorePrincipal(cond_openCloseMultilegExtraConfigsAction());
        }
      },
      [dispatchStorePrincipal, name, onClose],
    );

    return (
      <div className={`${headerClass} handle mheader`}>
        {children}
        <h6 className="mtitle">{headerTitle === "THL" ? "" : headerTitle}</h6>
        <div className="wrapperIconesHeader">
          {!!icons && icons}

          {showSearchButton && (
            <BotaoAbrirFiltrarOrdens headerTitle={headerTitle} />
          )}

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

          {showCloseButton && (
            <button
              className="brokerCustomButton iconesHeader"
              name={name}
              onClick={handleClose}
            >
              <img className="closeIcon" src={closeIcon} alt="Fechar" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

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
        <FiSearch size={20} strokeWidth={3} />
        {/* <MDBIcon icon="search" size="2x"></MDBIcon> */}
      </Button>
    );
  }

  return botaoAbrirFiltrarOrdens;
};
