"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { type: "Food", value: 52, fill: "hsl(var(--chart-1))" },
  { type: "Coffee", value: 28, fill: "hsl(var(--chart-2))" },
  { type: "Organic", value: 62.5, fill: "hsl(var(--chart-3))" },
]

export function TypeBreakdownChart() {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Weight (kg)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-full"
    >
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" fontSize={12} />
        <YAxis dataKey="type" type="category" fontSize={12} width={80} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
