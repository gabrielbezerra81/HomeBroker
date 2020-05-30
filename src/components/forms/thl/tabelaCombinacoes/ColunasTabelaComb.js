import React, { useRef } from "react";
import { Row, Col } from "antd";
import { MDBIcon } from "mdbreact";
import BookTHL, { selecionarBooks } from "components/forms/thl/BookTHL";
import imgModeloEU from "img/modeloEU.png";
import ImgModeloUSA from "img/imgModeloUSA3.svg";
import InputsFiltroTabela from "components/forms/thl/tabelaCombinacoes/FiltroTabela";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "components/utils/Formatacoes";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import { buscarNumeroArray } from "components/utils/FuncoesBusca";

export const ColunaHeader = ({ children, column }) => {
  const dispatch = DispatchStorePrincipal();
  const { ordenacao } = StateStorePrincipal("thl");
  let elementoColuna;
  let classNameColunaAcaoUlt = "";
  let tipoFiltro = "";
  const { key } = column;
  const iconeOrdenacao = renderIconeOrdenacao(key, ordenacao);

  const onClick = useRef((key, ordenacao, strike = "") => {
    const novaKey = key + strike;
    const novaOrdenacao = { key: novaKey, valor: ordenacao.valor + 1 };
    if (novaOrdenacao.valor > 2) novaOrdenacao.valor = 0;
    if (novaKey !== ordenacao.key) novaOrdenacao.valor = 1;
    dispatch(mudarVariavelTHLAction("ordenacao", novaOrdenacao));
  });

  if (["estrategia", "grupo", "acaoUlt"].includes(key)) {
    tipoFiltro = "texto";
  } else if (["spread", "montagem", "desmontagem"].includes(key)) {
    tipoFiltro = "numero";
  } else if ("codigos" === key) {
    tipoFiltro = "numeroTexto";
  } else if ("vencimento" === key) {
    tipoFiltro = "multiSelect";
  } else if ("prazo" === key) {
    tipoFiltro = "select";
  }

  if (key === "acaoUlt") {
    classNameColunaAcaoUlt = " colunaAcaoUlt";
    elementoColuna = (
      <div className="colunaDividida">
        <div>Acão</div>
        <div>Ult {iconeOrdenacao}</div>
      </div>
    );
  } else if (key === "codigos") {
    const subkey = ordenacao.key.split(" ")[1];
    elementoColuna = (
      <Row>
        <Col span={8}></Col>
        <Col
          span={8}
          className="divClicavel"
          onClick={() => onClick.current(key, ordenacao, " opcao1")}
          tabIndex={0}
        >
          Strike 1{subkey === "opcao1" ? iconeOrdenacao : null}
        </Col>
        <Col
          span={8}
          className="divClicavel"
          onClick={() => onClick.current(key, ordenacao, " opcao2")}
          tabIndex={0}
        >
          Strike 2{subkey === "opcao2" ? iconeOrdenacao : null}
        </Col>
      </Row>
    );
  } else {
    elementoColuna = column.title;
  }

  const propsDivTituloColuna = {};
  if (key !== "codigos") {
    propsDivTituloColuna.tabIndex = 0;
    propsDivTituloColuna.onClick = () => onClick.current(key, ordenacao);
    propsDivTituloColuna.className = "divClicavel tituloColuna";
  }

  return (
    <div
      style={{ width: `${column.width}px`, flexGrow: `${column.width}` }}
      className={`th${classNameColunaAcaoUlt}`}
    >
      <div className="divLabelColuna">
        <div className="tituloColuna" {...propsDivTituloColuna}>
          {elementoColuna}
          {!["acaoUlt", "codigos"].includes(key) ? iconeOrdenacao : null}
        </div>

        <div className="containerInputFiltro">
          <InputsFiltroTabela
            tipoFiltro={tipoFiltro}
            coluna={column}
          ></InputsFiltroTabela>
        </div>
      </div>
    </div>
  );
};

export const ColunaTextoComum = (props) => {
  const { children } = props;
  const key = props.column.key;
  let texto = children;
  const classeTextoRoxo = ["vencimento", "prazo"].includes(key)
    ? ""
    : "roxoTextoTHL";

  if (key === "spread") texto = `R$ ${formatarNumDecimal(children)}`;
  if (key === "vencimento") texto = texto.split(" ")[0];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
      className={classeTextoRoxo}
    >
      {texto}
    </div>
  );
};

export const ColunaAcaoUlt = ({ children, row, column }) => {
  const reduxState = StateStorePrincipal("thl");
  const { arrayCotacoes } = reduxState;
  const acao = children.acao;

  const cotacao = buscarNumeroArray(arrayCotacoes, acao, "codigo", "cotacao");

  return (
    <div className="colunaAcaoUlt">
      <div className="colunaDividida roxoTextoTHL">
        <div>{acao}</div>
        <div>{cotacao ? cotacao : ""}</div>
      </div>
    </div>
  );
};

export const ColunaCodigos = ({ children, row, column }) => {
  const { opcao1, opcao2 } = children;
  const style = { justifyContent: "center" };

  return (
    <Row type="flex" align="middle" style={{ height: "100%" }}>
      <Col span={8}>
        <div className="roxoTextoTHL">
          {row.acaoUlt.acao.slice(0, row.acaoUlt.acao.length - 1)}
        </div>
        <div>Strike</div>
      </Col>
      <Col span={8} offset={0}>
        <div className="flexAlignEnd codigoColunaModelo" style={style}>
          <div className="roxoTextoTHL">{opcao1.symbol.slice(4)}</div>
          {renderModelo(opcao1.model)}
        </div>
        <div>{formatarNumDecimal(opcao1.strike)}</div>
      </Col>
      <Col span={8} offset={0}>
        <div className="flexAlignEnd  codigoColunaModelo" style={style}>
          <div className="roxoTextoTHL">{opcao2.symbol.slice(4)}</div>
          {renderModelo(opcao2.model)}
        </div>
        <div>{formatarNumDecimal(opcao2.strike)}</div>
      </Col>
    </Row>
  );
};

export const ColunaMontagem = ({ children, row, column }) => {
  const { opcao1, opcao2 } = row.codigos;

  const dispatch = DispatchStorePrincipal();
  const reduxState = StateStorePrincipal("thl");
  const { booksSelecionados } = reduxState;

  const preco = children;
  const book1 = {},
    book2 = {};

  book1.ativo = opcao1.symbol;
  book2.ativo = opcao2.symbol;

  if (column.key === "montagem") {
    book1.tipo = "venda";
    book2.tipo = "compra";

    book1.preco = formatarNumDecimal(opcao1.compra);
    book1.qtde = formatarQuantidadeKMG(opcao1.compraQtde);

    book2.preco = formatarNumDecimal(opcao2.venda);
    book2.qtde = formatarQuantidadeKMG(opcao2.vendaQtde);
  } else {
    book1.tipo = "compra";
    book2.tipo = "venda";

    book1.preco = formatarNumDecimal(opcao1.venda);
    book1.qtde = formatarQuantidadeKMG(opcao1.vendaQtde);

    book2.preco = formatarNumDecimal(opcao2.compra);
    book2.qtde = formatarQuantidadeKMG(opcao2.compraQtde);
  }

  return (
    <>
      <div
        tabIndex={0}
        className="divClicavel precoMontagem"
        onClick={(e) => {
          e.stopPropagation();
          selecionarBooks({
            booksSelecionados,
            novosBooks: [book1, book2],
            dispatch,
          });
        }}
      >
        R$ {formatarNumDecimal(preco)}
      </div>
      <div className="roxoTextoTHL bookAtivoTHL bookCombinacoes">
        <BookTHL
          preco={book1.preco}
          qtde={book1.qtde}
          tipo={book1.tipo}
          ativo={book1.ativo}
        />
        <BookTHL
          preco={book2.preco}
          qtde={book2.qtde}
          tipo={book2.tipo}
          ativo={book2.ativo}
        />
      </div>
    </>
  );
};

const renderModelo = (modelo) => {
  return (
    <div style={{ marginBottom: "1px" }}>
      {modelo === "EUROPEAN" ? (
        <img src={imgModeloEU} alt="" className="imgModeloTHL" />
      ) : (
        <img
          src={ImgModeloUSA}
          alt=""
          className="imgModeloTHL"
          style={{ marginLeft: "2px", height: "14px" }}
        />
      )}
    </div>
  );
};

const renderIconeOrdenacao = (key, ordenacao) => {
  if (key === ordenacao.key.split(" ")[0]) {
    if (ordenacao.valor === 1) {
      return <MDBIcon className="iconeOrdenacao" icon="long-arrow-alt-up" />;
    } else if (ordenacao.valor === 2) {
      return <MDBIcon className="iconeOrdenacao" icon="long-arrow-alt-down" />;
    }
  }
  return null;
};
