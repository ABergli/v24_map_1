import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { SchoolLayerCheckbox } from "../school/schoolLayerCheckbox";
import { ShelterLayerCheckbox } from "../shelter/shelterLayerCheckbox";
import { DistrictLayerCheckbox } from "../district/districtLayerCheckbox";
import { KommuneAside } from "../kommune/kommuneAside";
import { SchoolAside } from "../school/schoolAside";
import { ShelterAside } from "../shelter/shelterAside";
import { DistrictAside } from "../district/districtAside";

export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header>
        <h1>MAP Assignment:</h1>
      </header>
      <nav>
        <a href={"#"} onClick={handleFocusUser}>
          Center
        </a>
        <KommuneLayerCheckbox />
        <SchoolLayerCheckbox />
        <DistrictLayerCheckbox />
        <ShelterLayerCheckbox />
      </nav>
      <main>
        {/* Display map */}
        <div ref={mapRef}></div>
        {/* side bars with additional info
        <KommuneAside />
        <SchoolAside />
        <DistrictAside />
        <ShelterAside />
        */}
      </main>
    </MapContext.Provider>
  );
}
