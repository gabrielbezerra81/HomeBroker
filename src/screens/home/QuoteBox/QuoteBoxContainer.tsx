import React from "react";
import QuoteBox from "./QuoteBox";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

const QuoteBoxContainer: React.FC = () => {
  const {
    systemReducer: { quoteBoxes },
  } = useStateStorePrincipal();

  return (
    <div className="quoteBoxContainer">
      {quoteBoxes.map((box) => (
        <QuoteBox quoteBox={box} key={box.id} />
      ))}
    </div>
  );
};

export default QuoteBoxContainer;
