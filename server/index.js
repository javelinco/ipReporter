var express = require('express');
var app = express();
var fs = require("fs");

var dataSource = __dirname + "/ipReports.json";

app.get('/api/ipReports', function (req, res) {
  fs.readFile(datasource, 'utf8', function (err, data) {
    res.end(data);
  });
});

app.post('/api/', function (req, res) {
  var jsonData = [];
  var content = fs.readFile(dataSource, 'utf8', function (err, data) {
    jsonData = JSON.parse(data);
  });
  var newRecord = {
    "mmunson": {
      "ReportDate": "1/1/2016 09:00:00",
      "InternalIps": [
        "192.168.217.1",
        "192.168.217.2"
      ],
      "ExternalIps": [
        "10.1.1.1",
        "10.1.1.2"
      ]
    }
  };
  jsonData.push(newRecord);
  fs.writeFile(dataSource, JSON.stringify(jsonData, null, 2), function (err) {
    if (err) return console.log(err);
  });
  res.json(200);
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("ipReporter listening at http://%s:%s", host, port);
});
