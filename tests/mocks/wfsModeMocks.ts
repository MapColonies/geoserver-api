import { WfsServiceLevel } from '../../src/common/enums';

/* eslint-disable @typescript-eslint/naming-convention */
export const GeoServerGetWfsModeResponse = {
  wfs: {
    enabled: true,
    name: 'WFS',
    versions: {
      'org.geotools.util.Version': [
        {
          version: '1.0.0',
        },
        {
          version: '1.1.0',
        },
        {
          version: '2.0.0',
        },
      ],
    },
    citeCompliant: false,
    schemaBaseURL: 'http://schemas.opengis.net',
    verbose: false,
    metadata: {
      entry: {
        '@key': 'maxNumberOfFeaturesForPreview',
        $: '50',
      },
    },
    gml: {
      entry: [
        {
          version: 'V_11',
          gml: {
            srsNameStyle: 'URN',
            overrideGMLAttributes: false,
          },
        },
        {
          version: 'V_20',
          gml: {
            srsNameStyle: 'URN2',
            overrideGMLAttributes: false,
          },
        },
        {
          version: 'V_10',
          gml: {
            srsNameStyle: 'XML',
            overrideGMLAttributes: true,
          },
        },
      ],
    },
    serviceLevel: 'BASIC',
    maxFeatures: 1000,
    featureBounding: true,
    canonicalSchemaLocation: false,
    encodeFeatureMember: false,
    hitsIgnoreMaxFeatures: false,
    includeWFSRequestDumpFile: true,
    allowGlobalQueries: true,
    simpleConversionEnabled: false,
    getFeatureOutputTypeCheckingEnabled: false,
  },
};

export const getWfsModeResponse = {
  serviceLevel: 'BASIC',
  maxFeatures: 1000,
};

export const GeoServerGetWfsModeResponseModified = {
  ...GeoServerGetWfsModeResponse,
  wfs: {
    ...GeoServerGetWfsModeResponse.wfs,
    serviceLevel: 'WRONG',
  },
};

export const putWfsModeRequest = {
  wfs: {
    serviceLevel: 'COMPLETE',
    maxFeatures: 1000,
  },
};

export const updateWfsModeBody = {
  serviceLevel: WfsServiceLevel.COMPLETE,
};
