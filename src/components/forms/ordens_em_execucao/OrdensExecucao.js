import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Table } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

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
        borderless
        className="tableOrdensExecucao text-center"
        style={{ tableLayout: "fixed" }}
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
            <th>Qtde em Aberto</th>
            <th>Qtde Executada</th>
            <th>Qtde Cancelada</th>
            <th>Preço Disparo</th>
            <th>Preço Envio</th>
            <th>Preço Executado</th>
            <th>Cotação</th>
            <th>Validade</th>
            <th>Roteador</th>
            <th>St</th>
            <th>Msg</th>
          </tr>
        </thead>
        <tbody className="verticalAlignColunaTabela">
          {dataOrdensExecucao.map((item, index) => (
            <tr key={index}>
              <td>{item.progresso}</td>
              <td>{item.cadastro}</td>
              <td>{item.corretora}</td>
              <td>{item.conta}</td>
              <td>{item.operacao}</td>
              <td>{item.modoExec}</td>
              <td>
                {item.ativo.map((item, index2) => (
                  <div key={index2}>
                    {item}
                    <br />
                  </div>
                ))}
              </td>
              <td>
                {item.oferta.map((item, index3) => (
                  <span key={index3}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.qtdeOferta.map((item, index4) => (
                  <span key={index4}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.qtdeEmAberto.map((item, index5) => (
                  <span key={index5}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {" "}
                {item.qtdeExecutada.map((item, index6) => (
                  <span key={index6}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.qtdeCancelada.map((item, index7) => (
                  <span key={index7}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>{item.precoDisparo}</td>
              <td>
                {item.precoEnvio.map((item, index8) => (
                  <span key={index8}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.precoExecutado.map((item, index9) => (
                  <span key={index9}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>{item.cotacao}</td>
              <td>{item.validade}</td>
              <td>{item.roteador}</td>
              <td>
                {item.st.map((item, index10) => (
                  <span key={index10}>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>{item.msg}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Row>
  </div>
);

const dataOrdensExecucao = [
  {
    progresso: "0%",
    cadastro: "16/09/2019 13:12:67",
    corretora: "XP",
    conta: "23897-8",
    operacao: "THL",
    modoExec: "A Mercado",
    ativo: ["PETRG260", "PETRH270"],
    oferta: ["V", "C"],
    qtdeOferta: ["1.000", "1.000"],
    qtdeEmAberto: ["1.000", "1.000"],
    qtdeExecutada: [0, 0],
    qtdeCancelada: [0, 0],
    precoDisparo: "0,20",
    precoEnvio: ["2,70", "2,50"],
    precoExecutado: ["0,20", "0,20"],
    cotacao: "",
    validade: "",
    roteador: "MT5",
    st: ["Ok", "Ok"],
    msg: ""
  },
  {
    progresso: "0%",
    cadastro: "16/09/2019 13:12:67",
    corretora: "XP",
    conta: "23897-8",
    operacao: "THL",
    modoExec: "A Mercado",
    ativo: ["PETRG260", "PETRH270"],
    oferta: ["V", "C"],
    qtdeOferta: ["1.000", "1.000"],
    qtdeEmAberto: ["1.000", "1.000"],
    qtdeExecutada: [0, 0],
    qtdeCancelada: [0, 0],
    precoDisparo: "0,20",
    precoEnvio: ["2,70", "2,50"],
    precoExecutado: ["0,20", "0,20"],
    cotacao: "",
    validade: "",
    roteador: "MT5",
    st: ["Ok", "Ok"],
    msg: ""
  }
];
