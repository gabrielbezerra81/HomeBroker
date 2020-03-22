import React from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import PerfectScrollbar from "react-perfect-scrollbar";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import { ReactComponent as Termometro } from "img/termometro.svg";

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
      <div className="containerTHL">
        {mapaCalor(props)}
        {vencimentos(props)}
      </div>
    );
  };
}

const mapaCalor = props => {
  return (
    <div className="containerMapaCalor">
      <Termometro></Termometro>
    </div>
  );
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
              <div>
                <div className="precoLinhaMontar">0,68 | 3k</div>
                <div className="precoLinhaDesmontar">0,66 | 3k</div>
              </div>
              <div>
                <div className="precoLinhaMontar">0,34 | 2 meses</div>
              </div>
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
    <div className="containerColunaMes">
      <div>
        <div className="itemAtivosQtde">
          <div className="mr-1 itemAtivos">
            {renderModelo(itemColuna.modelo)}
            {conteudo}
          </div>
          <div className="itemQtde">{300}</div>
        </div>
        <div className="bookAtivoTHL">
          <div>0,35 | 10k</div>
          <div>0,36 | 3k</div>
        </div>
      </div>

      <div className="containerPrecoMontDesmont">
        <div>0,37 | 5k</div>
        <div>0,34 | 3k</div>
      </div>
    </div>
  );
};

const renderModelo = modelo => {
  return (
    <div className="mr-1">
      {modelo === "EUROPEAN" ? (
        <img src={imgModeloEU} alt="" className="imgModeloTHL" />
      ) : (
        <ImgModeloUSA
          viewBox="6 -1 17 17"
          className="imgModeloTHL"
        ></ImgModeloUSA>
      )}
    </div>
  );
};

const colunaVazia = (
  <div className="containerColunaMes">
    <div className="itemAtivoQtdeVazio"></div>

    <div className="containerPrecoMontDesmont">
      <div></div>
      <div></div>
    </div>
  </div>
);

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
