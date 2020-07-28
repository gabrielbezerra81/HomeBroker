import React from "react";
import { Row, Table, ProgressBar } from "react-bootstrap";
import DraggableModal from "components/utils/componentesUI/DraggableModal";
import { ModalHeaderSemBook } from "components/utils/componentesUI/FormHeader";
import { formatarDataDaAPI } from "components/utils/Formatacoes";
import { compose } from "redux";
import { connect } from "react-redux";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
import { mudarVariavelOrdensExecAction } from "redux/actions/ordensExecucao/OrdensExecActions";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import { abrirItemBarraLateralAction } from "redux/actions/telaPrincipal/TelaPrincipalActions";
import OpcoesOrdemExec from "components/popups/ordens_em_execucao/OpcoesOrdemExec";

class OrdensExecucao extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "ordens_execucao") {
      document.getElementById("ordens_execucao").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "ordens_execucao",
        this.props.zIndex,
        true
      );
    }
  }

  render() {
    return (
      <DraggableModal
        id="ordens_execucao"
        renderModalBody={() => modalBody(this.props)}
        renderDivFiltrarOrdens={true}
        renderHeader={() => (
          <ModalHeaderSemBook
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
          />
        )}
      />
    );
  }
}

const modalBody = (props) => (
  <div className="bodyOrdensExecucao">
    <Row>
      <Table
        variant="dark"
        bordered={false}
        borderless
        className="tableOrdensExecucao text-center"
        responsive="lg"
      >
        <thead>
          <tr>
            <th>Progresso</th>
            <th>Cadastro</th>
            <th>Corretora</th>
            <th>Conta</th>
            <th>Operação</th>
            <th>Modo Exec</th>
            <th>Ativo</th>
            <th>Oferta</th>
            <th>Qtde Oferta</th>
            <th>Qtde Executada</th>
            <th>Qtde Cancelada</th>
            <th>Preço Disparo</th>
            <th>Preço Envio</th>
            <th>Preço Limite</th>
            <th>Preço Executado</th>
            <th>Validade</th>
            <th>Roteador</th>
            <th>St</th>
            <th>Msg</th>
          </tr>
        </thead>
        <tbody className="verticalAlignColunaTabela">
          {props.tabelaOrdensExecucao.map((item, index) => {
            const ofertaPrincipal = renderOferta(
              item,
              index,
              props,
              "ofertaPrincipal"
            );
            const ordensNext = item.nextOrders.map((ordemNext, ind) =>
              renderOferta(ordemNext, "ON" + ind, props, "ordemNext")
            );

            return [ofertaPrincipal, ...ordensNext];
          })}
        </tbody>
      </Table>
      {props.tabelaOrdensExecucao.map((item, index) => {
        if (props.opcoesOrdemAberto && item.id === props.ordemAtual.id) {
          const linha = document.getElementById(item.id);

          if (linha) {
            const top = linha.offsetTop;
            return (
              // @ts-ignore
              <OpcoesOrdemExec
                style={{ top: `${top + 80}px` }}
                id="opcoes_ordens"
                key={`opcoes${item.id}`}
              />
            );
          }
        }
        return null;
      })}
    </Row>
  </div>
);

const retornaData = (dataString) => {
  return formatarDataDaAPI(dataString).toLocaleString();
};

const renderOferta = (item, index, props, tipo) => {
  let qtdeOferta = 0;
  let qtdeExecutada = 0;

  item.offers.forEach((oferta) => {
    qtdeOferta += oferta.qtdeOferta;
    qtdeExecutada += oferta.qtdeExecutada;
  });

  return (
    <tr
      id={item.id}
      key={item.id}
      className={classeOrdem(tipo, props, item)}
      onClick={
        tipo === "ofertaPrincipal"
          ? () => abrirOpcoesOrdem(props, item)
          : () => false
      }
    >
      <td>
        <ProgressBar
          animated
          variant="success"
          now={(qtdeExecutada / qtdeOferta) * 100}
          label={(qtdeExecutada / qtdeOferta) * 100 + "%"}
          className="barraProgresso"
        />
      </td>
      <td>
        <span>{retornaData(item.cadastro)}</span>
      </td>
      <td>{item.corretora}</td>
      <td>{item.conta}</td>
      <td>{item.operacao}</td>
      <td>{listarAtributoComposto(item.offers, "modoExec", "nao")}</td>
      <td>{listarAtributoComposto(item.offers, "ativo", "sim")}</td>
      <td>{listarAtributoComposto(item.offers, "oferta", "sim")}</td>
      <td>{listarAtributoComposto(item.offers, "qtdeOferta", "sim")}</td>
      <td>{listarAtributoComposto(item.offers, "qtdeExecutada", "sim")}</td>
      <td>{listarAtributoComposto(item.offers, "qtdeCancelada", "sim")}</td>

      <td>{listarAtributoComposto(item.offers, "precoDisparo", "sim")}</td>
      <td>
        {item.formName === "Multileg"
          ? item.offers[0].precoEnvio
          : listarAtributoComposto(item.offers, "precoEnvio", "sim")}
      </td>
      <td>{listarAtributoComposto(item.offers, "precoLimite", "sim")}</td>
      <td>{listarAtributoComposto(item.offers, "precoExecutado", "sim")}</td>
      <td>{retornaData(item.validade)}</td>
      <td>{item.roteador}</td>
      <td>{listarAtributoComposto(item.offers, "status", "nao")}</td>

      <td>{listarAtributoComposto(item.offers, "msg", "nao")}</td>
    </tr>
  );
};

const classeOfertaVenda = (oferta) => {
  if (oferta.oferta === "V") return "colunasOfertaVenda";
  return "";
};

const listarAtributoComposto = (listaOfertas, atributo, classeCor) => {
  return listaOfertas.map((oferta, index2) => {
    if (
      oferta.modoExec === "ajuste" &&
      ["qtdeOferta", "qtdeExecutada", "precoExecutado"].includes(atributo)
    )
      return null;

    return (
      <span
        key={index2 + atributo}
        className={classeCor === "sim" ? classeOfertaVenda(oferta) : ""}
      >
        {oferta[atributo]}
        <br />
      </span>
    );
  });
};

const classeOrdem = (tipo, props, item) => {
  let classe = "";

  if (tipo === "ofertaPrincipal") classe += " divClicavel rowTabelaOrdensExec ";
  else classe += " ";

  if (props.ordemAtual) {
    if (item.id === props.ordemAtual.id) classe += "ordemSelecionada";
    else classe += " ";
  } else classe += " ";

  return classe;
};

const abrirOpcoesOrdem = (props, item) => {
  props.mudarVariavelOrdensExecAction("ordemAtual", item);

  if (props.ordemAtual) {
    if (props.ordemAtual.id === item.id)
      props.mudarVariavelOrdensExecAction(
        "opcoesOrdemAberto",
        !props.opcoesOrdemAberto
      );
    else props.mudarVariavelOrdensExecAction("opcoesOrdemAberto", true);
  } else props.mudarVariavelOrdensExecAction("opcoesOrdemAberto", true);
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
  };
};

const mapStateToPropsOrdensExec = (state) => ({
  tabelaOrdensExecucao: state.ordensExecReducer.tabelaOrdensExecucao,
  ativo: state.ordensExecReducer.ativo,
  opcoesOrdemAberto: state.ordensExecReducer.opcoesOrdemAberto,
  ordemAtual: state.ordensExecReducer.ordemAtual,
  token: state.telaPrincipalReducer.token,
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    { aumentarZindexAction, atualizarDivKeyAction },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsOrdensExec,
    {
      abrirItemBarraLateralAction,
      mudarVariavelOrdensExecAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(OrdensExecucao);
