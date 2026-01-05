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
      },
    },
    input: {
      target: '../backend/openapi.yaml',
    },
  },
};
