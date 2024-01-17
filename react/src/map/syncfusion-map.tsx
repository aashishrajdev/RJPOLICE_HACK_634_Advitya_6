/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MapsComponent,
  LayersDirective,
  LayerDirective,
  Zoom,
  MarkersDirective,
  MarkerDirective,
  Marker,
  Inject,
} from "@syncfusion/ej2-react-maps";

export function Map() {
  return (
    <MapsComponent
      zoomSettings={{
        enable: true,
        toolbars: ["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"],
      }}
      centerPosition={{
        latitude: 26.632249315117004,
        longitude: 76.46834997581011,
      }}
    >
      <Inject services={[Marker, Zoom]} />
      <LayersDirective>
        <LayerDirective urlTemplate="https://tile.openstreetmap.org/level/tileX/tileY.png">
          <MarkersDirective>
            <MarkerDirective
              visible={true}
              height={25}
              width={15}
              dataSource={[
                {
                  latitude: 26.6322,
                  longitude: 76.468,
                  name: "Kota",
                },
                {
                  latitude: 26.4499,
                  longitude: 74.6399,
                  name: "Ajmer",
                },
              ]}
            ></MarkerDirective>
          </MarkersDirective>
        </LayerDirective>
      </LayersDirective>
    </MapsComponent>
  );
}
