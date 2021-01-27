import React from "react";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

import MultiBox from "./MultiBox";

const MultiBoxContainer: React.FC = () => {
  const {
    multiBoxReducer: { boxes },
  } = useStateStorePrincipal();

  return (
    <div className="multiBoxContainer">
      {boxes.map((multiBox, index) => (
        <MultiBox multiBox={multiBox} key={multiBox.id} />
      ))}
    </div>
  );
};

export default MultiBoxContainer;

// MultiBoxContainer
