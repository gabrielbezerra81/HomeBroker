export const buscarNumeroArray = (
  array,
  valorComparacao,
  keyComparador,
  keyAtributo
) => {
  const item = array.find((item) => item[keyComparador] === valorComparacao);
  if (item) {
    if (item[keyAtributo]) return item[keyAtributo];
  }
  return 0;
};
