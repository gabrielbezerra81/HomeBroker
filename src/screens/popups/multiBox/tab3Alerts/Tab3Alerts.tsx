import React from "react";
import { MultiBoxData } from "types/multiBox/MultiBoxState";

interface Props {
  multiBox: MultiBoxData;
}

const Tab3Alerts: React.FC<Props> = ({ multiBox }) => {
  return <div className="multiBoxTab3"></div>;
};

export default Tab3Alerts;
