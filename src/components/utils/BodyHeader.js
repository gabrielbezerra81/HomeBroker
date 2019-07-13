import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "../../img/up-arrow.svg";
import { ReactComponent as ArrowUp } from "../../img/up-arrow.svg";
import Clock from "./Clock";

export const BodyHeaderCompleto = ({ props }) => (
  <Row className="rowBodyHeader">
    <Col md={3} className="colAtivo1BodyHeader">
      <h5>PETR4, PETROBRAS</h5>
    </Col>
    <Col md={2} className="colAtivo2BodyHeader">
      <h5>PN N2</h5>
    </Col>
    <Col md={1} className="colValorBodyHeader">
      <h5>4,17</h5>
    </Col>
    <Col md={1} className="colIconeSetaBodyHeader">
      {renderSeta(props.porcentagem)}
    </Col>
    <Col md={1} className="colPorcentagemBodyHeader">
      {renderValorPorcentagem(props.porcentagem)}
    </Col>
    <Col md={2} className="colDataBodyHeader">
      <span className="dataBodyHeader">{Clock()}</span>
    </Col>
  </Row>
);

export const BodyHeaderAtivo = ({ props }) => (
  <Row className="rowBodyHeader">
    <Col md={3} className="colAtivo1BodyHeader">
      <h5>PETR4, PETROBRAS</h5>
    </Col>
    <Col md={2} className="colAtivo2BodyHeader">
      <h5>PN N2</h5>
    </Col>
  </Row>
);

const renderSeta = valor => {
  if (valor >= 0) return <ArrowUp fill="green" className="iconeSeta" />;
  else return <ArrowDown fill="red" className="iconeSeta" />;
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    return <h5 className="porcentagemPositiva">+{porcentagem}%</h5>;
  } else if (porcentagem < 0) {
    return <h5 className="porcentagemNegativa">{porcentagem}%</h5>;
  } else return <h5>+{porcentagem}%</h5>;
};
