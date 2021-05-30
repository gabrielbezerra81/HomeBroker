import React, { useCallback, useMemo, useState } from "react";
import DraggableModal from "shared/components/DraggableModal";
import { PopupHeader } from "shared/components/PopupHeader";
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
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

import { MdRefresh } from "react-icons/md";
import OrdersTable from "./OrdersTable";

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

  renderModalBody() {
    return <OrdersTable />;
  }

  render() {
    return (
      <DraggableModal
        id="ordens_execucao"
        renderModalBody={this.renderModalBody}
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
