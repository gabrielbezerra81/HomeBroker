import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import imgModeloEU from "img/modeloEU.png";
import imgModeloUSA from "img/modeloUSA.png";
import { formatarNumDecimal } from "components/utils/Formatacoes";

class EmblemaRelatorio extends React.Component {
  render() {
    return (
      <div className="mcontent containerEmblema containerEmblemaRelatorio">
        <div className="itemListaCompleta">
          <Row>
            <div className="linhaOrganizadaEmblemaRelatorio bordaGrossaLinhaOrganizadaEmblema">
              <span>PN</span>
              <div
                className={`flexJustifyCenterAlignEnd ${ativoCompraVenda(
                  "venda"
                )}`}
              >
                <h6>PETR</h6>
                <h5>T275</h5>
                <span>+1k</span>
              </div>
              {renderModelo("EU")}
            </div>
          </Row>
          <Row>
            <div className="linhaOrganizadaEmblemaRelatorio pb-1 pt-1 bordaFinaLinhaOrganizadaEmblema">
              <span className="ml-4">PUT</span>
              <h5>27,52</h5>
              <span>AGO/2020</span>
            </div>
          </Row>
          <Row>
            <Col>
              <div className="linhaOrganizadaEmblemaRelatorio pt-1 spaceBetween">
                <div className="flexColumnTextCenter">
                  <span>Entrada</span>
                  <span>18/DEZ/18</span>
                </div>
                <div className="flexColumnTextCenter">
                  <span>Médio</span>
                  <span>0,14</span>
                </div>
                <div className="flexColumnTextCenter">
                  <span>Qtde</span>
                  <span>+1k</span>
                </div>
                <div className="flexColumnTextCenter">
                  <span>Total</span>
                  <span>2.600,00</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="rowHorarioEmblema">
            <Col className="text-align-right">
              <span>14:43h</span>
            </Col>
          </Row>
          <Row className="flexJustifyCenter pl-1 pr-1 ml-3">
            <Col md={0} className="flexAlignEnd mr-1">
              <span>Últ.</span>
            </Col>
            <Col md={0} className="text-align-center">
              <h3>{formatarNumDecimal(this.props.item.valorAcao)}</h3>
            </Col>
            <Col md={0} className="text-align-center flexAlignEnd pb-1 ml-1">
              <div className="divSetaPorcentagem">
                {renderSeta(this.props.item.porcentagem)}
                {renderValorPorcentagem(this.props.item.porcentagem)}
              </div>
            </Col>
          </Row>
          <Row className="mt-1">
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
            <Col md={6}></Col>
            <Col md={3}>{formatarNumDecimal(this.props.item.precoVenda)}</Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default EmblemaRelatorio;

const renderSeta = (valor) => {
  valor = Number(valor);
  if (valor >= 0)
    return <ArrowUp fill="#138342" className="iconeSeta setaEmblema mr-1" />;
  else return <ArrowDown fill="red" className="iconeSeta setaEmblema mr-1" />;
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

const renderModelo = (modelo) => {
  return (
    <div>
      {modelo === "EU" ? (
        <img src={imgModeloEU} alt="" className="imgModelo" />
      ) : (
        <img src={imgModeloUSA} alt="" className="imgModelo" />
      )}
    </div>
  );
};

const ativoCompraVenda = (tipo) => {
  if (tipo === "compra") return "ativoCompra";
  else return "ativoVenda";
};
