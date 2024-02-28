import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import "./application.css";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import { Layer } from "ol/layer";
import { map, MapContext } from "../map/mapContext";
import { DistrictLayerCheckbox } from "../district/DistrictLayerCheckbox";
import { KommuneLayerCheckbox } from "../kommune/KommuneLayerCheckbox";
import { ShelterCheckbox } from "../shelter/shelterCheckbox";

// To make the map show Oslo
useGeographic();

export function Application() {
  // Display Focus Mode
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 10,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
    }
  }, []);

  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light bg-primary bg-opacity-50">
        <div className="container-fluid">
          <a className="navbar-brand text-light fw-semibold">Map Assignment</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn btn-light me-2 bg-primary  text-light"
                  onClick={handleFocusUser}
                >
                  Near Me
                </button>
              </li>
              <li className="nav-item">
                <KommuneLayerCheckbox map={map} setLayers={setLayers} />
                <DistrictLayerCheckbox map={map} setLayers={setLayers} />
                <ShelterCheckbox map={map} setLayers={setLayers} />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/*<div ref={mapRef}>Map goes here</div>*/}
      <main>
        <div ref={mapRef} className="map-container"></div>
      </main>
    </>
  );
}
