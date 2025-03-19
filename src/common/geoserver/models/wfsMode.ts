import { WfsServiceLevel } from '../../enums';

export interface GeoserverWfsSettingsRequest {
  wfs: {
    serviceLevel: WfsServiceLevel;
    maxFeatures: number;
  };
}

export interface GeoServerGetWfsSettingsResponse {
  wfs: {
    enabled: boolean;
    name: string;
    versions: Record<string, Record<string, string>[]>;
    citeCompliant: boolean;
    schemaBaseURL: string;
    verbose: boolean;
    metadata: {
      entry: Record<string, string>;
    };
    gml: {
      version: string;
      gml: Record<string, string>;
    }[];
    serviceLevel: string;
    maxFeatures: number;
    featureBounding: boolean;
    canonicalSchemaLocation: boolean;
    encodeFeatureMember: boolean;
    hitsIgnoreMaxFeatures: boolean;
    includeWFSRequestDumpFile: boolean;
    allowGlobalQueries: boolean;
    simpleConversionEnabled: boolean;
    getFeatureOutputTypeCheckingEnabled: boolean;
  };
}
