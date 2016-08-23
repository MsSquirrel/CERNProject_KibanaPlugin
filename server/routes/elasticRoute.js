export default function (server) {
  server.route({
      path: '/api/proba/elasticRouteTest/index/{name}',
      method: 'GET',
      handler(req, reply) {
     		//var t = "Neki teeekst...";	 
        //reply({ res: t });
        server.plugins.elasticsearch.callWithRequest(req, 'cluster.state', {
          metric: '_all',
          index: req.params.name
        }).then(function (response) {
           reply(response.metadata.indices[req.params.name]);
        });
      }
    });


  server.route({
      path: '/api/proba/elasticRouteTest/{name}/{type}/{id}/',
      method: 'GET',
      handler(req, reply) {
        //var t = "Neki teeekst...";   
        //reply({ res: t });
        server.plugins.elasticsearch.callWithRequest(req, 'get', {
          index: req.params.name, 
          type: req.params.type,
          id: req.params.id
        }).then(function (response) {
           reply(response);
        });
      }
    });
  
};
