import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, Map, MapBrowserEvent, Overlay } from "ol";
import { Polygon } from "ol/geom";
import { Layer } from "ol/layer";
import { Pixel } from "ol/pixel";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { Pointer as PointerInteraction } from "ol/interaction";

const shelterLayer = new VectorLayer({
  source: new VectorSource({
    url: "shelter.json", // Replace with the actual URL to your GeoJSON
    format: new GeoJSON(),
  }),
  style: shelterStyle,
  className: "point",
});

interface ShelterProperties {
  romnr: number;
  plasser: number;
  adresse: string;
}

type ShelterFeature = Feature<Polygon> & {
  getProperties(): ShelterProperties;
};

function shelterStyle(f: FeatureLike) {
  const feature = f as ShelterFeature;
  const shelter = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 0.5 }),
      fill: new Fill({ color: "#2318f5" }),
      radius: 3 + feature.getProperties().plasser / 400,
    }),
  });
}

export function ShelterCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  // const {map, setLayers} = useContext(MapContext);
  const [checked, setChecked] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState<ShelterFeature | null>(
    null,
  );
  const overlayRef = useRef<HTMLDivElement>(null);

  // Hover interaction
  useEffect(() => {
    if (!map) return;

    const hoverInteraction = new PointerInteraction({
      handleMoveEvent: (evt) => {
        const pixel = evt.pixel;
        const feature = map.forEachFeatureAtPixel(pixel, (feature) => {
          // Ensure that the feature is an instance of ol/Feature before returning it
          return feature instanceof Feature ? feature : null;
        });

        // Reset style for all features
        shelterLayer.getSource()?.forEachFeature((f) => f.setStyle(undefined));

        // Set hover style
        if (feature && feature.get("adresse")) {
          feature.setStyle(
            new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: "#dc85ff" }),
                stroke: new Stroke({ color: "#ffeb3b", width: 3 }),
              }),
              text: new Text({
                text:
                  feature.get("adresse") + " Pax: " + feature.get("plasser"),
                offsetY: -15,
                fill: new Fill({ color: "black" }),
                backgroundFill: new Fill({ color: "rgba(255, 255, 255, 0.4)" }),
                padding: [7, 7, 7, 7],
                font: "14px sans-serif",
              }),
            }),
          );
        }
      },
    });

    map.addInteraction(hoverInteraction);

    // Cleanup
    return () => {
      map.removeInteraction(hoverInteraction);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !overlayRef.current) return;

    const overlay = new Overlay({
      element: overlayRef.current,
      autoPan: true,
    });

    map.addOverlay(overlay);

    // Set the overlay to be visible or hidden based on selectedShelter state
    if (selectedShelter) {
      // @ts-ignore
      overlay.setPosition(selectedShelter.getGeometry().getCoordinates());
      overlayRef.current.style.display = "block";
    } else {
      overlay.setPosition(undefined);
      overlayRef.current.style.display = "none";
    }

    // Cleanup function
    return () => {
      if (map) {
        map.removeOverlay(overlay);
      }
    };
  }, [map, selectedShelter]);

  // Hover interaction
  useEffect(() => {
    if (!map) return;

    // @ts-ignore
    const pointerMoveListener = (event: MapBrowserEvent) => {
      const pixel = map.getEventPixel(event.originalEvent);
      const hoveredFeature = map.forEachFeatureAtPixel(
        pixel,
        (feature) => feature,
      );

      if (
        hoveredFeature instanceof Feature &&
        hoveredFeature.getGeometry()?.getType() === "Point"
      ) {
        const properties = hoveredFeature.getProperties() as ShelterProperties;
        // Do something with properties, like displaying them in a sidebar
        console.log(properties.adresse); // Or update a state to show in the sidebar
      }
    };

    map.on("pointermove", pointerMoveListener);

    return () => {
      map.un("pointermove", pointerMoveListener);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const clickListener = (event: { pixel: Pixel }) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
      );

      if (
        feature instanceof Feature &&
        feature.getGeometry() && // Make sure geometry exists
        feature.getGeometry()!.getType() === "Point" // Use non-null assertion since we already checked
      ) {
        setSelectedShelter(feature as unknown as ShelterFeature); // Cast to unknown first if direct cast doesn't work
      } else {
        setSelectedShelter(null);
      }
    };

    map.on("singleclick", clickListener);

    // Cleanup function
    return () => {
      map.un("singleclick", clickListener);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const handleLayerVisibility = () => {
      const layerArray = map.getLayers().getArray();
      const layerIndex = layerArray.indexOf(shelterLayer);

      if (checked && layerIndex === -1) {
        map.addLayer(shelterLayer);
      } else if (!checked && layerIndex !== -1) {
        map.removeLayer(shelterLayer);
      }
    };

    handleLayerVisibility();

    // Cleanup function
    return () => {
      if (map && map.getLayers().getArray().includes(shelterLayer)) {
        map.removeLayer(shelterLayer);
      }
    };
  }, [checked, map]);

  // Update the layers state when the checkbox changes
  useEffect(() => {
    if (checked) {
      setLayers((prevLayers) => [...prevLayers, shelterLayer]);
    } else {
      setLayers((prevLayers) =>
        prevLayers.filter((layer) => layer !== shelterLayer),
      );
    }
  }, [checked, setLayers]);

  return (
    <div className="form-check form-switch">
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckChecked"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} Emergency Shelter
      </label>
    </div>
  );
}
