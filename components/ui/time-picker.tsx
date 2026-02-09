"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string // HH:mm format
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  // Parse current value - default to 12:00 if empty
  const timeValue = value || "12:00"
  const [hours, minutes] = timeValue.split(":").map(Number)
  const hour24 = hours || 12
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24
  const ampm = hour24 >= 12 ? "PM" : "AM"

  const [selectedHour, setSelectedHour] = React.useState(hour12)
  const [selectedMinute, setSelectedMinute] = React.useState(minutes || 0)
  const [selectedAmPm, setSelectedAmPm] = React.useState<"AM" | "PM">(ampm)

  // Refs for scroll containers
  const hourRef = React.useRef<HTMLDivElement>(null)
  const minuteRef = React.useRef<HTMLDivElement>(null)
  const ampmRef = React.useRef<HTMLDivElement>(null)

  // Generate options
  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes60 = Array.from({ length: 60 }, (_, i) => i)

  // Ref to track if we're updating from prop to prevent circular updates
  const isUpdatingFromProp = React.useRef(false)
  const lastEmittedValue = React.useRef<string>("")
  const onChangeRef = React.useRef(onChange)
  
  // Keep onChange ref up to date
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Convert to 24-hour format and update parent (only if value actually changed)
  React.useEffect(() => {
    // Skip if we're updating from prop
    if (isUpdatingFromProp.current) {
      isUpdatingFromProp.current = false
      return
    }

    let hour24 = selectedHour
    if (selectedAmPm === "PM" && selectedHour !== 12) {
      hour24 = selectedHour + 12
    } else if (selectedAmPm === "AM" && selectedHour === 12) {
      hour24 = 0
    }
    const timeString = `${String(hour24).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`
    
    // Only call onChange if the value is different from what we last emitted
    if (timeString !== lastEmittedValue.current) {
      lastEmittedValue.current = timeString
      onChangeRef.current(timeString)
    }
  }, [selectedHour, selectedMinute, selectedAmPm])

  // Update state when value prop changes (only if different from current state)
  React.useEffect(() => {
    const timeValue = value || "12:00"
    
    // Skip if this is the value we just emitted
    if (timeValue === lastEmittedValue.current) {
      return
    }
    
    const [hours, minutes] = timeValue.split(":").map(Number)
    const hour24 = hours || 12
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24
    const ampm = hour24 >= 12 ? "PM" : "AM"
    
    // Only update if values are different
    if (selectedHour !== hour12 || selectedMinute !== (minutes || 0) || selectedAmPm !== ampm) {
      isUpdatingFromProp.current = true
      lastEmittedValue.current = timeValue
      setSelectedHour(hour12)
      setSelectedMinute(minutes || 0)
      setSelectedAmPm(ampm)
    }
  }, [value, selectedHour, selectedMinute, selectedAmPm])

  // Scroll to selected value on mount and when value changes
  React.useEffect(() => {
    if (hourRef.current) {
      const index = hours12.indexOf(selectedHour)
      if (index >= 0) {
        hourRef.current.scrollTop = index * 40
      }
    }
  }, [selectedHour, hours12])

  React.useEffect(() => {
    if (minuteRef.current) {
      minuteRef.current.scrollTop = selectedMinute * 40
    }
  }, [selectedMinute])

  React.useEffect(() => {
    if (ampmRef.current) {
      const index = selectedAmPm === "AM" ? 0 : 1
      ampmRef.current.scrollTop = index * 40
    }
  }, [selectedAmPm])

  // Handle scroll and snap to nearest value
  const handleScroll = (type: "hour" | "minute" | "ampm", ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return

    const scrollTop = ref.current.scrollTop
    const itemHeight = 40
    const index = Math.round(scrollTop / itemHeight)

    if (type === "hour") {
      const newHour = hours12[index] || hours12[0]
      setSelectedHour(newHour)
      // Snap to position
      ref.current.scrollTo({ top: index * itemHeight, behavior: "smooth" })
    } else if (type === "minute") {
      const newMinute = Math.max(0, Math.min(59, index))
      setSelectedMinute(newMinute)
      // Snap to position
      ref.current.scrollTo({ top: newMinute * itemHeight, behavior: "smooth" })
    } else {
      const newAmPm = index === 0 ? "AM" : "PM"
      setSelectedAmPm(newAmPm)
      // Snap to position
      ref.current.scrollTo({ top: index * itemHeight, behavior: "smooth" })
    }
  }

  const handleClick = (type: "hour" | "minute" | "ampm", value: number | "AM" | "PM", ref: React.RefObject<HTMLDivElement>) => {
    if (type === "hour") {
      setSelectedHour(value as number)
      const index = hours12.indexOf(value as number)
      if (ref.current && index >= 0) {
        ref.current.scrollTo({ top: index * 40, behavior: "smooth" })
      }
    } else if (type === "minute") {
      setSelectedMinute(value as number)
      if (ref.current) {
        ref.current.scrollTo({ top: (value as number) * 40, behavior: "smooth" })
      }
    } else {
      setSelectedAmPm(value as "AM" | "PM")
      const index = value === "AM" ? 0 : 1
      if (ref.current) {
        ref.current.scrollTo({ top: index * 40, behavior: "smooth" })
      }
    }
  }

  return (
    <div className={cn("flex items-center gap-1 bg-muted/30 rounded-lg p-3 border", className)}>
      {/* Hour Picker */}
      <div className="flex-1 relative h-40 overflow-hidden">
        {/* Selection indicator overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-t-2 border-b-2 border-primary/30 pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-primary/5 pointer-events-none z-0" />
        
        <div
          ref={hourRef}
          className="h-full overflow-y-scroll scroll-smooth snap-y snap-mandatory hide-scrollbar"
          onScroll={() => handleScroll("hour", hourRef)}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="py-16">
            {hours12.map((hour) => (
              <div
                key={hour}
                className={cn(
                  "h-10 flex items-center justify-center text-lg font-medium cursor-pointer transition-all snap-center",
                  selectedHour === hour
                    ? "text-primary font-bold scale-110"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleClick("hour", hour, hourRef)}
              >
                {String(hour).padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-2xl font-bold text-muted-foreground px-1">:</div>

      {/* Minute Picker */}
      <div className="flex-1 relative h-40 overflow-hidden">
        {/* Selection indicator overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-t-2 border-b-2 border-primary/30 pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-primary/5 pointer-events-none z-0" />
        
        <div
          ref={minuteRef}
          className="h-full overflow-y-scroll scroll-smooth snap-y snap-mandatory hide-scrollbar"
          onScroll={() => handleScroll("minute", minuteRef)}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="py-16">
            {minutes60.map((minute) => (
              <div
                key={minute}
                className={cn(
                  "h-10 flex items-center justify-center text-lg font-medium cursor-pointer transition-all snap-center",
                  selectedMinute === minute
                    ? "text-primary font-bold scale-110"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleClick("minute", minute, minuteRef)}
              >
                {String(minute).padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AM/PM Picker */}
      <div className="flex-1 relative h-40 overflow-hidden">
        {/* Selection indicator overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-t-2 border-b-2 border-primary/30 pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-primary/5 pointer-events-none z-0" />
        
        <div
          ref={ampmRef}
          className="h-full overflow-y-scroll scroll-smooth snap-y snap-mandatory hide-scrollbar"
          onScroll={() => handleScroll("ampm", ampmRef)}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="py-16">
            {(["AM", "PM"] as const).map((ampm) => (
              <div
                key={ampm}
                className={cn(
                  "h-10 flex items-center justify-center text-lg font-medium cursor-pointer transition-all snap-center",
                  selectedAmPm === ampm
                    ? "text-primary font-bold scale-110"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleClick("ampm", ampm, ampmRef)}
              >
                {ampm}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

