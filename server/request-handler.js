var fs = require('fs');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

var messages = [];

var extend = function(obj, source) {
  for (var prop in source) {
    obj[prop] = source[prop];
  }
  return obj;
};

module.exports.loadMessages = loadMessasges = function(){
    messages = fs.readFileSync('./messages.txt', 'utf8');
    messages = messages || '[]';
    messages = JSON.parse(messages);
};

module.exports.loadFile = loadFile = function(response, fileName, contentType){
  fs.readFile(fileName, function (err, data) {
    if (err) throw err;
    var newHeaders = {};
    extend(newHeaders, headers);
    newHeaders['Content-Type'] = contentType;
    response.writeHeader(200, newHeaders);
    response.write(data);
    response.end();
  });
};

module.exports.sendResponse = sendResponse = function(response, data, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(response){
  sendResponse(response, messages, 200);
};

var storeData = function(request, response){
  var data = "";

  request.on('data', function(chunk){
    data += chunk;
  });

  request.on('end', function(){
    messages.push(JSON.parse(data));
    fs.writeFileSync('./messages.txt', JSON.stringify(messages));
  });

  sendResponse(response, null, 201);
};

module.exports.handleRequest = handleRequest = function(request, response) {
  var httpVerb = {
    'GET': function() { collectData(response); },
    'POST': function() { storeData(request, response); },
    'OPTIONS': function() { sendResponse(response, null, 200); }
  };

  httpVerb[request.method]();
};
