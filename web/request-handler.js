var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var statusCode = 404;
  if (req.method === 'GET') {
    var header = httpHelpers.headers;

    var pageContents;
    if (req.url === '/') {
      pageContents = '<input>';
      res.writeHead(200, header);
      res.end('<input>');
    } else {
      fs.readFile(archive.paths.archivedSites + '/' + req.url, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(statusCode, header);
          res.end();
          //throw err;
        }
        if (data) {
          statusCode = 200;
        }
        res.writeHead(statusCode, header);
        res.end(data, 'utf8');
      });
    } 

  } else if (req.method === 'POST') {
    var collectData = '';
    req.on('data', function(data) {
      collectData += data;
    });
    req.on('end', function() {
      res.writeHead(302, header);
      archive.addUrlToList(collectData.slice(4));
      res.end('mission accomplished');
    });
  }
  
};
