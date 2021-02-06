import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine
} from "recharts";

export default class GraficoPatrimonio extends React.Component {
  render() {
    return (
      <ResponsiveContainer
        width={"100%"}
        height={150}
        className="containerGrafico"
      >
        <BarChart
          width={500}
          height={150}
          data={data}
          margin={{ top: 15, right: 5, left: 0, bottom: 2 }}
          barSize={30}
        >
          <XAxis dataKey="dia" height={18}></XAxis>
          <YAxis width={35}></YAxis>
          <Tooltip labelStyle={{ color: "#000" }}></Tooltip>
          <Legend></Legend>
          <CartesianGrid strokeDasharray="5 5" stroke="#444"></CartesianGrid>
          <ReferenceLine y={0} stroke="#888" />
          <Bar
            name="Dinheiro"
            dataKey="dinheiro"
            stackId="patrimonio"
            fill="#AB89BD"
          ></Bar>
          <Bar
            name="Opção"
            dataKey="opcao"
            stackId="patrimonio"
            fill="#ddbe05"
          ></Bar>
          <Bar
            name="Ação"
            dataKey="acao"
            stackId="patrimonio"
            fill="#a67269"
            label={{ position: "top", fill: "#ddd" }}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export const data = [
  {
    dia: "04-24",
    acao: 100,
    opcao: 150,
    dinheiro: 220
  },
  {
    dia: "04-25",
    acao: 200,
    opcao: 250,
    dinheiro: 350
  },
  {
    dia: "04-26",
    acao: 300,
    opcao: 350,
    dinheiro: 450
  },
  {
    dia: "04-27",
    acao: 400,
    opcao: 450,
    dinheiro: 550
  },
  {
    dia: "04-28",
    acao: 420,
    opcao: 550,
    dinheiro: 650
  },
  {
    dia: "04-29",
    acao: 320,
    opcao: 450,
    dinheiro: 550
  },
  {
    dia: "04-30",
    acao: 220,
    opcao: 350,
    dinheiro: 450
  },
  {
    dia: "05-01",
    acao: 200,
    opcao: 300,
    dinheiro: 400
  },
  {
    dia: "05-02",
    acao: 150,
    opcao: 250,
    dinheiro: 330
  },
  {
    dia: "05-03",
    acao: 100,
    opcao: 180,
    dinheiro: 250
  }
];
