import React from "react";

export const LabelInputGrafico = (texto, id) => (
  <div className="wrapperIconeConfiguracaoGrafico" id={id}>
    <h6 className="LabelInputGrafico">{texto}</h6>
  </div>
);

export const TextoGainStopGrafico = (texto, id) => (
  <div className="wrapperIconeConfiguracaoGrafico" id={id}>
    <h6 className="">{texto}</h6>
  </div>
);

export const TextoValorTotalGrafico = (texto, valor, id) => (
  <div className="wrapperValorTotalGrafico" id={id}>
    <h6 className="textoValorGrafico">{texto}</h6>
    <h6 className="textoValorGrafico">{valor}</h6>
  </div>
);

export const TextoCotacaoAtualGrafico = id => (
  <div className="wrapperTextoCotacaoAtualGrafico" id={id}>
    <h6 className="TextoCotacaoAtualGrafico">Cotação Atual</h6>
  </div>
);

export const TextoMenorGrafico = (texto, id) => (
  <div className="wrapperIconeConfiguracaoGrafico" id={id}>
    <h6 className="TextoMenorGrafico">{texto}</h6>
  </div>
);
