import { cn } from "@/lib/utils"

export function TestComponent() {
  return (
    <div className={cn(
      "rounded-lg border p-4",
      "bg-card text-card-foreground",
      "shadow-sm"
    )}>
      <h2 className="text-lg font-semibold">Test Component</h2>
      <p className="text-muted-foreground">
        This component uses the cn() helper from @/lib/utils
      </p>
    </div>
  )
}
