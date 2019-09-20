import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { formatarNumDecimal } from "components/utils/Formatacoes";

class EmblemaSimples extends React.Component {
  render() {
    return (
      <div className="itemListaCompleta">
        <Row>
          <Col>COMPRA</Col>
          <Col md={0}>Médio</Col>
          <Col className="text-align-right">VENDA</Col>
        </Row>
        <div className="containerSliderTopo">
          <div className="sliderTopo"></div>
          <div className="meioSliderTopo"></div>
          <div className="sliderTopo"></div>
        </div>
        <Row>
          <Col md={3}>{formatarNumDecimal(this.props.item.precoCompra)}</Col>
          <Col md={5}></Col>
          <Col md={4} className="text-align-right">
            {formatarNumDecimal(this.props.item.precoVenda)}
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-align-center">
            <h3>{formatarNumDecimal(this.props.item.valorAcao)}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-align-center">
            <div className="divSetaPorcentagem">
              {renderSeta(this.props.item.porcentagem)}
              {renderValorPorcentagem(this.props.item.porcentagem)}
            </div>
          </Col>
        </Row>
        <div className="divSetaPorcentagem">
          <Col md={0}>
            STOP<br></br>
            {formatarNumDecimal(this.props.item.stop)}
          </Col>
          <Col md={8}>
            <div>
              <input
                type="range"
                className={`custom-range ${corInputRange(
                  this.props.item.porcentagem
                )} inputRange`}
                min={this.props.item.stop}
                max={this.props.item.gain}
                value={(this.props.item.stop + this.props.item.gain) / 2}
                step={0.01}
                //value={item.valorAcao}
              />
            </div>
          </Col>
          <Col md={0}>
            GAIN<br></br>
            {formatarNumDecimal(this.props.item.gain)}
          </Col>
        </div>
      </div>
    );
  }
}

export default EmblemaSimples;

const renderSeta = valor => {
  valor = Number(valor);
  if (valor >= 0)
    return <ArrowUp fill="#138342" className="iconeSeta setaEmblema mr-1" />;
  else return <ArrowDown fill="red" className="iconeSeta setaEmblema mr-1" />;
};

const corInputRange = porcentagem => {
  if (porcentagem >= 0) return "rangePositivo";
  else return "rangeNegativo";
};

const renderValorPorcentagem = porcentagem => {
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
