// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var archive = require('../helpers/archive-helpers');

exports.htmlfetcher = () => {
  var notDownloaded = [];
  archive.readListOfUrls((urlArray) => {
    urlArray.forEach((url, index) => {
      archive.isUrlArchived(url, (isArchived) => {
        if (!isArchived) {
          notDownloaded.push(url);
        }
        if (index === urlArray.length - 1) {
          archive.downloadUrls(notDownloaded);
        }
      });
    });
  });
};



exports.htmlfetcher();




/*f
In terminal type cron -e

In vi editor type:z
* * * * * /Users/student/Desktop/2016-09-web-historian/workers/htmlfetcher.js 


*/