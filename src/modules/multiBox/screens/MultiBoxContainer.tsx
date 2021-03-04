import React, { useEffect } from "react";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

import MultiBox from "./MultiBox";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { listQuoteBoxesAPI } from "api/API";
import { updateStructuresAndLoadBoxesAction } from "modules/multiBox/duck/actions/multiBoxActions";

import "../styles/multiBox.scss";

const MultiBoxContainer: React.FC = () => {
  const {
    multiBoxReducer: { boxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  useEffect(() => {
    async function loadBoxes() {
      let data = await listQuoteBoxesAPI();

      data = data.filter((item: any) => {
        if (item.configuration) {
          const configuration = JSON.parse(item.configuration);

          return !configuration.isCategory;
        }

        return false;
      });

      dispatch(updateStructuresAndLoadBoxesAction(data, true));
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
