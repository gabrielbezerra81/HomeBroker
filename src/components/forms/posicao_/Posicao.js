import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import TabelaCompleta from "components/forms/posicao_/TabelaCompleta";
import TabelaSimples from "components/forms/posicao_/TabelaSimples";
import Chart from "react-apexcharts";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  BarChart,
  Bar,
  Legend
} from "recharts";

const dia = [
  ,
  "04-25",
  "04-26",
  "04-27",
  "04-28",
  "04-29",
  "04-30",
  "05-01",
  "05-02",
  "05-03"
];
const patrimonio = [426, 839, 992, 2249, 1462, 1095, 705, 712, 1514, 2130];

export default class Posicao extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "posicao") {
      document.getElementById("posicao").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("posicao", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="posicao"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div className="bodyPosicao">
        <Row>
          <Col md={2}>
            <h6>Balanço atual</h6>
            <h6>Dinheiro</h6>
            <h6>Posição líquido</h6>
          </Col>
          <Col md={2}>
            <h6>Valor</h6>
            <h6>
              R${" "}
              {dados.dinheiro.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })}
            </h6>
            <h6>
              R${" "}
              {dados.posicaoLiquida.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })}
            </h6>
          </Col>
          <Col md={2}>
            <h6>Mudança do dia</h6>
          </Col>
          <Col md={6}>
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
              >
                <XAxis dataKey="dia" height={18}></XAxis>
                <YAxis width={35}></YAxis>
                <Tooltip></Tooltip>
                <Legend></Legend>
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#444"
                ></CartesianGrid>
                <Bar
                  dataKey="dinheiro"
                  stackId="patrimonio"
                  fill="#265626"
                ></Bar>
                <Bar dataKey="opcao" stackId="patrimonio" fill="#ddbe05"></Bar>
                <Bar
                  dataKey="acao"
                  stackId="patrimonio"
                  fill="#a67269"
                  label={{ position: "top", fill: "#ddd" }}
                ></Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row className="rowCheckbox">
          <Col md={7} className="divCheckbox">
            <Col md={0}>
              <div className="divCheckbox">
                <div className="round mr-3">
                  <input type="checkbox" id="checkbox" />
                  <label htmlFor="checkbox"></label>
                </div>
                <h6>Ações</h6>
              </div>
            </Col>
            <Col md={0}>
              <div className="divCheckbox">
                <div className="round mr-3">
                  <input type="checkbox" id="checkbox2" />
                  <label htmlFor="checkbox2"></label>
                </div>
                <h6>Opções</h6>
              </div>
            </Col>
            <Col md={0}>
              <div className="divCheckbox">
                <div className="round mr-3">
                  <input type="checkbox" id="checkbox3" />
                  <label htmlFor="checkbox3"></label>
                </div>
                <h6>Agrupados por Operações</h6>
              </div>
            </Col>
            <Col md={0}>
              <div className="divCheckbox">
                <div className="round mr-3">
                  <input type="checkbox" id="checkbox4" />
                  <label htmlFor="checkbox4"></label>
                </div>
                <h6>Executando</h6>
              </div>
            </Col>
          </Col>
        </Row>
        {dados.item.map((item, indice) => {
          if (item.estrategia === "COMPRA" || item.estrategia === "VENDA")
            return <TabelaSimples dados={item} key={indice}></TabelaSimples>;
          else
            return <TabelaCompleta dados={item} key={indice}></TabelaCompleta>;
        })}
      </div>
    );
  };
}

const dados = {
  dinheiro: 227708,
  posicaoLiquida: 227708,
  item: [
    {
      estrategia: "COMPRA",
      ativo: "PETR4",
      dataInicio: "25/06/2019",
      precoCompra: 2.5,
      precoVenda: 2.6,
      valorAcao: 2.55,
      porcentagem: 5.36,
      stop: 0,
      gain: 3.6,
      resultado: {
        valor: 1800,
        variacao: 30.46
      },
      operacoes: [
        {
          codigo: "PETR4",
          qtde: 10000,
          precoExec: {
            qtde: "+1",
            unit: 26
          },
          atual: 280000,
          osc: 7.69,
          saldoOp: 20000,
          compra: {
            qtde: 3700,
            preco: 28.26
          },
          venda: {
            qtde: 2700,
            preco: 28.27
          }
        }
      ]
    },
    {
      estrategia: "BORBOLETA",
      ativo: "PETR",
      dataInicio: "25/06/2019",
      precoCompra: 0.18,
      precoVenda: 0.22,
      valorAcao: 0.18,
      porcentagem: 2.0,
      stop: 0,
      gain: 0.4,
      resultado: {
        valor: 180,
        variacao: 38.46
      },
      operacoes: [
        {
          codigo: "G260",
          qtde: 1000,
          vcto: "15/07/2019",
          prazo: 21,
          strike: 26.0,
          intr: 2.7,
          ext: 2.7,
          precoExec: {
            qtde: "+1",
            unit: 2.61
          },
          atual: 2560,
          osc: 1.91,
          saldoOp: 50,
          compra: {
            qtde: 3700,
            preco: 2.56
          },
          venda: {
            qtde: 700,
            preco: 2.57
          }
        },
        {
          codigo: "G27",
          qtde: 2000,
          vcto: "15/07/2019",
          prazo: 21,
          strike: 27,
          intr: 2.21,
          ext: 2.21,
          precoExec: {
            qtde: "-2",
            unit: 1.74
          },
          atual: 3360,
          osc: 3.45,
          saldoOp: 120,
          compra: {
            qtde: 3700,
            preco: 1.68
          },
          venda: {
            qtde: 1700,
            preco: 1.69
          }
        },
        {
          codigo: "G280",
          qtde: 1000,
          vcto: "15/07/2019",
          prazo: 21,
          strike: 28,
          intr: 0.6,
          ext: 0.6,
          precoExec: {
            qtde: "+1",
            unit: 1
          },
          atual: 980,
          osc: -2,
          saldoOp: 20,
          compra: {
            qtde: 3700,
            preco: 0.98
          },
          venda: {
            qtde: 2700,
            preco: 0.99
          }
        }
      ]
    },
    {
      estrategia: "BORBOLETA",
      ativo: "PETR",
      dataInicio: "25/06/2019",
      precoCompra: 0.18,
      precoVenda: 0.22,
      valorAcao: 0.18,
      porcentagem: 2.0,
      stop: 0,
      gain: 0.4,
      resultado: {
        valor: 180,
        variacao: 38.46
      },
      operacoes: [
        {
          codigo: "G260",
          qtde: 1000,
          vcto: "15/07/2019",
          prazo: 21,
          strike: 26.0,
          intr: 2.7,
          ext: 2.7,
          precoExec: {
            qtde: "+1",
            unit: 2.61
          },
          atual: 2560,
          osc: 1.91,
          saldoOp: 50,
          compra: {
            qtde: 3700,
            preco: 2.56
          },
          venda: {
            qtde: 700,
            preco: 2.57
          }
        },
        {
          codigo: "G27",
          qtde: 2000,
          vcto: "15/07/2019",
          prazo: 21,
          strike: 27,
          intr: 2.21,
          ext: 2.21,
          precoExec: {
            qtde: "-2",
            unit: 1.74
          },
          atual: 3360,
          osc: 3.45,
          saldoOp: 120,
          compra: {
            qtde: 3700,
            preco: 1.68
          },
          venda: {
            qtde: 1700,
            preco: 1.69
          }
        },
        {
          codigo: "G280",
          qtde: 1000,
          vcto: "15/07/2019",
          prazo: 21,
          strike: 28,
          intr: 0.6,
          ext: 0.6,
          precoExec: {
            qtde: "+1",
            unit: 1
          },
          atual: 980,
          osc: -2,
          saldoOp: 20,
          compra: {
            qtde: 3700,
            preco: 0.98
          },
          venda: {
            qtde: 2700,
            preco: 0.99
          }
        }
      ]
    }
  ]
};

const data = [
  {
    dia: "04-24",
    acao: 100,
    opcao: 150,
    dinheiro: 220
  },
  {
    dia: "04-25",
    acao: 200,
    opcao: 250,
    dinheiro: 350
  },
  {
    dia: "04-26",
    acao: 300,
    opcao: 350,
    dinheiro: 450
  },
  {
    dia: "04-27",
    acao: 400,
    opcao: 450,
    dinheiro: 550
  },
  {
    dia: "04-28",
    acao: 420,
    opcao: 550,
    dinheiro: 650
  },
  {
    dia: "04-29",
    acao: 320,
    opcao: 450,
    dinheiro: 550
  },
  {
    dia: "04-30",
    acao: 220,
    opcao: 350,
    dinheiro: 450
  },
  {
    dia: "05-01",
    acao: 200,
    opcao: 300,
    dinheiro: 400
  },
  {
    dia: "05-02",
    acao: 150,
    opcao: 250,
    dinheiro: 330
  },
  {
    dia: "05-03",
    acao: 100,
    opcao: 180,
    dinheiro: 250
  }
];

/*
ResponsiveContainer width={"100%"} height={100}>
              <LineChart
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                width={500}
                height={100}
                data={[
                  { name: "Dia 1", x: x[0], y: y[0] },
                  { name: "Dia 2", x: x[1], y: y[1] },
                  { name: "Dia 3", x: x[2], y: y[2] },
                  { name: "Dia 4", x: x[3], y: y[3] },
                  { name: "Dia 5", x: x[4], y: y[4] },
                  { name: "Dia 6", x: x[5], y: y[5] },
                  { name: "Dia 7", x: x[6], y: y[6] },
                  { name: "Dia 8", x: x[7], y: y[7] },
                  { name: "Hoje", x: x[8], y: y[8] }
                ]}
              >
                <Line type="monotone" dataKey="y" stroke="green" dot={false} />
                <XAxis dataKey="x" height={20}></XAxis>
                <YAxis width={25}></YAxis>
                <CartesianGrid
                  stroke="#333"
                  strokeDasharray="4 4"
                ></CartesianGrid>
                <Tooltip></Tooltip>
                <ReferenceLine
                  x={x[4]}
                  stroke="#388daf"
                  strokeDasharray="4 4"
                ></ReferenceLine>
                <ReferenceArea
                  x1={20}
                  x2={40}
                  y1={0}
                  y2={100}
                  fill="#444"
                  fillOpacity={0.2}
                />
              </LineChart>
            </ResponsiveContainer>


*/
