declare module "react-repeatable" {
  export interface RepeatableProps {
    repeatDelay: number;
    repeatInterval: number;
    onPress: (event: any) => any;
    onHold: (data: any) => any;
    className?: string;
  }

  export default class Repeatable extends React.Component<
    RepeatableProps,
    any
  > {}
}
