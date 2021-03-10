import produce from "immer";

import { MainThunkAction } from "types/ThunkActions";
import { BoxPosition } from "modules/multiBox/types/MultiBoxState";
import { updateManyMultiBoxAction } from "./multiBoxActions";
import { PositionCreateRequestData } from "modules/multiBox/types/BoxAPI";
import { saveBoxPositionsAPI } from "api/API";
import { getSymbolInfoAPI } from "api/symbolAPI";
import { toast } from "react-toastify";

export const handleAddBoxPositionAction = (boxId: string): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    let addedPosition = false;

    const updatedBoxes = await produce(boxes, async (draft) => {
      const multiBox = draft.find((item) => item?.id === boxId);

      if (multiBox) {
        const data = await getSymbolInfoAPI(multiBox.symbolInput);

        if (data) {
          const newPosition: BoxPosition = {
            account: null as any,
            groupPositions: null as any,
            id: null as any,
            structure: null as any,
            stock: data,
            price: 0,
            qtty: 0,
            symbol: multiBox.symbolInput,
          };

          multiBox.boxPositions.push(newPosition);
          addedPosition = true;
        }
      }
    });

    if (addedPosition) {
      dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
    } //
    else {
      toast.error("Erro ao adicionar nova posição!");
    }
  };
};

interface ChangeBoxOffer {
  boxId: string;
  positionIndex: number;
  attr: keyof BoxPosition;
  value: any;
}

export const handleChangeBoxPositionAction = ({
  boxId,
  attr,
  value,
  positionIndex,
}: ChangeBoxOffer): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const updatedBoxes = produce(boxes, (draft) => {
      const multiBox = draft.find((item) => item?.id === boxId);

      if (multiBox) {
        Object.assign(multiBox.boxPositions[positionIndex], { [attr]: value });
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};

export const handleSaveBoxPositionsAction = (
  boxId: string,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes, boxesTab1Data },
      systemReducer: { selectedAccount },
    } = getState();

    const boxIndex = boxes.findIndex((item) => item?.id === boxId);

    const structureData = boxesTab1Data.find((item) => item.boxId === boxId);

    if (boxIndex !== -1 && structureData) {
      try {
        const payload = boxes[boxIndex]?.boxPositions.map((position) => {
          const newPositionPayload: PositionCreateRequestData = {
            id: position.id || undefined,
            account: selectedAccount.id,
            groupPositions: boxes[boxIndex]?.tab1Id || -1,
            structure: structureData.structureID,
            price: position.price,
            symbol: position.symbol,
            qtty: position.qtty,
            stock: {
              id: position.stock.id,
            },
          };

          return newPositionPayload;
        });

        let data = (await saveBoxPositionsAPI(payload)) as BoxPosition[];

        data = data.map((createdPosition: BoxPosition) => {
          const position = boxes[boxIndex]?.boxPositions.find(
            (position) => position.symbol === createdPosition.symbol,
          );

          if (position) {
            return { ...createdPosition, stock: position.stock };
          }

          return { ...createdPosition };
        });

        const updatedBoxes = produce(boxes, (draft) => {
          Object.assign(draft[boxIndex]?.boxPositions, data);
        });

        dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
      } catch (error) {}
    }
  };
};
