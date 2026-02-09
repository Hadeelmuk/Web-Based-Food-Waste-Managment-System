"use client"

export function WhereitWentFunnel() {
  const destinations = [
    { name: "Feed Hungry People", percentage: 0, color: "#1E4D2B" },
    { name: "Feed Animals", percentage: 0, color: "#3A7452" },
    { name: "Industrial Uses", percentage: 0, color: "#9DBE76" },
    { name: "Composting", percentage: 7, color: "#C2D9A8" },
    { name: "Incineration", percentage: 0, color: "#8B7355" },
    { name: "Landfill", percentage: 93, color: "#8B4513" },
  ]

  const totalQuantities = [
    { label: "0 kg", value: 0 },
    { label: "0 kg", value: 0 },
    { label: "0 kg", value: 0 },
    { label: "810 kg", value: 810 },
    { label: "1109 tons", value: 1109 },
  ]

  return (
    <div className="space-y-4">
      {/* Funnel Visualization */}
      <div className="relative h-[280px] flex flex-col justify-between py-2">
        {destinations.map((dest, index) => {
          const width = 100 - index * 10
          const showBar = dest.percentage > 0

          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className="h-8 rounded-r-lg transition-all duration-300 shadow-sm relative group"
                style={{
                  width: showBar ? `${width}%` : "100%",
                  backgroundColor: dest.color,
                  opacity: showBar ? 1 : 0.3,
                }}
              >
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-medium text-white text-balance">{dest.name}</span>
                </div>
              </div>
              <div className="text-xs font-bold text-foreground min-w-[40px] text-right">{dest.percentage}%</div>
            </div>
          )
        })}
      </div>

      {/* Quantities Summary */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
        <p className="font-medium text-foreground">Total quantities tracked:</p>
        <p>810 kg sent to composting</p>
        <p>1109 tons sent to landfill</p>
      </div>
    </div>
  )
}
