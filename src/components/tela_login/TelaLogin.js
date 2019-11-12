import React from "react";
import { Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

export default class TelaLogin extends React.Component {
  render() {
    return (
      <div>
        <Form.Group>
          <Form.Control type="email" placeholder="Usuário ou e-mail" />
        </Form.Group>
        <Form.Group>
          <Form.Control type="password" placeholder="Senha" />
        </Form.Group>

        <Button variant="primary">ACESSAR MINHA CONTA</Button>

        <div>
          <MDBIcon icon="lock" />
          <h6>Esqueci minha senha</h6>
        </div>
      </div>
    );
  }
}
