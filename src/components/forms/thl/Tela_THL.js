import React from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactResizeDetector from "react-resize-detector";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import { ModalHeaderSemBook } from "components/utils/componentesUI/FormHeader";
import MapaCalor from "components/forms/thl/MapaCalor";
import TabelaCombinacoes, {
  calcularMargemBorda,
  verificarOverflow,
} from "components/forms/thl/tabelaCombinacoes/TabelaCombinacoes";
import {
  GlobalContext,
  StateStorePrincipal,
} from "components/redux/StoreCreation";
import { aumentarZindexAction } from "components/redux/actions/MainAppActions";
import MenuTopo from "components/forms/thl/MenuTopo";
import ContainerTabelaVencimentos from "components/forms/thl/tabelaDeVencimentos/ContainerTabelaVencimentos";

// window.jQuery = require("jquery");
// window.$ = window.jQuery;
// require("fixed-header-table");

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
          <TabelaCombinacoes />
          <ReactResizeDetector
            handleWidth
            onResize={(w, h) => {
              const container = document.getElementsByClassName(
                "containerTabelaComb"
              )[0];
              if (container.scrollWidth > container.clientWidth) {
                container.classList.add("bordaRedimensionar");
                container.style.height += verificarOverflow();
              } else {
                container.classList.remove("bordaRedimensionar");
                container.style.height -= verificarOverflow();
              }
              calcularMargemBorda();
            }}
          />
        </div>
      </PerfectScrollbar>
    );
  };
}

const mapDateToPropsGlobal = (state) => ({
  divkey: state.MainAppReducer.divkey,
  zIndex: state.MainAppReducer.zIndex,
});

export default connect(mapDateToPropsGlobal, { aumentarZindexAction }, null, {
  context: GlobalContext,
})(Tela_THL);
