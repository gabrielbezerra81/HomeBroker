import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import { StateStorePrincipal } from "components/redux/StoreCreation";

export default React.memo(({ setScrollbarRef }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { opcoesStrike } = reduxState;
  const strikes = filtrarStrikes(opcoesStrike);

  return (
    <PerfectScrollbar
      ref={(ref) => {
        setScrollbarRef(ref);
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
              <td>{renderColunaNomeMes("01", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("02", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("03", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("04", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("05", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("06", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("07", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("08", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("09", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("10", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("11", opcoesStrike)}</td>
              <td>{renderColunaNomeMes("12", opcoesStrike)}</td>
            </tr>
            {renderConteudoTabelaVencimentos(reduxState, strikes)}
          </tbody>
        </Table>
      </div>
    </PerfectScrollbar>
  );
});

const filtrarStrikes = (arrayVencimentos) => {
  return [
    ...new Set(
      arrayVencimentos.map((linhaVencimento) =>
        parseInt(linhaVencimento.strikeLine)
      )
    ),
  ];
};

const renderConteudoTabelaVencimentos = (reduxState, strikes) => {
  const { opcoesStrike } = reduxState;
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
        <td>{renderColunaNomeMes("01", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("02", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("03", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("04", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("05", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("06", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("07", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("08", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("09", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("10", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("11", opcoesStrike, true)}</td>
        <td>{renderColunaNomeMes("12", opcoesStrike, true)}</td>
      </tr>
    );

    const vencimentosStrike = opcoesStrike.filter(
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
            const possuiVencimento = verificarMesPossuiVencimento(
              opcoesStrike,
              mes
            );

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

const verificaAtivoCustodia = (itemColuna) => {
  let custodia = false;

  return custodia;
};

const renderColunaNomeMes = (mes, opcoesStrike, textoVazio = false) => {
  let nomeMes = "";

  // Texto com o nome do mês nas colunas de mês ou vazio nas linhas de Strike
  if (!textoVazio) {
    nomeMes = mesesExtenso[Number(mes) - 1];
  }
  if (!verificarMesPossuiVencimento(opcoesStrike, mes)) return nomeMes;
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

const verificarMesPossuiVencimento = (opcoesStrike, mes) => {
  const stocks = [];

  opcoesStrike.forEach((linha) => {
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
