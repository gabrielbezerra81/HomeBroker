declare module "react-intl-number-input" {
  export interface CurrencyInputProps {
    precision: number;
    step: number;
    locale?: string;
    placeholder?: string;
    prefix?: string;
  }

  export default class CurrencyInput extends React.Component<
    CurrencyInputProps & any,
    any
  > {}
}
