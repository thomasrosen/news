import {
  MarkerContent
} from "@/components/ui/map";
import { cn } from "@/lib/utils";

export function DotMarkerContent({ size, color, ping, border, children }: { size: number, color?: string, ping?: boolean, border?: boolean, children: React.ReactNode }) {
  return (
    <MarkerContent>
              <div className="relative flex items-center justify-center">
                {ping ? <>
                <div
                  className={`absolute rounded-full ${color} opacity-20`}
                  style={{
                    width: size * 1.5,
                    height: size * 1.5,
                  }}
                />
                <div
                  className={`absolute rounded-full ${color} opacity-40 animate-ping`}
                  style={{
                    width: size * 1,
                    height: size * 1,
                    animationDuration: "2s",
                  }}
                />
                </>
                : null}

                <div
                  className={
                    cn(
                      'absolute rounded-full top-[2px] blur-[6px] opacity-50',
                      color
                    )
                  }
                  style={{ width: size, height: size }}
                />

                <div
                  className={
                    cn(
                      'relative rounded-full flex items-center justify-center shadow-lg',
                      border && 'border-2 border-white',
                      color
                    )
                  }
                  style={{ width: size, height: size }}
                >
                  <div className="text-white fill-white flex items-center justify-center text-xs font-semibold" style={{
                    width: size * 0.5,
                    height: size * 0.5,
                  }}>
                    {children}
                    
                  </div>
                </div>
              </div>
            </MarkerContent>
  )
}
