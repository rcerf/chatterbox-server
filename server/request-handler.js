/* These headers will allow Cross-Origin Resource Sharing.
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var fs = require("fs");
var _underscore = require("../node_modules/underscore/underscore-min.js");
var _results = [];

exports.handleRequest = function(request, response) {
  var statusCode;
  var headers = defaultCorsHeaders;

  console.log("Serving request type " + request.method + " for url " + request.url);
  var parsedUrl = request.url.split('/');
  if(parsedUrl[0].length === 0 && parsedUrl[1].length === 0){
    //["", ""]
    fs.readFile('../client/client/index.html', function(err, html){
      if (err) {
        throw err;
      }
      statusCode = 200;
      headers['Content-Type'] = "text/html";
      response.writeHead(statusCode, headers);
      response.write(html);
      response.end();
    });
  }else if(parsedUrl[1] === "classes"){

    if(request.method === "GET"){
      statusCode = 200;
      headers['Content-Type'] = "application/json";
      response.writeHead(statusCode, headers);
      if(parsedUrl[2] === "messages"){
        response.end(JSON.stringify( _results ));
      }else if(typeof parsedUrl[2] === "string"){
        var roomName = parsedUrl[2];
        var filteredMessages = _underscore.filter(_results, function(data){
          return data.roomname === roomName;
        });
        response.end(JSON.stringify(filteredMessages));
      }
    }else if(request.method === "POST"){
      statusCode = 201;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      request.on("data", function(data){
        _results.push(JSON.parse(data));
      });
      response.end("POST request successful!");
    }else{
      statusCode = 200;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      response.end("400 - Bad request");
    }
  }else{
    //  Return 404 status code
    statusCode = 404;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);

    response.end("404 - File Not Found");
  }
};



