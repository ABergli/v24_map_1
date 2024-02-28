import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";

const districtLayer = new VectorLayer({
  className: "district",
  source: new VectorSource({
    url: "./district.json",
    format: new GeoJSON(),
  }),
});

export function DistrictLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  useLayer(districtLayer, checked);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} civil defence regions
      </label>
    </div>
  );
}
