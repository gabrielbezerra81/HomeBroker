import React, { useMemo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table, FormControl } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import moment from "moment";

export default React.memo(({ setScrollbarRef }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { opcoesStrike } = reduxState;
  const strikesInteiros = useMemo(() => getStrikesInteiros(opcoesStrike), [
    opcoesStrike,
  ]);
  const { anos, ultimoMes } = useMemo(
    () => getAnosUltimoMesTabela(opcoesStrike),
    [opcoesStrike]
  );

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
              {anos.map((ano) => (
                <th key={`coluna${ano}`} colSpan="12" className="colunaAno">
                  <div style={{ paddingLeft: "5px" }}>{ano}</div>
                </th>
              ))}
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
              {/* renderiza as colunas com os nomes do meses */}
              {renderElementoDinamico(
                anos,
                ultimoMes,
                (indice, ano) =>
                  renderColunaNomeMes(indice + 1, opcoesStrike, ano),
                "colunaNomesMeses"
              )}
            </tr>
            {opcoesStrike.length === 0 ? <OpcoesStrikeVazio /> : null}
            {renderConteudoTabelaVencimentos(
              reduxState,
              strikesInteiros,
              anos,
              ultimoMes
            )}
          </tbody>
        </Table>
      </div>
    </PerfectScrollbar>
  );
});

const renderElementoDinamico = (anos, ultimoMes, renderElemento, key) => {
  return anos.map((ano, indice) =>
    meses.map((mes, indiceMes) => {
      if (!(ano === anos[anos.length - 1] && indiceMes >= ultimoMes)) {
        return (
          <td key={`${key}${ano}${mes}`}>{renderElemento(indiceMes, ano)}</td>
        );
      }
      return null;
    })
  );
};

const getStrikesInteiros = (arrayVencimentos) => {
  return [
    ...new Set(
      arrayVencimentos.map((linhaVencimento) =>
        parseInt(linhaVencimento.strikeLine)
      )
    ),
  ];
};

const getAnosUltimoMesTabela = (arrayVencimentos) => {
  const vencimentos = [];
  let ultimoMes = 12;
  let anos = [moment().year()];
  if (arrayVencimentos.length > 0) {
    arrayVencimentos.forEach((linhaStrike) => {
      linhaStrike.stocks.forEach((stock) => {
        const vencimento = stock.vencimento;
        vencimentos.push(vencimento);
      });
    });
    anos = [...new Set(vencimentos.map((vencimento) => vencimento.year()))];
    const meses = vencimentos.filter(
      (vencimento) => vencimento.year() === anos[anos.length - 1]
    );
    meses.sort((a, b) => a.diff(b));
    ultimoMes = meses[meses.length - 1].month() + 1;
  }

  return { anos: anos, ultimoMes: ultimoMes };
};

const renderConteudoTabelaVencimentos = (
  reduxState,
  strikesInteiros,
  anos,
  ultimoMes
) => {
  const { opcoesStrike } = reduxState;
  const conteudoTabelaVencimentos = strikesInteiros.map(
    (strike, indiceStrike) => {
      const linhaStrike = (
        <tr key={`strikeLine${indiceStrike}`} className="linhasStrike">
          <td className="divClicavel" tabIndex={0}>
            <InputStrikeSelecionado
              strikeLinha={strike}
              indiceStrike={indiceStrike}
            />
          </td>
          <td>
            <div className="colunaDividida colunaPrecoLinha">
              <div></div>
              <div></div>
            </div>
          </td>
          {/* renderiza as colunas vazias na linha que contem o strike inteiro */}
          {renderElementoDinamico(
            anos,
            ultimoMes,
            (indice, ano) =>
              renderColunaNomeMes(indice + 1, opcoesStrike, ano, true),
            "colunaMesLinhaStrike"
          )}
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
            {renderElementoDinamico(
              anos,
              ultimoMes,
              (indiceMes, ano) => {
                const indMes = indiceMes + 1;
                const itemColuna = linha.stocks.find(
                  (itemColuna) =>
                    itemColuna.vencimento.month() + 1 === indMes &&
                    itemColuna.vencimento.year() === ano
                );
                if (itemColuna) {
                  return renderConteudoMes(itemColuna);
                } //
                else {
                  const possuiVencimento = verificarMesPossuiVencimento(
                    opcoesStrike,
                    indMes,
                    ano
                  );

                  return possuiVencimento ? colunaVazia : null;
                }
              },
              "colunaVencimento"
            )}
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

const renderColunaNomeMes = (mes, opcoesStrike, ano, textoVazio = false) => {
  let nomeMes = "";

  // Texto com o nome do mês nas colunas de mês ou vazio nas linhas de Strike
  if (!textoVazio) {
    nomeMes = meses[mes - 1];
  }
  if (!verificarMesPossuiVencimento(opcoesStrike, mes, ano)) return nomeMes;
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div className="divNomeMes">{nomeMes}</div>
      <div className="containerPrecoMontDesmont">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

const verificarMesPossuiVencimento = (opcoesStrike, mes, ano = "") => {
  const stocks = [];

  opcoesStrike.forEach((linha) => {
    linha.stocks.forEach((stock) => {
      stocks.push(stock);
    });
  });
  return stocks.some(
    (stock) =>
      stock.vencimento.month() + 1 === mes && stock.vencimento.year() === ano
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

const InputStrikeSelecionado = ({ strikeLinha, indiceStrike }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const { strikeSelecionado, listaStrikes } = reduxState;
  // Strike inteiro do meio => 27, 28, 29
  if (indiceStrike === 1) {
    return (
      <div style={{ padding: "5px 0", width: "45px", textAlignLast: "end" }}>
        <FormControl
          as="select"
          value={strikeSelecionado}
          className="textInput"
          onChange={(e) =>
            dispatch(
              mudarVariavelTHLAction("strikeSelecionado", e.target.value)
            )
          }
        >
          <option value=""></option>
          {listaStrikes.map((strike, indice) => (
            <option value={strike}>{strike}</option>
          ))}
        </FormControl>
      </div>
    );
  }

  return strikeLinha;
};

const OpcoesStrikeVazio = () => {
  return (
    <tr>
      <td>
        <InputStrikeSelecionado indiceStrike={1} />
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
      <td></td>
    </tr>
  );
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
