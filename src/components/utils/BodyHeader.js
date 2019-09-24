import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import Clock from "./Clock";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import imgModeloEU from "img/modeloEU.png";
import imgModeloUSA from "img/modeloUSA2.svg";

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

          {renderSeta(props.dadosPesquisa.porcentagem)}

          <Col className="colPorcentagemBodyHeader">
            {renderValorPorcentagem(props.dadosPesquisa.porcentagem)}
          </Col>
          <Col md={2} className="colDataBodyHeader">
            <h5 className="dataBodyHeader">
              {props.dadosPesquisa.ultimoHorario}
            </h5>
          </Col>
        </Row>
      );
    } else if (dadosPesquisa.market === "tipo2") {
      return (
        <Row className="rowBodyHeader">
          <Col md={0} className=" ml-3 mr-2">
            <h5>{props.dadosPesquisa.resultadoAtivo}</h5>
          </Col>
          <Col md={0} className="colStrikeVencimento mr-5">
            <h5>({props.dadosPesquisa.strike})</h5>
          </Col>
          <Col md={0}>
            <h5>{props.dadosPesquisa.tipo}</h5>
          </Col>
          <Col md={0} className="colModeloBodyHeader">
            {renderModelo(props.dadosPesquisa.model)}
          </Col>
          <Col md={0} className="colStrikeVencimento">
            <h5>({props.dadosPesquisa.vencimento})</h5>
          </Col>
          <Col className="colValorBodyHeader">
            <h5>{formatarNumDecimal(props.dadosPesquisa.cotacaoAtual)}</h5>
          </Col>

          {renderSeta(props.dadosPesquisa.porcentagem)}

          <Col className="colPorcentagemBodyHeader">
            {renderValorPorcentagem(props.dadosPesquisa.porcentagem)}
          </Col>
          <Col className="colDataBodyHeader">
            <h5 className="dataBodyHeader">
              {props.dadosPesquisa.ultimoHorario}
            </h5>
          </Col>
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

const renderModelo = modelo => {
  return (
    <div>
      {modelo === "EUROPEAN" ? (
        <img src={imgModeloEU} alt="" className="imgModelo" />
      ) : (
        <img src={imgModeloUSA} alt="" className="imgModelo" />
      )}
    </div>
  );
};
