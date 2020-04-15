import React from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import { MDBIcon } from "mdbreact";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactResizeDetector from "react-resize-detector";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import MapaCalor from "components/forms/thl/MapaCalor";
import TabelaCombinacoes from "components/forms/thl/TabelaCombinacoes";
import {
  StorePrincipalContext,
  GlobalContext,
} from "components/redux/StoreCreation";
import {
  mudarVariavelTHLAction,
  pesquisarAtivoTHLAction,
} from "components/redux/actions/menu_actions/THLActions";
import { aumentarZindexAction } from "components/redux/reducers/MainAppReducer";

// import "fixed-header-table/css/defaultTheme.css";

// window.jQuery = require("jquery");
// window.$ = window.jQuery;
// require("fixed-header-table");

class Tela_THL extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "thl") {
      document.getElementById("thl").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("thl", this.props.zIndex, true);
    }

    if (this.props.seletorMapaCalor === "montar")
      calculaMapaCalor(valoresMapaMontar, this.props);
    else if (this.props.seletorMapaCalor === "desmontar")
      calculaMapaCalor(valoresMapaDesmontar, this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.seletorMapaCalor !== prevProps.seletorMapaCalor) {
      if (this.props.seletorMapaCalor === "montar")
        calculaMapaCalor(valoresMapaMontar, this.props);
      else if (this.props.seletorMapaCalor === "desmontar")
        calculaMapaCalor(valoresMapaDesmontar, this.props);
      else this.props.mudarVariavelTHLAction("faixasMapaCalor", null);
    }
  }

  render() {
    return (
      <DraggableModal
        id="thl"
        renderModalBody={() => this.modalBody(this.props, this)}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      ></DraggableModal>
    );
  }

  modalBody = (props, thiss) => {
    return (
      <div className="containerTHL">
        <MapaCalor props={props}></MapaCalor>
        {vencimentos(props, thiss)}
        <ReactResizeDetector
          handleWidth
          onResize={(w, h) => {
            thiss._scrollBarRef.updateScroll();
          }}
        />
      </div>
    );
  };
}

const mapStateToPropsTelaTHL = (state) => ({
  ativoPesquisa: state.THLReducer.ativoPesquisa,
  opcoesStrike: state.THLReducer.opcoesStrike,
  faixasMapaCalor: state.THLReducer.faixasMapaCalor,
  seletorMapaCalor: state.THLReducer.seletorMapaCalor,
  listaStrikes: state.THLReducer.listaStrikes,
  strikeSelecionado: state.THLReducer.strikeSelecionado,
});

const mapDateToPropsGlobal = (state) => ({
  divkey: state.MainAppReducer.divkey,
  zIndex: state.MainAppReducer.zIndex,
});

export default compose(
  connect(
    mapStateToPropsTelaTHL,
    {
      mudarVariavelTHLAction,
      pesquisarAtivoTHLAction,
    },
    null,
    { context: StorePrincipalContext }
  ),
  connect(mapDateToPropsGlobal, { aumentarZindexAction }, null, {
    context: GlobalContext,
  })
)(Tela_THL);

const vencimentos = (props, thiss) => {
  const strikes = filtrarStrikes(props.opcoesStrike);

  return (
    <div className="containerVencimentos">
      <div className="containerPesquisaAtivo">
        <InputGroup>
          <Form.Control
            className="inputAtivo"
            type="text"
            value={props.ativoPesquisa.toUpperCase()}
            onChange={(event) =>
              props.mudarVariavelTHLAction(
                "ativoPesquisa",
                event.currentTarget.value
              )
            }
          />
          <InputGroup.Append className="inputAtivoAppend">
            <span
              className="input-group-text iconeProcurar divClicavel"
              onClick={() => props.pesquisarAtivoTHLAction(props.ativoPesquisa)}
            >
              <MDBIcon icon="search" />
            </span>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <PerfectScrollbar
        ref={(ref) => {
          thiss._scrollBarRef = ref;
        }}
        options={{
          maxScrollbarLength: 40,
          minScrollbarLength: 40,
          suppressScrollY: false,
        }}
        id="scrollTabelaVencimento"
        className="wrapper containerTabela"
      >
        <div className="">
          <Table
            variant="dark"
            className="text-center tabelaVencimentos"
            bordered
            id="tabela"
          >
            <thead>
              <tr>
                <th colSpan="14">Vencimentos</th>
              </tr>
              <tr>
                <th>Strike</th>
                <th>Preço da linha</th>
                <th colSpan="12">
                  <div style={{ paddingLeft: "5px" }}>2020</div>
                </th>
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
                {/* <td></td> */}
                <td>{renderColunaNomeMes("01", props)}</td>
                <td>{renderColunaNomeMes("02", props)}</td>
                <td>{renderColunaNomeMes("03", props)}</td>
                <td>{renderColunaNomeMes("04", props)}</td>
                <td>{renderColunaNomeMes("05", props)}</td>
                <td>{renderColunaNomeMes("06", props)}</td>
                <td>{renderColunaNomeMes("07", props)}</td>
                <td>{renderColunaNomeMes("08", props)}</td>
                <td>{renderColunaNomeMes("09", props)}</td>
                <td>{renderColunaNomeMes("10", props)}</td>
                <td>{renderColunaNomeMes("11", props)}</td>
                <td>{renderColunaNomeMes("12", props)}</td>
              </tr>
              {renderConteudoTabelaVencimentos(props, strikes)}
            </tbody>
          </Table>
        </div>
      </PerfectScrollbar>

      <TabelaCombinacoes props={props} />
    </div>
  );
};

const filtrarStrikes = (arrayVencimentos) => {
  return [
    ...new Set(
      arrayVencimentos.map((linhaVencimento) =>
        parseInt(linhaVencimento.strikeLine)
      )
    ),
  ];
};

const renderConteudoTabelaVencimentos = (props, strikes) => {
  const conteudoTabelaVencimentos = strikes.map((strike, indiceStrike) => {
    const linhaStrike = (
      <tr key={`strikeLine${indiceStrike}`} className="linhasStrike">
        <td className="divClicavel" tabIndex={0}>
          {strike}
        </td>
        <td>
          <div className="colunaDividida colunaPrecoLinha">
            <div></div>
            <div></div>
          </div>
        </td>
        {/* <td></td> */}
        <td>{renderColunaNomeMes("01", props, true)}</td>
        <td>{renderColunaNomeMes("02", props, true)}</td>
        <td>{renderColunaNomeMes("03", props, true)}</td>
        <td>{renderColunaNomeMes("04", props, true)}</td>
        <td>{renderColunaNomeMes("05", props, true)}</td>
        <td>{renderColunaNomeMes("06", props, true)}</td>
        <td>{renderColunaNomeMes("07", props, true)}</td>
        <td>{renderColunaNomeMes("08", props, true)}</td>
        <td>{renderColunaNomeMes("09", props, true)}</td>
        <td>{renderColunaNomeMes("10", props, true)}</td>
        <td>{renderColunaNomeMes("11", props, true)}</td>
        <td>{renderColunaNomeMes("12", props, true)}</td>
      </tr>
    );

    const vencimentosStrike = props.opcoesStrike.filter(
      (linhaVencimentos) => parseInt(linhaVencimentos.strikeLine) === strike
    );

    const linhaVencimentos = vencimentosStrike.map((linha, indiceLinha) => {
      return (
        <tr key={`linhaVenc${indiceLinha}`}>
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
          {/* <td></td> */}
          {meses.map((mes, indiceMes) => {
            const itemColuna = linha.stocks.find(
              (itemColuna) => itemColuna.vencimento.split("/")[1] === mes
            );
            if (itemColuna) {
              return (
                <td key={`${indiceLinha}|colunaVenc${indiceMes}`}>
                  {renderConteudoMes(itemColuna)}
                </td>
              );
            }
            const possuiVencimento = verificarMesPossuiVencimento(props, mes);

            return (
              <td key={`${indiceLinha}|colunaVenc${indiceMes}`}>
                {possuiVencimento ? colunaVazia : null}
              </td>
            );
          })}
        </tr>
      );
    });

    return [linhaStrike, ...linhaVencimentos];
  });
  return conteudoTabelaVencimentos;
};

const renderConteudoMes = (itemColuna) => {
  const ativoStrike = `${itemColuna.symbol.slice(4)}(${itemColuna.strike})`;
  const custodia = verificaAtivoCustodia(itemColuna);

  return (
    <div className="containerColunaMes">
      <div>
        <div
          className={`itemAtivosQtde ${
            custodia ? "itemAtivosQtdeCustodia" : ""
          }`}
        >
          <div className="itemAtivos divClicavel" tabIndex={0}>
            {renderModelo(itemColuna.modelo)}
            {ativoStrike}
          </div>
          {custodia ? <div className="itemQtde">{300}</div> : null}
        </div>
        <div className="bookAtivoTHL roxoTextoTHL">
          <div className="divClicavel" tabIndex={0}>
            0,35 | 10k
          </div>
          <div className="divClicavel" tabIndex={0}>
            0,36 | 3k
          </div>
        </div>
      </div>

      <div className="containerPrecoMontDesmont">
        <div className="divClicavel" tabIndex={0}>
          0,37 | 5k
        </div>
        <div className="divClicavel" tabIndex={0}>
          0,34 | 3k
        </div>
      </div>
    </div>
  );
};

const renderModelo = (modelo) => {
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
    <div>
      <div className="itemAtivosQtde"></div>
    </div>
    <div className="containerPrecoMontDesmont">
      <div></div>
      <div></div>
    </div>
  </div>
);

// Se selecionar montar ou desmontar, pega um conjunto de valores e faz o calculo das faixas do termometro
// Calcula 5 faixas de valores
const calculaMapaCalor = (arrayValores, props) => {
  const faixas = [0, 0, 0, 0, 0];

  let valores = arrayValores.sort();
  faixas[0] = valores[0] + ""; // faixa 1 32
  faixas[4] = valores[valores.length - 1] + ""; // faixa 5 40
  valores = valores.map((valor) => {
    if (valor < 1) return valor * 100;
    return valor;
  });

  let intervalo = valores[valores.length - 1] - 1 - (valores[0] + 1) + 1; // intervalo de 7
  intervalo = intervalo / 3; // 2.33 -> inteiro 2
  faixas[1] = `${(valores[0] + 1) / 100}-${
    (valores[0] + // faixa 2 de 33 a 34
      Math.floor(intervalo)) /
    100
  }`;
  faixas[3] = `${
    (valores[valores.length - 1] - Math.floor(intervalo)) / // faixa 4 38 a 39
    100
  }-${(valores[valores.length - 1] - 1) / 100}`;

  if ((intervalo * 3) % 3 === 0) intervalo += 1;
  faixas[2] = `${(valores[0] + Math.ceil(intervalo)) / 100}-${
    (valores[valores.length - 1] - // faixa 3 de 35 a 37
      Math.ceil(intervalo)) /
    100
  }`;

  props.mudarVariavelTHLAction("faixasMapaCalor", faixas);
};

const verificaAtivoCustodia = (itemColuna) => {
  let custodia = false;

  return custodia;
};

const renderColunaNomeMes = (mes, props, textoVazio = false) => {
  let nomeMes = "";

  // Texto com o nome do mês nas colunas de mês ou vazio nas linhas de Strike
  if (!textoVazio) {
    nomeMes = mesesExtenso[Number(mes) - 1];
  }
  if (!verificarMesPossuiVencimento(props, mes)) return nomeMes;
  return (
    <div style={{ display: "flex" }}>
      <div className="divNomeMes">{nomeMes}</div>
      <div className="containerPrecoMontDesmont">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

const verificarMesPossuiVencimento = (props, mes) => {
  const stocks = [];

  props.opcoesStrike.forEach((linha) => {
    linha.stocks.forEach((stock) => {
      stocks.push(stock);
    });
  });

  return stocks.some((stock) => stock.vencimento.split("/")[1] === mes);
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
  "12",
];

const mesesExtenso = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const valoresMapaMontar = [0.4, 0.32];

const valoresMapaDesmontar = [0.36, 0.32];
