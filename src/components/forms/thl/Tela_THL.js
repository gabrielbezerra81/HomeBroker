import React from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import PerfectScrollbar from "react-perfect-scrollbar";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

class Tela_THL extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "thl") {
      document.getElementById("thl").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("thl", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="thl"
        renderModalBody={() => this.modalBody(this.props)}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div className="flexRow">
        {mapaCalor(props)}
        {vencimentos(props)}
      </div>
    );
  };
}

const mapaCalor = props => {
  return <div className="containerMapaCalor"></div>;
};

const vencimentos = props => {
  const strikes = filtrarStrikes(props.vencimentosTHL);

  return (
    <div className="containerVencimentos">
      <div className="containerPesquisaAtivo">
        <InputGroup>
          <Form.Control
            className="inputAtivo"
            type="text"
            value={props.ativoPesquisa.toUpperCase()}
            onChange={event =>
              props.mudarVariavelTHLAction(
                "ativoPesquisa",
                event.currentTarget.value
              )
            }
          />
          <InputGroup.Append className="inputAtivoAppend">
            <span className="input-group-text iconeProcurar divClicavel">
              <MDBIcon icon="search" />
            </span>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <PerfectScrollbar
        options={{ maxScrollbarLength: 40 }}
        id="scrollTabelaVencimento"
        onXReachEnd={() => false}
      >
        <div className="containerTabela">
          <Table
            variant="dark"
            className="text-center tabelaVencimentos"
            bordered
          >
            <thead>
              <tr>
                <th colSpan="14">Vencimentos</th>
              </tr>
              <tr>
                <th>Strike</th>
                <th>Preço da linha</th>
                <th colSpan="12">2020</th>
              </tr>
            </thead>
            <tbody className="verticalAlignColunaTabela">
              <tr>
                <td></td>
                <td>
                  <div className="colunaDividida colunaPrecoLinha">
                    <div>Total</div>
                    <div>Mensal</div>
                  </div>
                </td>
                <td>Janeiro</td>
                <td>Fevereiro</td>
                <td>Março</td>
                <td>Abril</td>
                <td>Maio</td>
                <td>Junho</td>
                <td>Julho</td>
                <td>Agosto</td>
                <td>Setembro</td>
                <td>Outubro</td>
                <td>Novembro</td>
                <td>Dezembro</td>
              </tr>
              {renderConteudoTabelaVencimentos(props, strikes)}
            </tbody>
          </Table>
        </div>
      </PerfectScrollbar>
      <div>
        <h1>THL</h1>
      </div>
    </div>
  );
};

const filtrarStrikes = arrayVencimentos => {
  return [
    ...new Set(
      arrayVencimentos.map(linhaVencimento =>
        parseInt(linhaVencimento.strikeLine)
      )
    )
  ];
};

const renderConteudoTabelaVencimentos = (props, strikes) => {
  const conteudoTabelaVencimentos = strikes.map((strike, index) => {
    const linhaStrike = (
      <tr key={`strikeLine${index}`}>
        <td>{strike}</td>
        <td>
          <div className="colunaDividida colunaPrecoLinha">
            <div></div>
            <div></div>
          </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );

    const vencimentosStrike = props.vencimentosTHL.filter(
      linhaVencimentos => parseInt(linhaVencimentos.strikeLine) === strike
    );

    const linhaVencimentos = vencimentosStrike.map((linha, index) => {
      return (
        <tr key={`linhaVenc${index}`}>
          <td>{linha.strikeLine}</td>
          <td>
            <div className="colunaDividida colunaPrecoLinha">
              <div></div>
              <div></div>
            </div>
          </td>
          {meses.map(mes => {
            const itemColuna = linha.stocks.find(
              itemColuna => itemColuna.vencimento.split("/")[1] === mes
            );
            if (itemColuna) {
              return (
                <td key={`colunaVenc${index}`}>
                  {renderConteudoMes(itemColuna)}
                </td>
              );
            }

            return <td key={`colunaVenc${index}`}></td>;
          })}
        </tr>
      );
    });

    return [linhaStrike, ...linhaVencimentos];
  });
  return conteudoTabelaVencimentos;
};

const renderConteudoMes = itemColuna => {
  const conteudo = `${itemColuna.symbol}(${itemColuna.strike})`;

  return (
    <div>
      <div className="flexJustifyCenter">
        <div className="mr-2">{conteudo}</div>
        <div>{300}</div>
      </div>
    </div>
  );
};

const meses = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

export default Tela_THL;
