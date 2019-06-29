import React from "react";
import DraggableModal from "../DraggableModal";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../css/CompraAgendada.css";
import { mudarQtdAction } from "../redux/actions/bookOfertaActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MDBIcon } from "mdbreact";

class CompraAgendada extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() =>
          modalBody(this.props, this.state.startDate, this.handleChange)
        }
        renderModalFooter={() => false}
        headerClass="border-green"
      />
    );
  }
}

const modalBody = (props, date, onchange) => (
  <Modal.Body>
    <div className="divAsModalContainer">
      <Form>
        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Ativo</h6>
          </Col>
          <Col className="formAtivo">
            <Form.Group>
              <Form.Control type="text" placeholder="" name="ativo" />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Qtde</Form.Label>
              <Form.Control
                type="number"
                step={100}
                min={0}
                value={props.qtde}
                onChange={event => props.mudarQtdAction(event)}
                name="qtde"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Entrada</h6>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <Form.Control type="number" step={0.1} min={0} name="disparo" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <Form.Control type="number" step={0.1} min={0} name="execucao" />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col className="colValorTotal">
          <h2 className="valorTotalText">VALOR TOTAL: 26,50</h2>
        </Col>
      </Row>

      <Form>
        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Gain</h6>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <Form.Control
                type="number"
                step={0.1}
                min={0}
                name="gainDisparo"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <Form.Control
                type="number"
                step={0.1}
                min={0}
                name="gainExecucao"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col className="labelCol">
            <h6 className="labelForm">Stop</h6>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Disparo</Form.Label>
              <Form.Control
                type="number"
                step={0.1}
                min={0}
                name="stopDisparo"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Execução</Form.Label>
              <Form.Control
                type="number"
                step={0.1}
                min={0}
                name="stopExecucao"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row className="rowFormValidade">
        <Col md={2}>
          <Form.Label>Validade:</Form.Label>
        </Col>
        <Col md={4} className="colValidadeCheck">
          <Form.Check
            type="checkbox"
            id="checkboxValidade"
            label="Até cancelar"
            onChange={value => false}
          />
        </Col>
        <Col md={4}>
          <DatePicker
            className="form-control"
            selected={date}
            onChange={onchange}
          />
          <MDBIcon icon="calendar-alt" size="lg"/>
        </Col>
      </Row>

      <Row>
        <Form>
          <Form.Group>
            <Form.Label>Assinatura eletrônica</Form.Label>
            <Form.Control />
          </Form.Group>
        </Form>
      </Row>

      <Row>
        <Col>
          <Button variant="secondary">Limpar</Button>
        </Col>
        <Col>
          <Button variant="primary">Comprar</Button>
        </Col>
      </Row>
    </div>
  </Modal.Body>
);

const modalFooter = props => <Modal.Footer className="no-border" />;

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde
});

export default connect(
  mapStateToProps,
  { mudarQtdAction }
)(CompraAgendada);

/*

      <DraggableModal
        show={this.props.show}
        close={this.props.close}
        id="compraagendada"
        headerTitle={this.props.headerTitle}
        renderModalBody={() => modalBody(this.props)}
        renderModalFooter={() => modalFooter(this.props)}
        headerClass="border-green"
      />

<Form>
              <Form.Group>
                <Form.Control type="date" placeholder="" min="2019-06-29" max="2050-01-01"></Form.Control>
              </Form.Group>
            </Form>
      
*/
