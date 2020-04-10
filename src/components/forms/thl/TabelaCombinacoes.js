import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { WindowTable } from "window-table";
import InfiniteScroll from "react-infinite-scroller";
import $ from "jquery";
import FiltroNumericoSeletor from "./FiltroNumericoSeletor";
import { comb300 } from "./tableData";
import InfiniteScroll2 from "react-infinite-scroll-component";
import {
  ColunaAcaoUlt,
  ColunaCodigos,
  ColunaMontagem,
  ColunaTextoComum,
  HeaderColunaAcaoUlt,
} from "components/forms/thl/ColunasTabelaComb";

export default ({ props }) => {
  useEffect(() => {
    var parent = document.getElementById("tabelaCombinacoes").childNodes[1];
    var scrollDiv = parent.lastChild;

    $(scrollDiv).on("wheel", function (e) {
      var event = e.originalEvent,
        d = -event.deltaY || -event.detail;

      this.scrollTop += (d < 0 ? 1 : -1) * 30;

      e.preventDefault();
    });
  });

  const state = useSelector((state) => state.THLReducer);

  // const [scrollbarRef, setScrollbarRef] = useState("");
  // const [tableData, setTableData] = useState(comb300.slice(0, 40));
  // const [hasMore, setHasMore] = useState(true);

  return (
    <div className="containerCombinacoesTHL">
      {/* <InfiniteScroll
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
        > */}
      <div className="containerTabelaComb">
        <Html5Table
          className="tabelaCombinacoes"
          id="tabelaCombinacoes"
          data={tableData}
          columns={columns}
        />
      </div>
      {/* </InfiniteScroll> */}
    </div>
  );
};

const tableData = comb300; //.filter((row) => row.id < 50);

const Html5Table = (props) => {
  return (
    <WindowTable
      className="table"
      Cell="td"
      HeaderCell="th"
      Header="thead"
      HeaderRow="tr"
      // Row="tr"
      Row={(props) => StripedRow(props)}
      Body="tbody"
      Table="table"
      overscanCount={2}
      // rowClassName={(index) => (index % 2 === 0 ? "linha-par" : "linha-impar")}
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
  },
  { key: "grupo", width: 75, title: "Grupo", Component: ColunaTextoComum },
  {
    key: "acaoUlt",
    width: 85,
    title: "Acão | Ult",
    Component: ColunaAcaoUlt,
    HeaderCell: HeaderColunaAcaoUlt,
  },
  { key: "spread", width: 70, title: "Spread", Component: ColunaTextoComum },
  { key: "codigos", width: 220, title: "Códigos", Component: ColunaCodigos },
  { key: "montagem", width: 170, title: "Montagem", Component: ColunaMontagem },
  {
    key: "desmontagem",
    width: 170,
    title: "Desmontagem",
    Component: ColunaMontagem,
  },
  {
    key: "vencimento",
    width: 95,
    title: "Vencimento",
    Component: ColunaTextoComum,
  },
  { key: "prazo", width: 80, title: "Prazo", Component: ColunaTextoComum },
];

const StripedRow = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className={props.index % 2 === 0 ? "linha-par" : ""}
    />
  );
};

// const filterTexto = { type: "TextFilter", delay: 250, placeholder: " " };

// const options = (combinacoes, atributo) => {
//   let opcoes = { "": "" };

//   combinacoes.forEach((comb) => {
//     opcoes[comb[atributo]] = comb[atributo];
//   });

//   return opcoes;
// };

// const filtrarNumeros = (filterHandler, customFilterParameters, tipo, ref) => {
//   return (
//     <FiltroNumericoSeletor
//       filterHandler={filterHandler}
//       tipo={tipo}
//       scrollbarRef={ref}
//     ></FiltroNumericoSeletor>
//   );
// };

/*Tabela comum
<Table
        variant="dark"
        className="text-center tabelaCombinacoes"
        bordered
        id="tabelaCombinacoes"
      >
        <thead>
          <tr>
            <th>Estratégia</th>
            <th>Grupo</th>
            <th>
              <div className="colunaDividida">
                <div>Ação</div>
                <div>Ult</div>
              </div>
            </th>
            <th>Spread</th>
            <th>Códigos</th>
            <th>Montagem</th>
            <th>Desmontagem</th>
            <th>Vencimento</th>
            <th>Prazo</th>
          </tr>
        </thead>
        <tbody>
          {["1", "2"].map((item, index) => {
            return (
              <tr key={`combinacoes${index}`}>
                <td>THL</td>
                <td>19,55</td>
                <td>
                  <div className="colunaDividida">
                    <div>PETR4</div>
                    <div>Ult</div>
                  </div>
                </td>
                <td>R$ 10,50</td>
                <td>
                  
                </td>
                <td>
                  <div>R$ 0,00</div>
                  <div className="colunaDividida corTextoBook">
                    <div className="mr-5">0,70 | 10K</div>
                    <div>0,70 | 10K</div>
                  </div>
                </td>
                <td>
                  <div>R$ 0,00</div>
                  <div className="colunaDividida corTextoBook">
                    <div className="mr-5">0,70 | 10K</div>
                    <div>0,70 | 10K</div>
                  </div>
                </td>
                <td>21/10/2019</td>
                <td>21 Dias</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
*/

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

const fetchMoreData = (tableData, hasMore, setTableData, setHasMore) => {
  if (tableData.length >= comb300.length) {
    setHasMore(false);
    return;
  }
  // a fake async api call like which sends
  // 20 more records in .5 secs
  setTimeout(() => {
    setTableData(tableData.concat(comb300.slice(0, 100)));
  }, 500);
};
