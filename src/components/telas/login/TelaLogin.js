import React, { useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import {
  logarUsuarioAction,
  mudarDadosLoginAction,
} from "redux/actions/TelaPrincipalActions";
import FloatingLabelInput from "react-floating-label-input";
import { navigate } from "@reach/router";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "redux/StoreCreation";

const TelaLogin = ({ path }) => {
  const { inputUsuario, inputSenha } = StateStorePrincipal("principal");

  const dispatch = DispatchStorePrincipal();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(logarUsuarioAction(inputUsuario, inputSenha));
    },
    [dispatch, inputUsuario, inputSenha]
  );

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
          <Form onSubmit={handleSubmit}>
            <div className="conteudoLogin">
              <FloatingLabelInput
                className={`inputFlutuante ${
                  inputUsuario ? "flutuantePreenchido" : ""
                }`}
                id="inputUsuarioFlutuante"
                autoComplete="username"
                label="Usuário ou e-mail"
                value={inputUsuario}
                onChange={(e) =>
                  dispatch(
                    mudarDadosLoginAction("inputUsuario", e.target.value)
                  )
                }
              />

              <FloatingLabelInput
                className={`inputFlutuante ${
                  inputSenha ? "flutuantePreenchido" : ""
                }`}
                id="inputSenhaFlutuante"
                label="Senha"
                type="password"
                autoComplete="current-password"
                value={inputSenha}
                onChange={(e) =>
                  dispatch(mudarDadosLoginAction("inputSenha", e.target.value))
                }
              />

              <Button id="botaoLogar" variant="primary" type="submit">
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
};

export default TelaLogin;
