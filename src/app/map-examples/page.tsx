'use client'

import { DotMarkerContent } from "@/components/DotMarkerContent";
import { Card } from "@/components/ui/card";
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerPopup,
  MarkerTooltip
} from "@/components/ui/map";
import { Zap } from "lucide-react";
import { useState } from "react";

const locations = [
  {
    id: 1,
    name: "Empire State Building",
    lng: -73.9857,
    lat: 40.7484,
  },
  {
    id: 2,
    name: "Central Park",
    lng: -73.9654,
    lat: 40.7829,
  },
  { id: 3, name: "Times Square", lng: -73.9855, lat: 40.758 },
  { id: 4, name: "NYC City Hall", lng: -74.006, lat: 40.7128 },
  { id: 5, name: "Grand Central Terminal", lng: -73.9772, lat: 40.7527 },
];

const route = [
  [-74.006, 40.7128], // NYC City Hall
  [-73.9857, 40.7484], // Empire State Building
  [-73.9772, 40.7527], // Grand Central Terminal
  [-73.9654, 40.7829], // Central Park
] as [number, number][];

const stops = [
  { name: "City Hall", lng: -74.006, lat: 40.7128 },
  { name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { name: "Grand Central Terminal", lng: -73.9772, lat: 40.7527 },
  { name: "Central Park", lng: -73.9654, lat: 40.7829 },
];

interface EarthquakeProperties {
  mag: number;
  place: string;
  tsunami: number;
}


export default function MyMap() {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: EarthquakeProperties;
  } | null>(null);

  return (<div className="flex flex-col gap-8">
    <Card className="h-[400px] p-0 overflow-hidden">
      <Map center={[-73.9772, 40.7527]} zoom={11}></Map>
    </Card>


    <Card className="h-[400px] p-0 overflow-hidden">
      <Map center={[-73.9772, 40.7527]} zoom={11}>
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {locations.map((location) => {
          const size = 10 + Math.random() * 40;
          return (<MapMarker
            key={location.id}
            longitude={location.lng}
            latitude={location.lat}
          >
            <DotMarkerContent size={size} color="bg-emerald-500" border={false} ping={true}>
              <Zap className="w-full h-full" />
            </DotMarkerContent>

            <MarkerTooltip>{location.name}</MarkerTooltip>
            <MarkerPopup
              closeButton
              className="w-62"
            >
              <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{location.name}</h3>
              <p className="text-sm text-muted-foreground">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            </div>
            </MarkerPopup>
          </MapMarker>)
    })}
      </Map>
    </Card>

    <Card className="h-[400px] p-0 overflow-hidden">
      <Map center={[-73.9772, 40.7527]} zoom={11}>
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        <MapRoute coordinates={route} color="#447dfc" width={4} opacity={0.8} />

        {stops.map((stop, index) => (
          <MapMarker key={stop.name} longitude={stop.lng} latitude={stop.lat}>
            <DotMarkerContent size={24} color="bg-blue-500" border={true} ping={false}>
              {index + 1}
            </DotMarkerContent>
            <MarkerTooltip>{stop.name}</MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </Card>


    <Card className="h-[400px] p-0 overflow-hidden">
      <Map center={[-73.9772, 40.7527]} zoom={2}>
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        <MapClusterLayer<EarthquakeProperties>
          data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
          clusterRadius={50}
          clusterMaxZoom={14}
          clusterColors={["#44ba82", "#ef7213", "#e74341"]}
          pointColor="#447dfc"
          onPointClick={(feature, coordinates) => {
            setSelectedPoint({
              coordinates,
              properties: feature.properties,
            });
          }}
        />

        {selectedPoint && (
          <MapPopup
            key={`${selectedPoint.coordinates[0]}-${selectedPoint.coordinates[1]}`}
            longitude={selectedPoint.coordinates[0]}
            latitude={selectedPoint.coordinates[1]}
            onClose={() => setSelectedPoint(null)}
            closeOnClick={false}
            focusAfterOpen={false}
            closeButton
          >
            <div className="space-y-1 p-1">
              <p className="text-sm">
                Magnitude: {selectedPoint.properties.mag}
              </p>
              <p className="text-sm">
                Tsunami:{" "}
                {selectedPoint.properties?.tsunami === 1 ? "Yes" : "No"}
              </p>
            </div>
          </MapPopup>
        )}
      </Map>
    </Card>

    </div>
  );
}
