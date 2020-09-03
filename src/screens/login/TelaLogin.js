import React, { useCallback, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import {
  logarUsuarioAction,
  clearReduxStateFromStorageAction,
} from "redux/actions/system/SystemActions";
import FloatingLabelInput from "react-floating-label-input";
import { navigate } from "@reach/router";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";

const TelaLogin = ({ path }) => {
  const [user, setUser] = useState({
    username: "gabrielAB",
    password: "123456789",
  });

  const dispatch = useDispatchStorePrincipal();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(logarUsuarioAction(user.username, user.password));
      setUser({ ...user, password: "" });
    },
    [dispatch, user],
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser((oldUser) => ({ ...oldUser, [name]: value }));
  }, []);

  useEffect(() => {
    dispatch(clearReduxStateFromStorageAction({}));
  }, [dispatch]);

  return (
    <div className="backgroundLoginCadastro">
      <div className="containerTelaLogin">
        <div className="divBemVindo">
          <h3>Seja bem-vindo!</h3>
        </div>

        <div className="divLogin">
          <h4 className="mb-4">Realize seu login para continuar.</h4>

          <Form onSubmit={handleSubmit}>
            <div className="conteudoLogin">
              <FloatingLabelInput
                className={`inputFlutuante ${
                  user.username ? "flutuantePreenchido" : ""
                }`}
                id="inputUsuarioFlutuante"
                autoComplete="off"
                name="username"
                label="Usuário ou e-mail"
                value={user.username}
                onChange={handleInputChange}
              />

              <FloatingLabelInput
                className={`inputFlutuante ${
                  user.password ? "flutuantePreenchido" : ""
                }`}
                id="inputSenhaFlutuante"
                name={"password"}
                label="Senha"
                type="password"
                autoComplete="current-password"
                value={user.password}
                onChange={handleInputChange}
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
