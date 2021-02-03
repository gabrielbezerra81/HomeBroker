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
}

interface PermissionContextData {
  permissions: Permission;
}

export const PermissionContext = React.createContext({} as PermissionContextData);

const PermissionProvider: React.FC = ({ children }) => {
  const {
    systemReducer: { roles },
  } = useStateStorePrincipal();

  const [permissions, setPermissions] = useState<Permission>({
    planner: true,
    box: true,
    book: true,
    thl: {
      listing: true,
      sendOrder: true,
    },
    boletas: true,
    ordersExecuting: true,
    position: true,
    history: true,
    rightSideMenu: {
      alerts: true,
      ordersExecuting: true,
      position: true,
    },
  });

  useEffect(() => {
    setPermissions((oldPermissions) => {
      return changePermissionsByRole(oldPermissions, ["Student"]);
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

  const changePayload: Partial<Permission> = {};

  // resetPermissions
  Object.keys(permissions).forEach((key) => {
    const parsedKey = key as keyof Permission;

    if (typeof permissions[parsedKey] === "boolean") {
      Object.assign(changePayload, { [parsedKey]: true });
    } //
  });

  changePayload.thl = {
    listing: true,
    sendOrder: true,
  };

  changePayload.rightSideMenu = {
    alerts: true,
    ordersExecuting: true,
    position: true,
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
  else if (roles.includes("Admin")) {
  }

  Object.assign(permissions, changePayload);

  return permissions;
};
