import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Form, Row, Col, Nav } from "react-bootstrap";
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
  /*
 
  */

  modalBody = props => {
    return (
      <div className="bodyMultileg">
        <Tab.Container
          id="tabBarMultileg"
          onSelect={this.handleSelect}
          activeKey={this.state.abaAtual}
        >
          <Row className="navTabMultileg">
            <Nav>
              {this.state.tabs.map((tab, index) => {
                return (
                  <Col md={0} key={index}>
                    <Nav.Item>
                      <Nav.Link eventKey={`tab${index}`} className="abaNavTab">
                        {tab.name}
                      </Nav.Link>
                    </Nav.Item>
                  </Col>
                );
              })}

              <Col md={0}>
                <Nav.Item>
                  <Nav.Link
                    eventKey="adicionar"
                    className="botaoAddAba divClicavel"
                  >
                    +
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Nav>
          </Row>
          <Row>
            <Col md={12}>
              <Tab.Content>
                {this.state.tabs.map((tab, index) => {
                  return (
                    <Tab.Pane
                      eventKey={`tab${index}`}
                      className="abaNavTab"
                      key={index}
                    >
                      <AbaMultileg />
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  };

  state = {
    tabs: [{ name: "Sim 1" }],
    abaAtual: "tab0"
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
        abaAtual: `tab${tabs.length}`
      });
    } else {
      this.setState({
        abaAtual: key
      });
    }
  };
}
