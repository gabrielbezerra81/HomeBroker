import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import EmblemaSimples from "components/utils/EmblemaSimples";

export default class TabelaCompleta extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col md={12}>
            <h5>{renderAtivos(this.props.dados)}</h5>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col md={6}></Col>
          <Col md={3} className="text-align-right">
            <h6>{calculaResultado(this.props.dados.resultado)}</h6>
          </Col>
          <Col md={3} className="text-align-right">
            <h6>Início: {this.props.dados.dataInicio}</h6>
          </Col>
        </Row>
        <Row className="rowCompra mb-3">
          <Col md={0} className="pb-3">
            <EmblemaSimples item={this.props.dados}></EmblemaSimples>
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
                {this.props.dados.operacoes.map((item, index) => (
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
                        <div>
                          {item.osc.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                          })}
                          %
                        </div>
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
  }
}

const renderAtivos = dados => {
  let ativos = `${dados.estrategia}: ${dados.ativo}`;
  var codigos = "   ";
  dados.operacoes.map(item => {
    codigos += item.codigo + " | ";
  });
  ativos += codigos;

  return ativos.substring(0, ativos.length - 2);
};

export const calculaTotal = item => {
  let total = Number(item.qtde) * 1000 * Number(item.unit);
  let tipo = "";
  if (total >= 0) tipo = " (D)";
  else tipo = " (C)";
  return total.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) + tipo;
};

export const calculaResultado = resultado => {
  let result = "Resultado: R$ ";
  if (resultado.valor >= 0) result += "+";
  else result += "-";
  result += resultado.valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });
  if (resultado.variacao >= 0) result += " +";
  else result += " -";
  result +=
    resultado.variacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) +
    "%";

  return result;
};
