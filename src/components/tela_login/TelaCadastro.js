import React from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  cadastrarUsuarioAction,
  mudarDadosLoginAction
} from "components/redux/actions/TelaPrincipalActions";
import { navigate } from "@reach/router";
import FloatingLabelInput from "react-floating-label-input";

class TelaCadastro extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="backgroundLoginCadastro">
        <div className="containerTelaCadastro">
          <div className="divCadastro">
            <Form>
              <div className="conteudoCadastro">
                <h4>Faça seu cadastro</h4>
                <FloatingLabelInput
                  className={`inputFlutuante ${
                    props.nomeCadastro ? "flutuantePreenchido" : ""
                  }`}
                  id="inputNomeFlutuante"
                  label="Nome"
                  value={props.nomeCadastro}
                  onChange={e =>
                    props.mudarDadosLoginAction("nomeCadastro", e.target.value)
                  }
                />
                <FloatingLabelInput
                  className={`inputFlutuante ${
                    props.usernameCadastro ? "flutuantePreenchido" : ""
                  }`}
                  id="inputUserFlutuante"
                  label="Usuário"
                  value={props.usernameCadastro}
                  onChange={e =>
                    props.mudarDadosLoginAction(
                      "usernameCadastro",
                      e.target.value
                    )
                  }
                />
                <FloatingLabelInput
                  className={`inputFlutuante ${
                    props.emailCadastro ? "flutuantePreenchido" : ""
                  }`}
                  id="inputEmailFlutuante"
                  label="E-mail"
                  value={props.emailCadastro}
                  onChange={e =>
                    props.mudarDadosLoginAction("emailCadastro", e.target.value)
                  }
                />
                <FloatingLabelInput
                  className={`inputFlutuante ${
                    props.senhaCadastro ? "flutuantePreenchido" : ""
                  }`}
                  id="inputEmailFlutuante"
                  label="Senha"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  value={props.senhaCadastro}
                  onChange={e =>
                    props.mudarDadosLoginAction("senhaCadastro", e.target.value)
                  }
                />
                <Button
                  id="botaoCadastrar"
                  variant="primary"
                  className="mt-2"
                  onClick={() => props.cadastrarUsuarioAction(props)}
                >
                  Cadastrar-se
                </Button>
                <div className="flexJustifyCenter">
                  <Button variant="link" onClick={() => navigate("/")}>
                    <h6>Já sou cadastrado</h6>
                  </Button>
                </div>
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
  nomeCadastro: state.telaPrincipalReducer.nomeCadastro,
  usernameCadastro: state.telaPrincipalReducer.usernameCadastro,
  emailCadastro: state.telaPrincipalReducer.emailCadastro,
  senhaCadastro: state.telaPrincipalReducer.senhaCadastro
});

export default connect(mapStateToProps, {
  cadastrarUsuarioAction,
  mudarDadosLoginAction
})(TelaCadastro);
