import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import imgModeloEU from "img/modeloEU.png";
import imgModeloUSA from "img/modeloUSA2.svg";

export const BodyHeaderCompleto = ({ dadosPesquisa }) => {
  if (dadosPesquisa) {
    if (dadosPesquisa.market === "tipo1") {
      return (
        <Row className="rowBodyHeader">
          <Col md={3} className="colAtivo1BodyHeader">
            <h5>{dadosPesquisa.resultadoAtivo}</h5>
          </Col>
          <Col md={2} className="colAtivo2BodyHeader">
            <h5>{dadosPesquisa.codigoEspecificacao}</h5>
          </Col>
          <Col md={1} className="colValorBodyHeader">
            <h5>{formatarNumDecimal(dadosPesquisa.cotacaoAtual)}</h5>
          </Col>

          {renderSeta(dadosPesquisa.porcentagem)}

          <Col className="colPorcentagemBodyHeader">
            {renderValorPorcentagem(dadosPesquisa.porcentagem)}
          </Col>
          <Col md={2} className="colDataBodyHeader">
            <h5 className="dataBodyHeader">{dadosPesquisa.ultimoHorario}</h5>
          </Col>
        </Row>
      );
    } else if (dadosPesquisa.market === "tipo2") {
      return (
        <Row className="rowBodyHeader">
          <Col md={0} className=" ml-3 mr-2">
            <h5>{dadosPesquisa.resultadoAtivo}</h5>
          </Col>
          <Col md={0} className="colStrikeVencimento mr-5">
            <h5>({dadosPesquisa.strike})</h5>
          </Col>
          <Col md={0}>
            <h5>{dadosPesquisa.tipo}</h5>
          </Col>
          <Col md={0} className="colModeloBodyHeader">
            {renderModelo(dadosPesquisa.model)}
          </Col>
          <Col md={0} className="colStrikeVencimento">
            <h5>({dadosPesquisa.vencimento})</h5>
          </Col>
          <Col className="colValorBodyHeader">
            <h5>{formatarNumDecimal(dadosPesquisa.cotacaoAtual)}</h5>
          </Col>

          {renderSeta(dadosPesquisa.porcentagem)}

          <Col className="colPorcentagemBodyHeader">
            {renderValorPorcentagem(dadosPesquisa.porcentagem)}
          </Col>
          <Col className="colDataBodyHeader">
            <h5 className="dataBodyHeader">{dadosPesquisa.ultimoHorario}</h5>
          </Col>
        </Row>
      );
    } else return null;
  } else return null;
};

export const BodyHeaderAtivo = ({ dadosPesquisa }) => {
  if (dadosPesquisa) {
    return (
      <Row className="rowBodyHeaderCompraStartMovel">
        <Col md={2} className="colAtivo1BodyHeader">
          <h5>{dadosPesquisa.resultadoAtivo}</h5>
        </Col>
        <Col md={2} className="colAtivo2BodyHeader">
          <h5>{dadosPesquisa.codigoEspecificacao}</h5>
        </Col>
      </Row>
    );
  } else return null;
};

const renderSeta = (valor) => {
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

const renderValorPorcentagem = (porcentagem) => {
  if (porcentagem > 0) {
    return <h5 className="porcentagemPositiva">+{porcentagem}%</h5>;
  } else if (porcentagem < 0) {
    return <h5 className="porcentagemNegativa">{porcentagem}%</h5>;
  } else return <h5>+{porcentagem}%</h5>;
};

const renderModelo = (modelo) => {
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
