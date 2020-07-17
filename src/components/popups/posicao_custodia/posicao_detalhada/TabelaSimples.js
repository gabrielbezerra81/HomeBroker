import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import EmblemaSimples from "components/utils/componentesUI/EmblemaSimples";
import {
  calculaTotal,
  calculaResultado,
  calculaVariacao,
  corSaldoOp,
} from "components/popups/posicao_custodia/posicao_detalhada/TabelaCompleta";
import { formatarNumDecimal } from "components/utils/Formatacoes";

export default class TabelaSimples extends React.Component {
  render() {
    return (
      <div>
        <Row className="mb-1 textosTitulos">
          <Col md={6}>
            <h5>
              {this.props.dados.estrategia}: {this.props.dados.ativo}
            </h5>
          </Col>
          <Col md={3} className="text-align-right">
            <div className="spaceAround">
              {calculaResultado(this.props.dados.resultado)}
              {calculaVariacao(this.props.dados.resultado.variacaoGanho)}
            </div>
          </Col>
          <Col md={3} className="text-align-right">
            <h6 className="textosTitulos">
              Início: {this.props.dados.dataInicio}
            </h6>
          </Col>
        </Row>
        <Row className="rowCompra mb-3">
          <Col md={"0"} className="pb-3">
            <EmblemaSimples item={this.props.dados} />
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
                        <div>{formatarNumDecimal(item.precoExec.unit)}</div>
                        <div className="colunaTotal">
                          {calculaTotal(item.precoExec)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>{formatarNumDecimal(item.atual)}</div>
                        <div>{formatarNumDecimal(item.osc)}%</div>
                        <div className={corSaldoOp(item.osc)}>
                          {formatarNumDecimal(item.saldoOp)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="colunaDividida">
                        <div>
                          {formatarNumDecimal(item.compra.qtde / 1000)}k
                        </div>
                        <div>{formatarNumDecimal(item.compra.preco)}</div>
                        <div>{formatarNumDecimal(item.venda.preco)}</div>
                        <div>{formatarNumDecimal(item.venda.qtde / 1000)}k</div>
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
