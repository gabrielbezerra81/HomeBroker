import React from "react";
import { Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  logarUsuarioAction,
  mudarDadosLoginAction
} from "components/redux/actions/TelaPrincipalActions";

class TelaLogin extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="containerTelaLogin">
        <Form>
          <div className="conteudoLogin">
            <Form.Group>
              <Form.Control
                autoComplete="username"
                type="email"
                placeholder="Usuário ou e-mail"
                value={props.inputUsuario}
                onChange={e =>
                  props.mudarDadosLoginAction("inputUsuario", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                autoComplete="current-password"
                name="password"
                type="password"
                placeholder="Senha"
                value={props.inputSenha}
                onChange={e =>
                  props.mudarDadosLoginAction("inputSenha", e.target.value)
                }
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={() =>
                props.logarUsuarioAction(props.inputUsuario, props.inputSenha)
              }
            >
              ACESSAR MINHA CONTA
            </Button>

            <div className="flexJustifyCenter">
              <MDBIcon icon="lock" className="mr-1" />
              <h6 className="ml-1">Esqueci minha senha</h6>
            </div>
            <Button variant="link" className="flexJustifyCenter">
              <h6 className="ml-1">Cadastre-se</h6>
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  logado: state.telaPrincipalReducer.logado,
  inputUsuario: state.telaPrincipalReducer.inputUsuario,
  inputSenha: state.telaPrincipalReducer.inputSenha
});

export default connect(mapStateToProps, {
  logarUsuarioAction,
  mudarDadosLoginAction
})(TelaLogin);
