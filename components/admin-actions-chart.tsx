"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

type ActionSlice = { name: string; value: number }

export function AdminActionsChart() {
  const [data, setData] = useState<ActionSlice[]>([])

  const fetchData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch("/api/admin/actions-breakdown", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (!res.ok) {
        console.error("[AdminActionsChart] Failed to fetch:", res.status)
        return
      }
      const payload = await res.json()
      const nextData: ActionSlice[] = [
        { name: "Donate", value: payload.donate ?? 0 },
        { name: "Compost", value: payload.compost ?? 0 },
        { name: "Farm", value: payload.farm ?? 0 },
        { name: "Reuse", value: payload.reuse ?? 0 },
      ]
      setData(nextData)
    } catch (err) {
      console.error("[AdminActionsChart] Error fetching data:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <ChartContainer
      config={{
        donate: {
          label: "Donate",
          color: "hsl(var(--chart-1))",
        },
        compost: {
          label: "Compost",
          color: "hsl(var(--chart-2))",
        },
        farm: {
          label: "Farm",
          color: "hsl(var(--chart-3))",
        },
        reuse: {
          label: "Reuse",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[350px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
