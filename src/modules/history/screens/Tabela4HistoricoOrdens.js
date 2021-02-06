import React from "react";
import { Table, ProgressBar } from "react-bootstrap";

export default class Tabela4HistoricoOrdens extends React.Component {
  render() {
    return (
      <Table
        variant="dark"
        borderless
        striped
        className="text-center tabela4HistoricoOrdens"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th>Progresso</th>
            <th>Cadastro</th>
            <th>Operação</th>
            <th>Ativo</th>
            <th>Oferta</th>
            <th>
              Quantidade
              <div className="colunaDividida">
                <div>Executada</div>
                <div>Cancelada</div>
              </div>
            </th>
            <th>Disparo</th>
            <th>Preço Envio</th>
          </tr>
        </thead>
        <tbody className="verticalAlignColunaTabela">
          <tr className={corLinhaTabela(dados.progresso1)}>
            <td>
              <ProgressBar
                animated
                variant="success"
                now={dados.progresso1}
                label={`${dados.progresso1}%`}
                className="barraProgresso"
              />
            </td>
            <td>16/09/2019</td>
            <td>THL</td>
            <td>
              <div>
                PETRG260
                <br />
                PETRH270
              </div>
            </td>
            <td>
              <div>
                V
                <br />C
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>0</div>
                <div>1.000</div>
              </div>
              <div className="colunaDividida">
                <div>0</div>
                <div>1.000</div>
              </div>
            </td>
            <td>2,70</td>
            <td>
              <div>
                2,70
                <br />
                2,21
              </div>
            </td>
          </tr>
          <tr className={corLinhaTabela(dados.progresso2)}>
            <td>
              <ProgressBar
                animated
                variant="success"
                now={dados.progresso2}
                label={`${dados.progresso2}%`}
                className="barraProgresso"
              />
            </td>
            <td>16/09/2019</td>
            <td>THL</td>
            <td>
              <div>
                PETRG260
                <br />
                PETRH270
              </div>
            </td>
            <td>
              <div>
                V
                <br />C
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>0</div>
                <div>1.000</div>
              </div>
              <div className="colunaDividida">
                <div>0</div>
                <div>1.000</div>
              </div>
            </td>
            <td>2,70</td>
            <td>
              <div>
                2,70
                <br />
                2,21
              </div>
            </td>
          </tr>
          <tr className={corLinhaTabela(dados.progresso3)}>
            <td>
              <ProgressBar
                animated
                variant="success"
                now={dados.progresso3}
                label={`${dados.progresso3}%`}
                className="barraProgresso"
              />
            </td>
            <td>16/09/2019</td>
            <td>THL</td>
            <td>
              <div>
                PETRG260
                <br />
                PETRH270
              </div>
            </td>
            <td>
              <div>
                V
                <br />C
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>0</div>
                <div>1.000</div>
              </div>
              <div className="colunaDividida">
                <div>0</div>
                <div>1.000</div>
              </div>
            </td>
            <td>2,70</td>
            <td>
              <div>
                2,70
                <br />
                2,21
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

const dados = {
  progresso1: 0,
  progresso2: 50,
  progresso3: 100
};

const corLinhaTabela = progresso => {
  if (progresso === 0) {
    return "linhaVermelha";
  } else if (progresso === 100) {
    return "linhaVerde";
  } else if (progresso >= 50) {
    return "linhaAmarela";
  }
};
