export const calculoPreco = (aba, tipo) => {
  let preco = 0;
  let arrayQtde = [];

  aba.tabelaMultileg.forEach((oferta, index) => {
    if ((oferta.compra && oferta.venda) || tipo === "ultimo")
      arrayQtde.push(oferta.qtde);
  });
  const mdc = gcd(arrayQtde);

  if (mdc > 0)
    aba.tabelaMultileg.forEach((oferta, index) => {
      if ((oferta.compra && oferta.venda) || tipo === "ultimo") {
        switch (tipo) {
          case "max":
            if (oferta.cv === "compra")
              preco += oferta.venda.price * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= oferta.compra.price * (oferta.qtde / mdc);
            break;
          case "min":
            if (oferta.cv === "compra")
              preco += oferta.compra.price * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= oferta.venda.price * (oferta.qtde / mdc);
            break;
          case "ultimo":
            if (oferta.cv === "compra")
              preco += oferta.cotacao * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= oferta.cotacao * (oferta.qtde / mdc);
            break;
          default:
            break;
        }
      }
    });
  if (preco < 0) preco = preco * -1;
  return preco;
};

var gcd2 = function(a, b) {
  return !b ? a : gcd2(b, a % b);
};
var gcd = function(nums) {
  var factor = nums[0];
  for (var i = 1; i < nums.length; i++) {
    factor = gcd2(factor, nums[i]);
  }
  return factor;
};
