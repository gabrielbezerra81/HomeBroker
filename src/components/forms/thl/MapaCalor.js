import React, { useEffect } from "react";
import { Radio } from "antd";
import termometro from "img/termometro.svg";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";

export default React.memo(() => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const { seletorMapaCalor, faixasMapaCalor } = reduxState;

  useEffect(() => {
    let faixasMapa = null;
    if (seletorMapaCalor === "montar")
      faixasMapa = calculaMapaCalor(valoresMapaMontar);
    else if (seletorMapaCalor === "desmontar")
      faixasMapa = calculaMapaCalor(valoresMapaDesmontar);
    dispatch(mudarVariavelTHLAction("faixasMapaCalor", faixasMapa));
  }, [seletorMapaCalor, dispatch]);

  return (
    <div className="containerMapaCalor">
      {seletorMapaCalor !== "semcor" && faixasMapaCalor ? (
        <div className="faixasTemperatura">
          <div>{faixasMapaCalor[3]}</div>
          <div>{faixasMapaCalor[2]}</div>
          <div>{faixasMapaCalor[1]}</div>
        </div>
      ) : null}
      {seletorMapaCalor !== "semcor" && faixasMapaCalor ? (
        <div className="labelMinMax">{faixasMapaCalor[4]}</div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <img src={termometro} alt="Mapa de calor"></img>
      {seletorMapaCalor !== "semcor" && faixasMapaCalor ? (
        <div className="labelMinMax">{faixasMapaCalor[0]}</div>
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

  let valores = arrayValores.sort();
  faixas[0] = valores[0] + ""; // faixa 1 32
  faixas[4] = valores[valores.length - 1] + ""; // faixa 5 40
  valores = valores.map((valor) => {
    if (valor < 1) return valor * 100;
    return valor;
  });

  let intervalo = valores[valores.length - 1] - 1 - (valores[0] + 1) + 1; // intervalo de 7
  intervalo = intervalo / 3; // 2.33 -> inteiro 2
  faixas[1] = `${(valores[0] + 1) / 100}-${
    (valores[0] + // faixa 2 de 33 a 34
      Math.floor(intervalo)) /
    100
  }`;
  faixas[3] = `${
    (valores[valores.length - 1] - Math.floor(intervalo)) / // faixa 4 38 a 39
    100
  }-${(valores[valores.length - 1] - 1) / 100}`;

  if ((intervalo * 3) % 3 === 0) intervalo += 1;
  faixas[2] = `${(valores[0] + Math.ceil(intervalo)) / 100}-${
    (valores[valores.length - 1] - // faixa 3 de 35 a 37
      Math.ceil(intervalo)) /
    100
  }`;

  return faixas;
};

const valoresMapaMontar = [0.4, 0.32];

const valoresMapaDesmontar = [0.36, 0.32];
