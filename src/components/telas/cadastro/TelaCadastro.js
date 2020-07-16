import React from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  cadastrarUsuarioAction,
  mudarDadosLoginAction,
} from "redux/actions/TelaPrincipalActions";
import { navigate } from "@reach/router";
import FloatingLabelInput from "react-floating-label-input";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "redux/StoreCreation";

const TelaCadastro = ({ path }) => {
  const {
    inputUsuario,
    inputSenha,
    nomeCadastro,
    usernameCadastro,
    emailCadastro,
    senhaCadastro,
  } = StateStorePrincipal("principal");
  const dispatch = DispatchStorePrincipal();

  return (
    <div className="backgroundLoginCadastro">
      <div className="containerTelaCadastro">
        <div className="divCadastro">
          <Form>
            <div className="conteudoCadastro">
              <h4>Faça seu cadastro</h4>
              <FloatingLabelInput
                className={`inputFlutuante ${
                  nomeCadastro ? "flutuantePreenchido" : ""
                }`}
                id="inputNomeFlutuante"
                label="Nome"
                value={nomeCadastro}
                onChange={(e) =>
                  dispatch(
                    mudarDadosLoginAction("nomeCadastro", e.target.value)
                  )
                }
              />
              <FloatingLabelInput
                className={`inputFlutuante ${
                  usernameCadastro ? "flutuantePreenchido" : ""
                }`}
                id="inputUserFlutuante"
                label="Usuário"
                value={usernameCadastro}
                onChange={(e) =>
                  dispatch(
                    mudarDadosLoginAction("usernameCadastro", e.target.value)
                  )
                }
              />
              <FloatingLabelInput
                className={`inputFlutuante ${
                  emailCadastro ? "flutuantePreenchido" : ""
                }`}
                id="inputEmailFlutuante"
                label="E-mail"
                value={emailCadastro}
                onChange={(e) =>
                  dispatch(
                    mudarDadosLoginAction("emailCadastro", e.target.value)
                  )
                }
              />
              <FloatingLabelInput
                className={`inputFlutuante ${
                  senhaCadastro ? "flutuantePreenchido" : ""
                }`}
                id="inputEmailFlutuante"
                label="Senha"
                name="password"
                autoComplete="current-password"
                type="password"
                value={senhaCadastro}
                onChange={(e) =>
                  dispatch(
                    mudarDadosLoginAction("senhaCadastro", e.target.value)
                  )
                }
              />
              <Button
                id="botaoCadastrar"
                variant="primary"
                className="mt-2"
                onClick={() => dispatch(cadastrarUsuarioAction({}))}
              >
                Cadastrar-se
              </Button>
              <div className="flexJustifyCenter">
                <Button
                  className="botaoVoltarLogin"
                  variant="link"
                  onClick={() => navigate("/")}
                >
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
};

export default TelaCadastro;
