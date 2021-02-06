import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from "recharts";
import DraggableModal from "shared/componentes/DraggableModal";
import { ModalHeaderSemBook } from "shared/componentes/PopupHeader";
import Tabela1Custos from "./Tabela1Custos";
import Tabela2ProximaOrdem from "./Tabela2ProximaOrdem";
import EmblemaRelatorio from "./EmblemaRelatorio";
import Tabela3Resultado from "./Tabela3Resultado";
import Tabela4HistoricoOrdens from "./Tabela4HistoricoOrdens";
import { data } from "modules/position/screens/posicao_detalhada/GraficoPatrimonio";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import { compose } from "redux";

class RelatorioDetalhado extends React.Component {
  componentDidMount() {
    if (
      this.props.divkey !== "" &&
      this.props.divkey === "relatorio_detalhado"
    ) {
      document.getElementById("relatorio_detalhado").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "relatorio_detalhado",
        this.props.zIndex,
        true,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const {
      divkey,
      isOpenDetailedReport,
      aumentarZindexAction,
      zIndex,
    } = this.props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "relatorio_detalhado",
      popupVisibility: isOpenDetailedReport,
      updateFunction: aumentarZindexAction,
    });
  }

  render() {
    return (
      <DraggableModal
        id="relatorio_detalhado"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
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
  /*
 
  */

  modalBody = (props) => {
    return (
      <div className="bodyRelatorioDetalhado">
        <Row className="row1">
          <Col md={"0"}>
            <h6>TRAVA HORIZONTAL DE LINHA - THL</h6>
            <h6>PUT 28 PETR</h6>
          </Col>
          <Col md={"0"}>
            <div className="flexRow ativoCompra">
              <h6 className="mr-1">PETRT275</h6>
              <h6 className="qtdeAtivo">+1k</h6>
            </div>
            <div className="flexRow ativoVenda">
              <h6 className="mr-1">PETRX280</h6>
              <h6 className="qtdeAtivo">+1k</h6>
            </div>
          </Col>
          <Col md={"0"}>
            <div className={`flexRow ${positivoNegativo(180)}`}>
              <h6 className="mr-3">Resultado: R$ +180,00</h6>
              <h6>+38,46%</h6>
            </div>
          </Col>
          <Col md={"0"}>
            <div className={`${positivoNegativo(180)}`}>
              <h6>Inicio</h6>
              <h6>25/06/2019</h6>
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="pl-1 pr-1">
            <Tabela1Custos></Tabela1Custos>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>Próxima Ordem</h6>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="pl-1 pr-1">
            <Tabela2ProximaOrdem></Tabela2ProximaOrdem>
          </Col>
        </Row>
        <Row className="text-align-center">
          <Col className="colTextoPosicao mr-1 ml-1 p-1">
            <h6>POSIÇÃO</h6>
          </Col>
        </Row>
        <Row className="mt-2 text-align-center">
          <Col className="colTextoPosicao mr-2 ml-1 p-1">
            <h6>PROVISÓRIO</h6>
          </Col>
          <Col className="colTextoPosicao mr-1 ml-2 p-1">
            <h6>PERMANENTE (GARANTIAS)</h6>
          </Col>
        </Row>
        <Row className="mt-2 flexJustifyCenter">
          <div className="divListagenEmblemasRelatorio">
            <div className="ml-3 mr-3 mt-2">
              <EmblemaRelatorio item={item}></EmblemaRelatorio>
            </div>
            <div className="ml-3 mr-3 mt-2">
              <EmblemaRelatorio item={item}></EmblemaRelatorio>
            </div>
            <div className="ml-3 mr-3 mt-2">
              <EmblemaRelatorio item={item}></EmblemaRelatorio>
            </div>
            <div className="ml-3 mr-3 mt-2">
              <EmblemaRelatorio item={item}></EmblemaRelatorio>
            </div>
          </div>
        </Row>
        <Row className="mt-2" style={{ justifyContent: "center" }}>
          <Col>
            <ResponsiveContainer
              width={"100%"}
              height={150}
              className="containerGrafico"
            >
              <BarChart
                width={500}
                height={150}
                data={data}
                margin={{ top: 15, right: 5, left: 0, bottom: 2 }}
                barSize={30}
                stackOffset="sign"
              >
                <CartesianGrid strokeDasharray="5 5" stroke="#444" />
                <XAxis dataKey="dia" height={18}></XAxis>
                <YAxis width={35}></YAxis>
                <Tooltip labelStyle={{ color: "#000" }}></Tooltip>
                <Legend></Legend>

                <ReferenceLine y={0} stroke="#888" />
                <Bar
                  name="Dinheiro"
                  dataKey="dinheiro"
                  stackId="patrimonio"
                  fill="#ad8abe"
                ></Bar>
                <Bar
                  name="Opção"
                  dataKey="opcao"
                  stackId="patrimonio"
                  fill="#ddbe05"
                ></Bar>
                <Bar
                  name="Ação"
                  dataKey="acao"
                  stackId="patrimonio"
                  fill="#a67269"
                  label={{ position: "top", fill: "#ddd" }}
                ></Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row className="text-align-center">
          <Col className="colTextoPosicao mr-1 ml-1 p-1 mt-2">
            <h6>RESULTADO</h6>
          </Col>
        </Row>
        <Row>
          <Col className="pl-1 pr-1">
            <Tabela3Resultado></Tabela3Resultado>
          </Col>
        </Row>
        <Row>
          <Col className="colTextoPosicao mr-1 ml-1 pt-1 pb-1">
            <h5 className="mb-0">Histórico de Ordens</h5>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col className="pl-1 pr-1">
            <Tabela4HistoricoOrdens></Tabela4HistoricoOrdens>
          </Col>
        </Row>
      </div>
    );
  };
}

const positivoNegativo = (valor) => {
  if (valor >= 0) return "porcentagemPositiva";
  else return "porcentagemNegativa";
};

const item = {
  ativo: "PETR4",
  custodiaCompra: [
    { ativo: "X280", qtde: 1000 },
    { ativo: "X290", qtde: 1000 },
  ],
  custodiaVenda: [
    { ativo: "S272", qtde: 1000 },
    { ativo: "S290", qtde: 1000 },
  ],
  precoCompra: 2.5,
  precoVenda: 2.6,
  valorAcao: 2.55,
  porcentagem: -5.36,
  porcentagemResultado: 38.46,
  executando: [
    { ativo: "S272", qtde: 1000, valor: "0,30", tipo: "compra" },
    { ativo: "T272", qtde: 1000, valor: "0,40", tipo: "venda" },
  ],
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
  };
};

const mapStateToPropsRelatorio = (state) => {
  return {
    isOpenDetailedReport: state.systemReducer.isOpenDetailedReport,
  };
};

export default compose(
  connect(mapStateToPropsGlobalStore, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(mapStateToPropsRelatorio, {}, null, {
    context: StorePrincipalContext,
  }),
)(RelatorioDetalhado);
