import React from "react";
import { connect } from "react-redux";
import { FormControl } from "react-bootstrap";
import { Select } from "antd";
import _ from "lodash";
import { mudarVariavelTHLAction } from "redux/actions/thl/THLActions";
import { StorePrincipalContext } from "redux/StoreCreation";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

class InputsFiltroTabela extends React.Component {
  render() {
    let filtro = <div></div>;

    if (this.props.tipoFiltro === "numero") filtro = this.filtroNumero();
    else if (this.props.tipoFiltro === "numeroTexto")
      filtro = this.filtroNumeroTexto();
    else if (this.props.tipoFiltro === "texto") filtro = this.filtroTexto();
    else if (this.props.tipoFiltro === "multiSelect")
      filtro = this.filtroMultiSelect();
    else if (this.props.tipoFiltro === "select") filtro = this.filtroSelect();

    return filtro;
  }

  // Modo simples apenas com 1 filtro para numeros contendo 1 input select e 2 de numeros para intervalos
  // Uso nas colunas de spread, montagem e desmontagem
  filtroNumero() {
    const key = this.props.coluna.key;
    const select = this.props[key].select;
    const minNumber = this.props[key].min;
    const maxNumber = this.props[key].max;
    const height = select === "<>" || select === "><" ? "43px" : "20px";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: height,
          justifyContent: "space-between",
        }}
      >
        {select === "<>" || select === "><" ? (
          <FormControl
            type="number"
            placeholder="max"
            className="form-control inputMaxRange"
            value={maxNumber}
            onChange={(e) =>
              this.props.mudarVariavelTHLAction(key, {
                ...this.props[key],
                max: e.target.value,
              })
            }
          ></FormControl>
        ) : null}
        <div style={{ position: "relative" }}>
          <FormControl
            type="number"
            placeholder={select === "<>" || select === "><" ? "min" : "valor"}
            className="form-control inputMinRange"
            value={minNumber}
            onChange={(e) =>
              this.props.mudarVariavelTHLAction(key, {
                ...this.props[key],
                min: e.target.value,
              })
            }
          ></FormControl>
          <Select
            size="small"
            dropdownClassName="inputCodigoDropdown selectOperacaoFiltroDropdown"
            className="selectOperacaoFiltro"
            style={{ height: "20px !important" }}
            value={this.props[key].select}
            suffixIcon={<div style={{ color: "#ddd" }}>{select}</div>}
            onChange={(value) =>
              this.props.mudarVariavelTHLAction(key, {
                ...this.props[key],
                select: value,
              })
            }
          >
            <Select.Option value={"><"}>{"><"}</Select.Option>
            <Select.Option value={"<>"}>{"<>"}</Select.Option>
            <Select.Option value={"<"}>{"<"}</Select.Option>
            <Select.Option value={">"}>{">"}</Select.Option>
            <Select.Option value={"="}>=</Select.Option>
          </Select>
        </div>
      </div>
    );
  }

  // Modo composto com 2 grupos lado a lado. Cada um com 1 filtro para strike (numero) e outro para codigo (texto)
  // Uso na coluna de códigos
  filtroNumeroTexto() {
    return (
      <div style={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
        {this.grupoInputsNumeroTexto("select", "min", "max", "codigo1")}
        {this.grupoInputsNumeroTexto("select2", "min2", "max2", "codigo2")}
      </div>
    );
  }
  // Cada filtro da coluna de códigos possui um par com input de texto (codigo) e numero (strike)
  grupoInputsNumeroTexto(
    selectLabel,
    strikeMinLabel,
    strikeMaxLabel,
    codigoLabel,
  ) {
    const key = this.props.coluna.key;
    const select = this.props[key][selectLabel];
    const strikeMin = this.props[key][strikeMinLabel];
    const strikeMax = this.props[key][strikeMaxLabel];
    const codigo = this.props[key][codigoLabel];
    const height = ["><", "<>"].includes(select) ? "66px" : "43px"; //43 px

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: height,
          justifyContent: "space-between",
          marginLeft: "2px",
          marginRight: "2px",
          position: "relative",
        }}
      >
        {select === "<>" || select === "><" ? (
          <FormControl
            type="number"
            placeholder="max"
            className="form-control inputMaxRange"
            value={strikeMax}
            onChange={(e) =>
              this.props.mudarVariavelTHLAction(key, {
                ...this.props[key],
                [strikeMaxLabel]: e.target.value,
              })
            }
          ></FormControl>
        ) : null}
        <div style={{ position: "relative" }}>
          <FormControl
            type="number"
            placeholder={select === "<>" || select === "><" ? "min" : "valor"}
            className="form-control inputMinRange"
            value={strikeMin}
            onChange={(e) =>
              this.props.mudarVariavelTHLAction(key, {
                ...this.props[key],
                [strikeMinLabel]: e.target.value,
              })
            }
          ></FormControl>
          <Select
            size="small"
            dropdownClassName="inputCodigoDropdown selectOperacaoFiltroDropdown"
            value={select}
            className="selectOperacaoFiltro"
            style={{ height: "20px !important" }}
            suffixIcon={<div style={{ color: "#ddd" }}>{select}</div>}
            onChange={(value) =>
              this.props.mudarVariavelTHLAction(key, {
                ...this.props[key],
                [selectLabel]: value,
              })
            }
          >
            <Select.Option value={"><"}>{"><"}</Select.Option>
            <Select.Option value={"<>"}>{"<>"}</Select.Option>
            <Select.Option value={"<"}>{"<"}</Select.Option>
            <Select.Option value={">"}>{">"}</Select.Option>
            <Select.Option value={"="}>=</Select.Option>
          </Select>
        </div>

        <FormControl
          type="text"
          placeholder="código"
          value={codigo}
          onChange={(e) =>
            this.props.mudarVariavelTHLAction(key, {
              ...this.props[key],
              [codigoLabel]: e.target.value,
            })
          }
        ></FormControl>
      </div>
    );
  }

  // Uso nas colunas de estrategia, grupo e ação/ult
  filtroTexto() {
    const key = this.props.coluna.key;
    return (
      <FormControl
        onChange={(e) => this.props.mudarVariavelTHLAction(key, e.target.value)}
        value={this.props[key]}
      />
    );
  }

  filtroSelect() {
    const key = this.props.coluna.key;
    return (
      <FormControl
        as="select"
        value={this.props[key]}
        onChange={(e) => this.props.mudarVariavelTHLAction(key, e.target.value)}
      >
        <option value=""></option>
        {opcoesInputSelect(this.props)}
      </FormControl>
    );
  }

  filtroMultiSelect() {
    const { key } = this.props.coluna;
    const classeSelect =
      key === "vencimento" ? "multiSelectVencimento" : "multiSelectPrazo";
    return (
      <Select
        mode="multiple"
        size="small"
        // value={this.props.vencimento}
        className={`multiSelectFiltroTHL ${classeSelect}`}
        dropdownClassName="inputCodigoDropdown"
        onChange={(value) => {
          this.props.mudarVariavelTHLAction(key, value);
        }}
      >
        {opcoesInputSelect(this.props, "antd")}
      </Select>
    );
  }
}

const opcoesInputSelect = (props, lib = "") => {
  const key = props.coluna.key;
  const arrayOpcoes = [
    ...new Set(props.combinacoesTabela.map((linha) => linha[key])),
  ];

  return arrayOpcoes.map((opcao, indice) =>
    lib === "antd" ? (
      <Select.Option
        className="multiSelectFiltroTHLOption"
        key={`${key}${indice}`}
        value={opcao}
      >
        {key === "vencimento" ? opcao.split(" ")[0] : opcao}
      </Select.Option>
    ) : (
      <option key={`${key}${indice}`} value={opcao}>
        {opcao}
      </option>
    ),
  );
};

const mapStateToProps = (state) => ({
  combinacoesTabela: state.thlReducer.combinacoesTabela,
  estrategia: state.thlReducer.estrategia,
  grupo: state.thlReducer.grupo,
  acaoUlt: state.thlReducer.acaoUlt,
  spread: state.thlReducer.spread,
  codigos: state.thlReducer.codigos,
  montagem: state.thlReducer.montagem,
  desmontagem: state.thlReducer.desmontagem,
  vencimento: state.thlReducer.vencimento,
  prazo: state.thlReducer.prazo,
});

export default connect(mapStateToProps, { mudarVariavelTHLAction }, null, {
  context: StorePrincipalContext,
})(InputsFiltroTabela);

// função principal que retorna a tabela filtrada
export const FiltrarTabela = (reduxState) => {
  const { combinacoesTabela, arrayCotacoes } = reduxState;

  const filteredData = filtroEstrategia(
    combinacoesTabela,
    reduxState.estrategia,
  );

  const filteredData2 = filtroGrupo(combinacoesTabela, reduxState.grupo);
  const filteredData3 = filtroAcaoUlt(
    combinacoesTabela,
    reduxState.acaoUlt,
    arrayCotacoes,
  );
  const filteredData4 = filtroSpread(combinacoesTabela, reduxState.spread);
  const filteredData5 = filtroCodigos(combinacoesTabela, reduxState.codigos);
  const filteredData6 = filtroMontagem(
    combinacoesTabela,
    reduxState.montagem,
    "montagem",
  );
  const filteredData7 = filtroMontagem(
    combinacoesTabela,
    reduxState.desmontagem,
    "desmontagem",
  );

  const filteredData8 = filtroVcto(combinacoesTabela, reduxState.vencimento);
  const filteredData9 = filtroPrazo(combinacoesTabela, reduxState.prazo);

  return _.intersectionBy(
    filteredData,
    filteredData2,
    filteredData3,
    filteredData4,
    filteredData5,
    filteredData6,
    filteredData7,
    filteredData8,
    filteredData9,
    "id",
  );
};

const filtroEstrategia = (data, filterText) => {
  return data.filter((linha) =>
    linha.estrategia
      .toLocaleLowerCase()
      .includes(filterText.toLocaleLowerCase()),
  );
};
const filtroGrupo = (data, filterText) => {
  return data.filter((linha) =>
    linha.grupo.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()),
  );
};
const filtroAcaoUlt = (data, filterText, arrayCotacoes) => {
  if (filterText) {
    return data.filter((linha) => {
      const acao = linha.acaoUlt.acao;
      const ativo = arrayCotacoes.find((item) => item.codigo === acao);
      const cotacao = ativo ? ativo.cotacao : "";
      return `${acao} ${linha.acaoUlt.ult} ${formatarNumDecimal(cotacao)}`
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase());
    });
  }

  return data;
};
const filtroSpread = (data, filterObj) => {
  return filtrarDadosColuna(data, filterObj, "spread", "numero");
};
const filtroCodigos = (data, filterObj) => {
  return filtrarDadosColuna(data, filterObj, "codigos", "numeroTexto");
};
const filtroMontagem = (data, filterObj, atributo) => {
  return filtrarDadosColuna(data, filterObj, atributo, "numero");
};
const filtroVcto = (data, arrayVencimentos) => {
  if (arrayVencimentos.length)
    return data.filter((linha) =>
      arrayVencimentos.includes(linha.vencimento.toLocaleLowerCase()),
    );
  return data;
};
const filtroPrazo = (data, filterText) => {
  if (filterText.length)
    return data.filter((linha) => filterText.includes(linha.prazo));
  return data;
};

//
const filtrarDadosColuna = (data, filterObj, atributo, tipoFiltro) => {
  if (!filterObj.select) return data;

  return data.filter((linha) => {
    const { estrutura } = linha;
    let targetValue = linha[atributo];
    if (!filterObj.min && !filterObj.max && atributo !== "codigos") return true;

    if ("montagem" === atributo) targetValue = estrutura.max;
    else if ("desmontagem" === atributo) targetValue = estrutura.min;
    else if (atributo === "codigos") {
      const { components } = estrutura;
      const opcao1 = components[0].stock;
      const opcao2 = components[1].stock;
      targetValue = { opcao1, opcao2 };
    }

    return filtrarLinha(targetValue, filterObj, tipoFiltro);
  });
};

const filtrarLinha = (targetValue, filterObj, tipoFiltro) => {
  if (tipoFiltro === "numero")
    return comparadorNumero(
      targetValue,
      filterObj.min,
      filterObj.max,
      filterObj.select,
    );
  else if (tipoFiltro === "numeroTexto")
    return filtragemNumeroTexto(targetValue, filterObj);
};

const comparadorNumero = (targetValue, min, max, select) => {
  const minNumber = min;
  const maxNumber = max;

  switch (select) {
    case "><":
      if (minNumber && maxNumber)
        return targetValue >= minNumber && targetValue <= maxNumber;
      break;
    case "<>":
      if (minNumber && maxNumber)
        return !(targetValue >= minNumber && targetValue <= maxNumber);
      break;
    case "<":
      if (minNumber) return targetValue < Number(minNumber);
      break;
    case ">":
      if (minNumber) return targetValue > Number(minNumber);
      break;
    case "=":
      if (minNumber) {
        return targetValue === Number(minNumber);
      }
      break;
    default:
      return true;
  }
  return true;
};

const comparadorTexto = (targetValue, texto) => {
  return targetValue.toLocaleLowerCase().includes(texto.toLocaleLowerCase());
};

// Chama as funções de filtrar numero e filtrar texto juntas e faz a operação logica final
const filtragemNumeroTexto = (targetValue, filterObj) => {
  // Objeto que contem strike e codigo
  const strike1Min = filterObj.min;
  const strike1Max = filterObj.max;
  const strike2Min = filterObj.min2;
  const strike2Max = filterObj.max2;
  const codigo1 = filterObj.codigo1;
  const codigo2 = filterObj.codigo2;
  const select = filterObj.select;
  const select2 = filterObj.select2;

  // Targets
  const targetSymbol1 = targetValue.opcao1.symbol;
  const targetStrike1 = targetValue.opcao1.strike;
  const targetSymbol2 = targetValue.opcao2.symbol;
  const targetStrike2 = targetValue.opcao2.strike;

  const condicaoStrike1 = comparadorNumero(
    targetStrike1,
    strike1Min,
    strike1Max,
    select,
  );
  const condicaoStrike2 = comparadorNumero(
    targetStrike2,
    strike2Min,
    strike2Max,
    select2,
  );
  const condicaoCodigo1 = comparadorTexto(targetSymbol1, codigo1);
  const condicaoCodigo2 = comparadorTexto(targetSymbol2, codigo2);

  return (
    condicaoStrike1 && condicaoStrike2 && condicaoCodigo1 && condicaoCodigo2
  );
};
