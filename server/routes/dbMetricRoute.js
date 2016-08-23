export default function (server) {

	 server.route({
      path: '/api/proba/dbMetric/{date}',
      method: 'GET',
      handler(req, reply) {
        var indexName = "db-metric-"+req.params.date;
        server.plugins.elasticsearch.callWithRequest(req, 'search', {
          index: indexName, 
           body: {
            size: "10000", 
            query: {
              match_all: {} 
             }
            }  
          }).then(function (response) {
           reply(response);
        });
      }
    });
    
};
