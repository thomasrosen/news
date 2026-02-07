import { Icon } from "@/components/Icon";
import { DotMarkerContent } from "@/components/map/DotMarkerContent";
import {
  MapMarker,
  MarkerPopup,
  MarkerTooltip
} from "@/components/ui/map";

export async function MarkerPoint({
  name,
  description,
  longitude,
  latitude,
  border = true,
  ping = false,
  color = 'bg-primary',
  icon = null,
}: {
  name?: string,
  description?: string,
  longitude: number,
  latitude: number,
  border?: boolean,
  ping?: boolean,
  color?: string
  icon?: string | null
}) {
  return (<MapMarker
            longitude={longitude}
            latitude={latitude}
          >
            <DotMarkerContent size={icon ? 36 : 20} color={color} border={border} ping={ping}>
              {/* <Zap className="w-full h-full" /> */}
              {icon ? <Icon name={icon} size="md" wght={900} /> : null}
            </DotMarkerContent>

            {name
              ? <>
                <MarkerTooltip>{name}</MarkerTooltip>
                <MarkerPopup
                  closeButton
                  className="w-64 p-4 text-sm flex flex-col gap-0.5"
                >
                  {name && <h3 className="font-semibold">{name}</h3>}
                  {description && <p>{description}</p>}
                  <p className="text-muted-foreground mt-1 text-xs">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                </MarkerPopup>
              </>
              : null
            }
  </MapMarker>)
}
