import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { GeoJSON } from "ol/format";
import { Map, MapBrowserEvent, Feature, Overlay } from "ol";
import { Polygon } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

interface DistrictProperties {
  url: string;
  navn: string;
}

type DistrictFeature = Feature<Polygon> & {
  getProperties(): DistrictProperties;
};

const districtSource = new VectorSource<DistrictFeature>({
  url: "district.json",
  format: new GeoJSON(),
});

// Change color dynamically based on some property of features
const districtStyle = (feature: FeatureLike, resolution: number) => {
  return new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1.5,
    }),
    text: new Text({
      font: "17px Calibri,sans-serif",
      text: feature.get("navn"),
      fill: new Fill({
        color: "#000",
      }),
      backgroundFill: new Fill({
        color: "#fffff",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 3,
      }),
      padding: [3, 3, 3, 3],
    }),
  });
};

//  create a VectorLayer using the source
const districtLayer = new VectorLayer({
  source: districtSource,
  style: districtStyle,
  className: "civil",
});

export function DistrictLayerCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, [overlay, map]);

  const [selectedDistrict, setSelectedDistrict] = useState<
    DistrictFeature | undefined
  >();

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedFeatures = districtSource.getFeaturesAtCoordinate(
      e.coordinate,
    ) as DistrictFeature[];
    if (clickedFeatures.length === 1) {
      setSelectedDistrict(clickedFeatures[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedDistrict(undefined);
    }
  }

  useEffect(() => {
    // Only add the layer when it is not on the map
    if (checked) {
      if (!map.getLayers().getArray().includes(districtLayer)) {
        map.addLayer(districtLayer);
      }
      map.on("click", handleClick);
    } else {
      if (map.getLayers().getArray().includes(districtLayer)) {
        map.removeLayer(districtLayer);
      }
      map.un("click", handleClick);
    }

    // Clen up function to remove layer and click handler when the componenets unmounts
    return () => {
      if (map.getLayers().getArray().includes(districtLayer)) {
        map.removeLayer(districtLayer);
      }
      map.un("click", handleClick); // Always detach click event listener when cleaning up
    };
  }, [checked, map, setLayers]);

  useEffect(() => {
    if (checked) {
      // Add the kommuneLayer when checkbox is checked
      setLayers((prevLayers) => [...prevLayers, districtLayer]);
    } else {
      // Remove the kommuneLayer when checkbox is unchecked
      setLayers((prevLayers) =>
        prevLayers.filter((layer) => layer !== districtLayer),
      );
    }
  }, [checked, setLayers]);

  return (
    <div className={"district-layer-checkbox"}>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type={"checkbox"}
          id="flexSwitchCheckChecked"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckCheckedr">
          {checked ? " Hide" : " Show"} Civil Defense Regions
        </label>
      </div>
    </div>
  );
}
