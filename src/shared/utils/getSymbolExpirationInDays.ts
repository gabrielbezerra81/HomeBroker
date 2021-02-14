import moment from "moment";

export default function getSymbolExpirationInDays(endBusiness: string) {
  const [date] = endBusiness.split(" ");

  const [day, month, year] = date.split("/").map((value) => Number(value));

  const expirationDate = new Date(year, month - 1, day);

  const dateDiff = moment(expirationDate).diff(new Date(), "days") + "d";

  return dateDiff;
}
