import {
  createBoxAlertAPI,
  criarAlertaOperacaoAPI,
  setPointerWhileAwaiting,
} from "api/API";

import moment from "moment";
import produce from "immer";

import { getformatedDate } from "shared/utils/Formatacoes";
import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import { MultilegPayload } from "modules/multileg/types/multileg";
import { MainThunkAction } from "types/ThunkActions";
import { updateOneMultilegState } from "modules/multileg/duck/actions/utils";
import { mountOrderForOperations } from "./util";
import { AlertCreateRequestData } from "modules/multiBox/types/BoxAPI";

interface CreateAlertFromBox {
  multiBox: MultiBoxData;
}

export const createAlertFromBoxAction = ({
  multiBox,
}: CreateAlertFromBox): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { alerts },
    } = getState();

    const {
      consideredPrice,
      condition,
      observation,
      selectedValidity,
      selectedDate,
      alertPrice,
    } = multiBox;

    let expiration = "31/12/9999 23:59:00";

    if (selectedValidity === "DAY") {
      expiration = moment(new Date()).format("DD/MM/YYYY") + " 23:59:00";
    } //
    else if (selectedValidity === "SPECIFIED_DAY") {
      expiration = moment(selectedDate).format("DD/MM/YYYY") + " 23:59:00";
    }

    const payload: AlertCreateRequestData = {
      price: alertPrice,
      status: "Enabled",
      expiration,
      operator: condition,
      param: consideredPrice,
      structure: { id: 0 },
    };

    const data = await createBoxAlertAPI(payload);

    // const partialPayload = await mountOrderForOperations({
    //   multiBox,
    //   dispatch,
    //   getState,
    //   commentConfig: observation,
    // });

    // if (partialPayload) {
    //   // TODO: alterar data e preço para os valores da aba 4
    //   const [order] = partialPayload;

    //   const updatedOrder = changeOrderExpirationAndPrice({
    //     order,
    //     selectedValidity,
    //     selectedDate,
    //     price: alertPrice,
    //   });

    //   const alertPayload = [updatedOrder];

    //   const data = await criarAlertaOperacaoAPI({
    //     param: consideredPrice,
    //     operator: condition,
    //     data: alertPayload,
    //   });

    //   if (data && data.length) {
    //     const updatedAlerts = produce(alerts, (draft) => {
    //       draft.push(data[0]);
    //     });
    //     dispatch(
    //       updateOneMultilegState({
    //         attributeName: "alerts",
    //         attributeValue: updatedAlerts,
    //       }),
    //     );
    //   }
    // }
  };
};

interface ChangeOrder {
  order: MultilegPayload;
  selectedValidity: "DAY" | "SPECIFIED_DAY" | "GTC";
  selectedDate: Date;
  price: number;
}

const changeOrderExpirationAndPrice = ({
  order,
  selectedValidity,
  selectedDate,
  price,
}: ChangeOrder) => {
  const updatedOrder = produce(order, (draft) => {
    let expiration = "";

    if (selectedValidity === "DAY")
      expiration = getformatedDate(new Date()) + " 22:00:00";
    else if (selectedValidity === "GTC") {
      expiration = "31/12/9999 22:00:00";
    } else {
      expiration = selectedDate.toLocaleString("pt-BR");
    }

    draft.expiration = expiration;

    draft.offers.forEach((offer) => {
      offer.expiration = expiration;
      offer.expirationType = selectedValidity;
      offer.price = price;
    });
  });

  return updatedOrder;
};
