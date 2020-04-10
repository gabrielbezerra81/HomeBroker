import React from "react";
import imgModeloEU from "img/modeloEU.png";
import ImgModeloUSA from "img/imgModeloUSA3.svg";

export const HeaderColunaAcaoUlt = ({ children, column }) => {
  return (
    //  className="divLabelColuna"
    <th style={{ minWidth: "85px", flexGrow: "85" }} className="colunaAcaoUlt">
      <div className="colunaDividida">
        <div>Acão</div>
        <div>Ult</div>
      </div>
    </th>
  );
};

export const ColunaTextoComum = (props) => {
  const { children } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

export const ColunaAcaoUlt = ({ children, row, column }) => {
  return (
    <div className="colunaAcaoUlt">
      <div className="colunaDividida">
        <div>{children.acao}</div>
        <div>{children.ult}</div>
      </div>
    </div>
  );
};

export const ColunaCodigos = ({ children, row, column }) => {
  return (
    <div className="colunaDividida">
      <div className="mr-1">
        <div>{row.acaoUlt.acao.slice(0, row.acaoUlt.acao.length - 1)}</div>
        <div>Strike</div>
      </div>
      <div className="mr-1">
        <div className="flexAlignEnd codigoColunaModelo">
          <div>B319</div>
          {renderModelo("EUROPEAN")}
        </div>
        <div>19,55</div>
      </div>
      <div>
        <div className="flexAlignEnd  codigoColunaModelo">
          <div>C479</div>
          {renderModelo("USA")}
        </div>
        <div>19,55</div>
      </div>
    </div>
  );
};

export const ColunaMontagem = ({ children, row, column }) => {
  return (
    <div>
      <div>R$ {children.valor}</div>
      <div className="colunaDividida corTextoBook">
        <div className="mr-2">
          {children.bookVenda.valor} | {children.bookVenda.qtde}
        </div>
        <div>
          {children.bookCompra.valor} | {children.bookCompra.qtde}
        </div>
      </div>
    </div>
  );
};

const renderModelo = (modelo) => {
  return (
    <div style={{ marginBottom: "1px" }}>
      {modelo === "EUROPEAN" ? (
        <img src={imgModeloEU} alt="" className="imgModeloTHL" />
      ) : (
        <img
          src={ImgModeloUSA}
          alt=""
          className="imgModeloTHL"
          style={{ marginLeft: "2px", height: "14px" }}
        />
      )}
    </div>
  );
};

// <ImgModeloUSA
// viewBox="6 -1 17 17"
// className="imgModeloTHL"
// ></ImgModeloUSA>

// const a = (
//   <BootstrapTable
//     data={tableData}
//     keyField="id"
//     tableContainerClass="tabelaCombinacoes"
//     striped
//     options={{ noDataText: "Nenhum resultado foi encontrado" }}
//   >
//     <TableHeaderColumn dataField="estrategia" width="90" filter={filterTexto}>
//       <div className="divLabelColuna">Estratégia</div>
//     </TableHeaderColumn>

//     <TableHeaderColumn dataField="grupo" filter={filterTexto} width="75">
//       <div className="divLabelColuna">Grupo</div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       width="85"
//       dataField="acaoUlt"
//       filterValue={(cell) => `${cell.acao}${cell.ult}`}
//       filter={filterTexto}
//       className="colunaAcaoUlt"
//       dataFormat={(cell, row) => <ColunaAcaoUlt cell={cell} row={row} />}
//     >
//       <div className="divLabelColuna">
//         <div className="colunaDividida">
//           <div>Acão</div>
//           <div>Ult</div>
//         </div>
//       </div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       dataField="spread"
//       width="70"
//       filterValue={(cell) => Number(cell.replace(",", "."))}
//       filter={{
//         type: "CustomFilter",
//         getElement: (filterHandler, customParam) =>
//           filtrarNumeros(filterHandler, customParam, "simples", scrollbarRef),
//       }}
//     >
//       <div className="divLabelColuna">Spread</div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       dataField="codigos"
//       width="220"
//       dataFormat={(cell, row) => <ColunaCodigos cell={cell} row={row} />}
//       filter={{
//         type: "CustomFilter",
//         getElement: (filterHandler, customParam) =>
//           filtrarNumeros(
//             filterHandler,
//             customParam,
//             "compostoArray",
//             scrollbarRef
//           ),
//       }}
//     >
//       <div className="divLabelColuna">Códigos</div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       dataField="montagem"
//       dataFormat={(cell, row) => <ColunaMontagem cell={cell} row={row} />}
//       width="170"
//       filterValue={(cell) => Number(cell.valor.replace(",", "."))}
//       filter={{
//         type: "CustomFilter",
//         getElement: (filterHandler, customParam) =>
//           filtrarNumeros(filterHandler, customParam, "simples", scrollbarRef),
//       }}
//       className="colunaMontagemDesmontagem"
//     >
//       <div className="divLabelColuna">Montagem</div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       dataField="desmontagem"
//       dataFormat={(cell, row) => <ColunaMontagem cell={cell} row={row} />}
//       width="170"
//       filterValue={(cell) => Number(cell.valor.replace(",", "."))}
//       filter={{
//         type: "CustomFilter",
//         getElement: (filterHandler, customParam) =>
//           filtrarNumeros(filterHandler, customParam, "simples", scrollbarRef),
//       }}
//       className="colunaMontagemDesmontagem"
//     >
//       <div className="divLabelColuna">Desmontagem</div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       dataField="vencimento"
//       width="95"
//       filter={{
//         type: "SelectFilter",
//         options: options(combinacoes, "vencimento"),
//         selectText: "",
//         withoutEmptyOption: true,
//       }}
//     >
//       <div className="divLabelColuna">Vencimento</div>
//     </TableHeaderColumn>
//     <TableHeaderColumn
//       dataField="prazo"
//       width="80"
//       filter={{
//         type: "SelectFilter",
//         options: options(combinacoes, "prazo"),
//         selectText: "",
//         withoutEmptyOption: true,
//       }}
//     >
//       <div className="divLabelColuna">Prazo</div>
//     </TableHeaderColumn>
//   </BootstrapTable>
// );
