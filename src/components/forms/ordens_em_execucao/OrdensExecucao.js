import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Table, ProgressBar } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import { formatarDataDaAPI } from "components/utils/Formatacoes";

export default class OrdensExecucao extends React.Component {
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
  componentWillMount() {
    this.props.listarOrdensExecAction();
  }

  render() {
    return (
      <DraggableModal
        id="ordens_execucao"
        renderModalBody={() => modalBody(this.props)}
        renderDivFiltrarOrdens={true}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = props => (
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
    </Row>
  </div>
);

const retornaData = dataString => {
  return formatarDataDaAPI(dataString).toLocaleString();
};

const renderOferta = (item, index, props, tipo) => {
  let qtdeOferta = 0;
  let qtdeExecutada = 0;

  item.offers.forEach(oferta => {
    qtdeOferta += oferta.qtdeOferta;
    qtdeExecutada += oferta.qtdeExecutada;
  });

  return (
    <tr
      key={index}
      className={tipo === "ofertaPrincipal" ? "divClicavel" : ""}
      onClick={
        tipo === "ofertaPrincipal"
          ? e => {
              e.stopPropagation();
              if (item.operacao === "Multileg")
                props.abrirOrdemNoMultilegAction(props, item);
            }
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
      <td>{item.modoExec}</td>

      <td>
        {item.offers.map((oferta, index2) => (
          <div key={index2}>
            {oferta.ativo}
            <br />
          </div>
        ))}
      </td>
      <td>
        {item.offers.map((oferta, index2) => (
          <span key={index2}>
            {oferta.oferta}
            <br />
          </span>
        ))}
      </td>
      <td>
        {item.offers.map((oferta, index2) => (
          <span key={index2}>
            {oferta.qtdeOferta}
            <br />
          </span>
        ))}
      </td>
      <td>{qtdeExecutada}</td>
      <td>
        {item.offers.map((oferta, index2) => (
          <span key={index2}>
            {oferta.qtdeCancelada}
            <br />
          </span>
        ))}
      </td>

      <td>{item.precoDisparo}</td>
      <td>{item.offers[0].precoEnvio}</td>
      <td>
        {item.offers.map((oferta, index2) => (
          <span key={index2}>
            {oferta.precoExecutado}
            <br />
          </span>
        ))}
      </td>
      <td>{retornaData(item.validade)}</td>
      <td>{item.roteador}</td>
      <td>
        {item.offers.map((oferta, index2) => (
          <span key={index2}>
            {oferta.status}
            <br />
          </span>
        ))}
      </td>

      <td>
        {item.offers.map((oferta, index2) => (
          <span key={index2}>
            {oferta.msg}
            <br />
          </span>
        ))}
      </td>
    </tr>
  );
};
