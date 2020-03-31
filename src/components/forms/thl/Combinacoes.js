import React from "react";
import { useSelector } from "react-redux";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
// import { Table } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";

var combinacoes = [
  {
    id: 1,
    estrategia: "THL",
    grupo: "19,55",
    acao: "PETR4",
    ult: "Ult",
    spread: "10,50",
    codigos: "",
    montagem: "",
    desmontagem: "",
    vencimento: "21/10/2019",
    prazo: "21 Dias"
  },
  {
    id: 2,
    estrategia: "THL",
    grupo: "19,55",
    acao: "PETR4",
    ult: "Ult",
    spread: "10,50",
    codigos: "",
    montagem: "",
    desmontagem: "",
    vencimento: "22/10/2019",
    prazo: "21 Dias"
  }
];

export default ({ props }) => {
  const state = useSelector(state => state.THLReducer);

  return (
    <div className="containerCombinacoesTHL">
      <BootstrapTable
        data={combinacoes}
        keyField="id"
        tableContainerClass="tabelaCombinacoes"
        striped
        options={{ noDataText: "Nenhum resultado foi encontrado" }}
      >
        <TableHeaderColumn
          dataField="estrategia"
          width="90"
          filter={filterTexto}
          data
        >
          Estratégia
        </TableHeaderColumn>
        <TableHeaderColumn dataField="grupo" filter={filterTexto}>
          Grupo
        </TableHeaderColumn>
        <TableHeaderColumn dataField="acao" filter={filterTexto}>
          Acão
        </TableHeaderColumn>
        <TableHeaderColumn dataField="ult">Ult</TableHeaderColumn>
        <TableHeaderColumn dataField="spread">Spread</TableHeaderColumn>
        <TableHeaderColumn
          dataField="codigos"
          width="220"
          dataFormat={renderColunaCodigos}
        >
          Códigos
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="montagem"
          dataFormat={renderColunaMontagem}
          width="170"
        >
          Montagem
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="desmontagem"
          dataFormat={renderColunaMontagem}
          width="170"
        >
          Desmontagem
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
          Vencimento
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
          Prazo
        </TableHeaderColumn>
      </BootstrapTable>
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

const filterTexto = { type: "TextFilter", delay: 250, placeholder: " " };

const renderColunaCodigos = (cell, row) => {
  return (
    <div className="colunaDividida">
      <div className="mr-1">
        <div>PETR</div>
        <div>Strike</div>
      </div>
      <div className="mr-1">
        <div className="flexAlignEnd">
          <div>B319</div>
          {renderModelo("EUROPEAN")}
        </div>
        <div>19,55</div>
      </div>
      <div>
        <div className="flexAlignEnd">
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
      <div>R$ 0,00</div>
      <div className="colunaDividida corTextoBook">
        <div className="mr-2">0,70 | 10K</div>
        <div>0,70 | 10K</div>
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
