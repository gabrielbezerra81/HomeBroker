export const getformatedDate = date => {
  let DD = date.getDate();
  let MM = date.getMonth() + 1;
  const YYYY = date.getFullYear();
  if (DD < 10) DD = "0" + DD;
  if (MM < 10) MM = "0" + MM;
  const formatedDate = `${DD}/${MM}/${YYYY}`;
  return formatedDate;
};

export const getDiaSemana = () => {
  const date = new Date();
  var diaSemana = "";
  switch (date.getDay()) {
    case 0:
      diaSemana = "Domingo";
      break;
    case 1:
      diaSemana = "Segunda-feira";
      break;
    case 2:
      diaSemana = "Terça-feira";
      break;
    case 3:
      diaSemana = "Quarta-feira";
      break;
    case 4:
      diaSemana = "Quinta-feira";
      break;
    case 5:
      diaSemana = "Sexta-feira";
      break;
    case 6:
      diaSemana = "Sábado";
      break;
    default:
      break;
  }
  return diaSemana;
};

export const getDiaEMes = () => {
  const date = new Date();
  var mes = "";
  switch (date.getMonth()) {
    case 0:
      mes = "Janeiro";
      break;
    case 1:
      mes = "Fevereiro";
      break;
    case 2:
      mes = "Março";
      break;
    case 3:
      mes = "Abril";
      break;
    case 4:
      mes = "Maio";
      break;
    case 5:
      mes = "Junho";
      break;
    case 6:
      mes = "Julho";
      break;
    case 7:
      mes = "Agosto";
      break;
    case 8:
      mes = "Setembro";
      break;
    case 9:
      mes = "Outubro";
      break;
    case 10:
      mes = "Novembro";
      break;
    case 11:
      mes = "Dezembro";
      break;
    default:
      break;
  }
  return date.getDate() + " de " + mes;
};

export const formatarNumDecimal = function(num) {
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });
};

export const formatarDataDaAPI = dataAPI => {
  const arrayDate = dataAPI.split(" ");
  const data = arrayDate[0].split("/");
  const hora = arrayDate[1];
  return new Date(`${data[1]}/${data[0]}/${data[2]} ${hora}`);
};

export const formatarVencimento = string => {
  string = string.split("-");
  string[2] = Number(Number(string[2]) + 1) + "";
  let dateString = string.join("-");
  return new Date(dateString).toLocaleDateString();
};
