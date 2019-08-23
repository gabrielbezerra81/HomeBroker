import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Tab, Form, Button, Row, Col } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import AbaMultileg from "components/forms/multileg_/AbaMultileg";

export default class Multileg extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "multileg") {
      document.getElementById("multileg").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("multileg", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="multileg"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivFiltrarOrdens={false}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }

  modalBody = props => {
    return (
      <div className="bodyMultileg">
        <div className="containerPrecoCustoModo">
          <Col md={0} className="colPrecoCustoModo">
            <Form.Group>
              <Form.Label>Preço</Form.Label>
              <Form.Control
                className="textInput"
                type="number"
                step={0.01}
                //value={this.props.preco}
                onChange={event => false}
              />
            </Form.Group>
          </Col>
          <Col md={0} className="colPrecoCustoModo">
            <Form.Group>
              <Form.Label>Custo Unitário</Form.Label>
              <Form.Control
                className="textInput"
                type="number"
                step={0.01}
                //value={this.props.preco}
                onChange={event => false}
              />
            </Form.Group>
          </Col>
          <Col md={0} className="colPrecoCustoModo">
            <Form.Group>
              <Form.Label>Modo de Execução</Form.Label>
              <Form.Control
                className="textInput"
                type="text"
                // value=""
                // onChange={() => {}}
              />
            </Form.Group>
          </Col>
        </div>
        <Tabs
          id="tabBarMultileg"
          className="navTabMultileg"
          onSelect={this.handleSelect}
          activeKey={this.state.abaAtual}
        >
          {this.state.tabs.map((tab, index) => {
            return (
              <Tab
                eventKey={`tab${index}`}
                title={tab.name}
                tabClassName="abaNavTab"
                key={index}
              >
                <AbaMultileg />
              </Tab>
            );
          })}
          <Tab
            eventKey="adicionar"
            title="+"
            tabClassName="botaoAddAba divClicavel"
          />
        </Tabs>
      </div>
    );
  };

  state = {
    tabs: [
      { name: "Sim 1" },
      { name: "Sim 2" },
      { name: "Sim 3" },
      { name: "Sim 4" }
    ],
    abaAtual: ""
  };

  handleSelect = key => {
    if (key === "adicionar") {
      const { tabs } = this.state;

      const newTabObject = {
        name: `Sim ${tabs.length + 1}`,
        content: `This is Tab ${tabs.length + 1}`
      };

      this.setState({
        tabs: [...tabs, newTabObject],
        currentTab: newTabObject
      });
    } else {
      this.setState({
        abaAtual: key
      });
    }
  };
}
