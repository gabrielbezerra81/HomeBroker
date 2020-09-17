import { BoxProps } from "screens/home/QuoteBox/types";
import { Token, Account, BoxVisibility } from "./system";

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
  token: Token;
  accounts: Array<Account>;
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
}
