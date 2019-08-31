import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import TabelaCompleta from "components/forms/posicao_/TabelaCompleta";
import TabelaSimples from "components/forms/posicao_/TabelaSimples";

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
            <div
              style={{
                border: "2px solid #4a494c",
                borderRadius: "10px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <h4>Gráfico</h4>
            </div>
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
