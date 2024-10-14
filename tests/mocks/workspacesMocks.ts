export const geoserverWorkspacesResponseMock = {
  workspaces: {
    workspace: [
      {
        name: 'polygon_parts_new',
        href: 'http://localhost:8080/geoserver/rest/workspaces/polygon_parts_new.json',
      },
      {
        name: 'test',
        href: 'http://localhost:8080/geoserver/rest/workspaces/test.json',
      },
    ],
  },
};

export const geoserverEmptyWorkspacesResponseMock = {
  workspaces: {},
};

export const getWorkspacesResponseMock = [
  {
    name: 'polygon_parts_new',
    link: 'http://localhost:8080/geoserver/rest/workspaces/polygon_parts_new.json',
  },
  {
    name: 'test',
    link: 'http://localhost:8080/geoserver/rest/workspaces/test.json',
  },
];

export const geoserverGetWorkspaceResponseMock = {
  workspace: {
    name: 'test',
    isolated: false,
    dateCreated: '2024-08-27 13:26:36.129 UTC',
    dateModified: '2024-08-28 08:43:59.14 UTC',
    dataStores: 'http://localhost:8080/geoserver/rest/workspaces/test/datastores.json',
    coverageStores: 'http://localhost:8080/geoserver/rest/workspaces/test/coveragestores.json',
    wmsStores: 'http://localhost:8080/geoserver/rest/workspaces/test/wmsstores.json',
    wmtsStores: 'http://localhost:8080/geoserver/rest/workspaces/test/wmtsstores.json',
  },
};

export const getWorkspaceResponseMock = {
  name: 'test',
  dateCreated: '2024-08-27 13:26:36.129 UTC',
};

export const postWorkspaceRequest = {
  workspace: { name: 'test' },
};
