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
      httpHelpers.serveAssets(res, archive.paths.archivedSites + req.url, req.method);
    } 

  } else if (req.method === 'POST') {
    var collectData = '';
    req.on('data', function(data) {
      collectData += data;
    });
    req.on('end', function() {
      var pageUrl = collectData.slice(4);
      archive.isUrlArchived(collectData, (isArchived) => {
        if (isArchived) {
          console.log('is archived');
          httpHelpers.serveAssets(res, archive.paths.archivedSites + '/' + pageUrl, req.method);
        } else {
          console.log('not archived');
          archive.isUrlInList(collectData, (inList) => {
            if (!inList) {
              console.log('is not in list');
              archive.addUrlToList(pageUrl, () => {});
            }
            httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', req.method);
          });
        }
      });
    });
  }
  
};
