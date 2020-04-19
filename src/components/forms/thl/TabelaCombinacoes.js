import React, { useEffect, useMemo } from "react";
import { WindowTable } from "window-table";
import {
  ColunaAcaoUlt,
  ColunaCodigos,
  ColunaMontagem,
  ColunaTextoComum,
  ColunaHeader,
} from "components/forms/thl/ColunasTabelaComb";
import { FiltrarTabela } from "components/forms/thl/FiltroTabela";
import { useSelectorStorePrincipal } from "components/redux/StoreCreation";

export default React.memo(() => {
  const reduxState = useSelectorStorePrincipal((state) => {
    return state.THLReducer;
  });
  const dataTabela = useMemo(() => FiltrarTabela(reduxState), [reduxState]);

  //Bloqueia o scroll do container quando for rolar a tabela
  // useEffect(() => {
  //   var parent = document.getElementById("tabelaCombinacoes").childNodes[1];
  //   var scrollDiv = parent.lastChild;

  //   if (scrollDiv)
  //     scrollDiv.addEventListener(
  //       "wheel",
  //       function (e) {
  //         var event = e,
  //           d = -event.deltaY || -event.detail;

  //         this.scrollTop += (d < 0 ? 1 : -1) * 30;
  //         // e.preventDefault();
  //       },
  //       { passive: true }
  //     );
  // });
  let alturaContainer = 102 + 43 * dataTabela.length;
  if (alturaContainer > 496) alturaContainer = 496;

  return (
    <div className="containerCombinacoesTHL">
      <div
        className="containerTabelaComb"
        style={{ height: `${alturaContainer}px` }}
      >
        <Html5Table
          className="tabelaCombinacoes"
          id="tabelaCombinacoes"
          data={dataTabela}
          columns={columns}
        />
      </div>
    </div>
  );
});

const Html5Table = (props) => {
  const tamanhoTabela = props.data.length;
  return (
    <WindowTable
      Cell={Td}
      Header={Thead}
      Row={(props) => StripedRow(props, tamanhoTabela)}
      overscanCount={2}
      {...props}
    />
  );
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
    width: 95,
    title: "Vencimento",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "prazo",
    width: 80,
    title: "Prazo",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
];

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

const StripedRow = (props, tamanhoTabela) => {
  const classeMargemScroll = tamanhoTabela < 10 ? "margemScrollbar " : "";
  const classeUltimaLinha =
    props.index === tamanhoTabela - 1 ? "ultimaLinha " : "";

  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className={
        classeMargemScroll +
        classeUltimaLinha +
        (props.index % 2 === 0 ? "linha-par" : "linha-impar")
      }
    />
  );
};

const Td = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className="td"
    ></div>
  );
};

/*
  react-infinite-scroll-component

  <InfiniteScroll
dataLength={tableData.length}
next={() =>
  fetchMoreData(tableData, hasMore, setTableData, setHasMore)
}
hasMore={hasMore}
loader={<h4>Loading...</h4>}
scrollableTarget="scrollbarTabelaCombinacoes"
endMessage={
  <p style={{ textAlign: "center" }}>
    <b>Yay! You have seen it all</b>
  </p>
}
> */

/* <InfiniteScroll
          pageStart={0}
          loadMore={() =>
            fetchMoreData(tableData, hasMore, setTableData, setHasMore)
          }
          hasMore={hasMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
          // getScrollParent={() => scrollbarRef}
        > */
