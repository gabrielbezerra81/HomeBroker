import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { formatarNumDecimal } from "components/utils/Formatacoes";

export default React.memo(
  ({ item, precosEmblema, emblemaMaior, arrayPrecosID }) => {
    const precos = precosEmblema ? precosEmblema : item;

    return (
      <div className={emblemaMaior ? "" : "itemListaCompleta"}>
        <Row>
          <Col>Min</Col>
          <Col md={"0"}>Médio</Col>
          <Col className="text-align-right">Max</Col>
        </Row>
        <div className="containerSliderTopo">
          <div className="sliderTopo"></div>
          <div className="meioSliderTopo"></div>
          <div className="sliderTopo"></div>
        </div>
        <Row>
          <Col md={3}>{formatarNumDecimal(precos.precoCompra)}</Col>
          <Col md={5}></Col>
          <Col md={4} className="text-align-right">
            {formatarNumDecimal(precos.precoVenda)}
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-align-center">
            <h3>{formatarNumDecimal(precos.cotacaoAtual)}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-align-center">
            <div className="divSetaPorcentagem">
              {renderSeta(item.oscilacao)}
              {renderValorPorcentagem(item.oscilacao)}
            </div>
          </Col>
        </Row>
        <div className="divSetaPorcentagem">
          <Col md={"0"}>
            STOP<br></br>
            {formatarNumDecimal(item.stopLoss)}
          </Col>
          <Col md={8}>
            <div>
              <input
                type="range"
                className={`custom-range ${corInputRange(
                  item.oscilacao
                )} inputRange`}
                min={item.stopLoss}
                max={item.stopGain}
                value={(item.stopLoss + item.stopGain) / 2}
                step={0.01}
                onChange={() => false}
                //value={item.valorAcao}
              />
            </div>
          </Col>
          <Col md={"0"}>
            GAIN<br></br>
            {formatarNumDecimal(item.stopGain)}
          </Col>
        </div>
      </div>
    );
  }
);

const renderSeta = (valor) => {
  valor = Number(valor);
  if (valor >= 0)
    return <ArrowUp fill="#138342" className="iconeSeta setaEmblema mr-1" />;
  else return <ArrowDown fill="red" className="iconeSeta setaEmblema mr-1" />;
};

const corInputRange = (porcentagem) => {
  if (porcentagem >= 0) return "rangePositivo";
  else return "rangeNegativo";
};

const renderValorPorcentagem = (porcentagem) => {
  if (porcentagem > 0) {
    porcentagem = formatarNumDecimal(porcentagem);
    return <span className="porcentagemPositiva">+{porcentagem}%</span>;
  } else if (porcentagem < 0) {
    porcentagem = formatarNumDecimal(porcentagem);
    return <span className="porcentagemNegativa">{porcentagem}%</span>;
  } else {
    porcentagem = formatarNumDecimal(porcentagem);

    return <span>+{porcentagem}%</span>;
  }
};
