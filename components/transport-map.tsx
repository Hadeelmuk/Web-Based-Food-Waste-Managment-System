"use client"

import { MapPin, Navigation } from "lucide-react"

export function TransportMap() {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-border overflow-hidden">
      {/* Simplified Map Illustration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Location markers */}
          <div className="absolute top-[30%] left-[20%]">
            <div className="relative animate-bounce">
              <MapPin className="w-8 h-8 text-primary fill-primary/20" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border px-2 py-1 rounded text-xs font-medium shadow-lg">
                Green Café
              </div>
            </div>
          </div>

          <div className="absolute top-[60%] right-[25%]">
            <div className="relative">
              <MapPin className="w-8 h-8 text-secondary fill-secondary/20" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border px-2 py-1 rounded text-xs font-medium shadow-lg">
                EcoFarm
              </div>
            </div>
          </div>

          <div className="absolute top-[45%] left-[55%]">
            <div className="relative">
              <MapPin className="w-8 h-8 text-accent fill-accent/20" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border px-2 py-1 rounded text-xs font-medium shadow-lg">
                FoodBank
              </div>
            </div>
          </div>

          {/* Animated truck icon */}
          <div className="absolute top-[40%] left-[35%] animate-pulse">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500">
              <Navigation className="w-5 h-5 text-blue-600 rotate-45" />
            </div>
          </div>

          {/* Route lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(30, 77, 43)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(58, 116, 82)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d="M 20% 30% Q 35% 35%, 55% 45%"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10 5"
              className="animate-pulse"
            />
            <path
              d="M 55% 45% Q 65% 52%, 75% 60%"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10 5"
            />
          </svg>
        </div>
      </div>

      {/* Map overlay info */}
      <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">2 vehicles active</span>
        </div>
      </div>
    </div>
  )
}
