import React from "react";
import Interval from "react-interval-rerender";

export default () => (
  <Interval delay={1000}>
    {() =>
      new Date().toLocaleString("pt-BR", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      })
    }
  </Interval>
);
