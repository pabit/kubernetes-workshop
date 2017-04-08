/**
* Copyright 2017, Google, Inc.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
var path = require('path');

var express = require('express');
var multer = require('multer');

var app = express();
var port = process.env.port || 8080;

var storage = multer.memoryStorage();
var upload = multer({ storage : storage}).single('userPhoto');

// From http://expressjs.com/en/guide/error-handling.html
function errorHandler (err, req, res, next) {
  res.status(500);
  res.render('error', { error: err }, next);
}

function sendPhoto(req, res, next) {
  const formData = { userPhoto: req.file.buffer };
  request.post({
    url:'http://annotate',
    formData: formData
  }, (err, httpResponse, body) => {
      if (err) return errorHandler(err, req, res, next);
      res.send(JSON.stringify(body), next);
  });
}

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'), next);
});

app.post('/api/photo', (req, res, next) => {
  upload(req, res, function(err) {
    if(err || !req.file) return errorHandler(err, req, res, next);
    sendPhoto(req, res, next);
  });
});

app.listen(port, _ => {
  console.log(`Working on port ${port}`);
});