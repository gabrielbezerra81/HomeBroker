import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Table, ProgressBar } from "react-bootstrap";
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
        bordered={false}
        borderless
        className="tableOrdensExecucao text-center"
        style={{ tableLayout: "fixed" }}
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
          {props.tabelaOrdensExecucao.map((item, index) => (
            <tr key={index}>
              <td>
                <ProgressBar
                  animated
                  variant="success"
                  now={item.progresso}
                  label={`${item.progresso}%`}
                  className="barraProgresso"
                />
              </td>
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
