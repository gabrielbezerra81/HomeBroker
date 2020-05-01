import React, { useMemo, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table, FormControl } from "react-bootstrap";
import moment from "moment";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import { listarTabelaInicialTHLAPIAction } from "components/redux/actions/api_actions/ThlAPIAction";
import { CelulaMes } from "components/forms/thl/tabelaDeVencimentos/CelulaMes";

export default React.memo(({ setScrollbarRef }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const {
    opcoesStrike,
    strikeSelecionado,
    ativoPesquisado,
    tipo,
    eventSourcePrecos,
    precosTabelaVencimentos,
    setPrecosIntervalo,
  } = reduxState;

  useEffect(() => {
    dispatch(
      listarTabelaInicialTHLAPIAction(
        ativoPesquisado,
        strikeSelecionado,
        tipo,
        eventSourcePrecos,
        precosTabelaVencimentos,
        setPrecosIntervalo
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativoPesquisado, strikeSelecionado, tipo]);

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
                  renderCelulaNomeMes(indice + 1, opcoesStrike, ano),
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

const renderConteudoTabelaVencimentos = (
  reduxState,
  strikesInteiros,
  anos,
  ultimoMes
) => {
  const { opcoesStrike, precosTabelaVencimentos } = reduxState;
  const conteudoTabelaVencimentos = strikesInteiros.map(
    (strike, indiceStrike) => {
      const linhaStrike = (
        <tr key={`strikeLine${indiceStrike}`} className="linhasStrike">
          <td>
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
              renderCelulaNomeMes(indice + 1, opcoesStrike, ano, true),
            "colunaMesLinhaStrike"
          )}
        </tr>
      );

      const vencimentosStrike = opcoesStrike.filter(
        (linhaVencimentos) => parseInt(linhaVencimentos.strikeLine) === strike
      );

      const linhaVencimentos = vencimentosStrike.map((linha, indiceLinha) => {
        const IDs = linha.structuresIds;
        const idColunaTotal = IDs[IDs.length - 1];
        const precosColunaTotal = precosTabelaVencimentos.find(
          (estrutura) => estrutura.id === idColunaTotal
        );
        let precoTotalMontar = "0,68 | 3k";
        let precoTotalDesmontar = "0,66 | 3k";
        let precoMensalMontar = "0,34 | 2 meses";
        let precoMensalDesmontar = "";

        return (
          <tr key={`linhaVenc${indiceLinha}`}>
            <td>{formatarNumDecimal(linha.strikeLine)}</td>
            <td>
              <div className="colunaDividida colunaPrecoLinha colunaPrecoLinhaPreenchida">
                <div>
                  <div className="precoLinhaMontar">{precoTotalMontar}</div>
                  <div className="precoLinhaDesmontar">
                    {precoTotalDesmontar}
                  </div>
                </div>
                <div>
                  <div className="precoLinhaMontar">{precoMensalMontar}</div>
                  <div className="precoLinhaDesmontar">
                    {precoMensalDesmontar}
                  </div>
                </div>
              </div>
            </td>

            {/* Colunas dos meses */}
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
                  return <CelulaMes itemColuna={itemColuna} />;
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

const renderCelulaNomeMes = (mes, opcoesStrike, ano, textoVazio = false) => {
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
            <option key={`strikeInteiro:${strike}`} value={strike}>
              {strike}
            </option>
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
