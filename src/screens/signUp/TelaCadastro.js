import React, { useCallback, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { cadastrarUsuarioAction } from "redux/actions/system/SystemActions";
import { navigate } from "@reach/router";
import FloatingLabelInput from "react-floating-label-input";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";

const TelaCadastro = ({ path }) => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatchStorePrincipal();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(cadastrarUsuarioAction(user));
    },
    [dispatch, user],
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser((oldUser) => ({ ...oldUser, [name]: value }));
  }, []);

  return (
    <div className="backgroundLoginCadastro">
      <div className="containerTelaCadastro">
        <div className="divCadastro">
          <Form onSubmit={handleSubmit}>
            <div className="conteudoCadastro">
              <h4>Faça seu cadastro</h4>
              <FloatingLabelInput
                className={`inputFlutuante ${
                  user.name ? "flutuantePreenchido" : ""
                }`}
                name="name"
                id="inputNomeFlutuante"
                label="Nome"
                value={user.name}
                onChange={handleInputChange}
              />
              <FloatingLabelInput
                className={`inputFlutuante ${
                  user.username ? "flutuantePreenchido" : ""
                }`}
                id="inputUserFlutuante"
                label="Usuário"
                name="username"
                value={user.username}
                onChange={handleInputChange}
              />
              <FloatingLabelInput
                className={`inputFlutuante ${
                  user.email ? "flutuantePreenchido" : ""
                }`}
                id="inputEmailFlutuante"
                label="E-mail"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
              <FloatingLabelInput
                className={`inputFlutuante ${
                  user.password ? "flutuantePreenchido" : ""
                }`}
                id="inputEmailFlutuante"
                label="Senha"
                name="password"
                autoComplete="current-password"
                type="password"
                value={user.password}
                onChange={handleInputChange}
              />
              <Button
                id="botaoCadastrar"
                variant="primary"
                className="mt-2"
                type="submit"
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
