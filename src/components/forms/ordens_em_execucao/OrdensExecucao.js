import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Row, Table } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

class OrdensExecucao extends React.Component {
  render() {
    return (
      <DraggableModal
        id="ordens_execucao"
        renderModalBody={() => modalBody(this.props)}
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
        <tbody>
          {dataOrdensExecucao.map((item, index) => (
            <tr key={index}>
              <td>{item.progresso}</td>
              <td>{item.cadastro}</td>
              <td>{item.corretora}</td>
              <td>{item.conta}</td>
              <td>{item.operacao}</td>
              <td>{item.modoExec}</td>
              <td>
                {item.ativo.map(item => (
                  <div>
                    {item}
                    <br />
                  </div>
                ))}
              </td>
              <td>
                {item.oferta.map(item => (
                  <span>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.qtdeOferta.map(item => (
                  <span>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.qtdeEmAberto.map(item => (
                  <span>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {" "}
                {item.qtdeExecutada.map(item => (
                  <span>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {item.qtdeCancelada.map(item => (
                  <span>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>{item.precoDisparo}</td>
              <td>
                {item.precoEnvio.map(item => (
                  <span>
                    {item}
                    <br />
                  </span>
                ))}
              </td>
              <td>{item.precoExecutado}</td>
              <td>{item.cotacao}</td>
              <td>{item.validade}</td>
              <td>{item.roteador}</td>
              <td>
                {item.st.map(item => (
                  <span>
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

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(OrdensExecucao);

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
    precoExecutado: "0,20",
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
    precoExecutado: "0,20",
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
    precoExecutado: "0,20",
    cotacao: "",
    validade: "",
    roteador: "MT5",
    st: ["Ok", "Ok"],
    msg: ""
  }
];
