import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import EmblemaSimples from "components/utils/EmblemaSimples";
import {
  calculaTotal,
  calculaResultado
} from "components/forms/posicao_/TabelaCompleta";

export default class TabelaSimples extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col md={3}>
            <h5>
              {this.props.dados.estrategia}: {this.props.dados.ativo}
            </h5>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col md={6}></Col>
          <Col md={3} className="text-align-right">
            <h6>{calculaResultado(this.props.dados.resultado)}</h6>
          </Col>
          <Col md={3} className="text-align-right">
            <h6 className="textosTitulos">
              Início: {this.props.dados.dataInicio}
            </h6>
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
                {this.props.dados.operacoes.map((item, index) => (
                  <tr key={index}>
                    <td>{item.codigo}</td>
                    <td>{item.qtde / 1000}k</td>
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
