import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export type ShelterFeature = {
  getProperties(): ShelterProperties;
} & Feature<Point>;

export interface ShelterProperties {
  navn: string;
  antall_elever: number;
  antall_ansatte: number;
  laveste_trinn: number;
  hoyeste_trinn: number;
  eierforhold: "Offentlig" | "Privat";
  kommunenummer: string;
}

export const shelterStyle = (feature: FeatureLike) => {
  const shelter = feature.getProperties() as ShelterProperties;
  return new Style({
    image: new Circle({
      radius: 2 + shelter.antall_elever / 150,
      fill:
        shelter.eierforhold === "Offentlig"
          ? new Fill({ color: "blue" })
          : new Fill({ color: "purple" }),
      stroke: new Stroke({ color: "white" }),
    }),
  });
};

export const activeShelterStyle = (feature: FeatureLike) => {
  const shelter = feature.getProperties() as ShelterProperties;
  return new Style({
    image: new Circle({
      radius: 2 + shelter.antall_elever / 150,
      fill:
        shelter.eierforhold === "Offentlig"
          ? new Fill({ color: "blue" })
          : new Fill({ color: "purple" }),
      stroke: new Stroke({ color: "white", width: 3 }),
    }),
    text: new Text({
      text: shelter.navn,
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
