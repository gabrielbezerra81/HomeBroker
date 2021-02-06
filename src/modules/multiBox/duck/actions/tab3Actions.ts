import { criarAlertaOperacaoAPI, setPointerWhileAwaiting } from "api/API";
import produce from "immer";
import { getformatedDate } from "shared/utils/Formatacoes";
import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import { MultilegPayload } from "modules/multileg/types/multileg";
import { MainThunkAction } from "types/ThunkActions";
import { updateOneMultilegState } from "modules/multileg/duck/actions/utils";
import { updateBoxAttrAction } from "./multiBoxActions";
import { mountOrderForOperations } from "./util";

interface CreateAlertFromBox {
  multiBox: MultiBoxData;
  dispatchGlobal: any;
  zIndex: number;
}

export const createAlertFromBoxAction = ({
  multiBox,
  dispatchGlobal,
  zIndex,
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
      price,
    } = multiBox;

    setPointerWhileAwaiting({ lockMode: "travar", id: "multileg" });

    dispatch(
      updateBoxAttrAction(multiBox.id, {
        loadingAPI: true,
      }),
    );

    const partialPayload = await mountOrderForOperations({
      multiBox,
      dispatch,
      getState,
      zIndex,
      dispatchGlobal,
      commentConfig: observation,
    });

    if (partialPayload) {
      // TODO: alterar data e preço para os valores da aba 4
      const [order] = partialPayload;

      const updatedOrder = changeOrderExpirationAndPrice({
        order,
        selectedValidity,
        selectedDate,
        price,
      });

      const alertPayload = [updatedOrder];

      const data = await criarAlertaOperacaoAPI({
        param: consideredPrice,
        operator: condition,
        data: alertPayload,
      });

      if (data && data.length) {
        const updatedAlerts = produce(alerts, (draft) => {
          draft.push(data[0]);
        });
        dispatch(
          updateOneMultilegState({
            attributeName: "alerts",
            attributeValue: updatedAlerts,
          }),
        );
      }
    }

    dispatch(
      updateBoxAttrAction(multiBox.id, {
        loadingAPI: false,
      }),
    );

    setPointerWhileAwaiting({ lockMode: "destravar", id: "multileg" });
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
