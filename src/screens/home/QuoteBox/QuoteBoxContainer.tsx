import React, { useEffect } from "react";
import QuoteBox from "./QuoteBox";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { listQuoteBoxesAPI } from "api/API";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleAddBoxesToTabsAction,
  updateOneSystemStateAction,
} from "redux/actions/system/SystemActions";

const QuoteBoxContainer: React.FC = () => {
  const {
    systemReducer: { quoteBoxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  useEffect(() => {
    async function loadBoxes() {
      const boxes = await listQuoteBoxesAPI();

      const openedBoxes = boxes.map((boxItem: any) => {
        const configuration = JSON.parse(boxItem.configuration);

        return { menuKey: `box${boxItem.id}`, tabKey: configuration.tabKey };
      });

      dispatch(handleAddBoxesToTabsAction(openedBoxes));

      // dispatch(updateOneSystemStateAction("quoteBoxes", boxes));
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
