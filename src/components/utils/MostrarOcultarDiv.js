export const ocultarDIV = divID => {
  var element = document.getElementById(divID);
  element.classList.remove("visible");
  element.classList.add("hide");

  if (divID === "divMenuLateral") {
    var divBarraLateral = document.getElementById("divBarraLateral");
    if (divBarraLateral) {
      divBarraLateral.classList.remove("divBarraLateralAfastada");
    }

    var menuTelaPrincipal = document.getElementById("menusTelaPrincipal");
    if (menuTelaPrincipal) {
      menuTelaPrincipal.classList.remove("menuLateralAfastado");
    }
  }
};

export const mostrarDIV = divID => {
  var element = document.getElementById(divID);
  element.classList.remove("hide");
  element.classList.add("visible");

  if (divID === "divMenuLateral") {
    var divBarraLateral = document.getElementById("divBarraLateral");
    if (divBarraLateral) {
      divBarraLateral.classList.add("divBarraLateralAfastada");
    }

    var menuTelaPrincipal = document.getElementById("menusTelaPrincipal");
    if (menuTelaPrincipal) {
      menuTelaPrincipal.classList.add("menuLateralAfastado");
    }
  }
};
