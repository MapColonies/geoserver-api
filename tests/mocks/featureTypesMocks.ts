/* eslint-disable @typescript-eslint/naming-convention */

export const geoserverFeatureTypesListAllResponseMock = {
  list: {
    string: ['polygon_parts', 'best_feature', 'another_table'],
  },
};

export const geoserverFeatureTypesListConfiguredResponseMock = {
  featureTypes: {
    featureType: [
      {
        name: 'best_feature',
        href: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts/featuretypes/best_feature.json',
      },
      {
        name: 'polygon_parts',
        href: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts/featuretypes/polygon_parts.json',
      },
    ],
  },
};

export const featureTypesListAllResponseMock = [
  {
    name: 'polygon_parts',
  },
  {
    name: 'best_feature',
  },
  {
    name: 'another_table',
  },
];

export const featureTypesListConfiguredResponseMock = [
  {
    name: 'best_feature',
    link: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts/featuretypes/best_feature.json',
  },
  {
    name: 'polygon_parts',
    link: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts/featuretypes/polygon_parts.json',
  },
];

export const geoserverGetFeatureTypeResponseMock = {
  featureType: {
    name: 'bestFeature',
    nativeName: 'bestStore',
    namespace: {
      name: 'test',
      href: 'http://localhost:8080/geoserver/rest/namespaces/test.json',
    },
    title: 'polygon_parts',
    keywords: {
      string: ['features', 'polygon_parts'],
    },
    srs: 'EPSG:4326',
    nativeBoundingBox: {
      minx: -180,
      maxx: 180,
      miny: -90,
      maxy: 90,
      crs: 'EPSG:4326',
    },
    latLonBoundingBox: {
      minx: -180,
      maxx: 180,
      miny: -90,
      maxy: 90,
      crs: 'EPSG:4326',
    },
    projectionPolicy: 'FORCE_DECLARED',
    enabled: false,
    store: {
      '@class': 'dataStore',
      name: 'test:bestStore',
      href: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/bestStore.json',
    },
    serviceConfiguration: false,
    internationalTitle: '',
    internationalAbstract: '',
    maxFeatures: 0,
    numDecimals: 0,
    padWithZeros: false,
    forcedDecimal: false,
    overridingServiceSRS: false,
    skipNumberMatched: false,
    circularArcPresent: false,
    attributes: {
      attribute: [
        {
          name: 'id',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.util.UUID',
        },
        {
          name: 'catalogId',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.util.UUID',
          source: 'catalog_id',
        },
        {
          name: 'productId',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'product_id',
        },
        {
          name: 'productType',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'product_type',
        },
        {
          name: 'sourceId',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'source_id',
        },
        {
          name: 'sourceName',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'source_name',
        },
        {
          name: 'productVersion',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'product_version',
        },
        {
          name: 'ingestionDateUtc',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.sql.Timestamp',
          source: 'ingestion_date_utc',
        },
        {
          name: 'imagingTimeBeginUtc',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.sql.Timestamp',
          source: 'imaging_time_begin_utc',
        },
        {
          name: 'imagingTimeEndUtc',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.sql.Timestamp',
          source: 'imaging_time_end_utc',
        },
        {
          name: 'resolutionDegree',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.math.BigDecimal',
          source: 'resolution_degree',
        },
        {
          name: 'resolutionMeter',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.math.BigDecimal',
          source: 'resolution_meter',
        },
        {
          name: 'sourceResolutionMeter',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.math.BigDecimal',
          source: 'source_resolution_meter',
        },
        {
          name: 'horizontalAccuracyCe90',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.Float',
          source: 'horizontal_accuracy_ce_90',
        },
        {
          name: 'sensors',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'sensors',
        },
        {
          name: 'countries',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'countries',
        },
        {
          name: 'cities',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'cities',
        },
        {
          name: 'description',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'description',
        },
        {
          name: 'geometry',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'org.locationtech.jts.geom.Polygon',
          source: 'geometry',
        },
      ],
    },
  },
};

export const getFeatureTypeResponseMock = {
  name: 'bestFeature',
  enabled: false,
  srs: 'EPSG:4326',
  tableName: 'bestStore',
  maxFeatures: 0,
  attributes: {
    attribute: [
      {
        name: 'id',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.util.UUID',
      },
      {
        name: 'catalogId',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.util.UUID',
        source: 'catalog_id',
      },
      {
        name: 'productId',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.lang.String',
        source: 'product_id',
      },
      {
        name: 'productType',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.lang.String',
        source: 'product_type',
      },
      {
        name: 'sourceId',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: true,
        binding: 'java.lang.String',
        source: 'source_id',
      },
      {
        name: 'sourceName',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.lang.String',
        source: 'source_name',
      },
      {
        name: 'productVersion',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.lang.String',
        source: 'product_version',
      },
      {
        name: 'ingestionDateUtc',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.sql.Timestamp',
        source: 'ingestion_date_utc',
      },
      {
        name: 'imagingTimeBeginUtc',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.sql.Timestamp',
        source: 'imaging_time_begin_utc',
      },
      {
        name: 'imagingTimeEndUtc',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.sql.Timestamp',
        source: 'imaging_time_end_utc',
      },
      {
        name: 'resolutionDegree',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.math.BigDecimal',
        source: 'resolution_degree',
      },
      {
        name: 'resolutionMeter',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.math.BigDecimal',
        source: 'resolution_meter',
      },
      {
        name: 'sourceResolutionMeter',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.math.BigDecimal',
        source: 'source_resolution_meter',
      },
      {
        name: 'horizontalAccuracyCe90',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.lang.Float',
        source: 'horizontal_accuracy_ce_90',
      },
      {
        name: 'sensors',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: false,
        binding: 'java.lang.String',
        source: 'sensors',
      },
      {
        name: 'countries',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: true,
        binding: 'java.lang.String',
        source: 'countries',
      },
      {
        name: 'cities',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: true,
        binding: 'java.lang.String',
        source: 'cities',
      },
      {
        name: 'description',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: true,
        binding: 'java.lang.String',
        source: 'description',
      },
      {
        name: 'geometry',
        minOccurs: 1,
        maxOccurs: 1,
        nillable: false,
        binding: 'org.locationtech.jts.geom.Polygon',
        source: 'geometry',
      },
    ],
  },
};

export const geoserverPostFeatureTypeRequestMock = {
  featureType: {
    name: 'best_feature',
    nativeName: 'best_feature',
    srs: 'EPSG:4326',
    nativeBoundingBox: {
      minx: -180,
      maxx: 180,
      miny: -90,
      maxy: 90,
      crs: 'EPSG:4326',
    },
    latLonBoundingBox: {
      minx: -180,
      maxx: 180,
      miny: -90,
      maxy: 90,
      crs: 'EPSG:4326',
    },
    attributes: {
      attribute: [
        {
          name: 'id',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.util.UUID',
        },
        {
          name: 'catalogId',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.util.UUID',
          source: 'catalog_id',
        },
        {
          name: 'productId',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'product_id',
        },
        {
          name: 'productType',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'product_type',
        },
        {
          name: 'sourceId',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'source_id',
        },
        {
          name: 'sourceName',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'source_name',
        },
        {
          name: 'productVersion',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'product_version',
        },
        {
          name: 'ingestionDateUtc',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.sql.Timestamp',
          source: 'ingestion_date_utc',
        },
        {
          name: 'imagingTimeBeginUtc',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.sql.Timestamp',
          source: 'imaging_time_begin_utc',
        },
        {
          name: 'imagingTimeEndUtc',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.sql.Timestamp',
          source: 'imaging_time_end_utc',
        },
        {
          name: 'resolutionDegree',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.math.BigDecimal',
          source: 'resolution_degree',
        },
        {
          name: 'resolutionMeter',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.math.BigDecimal',
          source: 'resolution_meter',
        },
        {
          name: 'sourceResolutionMeter',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.math.BigDecimal',
          source: 'source_resolution_meter',
        },
        {
          name: 'horizontalAccuracyCe90',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.Float',
          source: 'horizontal_accuracy_ce_90',
        },
        {
          name: 'sensors',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: false,
          binding: 'java.lang.String',
          source: 'sensors',
        },
        {
          name: 'countries',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'countries',
        },
        {
          name: 'cities',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'cities',
        },
        {
          name: 'description',
          minOccurs: 0,
          maxOccurs: 1,
          nillable: true,
          binding: 'java.lang.String',
          source: 'description',
        },
        {
          name: 'geometry',
          minOccurs: 1,
          maxOccurs: 1,
          nillable: false,
          binding: 'org.locationtech.jts.geom.Polygon',
          source: 'geometry',
        },
      ],
    },
  },
};

export const postFeatureTypeRequestMock = {
  nativeName: 'best_feature',
};
