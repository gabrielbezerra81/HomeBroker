import { formatarNumDecimal } from "./Formatacoes";

interface Props {
  object: Object;
  formatFunction?: Function;
  shouldReturn: boolean;
}

export default function formatObjectNumberProps({
  object,
  formatFunction = formatarNumDecimal,
  shouldReturn,
}: Props) {
  const newObj = shouldReturn ? { ...object } : object;

  Object.keys(object).forEach((key) => {
    const typedKey = key as keyof Object;

    if (typeof object[typedKey] === "number") {
      const formattedKey =
        "formatted" +
        typedKey.substr(0, 1).toLocaleUpperCase() +
        typedKey.substr(1);

      const value = formatFunction(object[typedKey], 2, 2);

      Object.assign(newObj, { [formattedKey]: value });
    }
  });

  if (shouldReturn) {
    return newObj;
  }
}
