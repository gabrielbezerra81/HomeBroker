import React, { useEffect } from "react";

import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "managers/updateManager/utils";

const CategoryListUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval },
  } = useStateStorePrincipal();

  // const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  // const previousCategories = usePrevious(categories);

  useEffect(() => {
    function checkIfCategoriesChanged() {
      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
      } //
      else if (updateMode === "proactive") {
      }
    }

    const hasCategoriesChanged = checkIfCategoriesChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasCategoriesChanged) {
      startUpdate();
    }
  }, [previousUpdateInterval, previousUpdateMode, updateInterval, updateMode]);

  return null;
};

export default CategoryListUpdateManager;
