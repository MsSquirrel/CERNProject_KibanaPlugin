export default function (server) {

	 server.route({
      path: '/api/proba/getAllMetricNames/{beginDate}',
      method: 'GET',
      handler(req, reply) {
        var indexName = "db-metric-"+req.params.beginDate;

        server.plugins.elasticsearch.callWithRequest(req, 'search', {
          index: indexName, 
           body: {
            "size": 0,
            "aggs" : {
              "metrics" : {
                "terms" : { "size": 0, "field" : "METRIC_NAME" }
              }
            }
          } 
          }).then(function (response) {
           reply(response);
        });
      }
    });
};
