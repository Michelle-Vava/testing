export default {
  shanda: {
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      schemas: 'src/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
        operations: {
          // Remove /shanda prefix since it's already in baseURL
          pathParamsSerializer: (params: any) => params,
        },
      },
    },
    input: {
      target: '../backend/openapi.yaml',
      override: {
        transformer: (spec: any) => {
          // Remove /shanda prefix from all paths
          const newPaths: any = {};
          Object.keys(spec.paths).forEach((path) => {
            const newPath = path.replace(/^\/shanda/, '');
            newPaths[newPath] = spec.paths[path];
          });
          spec.paths = newPaths;
          return spec;
        },
      },
    },
  },
};
