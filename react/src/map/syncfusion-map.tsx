import {
  MapsComponent,
  LayersDirective,
  LayerDirective,
  Inject,
  Zoom,
} from "@syncfusion/ej2-react-maps";

export function Map() {
  return (
    <MapsComponent
      zoomSettings={{
        enable: true,
        toolbars: ["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"],
      }}
      style={{
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
      }}
    >
      <Inject services={[Zoom]} />
      <LayersDirective>
        <LayerDirective urlTemplate="https://tile.openstreetmap.org/level/tileX/tileY.png" />
      </LayersDirective>
    </MapsComponent>
  );
}
