/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { Radio } from "antd";
import termometro from "assets/termometro.svg";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { mudarVariavelTHLAction } from "redux/actions/thl/THLActions";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export default React.memo(() => {
  const reduxState = useStateStorePrincipal("thl");
  const dispatch = useDispatchStorePrincipal();
  const {
    seletorMapaCalor,
    faixasMapaCalor,
    precosTabelaVencimentos,
    precosTabelaVencimentosID,
  } = reduxState;
  const { min, max } = useMemo(
    () => calcularPrecosMinMaxMapa(precosTabelaVencimentos, seletorMapaCalor),
    [precosTabelaVencimentosID, seletorMapaCalor]
  );

  useEffect(() => {
    if (seletorMapaCalor !== "semcor") {
      dispatch(mudarVariavelTHLAction("precoMin", min));
      dispatch(mudarVariavelTHLAction("precoMax", max));

      let faixasMapa = null;
      if (min || max) {
        faixasMapa = calculaMapaCalor([min, max]);
        dispatch(mudarVariavelTHLAction("faixasMapaCalor", faixasMapa));
      }
    }
  }, [min, max, seletorMapaCalor]);

  return (
    <div className="containerMapaCalor">
      {seletorMapaCalor !== "semcor" && faixasMapaCalor ? (
        <div className="faixasTemperatura">
          <div>{formatarNumDecimal(faixasMapaCalor[3].max)}</div>
          <div>{formatarNumDecimal(faixasMapaCalor[3].min)}</div>
          <div>{formatarNumDecimal(faixasMapaCalor[2].min)}</div>
          <div>{formatarNumDecimal(faixasMapaCalor[1].min)}</div>
        </div>
      ) : null}
      {seletorMapaCalor !== "semcor" && faixasMapaCalor ? (
        <div className="labelMinMax">
          {formatarNumDecimal(faixasMapaCalor[4].min)}
        </div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <img src={termometro} alt="Mapa de calor"></img>
      {seletorMapaCalor !== "semcor" && faixasMapaCalor ? (
        <div className="labelMinMax">
          {formatarNumDecimal(faixasMapaCalor[0].min)}
        </div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <Radio.Group
        className="radioMapaCalor"
        size="small"
        value={seletorMapaCalor}
        onChange={(e) =>
          dispatch(mudarVariavelTHLAction("seletorMapaCalor", e.target.value))
        }
      >
        <Radio style={radioStyle} value={"semcor"}>
          Sem cor
        </Radio>
        <Radio style={radioStyle} value={"montar"}>
          Montar
        </Radio>
        <Radio style={radioStyle} value={"desmontar"}>
          Desmontar
        </Radio>
      </Radio.Group>
    </div>
  );
});

const radioStyle = {
  display: "block",
  height: "25px",
  lineHeight: "25px",
};

// Se selecionar montar ou desmontar, pega um conjunto de valores e faz o calculo das faixas do termometro
// Calcula 5 faixas de valores
const calculaMapaCalor = (arrayValores) => {
  const faixas = [0, 0, 0, 0, 0];
  const nIntervalos = 3;

  let valores = arrayValores.sort();
  faixas[0] = {
    min: valores[0],
    max: valores[0],
  }; // faixa 1 32
  faixas[4] = {
    min: valores[valores.length - 1],
    max: valores[valores.length - 1],
  }; // faixa 5 40

  // 32  33-34  35-37  38-39  40
  let intervalo =
    valores[valores.length - 1] - 0.001 - (valores[0] + 0.001) + 0.001; // intervalo de 7

  intervalo = intervalo / nIntervalos; // 2.33 -> inteiro 2
  // faixa 2 de 33 a 34
  faixas[1] = {
    min: valores[0] + 0.001,
    max: valores[0] + intervalo - 0.001,
  };
  // faixa 4 38 a 39
  faixas[3] = {
    min: valores[valores.length - 1] - intervalo + 0.001,
    max: valores[valores.length - 1] - 0.001,
  };

  // faixa 3 de 35 a 37
  if ((intervalo * nIntervalos) % nIntervalos === 0) intervalo += 0.001;
  faixas[2] = {
    min: valores[0] + intervalo,
    max: valores[valores.length - 1] - intervalo,
  };

  return faixas;
};

const calcularPrecosMinMaxMapa = (listaPrecos, seletorMapaCalor) => {
  let precoMin = 0,
    precoMax = 0;
  if (listaPrecos.length) {
    const valorCalculo = seletorMapaCalor === "montar" ? "max" : "min";
    precoMin = Math.min(
      ...listaPrecos.map((estrutura) => estrutura[valorCalculo].toFixed(2))
    );
    precoMax = Math.max(
      ...listaPrecos.map((estrutura) => estrutura[valorCalculo].toFixed(2))
    );
  }
  return { min: precoMin, max: precoMax };
};

/*
const calculaMapaCalor = (arrayValores) => {
  const faixas = [0, 0, 0, 0, 0];
  const nIntervalos = 3;

  let valores = arrayValores.sort();
  faixas[0] = {
    min: formatarNumDecimal(valores[0]),
    max: formatarNumDecimal(valores[0]),
  }; // faixa 1 32
  faixas[4] = {
    min: formatarNumDecimal(valores[valores.length - 1]),
    max: formatarNumDecimal(valores[valores.length - 1]),
  }; // faixa 5 40
  valores = valores.map((valor) => {
    if (valor < 1) return valor * 100;
    return valor;
  });

  let intervalo = valores[valores.length - 1] - 1 - (valores[0] + 1) + 1; // intervalo de 7
  intervalo = intervalo / nIntervalos; // 2.33 -> inteiro 2
  // faixa 2 de 33 a 34
  faixas[1] = {
    min: formatarNumDecimal((valores[0] + 1) / 100),
    max: formatarNumDecimal((valores[0] + Math.floor(intervalo)) / 100),
  };
  // faixa 4 38 a 39
  faixas[3] = {
    min: formatarNumDecimal(
      (valores[valores.length - 1] - Math.floor(intervalo)) / 100
    ),
    max: formatarNumDecimal((valores[valores.length - 1] - 1) / 100),
  };

  // faixa 3 de 35 a 37
  if ((intervalo * nIntervalos) % nIntervalos === 0) intervalo += 1;
  faixas[2] = {
    min: formatarNumDecimal((valores[0] + Math.ceil(intervalo)) / 100),
    max: formatarNumDecimal(
      (valores[valores.length - 1] - Math.ceil(intervalo)) / 100
    ),
  };

  return faixas;
};
*/
