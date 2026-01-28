export default {
  serviceConnect: {
    output: {
      mode: 'tags-split',
      target: 'src/services/generated',
      schemas: 'src/services/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
        operations: {
          // Remove /service-connect prefix since it's already in baseURL
          pathParamsSerializer: (params: any) => params,
        },
      },
    },
    input: {
      target: '../backend/openapi.yaml',
      override: {
        transformer: (spec: any) => {
          // Remove /service-connect prefix from all paths
          const newPaths: any = {};
          Object.keys(spec.paths).forEach((path) => {
            const newPath = path.replace(/^\/service-connect/, '');
            newPaths[newPath] = spec.paths[path];
          });
          spec.paths = newPaths;
          return spec;
        },
      },
    },
  },
};
