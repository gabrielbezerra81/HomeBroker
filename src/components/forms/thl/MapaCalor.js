import React from "react";
import { Radio } from "antd";
import termometro from "img/termometro.svg";
import { useSelectorStorePrincipal } from "components/redux/StoreCreation";

export default ({ props }) => {
  const state = useSelectorStorePrincipal((state) => state.THLReducer);

  return (
    <div className="containerMapaCalor">
      {state.seletorMapaCalor !== "semcor" && state.faixasMapaCalor ? (
        <div className="faixasTemperatura">
          <div>{props.faixasMapaCalor[3]}</div>
          <div>{props.faixasMapaCalor[2]}</div>
          <div>{props.faixasMapaCalor[1]}</div>
        </div>
      ) : null}
      {state.seletorMapaCalor !== "semcor" && state.faixasMapaCalor ? (
        <div className="labelMinMax">{props.faixasMapaCalor[4]}</div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <img src={termometro} alt="Mapa de calor"></img>
      {state.seletorMapaCalor !== "semcor" && state.faixasMapaCalor ? (
        <div className="labelMinMax">{props.faixasMapaCalor[0]}</div>
      ) : (
        <div className="divMapaSemCor"></div>
      )}
      <Radio.Group
        className="radioMapaCalor"
        size="small"
        value={state.seletorMapaCalor}
        onChange={(e) =>
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
  lineHeight: "25px",
};
