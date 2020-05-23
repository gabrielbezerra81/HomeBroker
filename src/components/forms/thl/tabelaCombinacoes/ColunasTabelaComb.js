import React from "react";
import imgModeloEU from "img/modeloEU.png";
import ImgModeloUSA from "img/imgModeloUSA3.svg";
import InputsFiltroTabela from "components/forms/thl/tabelaCombinacoes/FiltroTabela";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "components/utils/Formatacoes";
import { StateStorePrincipal } from "components/redux/StoreCreation";

export const ColunaHeader = ({ children, column }) => {
  let elementoColuna;
  let classNameColunaAcaoUlt = "";
  let tipoFiltro = "";
  const { key } = column;

  if (key === "acaoUlt") {
    classNameColunaAcaoUlt = " colunaAcaoUlt";
    elementoColuna = (
      <div className="colunaDividida">
        <div>Acão</div>
        <div>Ult</div>
      </div>
    );
  } else {
    elementoColuna = column.title;
  }
  if (["estrategia", "grupo", "acaoUlt"].includes(key)) {
    tipoFiltro = "texto";
  } else if (["spread", "montagem", "desmontagem"].includes(key)) {
    tipoFiltro = "numero";
  } else if ("codigos" === key) {
    tipoFiltro = "numeroTexto";
  } else if ("vencimento" === key) {
    tipoFiltro = "multiSelect";
  } else if ("prazo" === key) {
    tipoFiltro = "select";
  }

  return (
    <div
      style={{ width: `${column.width}px`, flexGrow: `${column.width}` }}
      className={`th${classNameColunaAcaoUlt}`}
    >
      <div className="divLabelColuna">
        {elementoColuna}
        <div className="containerInputFiltro">
          <InputsFiltroTabela
            tipoFiltro={tipoFiltro}
            coluna={column}
          ></InputsFiltroTabela>
        </div>
      </div>
    </div>
  );
};

export const ColunaTextoComum = (props) => {
  const { children } = props;
  const key = props.column.key;
  let texto = children;
  const classeTextoRoxo = ["vencimento", "prazo"].includes(key)
    ? ""
    : "roxoTextoTHL";

  if (key === "spread") texto = `R$ ${formatarNumDecimal(children)}`;
  if (key === "vencimento") texto = texto.split(" ")[0];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
      className={classeTextoRoxo}
    >
      {texto}
    </div>
  );
};

export const ColunaAcaoUlt = ({ children, row, column }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { arrayCotacoes } = reduxState;
  const acao = children.acao;

  const item = arrayCotacoes.find((item) => item.codigo === acao);

  return (
    <div className="colunaAcaoUlt">
      <div className="colunaDividida roxoTextoTHL">
        <div>{acao}</div>
        <div>{item ? item.cotacao : ""}</div>
      </div>
    </div>
  );
};

export const ColunaCodigos = ({ children, row, column }) => {
  const { estrutura } = row;
  const { components } = estrutura;
  const opcao1 = components[0].stock;
  const opcao2 = components[1].stock;

  return (
    <div className="colunaDividida">
      <div className="mr-1">
        <div className="roxoTextoTHL">
          {row.acaoUlt.acao.slice(0, row.acaoUlt.acao.length - 1)}
        </div>
        <div>Strike</div>
      </div>
      <div className="mr-1">
        <div className="flexAlignEnd codigoColunaModelo">
          <div className="roxoTextoTHL">{opcao1.symbol.slice(4)}</div>
          {renderModelo(opcao1.model)}
        </div>
        <div>{formatarNumDecimal(opcao1.strike)}</div>
      </div>
      <div>
        <div className="flexAlignEnd  codigoColunaModelo">
          <div className="roxoTextoTHL">{opcao2.symbol.slice(4)}</div>
          {renderModelo(opcao2.model)}
        </div>
        <div>{formatarNumDecimal(opcao2.strike)}</div>
      </div>
    </div>
  );
};

export const ColunaMontagem = ({ children, row, column }) => {
  const { estrutura } = row;
  const { components } = estrutura;
  const opcao1 = components[0].stock;
  const opcao2 = components[1].stock;

  let preco = "";
  let book1, book2;

  if (column.key === "montagem") {
    preco = estrutura.max;
    book1 = `${formatarNumDecimal(opcao1.compra)} | ${formatarQuantidadeKMG(
      opcao1.compraQtde
    )}`;
    book2 = `${formatarNumDecimal(opcao2.venda)} | ${formatarQuantidadeKMG(
      opcao2.vendaQtde
    )}`;
  } else {
    book1 = `${formatarNumDecimal(opcao1.venda)} | ${formatarQuantidadeKMG(
      opcao1.vendaQtde
    )}`;
    book2 = `${formatarNumDecimal(opcao2.compra)} | ${formatarQuantidadeKMG(
      opcao2.compraQtde
    )}`;
    preco = estrutura.min;
  }

  return (
    <div>
      <div>R$ {formatarNumDecimal(preco)}</div>
      <div className="colunaDividida roxoTextoTHL">
        <div className="mr-2">{book1}</div>
        <div>{book2}</div>
      </div>
    </div>
  );
};

const formatarQtde = (qtde) => {
  if (qtde < 1000) return qtde;
  else return `${qtde / 1000}k`;
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
// <div className="divLabelColuna">
//   <div className="colunaDividida">
//     <div>Acão</div>
//     <div>Ult</div>
//   </div>
// </div>
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
