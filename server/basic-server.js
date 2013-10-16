var http = require("http");
var req = require("./request-handler");
var url = require("url");

var requestListener = function (request, response) {
  // console.log("Serving request type " + request.method + " for url " + request.url);
  var path = url.parse(request.url).pathname;
  
  var routes = {
    '/classes/messages/': req
  };

  if(!routes[path]){
    //  Note - need to return 404 here using the helper function
  }else{
    routes[path](request, response);
  }
};

var port = 8080;

var ip = "127.0.0.1";

var server = http.createServer(requestListener);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);