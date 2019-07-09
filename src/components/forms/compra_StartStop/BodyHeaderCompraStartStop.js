import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {} from "mdbreact";
import { ReactComponent as ArrowDown } from "../../../img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "../../../img/up-arrow.svg";
import Clock from "../../Clock";
import Toggle from "react-bootstrap-toggle";
import "../../../css/bootstrap2-toggle.css";

class BodyHeaderCompraStartStop extends React.Component {
  constructor() {
    super();
    this.state = { toggleActive: false };
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle() {
    this.setState({ toggleActive: !this.state.toggleActive });
  }

  render() {
    return (
      <div>
        <Row className="rowToggleSwitch">
          <Toggle
           onClick={this.onToggle}
           active={this.state.toggleActive}
            size="xs"
            onstyle="default"
            offstyle="default"
            onClassName="onclass"
            offClassName="offclass"
            className="toggle"
          />
        </Row>
        <Row className="rowBodyHeader padding-right">
          <Col md={3} className="colAtivo1BodyHeader">
            <h5>PETR4, PETROBRAS</h5>
          </Col>
          <Col md={2} className="colAtivo2BodyHeader">
            <h5>PN N2</h5>
          </Col>
          <Col md={1} className="colValorBodyHeader">
            <h5>4,17</h5>
          </Col>
          <Col md={1} className="colIconeSetaBodyHeader">
            {renderSeta(1)}
          </Col>
          <Col md={1} className="colPorcentagemBodyHeader">
            {renderValorPorcentagem(this.props.porcentagem)}
          </Col>
          <Col md={2} className="colDataBodyHeader">
            <span className="dataBodyHeader">{Clock()}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  porcentagem: state.compraAgendadaReducer.porcentagem
});

export default connect(
  mapStateToProps,
  {}
)(BodyHeaderCompraStartStop);

const renderSeta = valor => {
  if (valor >= 0) return <ArrowUp fill="green" className="iconeSeta" />;
  else return <ArrowDown fill="red" className="iconeSeta" />;
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    return <h5 className="porcentagemPositiva">+{porcentagem}%</h5>;
  } else if (porcentagem < 0) {
    return <h5 className="porcentagemNegativa">{porcentagem}%</h5>;
  } else return <h5>+{porcentagem}%</h5>;
};
