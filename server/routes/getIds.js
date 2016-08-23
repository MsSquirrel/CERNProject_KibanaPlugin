export default function (server) {

	 server.route({
      path: '/api/proba/getAllIds',
      method: 'GET',
      handler(req, reply) {
        server.plugins.elasticsearch.callWithRequest(req, 'search', {
          index: 'db-metric-*', 
           body: {
            "size": 0,
            "aggs" : {
              "metrics" : {
                "terms" : { "field" : "oracle_sid" }
              }
            }
          } 
          }).then(function (response) {
           reply(response);
        });
      }
    });
};
