var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};
var idCounter = 1;
var messages = [];

var sendResponse = function(response, data, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(response){
  sendResponse(response, messages, 200);
};

var storeData = function(request, response){
  request.on('data', function(data){
    messages.push(JSON.parse(data));
  });
  console.log(request.method);
  sendResponse(response, null, 201);
};

module.exports = handleRequest = function(request, response) {
  var httpVerb = {
    'GET': function() { collectData(response); },
    'POST': function() { storeData(request, response); },
    'OPTIONS': function() { sendResponse(response, null, 200); }
  };

  httpVerb[request.method]();
};
