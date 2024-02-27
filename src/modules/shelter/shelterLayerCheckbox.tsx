import React, { useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { shelterStyle } from "./shelterFeature";

const shelterLayer = new VectorLayer({
  source: new VectorSource({
    url: "/shelter.geojson",
    format: new GeoJSON(),
  }),
  style: shelterStyle,
  className: "shelters",
});

export function ShelterLayerCheckbox() {
  const [checked, setChecked] = useState(true);
  useLayer(shelterLayer, checked);
  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Emerg Shelters
      </label>
    </div>
  );
}
