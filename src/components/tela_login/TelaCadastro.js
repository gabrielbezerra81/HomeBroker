import React from "react";
import { Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  logarUsuarioAction,
  mudarDadosLoginAction
} from "components/redux/actions/TelaPrincipalActions";

class TelaCadastro extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="containerTelaCadastro">
        <Form>
          <div className="conteudoCadastro">
            <h4>Faça seu cadastro</h4>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                autoComplete="username"
                type="text"
                // value={props.inputUsuario}
                // onChange={e =>
                //   props.mudarDadosLoginAction("inputUsuario", e.target.value)
                // }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuário</Form.Label>
              <Form.Control
                autoComplete="username"
                type="text"
                // value={props.inputUsuario}
                // onChange={e =>
                //   props.mudarDadosLoginAction("inputUsuario", e.target.value)
                // }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                autoComplete="username"
                // value={props.inputSenha}
                // onChange={e =>
                //   props.mudarDadosLoginAction("inputSenha", e.target.value)
                // }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Senha</Form.Label>
              <Form.Control
                autoComplete="current-password"
                name="password"
                type="password"
                // value={props.inputSenha}
                // onChange={e =>
                //   props.mudarDadosLoginAction("inputSenha", e.target.value)
                // }
              />
            </Form.Group>

            <Button
              variant="primary"
              //   onClick={() =>
              //     props.logarUsuarioAction(props.inputUsuario, props.inputSenha)
              //   }
            >
              Cadastrar-se
            </Button>

            <div className="flexJustifyCenter">
              <h6>Já sou cadastrado</h6>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //   logado: state.telaPrincipalReducer.logado,
  //   inputUsuario: state.telaPrincipalReducer.inputUsuario,
  //   inputSenha: state.telaPrincipalReducer.inputSenha
});

export default connect(mapStateToProps, {
  //   logarUsuarioAction,
  //   mudarDadosLoginAction
})(TelaCadastro);
