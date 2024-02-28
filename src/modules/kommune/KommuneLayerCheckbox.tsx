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
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { Pointer as PointerInteraction } from "ol/interaction";

type KommuneProperties = {
  kommunenummer: string;
  navn: {
    sprak: string;
    navn: string;
  }[];
};

type KommuneFeature = Feature<Polygon> & {
  getProperties(): KommuneProperties;
};

const kommuneSource = new VectorSource<KommuneFeature>({
  url: "kommuner.json",
  format: new GeoJSON(),
});

// Change color dynamically based on some property of features
const kommuneStyle = (feature: FeatureLike) => {
  // Extract the Norwegian name (assuming 'nor' is the code for Norwegian)
  const nameObject = feature
    .getProperties()
    .navn.find((n: { sprak: string }) => n.sprak === "nor");
  const name = nameObject ? nameObject.navn : "";

  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 1,
    }),
    text: new Text({
      font: "17px Calibri,sans-serif",
      text: name,
      fill: new Fill({
        color: "#000",
      }),
    }),
  });
};

const kommuneLayer = new VectorLayer({
  source: kommuneSource,
  style: kommuneStyle,
  className: "kommune",
});

export function KommuneLayerCheckbox({
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
  }, []);

  const [selectedKommune, setSelectedKommune] = useState<
    KommuneFeature | undefined
  >();

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedKommune = kommuneSource.getFeaturesAtCoordinate(
      e.coordinate,
    ) as KommuneFeature[];
    if (clickedKommune.length === 1) {
      setSelectedKommune(clickedKommune[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedKommune(undefined);
    }
  }

  // To ensure that the overlay with the kommune name is played when feature is clicked
  useEffect(() => {
    // Only add the layer when it is not on the map
    if (checked) {
      if (!map.getLayers().getArray().includes(kommuneLayer)) {
        map.addLayer(kommuneLayer);
      }
      map.on("click", handleClick);
    } else {
      if (map.getLayers().getArray().includes(kommuneLayer)) {
        map.removeLayer(kommuneLayer);
      }
      map.un("click", handleClick);
    }

    // Clean up function to remove layer rand click handler when the components unmounts
    return () => {
      if (map.getLayers().getArray().includes(kommuneLayer)) {
        map.removeLayer(kommuneLayer);
      }
      map.un("click", handleClick); // Always detach click event listener when cleaning up
    };
  }, [checked, map, setLayers]);

  useEffect(() => {
    if (checked) {
      setLayers((prevLayers) => [...prevLayers, kommuneLayer]);
    } else {
      setLayers((prevLayers) =>
        prevLayers.filter((layer) => layer !== kommuneLayer),
      );
    }
  }, [checked, setLayers]);

  return (
    <div className={"kommune-layer-checkbox"}>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type={"checkbox"}
          id="flexSwitchCheckChecked"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
          {checked ? " Hide" : " Show"} kommune layer
        </label>
      </div>
    </div>
  );
}
