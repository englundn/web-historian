var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) { throw err; }
    cb(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls((urlArray) => {
    cb(urlArray.indexOf(url) > -1);
  });
};

exports.addUrlToList = function(url, cb) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) {
      throw err;
    } else {
      cb();
    }
  });
};

exports.isUrlArchived = function(url, cb) {
  cb(fs.existsSync(exports.paths.archivedSites + '/' + url));
  
};

exports.downloadUrls = function(urls) {
  if (urls.length) {

    request('http://' + urls[0], 'utf8', function(error, response, body) {
      if (!error && response.statusCode === 200) {
        fs.writeFile(exports.paths.archivedSites + '/' + urls[0], body, (err) => {
          if (err) { throw err; }
        });
      }
      exports.downloadUrls(urls.slice(1));
    });
  }
};
