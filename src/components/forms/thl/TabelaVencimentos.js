import React, { useMemo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import { StateStorePrincipal } from "components/redux/StoreCreation";
import { formatarNumDecimal } from "components/utils/Formatacoes";

export default React.memo(({ setScrollbarRef }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { opcoesStrike } = reduxState;
  const strikesInteiros = filtrarStrikesInteiros(opcoesStrike);
  const anos = useMemo(() => {}, [opcoesStrike]);

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
              <td>{renderColunaNomeMes(1, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(2, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(3, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(4, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(5, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(6, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(7, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(8, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(9, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(10, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(11, opcoesStrike)}</td>
              <td>{renderColunaNomeMes(12, opcoesStrike)}</td>
            </tr>
            {renderConteudoTabelaVencimentos(reduxState, strikesInteiros)}
          </tbody>
        </Table>
      </div>
    </PerfectScrollbar>
  );
});

const filtrarStrikesInteiros = (arrayVencimentos) => {
  return [
    ...new Set(
      arrayVencimentos.map((linhaVencimento) =>
        parseInt(linhaVencimento.strikeLine)
      )
    ),
  ];
};

const renderConteudoTabelaVencimentos = (reduxState, strikesInteiros) => {
  const { opcoesStrike } = reduxState;
  const conteudoTabelaVencimentos = strikesInteiros.map(
    (strike, indiceStrike) => {
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
          <td>{renderColunaNomeMes(1, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(2, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(3, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(4, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(5, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(6, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(7, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(8, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(9, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(10, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(11, opcoesStrike, true)}</td>
          <td>{renderColunaNomeMes(12, opcoesStrike, true)}</td>
        </tr>
      );

      const vencimentosStrike = opcoesStrike.filter(
        (linhaVencimentos) => parseInt(linhaVencimentos.strikeLine) === strike
      );

      const linhaVencimentos = vencimentosStrike.map((linha, indiceLinha) => {
        return (
          <tr key={`linhaVenc${indiceLinha}`}>
            <td>{formatarNumDecimal(linha.strikeLine)}</td>
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
              const indMes = indiceMes + 1;
              const itemColuna = linha.stocks.find(
                (itemColuna) => itemColuna.vencimento.month() + 1 === indMes
              );
              if (itemColuna) {
                return (
                  <td key={`${indiceLinha}|colunaVenc${indMes}`}>
                    {renderConteudoMes(itemColuna)}
                  </td>
                );
              }
              const possuiVencimento = verificarMesPossuiVencimento(
                opcoesStrike,
                indMes
              );

              return (
                <td key={`${indiceLinha}|colunaVenc${indMes}`}>
                  {possuiVencimento ? colunaVazia : null}
                </td>
              );
            })}
          </tr>
        );
      });

      return [linhaStrike, ...linhaVencimentos];
    }
  );
  return conteudoTabelaVencimentos;
};

const renderConteudoMes = (itemColuna) => {
  const strike = formatarNumDecimal(itemColuna.strike);
  const ativoStrike = `${itemColuna.symbol.slice(4)} (${strike})`;
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
            {renderModelo(itemColuna.model)}
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
    nomeMes = meses[mes - 1];
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
  return stocks.some((stock) => stock.vencimento.month() + 1 === mes);
};

const meses = [
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
