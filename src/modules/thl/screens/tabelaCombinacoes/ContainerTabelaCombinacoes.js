/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { Spin } from "antd";
import { FiltrarTabela } from "modules/thl/screens/tabelaCombinacoes/FiltroTabela";
import TabelaCombinacoes from "modules/thl/screens/tabelaCombinacoes/TabelaCombinacoes";
import _ from "lodash";
import { buscarNumeroArray } from "shared/utils/FuncoesBusca";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

const alturaLinha = 46;
const escolhasOrdem = ["", "asc", "desc"];

export default React.memo(() => {
  const { thlReducer: reduxState } = useStateStorePrincipal();
  const {
    combinacoesTabela,
    estrategia,
    grupo,
    acaoUlt,
    spread,
    codigos,
    montagem,
    desmontagem,
    vencimento,
    prazo,
    idCelulaSelecionada,
    codigoCelulaSelecionada,
    carregandoCombinacoes,
    ordenacao,
  } = reduxState;

  const [alturaContainer, setAlturaContainer] = useState(496);
  const [classeMargemScroll, setClasseMargemScroll] = useState("");
  const [dataTabela, setData] = useState(combinacoesTabela);

  // Aplica filtros na tabela e calcula altura do container. Caso não haja overflow, aplica margem no ultimo TD de cada linha
  const throttle = useRef(
    _.debounce((state) => {
      let data = FiltrarTabela(state);
      const tamanhoTabela = data.length;

      let alturaCalculada = 102 + alturaLinha * tamanhoTabela;
      if (alturaCalculada > 496) alturaCalculada = 496;
      setAlturaContainer(alturaCalculada);

      if (tamanhoTabela < 9) setClasseMargemScroll("margemScrollbar ");
      else setClasseMargemScroll("");
      if (state.ordenacao.key && state.ordenacao.valor)
        data = ordenarTabela(state, data);

      setData(data);
    }, 500),
  );

  useEffect(() => {
    throttle.current(reduxState);
  }, [
    combinacoesTabela,
    estrategia,
    grupo,
    acaoUlt,
    spread,
    codigos,
    montagem,
    desmontagem,
    vencimento,
    prazo,
  ]);

  useEffect(() => {
    setData([...dataTabela]);
  }, [idCelulaSelecionada, codigoCelulaSelecionada]);

  useEffect(() => {
    const data = ordenarTabela(reduxState, dataTabela);
    if (data.length) setData(data);
  }, [ordenacao]);

  //Bloqueia o scroll do container THL quando for rolar a tabela
  const bloquearScroll = alturaContainer === 102;

  useEffect(() => {
    const blockTHLScrollTimeout = setTimeout(() => {
      const parent = document.getElementById("tabelaCombinacoes").childNodes[1];

      const scrollDiv = parent.lastChild;

      if (scrollDiv) {
        scrollDiv.addEventListener(
          "wheel",
          function (e) {
            e.stopPropagation();
          },
          { passive: true },
        );
      }
    }, 500);

    return () => {
      clearTimeout(blockTHLScrollTimeout);
    };
  }, [bloquearScroll]);

  // Se o THL tiver sido rediomensionado e a tabela possuir scroll horizontal, ajusta a borda direita conforme for fazendo scroll
  useEffect(() => {
    const container = document.getElementsByClassName("containerTabelaComb")[0];

    if (container)
      container.addEventListener("scroll", function (e) {
        calcularMargemBorda();
      });
  }, []);

  const alturaScrollbarHorizontal = verificarOverflow();

  return (
    <div className="containerCombinacoesTHL">
      <Spin
        className="spinnerHomebroker"
        indicator={
          <Spinner className="asdas" animation="border" variant="light" />
        }
        spinning={carregandoCombinacoes}
      >
        <div
          className={`containerTabelaComb`}
          style={{ height: `${alturaScrollbarHorizontal + alturaContainer}px` }}
        >
          <TabelaCombinacoes
            dataTabela={dataTabela}
            classeMargemScroll={classeMargemScroll}
          />
        </div>
      </Spin>
    </div>
  );
});

export const verificarOverflow = () => {
  const container = document.getElementsByClassName("containerTabelaComb")[0];
  let alturaScrollbar = 0;
  if (container && container.scrollWidth > container.clientWidth)
    alturaScrollbar = 14;

  return alturaScrollbar;
};

export const calcularMargemBorda = () => {
  const container = document.getElementsByClassName("containerTabelaComb")[0];
  if (container) {
    const { clientWidth, scrollWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    let right = 19;

    if (clientWidth < 1079) {
      right -= maxScroll - container.scrollLeft;
      if (right < -2) right = -2;
    }

    container.style.setProperty(
      "--width-tabela-combinacoes",
      `calc(100% - ${right}px)`,
    );
  }
};

const ordenarTabela = (state, tabela) => {
  const { ordenacao, arrayCotacoes } = state;
  if (ordenacao.key) {
    const ordem = escolhasOrdem[ordenacao.valor];
    if (!ordem) {
      return FiltrarTabela(state);
    }
    return [...ordenar(tabela, ordenacao.key, ordem, arrayCotacoes)];
  }
  return [];
};

const ordenar = (array, key, ordem, arrayCotacoes) => {
  return array.sort((a, b) => {
    let item1, item2;
    let valor1, valor2;
    let attbr = key.split(" ");

    if (ordem === "asc") {
      item1 = a;
      item2 = b;
    } else {
      item1 = b;
      item2 = a;
    }

    if (attbr[1]) {
      valor1 = item1[attbr[0]][attbr[1]].strike;
      valor2 = item2[attbr[0]][attbr[1]].strike;
    } else if (key === "acaoUlt") {
      valor1 = buscarNumeroArray(
        arrayCotacoes,
        item1[key].acao,
        "codigo",
        "cotacao",
      );
      valor2 = buscarNumeroArray(
        arrayCotacoes,
        item2[key].acao,
        "codigo",
        "cotacao",
      );
    } else {
      valor1 = item1[key];
      valor2 = item2[key];
    }

    if (valor1 > valor2) {
      return 1;
    }
    if (valor1 < valor2) {
      return -1;
    }
    return 0;
  });
};
