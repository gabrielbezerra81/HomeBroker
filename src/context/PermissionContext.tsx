import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useContext, useEffect, useMemo, useState } from "react";

interface Permission {
  planner: boolean;
  box: boolean;
  book: boolean;
  thl: {
    listing: boolean;
    sendOrder: boolean;
  };
  boletas: boolean;
  ordersExecuting: boolean;
  position: boolean;
  history: boolean;
  rightSideMenu: {
    alerts: boolean;
    ordersExecuting: boolean;
    position: boolean;
  };
  optionsMatrix: {
    checkSymbols: boolean;
  };
  conditionalMultileg: boolean;
  optionsTable: boolean;
}

interface PermissionContextData {
  permissions: Permission;
}

export const PermissionContext = React.createContext(
  {} as PermissionContextData,
);

const PermissionProvider: React.FC = ({ children }) => {
  const {
    systemReducer: { roles },
  } = useStateStorePrincipal();

  const [permissions, setPermissions] = useState<Permission>({
    planner: false,
    box: false,
    book: false,
    thl: {
      listing: false,
      sendOrder: false,
    },
    boletas: false,
    ordersExecuting: false,
    position: false,
    history: false,
    rightSideMenu: {
      alerts: false,
      ordersExecuting: false,
      position: false,
    },
    optionsMatrix: {
      checkSymbols: false,
    },
    conditionalMultileg: false,
    optionsTable: false,
  });

  useEffect(() => {
    setPermissions((oldPermissions) => {
      return changePermissionsByRole(oldPermissions, roles);
    });
  }, [roles]);

  const value: PermissionContextData = useMemo(() => {
    return { permissions };
  }, [permissions]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;

export const usePermissions = () => {
  return useContext(PermissionContext);
};

const changePermissionsByRole = (
  oldPermissions: Permission,
  roles: string[],
) => {
  const permissions = {
    ...oldPermissions,
  };

  if (!roles.length) {
    return permissions;
  }

  const changePayload: Partial<Permission> = {};

  // resetPermissions
  Object.keys(permissions).forEach((key) => {
    const parsedKey = key as keyof Permission;

    if (typeof permissions[parsedKey] === "boolean") {
      Object.assign(changePayload, { [parsedKey]: true });
    } //
  });

  changePayload.optionsTable = false;

  changePayload.thl = {
    listing: true,
    sendOrder: true,
  };

  changePayload.rightSideMenu = {
    alerts: true,
    ordersExecuting: true,
    position: true,
  };

  changePayload.optionsMatrix = {
    checkSymbols: false,
  };

  // resetPermissions

  if (roles.includes("Student")) {
    changePayload.book = false;
    changePayload.thl = {
      ...permissions.thl,
      sendOrder: false,
    };
    changePayload.boletas = false;
    changePayload.ordersExecuting = false;
    changePayload.history = false;
    changePayload.rightSideMenu = {
      ...permissions.rightSideMenu,
      ordersExecuting: false,
    };
  } //
  else if (roles.includes("Trader")) {
    changePayload.book = false;
    changePayload.history = false;
  } //
  else if (roles.includes("Admin")) {
    changePayload.optionsMatrix.checkSymbols = true;
    changePayload.conditionalMultileg = true;
    changePayload.optionsTable = true;
    // Não faz nada, retorna apenas todas as permissões
  }

  Object.assign(permissions, changePayload);

  return permissions;
};
