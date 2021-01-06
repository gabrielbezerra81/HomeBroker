import {
  url_realizarLogin_usuario_senha,
  url_autenticacao_token,
  url_realizarCadastro_dados,
  url_verificarToken_token,
} from "api/url";
import {
  erro_realizar_login,
  erro_realizar_cadastro,
  erro_sessaoExpirada,
} from "constants/AlertaErros";
import { showAPIErrorAndAlert } from "api/API";
import { Token, Account } from "types/system/system";
import api from "./apiConfig";

const timeout = 30000;

export const autenticacaoTokenAPI = async () => {
  return api
    .get(`${url_autenticacao_token}`, {
      timeout,
    })
    .then((response) => response.data)
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_realizar_login);
      return null;
    });
};

interface LoginData {
  accessToken: string;
  tokenType: string;
  name: string | null;
  refreshToken: string;
  accounts: Array<Account>;
}

export const realizarLoginAPI = async (
  username: string,
  password: string,
): Promise<LoginData | null> => {
  const payload = { username, password };

  delete api.defaults.headers.authorization;

  return api
    .post<LoginData>(url_realizarLogin_usuario_senha, payload, {
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
      timeout,
    })
    .then((response) => {
      return response.data;
    })
    .catch((erro) => {
      console.log(erro.response);
      showAPIErrorAndAlert(erro, erro_realizar_login);
      return null;
    });
};

interface SignUpData {
  name: string;
  username: string;
  email: string;
  role: string;
  password: string;
}

export const realizarCadastroAPI = (data: SignUpData) => {
  return api
    .post(url_realizarCadastro_dados, data)
    .then(() => true)
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_realizar_cadastro);
      return false;
    });
};

export const verificarTokenAPI = (token: Token) => {
  return api
    .get(`${url_verificarToken_token}${token.accessToken}`, { timeout })
    .then((response) => {
      return response.data;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_sessaoExpirada);
      return null;
    });
};

// export const buscarInformacoesUsuarioAPI = () => {
//   return request
//     .get(`${url_base}${url_informacoesUsuario_token}`)
//     .timeout(timeout)
//     .retry(3, 2000)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((erro) => {
//       showAPIErrorAndAlert(erro, erro_realizar_login);
//       return null;
//     });
// };

// export const listarContasAPI = () => {
//   return request
//     .get(`${url_base}${url_listarContas_token}`)
//     .timeout(timeout)
//     .retry(3, 2000)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((erro) => {
//       showAPIErrorAndAlert(erro, erro_realizar_login);
//       return null;
//     });
// };
