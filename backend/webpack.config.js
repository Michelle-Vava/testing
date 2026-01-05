module.exports = function (options, webpack) {
  return {
    ...options,
    externals: {
      // Exclude native modules from webpack bundling
      'bcrypt': 'commonjs bcrypt',
      '@prisma/client': 'commonjs @prisma/client',
      'class-transformer': 'commonjs class-transformer',
      'class-validator': 'commonjs class-validator',
    },
  };
};
