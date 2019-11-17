import React from "react";
import { Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  logarUsuarioAction,
  mudarDadosLoginAction
} from "components/redux/actions/TelaPrincipalActions";
import FloatingLabelInput from "react-floating-label-input";
import backgrondLogin from "img/backgrounds/background_login.jpg";
import { navigate } from "@reach/router";

class TelaLogin extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="backgroundLoginCadastro">
        <div className="containerTelaLogin">
          <div className="divBemVindo">
            <h3>Seja bem-vindo!</h3>
          </div>

          <div className="divLogin">
            <div className="divTextoLogin mb-4">
              <h4>Realize seu login para continuar.</h4>
            </div>
            <Form>
              <div className="conteudoLogin">
                <FloatingLabelInput
                  className={`inputFlutuante ${
                    props.inputUsuario ? "flutuantePreenchido" : ""
                  }`}
                  id="inputUsuarioFlutuante"
                  label="Usuário ou e-mail"
                  value={props.inputUsuario}
                  onChange={e =>
                    props.mudarDadosLoginAction("inputUsuario", e.target.value)
                  }
                />

                <FloatingLabelInput
                  className={`inputFlutuante ${
                    props.inputSenha ? "flutuantePreenchido" : ""
                  }`}
                  id="inputSenhaFlutuante"
                  label="Senha"
                  value={props.inputSenha}
                  onChange={e =>
                    props.mudarDadosLoginAction("inputSenha", e.target.value)
                  }
                />

                <Button
                  id="botaoLogar"
                  variant="primary"
                  onClick={() =>
                    props.logarUsuarioAction(
                      props.inputUsuario,
                      props.inputSenha
                    )
                  }
                >
                  ACESSAR MINHA CONTA
                </Button>

                <div className="flexJustifyCenter">
                  <MDBIcon icon="lock" className="mr-1" />
                  <h6 className="ml-1">Esqueci minha senha</h6>
                </div>
                <Button
                  variant="primary"
                  className="flexJustifyCenter"
                  onClick={() => navigate("/cadastro")}
                >
                  <h6 className="ml-1">Cadastre-se</h6>
                </Button>
              </div>
            </Form>
          </div>

          <div className="divFooter">
            <div className="mb-4">
              <h6>Ajuda</h6>
              <h6>Privacidade</h6>
              <h6>Termos</h6>
            </div>
            <h5>Todos direitos reservados. RENDA CONTINUA @2019</h5>
          </div>
        </div>
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

// <Form.Group>
// <Form.Control
//   autoComplete="username"
//   type="email"
//   placeholder="Usuário ou e-mail"
//   value={props.inputUsuario}
//   onChange={e =>
//     props.mudarDadosLoginAction("inputUsuario", e.target.value)
//   }
// />
// </Form.Group>
