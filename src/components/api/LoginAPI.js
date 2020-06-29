import request from "superagent";
import retryDelay from "superagent-retry-delay";
import {
  url_base,
  url_realizarLogin_usuario_senha,
  url_autenticacao_token,
  url_realizarCadastro_dados,
  url_verificarToken_token,
} from "components/api/url";
import {
  erro_realizar_login,
  erro_realizar_cadastro,
  erro_sessaoExpirada,
} from "constants/AlertaErros";
import { mostrarErroConsulta } from "components/api/API";

retryDelay(request);

const timeout = 10000;

export const autenticacaoTokenAPI = (token) => {
  return request
    .get(`${url_base}${url_autenticacao_token}`)
    .timeout(timeout)
    .set({ Authorization: `${token.tokenType} ${token.accessToken}` })
    .then((response) => {
      return response.body;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_realizar_login);
      return null;
    });
};

// export const buscarInformacoesUsuarioAPI = (token) => {
//   return request
//     .get(`${url_base}${url_informacoesUsuario_token}`)
//     .set({ Authorization: `${token.tokenType} ${token.accessToken}` })
//     .timeout(timeout)
//     .retry(3, 2000)
//     .then((response) => {
//       return response.body;
//     })
//     .catch((erro) => {
//       mostrarErroConsulta(erro, erro_realizar_login);
//       return null;
//     });
// };

// export const listarContasAPI = (token) => {
//   return request
//     .get(`${url_base}${url_listarContas_token}`)
//     .set({ Authorization: `${token.tokenType} ${token.accessToken}` })
//     .timeout(timeout)
//     .retry(3, 2000)
//     .then((response) => {
//       return response.body;
//     })
//     .catch((erro) => {
//       mostrarErroConsulta(erro, erro_realizar_login);
//       return null;
//     });
// };

export const realizarLoginAPI = (username, password) => {
  let payload = { username: username, password: password };

  return (
    request
      .post(`${url_base}${url_realizarLogin_usuario_senha}`)
      // .retry(3, 2000)
      .timeout(timeout)
      .set({ "Content-Type": "application/json" })
      .send(JSON.stringify(payload))
      .then((response) => {
        const { body } = response;
        return body;
      })
      .catch((erro) => {
        mostrarErroConsulta(erro, erro_realizar_login);
        return null;
      })
  );
};

export const realizarCadastroAPI = (nome, username, email, role, password) => {
  let payload = {
    name: nome,
    username: username,
    email: email,
    role: role,
    password: password,
  };

  return request
    .post(`${url_base}${url_realizarCadastro_dados}`)
    .set({ "Content-Type": "application/json" })
    .timeout(timeout)
    .send(JSON.stringify(payload))
    .then(() => {
      return true;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_realizar_cadastro);
      return false;
    });
};

export const verificarTokenAPI = (token) => {
  return request
    .get(`${url_base}${url_verificarToken_token}${token.accessToken}`)
    .timeout(timeout)
    .retry(3, 2000)
    .then((response) => {
      const { body } = response;
      return body;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_sessaoExpirada);
      return null;
    });
};
