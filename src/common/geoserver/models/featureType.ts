interface GeoserverFeatureTypes {
  name: string;
  href: string;
}

export interface GeoserverGetFeatureTypesResponse {
  list: {
    string: string[];
  };
}
