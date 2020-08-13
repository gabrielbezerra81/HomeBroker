/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { listarTabelaInicialTHLAPIAction } from "redux/actions/thl/ThlAPIAction";
import { CelulaMes } from "telas/popups/thl/tabelaDeVencimentos/CelulaMes";
import InputStrikeSelecionado from "telas/popups/thl/tabelaDeVencimentos/InputStrikeSelecionado";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export default React.memo(() => {
  const reduxState = useStateStorePrincipal("thl");
  const dispatch = useDispatchStorePrincipal();
  const {
    opcoesStrike,
    strikeSelecionado,
    ativoPesquisado,
    tipo,
    codigoCelulaSelecionada,
    celulaCalculada,
  } = reduxState;

  const strikesInteiros = useMemo(() => getStrikesInteiros(opcoesStrike), [
    opcoesStrike,
  ]);
  const { anos, ultimoMes } = useMemo(
    () => getAnosUltimoMesTabela(opcoesStrike),
    [opcoesStrike]
  );

  const prevCodigoSelecionado = usePrevious(codigoCelulaSelecionada);
  const prevCalculada = usePrevious(celulaCalculada);

  useEffect(() => {
    dispatch(listarTabelaInicialTHLAPIAction(reduxState));
  }, []);

  useEffect(() => {
    if (
      prevCodigoSelecionado !== codigoCelulaSelecionada ||
      prevCalculada !== celulaCalculada
    ) {
      if (!codigoCelulaSelecionada && celulaCalculada) {
        dispatch(listarTabelaInicialTHLAPIAction(reduxState));
      }
    } //
    else {
      dispatch(listarTabelaInicialTHLAPIAction(reduxState));
    }
  }, [
    ativoPesquisado,
    strikeSelecionado,
    tipo,
    codigoCelulaSelecionada,
    celulaCalculada,
  ]);

  return (
    <Table
      variant="dark"
      className="text-center tabelaVencimentos"
      bordered
      id="tabela"
    >
      <thead>
        <tr>
          <th>Strike</th>
          <th>Preço da linha</th>
          {anos.map((ano, indice) => {
            let colSpan = 12;
            if (indice === 0) colSpan = 12 - moment().month();
            return (
              <th key={`coluna${ano}`} colSpan={colSpan} className="colunaAno">
                <div style={{ paddingLeft: "5px" }}>{ano}</div>
              </th>
            );
          })}
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
            (indice, ano) => renderCelulaNomeMes(indice + 1, opcoesStrike, ano),
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
  const mesAtual = moment().month();

  return anos.map((ano, indiceAno) =>
    meses.map((mes, indiceMes) => {
      const celula = (
        <td key={`${key}${ano}${mes}`}>{renderElemento(indiceMes, ano)}</td>
      );

      // Meses anteriores
      const condicaoPrimeiroAno = indiceMes >= mesAtual;
      // Se estiver renderizando no ultimo ano, o mês não pode ser maior que o ultimo mês. Ex: opções do ano 2021 termina em junho
      const condicaoUltimoAno = indiceMes <= ultimoMes - 1;

      switch (indiceAno) {
        case 0:
          if (condicaoPrimeiroAno) return celula;
          return null;
        case anos.length - 1:
          if (condicaoUltimoAno) return celula;
          return null;
        default:
          return celula;
      }
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

        let precoTotalMontar = "";
        let precoTotalDesmontar = "";
        let precoMensalMontar = "";
        let precoMensalDesmontar = "";

        if (precosColunaTotal) {
          let { max, min, components } = precosColunaTotal;

          const qtdeMontar = formatarQuantidadeKMG(
            Math.min(components[0].compraQtde, components[1].vendaQtde)
          );
          const qtdeDesmont = formatarQuantidadeKMG(
            Math.min(components[0].vendaQtde, components[1].compraQtde)
          );

          const primeiroMes = moment(
            components[0].stock.endBusiness,
            "DD-MM-YYYY HH:mm:ss"
          ).startOf("month");
          const ultimoMes = moment(
            components[1].stock.endBusiness,
            "DD-MM-YYYY HH:mm:ss"
          ).startOf("month");

          const diferencaMeses = ultimoMes.diff(primeiroMes, "months");
          const textoMeses = diferencaMeses === 1 ? "mês" : "meses";

          precoMensalMontar = `${formatarNumDecimal(
            max / (diferencaMeses || 1)
          )} | ${diferencaMeses} ${textoMeses}`;
          precoMensalDesmontar = `${formatarNumDecimal(
            min / (diferencaMeses || 1)
          )} | ${diferencaMeses} ${textoMeses}`;

          max = formatarNumDecimal(max);
          min = formatarNumDecimal(min);

          precoTotalMontar = `${max} | ${qtdeMontar}`;
          precoTotalDesmontar = `${min} | ${qtdeDesmont}`;
        }

        return (
          <tr key={`linhaVenc${indiceLinha}`}>
            <td>{formatarNumDecimal(linha.strikeLine)}</td>
            <td>
              <div className="colunaDividida colunaPrecoLinha">
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
                const indiceStock = linha.stocks.findIndex(
                  (itemColuna) =>
                    itemColuna.vencimento.month() + 1 === indMes &&
                    itemColuna.vencimento.year() === ano
                );

                if (indiceStock !== -1) {
                  const id = IDs[indiceStock];

                  return (
                    <CelulaMes
                      id={id}
                      itemColuna={linha.stocks[indiceStock]}
                      ultimaColuna={idColunaTotal === id && indiceStock !== 0}
                    />
                  );
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

const renderCelulaNomeMes = (mes, opcoesStrike, ano, textoVazio = false) => {
  let nomeMes = "";

  // Texto com o nome do mês nas colunas de mês ou vazio nas linhas de Strike
  if (!textoVazio) {
    nomeMes = meses[mes - 1];
  }
  if (!verificarMesPossuiVencimento(opcoesStrike, mes, ano)) return nomeMes;
  return (
    <div style={{ display: "flex", height: "100%", justifyContent: "center" }}>
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

const OpcoesStrikeVazio = () => {
  return (
    <tr>
      <td>
        <InputStrikeSelecionado indiceStrike={1} />
      </td>
      <td />
    </tr>
  );
};

const colunaVazia = (
  <div className="containerColunaMes">
    <div className="containerCelula">
      <div>
        <div className="itemAtivosQtde"></div>
      </div>
    </div>
    <div className="containerPrecoMontDesmont">
      <div></div>
      <div></div>
    </div>
  </div>
);

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
