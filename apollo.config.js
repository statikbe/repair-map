module.exports = {
  client: {
    service: {
      name: 'Repair-Map',
      // URL to the GraphQL API
      url: process.env.REPAIR_MAP_GRAPHQL_HTTP || 'https://ordp-api.vito.be/',
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
};
