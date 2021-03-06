import React, { useCallback } from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactResizeDetector from "react-resize-detector";
import DraggableModal from "shared/components/DraggableModal";
import { PopupHeader } from "shared/components/PopupHeader";
import MapaCalor from "./MapaCalor";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import MenuTopo from "./MenuTopo";
import ContainerTabelaVencimentos from "./tabelaDeVencimentos/ContainerTabelaVencimentos";
import ContainerTabelaCombinacoes, {
  calcularMargemBorda,
  verificarOverflow,
} from "./tabelaCombinacoes/ContainerTabelaCombinacoes";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import { compose } from "redux";

import "../styles/thl.scss";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

class Tela_THL extends React.Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "thl") {
      document.getElementById("thl").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("thl", this.props.zIndex, true);
    }
  }

  componentDidUpdate(prevProps) {
    const { divkey, isOpenTHL, aumentarZindexAction, zIndex } = this.props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "thl",
      popupVisibility: isOpenTHL,
      updateFunction: aumentarZindexAction,
    });
  }

  onClose() {
    this.props.abrirItemBarraLateralAction("isOpenTHL");
  }

  render() {
    const { ModalBody } = this;
    return (
      <DraggableModal
        id="thl"
        renderModalBody={() => <ModalBody />}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() => (
          <PopupHeader
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            onConfig={() => {}}
            onClose={this.onClose}
          />
        )}
      />
    );
  }

  ModalBody = () => {
    const handleTHLResize = useCallback(() => {
      const container = document.getElementsByClassName(
        "containerTabelaComb",
      )[0];
      if (container.scrollWidth > container.clientWidth) {
        container.classList.add("bordaRedimensionar");
        container.style.height += verificarOverflow();
      } else {
        container.classList.remove("bordaRedimensionar");
        container.style.height -= verificarOverflow();
      }
      calcularMargemBorda();
    }, []);

    return (
      <PerfectScrollbar
        id="scrollbarTHL"
        options={{
          wheelPropagation: false,
        }}
      >
        <div className="containerTHL">
          <MapaCalor />
          <MenuTopo />
          <ContainerTabelaVencimentos />
          <ContainerTabelaCombinacoes />
          <ReactResizeDetector handleWidth onResize={handleTHLResize} />
        </div>
      </PerfectScrollbar>
    );
  };
}

const mapDateToPropsGlobal = (state) => ({
  divkey: state.GlobalReducer.divkey,
  zIndex: state.GlobalReducer.zIndex,
});

const mapStateToPropsTHL = (state) => ({
  isOpenTHL: state.systemReducer.isOpenTHL,
});

export default compose(
  connect(mapDateToPropsGlobal, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(mapStateToPropsTHL, { abrirItemBarraLateralAction }, null, {
    context: StorePrincipalContext,
  }),
)(Tela_THL);
