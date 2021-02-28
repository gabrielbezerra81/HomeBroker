import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { handleChangeBoxPositionAction } from "modules/multiBox/duck/actions/tab2Actions";
import {
  BoxPosition,
  MultiBoxData,
} from "modules/multiBox/types/MultiBoxState";
import React, { useCallback, useMemo } from "react";
import CustomInput from "shared/components/CustomInput";
import SymbolCard from "../SymbolCard";

interface Props {
  multiBox: MultiBoxData;
  positionIndex: number;
  position: BoxPosition & {
    formattedExpiration: string;
    formattedSymbol: string;
  };
}

const PositionTableItem: React.FC<Props> = ({
  multiBox,
  positionIndex,
  position,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const { id, strikeViewMode } = multiBox;

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const handlePriceChange = useCallback(
    (value) => {
      let price = value;

      if (Number(value) - 0.01 === 0 && structureData?.min) {
        price = structureData?.min || 0;
      }

      dispatch(
        handleChangeBoxPositionAction({
          boxId: id,
          attr: "price",
          value: price,
          positionIndex,
        }),
      );
    },
    [dispatch, id, positionIndex, structureData],
  );

  const handleQttyChange = useCallback(
    (value) => {
      dispatch(
        handleChangeBoxPositionAction({
          boxId: id,
          attr: "qtty",
          value: value,
          positionIndex,
        }),
      );
    },
    [dispatch, id, positionIndex],
  );

  const symbolCardData: any = useMemo(() => {
    let expiration = "";
    let formattedCode = position.stock.symbol;

    if (position.stock.model) {
      expiration = position.formattedExpiration;
      formattedCode = position.formattedSymbol || "";
    }

    return {
      expiration,
      offerType: position.qtty >= 0 ? "C" : "V",
      viewMode: strikeViewMode,
      strike: position.stock.strike,
      code: position.stock.symbol,
      formattedCode,
      type: position.stock.type || ("" as any),
      qtty: position.qtty,
      model: position.stock.model || ("" as any),
    };
  }, [
    position.formattedExpiration,
    position.formattedSymbol,
    position.qtty,
    position.stock.model,
    position.stock.strike,
    position.stock.symbol,
    position.stock.type,
    strikeViewMode,
  ]);

  return (
    <tr key={position.id}>
      <td>
        <SymbolCard data={symbolCardData} />
      </td>
      <td className="qttyColumn">
        <div>
          <CustomInput
            type={"quantidade"}
            step={100}
            autoSelect
            value={position.qtty}
            onChange={handleQttyChange}
          />
        </div>
      </td>
      <td className="avgPriceColumn">
        <div>
          <CustomInput
            name="price"
            step={0.01}
            type="preco"
            value={position.price}
            onChange={handlePriceChange}
          />
        </div>
      </td>
      {/* <td>C 1.8K/25</td> */}
    </tr>
  );
};

export default PositionTableItem;
