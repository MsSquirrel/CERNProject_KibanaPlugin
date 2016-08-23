export default function (server) {

	 server.route({
      path: '/api/proba/getQueryData/{metricName}/{id}/{startDate}/{endDate}/{interval}',
      method: 'GET',
      handler(req, reply) {
      
        var metricName = req.params.metricName; 
        var id = req.params.id;
        var startDate  = req.params.startDate;
        var endDate = req.params.endDate;
        var interval = req.params.interval;

        var query = "METRIC_NAME: \""+metricName+"\"";
        
        server.plugins.elasticsearch.callWithRequest(req, 'search', {
          index: 'db-metric-*', 
           body:
              {
                "size": 0,
                "aggs": {
                  "aggQueryData": {
                    "date_histogram": {
                      "field": "END_TIME",
                      "interval": interval,
                      "time_zone": "Europe/Berlin",
                      "min_doc_count": 1
                    },
                    "aggs": {
                      "avg_value": {
                        "avg": {
                          "field": "VALUE"
                        }
                      }
                    }
                  }
                },
                "query": {
                  "filtered": {
                    "query": {
                      "query_string": {
                        "query": query,  
                        "analyze_wildcard": true
                      }
                    },
                    "filter": {
                      "bool": {
                        "must": [
                          {
                            "range": {
                              "END_TIME": {
                                "gte": startDate,
                                "lte": endDate,
                                "format": "yyyy-MM-dd"
                              }
                            }
                          }, 
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
