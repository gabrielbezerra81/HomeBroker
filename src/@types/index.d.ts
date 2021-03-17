declare module "*.scss";

declare module "table-options" {
  interface Props {
    navbarActions?: {
      handleSettings: Function;
      handleExit: Function;
    };
  }

  const TableOptions: React.FC<Props>;

  export default TableOptions;
}
