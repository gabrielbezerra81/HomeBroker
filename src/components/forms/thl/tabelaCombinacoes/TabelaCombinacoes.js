/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useMemo, useEffect, useState } from "react";
import { WindowTable } from "window-table";
import { Spinner } from "react-bootstrap";
import { Spin } from "antd";
import {
  ColunaAcaoUlt,
  ColunaCodigos,
  ColunaMontagem,
  ColunaTextoComum,
  ColunaHeader,
} from "components/forms/thl/tabelaCombinacoes/ColunasTabelaComb";
import { FiltrarTabela } from "components/forms/thl/tabelaCombinacoes/FiltroTabela";
import {
  useSelectorStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";

export default React.memo(() => {
  const reduxState = useSelectorStorePrincipal((state) => {
    return state.THLReducer;
  });
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
    carregandoCombinacoes,
    idCelulaSelecionada,
  } = reduxState;
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <WindowTable
            className="tabelaCombinacoes"
            id="tabelaCombinacoes"
            data={dataTabela}
            columns={columns}
            Cell={(props) => {
              const idAnterior =
                props.index > 0 ? dataTabela[props.index - 1].id : -1;
              return Td(props, {
                classeMargemScroll,
                idCelulaSelecionada,
                idAnterior,
              });
            }}
            Header={Thead}
            Row={StripedRow}
            overscanCount={2}
          />
        </div>
      </Spin>
    </div>
  );
});

const Thead = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className="thead"
    ></div>
  );
};

const StripedRow = forwardRef((props, ref) => {
  const dispatch = DispatchStorePrincipal();
  return (
    <div
      {...props}
      tabIndex={0}
      onClick={() =>
        dispatch(mudarVariavelTHLAction("idCelulaSelecionada", props.row.id))
      }
      className={
        props.index % 2 === 0
          ? "linha-par divClicavel tr"
          : "linha-impar divClicavel tr"
      }
    />
  );
});

const Td = (props, layoutProps) => {
  const { row } = props;
  const { classeMargemScroll, idCelulaSelecionada, idAnterior } = layoutProps;
  const linhaSelecionada = [row.id, idAnterior].includes(idCelulaSelecionada)
    ? " linhaSelecionada"
    : "";

  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className={`${classeMargemScroll}td${linhaSelecionada}`}
    ></div>
  );
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

export const verificarOverflow = () => {
  const container = document.getElementsByClassName("containerTabelaComb")[0];
  let alturaScrollbar = 0;
  if (container && container.scrollWidth > container.clientWidth)
    alturaScrollbar = 14;

  return alturaScrollbar;
};

const columns = [
  {
    key: "estrategia",
    width: 90,
    title: "Estratégia",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "grupo",
    width: 75,
    title: "Grupo",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "acaoUlt",
    width: 85,
    title: "Acão | Ult",
    Component: ColunaAcaoUlt,
    HeaderCell: ColunaHeader,
  },
  {
    key: "spread",
    width: 70,
    title: "Spread",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "codigos",
    width: 220,
    title: "Códigos",
    Component: ColunaCodigos,
    HeaderCell: ColunaHeader,
  },
  {
    key: "montagem",
    width: 170,
    title: "Montagem",
    Component: ColunaMontagem,
    HeaderCell: ColunaHeader,
  },
  {
    key: "desmontagem",
    width: 170,
    title: "Desmontagem",
    Component: ColunaMontagem,
    HeaderCell: ColunaHeader,
  },
  {
    key: "vencimento",
    width: 115,
    title: "Vencimento",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "prazo",
    width: 60,
    title: "Prazo",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
];
