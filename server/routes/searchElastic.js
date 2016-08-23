export default function (server) {

	 server.route({
      path: '/api/proba/searchElastic',
      method: 'GET',
      handler(req, reply) {
        server.plugins.elasticsearch.callWithRequest(req, 'search', {
          index: 'db-metric-2016-07-31', 
           body: {
            query: {
              match_all: {} 
             }, 
            filter: {
                range: {
                    BEGIN_TIME: {
                       gte: "2016-08-30T02:00:16+0200"
                    },
                   END_TIME: {
                       lte: "2016-07-31T02:01:16+0200" 
                   } 
                }
            }
          } 
          }).then(function (response) {
           reply(response);
        });
      }
    });
    


    /*server.route({
      path: '/api/proba/searchElastic',
      method: 'GET',
      handler(req, reply) {
        server.plugins.elasticsearch.callWithRequest(req, 'cluster.state', {
          metadata: '_all', 
          index: 'db-metric-2016-07-31' 
        }).then(function (response) {
           reply(response);
        });
      }
    });
  */


   /*server.route({
    path: '/api/proba/searchElastic',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });*/

};
