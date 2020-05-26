/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { Spin } from "antd";
import { FiltrarTabela } from "components/forms/thl/tabelaCombinacoes/FiltroTabela";
import { StateStorePrincipal } from "components/redux/StoreCreation";
import TabelaCombinacoes from "components/forms/thl/tabelaCombinacoes/TabelaCombinacoes";

export default React.memo(() => {
  const reduxState = StateStorePrincipal().THLReducer;
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
  } = reduxState;

  const [alturaContainer, setAlturaContainer] = useState(496);
  const [classeMargemScroll, setClasseMargemScroll] = useState("");

  const dataTabela = useMemo(() => {
    const data = FiltrarTabela(reduxState);
    const tamanhoTabela = data.length;

    const alturaLinha = 45;
    let alturaCalculada = 102 + alturaLinha * tamanhoTabela;
    if (alturaCalculada > 496) alturaCalculada = 496;
    setAlturaContainer(alturaCalculada);

    if (tamanhoTabela < 10) setClasseMargemScroll("margemScrollbar ");
    else setClasseMargemScroll("");

    return data;
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
    idCelulaSelecionada,
    codigoCelulaSelecionada,
  ]);

  //Bloqueia o scroll do container THL quando for rolar a tabela
  const bloquearScroll = alturaContainer === 102;
  useEffect(() => {
    var parent = document.getElementById("tabelaCombinacoes").childNodes[1];

    var scrollDiv = parent.lastChild;

    if (scrollDiv)
      scrollDiv.addEventListener(
        "wheel",
        function (e) {
          e.stopPropagation();
        },
        { passive: true }
      );
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
  // TODO:
  // const ultimaLinha = dataTabela[dataTabela.length - 1];
  // const ultimaLinhaSelecionada =
  //   ultimaLinha && ultimaLinha.id === idCelulaSelecionada
  //     ? " ultimaLinhaSelecionada"
  //     : "";
  const ultimaLinhaSelecionada = "";

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
          className={`containerTabelaComb${ultimaLinhaSelecionada}`}
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
    let right = 20;

    if (clientWidth < 1079) {
      right -= maxScroll - container.scrollLeft;
      if (right < -2) right = -2;
    }

    container.style.setProperty("--some-width", `calc(100% - ${right}px)`);
  }
};
