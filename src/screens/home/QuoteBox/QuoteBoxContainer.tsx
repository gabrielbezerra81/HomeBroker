import React, { useEffect } from "react";
import QuoteBox from "./QuoteBox";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { listQuoteBoxesAPI } from "api/API";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleAddBoxesToTabsAction,
  updateOneSystemStateAction,
} from "redux/actions/system/SystemActions";
import { BoxProps } from "./types";
import { BoxVisibility } from "types/system/system";

const QuoteBoxContainer: React.FC = () => {
  const {
    systemReducer: { quoteBoxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  useEffect(() => {
    async function loadBoxes() {
      const data = await listQuoteBoxesAPI();

      const boxesVisibility: BoxVisibility[] = [];
      const openedBoxes: any[] = [];

      const boxes: BoxProps[] = data.map((boxItem: any) => {
        const { structure } = boxItem;

        const configuration = JSON.parse(boxItem.configuration);

        openedBoxes.push({
          menuKey: `box${boxItem.id}`,
          tabKey: configuration.tabKey,
        });

        boxesVisibility.push({ boxKey: `box${boxItem.id}`, visibility: true });

        const codes = structure.components.map((component: any) => {
          return {
            qtty: component.qtty,
            symbol: component.stock.symbol,
            type: component.qtty >= 0 ? "buy" : "sell",
          };
        });

        const box: BoxProps = {
          id: boxItem.id,
          structureID: structure.id,
          max: 0,
          min: 0,
          quote: structure.last,
          codes,
          dayOscilation: structure.change || 0,
          buy: structure.max,
          sell: structure.min,
          book: {
            buy: structure.bookBuy || [],
            sell: structure.bookSell || [],
          },
        };

        return box;
      });

      dispatch(handleAddBoxesToTabsAction(openedBoxes));
      dispatch(updateOneSystemStateAction("quoteBoxes", boxes));
    }

    loadBoxes();
  }, [dispatch]);

  return (
    <div className="quoteBoxContainer">
      {quoteBoxes.map((box) => (
        <QuoteBox quoteBox={box} key={box.id} />
      ))}
    </div>
  );
};

export default QuoteBoxContainer;
