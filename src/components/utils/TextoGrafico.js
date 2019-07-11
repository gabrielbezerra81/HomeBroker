import React from "react";

export const LabelInputGrafico = (texto, id) => (
  <div className="wrapperIconeConfiguracaoGrafico" id={id}>
    <h6 className="LabelInputGrafico">{texto}</h6>
  </div>
);

export const TextoCotacaoAtualGrafico = (texto, id) => (
  <div className="wrapperIconeConfiguracaoGrafico" id={id}>
    <h6 className="">{texto}</h6>
  </div>
);

export const TextoGainStopGrafico = (texto, id) => (
  <div className="wrapperIconeConfiguracaoGrafico" id={id}>
    <h6 className="">{texto}</h6>
  </div>
);

export const TextoValorTotalGrafico = (valor, id) => (
  <div className="wrapperValorTotalGrafico" id={id}>
    <h6 className="textoValorGrafico">VALOR TOTAL</h6>
    <h6 className="textoValorGrafico">{valor}</h6>
  </div>
);
