import React from "react";
// import { useSelector } from "react-redux";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import FiltroNumericoSeletor from "./FiltroNumericoSeletor";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";

const combinacoes = [
  {
    id: 1,
    estrategia: "THL",
    grupo: "19,55",
    acaoUlt: { acao: "PETR4", ult: "Ult" },
    spread: "10,50",
    codigos: [
      { symbol: "PETRD281", strike: 27.2, model: "AMERICAN" },
      { symbol: "PETRE279", strike: 27.97, model: "EUROPEAN" }
    ],
    montagem: {
      valor: "0,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 1000 }
    },
    desmontagem: {
      valor: "1,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 10000 }
    },
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  },
  {
    id: 2,
    estrategia: "THL",
    grupo: "19,55",
    acaoUlt: { acao: "PETR4", ult: "Ult" },
    spread: "10,50",
    codigos: [
      { symbol: "PETRD281", strike: 27.2, model: "AMERICAN" },
      { symbol: "PETRE277", strike: 27.72, model: "AMERICAN" }
    ],
    montagem: {
      valor: "0,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 1000 }
    },
    desmontagem: {
      valor: "2,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 10000 }
    },
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  },
  {
    id: 3,
    estrategia: "THL",
    grupo: "19,55",
    acaoUlt: { acao: "PETR4", ult: "Ult" },
    spread: "10,50",
    codigos: [
      { symbol: "PETRD281", strike: 27.2, model: "AMERICAN" },
      { symbol: "PETRE277", strike: 27.72, model: "AMERICAN" }
    ],
    montagem: {
      valor: "0,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 1000 }
    },
    desmontagem: {
      valor: "2,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 10000 }
    },
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  },
  {
    id: 4,
    estrategia: "THL",
    grupo: "19,55",
    acaoUlt: { acao: "PETR4", ult: "Ult" },
    spread: "10,50",
    codigos: [
      { symbol: "PETRD281", strike: 27.2, model: "AMERICAN" },
      { symbol: "PETRE277", strike: 27.72, model: "AMERICAN" }
    ],
    montagem: {
      valor: "0,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 1000 }
    },
    desmontagem: {
      valor: "2,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 10000 }
    },
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  },
  {
    id: 5,
    estrategia: "THL",
    grupo: "19,55",
    acaoUlt: { acao: "PETR4", ult: "Ult" },
    spread: "10,50",
    codigos: [
      { symbol: "PETRD281", strike: 27.2, model: "AMERICAN" },
      { symbol: "PETRE277", strike: 27.72, model: "AMERICAN" }
    ],
    montagem: {
      valor: "0,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 1000 }
    },
    desmontagem: {
      valor: "2,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 10000 }
    },
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  },
  {
    id: 6,
    estrategia: "THL",
    grupo: "19,55",
    acaoUlt: { acao: "PETR4", ult: "Ult" },
    spread: "10,50",
    codigos: [
      { symbol: "PETRD281", strike: 27.2, model: "AMERICAN" },
      { symbol: "PETRE277", strike: 27.72, model: "AMERICAN" }
    ],
    montagem: {
      valor: "0,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 1000 }
    },
    desmontagem: {
      valor: "2,00",
      bookVenda: { valor: "0,70", qtde: 10000 },
      bookCompra: { valor: "0,70", qtde: 10000 }
    },
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  }
];

export default ({ props }) => {
  // const state = useSelector(state => state.THLReducer);

  return (
    <div className="containerCombinacoesTHL">
      <BootstrapTable
        data={combinacoes}
        keyField="id"
        tableContainerClass="tabelaCombinacoes"
        striped
        options={{ noDataText: "Nenhum resultado foi encontrado" }}
        scrollTop={"Bottom"}
        height="287px"
      >
        <TableHeaderColumn
          dataField="estrategia"
          width="90"
          filter={filterTexto}
          data
        >
          <div className="divLabelColuna">Estratégia</div>
        </TableHeaderColumn>
        <TableHeaderColumn dataField="grupo" filter={filterTexto} width="75">
          <div className="divLabelColuna">Grupo</div>
        </TableHeaderColumn>
        <TableHeaderColumn
          width="90"
          dataField="acaoUlt"
          filterValue={cell => `${cell.acao}${cell.ult}`}
          filter={filterTexto}
          className="colunaAcaoUlt"
          dataFormat={renderColunaAcaoUlt}
        >
          <div className="divLabelColuna">
            <div className="colunaDividida">
              <div>Acão</div>
              <div>Ult</div>
            </div>
          </div>
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="spread"
          width="65"
          filterValue={cell => Number(cell.replace(",", "."))}
          filter={{
            type: "CustomFilter",
            getElement: (filterHandler, customParam) =>
              filtrarNumeros(filterHandler, customParam, "simples")
          }}
        >
          <div className="divLabelColuna">Spread</div>
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="codigos"
          width="220"
          dataFormat={renderColunaCodigos}
          filter={{
            type: "CustomFilter",
            getElement: (filterHandler, customParam) =>
              filtrarNumeros(filterHandler, customParam, "compostoArray")
          }}
        >
          <div className="divLabelColuna">Códigos</div>
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="montagem"
          dataFormat={renderColunaMontagem}
          width="170"
          filterValue={cell => Number(cell.valor.replace(",", "."))}
          filter={{
            type: "CustomFilter",
            getElement: (filterHandler, customParam) =>
              filtrarNumeros(filterHandler, customParam, "simples")
          }}
          className="colunaMontagemDesmontagem"
        >
          <div className="divLabelColuna">Montagem</div>
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="desmontagem"
          dataFormat={renderColunaMontagem}
          width="170"
          filterValue={cell => Number(cell.valor.replace(",", "."))}
          filter={{
            type: "CustomFilter",
            getElement: (filterHandler, customParam) =>
              filtrarNumeros(filterHandler, customParam, "simples")
          }}
          className="colunaMontagemDesmontagem"
        >
          <div className="divLabelColuna">Desmontagem</div>
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="vencimento"
          width="95"
          filter={{
            type: "SelectFilter",
            options: options(combinacoes, "vencimento"),
            selectText: "",
            withoutEmptyOption: true
          }}
        >
          <div className="divLabelColuna">Vencimento</div>
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="prazo"
          width="80"
          filter={{
            type: "SelectFilter",
            options: options(combinacoes, "prazo"),
            selectText: "",
            withoutEmptyOption: true
          }}
        >
          <div className="divLabelColuna">Prazo</div>
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
};

const renderColunaAcaoUlt = (cell, row) => {
  return (
    <div className="colunaAcaoUlt">
      <div className="colunaDividida">
        <div>{cell.acao}</div>
        <div>{cell.ult}</div>
      </div>
    </div>
  );
};

const filterTexto = { type: "TextFilter", delay: 250, placeholder: " " };

const renderColunaCodigos = (cell, row) => {
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

const renderColunaMontagem = (cell, row) => {
  return (
    <div>
      <div>R$ {cell.valor}</div>
      <div className="colunaDividida corTextoBook">
        <div className="mr-2">
          {cell.bookVenda.valor} | {cell.bookVenda.qtde}
        </div>
        <div>
          {cell.bookCompra.valor} | {cell.bookCompra.qtde}
        </div>
      </div>
    </div>
  );
};

const renderModelo = modelo => {
  return (
    <div>
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

const options = (combinacoes, atributo) => {
  let opcoes = { "": "" };

  combinacoes.forEach(comb => {
    opcoes[comb[atributo]] = comb[atributo];
  });

  return opcoes;
};

const filtrarNumeros = (filterHandler, customFilterParameters, tipo) => {
  return (
    <FiltroNumericoSeletor
      filterHandler={filterHandler}
      tipo={tipo}
    ></FiltroNumericoSeletor>
  );
};

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
