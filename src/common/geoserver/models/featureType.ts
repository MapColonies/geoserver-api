/* eslint-disable @typescript-eslint/naming-convention */
import { GeoserverWorkspace } from './workspace';

interface GeoserverFeatureTypes {
  name: string;
  href: string;
}

interface GeoserverBoundingBox {
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
  crs: string;
}

interface GeoserverStore {
  '@class': string;
  name: string;
  href: string;
}

interface GeoserverAttribute {
  name: string;
  minOccurs: number;
  maxOccurs: number;
  nillable: boolean;
  binding: string;
}

interface GeoserverAttributes {
  attribute: GeoserverAttribute[];
}

interface GeoServerBoundingBox {
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
  crs: string;
}

export interface GeoserverFeatureTypeResponse {
  featureType: {
    name: string;
    nativeName: string;
    namespace: GeoserverWorkspace;
    title: string;
    keywords: {
      string: string[];
    };
    nativeCRS: string;
    srs: string;
    nativeBoundingBox: GeoserverBoundingBox;
    latLonBoundingBox: GeoserverBoundingBox;
    projectionPolicy: string;
    enabled: boolean;
    store: GeoserverStore;
    serviceConfiguration: boolean;
    simpleConversionEnabled: boolean;
    maxFeatures: number;
    numDecimals: number;
    padWithZeros: boolean;
    forcedDecimal: boolean;
    overridingServiceSRS: boolean;
    skipNumberMatched: boolean;
    circularArcPresent: boolean;
    attributes: GeoserverAttributes;
  };
}

export interface GeoserverGetFeatureTypesResponse {
  list: {
    string?: string[];
  };
}

export interface GeoserverGetConfiguredFeatureTypesResponse {
  featureTypes: {
    featureType?: GeoserverFeatureTypes[];
  };
}

export interface GeoserverPostAttribute extends GeoserverAttribute {
  source: string;
}

export interface GeoServerCreateFeatureRequest {
  featureType: {
    name: string;
    nativeName: string;
    srs: string;
    attributes: { attribute: GeoserverPostAttribute[] };
    nativeBoundingBox: GeoServerBoundingBox;
    latLonBoundingBox: GeoServerBoundingBox;
    numDecimals: number;
  };
}
