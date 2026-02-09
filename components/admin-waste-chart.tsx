"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type WastePoint = { type: string; value: number }

export function AdminWasteChart() {
  const [data, setData] = useState<WastePoint[]>([])

  const fetchData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch("/api/admin/waste-breakdown", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (!res.ok) {
        console.error("[AdminWasteChart] Failed to fetch:", res.status)
        return
      }
      const payload = await res.json()
      const nextData: WastePoint[] = [
        { type: "Food Waste", value: payload.edible ?? 0 },
        { type: "Coffee Grounds", value: payload.coffee ?? 0 },
        { type: "Organic Waste", value: payload.organic ?? 0 },
        { type: "Recyclable", value: payload.recyclable ?? 0 },
      ]
      setData(nextData)
    } catch (err) {
      console.error("[AdminWasteChart] Error fetching data:", err)
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
        value: {
          label: "Total Weight (kg)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[350px] w-full"
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" fontSize={12} />
        <YAxis fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
