import React from "react";
import { connect } from "react-redux";
import { FormControl } from "react-bootstrap";
import { Select } from "antd";
import { createFilter, useFilter } from "window-table";
import _ from "lodash";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import { useSelectorStorePrincipal } from "components/redux/StoreCreation";
import { StorePrincipalContext } from "components/redux/StoreCreation";

class InputsFiltroTabela extends React.Component {
  render() {
    let filtro = <div></div>;

    if (this.props.tipoFiltro === "numero") filtro = this.filtroNumero();
    else if (this.props.tipoFiltro === "numeroTexto")
      filtro = this.filtroNumeroTexto();
    else if (this.props.tipoFiltro === "texto") filtro = this.filtroTexto();
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
            ref="toInput"
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
            ref="fromInput"
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
            value={this.props[key].select}
            className="selectOperacaoFiltro"
            style={{ height: "20px !important" }}
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
    codigoLabel
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
            ref="toInput"
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
            ref="fromInput"
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
}

const opcoesInputSelect = (props) => {
  const key = props.coluna.key;
  const arrayOpcoes = [
    ...new Set(props.combinacoesTabela.map((linha) => linha[key])),
  ];

  return arrayOpcoes.map((opcao, indice) => (
    <option key={`${key}${indice}`} value={opcao}>
      {opcao}
    </option>
  ));
};

const mapStateToProps = (state) => ({
  combinacoesTabela: state.THLReducer.combinacoesTabela,
  estrategia: state.THLReducer.estrategia,
  grupo: state.THLReducer.grupo,
  acaoUlt: state.THLReducer.acaoUlt,
  spread: state.THLReducer.spread,
  codigos: state.THLReducer.codigos,
  montagem: state.THLReducer.montagem,
  desmontagem: state.THLReducer.desmontagem,
  vencimento: state.THLReducer.vencimento,
  prazo: state.THLReducer.prazo,
});

export default connect(mapStateToProps, { mudarVariavelTHLAction }, null, {
  context: StorePrincipalContext,
})(InputsFiltroTabela);

// função principal que retorna a tabela filtrada
export const FiltrarTabela = () => {
  const reduxState = useSelectorStorePrincipal((state) => {
    return state.THLReducer;
  });
  const { combinacoesTabela } = reduxState;

  const filteredData = useFilter(
    filtroEstrategia,
    combinacoesTabela,
    reduxState.estrategia
  );
  const filteredData2 = useFilter(
    filtroGrupo,
    combinacoesTabela,
    reduxState.grupo
  );
  const filteredData3 = useFilter(
    filtroAcaoUlt,
    combinacoesTabela,
    reduxState.acaoUlt
  );
  const filteredData4 = filtroSpread(combinacoesTabela, reduxState.spread);
  const filteredData5 = filtroCodigos(combinacoesTabela, reduxState.codigos);
  const filteredData6 = filtroMontagem(
    combinacoesTabela,
    reduxState.montagem,
    "montagem"
  );
  const filteredData7 = filtroMontagem(
    combinacoesTabela,
    reduxState.desmontagem,
    "desmontagem"
  );

  const filteredData8 = useFilter(
    filtroVcto,
    combinacoesTabela,
    reduxState.vencimento
  );
  const filteredData9 = useFilter(
    filtroPrazo,
    combinacoesTabela,
    reduxState.prazo
  );

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
    "id"
  );
};

const filtroEstrategia = createFilter(["estrategia"]);
const filtroGrupo = createFilter(["grupo"]);
const filtroAcaoUlt = (data, filterText) => {
  return data.filter((linha) =>
    `${linha.acaoUlt.acao} ${linha.acaoUlt.ult}`
      .toLocaleLowerCase()
      .includes(filterText.toLocaleLowerCase())
  );
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
const filtroVcto = createFilter(["vencimento"]);
const filtroPrazo = createFilter(["prazo"]);

//
const filtrarDadosColuna = (data, filterObj, atributo, tipoFiltro) => {
  if (!filterObj.select) return data;

  return data.filter((linha) => {
    let targetValue = linha[atributo];
    if (!filterObj.min && !filterObj.max && atributo !== "codigos") return true;
    if (["montagem", "desmontagem"].includes(atributo)) {
      targetValue = linha[atributo].valor;
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
      filterObj.select
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
      if (minNumber) return targetValue === Number(minNumber);
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
  const targetSymbol1 = targetValue[0].symbol;
  const targetStrike1 = targetValue[0].strike;
  const targetSymbol2 = targetValue[1].symbol;
  const targetStrike2 = targetValue[1].strike;

  const condicaoStrike1 = comparadorNumero(
    targetStrike1,
    strike1Min,
    strike1Max,
    select
  );
  const condicaoStrike2 = comparadorNumero(
    targetStrike2,
    strike2Min,
    strike2Max,
    select2
  );
  const condicaoCodigo1 = comparadorTexto(targetSymbol1, codigo1);
  const condicaoCodigo2 = comparadorTexto(targetSymbol2, codigo2);

  return (
    condicaoStrike1 && condicaoStrike2 && condicaoCodigo1 && condicaoCodigo2
  );
};
