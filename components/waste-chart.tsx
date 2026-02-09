"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface WasteChartProps {
  data?: Array<{ name: string; value: number; fill: string }>
}

export function WasteChart({ data = [] }: WasteChartProps) {
  // Default empty data if none provided
  const chartData = data.length > 0 ? data : [
    { name: "Food Waste", value: 0, fill: "#3A7452" },
    { name: "Coffee Grounds", value: 0, fill: "#5C8A58" },
    { name: "Organic Waste", value: 0, fill: "#9DBE76" },
  ]

  return (
    <ChartContainer
      config={{
        value: {
          label: "Weight (kg)",
          color: "#3A7452",
        },
      }}
      className="h-[320px] w-full"
    >
      <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
        <XAxis dataKey="name" fontSize={13} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
        <YAxis
          fontSize={13}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          label={{ value: "Quantity (kg)", angle: -90, position: "insideLeft", style: { fontSize: 13 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(58, 116, 82, 0.1)" }} />
        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
          <LabelList
            dataKey="value"
            position="top"
            style={{ fill: "#1E4D2B", fontWeight: "600", fontSize: "13px" }}
            formatter={(value: number) => `${value} kg`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
