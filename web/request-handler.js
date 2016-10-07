var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var statusCode = 404;
  if (req.method === 'GET') {
    console.log(req.url.split('.')[1]);
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
      if (collectData.slice(0, 4) === 'url=') {
        var pageUrl = collectData.slice(4);
        archive.isUrlArchived(pageUrl, (isArchived) => {
          if (isArchived) {
            console.log('is archived');
            httpHelpers.serveAssets(res, archive.paths.archivedSites + '/' + pageUrl, req.method);
          } else {
            console.log('not archived');
            archive.isUrlInList(pageUrl, (inList) => {
              if (!inList) {
                console.log('is not in list ', pageUrl);
                archive.addUrlToList(pageUrl, () => {});
              }
              httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', req.method);
            });
          }
        });
      } else {
        
      }
    });
  }
  
};

//We only issue get requests for dependencies. We need to change how the httpHelpers.serveAssets
//function handles get requests. We have to check the suffix of the file so we send it back properly,
//and presumably change where it's directed. I think the issue we're dealing with right now is
//that we're using special logic for the index.html and loading.html pages in request-handler,
//but not extending that logic to the serveAssets function.