#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var distDir = path.join(__dirname, '..', 'blog', 'resource');

fs.readdir(distDir, function(error, list) {
  if (error) {
    return callback(error);
  }
  var data = {};
  list.forEach(function(item) {
    if (path.extname(item) !== '.png') {
      return;
    }
    var fileDir = path.join(distDir, item);
    transform(data, item, fileDir);
  });

  fs.writeFileSync(path.join(__dirname, '.temp'), 'window._images = ' + JSON.stringify(data), 'utf8');
});

var transform = function(data, item, fileDir) {
  try {
    var fileData = fs.readFileSync(fileDir);
  } catch (e) {
    console.log(e.stack);
  }
  var fileBase64 = new Buffer(fileData).toString('base64');
  var url = 'data:image/png;base64,' + fileBase64;
  data[item] = url;
};
