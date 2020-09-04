declare module "react-show" {
  export interface AnimateProps {
    show: boolean;
    duration: number;
    preMount: boolean;
    transitionOnMount: boolean;
    stayMounted: boolean;
    start: {
      opacity: number;
      pointerEvents: string;
    };
    onClick: () => any;
    id?: string;
  }

  export class Animate extends React.Component<AnimateProps & any, any> {}
}
