import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import EmblemaSimples from "shared/components/EmblemaSimples";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

export default class TabelaCompleta extends React.Component {
  render() {
    return (
      <div>
        <Row className="mb-1 textosTitulos">
          <Col md={6}>
            <h5>{renderAtivos(this.props.dados)}</h5>
          </Col>
          <Col md={3} className="text-align-right">
            <div className="spaceAround">
              {calculaResultado(this.props.dados.resultado)}
              {calculaVariacao(this.props.dados.resultado.variacaoGanho)}
            </div>
          </Col>
          <Col md={3} className="text-align-right">
            <h6>Início: {this.props.dados.dataInicio}</h6>
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
                    <td>{formatarNumDecimal(item.strike)}</td>
                    <td>
                      <div className="colunaDividida">
                        <div>{formatarNumDecimal(item.intr)}</div>
                        <div>{formatarNumDecimal(item.ext)}</div>
                      </div>
                    </td>
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

const renderAtivos = (dados) => {
  let ativos = `${dados.estrategia}: ${dados.ativo}`;
  var codigos = "   ";
  dados.operacoes.map((item) => {
    return (codigos += item.codigo + " | ");
  });
  ativos += codigos;

  return ativos.substring(0, ativos.length - 2);
};

export const calculaTotal = (item) => {
  let total = Number(item.qtde) * 1000 * Number(item.unit);
  let tipo = "";
  if (total >= 0) tipo = " (D)";
  else tipo = " (C)";
  return formatarNumDecimal(total) + tipo;
};

export const calculaResultado = (resultado) => {
  let result = "Resultado: R$ ";
  if (resultado.total >= 0) result += "+";
  else result += "-";
  result += formatarNumDecimal(resultado.total);

  return <h6 className="textosTitulos">{result}</h6>;
};

export const calculaVariacao = (variacao) => {
  let result = "";
  let classe = "";
  if (variacao >= 0) {
    result += " +";
    classe = "textoPorcentagemPositiva";
  } else {
    result += " ";
    classe = "textoPorcentagemNegativa";
  }
  result += formatarNumDecimal(variacao) + "%";
  return <h6 className={classe}>{result}</h6>;
};

export const corSaldoOp = (osc) => {
  if (osc >= 0) return "saldoOpPositivo";
  else return "saldoOpNegativo";
};
