import { BoxProps } from "screens/popups/quoteBox/types";
import { Token, Account, BoxVisibility, AuthData } from "./system";

export default interface SystemState {
  connectedUser: string | null;
  isOpenLeftUserMenu: boolean;
  isLogged: boolean;
  liquidValue: string;
  buyingValue: string;
  broker: string;
  isOpenOrdersHoverMenu: boolean;
  isOpenOrdersExec: boolean;
  isOpenDetailedReport: boolean;
  isOpenPosition: boolean;
  isOpenMultileg: boolean;
  isOpenTHL: boolean;
  isOpenRightSideMenu: boolean;
  isOpenCategoryList: boolean;
  isOpenInitialPlanner: boolean;
  isOpenDetailedPlanner: boolean;
  isOpenOptionsTable: boolean;
  token: Token;
  authData: AuthData | null;
  accounts: Array<Account>;
  roles: string[];
  selectedAccount: Account;
  mainTabs: Array<{
    tabName: string;
  }>;
  openedMenus: Array<{
    menuKey: string;
    tabKey: string;
  }>;
  selectedTab: string;
  quoteBoxes: Array<BoxProps>;
  boxesVisibility: Array<BoxVisibility>;
  esource_box: EventSource | null;
  interval_box: NodeJS.Timeout | null;
  activeItemRightSideMenu: string;
  multilegButtonsVisibility: boolean;
  createAlertButtonVisibility: boolean;
  updateMode: "reactive" | "proactive";
  updateInterval: number;
  isLeftSideMenuConfigOpen: boolean;
}
