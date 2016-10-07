var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, url, method) {

  var header = exports.headers;
  //res is just res, asset is req.url, callback is ???
  
  fs.readFile(url, 'utf8', (err, data) => {
    console.log('url is ', url);
    if (err) {
      console.log('there is an error');
      res.writeHead(404, header);
      res.end();
      //throw err;
    }
    statusCode = method === 'GET' ? 200 : 302;
    // if (data) {
    //   console.log('there is data');
    // }
    res.writeHead(statusCode, header);
    res.end('<link rel="icon" href="data:;base64,iVBORw0KGgo=">' + data);
  });
};



// As you progress, keep thinking about what helper functions you can put here!
