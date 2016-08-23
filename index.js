//import exampleRoute from './server/routes/example';
//import elasticRoute from './server/routes/elasticRoute';
import searchElastic from './server/routes/searchElastic';
import dbMetricRoute from './server/routes/dbMetricRoute';
import getIds from './server/routes/getIds';
import getMetricNames from './server/routes/getMetricNames';
import getFilteredData from './server/routes/getFilteredData';
import getQueryData from './server/routes/getQueryData';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],

    uiExports: {
      app: {
        title: 'DBVis',
        description: 'An awesome Kibana plugin',
        main: 'plugins/proba/app',
		injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion')
          };
        }
      }
    },

    init(server, options) {
      //exampleRoute(server);
      //elasticRoute(server);
      searchElastic(server);
      dbMetricRoute(server);
      getIds(server);
      getMetricNames(server);
      getFilteredData(server);
      getQueryData(server);
    }

  });
};
