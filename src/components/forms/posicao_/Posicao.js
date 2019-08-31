import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Table } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import EmblemaSimples from "components/utils/EmblemaSimples";

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
            <h6>R$ {dados.dinheiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h6>
            <h6>R$ {dados.posicaoLiquida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h6>
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
        <Row>
          <Col md={3}>
            <h5>{dados.estrategia}: {dados.ativo}</h5>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col md={6}></Col>
          <Col md={3} className="text-align-right">
          <h6>{calculaResultado(dados.resultado)}</h6>
          </Col>
          <Col md={3} className="text-align-right">
            <h6>Início: {dados.dataInicio}</h6>
          </Col>
        </Row>
        <Row className="rowCompra mb-3">
          <Col md={0} className="pb-3">
            <EmblemaSimples item={dados}></EmblemaSimples>
          </Col>
          <Col className="colTabela">
            <Table
              variant="dark"
              borderless
              striped
              className="tabelaCompraPosicao text-center mt-1"
              style={{ tableLayout: "auto" }}
            >
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Qtde</th>
                  <th>Preço Execução</th>
                  <th>Resultado</th>
                  <th className="colunaCompraVenda">
                    <span>Compra</span>
                    <span>Venda</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="colunaDividida">
                      <div>Qtde</div>
                      <div>Unit</div>
                      <div className="colunaTotal">Total</div>
                    </div>
                  </td>
                  <td>
                    <div className="colunaDividida">
                      <div>Atual</div>
                      <div>Osc.</div>
                      <div>Saldo Op.</div>
                    </div>
                  </td>
                  <td>
                    <div className="colunaDividida">
                      <div>Qtde</div>
                      <div>Preço</div>
                      <div>Preço</div>
                      <div>Qtde</div>
                    </div>
                  </td>
                </tr>
                {dados.operacoes.map((item, index) => (
                  <tr key={index}>
                    <td>{item.codigo}</td>
                    <td>{item.qtde / 1000}k</td>
                    <td>
                      <div className="colunaDividida">
                        <div>{item.precoExec.qtde}</div>
                        <div>{item.precoExec.unit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                        <div className="colunaTotal">
                          {calculaTotal(item.precoExec)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>{item.atual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                        <div>{item.osc.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%</div>
                        <div>{item.saldoOp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>{(item.compra.qtde / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}k</div>
                        <div>{item.compra.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                        <div>{item.venda.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                        <div>{(item.venda.qtde / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}k</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h5>{renderAtivos(dados2)}</h5>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col md={6}></Col>
          <Col md={3} className="text-align-right">
            <h6>{calculaResultado(dados2.resultado)}</h6>
          </Col>
          <Col md={3} className="text-align-right">
            <h6>Início: {dados2.dataInicio}</h6>
          </Col>
        </Row>
        <Row className="rowCompra mb-3">
          <Col md={0} className="pb-3">
            <EmblemaSimples item={dados2}></EmblemaSimples>
          </Col>
          <Col className="colTabela">
            <Table
              variant="dark"
              borderless
              striped
              className="tabelaCompraPosicao text-center mt-1"
              style={{ tableLayout: "auto" }}
            >
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Qtde</th>
                  <th>Vcto</th>
                  <th>Prazo</th>
                  <th>Strike</th>
                  <th>Análise</th>
                  <th>Preço Execução</th>
                  <th>Resultado</th>
                  <th className="colunaCompraVenda">
                    <span>Compra</span>
                    <span>Venda</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Intr/Ext</td>
                  <td>
                    <div className="colunaDividida">
                      <div>Qtde</div>
                      <div>Unit</div>
                      <div className="colunaTotal">Total</div>
                    </div>
                  </td>
                  <td>
                    <div className="colunaDividida">
                      <div>Atual</div>
                      <div>Osc.</div>
                      <div>Saldo Op.</div>
                    </div>
                  </td>
                  <td>
                    <div className="colunaDividida">
                      <div>Qtde</div>
                      <div>Preço</div>
                      <div>Preço</div>
                      <div>Qtde</div>
                    </div>
                  </td>
                </tr>
                {dados2.operacoes.map((item, index) => (
                  <tr key={index}>
                    <td>{item.codigo}</td>
                    <td>{item.qtde / 1000}k</td>
                    <td>{item.vcto}</td>
                    <td>{item.prazo} dias</td>
                    <td>
                      {item.strike.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                      })}
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>
                          {item.intr.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                        <div>
                          {item.ext.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>{item.precoExec.qtde}</div>
                        <div>
                          {item.precoExec.unit.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                        <div className="colunaTotal">
                          {calculaTotal(item.precoExec)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>
                          {item.atual.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                        <div>{item.osc.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%</div>
                        <div>
                          {item.saldoOp.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>
                          {(item.compra.qtde / 1000).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                          k
                        </div>
                        <div>
                          {item.compra.preco.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                        <div>
                          {item.venda.preco.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                        </div>
                        <div>
                          {(item.venda.qtde / 1000).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                          k
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  };
}

const renderAtivos = (dados)=>{

  let ativos = `${dados.estrategia}: ${dados.ativo}`
  var codigos = "   "
  dados.operacoes.map(item=>{
    codigos += item.codigo +" | "
  })
  ativos+=codigos

  return ativos.substring(0, ativos.length-2)
}

const calculaTotal = item => {
  let total = Number(item.qtde) * 1000 * Number(item.unit);
  let tipo = ""
  if(total>=0 )
  tipo = " (D)"
  else
  tipo=" (C)"
  return total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })+tipo;
};

const calculaResultado = (resultado) => {
  let result = "Resultado: R$ "
  if(resultado.valor>=0)
  result += "+"
  else 
  result+="-"
  result+=resultado.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  if(resultado.variacao>=0)
  result += " +"
  else 
  result+=" -"
  result += resultado.variacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })+"%"

  return result
}

const dados2 = {
  dinheiro: 227708,
  posicaoLiquida: 227708,
  estrategia:"BORBOLETA",
  ativo: "PETR",
  dataInicio: "25/06/2019",
  precoCompra: 0.18,
  precoVenda: 0.22,
  valorAcao: 0.18,
  porcentagem: 2.00,
  stop: 0,
  gain: 0.40,
  resultado:{
    valor:180,
    variacao:38.46
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
};

const dados = {
  dinheiro: 227708,
  posicaoLiquida: 227708,
  estrategia:"COMPRA",
  ativo: "PETR4",
  dataInicio: "25/06/2019",
  precoCompra: 2.5,
  precoVenda: 2.6,
  valorAcao: 2.55,
  porcentagem: 5.36,
  stop: 0,
  gain: 3.6,
  resultado:{
    valor:1800,
    variacao:30.46
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
};
