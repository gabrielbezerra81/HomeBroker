export const ocultarDIV = divID => {
  var element = document.getElementById(divID);
  element.classList.remove("visible");
  element.classList.add("hide");
};

export const mostrarDIV = divID => {
  var element = document.getElementById(divID);
  element.classList.remove("hide");
  element.classList.add("visible");
};
