import { DotMarkerContent } from "@/components/map/DotMarkerContent";
import {
  MapMarker,
  MarkerPopup,
  MarkerTooltip
} from "@/components/ui/map";

export async function MarkerPoint({ name,
  longitude,
  latitude,
  border = true,
  ping = false,
  color = 'bg-primary'
}: {
  name?: string,
  longitude: number,
  latitude: number,
  border?: boolean,
  ping?: boolean,
  color?: string
}) {
  return (<MapMarker
            longitude={longitude}
            latitude={latitude}
          >
            <DotMarkerContent size={20} color={color} border={border} ping={ping}>
              {/* <Zap className="w-full h-full" /> */}
            </DotMarkerContent>

            {name
              ? <>
                <MarkerTooltip>{name}</MarkerTooltip>
                <MarkerPopup
                  closeButton
                  className="w-62"
                >
                  <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                </div>
                </MarkerPopup>
              </>
              : null
            }
  </MapMarker>)
}
