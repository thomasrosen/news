import { cn } from "@/lib/utils";

export function Box ({ children, wide = false, inset = true, className, ...props }: {
  children: React.ReactNode,
  wide?: boolean
  inset?: boolean
  className?: string
}) {
  return <div {...props} role="group" className={cn(
    'my-6 relative flex flex-col justify-center left-1/2 w-screen -translate-x-1/2',
    wide === true && 'ring-foreground/10 bg-card text-card-foreground ring-1',
    wide === true && className
  )}>
    {
      inset === true || wide === false
        ? <div className={cn(
          'w-full max-w-xl mx-auto p-6 space-y-3',
          wide === false && 'ring-foreground/10 bg-card text-card-foreground rounded-xl shadow-xs ring-1',
          wide === false && className
        )}>
          {children}
        </div>
        : children
    }
  </div>
}
