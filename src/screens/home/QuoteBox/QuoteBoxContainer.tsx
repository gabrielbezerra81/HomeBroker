import React from "react";
import { BoxProps } from "./types";
import QuoteBox from "./QuoteBox";

const QuoteBoxContainer: React.FC = () => {
  return (
    <div className="quoteBoxContainer">
      {boxes.map((box) => (
        <QuoteBox quoteBox={box} />
      ))}
    </div>
  );
};

export default QuoteBoxContainer;

var boxes: BoxProps[] = [
  {
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    variation: -5.36,
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
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    variation: -5.36,
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
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    variation: -5.36,
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
  {
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    variation: -5.36,
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
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    variation: -5.36,
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
    buy: 2.5,
    sell: 2.6,
    quote: 24.57,
    variation: -5.36,
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
