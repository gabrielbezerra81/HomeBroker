import React, { useEffect } from "react";
import QuoteBox from "./QuoteBox";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { listQuoteBoxesAPI } from "api/API";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { addBoxFromAPIAction } from "redux/actions/system/boxesActions";

const QuoteBoxContainer: React.FC = () => {
  const {
    systemReducer: { quoteBoxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  useEffect(() => {
    async function loadBoxes() {
      const data = await listQuoteBoxesAPI();

      dispatch(addBoxFromAPIAction(data));
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
