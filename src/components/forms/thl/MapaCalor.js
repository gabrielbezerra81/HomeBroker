import React from "react";
import { useSelector } from "react-redux";
import { Radio } from "antd";
import termometro from "img/termometro.svg";

export default ({ props }) => {
  const state = useSelector(state => state.THLReducer);

  return (
    <div className="containerMapaCalor">
      {state.seletorMapaCalor !== "semcor" && state.faixasMapaCalor ? (
        <div>
          <div id="faixa4MapaCalor">{props.faixasMapaCalor[3]}</div>
          <div id="faixa3MapaCalor">{props.faixasMapaCalor[2]}</div>
          <div id="faixa2MapaCalor">{props.faixasMapaCalor[1]}</div>
        </div>
      ) : null}
      {state.seletorMapaCalor !== "semcor" ? (
        <div className="labelMinMax">{45}</div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <img src={termometro} alt="Mapa de calor"></img>
      {state.seletorMapaCalor !== "semcor" ? (
        <div className="labelMinMax">{35}</div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <Radio.Group
        className="radioMapaCalor"
        size="small"
        value={state.seletorMapaCalor}
        onChange={e =>
          props.mudarVariavelTHLAction("seletorMapaCalor", e.target.value)
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
};

const radioStyle = {
  display: "block",
  height: "25px",
  lineHeight: "25px"
};
