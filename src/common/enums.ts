export enum SslMode {
  DISABLE = 'DISABLE',
  ALLOW = 'ALLOW',
  PREFER = 'PREFER',
  REQUIRE = 'REQUIRE',
  VERIFY_CA = 'VERIFY_CA',
  VERIFY_FULL = 'VERIFY_FULL',
}

export enum DbType {
  POSTGIS = 'postgis',
}

export enum ListParam {
  ALL = 'all',
  CONFIGURED = 'configured',
  AVAILABLE = 'available',
  AVAILABLE_WITH_GEOM = 'available_with_geom',
}

export enum WfsServiceLevel {
  BASIC = 'BASIC',
  TRANSACTIONAL = 'TRANSACTIONAL',
  COMPLETE = 'COMPLETE',
}
