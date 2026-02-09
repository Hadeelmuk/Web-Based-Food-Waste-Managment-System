"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jul", waste: 165 },
  { month: "Aug", waste: 158 },
  { month: "Sep", waste: 152 },
  { month: "Oct", waste: 148 },
  { month: "Nov", waste: 145 },
  { month: "Dec", waste: 142.5 },
]

export function MonthlyTrendChart() {
  return (
    <ChartContainer
      config={{
        waste: {
          label: "Total Waste (kg)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-full"
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="waste" stroke="var(--color-waste)" strokeWidth={3} />
      </LineChart>
    </ChartContainer>
  )
}
