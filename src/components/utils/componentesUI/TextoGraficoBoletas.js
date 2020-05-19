import React from "react";

export const LabelInputGrafico = (texto, className) => (
  <div className={`wrapperTextoGrafico ${className}`}>
    <h6 className="LabelInputGrafico">{texto}</h6>
  </div>
);

export const TextoGainStopGrafico = (texto, className) => (
  <div className={`wrapperTextoGrafico ${className}`}>
    <h6 className="">{texto}</h6>
  </div>
);

export const TextoValorTotalGrafico = (texto, valor, className) => (
  <div className={`wrapperValorTotalGrafico ${className}`}>
    <h6 className="textoValorGrafico">{valor}</h6>
  </div>
);

export const TextoCotacaoAtualGrafico = (className) => (
  <div className={`wrapperTextoCotacaoAtualGrafico ${className}`}>
    <h6 className="TextoCotacaoAtualGrafico">Cotação Atual</h6>
  </div>
);

export const TextoMenorGrafico = (texto, className) => (
  <div className={`wrapperTextoGrafico ${className}`}>
    <h6 className="TextoMenorGrafico">{texto}</h6>
  </div>
);
