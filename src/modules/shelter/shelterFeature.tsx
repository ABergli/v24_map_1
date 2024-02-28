import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export type ShelterFeature = {
  getProperties(): ShelterProperties;
} & Feature<Point>;

export interface ShelterProperties {
  romnr: number;
  plasser: number;
  adresse: string;
}

export const shelterStyle = (feature: FeatureLike) => {
  const shelter = feature.getProperties() as ShelterProperties;
  return new Style({
    image: new Circle({
      radius: 2 + shelter.plasser / 300,
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white" }),
    }),
  });
};

export const activeShelterStyle = (feature: FeatureLike) => {
  const shelter = feature.getProperties() as ShelterProperties;
  return new Style({
    image: new Circle({
      radius: 2 + shelter.plasser / 300,
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white" }),
    }),
    text: new Text({
      text: shelter.adresse,
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
