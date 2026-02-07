import { Card } from "@/components/ui/card";
import {
  Map,
  MapControls
} from "@/components/ui/map";

export function MapCard (props: React.ComponentProps<typeof Map>) {
    return <Card className="h-[400px] w-full p-0 overflow-hidden">
      <Map {...props}>
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {props.children}
      </Map>
    </Card>
  }
