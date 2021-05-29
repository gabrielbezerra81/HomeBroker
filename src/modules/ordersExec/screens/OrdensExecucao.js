import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Table, ProgressBar } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import { PopupHeader } from "shared/components/PopupHeader";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { compose } from "redux";
import { connect } from "react-redux";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
import {
  listOrdersExecAction,
  updateOneOrdersExecStateAction,
} from "../duck/actions/OrdensExecActions";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import OpcoesOrdemExec from "./OpcoesOrdemExec";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

import { MdRefresh } from "react-icons/md";

class OrdensExecucao extends React.Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "ordens_execucao") {
      document.getElementById("ordens_execucao").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "ordens_execucao",
        this.props.zIndex,
        true,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { divkey, isOpenOrdersExec, aumentarZindexAction, zIndex } =
      this.props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "ordens_execucao",
      popupVisibility: isOpenOrdersExec,
      updateFunction: aumentarZindexAction,
    });
  }

  onClose() {
    this.props.abrirItemBarraLateralAction("isOpenOrdersExec");
  }

  render() {
    return (
      <DraggableModal
        id="ordens_execucao"
        renderModalBody={() => <ModalBody />}
        renderDivFiltrarOrdens={true}
        renderHeader={() => (
          <PopupHeader
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            onConfig={() => {}}
            onClose={this.onClose}
            icons={
              <>
                <RefreshButton />
              </>
            }
          />
        )}
      />
    );
  }
}

const ModalBody = () => {
  const {
    ordersExecReducer: { ordemAtual, tabelaOrdensExecucao, opcoesOrdemAberto },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const [initialTop, setInitialTop] = useState(null);

  useEffect(() => {
    if (ordemAtual) {
      const line = document.getElementById(ordemAtual.id);

      if (line) {
        const { height: lineHeight } = line.getBoundingClientRect();

        setInitialTop(line.offsetTop + 40 + lineHeight);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top = useMemo(() => {
    if (ordemAtual) {
      const line = document.getElementById(ordemAtual.id);

      if (line) {
        const { height: lineHeight } = line.getBoundingClientRect();

        setInitialTop(null);

        return line.offsetTop + 40 + lineHeight;
      }
    }

    return null;
  }, [ordemAtual]);

  const offerProps = useMemo(() => {
    return {
      ordemAtual,
      updateOneOrdersExecStateAction: (...data) => {
        dispatch(updateOneOrdersExecStateAction(...data));
      },
    };
  }, [dispatch, ordemAtual]);

  const formattedOrders = useMemo(() => {
    return tabelaOrdensExecucao.map((orderItem) => {
      const offers = orderItem.offers.map((offerItem) => {
        const formattedPrices = {};

        [
          ("precoDisparo", "precoEnvio", "precoLimite", "precoExecutado"),
        ].forEach((key) => {
          if (offerItem[key] || offerItem[key] === 0) {
            formattedPrices[key] = formatarNumDecimal(offerItem[key]);
          }
        });

        return { ...offerItem, formattedPrices };
      });

      return { ...orderItem, offers };
    });
  }, [tabelaOrdensExecucao]);

  return (
    <div className="bodyOrdensExecucao">
      <Row>
        <Table
          variant="dark"
          bordered={false}
          borderless
          className="tableOrdensExecucao text-center"
          responsive="lg"
        >
          <thead>
            <tr>
              <th>Progresso</th>
              <th>Cadastro</th>
              <th>Corretora</th>
              <th>Conta</th>
              <th>Operação</th>
              <th>Modo Exec</th>
              <th>Ativo</th>
              <th>Oferta</th>
              <th>Qtde Oferta</th>
              <th>Qtde Executada</th>
              <th>Qtde Cancelada</th>
              <th>Preço</th>
              <th>Preço Disparo</th>
              <th>Preço Envio</th>
              <th>Preço Limite</th>
              <th>Preço Executado</th>
              <th>Validade</th>
              <th>Roteador</th>
              <th>St</th>
              <th>Msg</th>
            </tr>
          </thead>
          <tbody className="verticalAlignColunaTabela">
            {formattedOrders.map((orderItem, index) => {
              const ofertaPrincipal = renderOferta(
                orderItem,
                index,
                offerProps,
                "ofertaPrincipal",
              );
              const ordensNext = orderItem.nextOrders.map(
                (nextOrder, nextIndex) =>
                  renderOferta(
                    nextOrder,
                    "ON" + nextIndex,
                    offerProps,
                    "ordemNext",
                  ),
              );

              return [ofertaPrincipal, ...ordensNext];
            })}
          </tbody>
        </Table>
        {opcoesOrdemAberto && ordemAtual && !!(top || initialTop) && (
          <OpcoesOrdemExec
            style={{
              top: `${top || initialTop}px`,
            }}
            id="opcoes_ordens"
            key={`opcoes${ordemAtual.id}`}
          />
        )}
      </Row>
    </div>
  );
};

const renderOferta = (order, index, props, tipo) => {
  let qtdeOferta = 0;
  let qtdeExecutada = 0;

  order.offers.forEach((oferta) => {
    qtdeOferta += oferta.qtdeOferta;
    qtdeExecutada += oferta.qtdeExecutada;
  });

  return (
    <tr
      id={order.id}
      key={order.id}
      className={classeOrdem(tipo, props, order)}
      onClick={
        tipo === "ofertaPrincipal"
          ? () => abrirOpcoesOrdem(props, order)
          : () => false
      }
    >
      <td>
        <ProgressBar
          animated
          variant="success"
          now={(qtdeExecutada / qtdeOferta) * 100}
          label={(qtdeExecutada / qtdeOferta) * 100 + "%"}
          className="barraProgresso"
        />
      </td>
      <td>
        <span>{order.cadastro}</span>
      </td>
      <td>{order.corretora}</td>
      <td>{order.conta}</td>
      <td>
        {order.operacao}
        <br></br>
        {order.offers[0]?.modoExec}
      </td>
      <td>{listarAtributoComposto(order.offers, "modoExec", "nao")}</td>
      <td>{listarAtributoComposto(order.offers, "ativo", "sim")}</td>
      <td>{listarAtributoComposto(order.offers, "oferta", "sim")}</td>
      <td>{listarAtributoComposto(order.offers, "qtdeOferta", "sim")}</td>
      <td>{listarAtributoComposto(order.offers, "qtdeExecutada", "sim")}</td>
      <td>{listarAtributoComposto(order.offers, "qtdeCancelada", "sim")}</td>
      <td>20,20</td>
      <td>{listarAtributoComposto(order.offers, "precoDisparo", "sim")}</td>
      <td>
        {order.formName === "Multileg"
          ? order.offers[0].formattedPrices.precoEnvio
          : listarAtributoComposto(order.offers, "precoEnvio", "sim")}
      </td>
      <td>{listarAtributoComposto(order.offers, "precoLimite", "sim")}</td>
      <td>{listarAtributoComposto(order.offers, "precoExecutado", "sim")}</td>
      <td>{order.validade}</td>
      <td>{order.roteador}</td>
      <td>{listarAtributoComposto(order.offers, "status", "nao")}</td>

      <td>{listarAtributoComposto(order.offers, "msg", "nao")}</td>
    </tr>
  );
};

const classeOfertaVenda = (oferta) => {
  if (oferta.oferta === "V") return "colunasOfertaVenda";
  return "";
};

const listarAtributoComposto = (listaOfertas, atributo, classeCor) => {
  return listaOfertas.map((offer, index2) => {
    if (
      offer.modoExec === "ajuste" &&
      ["qtdeOferta", "qtdeExecutada", "precoExecutado"].includes(atributo)
    )
      return null;

    let value = offer[atributo];

    if (atributo.includes("preco"))
      value = offer.formattedPrices[atributo] || "";

    return (
      <span
        key={index2 + atributo}
        className={classeCor === "sim" ? classeOfertaVenda(offer) : ""}
      >
        {value}
        <br />
      </span>
    );
  });
};

const classeOrdem = (tipo, props, item) => {
  let classe = "";

  if (tipo === "ofertaPrincipal") classe += " divClicavel rowTabelaOrdensExec ";
  else classe += " ";

  if (props.ordemAtual) {
    if (item.id === props.ordemAtual.id) classe += "ordemSelecionada";
    else classe += " ";
  } else classe += " ";

  return classe;
};

const abrirOpcoesOrdem = (props, item) => {
  if (props.ordemAtual) {
    if (props.ordemAtual.id === item.id) {
      props.updateOneOrdersExecStateAction("opcoesOrdemAberto", false);
      props.updateOneOrdersExecStateAction("ordemAtual", null);
    } //
    else {
      props.updateOneOrdersExecStateAction("ordemAtual", item);
      props.updateOneOrdersExecStateAction("opcoesOrdemAberto", true);
    }
  } //
  else {
    props.updateOneOrdersExecStateAction("ordemAtual", item);
    props.updateOneOrdersExecStateAction("opcoesOrdemAberto", true);
  }
};

const RefreshButton = () => {
  const dispatch = useDispatchStorePrincipal();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    await dispatch(listOrdersExecAction());

    setIsRefreshing(false);
  }, [dispatch]);

  const refreshingClass = useMemo(() => {
    if (isRefreshing) {
      return "isRefreshing";
    }

    return "";
  }, [isRefreshing]);

  return (
    <button
      onClick={handleRefresh}
      className={`brokerCustomButton iconesHeader headerRefreshButton ${refreshingClass}`}
    >
      <MdRefresh size={24} />
    </button>
  );
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
  };
};

const mapStateToPropsOrdensExec = (state) => ({
  tabelaOrdensExecucao: state.ordersExecReducer.tabelaOrdensExecucao,
  ativo: state.ordersExecReducer.ativo,
  opcoesOrdemAberto: state.ordersExecReducer.opcoesOrdemAberto,
  ordemAtual: state.ordersExecReducer.ordemAtual,
  token: state.systemReducer.token,
  isOpenOrdersExec: state.systemReducer.isOpenOrdersExec,
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    { aumentarZindexAction, atualizarDivKeyAction },
    null,
    { context: GlobalContext },
  ),
  connect(
    mapStateToPropsOrdensExec,
    {
      updateOneOrdersExecStateAction,
      abrirItemBarraLateralAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(OrdensExecucao);
