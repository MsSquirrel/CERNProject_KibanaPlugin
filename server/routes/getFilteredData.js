export default function (server) {

	 server.route({
      path: '/api/proba/getFilteredData/{metricName}/{id}/{startDate}/{endDate}',
      method: 'GET',
      handler(req, reply) {
        var metricName = req.params.metricName; 
        var id = req.params.id;
        var startDate  = req.params.startDate;
        var endDate = req.params.endDate;
        server.plugins.elasticsearch.callWithRequest(req, 'search', {
          index: 'db-metric-*', 
           body: {
            size: 1000,
            "query": {
              "bool": {
                "must" : [
                  {
                   "term": {
                      "METRIC_NAME": metricName
                    }
                  },
                  {
                   "term": {
                      "oracle_sid": id
                    }
                  }
                ]
              }
            }, 
            filter: {
                range: {
                    BEGIN_TIME: {
                       gte: startDate
                    },
                   END_TIME: {
                       lte: endDate 
                   } 
                }
            }
          }
  
          }).then(function (response) {
           reply(response);
        });
      }
    });
};
