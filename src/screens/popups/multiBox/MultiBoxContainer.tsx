import React, { useEffect } from "react";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

import MultiBox from "./MultiBox";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { listQuoteBoxesAPI } from "api/API";
import { loadMultiBoxFromAPIAction } from "redux/actions/multiBox/multiBoxActions";

const MultiBoxContainer: React.FC = () => {
  const {
    multiBoxReducer: { boxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  useEffect(() => {
    async function loadBoxes() {
      const data = await listQuoteBoxesAPI();

      dispatch(loadMultiBoxFromAPIAction(data));
    }

    loadBoxes();
  }, [dispatch]);

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
