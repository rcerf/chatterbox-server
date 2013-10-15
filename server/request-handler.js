/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var _underscore = require("../node_modules/underscore/underscore-min.js");
var _results = [];

exports.handleRequest = function(request, response) {
  var statusCode;
  var server = require('./basic-server.js');
  var headers = server.defaultCorsHeaders;

  console.log("Serving request type " + request.method + " for url " + request.url);
  var parsedUrl = request.url.split('/');
  if(parsedUrl[3] === "classes"){
    headers['Content-Type'] = "text/plain";

    if(request.method === "GET"){
      statusCode = 200;
      response.writeHead(statusCode, headers);
      if(parsedUrl[4] === "messages"){
        response.end(JSON.stringify( _results ));
      }else if(typeof parsedUrl[4] === "string"){
        var roomName = parsedUrl[4];
        var filteredMessages = _underscore.filter(_results, function(data){
          return data.roomname === roomName;
        });
        response.end(JSON.stringify(filteredMessages));
      }
    }else if(request.method === "POST"){
      statusCode = 201;
      response.writeHead(statusCode, headers);
      request.on("data", function(data){
        _results.push(JSON.parse(data));
      });
      response.end("POST request successful!");
    }else{
      response.end("You got the URL right! Please send a GET or POST request.");
    }
  }else{
    //  Return 404 status code
    statusCode = 404;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);

    response.end("404 - File Not Found");
  }
};
