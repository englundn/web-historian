// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var archive = require('../helpers/archive-helpers');

var logString = '';
exports.htmlfetcher = () => {
  var notDownloaded = [];
  logString += 'inside htmlfetcher\n';
  archive.readListOfUrls((urlArray) => {
    urlArray.forEach((url, index) => {
      logString += url + '\n';
      archive.isUrlArchived(url, (isArchived) => {
        logString += 'is archived is ' + isArchived + '\n';
        if (!isArchived) {
          notDownloaded.push(url);
        }
        if (index === urlArray.length - 1) {
          logString += Array.isArray(notDownloaded) + '\n';
          archive.downloadUrls(notDownloaded);
          fs.appendFile('./htmlfetcherLog.txt', 'Current time is: ' + new Date() + '\n' + logString, (err) => {
            if (err) { throw err; }
          });
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