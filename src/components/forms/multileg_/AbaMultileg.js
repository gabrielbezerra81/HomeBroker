import React from "react";
import { Table, Form, Button, InputGroup } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import imgModeloUSA from "img/modeloUSA.png";
import DatePicker from "react-datepicker";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { MDBCol, MDBIcon } from "mdbreact";

const capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
/*<Form.Group>
  <Form.Control
    className="inputAtivo"
    type="text"
    value="PETR4"
    onChange={() => false}
  />
</Form.Group>; */

class AbaMultileg extends React.Component {
  render() {
    return (
      <div className="containerAbaMultileg">
        <div className="divDetalhesAbaMultileg">
          <div className="divColunaDetalhes">
            <InputGroup>
              <Form.Control
                className="inputAtivo"
                type="text"
                value="PETR4"
                onChange={() => false}
              />
              <InputGroup.Append className="inputAtivoAppend">
                <span className="input-group-text iconeProcurar divClicavel">
                  <MDBIcon icon="search" />
                </span>
              </InputGroup.Append>
            </InputGroup>
            <h5 className="textoValor">-27,43</h5>
            {renderSeta(2)}
            {renderValorPorcentagem(5.35)}
          </div>
          <div className="divColunaDetalhes">
            <Form.Group>
              <Form.Label>Strike</Form.Label>
              <Form.Control
                className="textInput"
                type="number"
                step={0.01}
                //value={1}
                onChange={() => false}
              />
            </Form.Group>
            <Form.Group className="wrapperVencimento">
              <Form.Label>Vencimento</Form.Label>
              <DatePicker
                className="form-control textInput"
                //selected={props.date}
                onChange={() => false}
                dateFormat="dd/MM/yyyy"
                popperPlacement="top-start"
              ></DatePicker>
            </Form.Group>
          </div>
          <div className="divColunaDetalhes">
            <div className="divFlexRowDetalhesAba">
              <Form.Label>Incluir</Form.Label>
              <div className="botoesIncluir">
                <Button variant="primary" size="sm">
                  +Ativo
                </Button>
                <Button variant="primary" size="sm">
                  +Call
                </Button>
                <Button variant="primary" size="sm">
                  +Put
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Table
          variant="dark"
          bordered={false}
          borderless
          striped
          className="tableMultileg text-center"
          style={{ tableLayout: "auto" }}
        >
          <thead>
            <tr>
              <th>C/V</th>
              <th>Qtde.</th>
              <th>Série</th>
              <th>Strike</th>
              <th>Código</th>
              <th>Tipo</th>
              <th>Modelo</th>
              <th>Despernamento Máx.</th>
              <th>Prioridade de Execução</th>
              <th>Cotação</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {tabelaMultileg.map((item, index) => {
              return (
                <tr key={index}>
                  {renderCV(item.cv)}
                  <td>
                    <Form.Group>
                      <Form.Control
                        className="textInput formDespernamento "
                        type="number"
                        min={0}
                        step={100}
                        //value={item.qtde}
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        className="textInput"
                        //value={item.prioridade}
                      >
                        {item.serie.map((serie, indice) => (
                          <option key={serie + indice} value={serie}>
                            {serie}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        className="textInput"
                        //value={item.prioridade}
                      >
                        {item.strike.map((strike, indice) => (
                          <option key={strike + indice} value={strike}>
                            {strike}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td>{item.codigo}</td>
                  <td>{capitalize(item.tipo)}</td>
                  {renderModelo(item.modelo)}
                  <td>
                    <Form.Group>
                      <Form.Control
                        className="textInput formDespernamento"
                        type="number"
                        min={0}
                        step={100}
                        //value={item.despernamento}
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        className="textInput formPrioridade"
                        //value={item.prioridade}
                      >
                        <option value={-1}>-1</option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td>{item.cotacao}</td>
                  <td>{item.valor}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AbaMultileg;

const renderCV = cv => {
  return (
    <td>
      {cv === "compra" ? (
        <div className="divCV">
          <h6 className="cvCompra"> C </h6>
          <h6> V </h6>
        </div>
      ) : (
        <div className="divCV">
          <h6> C </h6>
          <h6 className="cvVenda"> V </h6>
        </div>
      )}
    </td>
  );
};

const renderModelo = modelo => {
  return (
    <td>
      {modelo === "EU" ? (
        <div>
          <img src={imgModeloEU} alt="" className="imgModelo" />
        </div>
      ) : (
        <div>
          <img src={imgModeloUSA} alt="" className="imgModelo" />
        </div>
      )}
    </td>
  );
};

const renderSeta = valor => {
  valor = Number(valor);
  if (valor >= 0) return <ArrowUp fill="#138342" className="mr-1" width="35" />;
  else return <ArrowDown fill="red" className="mr-1" width="35" />;
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    porcentagem = porcentagem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
    return <h6 className="porcentagemPositiva">+{porcentagem}%</h6>;
  } else if (porcentagem < 0) {
    porcentagem = porcentagem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
    return <h6 className="porcentagemNegativa">{porcentagem}%</h6>;
  } else {
    porcentagem = porcentagem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
    return <h6>+{porcentagem}%</h6>;
  }
};

const tabelaMultileg = [
  {
    cv: "compra",
    qtde: 1000,
    serie: ["2019-08", "2019-07", "2019-06"],
    strike: [26.32, 27.48, 28.48],
    codigo: "PETRH275",
    tipo: "call",
    modelo: "EU",
    despernamento: 100,
    prioridade: -1,
    cotacao: "15,25",
    valor: "-40,00"
  },
  {
    cv: "venda",
    qtde: 2000,
    serie: ["2019-08", "2019-07", "2019-06"],
    strike: [26.32, 27.48, 28.48],
    codigo: "PETRH275",
    tipo: "call",
    modelo: "USA",
    despernamento: 500,
    prioridade: 2,
    cotacao: "10,30",
    valor: "-200,00"
  }
];
