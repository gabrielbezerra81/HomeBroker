import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "../../img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "../../img/up-arrow.svg";
import Clock from "./Clock";
import { formatarNumDecimal } from "components/utils/Formatacoes";

export const BodyHeaderCompleto = ({ props }) => {
  if (props.dadosPesquisa) {
    let { dadosPesquisa } = props;
    if (dadosPesquisa.market === "tipo1") {
      return (
        <Row className="rowBodyHeader">
          <Col md={3} className="colAtivo1BodyHeader">
            <h5>{props.dadosPesquisa.resultadoAtivo}</h5>
          </Col>
          <Col md={2} className="colAtivo2BodyHeader">
            <h5>{props.dadosPesquisa.codigoEspecificacao}</h5>
          </Col>
          <Col md={1} className="colValorBodyHeader">
            <h5>{formatarNumDecimal(props.dadosPesquisa.cotacaoAtual)}</h5>
          </Col>
          <Col md={1} className="colIconeSetaBodyHeader">
            {renderSeta(props.dadosPesquisa.porcentagem)}
          </Col>

          {renderValorPorcentagem(props.dadosPesquisa.porcentagem)}

          <Col md={2} className="colDataBodyHeader">
            <span className="dataBodyHeader">
              {props.dadosPesquisa.ultimoHorario}
            </span>
          </Col>
        </Row>
      );
    } else if (dadosPesquisa.market === "tipo2") {
      return (
        <Row className="rowBodyHeader">
          <div className="colAtivo1BodyHeader">
            <h5>{props.dadosPesquisa.resultadoAtivo}</h5>
          </div>
          <div className="colAtivo2BodyHeader">
            <h5>{props.dadosPesquisa.strike}</h5>
          </div>
          <div className="colAtivo2BodyHeader">
            <h5>{props.dadosPesquisa.tipo}</h5>
          </div>
          <div className="colAtivo2BodyHeader">
            <h5>{props.dadosPesquisa.model}</h5>
          </div>
          <div className="colAtivo2BodyHeader">
            <h5>{props.dadosPesquisa.endBusiness}</h5>
          </div>
          <div className="colValorBodyHeader">
            <h5>{formatarNumDecimal(props.dadosPesquisa.cotacaoAtual)}</h5>
          </div>

          {renderSeta(props.dadosPesquisa.porcentagem)}

          <div className="colPorcentagemBodyHeader">
            {renderValorPorcentagem(props.dadosPesquisa.porcentagem)}
          </div>
          <div className="colDataBodyHeader">
            <span className="dataBodyHeader">
              {props.dadosPesquisa.ultimoHorario}
            </span>
          </div>
        </Row>
      );
    } else return null;
  } else return null;
};

export const BodyHeaderAtivo = ({ props }) => {
  if (props.dadosPesquisa) {
    return (
      <Row className="rowBodyHeaderCompraStartMovel">
        <Col md={2} className="colAtivo1BodyHeader">
          <h5>{props.dadosPesquisa.resultadoAtivo}</h5>
        </Col>
        <Col md={2} className="colAtivo2BodyHeader">
          <h5>{props.dadosPesquisa.codigoEspecificacao}</h5>
        </Col>
      </Row>
    );
  } else return null;
};

const renderSeta = valor => {
  let seta;

  if (valor > 0) seta = <ArrowUp fill="#138342" className="iconeSeta" />;
  else if (valor < 0) seta = <ArrowDown fill="red" className="iconeSeta" />;
  else return null;

  return (
    <Col md={1} className="colIconeSetaBodyHeader">
      {seta}
    </Col>
  );
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    return <h5 className="porcentagemPositiva">+{porcentagem}%</h5>;
  } else if (porcentagem < 0) {
    return <h5 className="porcentagemNegativa">{porcentagem}%</h5>;
  } else return <h5>+{porcentagem}%</h5>;
};
