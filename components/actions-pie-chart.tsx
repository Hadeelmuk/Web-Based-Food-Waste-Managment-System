"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ActionsPieChartProps {
  data?: Array<{ name: string; value: number; fill: string; icon: string }>
}

const COLORS = ["#1E4D2B", "#3A7452", "#9DBE76"]

export function ActionsPieChart({ data = [] }: ActionsPieChartProps) {
  // Default empty data if none provided
  const chartData = data.length > 0 ? data : [
    { name: "Donate", value: 0, fill: "#1E4D2B", icon: "🫶" },
    { name: "Compost", value: 0, fill: "#3A7452", icon: "🌾" },
    { name: "Reuse", value: 0, fill: "#9DBE76", icon: "🔁" },
  ]

  return (
    <div className="w-full">
      <ChartContainer
        config={{
          donate: {
            label: "Donate",
            color: "#1E4D2B",
          },
          compost: {
            label: "Compost",
            color: "#3A7452",
          },
          reuse: {
            label: "Reuse",
            color: "#9DBE76",
          },
        }}
        className="h-[240px] w-full"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            stroke="#ffffff"
            strokeWidth={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legend with icons */}
      <div className="flex justify-center gap-6 mt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-sm text-muted-foreground">
              {item.icon} {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
