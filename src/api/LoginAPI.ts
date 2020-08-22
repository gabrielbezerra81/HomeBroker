import {
  url_base,
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
import { mostrarErroConsulta } from "api/API";
import { Token } from "types/principal/principal";
import api from "./apiConfig";

const timeout = 10000;

export const autenticacaoTokenAPI = () => {
  return api
    .get(`${url_autenticacao_token}`, {
      timeout,
    })
    .then((response) => response.data)
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_realizar_login);
      return null;
    });
};

interface LoginData {
  accessToken: string;
  tokenType: string;
  name: string;
  refreshToken: string;
  accounts: Array<{
    corretora: string;
    gateway: string;
    id: number;
    nome: string;
    numero: string;
    preferencia: any;
    saldo: any;
    sigla: string;
  }>;
}

export const realizarLoginAPI = (
  username: string,
  password: string,
): Promise<LoginData | null> => {
  const payload = { username, password };

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
      mostrarErroConsulta(erro, erro_realizar_login);
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
      mostrarErroConsulta(erro, erro_realizar_cadastro);
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
      mostrarErroConsulta(erro, erro_sessaoExpirada);
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
//       mostrarErroConsulta(erro, erro_realizar_login);
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
//       mostrarErroConsulta(erro, erro_realizar_login);
//       return null;
//     });
// };
