import { WfsServiceLevel } from '../../enums';

export interface GeoserverWfsModeRequest {
  wfs: {
    serviceLevel: WfsServiceLevel;
  };
}

export interface GeoServerGetWfsModeResponse {
  wfs: {
    enabled: boolean;
    name: string;
    versions: {
      'org.geotools.util.Version': {
        version: string;
      }[];
    };
    citeCompliant: boolean;
    schemaBaseURL: string;
    verbose: boolean;
    metadata: {
      entry: Record<string, string>;
    };
    gml: {
      version: string;
      gml: {
        srsNameStyle: string;
        overrideGMLAttributes: boolean;
      };
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
