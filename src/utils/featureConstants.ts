import { GeoserverPostAttribute } from '../common/geoserver/models/featureType';
import { getConfig } from '../common/config';

export const getSrs = (): string => getConfig().get('geoserver.srs') as unknown as string;

export const getNumOfDecimals = (): number => getConfig().get('geoserver.numOfDecimals') as unknown as number;

export const getBoundingBox = (): { minx: number; maxx: number; miny: number; maxy: number; crs: string } => {
  const srs = getSrs();
  return {
    minx: -180,
    maxx: 180,
    miny: -90,
    maxy: 90,
    crs: srs,
  };
};

export const attributesMapping = [
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
    name: 'ingestionDateUTC',
    minOccurs: 1,
    maxOccurs: 1,
    nillable: false,
    binding: 'java.sql.Timestamp',
    source: 'ingestion_date_utc',
  },
  {
    name: 'imagingTimeBeginUTC',
    minOccurs: 1,
    maxOccurs: 1,
    nillable: false,
    binding: 'java.sql.Timestamp',
    source: 'imaging_time_begin_utc',
  },
  {
    name: 'imagingTimeEndUTC',
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
    source: 'horizontal_accuracy_ce90',
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
    name: 'footprint',
    minOccurs: 1,
    maxOccurs: 1,
    nillable: false,
    binding: 'org.locationtech.jts.geom.Polygon',
    source: 'footprint',
  },
] as GeoserverPostAttribute[];
