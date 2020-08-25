import React, { useCallback } from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactResizeDetector from "react-resize-detector";
import DraggableModal from "shared/componentes/DraggableModal";
import { ModalHeaderSemBook } from "shared/componentes/PopupHeader";
import MapaCalor from "telas/popups/thl/MapaCalor";
import { GlobalContext } from "redux/StoreCreation";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import MenuTopo from "telas/popups/thl/MenuTopo";
import ContainerTabelaVencimentos from "telas/popups/thl/tabelaDeVencimentos/ContainerTabelaVencimentos";
import ContainerTabelaCombinacoes, {
  calcularMargemBorda,
  verificarOverflow,
} from "telas/popups/thl/tabelaCombinacoes/ContainerTabelaCombinacoes";

class Tela_THL extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "thl") {
      document.getElementById("thl").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("thl", this.props.zIndex, true);
    }
  }

  render() {
    const { ModalBody } = this;
    return (
      <DraggableModal
        id="thl"
        renderModalBody={() => <ModalBody />}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() => (
          <ModalHeaderSemBook
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
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

export default connect(mapDateToPropsGlobal, { aumentarZindexAction }, null, {
  context: GlobalContext,
})(Tela_THL);
