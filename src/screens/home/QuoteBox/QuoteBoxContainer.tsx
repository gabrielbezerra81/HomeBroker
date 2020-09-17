import React from "react";
import { BoxProps } from "./types";
import QuoteBox from "./QuoteBox";

const QuoteBoxContainer: React.FC = () => {
  return (
    <div className="quoteBoxContainer">
      {boxes.map((box) => (
        <QuoteBox quoteBox={box} key={box.id} />
      ))}
    </div>
  );
};

export default QuoteBoxContainer;

var boxes: BoxProps[] = [
  {
    id: 1,
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    min: 0,
    max: 3.6,
    dayOscilation: -0.54,
    book: {
      buy: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
      sell: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
    },
    codes: [
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
    ],
  },
  {
    id: 2,
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    min: 0,
    max: 3.6,
    dayOscilation: -0.54,
    book: {
      buy: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
      sell: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
    },
    codes: [
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
    ],
  },
  {
    id: 3,
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    min: 0,
    max: 3.6,
    dayOscilation: 21.54,
    book: {
      buy: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
      sell: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
    },
    codes: [
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
    ],
  },
  {
    id: 4,
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    min: 0,
    max: 3.6,
    dayOscilation: -0.54,
    book: {
      buy: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
      sell: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
    },
    codes: [
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
    ],
  },
  {
    id: 5,
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    min: 0,
    max: 3.6,
    dayOscilation: 2.54,
    book: {
      buy: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
      sell: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
    },
    codes: [
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
    ],
  },
  {
    id: 6,
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    min: 0,
    max: 3.6,
    dayOscilation: -0.54,
    book: {
      buy: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
      sell: [
        {
          qtty: 43300,
          price: 26.71,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
        {
          qtty: 9800,
          price: 26.7,
        },
      ],
    },
    codes: [
      { symbol: "BRZU", type: "buy", qtty: 100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
      { symbol: "GDX", type: "sell", qtty: -100 },
    ],
  },
];
