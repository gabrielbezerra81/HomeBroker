import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Row, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { mudarInputHeaderAction } from "components/redux/actions/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "components/redux/actions/api_actions/bookOfertaAPIActions";
import {
  fecharFormAction,
  abrirFormAction,
  fecharFormConfigurarAction,
} from "components/redux/reducers/MainAppReducer";
import {
  useSelectorGlobalStore,
  useDispatchGlobalStore,
  useDispatchStorePrincipal,
  useSelectorStorePrincipal,
  DispatchStorePrincipal,
  DispatchBoletas,
  DispatchGlobalStore,
} from "components/redux/StoreCreation";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import { abrirFecharConfigComplAction } from "components/redux/actions/menu_actions/MultilegActions";

// Apenas para boletas de compra e venda
export const ModalHeader = ({
  headerTitle,
  headerClass,
  resetPosition,
  name,
  ativo,
  eventSourceCotacao,
}) => {
  const state = useSelector((state) => state.SubAppReducer);
  const stateGlobalStore = useSelectorGlobalStore(
    (state) => state.MainAppReducer
  ); // Filtrar state pelo nome do reducer
  const dispatch = DispatchGlobalStore();
  const formShow = stateGlobalStore.show;
  const { appkey } = state.appProps;
  const abrirBookProps = {
    ...stateGlobalStore,
    mudarInputHeaderAction,
    listarBookOfertaOnEnterAction,
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
            dispatch(abrirFormAction(event, abrirBookProps, ativo));
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
            dispatch(fecharFormAction(formShow, name, appkey));
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
  const stateBook = useSelector((state) => state.bookOfertaReducer);
  const stateSubApp = useSelector((state) => state.SubAppReducer);
  const stateGlobalStore = useSelectorGlobalStore(
    (state) => state.MainAppReducer
  );
  const { inputHeader, eventSource } = stateBook;
  const formShow = stateGlobalStore.show;
  const { appkey } = stateSubApp.appProps;

  const dispatch = useDispatch();
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
            onKeyPress={(event) => {
              //event.preventDefault();
              if (event.key === "Enter")
                dispatch(
                  listarBookOfertaOnEnterAction(event.target.value, eventSource)
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
export const ModalHeaderSemBook = ({ headerTitle, headerClass, name }) => {
  const dispatchStorePrincipal = useDispatchStorePrincipal();
  const nomeVariavelReducer = getNomeVariavelReducer(headerTitle);
  const abrirMenuProps = GetAbrirMenuProps();

  return (
    <div className={`${headerClass} handle mheader`}>
      <h6 className="mtitle">{headerTitle === "THL" ? "" : headerTitle}</h6>
      <div className="wrapperIconesHeader">
        {headerTitle === "HISTÓRICO DE OPERAÇÕES" ? (
          <Button variant="link" className="iconesHeader">
            <MDBIcon icon="cog" size="2x"></MDBIcon>
          </Button>
        ) : null}
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
          <span className="fa-stack hoverIconeFechar iconesHeader">
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

// form configurar ordem start stop
export const ModalHeaderLimpo = ({ titulo, name = "" }) => {
  // form Configurar Stop  => fecharFormConfigurarAction(event)
  // multileg config compl => abrirFecharConfigComplAction( this.props.configComplementarAberto)
  let funcaoFechar;

  const stateStorePrincipal = useSelectorStorePrincipal(
    (state) => state.multilegReducer
  );

  const { configComplementarAberto } = stateStorePrincipal;

  if (["config_compra", "config_venda"].includes(name)) {
    const dispatch = DispatchBoletas();
    funcaoFechar = (e) => dispatch(fecharFormConfigurarAction(e));
  } //
  else if (name === "config_complementar") {
    const dispatchStorePrincipal = DispatchStorePrincipal();
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
  return useSelectorStorePrincipal((state) => {
    const {
      ordensExecucaoAberto,
      relatorioDetalhadoAberto,
      listaCompletaAberta,
      multilegAberto,
      thlAberta,
    } = state.telaPrincipalReducer;
    const { eventSource, eventSourceCotacao } = state.multilegReducer;
    const {
      eventSourceEmblema,
      eventSourcePosicao,
      eventSourceCotacoes,
    } = state.posicaoReducer;
    const { eventSourceOrdensExec } = state.ordensExecReducer;

    const props = {
      ordensExecucaoAberto,
      relatorioDetalhadoAberto,
      listaCompletaAberta,
      multilegAberto,
      thlAberta,
      eventSourceBook_Multileg: eventSource,
      eventSourceCotacao_Multileg: eventSourceCotacao,
      eventSourceEmblema_Posicao: eventSourceEmblema,
      eventSourcePosicao_Posicao: eventSourcePosicao,
      eventSourceCotacoes_Posicao: eventSourceCotacoes,
      eventSourceOrdensExec_OrdensExec: eventSourceOrdensExec,
    };

    return props;
  });
};
