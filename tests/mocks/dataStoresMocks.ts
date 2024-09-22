/* eslint-disable @typescript-eslint/naming-convention */
export const geoserverDataStoresResponseMock = {
  dataStores: {
    dataStore: [
      {
        name: 'test_polygon_parts',
        href: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts.json',
      },
      {
        name: 'test_polygon_parts_1',
        href: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts_1.json',
      },
    ],
  },
};

export const getDataStoresResponseMock = [
  {
    name: 'test_polygon_parts',
    link: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts.json',
  },
  {
    name: 'test_polygon_parts_1',
    link: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores/test_polygon_parts_1.json',
  },
];

export const geoserverGetDataStoreResponseMock = {
  dataStore: {
    name: 'polygon_parts',
    connectionParameters: {
      entry: [
        {
          '@key': 'schema',
          $: 'polygon_parts',
        },
        {
          '@key': 'database',
          $: 'postgres',
        },
        {
          '@key': 'port',
          $: '5432',
        },
        {
          '@key': 'validate connections',
          $: 'true',
        },
        {
          '@key': 'passwd',
          $: 'crypt2:x4JGHCLFvtRYDaW3oW0Bh4feLuERwZngJNoxTSFVK3Sp1fA7+ieZACWbGfr4E69o',
        },
        {
          '@key': 'host',
          $: 'localhost',
        },
        {
          '@key': 'dbtype',
          $: 'postgis',
        },
        {
          '@key': 'namespace',
          $: 'http://avi4',
        },
        {
          '@key': 'SSL mode',
          $: 'DISABLE',
        },
        {
          '@key': 'user',
          $: 'postgres',
        },
        {
          '@key': 'Expose primary keys',
          $: 'true',
        },
      ],
    },
    dateCreated: '2024-09-11 06:44:11.551 UTC',
    disableOnConnFailure: true,
    featureTypes: 'http://localhost:8080/geoserver/rest/workspaces/ronit/datastores/good/featuretypes.json',
  },
};

export const getDataStoreResponseMock = {
  name: 'polygon_parts',
  dateCreated: '2024-09-11 06:44:11.551 UTC',
  host: 'localhost',
  port: '5432',
  schema: 'polygon_parts',
  dbType: 'postgis',
  dbName: 'postgres',
  sslMode: 'DISABLE',
};

export const postDataStoreRequest = {
  dataStore: {
    name: 'polygon_parts',
    enabled: false,
    disableOnConnFailure: true,
    connectionParameters: {
      entry: [
        {
          '@key': 'host',
          $: 'localhost',
        },
        {
          '@key': 'port',
          $: '5432',
        },
        {
          '@key': 'database',
          $: 'postgres',
        },
        {
          '@key': 'user',
          $: 'postgres',
        },
        {
          '@key': 'dbtype',
          $: 'postgis',
        },
        {
          '@key': 'schema',
          $: 'polygon_parts',
        },
        {
          '@key': 'SSL mode',
          $: 'DISABLE',
        },
        {
          '@key': 'validate connections',
          $: 'true',
        },
        {
          '@key': 'Expose primary keys',
          $: 'true',
        },
        {
          '@key': 'passwd',
          $: 'mysecretpassword',
        },
      ],
    },
  },
};

export const createDataStoreBody = {
  name: 'polygon_parts',
};

export const putDataStoreRequest = {
  dataStore: {
    name: 'polygon_parts1',
  },
};

export const updateDataStoreBody = {
  name: 'polygon_parts1',
};
